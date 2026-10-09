import { describe, expect, it } from 'vitest'
import { suppliersForService } from '../data/service-suppliers'
import { matchServiceSuppliers } from '../domain/service-matching'
import { defaultServiceAnswers, estimateServicePrice, qualifyService } from '../domain/service-assessment'
import { hasFaceFitConflict, isActionableFaceFitBrief } from '../domain/rpe-face-fit-testing'
import type { ServiceAssessmentAnswers } from '../domain/types'

function standardBrief(overrides: Partial<ServiceAssessmentAnswers> = {}): ServiceAssessmentAnswers {
  return {
    ...defaultServiceAnswers('rpe-face-fit-testing'),
    workTypes: ['half-mask'],
    riskSignals: ['qualitative'],
    assetCount: 5,
    secondaryCount: 1,
    sites: 1,
    documentationStatus: 'partial',
    inspectionStatus: 'overdue-or-unknown',
    projectReason: 'routine',
    ...overrides,
  }
}

describe('RPE face-fit qualification, pricing and matching', () => {
  it('shows the signals and a bounded, testable scope for an outstanding selected facepiece', () => {
    const answers = standardBrief()
    const result = qualifyService(answers)
    expect(result.status).toBe('likely-relevant')
    expect(result.triggeredFactors).toEqual(expect.arrayContaining([
      expect.stringContaining('Reusable half mask'),
      expect.stringContaining('current fit-test record'),
      expect.stringContaining('records are missing'),
    ]))
    expect(result.scope).toEqual(expect.arrayContaining([
      expect.stringContaining('each wearer-and-facepiece combination'),
      expect.stringContaining('individual record'),
    ]))
    expect(result.caveats.join(' ')).toMatch(/not a COSHH assessment/)
    expect(isActionableFaceFitBrief(answers, result)).toBe(true)
  })

  it('uses the exact published one-site package tier and withholds a number beyond its evidence boundary', () => {
    expect(estimateServicePrice(standardBrief()).low).toBe(375)
    expect(estimateServicePrice(standardBrief({ assetCount: 8 })).high).toBe(375)
    expect(estimateServicePrice(standardBrief({ assetCount: 9 })).low).toBe(650)
    expect(estimateServicePrice(standardBrief({ assetCount: 16 })).high).toBe(650)
    for (const answers of [
      standardBrief({ assetCount: 17 }),
      standardBrief({ sites: 2 }),
      standardBrief({ workTypes: ['other-tight-fitting'] }),
      standardBrief({ workTypes: ['full-face'], riskSignals: ['method-not-selected'] }),
    ]) {
      const estimate = estimateServicePrice(answers)
      expect(estimate).toMatchObject({ low: 0, high: 0, factors: [] })
      expect(estimate.assumptions.join(' ')).toMatch(/quotation is required/)
    }
  })

  it('matches only evidenced methods, geography, sector and complexity, in a stable non-paid order', () => {
    const answers = standardBrief()
    const result = qualifyService(answers)
    const first = matchServiceSuppliers(suppliersForService(answers.serviceId), answers, result)
    const second = matchServiceSuppliers(suppliersForService(answers.serviceId), answers, result)
    expect(first).toHaveLength(3)
    expect(first.map((match) => match.supplier.id)).toEqual(second.map((match) => match.supplier.id))
    expect(first.map((match) => match.supplier.name)).toEqual(['RPE Face Fit Solutions Ltd', 'Velocity Safety', 'We Fit RPE'])
    expect(first.every((match) => match.supplier.evidence.length > 0 && match.reasons.some((reason) => reason.includes('qualitative')))).toBe(true)
    expect(first.every((match) => match.gaps.some((gap) => gap.includes('exact facepiece')))).toBe(true)
    const northern = matchServiceSuppliers(suppliersForService(answers.serviceId), { ...answers, region: 'north' }, result)
    expect(northern).toHaveLength(3)
    expect(northern.some((match) => match.supplier.id === 'safety-inspectors-rpe-face-fit')).toBe(true)
    expect(matchServiceSuppliers(suppliersForService(answers.serviceId), { ...answers, region: 'northern-ireland' }, result))
      .toHaveLength(3)
    const complexAnswers = standardBrief({ sites: 2 })
    const complexResult = qualifyService(complexAnswers)
    const complexMatches = matchServiceSuppliers(suppliersForService(complexAnswers.serviceId), complexAnswers, complexResult)
    expect(complexMatches.map((match) => match.supplier.id)).toEqual(['velocity-safety-rpe-fit-testing'])
  })

  it('does not turn unknown or contradictory answers into an actionable quote result', () => {
    const unknownMethod = standardBrief({ riskSignals: ['method-not-selected'] })
    const unknownResult = qualifyService(unknownMethod)
    expect(unknownResult.status).toBe('may-be-relevant')
    expect(isActionableFaceFitBrief(unknownMethod, unknownResult)).toBe(false)
    expect(matchServiceSuppliers(suppliersForService(unknownMethod.serviceId), unknownMethod, unknownResult)).toEqual([])
    expect(estimateServicePrice(unknownMethod)).toMatchObject({ low: 0, high: 0 })

    const contradictory = standardBrief({ workTypes: ['no-tight-fitting'], riskSignals: ['quantitative'], assetCount: 0 })
    const contradictoryResult = qualifyService(contradictory)
    expect(hasFaceFitConflict(contradictory)).toBe(true)
    expect(contradictoryResult.status).toBe('may-be-relevant')
    expect(isActionableFaceFitBrief(contradictory, contradictoryResult)).toBe(false)
    expect(matchServiceSuppliers(suppliersForService(contradictory.serviceId), contradictory, contradictoryResult)).toEqual([])
    expect(estimateServicePrice(contradictory)).toMatchObject({ low: 0, high: 0 })

    const noTightFacepiece = standardBrief({ workTypes: ['no-tight-fitting'], riskSignals: [], assetCount: 0, secondaryCount: 0 })
    const noFacepieceResult = qualifyService(noTightFacepiece)
    expect(noFacepieceResult.status).toBe('no-obvious-trigger')
    expect(isActionableFaceFitBrief(noTightFacepiece, noFacepieceResult)).toBe(false)
    expect(estimateServicePrice(noTightFacepiece)).toMatchObject({ low: 0, high: 0 })
  })
})
