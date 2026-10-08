import type { ServiceDefinition } from './service-assessment'
import type { PriceEstimate, QualificationResult, ServiceAssessmentAnswers } from './types'

const firstAidGuide = 'https://www.hse.gov.uk/firstaid/what-employers-need-to-do.htm'
const firstAidLaw = 'https://www.legislation.gov.uk/uksi/1981/917/regulation/3/data.xht?view=snippet&wrap=true'
const firstAidProviderGuide = 'https://www.hse.gov.uk/pubns/geis3.htm'
const sharedEvidence = '/?service=workplace-first-aid-training#guidance'

export const workplaceFirstAidDefinition: ServiceDefinition = {
  id: 'workplace-first-aid-training',
  name: 'workplace first-aid training',
  shortName: 'Workplace first-aid training',
  eyebrow: 'Workplace first-aid training finder',
  question: 'Do we need to arrange workplace first-aid training?',
  promise: 'Turn your employer first-aid decision into a clear training brief in about 2 minutes.',
  description: 'Use your existing first-aid needs assessment to scope training, check a narrow published-price example and compare providers with source-linked evidence.',
  legalBasis: 'Great Britain employers must provide adequate and appropriate first-aid equipment, facilities and personnel for their workplace and circumstances. HSE says the employer should assess its needs; it does not set a universal first-aider-to-worker ratio or require every employer to buy a particular course. This finder only helps source training after the employer has decided it is needed.',
  legalSource: firstAidGuide,
  guidePath: sharedEvidence,
  costPath: sharedEvidence,
  supplierPath: sharedEvidence,
  toolkitPath: sharedEvidence,
  workHeading: 'What course has your employer needs assessment selected?',
  workHelp: 'Choose the training type already identified by the employer’s first-aid needs assessment. If the course choice is not settled, select “Not decided” and use the HSE guidance before requesting quotes.',
  workOptions: [
    { value: 'efaw', label: 'Emergency First Aid at Work (EFAW)', detail: 'Use only if this is the course selected for the workplace’s first-aid arrangements.' },
    { value: 'faw', label: 'First Aid at Work (FAW)', detail: 'A broader workplace course; the employer’s assessment should determine whether it is appropriate.' },
    { value: 'faw-requalification', label: 'FAW requalification', detail: 'Use where the employer has identified requalification for current FAW certificate holders.' },
    { value: 'course-not-decided', label: 'Not decided or not sure', detail: 'This finder cannot choose the course or determine how many trained people are needed.' },
  ],
  signalHeading: 'What does the employer’s first-aid needs assessment say?',
  signalHelp: 'The employer remains responsible for deciding what is adequate and appropriate. This answer controls whether the finder offers training quotes.',
  signalOptions: [
    { value: 'training-identified', label: 'It identifies a course and training places to arrange', detail: 'A confirmed buyer decision can be turned into a comparable quote brief.' },
    { value: 'assessment-not-complete', label: 'It has not been completed or the decision is uncertain', detail: 'Complete or review the needs assessment before deciding to buy training.' },
    { value: 'workplace-change', label: 'Work, staffing, sites or shift patterns have changed', detail: 'The employer should review its needs assessment before choosing a course or number of learners.' },
    { value: 'certificate-expiring', label: 'A relevant first-aid certificate is due or may have expired', detail: 'Check the employer’s needs assessment and exact certificate terms before selecting requalification.' },
    { value: 'no-training-recommended', label: 'It does not currently identify a training course to buy', detail: 'Do not request training quotes solely because this finder exists.' },
  ],
  assetLabel: 'People to train in this booking',
  secondaryLabel: 'Additional classes or sessions',
  documentationLabel: 'First-aid needs assessment and training records',
  documentationOptions: [
    { value: 'none', label: 'No records located' },
    { value: 'partial', label: 'Some records, but incomplete' },
    { value: 'available', label: 'Current needs assessment and records are available' },
    { value: 'unknown', label: 'Not sure what records exist' },
  ],
  inspectionLabel: 'Current certificate position for the people in scope',
  inspectionOptions: [
    { value: 'none', label: 'No relevant certificates found' },
    { value: 'in-date', label: 'Certificates appear in date' },
    { value: 'overdue-or-unknown', label: 'Expiry or certificate status is due or uncertain' },
    { value: 'new-system', label: 'New starters, changed work or new arrangements' },
  ],
  resultResourceHeading: 'The employer chooses the course and cover',
  resultResourceBody: 'HSE expects an employer needs assessment to consider the workplace, workforce, hazards, work patterns, absence, accident history, lone or remote work and access to emergency help. There is no single course or fixed first-aider ratio that this questionnaire can prescribe. Confirm the required course, learner numbers, certificate period, delivery format and awarding evidence directly with the provider.',
  primaryLinks: [
    { label: 'HSE: what employers need to do', detail: 'Needs assessment, adequate and appropriate provision, and no fixed first-aider ratio', url: firstAidGuide },
    { label: 'Health and Safety (First-Aid) Regulations 1981, regulation 3', detail: 'Primary legal text for the employer’s equipment, facilities and suitable-personnel duty in Great Britain', url: firstAidLaw },
    { label: 'HSE GEIS3: selecting a first-aid training provider', detail: 'HSE stopped approving training providers; the employer must check provider competence and evidence', url: firstAidProviderGuide },
  ],
  priceEvidence: [
    { label: 'Safe Haven Training: in-house course fees', url: 'https://www.safehaventraining.co.uk/in-house/', note: 'Provider publishes EFAW £450, FAW £1,200 and FAW requalification £800, each for up to 12 learners, plus VAT. The finder uses these exact examples only for one on-site class, one site, 12 or fewer learners and non-London England. This is one provider’s tariff, not a national range or a quote from matched suppliers.' },
  ],
}

