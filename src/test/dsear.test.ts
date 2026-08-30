import { describe, expect, it } from 'vitest'
import { estimateDsearPrice, qualifyDsear } from '../domain/dsear'
import { standardAnswers } from './fixtures'

describe('DSEAR qualification', () => {
  it('identifies a selected flammable process as likely relevant and explains why', () => { const result = qualifyDsear(standardAnswers); expect(result.status).toBe('likely-relevant'); expect(result.triggeredFactors.join(' ')).toMatch(/Solvents/); expect(result.scope.join(' ')).toMatch(/Hazardous area/) })
  it('does not turn an empty initial screen into a definitive legal conclusion', () => { const result = qualifyDsear({ ...standardAnswers, processes: [], hazards: [], existingAssessment: 'current', projectReason: 'review' }); expect(result.status).toBe('no-obvious-trigger'); expect(result.caveats).toHaveLength(2); expect(result.triggeredFactors).toContain('No obvious dangerous-substance trigger was selected') })
  it('escalates combustible dust to complex work', () => { expect(qualifyDsear({ ...standardAnswers, hazards: ['combustible-dust'] }).complexity).toBe('complex') })
})

describe('indicative price calculation', () => {
  it('is deterministic, ordered and exposes every adjustment', () => { const first = estimateDsearPrice(standardAnswers); const second = estimateDsearPrice(standardAnswers); expect(first).toEqual(second); expect(first.low).toBeLessThan(first.high); expect(first.factors).toEqual(expect.arrayContaining([expect.objectContaining({ label: 'Specialist process or zoning review', amount: 550 })])) })
  it('adds exact transparent increments for multiple sites and dust complexity', () => { const estimate = estimateDsearPrice({ ...standardAnswers, sites: 3, hazards: ['combustible-dust', 'fuels', 'lpg-gases'] }); expect(estimate.factors).toEqual(expect.arrayContaining([expect.objectContaining({ amount: 1500 }), expect.objectContaining({ amount: 450 }), expect.objectContaining({ amount: 225 })])) })
})
