import type { PriceEstimate, QualificationResult, ServiceAssessmentAnswers } from './types'

const englandAndWales = new Set(['north', 'midlands', 'wales', 'south-west', 'south-east', 'london'])
const transactions = new Set(['commercial-sale', 'commercial-letting', 'commercial-assignment'])
const systems = new Set(['fixed-heating', 'mechanical-ventilation', 'air-conditioning'])
const complexSignals = new Set(['multi-let', 'separate-unit', 'multiple-buildings'])

export const COMMERCIAL_EPC_PRICE_MODEL = {
  version: 'landlord-compliance-london-published-area-tariff-checked-2026-10-10',
  bands: [
    { maxArea: 50, amount: 260 },
    { maxArea: 100, amount: 330 },
    { maxArea: 250, amount: 409 },
  ],
  source: 'https://landlordcompliancelondon.uk/services/commercial-epc',
} as const

export function qualifyCommercialEpc(answers: ServiceAssessmentAnswers): QualificationResult {
  const transaction = answers.workTypes.length === 1 ? answers.workTypes[0] : 'uncertain'
  const knownSystems = answers.riskSignals.filter((signal) => systems.has(signal))
  const serviceContradiction = answers.riskSignals.includes('no-fixed-services') && knownSystems.length > 0
  const complexity: QualificationResult['complexity'] = answers.sites > 1
    || answers.secondaryCount > 1
    || answers.assetCount > 250
    || answers.size === 'medium'
    || answers.size === 'large'
    || answers.riskSignals.some((signal) => complexSignals.has(signal))
    ? 'complex' : 'standard'

  let status: QualificationResult['status'] = 'no-obvious-trigger'
  const factors: string[] = []
  const inJurisdiction = englandAndWales.has(answers.region)
  const relevantTransaction = transactions.has(transaction)
  const newBuild = transaction === 'commercial-new-build'
  const noTransaction = transaction === 'commercial-occupancy-only'
  const fixedServicesUnclear = (relevantTransaction || newBuild) && (
    answers.riskSignals.includes('unknown-services')
    || knownSystems.length === 0 && !answers.riskSignals.includes('no-fixed-services')
  )

  if (transaction === 'commercial-uncertain' || serviceContradiction) {
    status = 'may-be-relevant'
    factors.push('The transaction or building-services information is incomplete or contradictory')
  } else if (!inJurisdiction) {
    status = relevantTransaction || newBuild ? 'may-be-relevant' : 'no-obvious-trigger'
    factors.push('This check is limited to England and Wales; your region uses separate EPC rules')
  } else if (noTransaction) {
    factors.push('No sale, letting, assignment or new-build event was selected')
    if (answers.riskSignals.includes('public-display-over-500')) {
      factors.push('A public-display rule may apply to an existing EPC for a frequently visited building over 500 m²; it is not by itself a new-assessment trigger here')
      status = 'may-be-relevant'
    }
  } else if (fixedServicesUnclear) {
    status = 'may-be-relevant'
    factors.push('The transaction or building-services information is incomplete or contradictory')
  } else if (newBuild) {
    status = 'may-be-relevant'
    factors.push('A building under construction has a completion-stage EPC process that this existing-property estimate does not scope')
  } else if (relevantTransaction) {
    factors.push(transaction === 'commercial-sale'
      ? 'A commercial sale is planned'
      : transaction === 'commercial-letting'
        ? 'A new commercial letting is planned'
        : 'A lease assignment or subletting is planned')
    if (answers.inspectionStatus === 'in-date') {
      factors.push('You believe a current EPC is available; confirm the exact property on the official register and check for a newer certificate')
    } else if (answers.riskSignals.includes('no-fixed-services')) {
      status = 'may-be-relevant'
      factors.push('The reported absence of fixed building services needs checking against the legal building definition')
    } else if (answers.inspectionStatus === 'none' || answers.inspectionStatus === 'overdue-or-unknown') {
      status = 'likely-relevant'
      factors.push('No current EPC was identified, or its validity is uncertain')
    } else {
      status = 'may-be-relevant'
      factors.push('The certificate or transaction position needs checking before commissioning')
    }
  }

  if (knownSystems.length) factors.push(`Fixed building services selected: ${knownSystems.map((item) => item.replaceAll('-', ' ')).join(', ')}`)
  if (answers.assetCount > 0) factors.push(`Approximate floor area recorded: ${answers.assetCount} m²`)
  if (answers.documentationStatus !== 'available') factors.push('Plans, previous certificate or building-services records may need to be recovered')

  const scope = [
    'Confirm the property boundary, transaction and whether a current certificate is already lodged',
    'Review available plans, floor area, fabric and fixed building-services information',
    'Arrange an on-site inspection of the relevant building fabric and energy-related services',
    'Use the applicable approved non-domestic calculation method for the building and available evidence',
    'Lodge the certificate and recommendations report, recording limitations and next steps',
  ]
  if (answers.riskSignals.includes('no-fixed-services')) scope.splice(1, 0, 'Confirm whether the building meets the non-domestic EPC definition before agreeing an assessment')

  const caveats = [
    'This is a procurement indication, not a definitive legal decision or an energy assessment. Check the transaction, property and exemptions with an accredited non-domestic energy assessor or legal adviser.',
    'The finder covers England and Wales only. Scotland and Northern Ireland have separate rules.',
    'The EPC register and property-specific facts can change the result; a valid existing EPC may mean no new certificate is needed for the event selected.',
  ]
  return {
    status,
    score: status === 'likely-relevant' ? 5 : status === 'may-be-relevant' ? 2 : 0,
    triggeredFactors: factors.length ? factors : ['No clear commercial EPC procurement signal was selected'],
    caveats,
    scope,
    complexity,
  }
}

