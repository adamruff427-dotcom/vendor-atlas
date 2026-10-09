import type { ServiceDefinition } from './service-assessment'
import type { PriceEstimate, QualificationResult, ServiceAssessmentAnswers } from './types'

const fitBasics = 'https://www.hse.gov.uk/respiratory-protective-equipment/fit-testing-basics.htm'
const fitGuide = 'https://www.hse.gov.uk/pubns/indg479.htm'
const coshhGb = 'https://www.legislation.gov.uk/uksi/2002/2677/regulation/7'
const coshhNi = 'https://www.legislation.gov.uk/nisr/2003/34/contents/made'
const fitScheme = 'https://www.fit2fit.org/f2f-register/'
const sharedEvidence = '/?service=rpe-face-fit-testing#guidance'

export const rpeFaceFitDefinition: ServiceDefinition = {
  id: 'rpe-face-fit-testing',
  name: 'RPE face-fit testing',
  shortName: 'RPE face-fit testing',
  eyebrow: 'Respirator fit-test finder',
  question: 'Do our tight-fitting respirators need face-fit testing?',
  promise: 'Use the respirator choice already made at work to prepare a clear test brief in about 2 minutes.',
  description: 'Check the selected facepiece and test method, count each wearer-and-mask test, see a sourced provider price example and compare evidence.',
  legalBasis: 'Great Britain COSHH law requires employers to prevent or adequately control exposure to hazardous substances. Where tight-fitting RPE is selected, HSE guidance says fit testing should be carried out as part of selection so the specific facepiece is suitable for the wearer. If a person uses more than one type, each type needs its own fit test. This finder does not choose RPE, decide whether it is needed, select the method or assess whether exposure is controlled. Northern Ireland has separate COSHH regulations and HSENI guidance.',
  legalSource: fitBasics,
  guidePath: sharedEvidence,
  costPath: sharedEvidence,
  supplierPath: sharedEvidence,
  toolkitPath: sharedEvidence,
  workHeading: 'What tight-fitting facepiece has already been selected?',
  workHelp: 'Use the make, model, type and size already selected by the employer’s risk assessment or respiratory-protection plan. Do not choose a respirator based on this questionnaire.',
  workOptions: [
    { value: 'filtering-facepiece', label: 'Disposable filtering facepiece (FFP)', detail: 'For example, a selected FFP2 or FFP3 model and size' },
    { value: 'half-mask', label: 'Reusable half mask', detail: 'A selected make, model and size of tight-fitting half mask' },
    { value: 'full-face', label: 'Full-face respirator', detail: 'A selected tight-fitting full-face model; the test method must be appropriate' },
    { value: 'other-tight-fitting', label: 'Another tight-fitting facepiece', detail: 'Record the exact make, model, type and size for the tester' },
    { value: 'type-unknown', label: 'A tight-fitting facepiece, but type or model is unknown', detail: 'Confirm the facepiece before requesting a comparable price' },
    { value: 'no-tight-fitting', label: 'No tight-fitting facepiece is selected', detail: 'For example, only loose-fitting RPE is used or no RPE selection has been made' },
  ],
  signalHeading: 'Which test method has the responsible person selected?',
  signalHelp: 'Choose the method already set by the employer’s RPE selection or competent adviser. This finder does not recommend qualitative or quantitative testing.',
  signalOptions: [
    { value: 'qualitative', label: 'Qualitative test', detail: 'A pass/fail method based on the wearer detecting a test agent; suitable only for facepieces that can be tested this way' },
    { value: 'quantitative', label: 'Quantitative test', detail: 'A measured fit factor produced by an appropriate instrument and protocol' },
    { value: 'method-not-selected', label: 'The method has not been selected or is not known', detail: 'Ask the person responsible for RPE selection before seeking comparable quotes' },
  ],
  assetLabel: 'Separate wearer-and-facepiece fit tests to book',
  secondaryLabel: 'Distinct facepiece make/model/size combinations',
  documentationLabel: 'RPE selection, COSHH information and fit-test records',
  documentationOptions: [
    { value: 'none', label: 'No selection or fit-test records found' },
    { value: 'partial', label: 'Some records, but incomplete' },
    { value: 'available', label: 'Current RPE selection and fit-test records are available' },
    { value: 'unknown', label: 'Not sure what records exist' },
  ],
  inspectionLabel: 'Current fit-test position for the selected facepiece',
  inspectionOptions: [
    { value: 'none', label: 'No fit-test record found for this facepiece' },
    { value: 'in-date', label: 'A current result is recorded for this wearer and facepiece' },
    { value: 'overdue-or-unknown', label: 'The result is missing, uncertain or no longer matches the facepiece' },
    { value: 'new-system', label: 'New wearer, new selection or a changed facepiece' },
  ],
  resultResourceHeading: 'Test the exact facepiece, not a brand in general',
  resultResourceBody: 'HSE guidance connects a fit-test result to the wearer and the facepiece tested. A change in make, model, type or size can require a new test; a face seal affected by facial hair cannot seal properly. The employer remains responsible for selecting adequate and suitable RPE, managing exposure controls and checking the named tester’s competence. Fit2Fit can be evidence of competence, but HSE does not make the scheme compulsory.',
  primaryLinks: [
    { label: 'HSE: fit testing basics', detail: 'When tight-fitting RPE should be tested, individual facepiece selection, competence and hygiene', url: fitBasics },
    { label: 'HSE INDG479 (revision 2, October 2025)', detail: 'Fit-test methods, what a test can establish and information for the report', url: fitGuide },
    { label: 'COSHH Regulations 2002, regulation 7', detail: 'Primary Great Britain duty to prevent or adequately control exposure to hazardous substances', url: coshhGb },
    { label: 'HSENI: respiratory protective equipment', detail: 'Northern Ireland regulator guidance on individual fit testing and competence', url: 'https://www.hseni.gov.uk/topics/respiratory-protective-equipment-rpe' },
    { label: 'Control of Substances Hazardous to Health Regulations (NI) 2003', detail: 'Northern Ireland statutory framework; check the local requirements separately', url: coshhNi },
    { label: 'Fit2Fit provider register', detail: 'Independent scheme register; check the named tester and method on the booking', url: fitScheme },
  ],
  priceEvidence: [
    { label: 'We Fit RPE: on-site fit-test prices', url: 'https://wefitrpe.co.uk/pricing/', note: 'The provider publishes £375 ex VAT for an on-site half day of up to 8 tests and £650 ex VAT for an on-site full day of up to 16 tests; travel is extra. The calculator repeats that provider’s exact package amount only for a single-site brief of up to 16 tests. It is not a national price range or a quote from matched providers.' },
    { label: 'Velocity Safety: published service tariffs', url: 'https://velocitysafety.co.uk/services/face-fit-testing/', note: 'The provider publishes £450 + VAT for 8–10 tests in a half day and £595 + VAT for 10–18 tests in a full day; individual and multi-site prices depend on location and method. These figures are a comparison check only and are not combined with the We Fit RPE model.' },
    { label: 'Safety Inspectors UK: qualitative testing tariffs', url: 'https://safetyinspectors.co.uk/face-fit-testing/', note: 'The provider publishes local Teesside/North East fees including £225 + VAT for 5 qualitative tests and £350 + VAT for 10. Larger and non-local scope is quoted; this is not used as a UK-wide estimate.' },
  ],
}

