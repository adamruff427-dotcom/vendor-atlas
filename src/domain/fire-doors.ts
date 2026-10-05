import type { ServiceDefinition } from './service-assessment'
import type { PriceEstimate, QualificationResult, ServiceAssessmentAnswers } from './types'

export const doorSources = {
  checks: 'https://www.gov.uk/government/publications/fire-safety-england-regulations-2022/fact-sheet-fire-doors-regulation-10',
  guidance: 'https://www.gov.uk/government/publications/fire-safety-england-regulations-2022-fire-door-guidance/fire-safety-england-regulations-2022-fire-door-guidance',
  law: 'https://www.legislation.gov.uk/uksi/2022/547/regulation/10',
  maintenance: 'https://www.legislation.gov.uk/uksi/2005/1541/article/17',
  tariff: 'https://southcoastfiredoors.co.uk/guides/fire-door-cost/',
}

export const fireDoorDefinition: ServiceDefinition = {
  id: 'fire-door-inspection', name: 'fire door condition inspection', shortName: 'Fire door inspection', eyebrow: 'Fire door decision and quote finder',
  question: 'Do my fire doors need specialist inspection?', promise: 'Separate routine checks from specialist work and prepare a door-by-door brief.',
  description: 'Understand the maintenance duty, identify defects or evidence gaps and compare the scope and cost of a non-intrusive condition inspection.',
  legalBasis: 'In England, regulation 10 sets quarterly communal-door and best-endeavours annual flat-entrance-door checks for qualifying multi-occupied residential buildings with a top storey more than 11 metres above ground. These routine checks do not necessarily require a specialist. England and Wales also have the Fire Safety Order maintenance duty where necessary.',
  legalSource: doorSources.law, guidePath: '/fire-door-inspection/do-i-need-fire-door-inspection', costPath: '/fire-door-inspection/cost', supplierPath: '/fire-door-inspection/suppliers', toolkitPath: '/fire-door-inspection/buying-toolkit',
  workHeading: 'Which premises and doors are involved?', workHelp: 'Choose the building use and any known door types. The finder cannot establish fire resistance or which doors a fire strategy requires.',
  workOptions: [
    { value: 'residential-common', label: 'Shared areas in a block of flats', detail: 'Two or more domestic premises and common escape areas' },
    { value: 'commercial', label: 'Commercial or workplace premises', detail: 'Offices, shops, factories or other non-domestic premises' },
    { value: 'sleeping-care', label: 'Sleeping or care accommodation', detail: 'Hotels, care premises or other sleeping accommodation' },
    { value: 'communal-doors', label: 'Communal or corridor fire doors', detail: 'Doors in common parts or escape routes' },
    { value: 'flat-entrance', label: 'Flat entrance doors', detail: 'Resident access needs arranging separately' },
    { value: 'unknown-doors', label: 'Door locations or specification unclear', detail: 'Use the fire risk assessment to establish the required provision' },
    { value: 'no-installed', label: 'No fire doors identified', detail: 'Review provision before requesting an inspection of existing doors' },
  ],
  signalHeading: 'What is known about the building and condition?', signalHelp: 'Height means the top storey above ground, not the roof. Only England has this regulation 10 threshold. Do not guess a height or door performance.',
  signalOptions: [
    { value: 'over-11m', label: 'Residential top storey is more than 11 metres', detail: 'Exactly 11 metres does not meet the more-than-11-metre threshold' },
    { value: 'height-unknown', label: 'Residential height is unknown', detail: 'Confirm measured height with the building records' },
    { value: 'defects', label: 'Damage, gaps or poor closing reported', detail: 'Notify the responsible person promptly; do not wait for a routine quote' },
    { value: 'fra-action', label: 'Fire risk assessment requests a door survey', detail: 'Send the actual action and agreed inspection scope' },
    { value: 'missing-evidence', label: 'Door performance or installation evidence is unclear', detail: 'A visible condition inspection may not settle hidden construction or fire resistance' },
    { value: 'routine-only', label: 'Routine checks only, with no known faults', detail: 'Government says a specialist should not be necessary for basic regulation 10 checks' },
  ], assetLabel: 'Single-leaf doors to inspect', secondaryLabel: 'Double-leaf doors to inspect',
  documentationLabel: 'Fire risk assessment, door schedule and previous reports', documentationOptions: [
    { value: 'none', label: 'No useful records found' }, { value: 'partial', label: 'Some records, but incomplete' }, { value: 'available', label: 'Current records are available' }, { value: 'unknown', label: 'Not sure what records exist' },
  ], inspectionLabel: 'Current door-check position', inspectionOptions: [
    { value: 'none', label: 'No recorded checking programme' }, { value: 'in-date', label: 'Checks and recorded actions appear current' }, { value: 'overdue-or-unknown', label: 'Checks due or position uncertain' }, { value: 'new-system', label: 'New doors or materially changed premises' },
  ], resultResourceHeading: 'A checking duty is not automatically a paid survey requirement',
  resultResourceBody: 'Basic regulation 10 checks concern condition and self-closing. The Home Office says a specialist should not be necessary for those checks. Faults, unclear adequacy or a fire-risk-assessment action can justify specialist work. An inspection of visible components is not a fire-resistance test and cannot certify hidden installation details.',
  primaryLinks: [
    { label: 'Home Office routine-check fact sheet', detail: 'Duty, threshold and why a specialist is not always necessary', url: doorSources.checks },
    { label: 'Home Office fire door guidance', detail: 'Condition, closing, records and the separate adequacy question', url: doorSources.guidance },
    { label: 'Regulation 10', detail: 'England residential checking requirements', url: doorSources.law },
    { label: 'Fire Safety Order article 17', detail: 'England and Wales maintenance duty where necessary', url: doorSources.maintenance },
  ], priceEvidence: [{ label: 'South Coast Fire Doors', url: doorSources.tariff, note: 'Provider guide: £20 per single door, £25 per double door, £200 visit minimum, excluding VAT. It separately mentions a possible £50 call-out. Invasive work and routine regulation 10 checks are different services. Checked 5 October 2026; this local example is not a national market rate.' }],
}

