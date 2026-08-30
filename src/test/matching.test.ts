import { describe, expect, it } from 'vitest'
import { suppliers } from '../data/suppliers'
import { qualifyDsear } from '../domain/dsear'
import { matchSuppliers } from '../domain/matching'
import { standardAnswers } from './fixtures'

describe('supplier matching', () => {
  it('returns three evidence-backed matches in deterministic score order', () => { const matches = matchSuppliers(suppliers, standardAnswers, qualifyDsear(standardAnswers)); expect(matches).toHaveLength(3); expect(matches[0].score).toBeGreaterThanOrEqual(matches[1].score); matches.forEach(({ supplier, reasons }) => { expect(supplier.evidence.length).toBeGreaterThan(0); expect(supplier.evidence.every((item) => item.sourceUrl.startsWith('https://'))).toBe(true); expect(reasons.length).toBeGreaterThan(0) }) })
  it('does not use paid placement or unverified accreditation fields in scoring', () => { const altered = suppliers.map((supplier) => ({ ...supplier, qualificationsAndMemberships: ['Any marketing claim'], pricingEvidence: 'Any price' })); expect(matchSuppliers(altered, standardAnswers, qualifyDsear(standardAnswers)).map((match) => [match.supplier.id, match.score])).toEqual(matchSuppliers(suppliers, standardAnswers, qualifyDsear(standardAnswers)).map((match) => [match.supplier.id, match.score])) })
})