export function isActionableCommercialEpcBrief(answers: ServiceAssessmentAnswers, result: QualificationResult): boolean {
  return answers.serviceId === 'commercial-epc'
    && result.status === 'likely-relevant'
    && englandAndWales.has(answers.region)
    && transactions.has(answers.workTypes[0] ?? '')
    && answers.workTypes.length === 1
    && answers.inspectionStatus !== 'in-date'
    && answers.riskSignals.some((signal) => systems.has(signal))
    && !answers.riskSignals.includes('no-fixed-services')
    && !answers.riskSignals.includes('unknown-services')
    && Number.isInteger(answers.assetCount)
    && answers.assetCount >= 1
}

export function estimateCommercialEpc(answers: ServiceAssessmentAnswers, result: QualificationResult): PriceEstimate {
  const zero = (reason: string): PriceEstimate => ({
    low: 0, high: 0, currency: 'GBP', factors: [],
    assumptions: [reason, 'A zero amount means no numeric estimate is shown; it does not mean the service is free.'],
  })

  if (!isActionableCommercialEpcBrief(answers, result)) {
    return zero('Confirm the property, current EPC and transaction before requesting a comparable quotation.')
  }
  if (answers.region !== 'london') {
    return zero('No numeric tariff was found in the checked evidence for this region; request comparable local quotes.')
  }
  if (answers.assetCount > 250) {
    return zero('The checked provider publishes no fixed tariff above 250 m²; request an individual quote.')
  }
  if (result.complexity !== 'standard' || answers.size !== 'micro' || answers.sites !== 1 || answers.secondaryCount !== 1) {
    return zero('The brief is not a straightforward single-building case covered by the checked tariff; request an individual quote.')
  }

  const band = COMMERCIAL_EPC_PRICE_MODEL.bands.find((item) => answers.assetCount <= item.maxArea)
  if (!band) return zero('The checked provider publishes no fixed tariff above 250 m²; request an individual quote.')
  return {
    low: band.amount,
    high: band.amount,
    currency: 'GBP',
    factors: [{ label: `Provider tariff for up to ${band.maxArea} m², including VAT`, amount: band.amount }],
    assumptions: [
      'One existing commercial property in the London coverage area; area and building scope confirmed with the provider.',
      'This is one provider’s published area tariff, including VAT, checked 10 October 2026. It is not a national price, market average, or quote from a matched provider.',
      'Multi-let or separately assessed premises and work above 250 m² require an individual quote. Confirm parking, access, building use, inclusions and current price directly.',
    ],
  }
}