export const RPE_FACE_FIT_PRICE_MODEL = {
  version: 'we-fit-rpe-published-on-site-day-packages-2026-10-09',
  checkedOn: '2026-10-09',
  halfDayAmount: 375,
  halfDayMaximumTests: 8,
  fullDayAmount: 650,
  fullDayMaximumTests: 16,
} as const

export const supportedFacepieceTypes = ['filtering-facepiece', 'half-mask', 'full-face', 'other-tight-fitting'] as const

export function hasSelectedTightFacepiece(answers: ServiceAssessmentAnswers): boolean {
  return answers.workTypes.some((value) => supportedFacepieceTypes.includes(value as typeof supportedFacepieceTypes[number]) || value === 'type-unknown')
}

export function hasFaceFitConflict(answers: ServiceAssessmentAnswers): boolean {
  const noTight = answers.workTypes.includes('no-tight-fitting')
  const types = answers.workTypes.filter((value) => value !== 'no-tight-fitting')
  const countConflict = noTight
    ? answers.assetCount !== 0 || answers.secondaryCount !== 0
    : types.length > 0 && (answers.assetCount < 1 || answers.secondaryCount < 1 || answers.secondaryCount > answers.assetCount)
  return answers.workTypes.length === 0
    || (noTight && (types.length > 0 || answers.riskSignals.length > 0))
    || (!noTight && answers.riskSignals.length !== 1)
    || (answers.workTypes.includes('full-face') && answers.riskSignals.includes('qualitative'))
    || countConflict
}

