import { describe, expect, it } from 'vitest'
import { suppliersForService } from '../data/service-suppliers'
import { defaultServiceAnswers, estimateServicePrice, qualifyService } from '../domain/service-assessment'
import { matchServiceSuppliers } from '../domain/service-matching'

const readyBrief = (overrides: Partial<ReturnType<typeof defaultServiceAnswers>> = {}) => ({
  ...defaultServiceAnswers('workplace-first-aid-training'),
  workTypes: ['efaw'],
  riskSignals: ['training-identified'],
  documentationStatus: 'available' as const,
  inspectionStatus: 'in-date' as const,
  region: 'midlands' as const,
  assetCount: 8,
  ...overrides,
})

describe('workplace first-aid training', () => {
  it('uses the employer decision, not the questionnaire, as the training trigger', () => {
    const identified = readyBrief()
    expect(qualifyService(identified).status).toBe('likely-relevant')
    expect(qualifyService(identified).triggeredFactors.join(' ')).toMatch(/needs assessment identifies a course/i)
    expect(qualifyService(identified).caveats.join(' ')).toMatch(/not a first-aid needs assessment/i)

    const noTraining = readyBrief({ workTypes: ['course-not-decided'], riskSignals: ['no-training-recommended'] })
    expect(qualifyService(noTraining).status).toBe('no-obvious-trigger')
    expect(estimateServicePrice(noTraining).low).toBe(0)

    const unresolved = readyBrief({ riskSignals: ['assessment-not-complete'] })
    expect(qualifyService(unresolved).status).toBe('may-be-relevant')
    expect(estimateServicePrice(unresolved).high).toBe(0)
  })

  it('keeps contradictory direct answers in a cautious, non-priced state', () => {
    const contradictory = readyBrief({
      workTypes: ['efaw', 'faw'],
      riskSignals: ['training-identified', 'no-training-recommended'],
    })
    const result = qualifyService(contradictory)
    expect(result.status).toBe('may-be-relevant')
    expect(result.triggeredFactors.join(' ')).toMatch(/do not agree/i)
    expect(estimateServicePrice(contradictory, result)).toMatchObject({ low: 0, high: 0, factors: [] })
    expect(matchServiceSuppliers(suppliersForService('workplace-first-aid-training'), contradictory, result)).toEqual([])
  })

  it('shows only exact provider examples for a simple in-scope class', () => {
    const examples = [
      { course: 'efaw', amount: 450 },
      { course: 'faw', amount: 1200 },
      { course: 'faw-requalification', amount: 800 },
    ]
    for (const { course, amount } of examples) {
      const result = estimateServicePrice(readyBrief({ workTypes: [course] }))
      expect(result).toMatchObject({ low: amount, high: amount, factors: [expect.objectContaining({ amount })] })
      expect(result.assumptions.join(' ')).toMatch(/one provider’s published example/i)
    }

    const outOfScope = [
      readyBrief({ region: 'london' }),
      readyBrief({ region: 'scotland' }),
      readyBrief({ assetCount: 13 }),
      readyBrief({ sites: 2 }),
      readyBrief({ secondaryCount: 1 }),
      readyBrief({ workTypes: ['course-not-decided'] }),
      readyBrief({ region: 'northern-ireland' }),
    ]
    for (const answers of outOfScope) expect(estimateServicePrice(answers)).toMatchObject({ low: 0, high: 0, factors: [] })
  })

  it('matches by provider-sourced course and region, without sector ranking or complex-scope claims', () => {
    const north = readyBrief({ region: 'north', sector: 'woodworking' })
    const northResult = qualifyService(north)
    const northMatches = matchServiceSuppliers(suppliersForService('workplace-first-aid-training'), north, northResult)
    expect(northMatches).toHaveLength(3)
    expect(northMatches.map((match) => match.supplier.id)).toEqual([
      'british-red-cross-first-aid', 'safe-haven-first-aid', 'st-john-ambulance-first-aid',
    ])
    expect(northMatches.every((match) => match.reasons.some((reason) => /selected course/i.test(reason)))).toBe(true)

    const wales = readyBrief({ region: 'wales', assetCount: 6 })
    expect(matchServiceSuppliers(suppliersForService('workplace-first-aid-training'), wales, qualifyService(wales))).toHaveLength(3)
    const complex = readyBrief({ sites: 2 })
    expect(matchServiceSuppliers(suppliersForService('workplace-first-aid-training'), complex, qualifyService(complex))).toEqual([])
    const ni = readyBrief({ region: 'northern-ireland' })
    expect(qualifyService(ni).status).toBe('may-be-relevant')
    expect(matchServiceSuppliers(suppliersForService('workplace-first-aid-training'), ni, qualifyService(ni))).toEqual([])
  })
})
