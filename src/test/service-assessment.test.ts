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

describe('asbestos survey qualification and pricing', () => {
  it('treats planned refurbishment in pre-2000 premises as likely relevant', () => {
    const answers = { ...defaultServiceAnswers('asbestos'), workTypes: ['refurbishment'], riskSignals: ['built-before-2000', 'planned-disturbance'], assetCount: 2, secondaryCount: 8 }
    const result = qualifyService(answers)
    const estimate = estimateServicePrice(answers, result)
    expect(result.status).toBe('likely-relevant')
    expect(result.scope.join(' ')).toMatch(/refurbishment|intrusive/i)
    expect(estimate.factors).toEqual(expect.arrayContaining([expect.objectContaining({ amount: SERVICE_PRICE_MODELS.asbestos.intrusiveSurvey })]))
  })

  it('keeps an uncertain property review non-definitive', () => {
    expect(qualifyService({ ...defaultServiceAnswers('asbestos'), workTypes: ['property-acquisition'], riskSignals: ['unknown-building-age'] }).status).toBe('may-be-relevant')
  })
})

describe('fire risk assessment qualification and pricing', () => {
  it('recognises covered premises and adds the sleeping-risk allowance', () => {
    const answers = { ...defaultServiceAnswers('fire-risk-assessment'), workTypes: ['sleeping-accommodation'], riskSignals: ['sleeping-risk', 'vulnerable-occupants'], assetCount: 3, secondaryCount: 2 }
    const result = qualifyService(answers)
    const estimate = estimateServicePrice(answers, result)
    expect(result.status).toBe('likely-relevant')
    expect(result.scope.join(' ')).toMatch(/people at risk|escape/i)
    expect(estimate.factors).toEqual(expect.arrayContaining([expect.objectContaining({ amount: SERVICE_PRICE_MODELS['fire-risk-assessment'].sleepingOrVulnerable })]))
  })

  it('does not treat an uncertain premises boundary as an exemption', () => {
    expect(qualifyService({ ...defaultServiceAnswers('fire-risk-assessment'), workTypes: ['unknown-premises'], riskSignals: ['unknown-fire-scope'] }).status).toBe('may-be-relevant')
  })

  it('does not invent a fire-safety-order trigger for a private home only', () => {
    expect(qualifyService({ ...defaultServiceAnswers('fire-risk-assessment'), workTypes: ['none-private-home'], riskSignals: ['no-complex-signals'], documentationStatus: 'available', inspectionStatus: 'in-date' }).status).toBe('no-obvious-trigger')
  })
})

describe('legionella qualification and pricing', () => {
  it('recognises a managed hot and cold water system and prices visible system factors', () => {
    const answers = { ...defaultServiceAnswers('legionella'), workTypes: ['commercial-hot-cold'], riskSignals: ['stored-hot-water', 'showers-spray'], assetCount: 18, secondaryCount: 2 }
    const result = qualifyService(answers)
    const estimate = estimateServicePrice(answers, result)
    expect(result.status).toBe('likely-relevant')
    expect(result.scope.join(' ')).toMatch(/schematic|control scheme/i)
    expect(estimate.factors).toEqual(expect.arrayContaining([expect.objectContaining({ amount: SERVICE_PRICE_MODELS.legionella.perOutlet * 18 })]))
  })

  it('keeps an unknown water-system boundary non-definitive', () => {
    expect(qualifyService({ ...defaultServiceAnswers('legionella'), workTypes: ['unknown-water-system'], riskSignals: ['unknown-controls'] }).status).toBe('may-be-relevant')
  })

  it('does not create a trigger where no controlled water system is identified', () => {
    expect(qualifyService({ ...defaultServiceAnswers('legionella'), workTypes: ['none-no-water-system'], riskSignals: ['no-complex-water-signals'], documentationStatus: 'available', inspectionStatus: 'in-date' }).status).toBe('no-obvious-trigger')
  })
})

