import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defaultServiceAnswers, estimateServicePrice, qualifyService } from '../domain/service-assessment'
import { suppliersForService } from '../data/service-suppliers'
import { matchServiceSuppliers } from '../domain/service-matching'
import { analyticsServiceForPath } from '../domain/funnel'
import { ServiceAssessmentWizard } from '../components/ServiceAssessmentWizard'
import type { ServiceAssessmentAnswers } from '../domain/types'

const base: ServiceAssessmentAnswers = { ...defaultServiceAnswers('fire-door-inspection'), workTypes: ['commercial', 'communal-doors'], riskSignals: ['fra-action'], assetCount: 10, secondaryCount: 2, region: 'south-east' }
afterEach(() => { cleanup(); vi.unstubAllGlobals() })
describe('fire door decision and deterministic pricing', () => {
  it('scopes specialist work for a documented action without asserting fire resistance', () => {
    const result = qualifyService(base)
    expect(result.status).toBe('likely-relevant')
    expect(result.scope.join(' ')).toMatch(/non-intrusive|limitations/)
    expect(result.caveats.join(' ')).toMatch(/cannot prove fire resistance/)
  })
  it('does not turn the England residential checking duty into a paid survey mandate', () => {
    const result = qualifyService({ ...base, workTypes: ['residential-common', 'communal-doors'], riskSignals: ['over-11m', 'routine-only'] })
    expect(result.status).toBe('may-be-relevant')
    expect(result.triggeredFactors.join(' ')).toMatch(/quarterly communal checks/)
    expect(result.triggeredFactors.join(' ')).toMatch(/does not establish a need for a paid specialist/)
  })
  it.each(['wales', 'scotland', 'northern-ireland', 'uk-wide'] as const)('does not apply regulation 10 to %s', region => {
    const result = qualifyService({ ...base, region, workTypes: ['residential-common'], riskSignals: ['over-11m'] })
    expect(result.triggeredFactors.join(' ')).not.toMatch(/quarterly communal checks/)
  })
  it('does not infer a residential duty for commercial premises or uncertain height', () => {
    for (const change of [{ workTypes: ['commercial'] }, { workTypes: ['residential-common'], riskSignals: ['over-11m', 'height-unknown'] }]) {
      expect(qualifyService({ ...base, riskSignals: ['over-11m'], ...change }).triggeredFactors.join(' ')).not.toMatch(/quarterly communal checks/)
    }
  })
  it('calculates counts, minimum and possible call-out without invented variation', () => {
    expect(estimateServicePrice(base)).toMatchObject({ low: 250, high: 300 })
    expect(estimateServicePrice({ ...base, assetCount: 1, secondaryCount: 0 })).toMatchObject({ low: 200, high: 250 })
    expect(estimateServicePrice({ ...base, assetCount: 0, secondaryCount: 10 })).toMatchObject({ low: 250, high: 300 })
    expect(estimateServicePrice(base)).toEqual(estimateServicePrice(base))
  })
  it.each([{ workTypes: ['flat-entrance'] }, { workTypes: ['unknown-doors'] }, { workTypes: ['sleeping-care'] }, { riskSignals: ['routine-only'] }, { riskSignals: ['missing-evidence'] }, { sites: 2 }, { assetCount: 49, secondaryCount: 2 }, { assetCount: Number.NaN }, { assetCount: -1 }, { assetCount: 0, secondaryCount: 0 }])('withholds unsupported prices for %j', change => {
    expect(estimateServicePrice({ ...base, ...change })).toMatchObject({ low: 0, high: 0, factors: [] })
  })
  it('keeps absent-door and contradictory states out of inspection scope and prices', () => {
    const a = { ...base, workTypes: ['no-installed', 'communal-doors'], riskSignals: ['defects'] }
    expect(qualifyService(a)).toMatchObject({ status: 'no-obvious-trigger' })
    expect(qualifyService(a).scope.join(' ')).not.toMatch(/Inspect visible/)
    expect(estimateServicePrice(a)).toMatchObject({ low: 0, high: 0 })
  })
  it('matches three source-linked providers deterministically and attributes the route', () => {
    const suppliers = suppliersForService(base.serviceId)
    const matches = matchServiceSuppliers(suppliers, base, qualifyService(base))
    expect(matches).toHaveLength(3)
    expect(matches).toEqual(matchServiceSuppliers(suppliers, base, qualifyService(base)))
    expect(suppliers.every(s => s.evidence.every(e => e.checkedOn === '2026-10-05' && e.sourceUrl.startsWith('https://')))).toBe(true)
    const north = matchServiceSuppliers(suppliers, { ...base, region: 'north' }, qualifyService(base))
    expect(north.find(m => m.supplier.id === 'gatwick-fire-doors')?.gaps.join(' ')).toMatch(/coverage/)
    expect(analyticsServiceForPath('/fire-door-inspection/cost')).toBe(base.serviceId)
  })
})

