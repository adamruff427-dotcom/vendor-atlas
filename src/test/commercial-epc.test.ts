import { describe, expect, it } from 'vitest'
import { suppliersForService } from '../data/service-suppliers'
import { defaultServiceAnswers, estimateServicePrice, qualifyService } from '../domain/service-assessment'
import { isActionableCommercialEpcBrief } from '../domain/commercial-epc'
import { matchServiceSuppliers } from '../domain/service-matching'

function likelyLondonBrief() {
  return {
    ...defaultServiceAnswers('commercial-epc'),
    workTypes: ['commercial-sale'],
    riskSignals: ['fixed-heating'],
    region: 'london' as const,
    inspectionStatus: 'none' as const,
  }
}

describe('commercial EPC decision support', () => {
  it('treats a sale with no certificate and fixed building services as a strong procurement signal', () => {
    const result = qualifyService(likelyLondonBrief())
    expect(result.status).toBe('likely-relevant')
    expect(result.triggeredFactors.join(' ')).toMatch(/sale|current EPC|heating/i)
    expect(result.scope.join(' ')).toMatch(/property|register|services|certificate/i)
    expect(result.caveats.join(' ')).toMatch(/not a definitive legal decision/i)
    expect(isActionableCommercialEpcBrief(likelyLondonBrief(), result)).toBe(true)
  })

  it('does not create a new appointment signal for occupation alone or an apparently current certificate', () => {
    const occupation = { ...defaultServiceAnswers('commercial-epc'), workTypes: ['commercial-occupancy-only'], riskSignals: ['fixed-heating'] }
    const current = { ...likelyLondonBrief(), inspectionStatus: 'in-date' as const }
    expect(qualifyService(occupation).status).toBe('no-obvious-trigger')
    expect(qualifyService(current).status).toBe('no-obvious-trigger')
    expect(estimateServicePrice(current).low).toBe(0)
  })

  it('keeps separate jurisdictions, unknown services and contradictory answers non-definitive', () => {
    const scotland = { ...likelyLondonBrief(), region: 'scotland' as const }
    const unknown = { ...likelyLondonBrief(), riskSignals: ['unknown-services'] }
    const contradictory = { ...likelyLondonBrief(), riskSignals: ['fixed-heating', 'no-fixed-services'] }
    for (const answers of [scotland, unknown, contradictory]) {
      const result = qualifyService(answers)
      expect(result.status).toBe('may-be-relevant')
      expect(isActionableCommercialEpcBrief(answers, result)).toBe(false)
      expect(estimateServicePrice(answers, result).low).toBe(0)
      expect(matchServiceSuppliers(suppliersForService('commercial-epc'), answers, result)).toEqual([])
    }
  })

  it('uses only the published, inclusive-VAT London floor-area bands and withholds extrapolation', () => {
    const expected = [[1, 260], [50, 260], [51, 330], [100, 330], [101, 409], [250, 409]]
    for (const [area, amount] of expected) {
      const quote = estimateServicePrice({ ...likelyLondonBrief(), assetCount: area })
      expect([quote.low, quote.high]).toEqual([amount, amount])
      expect(quote.factors[0].label).toMatch(/including VAT/i)
    }
    const tooLarge = estimateServicePrice({ ...likelyLondonBrief(), assetCount: 251 })
    const wrongRegion = estimateServicePrice({ ...likelyLondonBrief(), region: 'midlands' })
    const extraSystems = estimateServicePrice({ ...likelyLondonBrief(), size: 'small' })
    expect([tooLarge.low, tooLarge.high]).toEqual([0, 0])
    expect(tooLarge.assumptions.join(' ')).toMatch(/no fixed tariff/i)
    expect([wrongRegion.low, wrongRegion.high]).toEqual([0, 0])
    expect([extraSystems.low, extraSystems.high]).toEqual([0, 0])
  })

  it('matches only evidenced regional providers and does not paid-rank them', () => {
    const answers = likelyLondonBrief()
    const result = qualifyService(answers)
    const matches = matchServiceSuppliers(suppliersForService('commercial-epc'), answers, result)
    expect(matches.map((item) => item.supplier.name)).toEqual([
      'Landlord Compliance London Ltd', 'Primecert', 'Team EPC',
    ])
    expect(matches.every((item) => item.reasons.some((reason) => /provider-source/i.test(reason)))).toBe(true)
    expect(matches.every((item) => item.gaps.some((gap) => /accreditation|insurance/i.test(gap)))).toBe(true)
  })

  it('withholds the simple tariff for complex work and filters providers to stated complexity', () => {
    const answers = { ...likelyLondonBrief(), size: 'large' as const, riskSignals: ['fixed-heating', 'multi-let'], secondaryCount: 4 }
    const result = qualifyService(answers)
    const matches = matchServiceSuppliers(suppliersForService('commercial-epc'), answers, result)
    expect(result.complexity).toBe('complex')
    expect(estimateServicePrice(answers, result).low).toBe(0)
    expect(matches.map((item) => item.supplier.name)).toEqual(['Primecert', 'Team EPC'])
  })
})
