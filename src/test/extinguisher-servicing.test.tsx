import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ServiceAssessmentWizard } from '../components/ServiceAssessmentWizard'
import { suppliersForService } from '../data/service-suppliers'
import { analyticsServiceForPath } from '../domain/funnel'
import { defaultServiceAnswers, estimateServicePrice, qualifyService } from '../domain/service-assessment'
import { matchServiceSuppliers } from '../domain/service-matching'
import { isServiceId, type ServiceAssessmentAnswers } from '../domain/types'

const base: ServiceAssessmentAnswers = { ...defaultServiceAnswers('fire-extinguisher-servicing'), workTypes: ['water-foam'], riskSignals: ['service-due'], assetCount: 10, inspectionStatus: 'overdue-or-unknown' }
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('portable extinguisher qualification and budget', () => {
  it('identifies a maintenance trigger with a bounded unit-level service scope', () => {
    const result = qualifyService(base)
    expect(result.status).toBe('likely-relevant')
    expect(result.triggeredFactors.join(' ')).toMatch(/due|overdue/i)
    expect(result.scope.join(' ')).toMatch(/unit identity|item-level/)
    expect(result.caveats.join(' ')).toMatch(/England and Wales/)
  })

  it('calculates the sourced tariff and explicit margin deterministically', () => {
    const estimate = estimateServicePrice(base)
    expect(estimate.factors.map((item) => item.amount)).toEqual([15, 75])
    expect([estimate.low, estimate.high]).toEqual([67, 113])
    expect(estimate.assumptions.join(' ')).toMatch(/Suffolk|25%/)
    expect(estimateServicePrice(base)).toEqual(estimate)
  })

  it.each([
    { workTypes: ['service-free'] }, { workTypes: ['unknown-units'] }, { sites: 2 }, { secondaryCount: 1 },
    { riskSignals: ['used-damaged'] }, { riskSignals: ['extended-due'] }, { riskSignals: ['changed-risk'] },
    { riskSignals: ['unknown-history'] }, { inspectionStatus: 'new-system' as const },
    { assetCount: 0 }, { assetCount: Number.NaN }, { assetCount: -4 },
  ])('withholds the basic tariff for non-routine brief %j', (change) => {
    const estimate = estimateServicePrice({ ...base, ...change })
    expect([estimate.low, estimate.high]).toEqual([0, 0])
    expect(estimate.factors).toEqual([])
    expect(estimate.assumptions.join(' ')).toMatch(/quotation|No zero-cost/)
  })

  it('does not call a P50 annual contractor service required', () => {
    const result = qualifyService({ ...base, workTypes: ['service-free'] })
    expect(result.status).toBe('may-be-relevant')
    expect(result.caveats.join(' ')).toMatch(/Do not assume/)
  })

  it.each(['scotland', 'northern-ireland'] as const)('keeps the England/Wales conclusion out of %s', (region) => {
    expect(qualifyService({ ...base, region }).status).toBe('may-be-relevant')
  })

  it('does not price or scope a service on absent units even with contradictory service signals', () => {
    for (const riskSignals of [['no-concern'], ['service-due'], ['extended-due']]) {
      const answers = { ...base, workTypes: ['no-installed'], riskSignals }
      const result = qualifyService(answers)
      expect(result.status).toBe('no-obvious-trigger')
      expect(result.scope.join(' ')).toMatch(/fire risk assessment/)
      expect(result.scope.join(' ')).not.toMatch(/Inspect condition/)
      expect(estimateServicePrice(answers).low).toBe(0)
    }
  })

  it('returns three evidenced providers with stable matching and route attribution', () => {
    const suppliers = suppliersForService(base.serviceId)
    const matches = matchServiceSuppliers(suppliers, base, qualifyService(base))
    expect(matches).toHaveLength(3)
    expect(matches).toEqual(matchServiceSuppliers(suppliers, base, qualifyService(base)))
    expect(suppliers.every((supplier) => supplier.evidence.every((item) => item.sourceUrl.startsWith('https://') && item.checkedOn === '2026-10-04'))).toBe(true)
    expect(analyticsServiceForPath('/fire-extinguisher-servicing/cost')).toBe(base.serviceId)
    expect(isServiceId(base.serviceId)).toBe(true)
  })
})

async function completeWizard(workType: string, signal: string) {
  const user = userEvent.setup()
  render(<ServiceAssessmentWizard serviceId="fire-extinguisher-servicing" />)
  await user.selectOptions(screen.getByLabelText('Business or industry'), 'manufacturing')
  await user.click(screen.getByText(workType))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.click(screen.getByText(signal))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.selectOptions(screen.getByLabelText('Approximate site size'), 'small')
  await user.selectOptions(screen.getByLabelText('Fire risk assessment, inventory and service records'), 'partial')
  await user.selectOptions(screen.getByLabelText('Current extinguisher service position'), 'overdue-or-unknown')
  await user.selectOptions(screen.getByLabelText('Reason for commissioning'), 'routine')
  await user.selectOptions(screen.getByLabelText('Region'), 'south-east')
  await user.selectOptions(screen.getByLabelText('Desired timescale'), 'one-month')
  await user.click(screen.getByRole('button', { name: 'See my result' }))
  return user
}

describe('portable extinguisher buyer journey', () => {
  it('captures the qualified brief and consent through the enquiry API', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetch)
    const user = await completeWizard('Traditional water or foam units', 'Basic service due or overdue')
    expect(screen.getByRole('heading', { name: /Fire extinguisher servicing is likely/ })).toBeInTheDocument()
    expect(screen.getAllByText(/Evidence found/)).toHaveLength(3)
    await user.click(screen.getByRole('button', { name: 'Continue with my project brief' }))
    await user.type(screen.getByLabelText('Company name'), 'Test company')
    await user.type(screen.getByLabelText('Contact name'), 'Test buyer')
    await user.type(screen.getByLabelText('Business email'), 'buyer@example.invalid')
    await user.click(screen.getByRole('checkbox', { name: /I consent/ }))
    await user.click(screen.getByRole('button', { name: 'Send project brief for review' }))
    expect(screen.getByText(/project brief has been received/)).toBeInTheDocument()
    const request = fetch.mock.calls.find(([url]) => url === '/api/enquiries')
    expect(request).toBeDefined()
    const payload = JSON.parse(request![1].body)
    expect(payload).toMatchObject({ serviceId: base.serviceId, consent: true, status: 'received', qualification: { status: 'likely-relevant' }, answers: { workTypes: ['water-foam'], region: 'south-east' } })
    expect(payload.matchedSupplierIds).toHaveLength(3)
    expect(payload.estimate.low).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.queryByText(/project brief has been received/)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Who should we contact about this project?' })).not.toBeInTheDocument()
  })

  it('shows provision review without a tariff, provider list or service quote for absent units', async () => {
    await completeWizard('No portable extinguishers present', 'No listed issue')
    expect(screen.getByRole('heading', { name: 'Review portable firefighting provision before buying a service' })).toBeInTheDocument()
    expect(screen.queryByText(/Indicative planning range|Illustrative basic-service budget/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Evidence found/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continue with my project brief' })).not.toBeInTheDocument()
  })

  it('shows bespoke pricing for service-free units without suggesting a free service', async () => {
    await completeWizard('P50 or other service-free units', 'Basic service due or overdue')
    expect(screen.getByText('Bespoke price required')).toBeInTheDocument()
    expect(screen.queryByText(/£0/)).not.toBeInTheDocument()
    expect(screen.getByText(/Do not assume they require a traditional annual contractor service/)).toBeInTheDocument()
  })
})