export const FIRE_DOOR_PRICE_MODEL = { version: 'south-coast-condition-tariff-2026-10-05', single: 20, double: 25, minimum: 200, possibleCallOut: 50, maxDoors: 50, spread: 0 } as const
export function hasDoorBrief(a: ServiceAssessmentAnswers) {
  return !a.workTypes.includes('no-installed') && a.workTypes.some(x => ['residential-common', 'commercial', 'sleeping-care', 'communal-doors', 'flat-entrance', 'unknown-doors'].includes(x))
}
export function qualifyFireDoors(a: ServiceAssessmentAnswers): QualificationResult {
  const installed = hasDoorBrief(a)
  const england = !['wales', 'scotland', 'northern-ireland', 'great-britain', 'uk-wide'].includes(a.region)
  const reg10 = england && a.workTypes.includes('residential-common') && a.riskSignals.includes('over-11m')
  const specialist = a.riskSignals.some(x => ['defects', 'fra-action', 'missing-evidence'].includes(x)) || a.workTypes.includes('unknown-doors') || a.inspectionStatus === 'new-system'
  const status = installed ? specialist ? 'likely-relevant' : 'may-be-relevant' : 'no-obvious-trigger'
  const factors = [...a.workTypes, ...a.riskSignals].map(x => `${[...fireDoorDefinition.workOptions, ...fireDoorDefinition.signalOptions].find(o => o.value === x)?.label ?? x} was selected`)
  if (reg10 && !a.riskSignals.includes('height-unknown')) factors.push('For the England residential facts selected, quarterly communal checks and best-endeavours annual flat-entrance checks are relevant. This does not establish a need for a paid specialist.')
  else if (a.riskSignals.includes('over-11m')) factors.push('Do not apply the England residential threshold until jurisdiction, premises use and actual height are confirmed.')
  const caveats = ['This is procurement guidance, not a door inspection, fire risk assessment or legal determination.', 'Regulation 10 applies in England only. General Fire Safety Order maintenance duties apply in England and Wales; Scotland and Northern Ireland require separate jurisdiction-specific review.', 'Basic regulation 10 checks do not necessarily require a specialist; use the Home Office guidance.', 'A non-intrusive condition report cannot prove fire resistance or hidden installation adequacy.']
  if (a.riskSignals.includes('height-unknown')) caveats.push('The building height is uncertain. Confirm it before applying the more-than-11-metre residential rule.')
  if (a.riskSignals.includes('defects')) caveats.push('Notify the responsible person promptly about faulty closing or other damage so competent attention and interim precautions can be arranged.')
  return { status, score: factors.length, triggeredFactors: factors, caveats, scope: installed ? [
    'Agree whether the purchase is basic routine checking or a detailed non-intrusive condition inspection', 'Identify each door, location, type and required performance from existing fire-safety records', 'Inspect visible leaf, frame, seals, hinges, glazing, gaps and self-closing operation within the agreed scope', 'Record photographs, inaccessible doors and inspection limitations', 'Prioritise defects and separate remedial work or intrusive investigation from the inspection fee', 'Retain door-level records and assign follow-up actions to the responsible person',
  ] : ['Confirm required door provision through the fire risk assessment and fire strategy before pricing inspections'], complexity: a.sites > 1 || a.workTypes.includes('sleeping-care') || a.riskSignals.includes('missing-evidence') ? 'complex' : 'standard' }
}
export function estimateFireDoors(a: ServiceAssessmentAnswers): PriceEstimate {
  const m = FIRE_DOOR_PRICE_MODEL
  const validCount = (n: number) => Number.isInteger(n) && n >= 0
  if (!hasDoorBrief(a) || !validCount(a.assetCount) || !validCount(a.secondaryCount) || a.assetCount + a.secondaryCount < 1 || a.assetCount + a.secondaryCount > m.maxDoors || a.sites !== 1 || a.workTypes.some(x => ['unknown-doors', 'flat-entrance', 'sleeping-care'].includes(x)) || a.riskSignals.some(x => ['missing-evidence', 'routine-only'].includes(x)) || a.inspectionStatus === 'new-system') return { low: 0, high: 0, currency: 'GBP', factors: [], assumptions: ['An itemised quotation is required for routine-only checks, flat entrance access, uncertain scope, intrusive work, care premises, new doors, more than 50 doors or several sites. No zero-cost inspection is implied.'] }
  const units = a.assetCount * m.single + a.secondaryCount * m.double
  const base = Math.max(m.minimum, units)
  return { low: base, high: base + m.possibleCallOut, currency: 'GBP', factors: [{ label: `${a.assetCount} single doors at £20`, amount: a.assetCount * m.single }, { label: `${a.secondaryCount} double doors at £25`, amount: a.secondaryCount * m.double }, { label: 'Minimum-visit adjustment', amount: base - units }], assumptions: ['One non-intrusive condition-inspection visit with confirmed door counts and normal access.', 'The lower example applies the South Coast Fire Doors £200 minimum. The upper adds its possible £50 call-out. These are tariff scenarios, not measured market variation.', 'This local provider example excludes VAT and is not a quote from matched providers or a national price range.', 'The 50-door limit is a Vendor Atlas scope guard, not a legal threshold or provider limit; larger jobs require a volume quote.', 'Travel, inaccessible doors, intrusive investigation, repairs, replacement, out-of-hours work and repeat access are excluded.'] }
}
