import { describe, expect, it } from 'vitest'
import { estimateDsearPrice, qualifyDsear } from '../domain/dsear'
import type { Hazard } from '../domain/types'
import { standardAnswers } from './fixtures'

const hazards: Hazard[] = ['flammable-liquids', 'solvents-paints', 'lpg-gases', 'combustible-dust', 'fuels', 'batteries', 'pressurised-gases']
describe('result invariants', () => {
  it('never produces contradictory or impossible result states across hazard combinations', () => { for (let mask = 0; mask < 2 ** hazards.length; mask++) { const selected = hazards.filter((_, index) => mask & (1 << index)); const result = qualifyDsear({ ...standardAnswers, hazards: selected, processes: [] }); const estimate = estimateDsearPrice({ ...standardAnswers, hazards: selected, processes: [] }, result); expect(Number.isFinite(result.score)).toBe(true); expect(result.score).toBeGreaterThanOrEqual(0); expect(result.scope.length).toBeGreaterThan(0); expect(result.caveats.length).toBeGreaterThan(0); expect(estimate.low).toBeGreaterThan(0); expect(estimate.high).toBeGreaterThan(estimate.low); if (selected.length === 0) expect(result.status).toBe('no-obvious-trigger'); else expect(result.status).toBe('likely-relevant') } })
})