export function isActionableFaceFitBrief(answers: ServiceAssessmentAnswers, result: QualificationResult): boolean {
  return answers.serviceId === 'rpe-face-fit-testing'
    && result.status === 'likely-relevant'
    && hasSelectedTightFacepiece(answers)
    && !answers.workTypes.includes('type-unknown')
    && !hasFaceFitConflict(answers)
    && answers.riskSignals[0] !== 'method-not-selected'
    && answers.assetCount > 0
}

export function qualifiesForFaceFitExamplePrice(answers: ServiceAssessmentAnswers, result: QualificationResult): boolean {
  return isActionableFaceFitBrief(answers, result)
    && answers.sites === 1
    && result.complexity === 'standard'
    && answers.secondaryCount <= 16
    && answers.assetCount <= RPE_FACE_FIT_PRICE_MODEL.fullDayMaximumTests
    && !answers.workTypes.includes('other-tight-fitting')
    && (!answers.workTypes.includes('full-face') || answers.riskSignals[0] === 'quantitative')
}

function optionLabel(definition: ServiceDefinition, value: string): string {
  return definition.workOptions.find((option) => option.value === value)?.label
    || definition.signalOptions.find((option) => option.value === value)?.label
    || value
}

export function qualifyRpeFaceFit(answers: ServiceAssessmentAnswers): QualificationResult {
  const definition = rpeFaceFitDefinition
  const selected = answers.workTypes.filter((value) => value !== 'no-tight-fitting')
  const method = answers.riskSignals.length === 1 ? answers.riskSignals[0] : null
  const noTightFacepiece = answers.workTypes.includes('no-tight-fitting') && selected.length === 0
  const conflicts = hasFaceFitConflict(answers)
  const uncertainType = answers.workTypes.includes('type-unknown')
  const knownMethod = method === 'qualitative' || method === 'quantitative'
  const fitReason = answers.inspectionStatus !== 'in-date'
    || answers.documentationStatus !== 'available'
    || ['new-installation', 'change', 'first-examination'].includes(answers.projectReason)
  const needsReview = conflicts || uncertainType || method === 'method-not-selected'
  const relevant = selected.length > 0 && fitReason
  const status: QualificationResult['status'] = noTightFacepiece && !conflicts
    ? 'no-obvious-trigger'
    : needsReview || !knownMethod
      ? 'may-be-relevant'
      : relevant
        ? 'likely-relevant'
        : 'no-obvious-trigger'
  const factors = [
    ...selected.map((value) => `${optionLabel(definition, value)} was selected from the existing RPE plan`),
    ...(method ? [`${optionLabel(definition, method)} was selected`] : []),
    ...(answers.inspectionStatus !== 'in-date' ? ['A current fit-test record was not confirmed for the selected facepiece'] : []),
    ...(answers.documentationStatus !== 'available' ? ['RPE selection or test records are missing or incomplete'] : []),
    ...(['new-installation', 'change', 'first-examination'].includes(answers.projectReason) ? ['The project is a new selection, a change or a first appointment'] : []),
  ]
  const complexity = answers.sites > 1 || answers.assetCount > 16 || uncertainType || selected.includes('other-tight-fitting')
    ? 'complex'
    : 'standard'
  const scope = [
    'Use the employer-selected make, model, type and size of each facepiece; do not substitute another model without the employer’s selection process',
    'Count each wearer-and-facepiece combination to be tested, including separate models or sizes used by the same person',
    'Confirm the employer-selected qualitative or quantitative method is appropriate for that facepiece and test purpose',
    'Agree wearer preparation, clean-shaven seal area, access to masks and any required adapters or test masks',
    'Conduct the agreed fit-test protocol and issue an individual record identifying wearer, facepiece, method, date and outcome',
    'Separate unsuccessful tests, alternative facepiece selection, training, wider RPE programme review and retesting from the base booking',
  ]
  if (noTightFacepiece) scope.splice(0, scope.length, 'Confirm the actual respiratory-protection equipment and exposure controls with the responsible person', 'Do not purchase a tight-fitting facepiece fit test when no tight-fitting facepiece has been selected')
  if (uncertainType || method === 'method-not-selected' || conflicts) scope.unshift('Resolve the facepiece type and method with the person responsible for RPE selection before asking providers for comparable prices')
  return {
    status,
    score: factors.length,
    triggeredFactors: noTightFacepiece ? ['No tight-fitting facepiece was selected in the answers'] : factors.length ? factors : ['No new fit-test need was identified from the selected records and project reason'],
    caveats: [
      'This is a procurement indication, not a COSHH assessment, RPE selection decision, fit test or legal determination. It does not establish that the chosen respirator controls exposure adequately.',
      'HSE guidance says tight-fitting facepieces should be fit tested as part of selection. The employer remains responsible for selecting adequate and suitable RPE and an appropriately competent tester.',
      'Fit2Fit is a voluntary competence-evidence scheme, not an HSE approval or the only possible way to demonstrate competence. Confirm the individual tester, method and current evidence directly.',
      'A fit-test result applies to the wearer and facepiece tested. Changes to make, model, type, size or wearer may require reassessment; there is no universal Vendor Atlas re-test interval.',
    ],
    scope,
    complexity,
  }
}