describe('PAT testing qualification and pricing', () => {
  it('recommends combined inspection and testing for moved earthed equipment in a harsh environment', () => {
    const answers = { ...defaultServiceAnswers('pat-testing'), workTypes: ['tools-construction'], riskSignals: ['frequently-moved', 'harsh-environment', 'earthed-equipment'], assetCount: 80, secondaryCount: 4 }
    const result = qualifyService(answers)
    const estimate = estimateServicePrice(answers, result)
    expect(result.status).toBe('likely-relevant')
    expect(result.scope).toContain('Define user checks, formal visual inspection and combined test requirements by risk')
    expect(estimate.factors).toEqual(expect.arrayContaining([expect.objectContaining({ amount: SERVICE_PRICE_MODELS['pat-testing'].perItem * 80 })]))
  })

  it('does not turn stable low-risk office equipment into an automatic annual testing duty', () => {
    const result = qualifyService({ ...defaultServiceAnswers('pat-testing'), workTypes: ['office-it'], riskSignals: ['no-higher-risk-signals'], documentationStatus: 'available', inspectionStatus: 'in-date' })
    expect(result.status).toBe('may-be-relevant')
    expect(result.caveats.join(' ')).toContain('user checks')
  })

  it('returns no obvious testing trigger when no controlled equipment is identified', () => {
    expect(qualifyService({ ...defaultServiceAnswers('pat-testing'), workTypes: ['none-controlled-equipment'], riskSignals: ['no-higher-risk-signals'], documentationStatus: 'available', inspectionStatus: 'in-date' }).status).toBe('no-obvious-trigger')
  })
})

describe('TM44 qualification and pricing', () => {
  it('recognises an air-conditioning system above the combined threshold', () => {
    const answers = { ...defaultServiceAnswers('tm44'), workTypes: ['vrf-vrv'], riskSignals: ['combined-over-12kw'], assetCount: 8, secondaryCount: 1 }
    const result = qualifyService(answers)
    const estimate = estimateServicePrice(answers, result)
    expect(result.status).toBe('likely-relevant')
    expect(result.scope.join(' ')).toMatch(/effective rated output|lodg/i)
    expect(estimate.factors).toEqual(expect.arrayContaining([expect.objectContaining({ amount: SERVICE_PRICE_MODELS.tm44.perUnit * 8 })]))
  })

  it('keeps unknown capacity non-definitive', () => {
    expect(qualifyService({ ...defaultServiceAnswers('tm44'), workTypes: ['split-multisplit'], riskSignals: ['unknown-capacity'] }).status).toBe('may-be-relevant')
  })

  it('does not create a trigger where there is no air conditioning', () => {
    expect(qualifyService({ ...defaultServiceAnswers('tm44'), workTypes: ['none-air-conditioning'], riskSignals: ['no-over-12kw'], documentationStatus: 'available', inspectionStatus: 'in-date' }).status).toBe('no-obvious-trigger')
  })
})

describe('generic industrial service invariants', () => {
  for (const serviceId of ['lev', 'pressure-systems', 'loler', 'asbestos', 'fire-risk-assessment', 'legionella', 'pat-testing', 'tm44'] as const) {
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
    const suppliers = ['lev', 'pressure-systems', 'loler', 'asbestos', 'fire-risk-assessment', 'legionella', 'pat-testing', 'tm44'].flatMap((serviceId) => suppliersForService(serviceId as 'lev' | 'pressure-systems' | 'loler' | 'asbestos' | 'fire-risk-assessment' | 'legionella' | 'pat-testing' | 'tm44'))
    for (const supplier of suppliers) {
      expect(supplier.evidence.length).toBeGreaterThan(0)
      expect(supplier.evidence.every((item) => item.sourceUrl.startsWith('https://') && item.checkedOn === supplier.lastVerifiedDate)).toBe(true)
      expect(['provider-source-checked', 'partially-verified']).toContain(supplier.verificationStatus)
    }
  })
})
