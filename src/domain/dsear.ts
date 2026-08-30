import type { AssessmentAnswers, Hazard, PriceEstimate, QualificationResult } from './types'

const hazardLabels: Record<Hazard, string> = {
  'flammable-liquids': 'Flammable liquids are present or used',
  'solvents-paints': 'Solvents, paints or coating products are present',
  'lpg-gases': 'LPG or other flammable gases are present',
  'combustible-dust': 'A process may create combustible dust',
  fuels: 'Fuels are stored or handled',
  batteries: 'Battery charging, storage or processing is undertaken',
  'pressurised-gases': 'Gases under pressure are present',
}

const specialistProcesses = new Set(['spray-painting', 'dust-extraction', 'bulk-powder', 'fuel-transfer', 'battery-processing'])

export function qualifyDsear(answers: AssessmentAnswers): QualificationResult {
  const factors = answers.hazards.map((hazard) => hazardLabels[hazard])
  if (answers.existingAssessment === 'none') factors.push('No existing DSEAR assessment was identified')
  if (answers.existingAssessment === 'old-or-unknown') factors.push('The existing assessment may need review')
  if (answers.projectReason === 'new-installation' || answers.projectReason === 'change') factors.push('New or changed work can require assessment before it starts')
  const specialistCount = answers.processes.filter((process) => specialistProcesses.has(process)).length
  const score = answers.hazards.length * 3 + specialistCount * 2 + (answers.sites > 1 ? 2 : 0) + (answers.size === 'large' ? 2 : 0)
  const status = answers.hazards.length >= 1 ? 'likely-relevant' : specialistCount > 0 ? 'may-be-relevant' : 'no-obvious-trigger'
  const complexity = score >= 10 || answers.sites > 2 || answers.hazards.includes('combustible-dust') ? 'complex' : 'standard'

  const scope = ['Dangerous substances inventory and safety data', 'Work activities, storage and process controls', 'Ignition sources and equipment suitability', 'Ventilation and release controls', 'Emergency arrangements and prioritised actions']
  if (answers.hazards.some((h) => ['flammable-liquids', 'solvents-paints', 'lpg-gases', 'combustible-dust', 'fuels'].includes(h))) scope.splice(3, 0, 'Hazardous area classification where an explosive atmosphere may occur')
  if (answers.hazards.includes('combustible-dust')) scope.push('Dust explosibility, extraction and housekeeping evidence')
  if (answers.hazards.includes('batteries')) scope.push('Battery chemistry, charging/processing conditions and thermal-event controls')

  return {
    status,
    score,
    triggeredFactors: factors.length ? factors : ['No obvious dangerous-substance trigger was selected'],
    caveats: [
      'This questionnaire is an initial procurement aid, not a suitable and sufficient DSEAR risk assessment.',
      'A competent person should confirm substance properties, quantities and how they are used at the workplace.',
    ],
    scope,
    complexity,
  }
}

const SIZE_BASE = { micro: 850, small: 1200, medium: 1900, large: 3000 } as const

export function estimateDsearPrice(answers: AssessmentAnswers, result = qualifyDsear(answers)): PriceEstimate {
  const factors: PriceEstimate['factors'] = [{ label: `Base for a ${answers.size} site`, amount: SIZE_BASE[answers.size] }]
  if (answers.hazards.length > 2) factors.push({ label: 'Multiple hazard types', amount: (answers.hazards.length - 2) * 225 })
  if (answers.processes.some((p) => specialistProcesses.has(p))) factors.push({ label: 'Specialist process or zoning review', amount: 550 })
  if (answers.hazards.includes('combustible-dust')) factors.push({ label: 'Combustible-dust complexity allowance', amount: 450 })
  if (answers.projectReason === 'new-installation') factors.push({ label: 'Design-stage/new-installation review', amount: 350 })
  if (answers.sites > 1) factors.push({ label: `${answers.sites - 1} additional site(s)`, amount: (answers.sites - 1) * 750 })
  if (answers.region === 'northern-ireland') factors.push({ label: 'Travel allowance for a GB-based provider', amount: 500 })
  const midpoint = factors.reduce((total, factor) => total + factor.amount, 0)
  const spread = result.complexity === 'complex' ? 0.3 : 0.22
  return {
    low: Math.round((midpoint * (1 - spread)) / 50) * 50,
    high: Math.round((midpoint * (1 + spread)) / 50) * 50,
    currency: 'GBP',
    factors,
    assumptions: ['One visit per site during normal working hours', 'Useful site plans and substance information are available', 'VAT, laboratory testing, remedial design and travel exceptions are excluded', 'This is Vendor Atlas planning guidance, not a supplier quotation'],
  }
}