export const FIRST_AID_TRAINING_PRICE_MODEL = {
  version: 'safe-haven-published-in-house-course-fees-2026-10-08',
  checkedOn: '2026-10-08',
  publishedPricesExVat: { efaw: 450, faw: 1200, 'faw-requalification': 800 },
  maxLearnersPerClass: 12,
  geography: 'England excluding London',
} as const

export type FirstAidCourse = keyof typeof FIRST_AID_TRAINING_PRICE_MODEL.publishedPricesExVat

export function selectedFirstAidCourse(answers: ServiceAssessmentAnswers): FirstAidCourse | null {
  if (answers.workTypes.length !== 1) return null
  const course = answers.workTypes[0]
  return course in FIRST_AID_TRAINING_PRICE_MODEL.publishedPricesExVat ? course as FirstAidCourse : null
}

export function isActionableFirstAidBrief(answers: ServiceAssessmentAnswers, result: QualificationResult): boolean {
  return answers.serviceId === 'workplace-first-aid-training'
    && result.status === 'likely-relevant'
    && answers.riskSignals.length === 1
    && answers.riskSignals[0] === 'training-identified'
    && selectedFirstAidCourse(answers) !== null
    && answers.region !== 'northern-ireland'
}

export function qualifiesForFirstAidExamplePrice(answers: ServiceAssessmentAnswers, result: QualificationResult): boolean {
  return isActionableFirstAidBrief(answers, result)
    && answers.region !== 'london'
    && ['north', 'midlands', 'south-west', 'south-east'].includes(answers.region)
    && answers.sites === 1
    && answers.assetCount > 0
    && answers.assetCount <= FIRST_AID_TRAINING_PRICE_MODEL.maxLearnersPerClass
    && answers.secondaryCount === 0
}