export function estimateRpeFaceFit(answers: ServiceAssessmentAnswers, result: QualificationResult): PriceEstimate {
  if (!qualifiesForFaceFitExamplePrice(answers, result)) return {
    low: 0, high: 0, currency: 'GBP', factors: [],
    assumptions: ['A scoped provider quotation is required for an undecided method, unknown facepiece, more than one site, more than 16 tests, a non-standard facepiece or contradictory answers. A withheld figure does not mean the service is free.'],
  }
  const fullDay = answers.assetCount > RPE_FACE_FIT_PRICE_MODEL.halfDayMaximumTests
  const amount = fullDay ? RPE_FACE_FIT_PRICE_MODEL.fullDayAmount : RPE_FACE_FIT_PRICE_MODEL.halfDayAmount
  const packageLabel = fullDay ? 'Published on-site full-day package, up to 16 tests' : 'Published on-site half-day package, up to 8 tests'
  return {
    low: amount, high: amount, currency: 'GBP',
    factors: [{ label: `${packageLabel} — We Fit RPE`, amount }],
    assumptions: [
      'This repeats one provider’s exact published package amount for the selected test-count band. It is not a national price range, average, formula or quote from matched providers.',
      'We Fit RPE lists these packages for qualitative or quantitative tests at one on-site booking. It states prices exclude VAT and travel; travel, parking, availability, masks/adapters and any additional work must be confirmed directly.',
      'The source describes a maximum test count per half or full day. The displayed package is a planning example, not confirmation that the provider will accept the buyer’s actual test mix or site.',
      'Multiple sites, more than 16 tests, additional days, unknown facepiece selection, retests, training and failed tests require a scoped quotation.',
    ],
  }
}
