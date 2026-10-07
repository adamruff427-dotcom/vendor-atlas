import type { ServiceDefinition } from './service-assessment'
import type { PriceEstimate, QualificationResult, ServiceAssessmentAnswers } from './types'

export const kitchenExtractSources = {
  law: 'https://www.legislation.gov.uk/uksi/2005/1541/article/17',
  guidance: 'https://www.gov.uk/government/publications/people-with-duties-under-fire-safety-laws/a-guide-for-persons-with-duties-under-fire-safety-legislation-accessible',
  standard: 'https://publications.thebesa.com/products/grease-specification-fire-risk-management-kitchen-extraction',
  bestPractice: 'https://www.thebesa.com/besa-blogs/kitchen-extract-system-cleaning',
  ductDoctor: 'https://www.ductdoctor.co.uk/',
  swiftclean: 'https://www.swiftclean.co.uk/kitchen-extract-cleaning/',
  deduct: 'https://deductltd.co.uk/services/kitchen-extraction-cleaning',
}

export const kitchenExtractDefinition: ServiceDefinition = {
  id: 'kitchen-extract-cleaning', name: 'commercial kitchen extract system cleaning', shortName: 'Kitchen extract cleaning', eyebrow: 'Kitchen extract cleaning and quote finder',
  question: 'Is my kitchen extract system due for a clean?', promise: 'Check the service signals and prepare a comparable cleaning brief.',
  description: 'Record the cooking use, extract systems and cleaning history, then compare a likely scope, a limited provider price example and sourced specialists.',
  legalBasis: 'Fire safety law places general duties on responsible persons to maintain fire precautions where necessary. It does not prescribe one universal TR19 cleaning interval or require every kitchen to appoint an external cleaner. Use your fire risk assessment, system condition and insurer terms to decide what work is needed. TR19 Grease is BESA industry guidance, not legislation.',
  legalSource: kitchenExtractSources.law,
  guidePath: '/?service=kitchen-extract-cleaning#guidance', costPath: '/?service=kitchen-extract-cleaning#guidance', supplierPath: '/?service=kitchen-extract-cleaning#guidance', toolkitPath: '/?service=kitchen-extract-cleaning#assessment',
  workHeading: 'What cooking extract equipment is installed?', workHelp: 'Count separate extract systems rather than fans or filters. If you do not know the duct route or system count, choose the closest answer and request a survey.',
  workOptions: [
    { value: 'one-system', label: 'One kitchen extract system', detail: 'Canopy, filters, ductwork and extract fan' },
    { value: 'multiple-systems', label: 'Two or more extract systems', detail: 'Count each separate canopy and duct network where known' },
    { value: 'shared-system', label: 'Several kitchens share a system', detail: 'The quote needs a system-by-system scope and access plan' },
    { value: 'solid-fuel', label: 'Wok, chargrill or solid-fuel cooking', detail: 'Cooking type can change grease loading and the cleaning interval' },
    { value: 'system-unknown', label: 'System layout or count is unknown', detail: 'A site survey may be needed before a firm quote' },
    { value: 'no-extract-system', label: 'No grease-laden kitchen extract system', detail: 'This service finder may not apply' },
  ],
  signalHeading: 'What is prompting a clean or review?',
  signalHelp: 'Cleaning frequency depends on actual system use, grease condition and the fire risk assessment. The options below are not a legal interval calculator.',
  signalOptions: [
    { value: 'clean-overdue', label: 'The recorded clean is due or overdue', detail: 'Use the interval recorded for your system' },
    { value: 'history-unknown', label: 'Last clean or records are unknown', detail: 'Confirm previous work and current system condition' },
    { value: 'visible-grease', label: 'Grease build-up or a ventilation concern was seen', detail: 'Promptly assess any immediate fire or equipment risk' },
    { value: 'risk-assessment-action', label: 'The fire risk assessment identifies extract cleaning', detail: 'Use the actual action and responsible person’s scope' },
    { value: 'insurer-condition', label: 'An insurer or contract specifies cleaning evidence', detail: 'Check the exact policy or contract wording and limits' },
    { value: 'no-clean-signal', label: 'No listed concern; cleaning is up to date', detail: 'Continue the current condition-based programme' },
  ],
  assetLabel: 'Separate kitchen extract systems', secondaryLabel: 'Canopies across those systems',
  documentationLabel: 'Cleaning reports, grease readings and fire risk assessment', documentationOptions: [
    { value: 'none', label: 'No useful records found' }, { value: 'partial', label: 'Some records, but incomplete' }, { value: 'available', label: 'Current records are available' }, { value: 'unknown', label: 'Not sure what records exist' },
  ],
  inspectionLabel: 'Current cleaning position', inspectionOptions: [
    { value: 'none', label: 'No recorded cleaning programme' }, { value: 'in-date', label: 'Clean appears current' }, { value: 'overdue-or-unknown', label: 'Due or uncertain' }, { value: 'new-system', label: 'New or materially changed system' },
  ],
  resultResourceHeading: 'A fire-safety duty does not set one universal TR19 interval',
  resultResourceBody: 'The responsible person should follow the premises fire risk assessment and any applicable insurer, lease or contract conditions. BESA describes TR19 Grease as an industry specification, not legislation. A clean should be scoped across the relevant canopy, filters, plenum, ducts, access panels and fan; a canopy-only clean may not cover hidden ductwork. There is no universal statutory TR19 cleaning interval.',
  primaryLinks: [
    { label: 'Fire Safety Order article 17', detail: 'General maintenance duty for fire precautions where necessary in England and Wales', url: kitchenExtractSources.law },
    { label: 'Home Office guide for responsible persons', detail: 'Explains the duty to maintain identified fire-safety measures; it does not prescribe a universal TR19 interval', url: kitchenExtractSources.guidance },
    { label: 'BESA TR19 Grease specification', detail: 'Industry guidance for managing grease accumulation in kitchen extraction systems', url: kitchenExtractSources.standard },
    { label: 'BESA: Kitchen extract cleaning', detail: 'Industry guidance on risk-based frequency and cleaning scope', url: kitchenExtractSources.bestPractice },
  ],
  priceEvidence: [{ label: 'Duct Doctor', url: kitchenExtractSources.ductDoctor, note: 'Provider states most jobs start from £300–£500 and larger sites run from £1,000+. The calculator only shows that single provider’s published starting-price example for one simple system; it is not a market rate. VAT treatment is not stated on the cited page. Checked 7 October 2026.' }],
}