async function wizard(work: string, signal: string) {
  const user = userEvent.setup()
  render(<ServiceAssessmentWizard serviceId="fire-door-inspection" />)
  await user.selectOptions(screen.getByLabelText('Business or industry'), 'other')
  await user.click(screen.getByText(work))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.click(screen.getByText(signal))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.selectOptions(screen.getByLabelText('Approximate site size'), 'small')
  await user.selectOptions(screen.getByLabelText('Fire risk assessment, door schedule and previous reports'), 'partial')
  await user.selectOptions(screen.getByLabelText('Current door-check position'), 'overdue-or-unknown')
  await user.selectOptions(screen.getByLabelText('Reason for commissioning'), 'routine')
  await user.selectOptions(screen.getByLabelText('Region'), 'south-east')
  await user.selectOptions(screen.getByLabelText('Desired timescale'), 'one-month')
  await user.click(screen.getByRole('button', { name: 'See my result' }))
  return user
}
describe('fire door buyer journey', () => {
  it('captures a specialist brief with source-based estimate and consent', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true }); vi.stubGlobal('fetch', fetch)
    const user = await wizard('Commercial or workplace premises', 'Fire risk assessment requests a door survey')
    expect(screen.getByRole('heading', { name: 'Specialist fire door inspection is likely to be relevant' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue with my project brief' }))
    await user.type(screen.getByLabelText('Company name'), 'Fixture business')
    await user.type(screen.getByLabelText('Contact name'), 'Fixture buyer')
    await user.type(screen.getByLabelText('Business email'), 'test@example.invalid')
    await user.click(screen.getByRole('checkbox', { name: /I consent/ }))
    await user.click(screen.getByRole('button', { name: 'Send project brief for review' }))
    const call = fetch.mock.calls.find(([url]) => url === '/api/enquiries')
    const payload = JSON.parse(call![1].body)
    expect(payload).toMatchObject({ serviceId: 'fire-door-inspection', consent: true, qualification: { status: 'likely-relevant' }, estimate: { low: 200, high: 250 } })
    expect(payload.matchedSupplierIds).toHaveLength(3)
  })
  it('offers routine-check guidance without a paid inspection CTA or numeric tariff', async () => {
    await wizard('Shared areas in a block of flats', 'Routine checks only, with no known faults')
    expect(screen.getByRole('heading', { name: /paid specialist is not automatically needed/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continue with my project brief' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Evidence found/)).not.toBeInTheDocument()
    expect(screen.queryByText('Indicative planning range')).not.toBeInTheDocument()
  })
  it('does not sell existing-door inspections when none are identified', async () => {
    await wizard('No fire doors identified', 'Damage, gaps or poor closing reported')
    expect(screen.getByRole('heading', { name: 'Confirm fire door provision in the fire risk assessment' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continue with my project brief' })).not.toBeInTheDocument()
  })
})