export function qualifyFirstAidTraining(answers: ServiceAssessmentAnswers): QualificationResult {
  const course = selectedFirstAidCourse(answers)
  const signal = answers.riskSignals.length === 1 ? answers.riskSignals[0] : null
  const noTraining = answers.riskSignals.includes('no-training-recommended')
  const positiveSignals = answers.riskSignals.filter((value) => value !== 'no-training-recommended')
  const contradictory = answers.riskSignals.length > 1
    || answers.workTypes.length !== 1
    || (noTraining && (course !== null || answers.inspectionStatus === 'overdue-or-unknown'))

  let status: QualificationResult['status'] = 'no-obvious-trigger'
  if (contradictory || signal === 'assessment-not-complete' || signal === 'workplace-change' || !signal) status = 'may-be-relevant'
  else if (signal === 'training-identified' && course && answers.region !== 'northern-ireland') status = 'likely-relevant'
  else if (signal === 'training-identified' || signal === 'certificate-expiring') status = 'may-be-relevant'
  else if (signal === 'no-training-recommended') status = answers.documentationStatus === 'available' && answers.inspectionStatus !== 'overdue-or-unknown' ? 'no-obvious-trigger' : 'may-be-relevant'

  if (answers.region === 'northern-ireland' && status === 'likely-relevant') status = 'may-be-relevant'

  const courseLabel = course === 'efaw' ? 'EFAW' : course === 'faw' ? 'FAW' : course === 'faw-requalification' ? 'FAW requalification' : null
  const triggeredFactors: string[] = []
  if (signal === 'training-identified') triggeredFactors.push('The employer’s first-aid needs assessment identifies a course and training places to arrange')
  if (signal === 'assessment-not-complete') triggeredFactors.push('The employer’s first-aid needs assessment is incomplete or its decision is uncertain')
  if (signal === 'no-training-recommended') triggeredFactors.push('The employer’s current assessment does not identify a course to purchase')
  if (signal === 'workplace-change') triggeredFactors.push('Workplace, workforce, shift or site arrangements have changed and need employer review')
  if (signal === 'certificate-expiring' || answers.inspectionStatus === 'overdue-or-unknown') triggeredFactors.push('Certificate expiry or status is due or uncertain')
  if (courseLabel) triggeredFactors.push(`${courseLabel} is the course selected for this quote brief`)
  if (answers.projectReason === 'change') triggeredFactors.push('A workplace or staffing change is recorded')
  if (answers.documentationStatus !== 'available') triggeredFactors.push('Supporting needs-assessment or training records are incomplete or uncertain')
  if (contradictory) triggeredFactors.push('The supplied course, needs-assessment or certificate answers do not agree; the brief needs human clarification')
  if (answers.region === 'northern-ireland') triggeredFactors.push('Northern Ireland has a separate legal framework outside the Great Britain guidance used here')

  const scope = [
    'Confirm the employer-selected EFAW, FAW or FAW requalification course and the number of learners',
    'Agree one on-site class, location, dates, learner prerequisites and any additional sessions',
    'Confirm the course syllabus, assessment method, certificate validity and awarding evidence with the provider',
    'Check trainer availability, venue needs, accessibility, equipment and cancellation terms',
    'Ask for a written total separating VAT, travel, materials and any extra-class charges',
    'Retain learner attendance and certificate records, then review the employer needs assessment when work changes',
  ]

  const caveats = [
    'This is a procurement indication, not a first-aid needs assessment, course recommendation, legal determination or guarantee of compliance.',
    'The employer remains responsible for adequate and appropriate arrangements, course selection, training numbers and review of the needs assessment.',
    'HSE does not approve first-aid training providers. Check current course content, trainer competence, awarding or regulated qualification evidence, insurance and certificate terms before purchase.',
  ]
  if (answers.region === 'northern-ireland') caveats.push('This finder uses Great Britain sources and does not assess Northern Ireland requirements; confirm the local legal position before procurement.')
  if (answers.region === 'london') caveats.push('The price example provider states that London delivery may carry a surcharge; no London amount is modelled.')

  const relevantComplexity = answers.sites > 1 || answers.assetCount > 12 || answers.secondaryCount > 0
  return {
    status,
    score: triggeredFactors.length,
    triggeredFactors: triggeredFactors.length ? triggeredFactors : ['No training procurement trigger was selected from the information supplied'],
    caveats,
    scope,
    complexity: relevantComplexity ? 'complex' : 'standard',
  }
}

export function estimateFirstAidTraining(answers: ServiceAssessmentAnswers, result: QualificationResult): PriceEstimate {
  const course = selectedFirstAidCourse(answers)
  if (!course || !qualifiesForFirstAidExamplePrice(answers, result)) {
    return {
      low: 0,
      high: 0,
      currency: 'GBP',
      factors: [],
      assumptions: [
        'No numeric example is shown unless the employer has selected a course, one on-site class, one England site outside London, 12 or fewer learners and no additional sessions.',
        'Multi-site, multi-class, larger or still-undecided briefs need an itemised quote; Northern Ireland is outside the sources used here.',
        'A zero/zero result means pricing is withheld, not that training is free or required.',
      ],
    }
  }
  const courseNames: Record<FirstAidCourse, string> = {
    efaw: 'EFAW',
    faw: 'FAW',
    'faw-requalification': 'FAW requalification',
  }
  const amount = FIRST_AID_TRAINING_PRICE_MODEL.publishedPricesExVat[course]
  return {
    low: amount,
    high: amount,
    currency: 'GBP',
    factors: [{ label: `Safe Haven published ${courseNames[course]} in-house course fee, up to 12 learners`, amount }],
    assumptions: [
      'One on-site class at one site in England outside London; 12 or fewer learners; no extra session.',
      'Exact published Safe Haven Training example checked 8 October 2026: £450 EFAW, £1,200 FAW or £800 FAW requalification, plus VAT. No interpolation or headcount multiplier is applied.',
      'This is one provider’s published example, not a national range, current confirmed quote or price from the matched suppliers. Confirm availability and all travel, venue and cancellation terms.',
    ],
  }
}