function label(definition: ServiceDefinition, value: string) {
  return definition.workOptions.find(x => x.value === value)?.label || definition.signalOptions.find(x => x.value === value)?.label || value
}

export function qualifyKitchenExtract(a: ServiceAssessmentAnswers): QualificationResult {
  const installed = !a.workTypes.includes('no-extract-system')
  const signals = a.riskSignals.filter(v => v !== 'no-clean-signal')
  const factors = [
    ...a.workTypes.filter(v => v !== 'no-extract-system').map(v => label(kitchenExtractDefinition, v) + ' was selected'),
    ...signals.map(v => label(kitchenExtractDefinition, v) + ' was selected'),
  ]
  if (!installed) return { status: 'no-obvious-trigger', score: 0, triggeredFactors: ['No grease-laden kitchen extract system was identified'], caveats: ['This questionnaire does not determine whether fire precautions are adequate.'], scope: ['Confirm the kitchen equipment and fire risk assessment before requesting cleaning quotes'], complexity: 'standard' }
  const uncertain = a.workTypes.includes('system-unknown') || a.documentationStatus === 'unknown' || a.inspectionStatus === 'overdue-or-unknown'
  const jurisdictionNeedsReview = a.region === 'scotland' || a.region === 'northern-ireland'
  const status: QualificationResult['status'] = signals.length && !a.riskSignals.includes('no-clean-signal')
    ? jurisdictionNeedsReview ? 'may-be-relevant' : 'likely-relevant'
    : uncertain ? 'may-be-relevant' : 'no-obvious-trigger'
  if (a.inspectionStatus === 'none') factors.push('No cleaning programme was recorded')
  if (a.inspectionStatus === 'overdue-or-unknown') factors.push('The cleaning date or due position is uncertain')
  if (a.documentationStatus !== 'available') factors.push('Cleaning records or grease readings are missing or incomplete')
  const complex = a.sites > 1 || a.assetCount > 1 || a.workTypes.some(v => ['multiple-systems', 'shared-system', 'solid-fuel', 'system-unknown'].includes(v))
  return {
    status, score: factors.length, triggeredFactors: factors,
    caveats: ['This is a procurement indication, not a fire risk assessment or legal determination. A likely result means your answers justify checking the cleaning scope; it does not mean the law always requires a separate contractor clean.', 'In England and Wales, the Fire Safety Order maintenance duty applies where necessary to safeguard people and does not set a universal TR19 cleaning date. TR19 Grease is BESA industry guidance, not legislation.', 'Scotland and Northern Ireland have separate fire-safety legislation; confirm local duties and insurer or contract requirements.'],
    scope: ['Agree the systems, canopies and full duct route included', 'Review last clean, access points and grease condition', 'Specify canopy, filters, plenum, accessible ductwork and fan as applicable', 'Agree deposit-thickness evidence, photographs and post-clean report', 'List access limitations, new access panels, repairs and exclusions separately', 'Set a next review or clean date from the system assessment and applicable requirements'],
    complexity: complex ? 'complex' : 'standard',
  }
}

export const KITCHEN_EXTRACT_PRICE_MODEL = { version: 'duct-doctor-provider-example-2026-10-07', low: 300, high: 500 } as const

export function estimateKitchenExtract(a: ServiceAssessmentAnswers, result: QualificationResult): PriceEstimate {
  const simple = result.status !== 'no-obvious-trigger' && a.sites === 1 && a.assetCount === 1 && a.secondaryCount <= 1
    && a.workTypes.includes('one-system')
    && !a.workTypes.some(v => ['multiple-systems', 'shared-system', 'solid-fuel', 'system-unknown'].includes(v))
    && !a.riskSignals.includes('visible-grease')
  if (!simple) return { low: 0, high: 0, currency: 'GBP', factors: [], assumptions: ['A scoped quotation is required for no identified cleaning signal, multiple systems or sites, solid-fuel cooking, unknown system layout, visible heavy grease, access work, remedials or other complex scope. No zero-cost service is implied.'] }
  return { low: KITCHEN_EXTRACT_PRICE_MODEL.low, high: KITCHEN_EXTRACT_PRICE_MODEL.high, currency: 'GBP', factors: [{ label: 'Published starting-price example — lower boundary', amount: KITCHEN_EXTRACT_PRICE_MODEL.low }, { label: 'Published starting-price example — upper boundary', amount: KITCHEN_EXTRACT_PRICE_MODEL.high }], assumptions: ['One straightforward system at one site with one canopy and ordinary access; this is a single provider’s published starting-price example, not a national range or a quote from matched providers.', 'The two amounts shown are endpoints of the provider’s stated band, not additive charges or a formula.', 'The provider does not state VAT treatment on the cited page; confirm whether VAT is additional.', 'Multiple systems, long or concealed duct routes, extra access panels, heavy grease, out-of-hours work, remedials and several sites require a bespoke quote.', 'Confirm whether the fixed quotation covers the complete system through the fan and includes the cleaning record, photographs and grease readings.'] }
}
