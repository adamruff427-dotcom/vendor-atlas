import { describe, expect, it } from 'vitest'
import { suppliersForService } from '../data/service-suppliers'
import { defaultServiceAnswers, estimateServicePrice, qualifyService, SERVICE_PRICE_MODELS, serviceDefinitions } from '../domain/service-assessment'
import { matchServiceSuppliers } from '../domain/service-matching'

describe('LEV qualification and pricing', () => {
  it('identifies source-capture extraction as likely relevant and scopes a real TExT', () => {
    const answers = { ...defaultServiceAnswers('lev'), workTypes: ['welding-fume'], riskSignals: ['on-tool'], documentationStatus: 'partial' as const }
    const result = qualifyService(answers)
    expect(result.status).toBe('likely-relevant')
    expect(result.triggeredFactors.join(' ')).toMatch(/Welding|On-tool/)
    expect(result.scope.join(' ')).toMatch(/measurements|control effectiveness/i)
  })

  it('keeps general-ventilation or unknown answers non-definitive', () => {
    const noTrigger = qualifyService({ ...defaultServiceAnswers('lev'), workTypes: ['none-known'], riskSignals: ['unknown-system'], documentationStatus: 'available', inspectionStatus: 'in-date' })
    expect(noTrigger.status).toBe('may-be-relevant')
    expect(noTrigger.caveats.join(' ')).toMatch(/not a local exhaust ventilation/i)
  })
})

describe('PSSR qualification and pricing', () => {
  it('treats a compressed-gas threshold as a likely written-scheme signal', () => {
    const answers = { ...defaultServiceAnswers('pressure-systems'), workTypes: ['compressed-air'], riskSignals: ['gas-over-half-bar'], inspectionStatus: 'none' as const, assetCount: 2, secondaryCount: 3 }
    const result = qualifyService(answers)
    expect(result.status).toBe('likely-relevant')
    expect(result.scope.join(' ')).toMatch(/written scheme/i)
    expect(estimateServicePrice(answers, result).factors).toEqual(expect.arrayContaining([expect.objectContaining({ amount: SERVICE_PRICE_MODELS['pressure-systems'].newWrittenScheme })]))
  })

  it('does not classify unknown fluid data as a legal exemption', () => {
    expect(qualifyService({ ...defaultServiceAnswers('pressure-systems'), workTypes: ['unknown-pressure'], riskSignals: ['unknown-fluid'] }).status).toBe('may-be-relevant')
  })
})

describe('LOLER qualification and pricing', () => {
  it('recognises people-lifting equipment and adds the visible allowance', () => {
    const answers = { ...defaultServiceAnswers('loler'), workTypes: ['patient-hoist'], riskSignals: ['lifts-people'], assetCount: 3, secondaryCount: 6 }
    const result = qualifyService(answers)
    const estimate = estimateServicePrice(answers, result)
    expect(result.status).toBe('likely-relevant')
    expect(estimate.factors).toEqual(expect.arrayContaining([expect.objectContaining({ amount: SERVICE_PRICE_MODELS.loler.peopleLiftingItem * 3 })]))
  })

  it('returns a cautious state for unclassified lifting equipment', () => {
    expect(qualifyService({ ...defaultServiceAnswers('loler'), workTypes: ['unknown-lifting'], riskSignals: ['unknown-use'] }).status).toBe('may-be-relevant')
  })
})

describe('generic industrial service invariants', () => {
  for (const serviceId of ['lev', 'pressure-systems', 'loler'] as const) {
    it(`${serviceId} stays deterministic, positive and evidence-linked`, () => {
      const definition = serviceDefinitions[serviceId]
      const answers = { ...defaultServiceAnswers(serviceId), workTypes: [definition.workOptions[0].value], riskSignals: [definition.signalOptions[0].value], assetCount: 4, secondaryCount: 8, sites: 2 }
      const result = qualifyService(answers)
      const first = estimateServicePrice(answers, result)
      expect(estimateServicePrice(answers, result)).toEqual(first)
      expect(first.low).toBeGreaterThan(0)
      expect(first.high).toBeGreaterThan(first.low)
      expect(first.factors.every((factor) => factor.amount >= 0)).toBe(true)
      expect(definition.primaryLinks.length).toBeGreaterThanOrEqual(3)
      expect(definition.priceEvidence.length).toBe(3)
    })

    it(`${serviceId} returns three deterministic evidence-backed matches`, () => {
      const definition = serviceDefinitions[serviceId]
      const answers = { ...defaultServiceAnswers(serviceId), workTypes: [definition.workOptions[0].value], riskSignals: [definition.signalOptions[0].value] }
      const matches = matchServiceSuppliers(suppliersForService(serviceId), answers, qualifyService(answers))
      expect(matches).toHaveLength(3)
      expect(matches[0].score).toBeGreaterThanOrEqual(matches[1].score)
      expect(matches.every((match) => match.supplier.evidence.length > 0 && match.reasons.length > 0)).toBe(true)
    })
  }

  it('retains source URLs and explicit evidence status for every new supplier', () => {
    const suppliers = ['lev', 'pressure-systems', 'loler'].flatMap((serviceId) => suppliersForService(serviceId as 'lev' | 'pressure-systems' | 'loler'))
    for (const supplier of suppliers) {
      expect(supplier.evidence.length).toBeGreaterThan(0)
      expect(supplier.evidence.every((item) => item.sourceUrl.startsWith('https://') && item.checkedOn === supplier.lastVerifiedDate)).toBe(true)
      expect(['provider-source-checked', 'partially-verified']).toContain(supplier.verificationStatus)
    }
  })
})
