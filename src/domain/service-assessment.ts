import { fireDoorDefinition, qualifyFireDoors, estimateFireDoors, FIRE_DOOR_PRICE_MODEL } from './fire-doors'
import { kitchenExtractDefinition, qualifyKitchenExtract, estimateKitchenExtract, KITCHEN_EXTRACT_PRICE_MODEL } from './kitchen-extract'
import type {
  PriceEstimate,
  QualificationResult,
  ServiceAssessmentAnswers,
  ServiceId,
} from './types'

type IndustrialServiceId = Exclude<ServiceId, 'dsear'>

export interface AssessmentOption {
  value: string
  label: string
  detail: string
}

export interface ServiceDefinition {
  id: IndustrialServiceId
  name: string
  shortName: string
  eyebrow: string
  question: string
  promise: string
  description: string
  legalBasis: string
  legalSource: string
  guidePath: string
  costPath: string
  supplierPath: string
  toolkitPath: string
  workHeading: string
  workHelp: string
  workOptions: AssessmentOption[]
  signalHeading: string
  signalHelp: string
  signalOptions: AssessmentOption[]
  assetLabel: string
  secondaryLabel: string
  documentationLabel: string
  documentationOptions: Array<{ value: ServiceAssessmentAnswers['documentationStatus']; label: string }>
  inspectionLabel: string
  inspectionOptions: Array<{ value: ServiceAssessmentAnswers['inspectionStatus']; label: string }>
  resultResourceHeading: string
  resultResourceBody: string
  primaryLinks: Array<{ label: string; detail: string; url: string }>
  priceEvidence: Array<{ label: string; url: string; note: string }>
}

const sharedDocumentation = [
  { value: 'none', label: 'No useful records found' },
  { value: 'partial', label: 'Some records, but incomplete' },
  { value: 'available', label: 'Current records are available' },
  { value: 'unknown', label: 'Not sure what records exist' },
] as ServiceDefinition['documentationOptions']

export const serviceDefinitions: Record<IndustrialServiceId, ServiceDefinition> = {
  'fire-door-inspection': fireDoorDefinition,
  'kitchen-extract-cleaning': kitchenExtractDefinition,
  'fire-extinguisher-servicing': {
    id: 'fire-extinguisher-servicing', name: 'portable fire extinguisher inspection and servicing', shortName: 'Fire extinguisher servicing', eyebrow: 'Extinguisher maintenance finder',
    question: 'Do my fire extinguishers need servicing?', promise: 'Check the maintenance signals and prepare a service brief in about 2 minutes.',
    description: 'Identify portable units, their condition and service history, see an explained cost example and compare providers with public evidence.',
    legalBasis: 'In England and Wales, Fire Safety Order articles 13 and 17 cover appropriate firefighting equipment and its maintenance where necessary to safeguard people. Home Office offices and shops guidance describes monthly visual checks and annual competent maintenance. The manufacturer and actual equipment determine the programme.',
    legalSource: 'https://www.legislation.gov.uk/uksi/2005/1541/article/17',
    guidePath: '/fire-extinguisher-servicing/do-i-need-fire-extinguisher-servicing', costPath: '/fire-extinguisher-servicing/cost', supplierPath: '/fire-extinguisher-servicing/suppliers', toolkitPath: '/fire-extinguisher-servicing/buying-toolkit',
    workHeading: 'Which portable extinguishers are present?', workHelp: 'Read the label or previous inventory. This finder covers servicing existing units; a competent person decides which types and positions suit the fire risk.',
    workOptions: [
      { value: 'water-foam', label: 'Traditional water or foam units', detail: 'Portable metal-bodied water or foam extinguishers' },
      { value: 'co2', label: 'Carbon dioxide units', detail: 'CO2 units with a weight check and manufacturer-specific maintenance' },
      { value: 'powder', label: 'Dry powder units', detail: 'Record the agent, capacity and site restrictions' },
      { value: 'wet-chemical', label: 'Wet chemical units', detail: 'Record the kitchen or other location and capacity' },
      { value: 'service-free', label: 'P50 or other service-free units', detail: 'Follow the exact manufacturer inspection programme' },
      { value: 'unknown-units', label: 'Types or inventory unknown', detail: 'A competent survey must establish the unit schedule' },
      { value: 'no-installed', label: 'No portable extinguishers present', detail: 'Review provision in the fire risk assessment before buying a service' },
    ],
    signalHeading: 'What is prompting the appointment?', signalHelp: 'Routine visual checks, a basic service and discharge or overhaul work have different scope and costs.',
    signalOptions: [
      { value: 'service-due', label: 'Basic service due or overdue', detail: 'The label or maintenance plan calls for an appointment' },
      { value: 'missing-records', label: 'Service labels or records missing', detail: 'The maintenance history needs confirmation' },
      { value: 'used-damaged', label: 'Used, damaged or pressure concern', detail: 'Ask the responsible person for prompt competent attention' },
      { value: 'extended-due', label: 'Discharge, refill or overhaul may be due', detail: 'Age, type and manufacturer determine the work' },
      { value: 'changed-risk', label: 'Layout or fire hazards changed', detail: 'Selection and siting need a separate risk review' },
      { value: 'unknown-history', label: 'Service position unknown', detail: 'Inventory and labels need checking' },
      { value: 'no-concern', label: 'No listed issue', detail: 'Keep the existing inspection and maintenance programme' },
    ],
    assetLabel: 'Portable extinguishers in total', secondaryLabel: 'Fire blankets requiring a separate quote',
    documentationLabel: 'Fire risk assessment, inventory and service records', documentationOptions: sharedDocumentation,
    inspectionLabel: 'Current extinguisher service position', inspectionOptions: [
      { value: 'none', label: 'No service record found' }, { value: 'in-date', label: 'Programme and recorded actions appear current' },
      { value: 'overdue-or-unknown', label: 'Service date or condition uncertain' }, { value: 'new-system', label: 'New units or changed provision' },
    ],
    resultResourceHeading: 'Use the programme for the actual units',
    resultResourceBody: 'The responsible person owns the maintenance arrangements. Ask the technician to confirm unit type, condition, service stage and manufacturer instructions. A service label records work on an item; it does not settle the adequacy of the premises fire precautions.',
    primaryLinks: [
      { label: 'Fire Safety Order article 17', detail: 'England and Wales maintenance duty', url: 'https://www.legislation.gov.uk/uksi/2005/1541/article/17' },
      { label: 'Home Office offices and shops guide', detail: 'Visual checks and competent maintenance guidance for England', url: 'https://www.gov.uk/government/publications/fire-safety-risk-assessment-offices-and-shops/fire-safety-risk-assessment-offices-and-shops-accessible' },
      { label: 'BAFE extinguisher service guidance', detail: 'Check the organisation scheme and attending technician evidence', url: 'https://www.bafe.org.uk/bafe-fire-safety-services/fire-extinguisher-service-and-maintenance' },
      { label: 'Safelincs P50 guidance', detail: 'Provider explanation of the manufacturer-specific inspection exception', url: 'https://www.safelincs.co.uk/category/p50-service-free-fire-extinguishers' },
    ],
    priceEvidence: [
      { label: 'Fire Plus / RCR Services', url: 'https://www.rcr-services.co.uk/price-list', note: '£15 standard attendance plus £7.50 per annual basic service, excluding VAT. Basic consumables included. Travel beyond 50 miles from its Suffolk base costs extra. This formula is the model anchor.' },
      { label: 'PTS Compliance', url: 'https://www.ptscompliance.co.uk/fire-extinguisher-servicing/', note: '£149 for up to ten units outside London or £169 in London, then £3.95 per additional unit. Confirm VAT and contract terms. A comparison example only, not used in our calculation.' },
      { label: 'Safelincs', url: 'https://www.safelincs.co.uk/service/fire-extinguisher-servicing', note: 'Prices depend on site attendance and unit or blanket count. Basic spare parts are described as included. Obtain an itemised quotation.' },
    ],
  },
  'fire-alarm-servicing': {
    id: 'fire-alarm-servicing', name: 'fire detection and alarm inspection and servicing', shortName: 'Fire alarm servicing', eyebrow: 'Fire alarm maintenance finder',
    question: 'Does my fire alarm need a service?',
    promise: 'Check the maintenance signals and prepare a comparable service brief in about 2 minutes.',
    description: 'Identify the system and responsible person, separate weekly user checks from competent servicing, estimate a planning cost and compare evidenced providers.',
    legalBasis: 'For England and Wales, Fire Safety Order article 17 requires a suitable maintenance system for fire precautions where necessary. Home Office guidance describes weekly user tests and periodic competent-person servicing for installed fire-warning systems; it does not make one service contract or fixed certificate price universally mandatory.',
    legalSource: 'https://www.legislation.gov.uk/uksi/2005/1541/article/17',
    guidePath: '/fire-alarm-servicing/do-i-need-fire-alarm-servicing', costPath: '/fire-alarm-servicing/cost', supplierPath: '/fire-alarm-servicing/suppliers', toolkitPath: '/fire-alarm-servicing/buying-toolkit',
    workHeading: 'What fire-warning system is installed?',
    workHelp: 'Select the actual system. If no system is installed, a fire risk assessment must settle the warning method before a service can be priced.',
    workOptions: [
      { value: 'conventional-panel', label: 'Conventional panel and zones', detail: 'Wired panel with zoned detectors, call points or sounders' },
      { value: 'addressable-panel', label: 'Addressable panel', detail: 'Individual device addresses and an event log' },
      { value: 'wireless-system', label: 'Wireless fire alarm', detail: 'Radio-linked devices with batteries or wireless interfaces' },
      { value: 'monitored-system', label: 'Alarm receiving centre connection', detail: 'Monitoring provider needs notification before and after testing' },
      { value: 'multi-building', label: 'Several premises or panels', detail: 'An inventory and service schedule are needed for each site' },
      { value: 'no-installed', label: 'No installed alarm system', detail: 'A risk assessment must confirm whether warning arrangements are adequate' },
      { value: 'unknown-system', label: 'System type unknown', detail: 'Panel and device inventory need confirmation' },
    ],
    signalHeading: 'Why is a service being considered?',
    signalHelp: 'A weekly call-point check is not the same as a competent-person inspection and service.',
    signalOptions: [
      { value: 'service-due', label: 'Periodic service is due or overdue', detail: 'The logbook, provider or site plan calls for a visit' },
      { value: 'panel-fault', label: 'Panel shows a fault or disabled zone', detail: 'An impaired warning system needs prompt competent attention' },
      { value: 'false-alarms', label: 'False alarms or detector problems', detail: 'Review event logs and device causes' },
      { value: 'missing-logbook', label: 'Test and service records are incomplete', detail: 'The maintenance position cannot be evidenced' },
      { value: 'changed-layout', label: 'Premises layout or use changed', detail: 'System design and fire-risk assumptions may need a separate review' },
      { value: 'monitoring-link', label: 'Monitoring or interface needs coordination', detail: 'Avoid unwanted call-outs and verify connected functions' },
      { value: 'no-concern', label: 'No listed issue', detail: 'A clear panel alone does not prove the system is maintained' },
    ],
    assetLabel: 'Detectors, call points and sounders', secondaryLabel: 'Control panels',
    documentationLabel: 'Fire risk assessment, logbook and previous service records', documentationOptions: sharedDocumentation,
    inspectionLabel: 'Current alarm service position', inspectionOptions: [
      { value: 'none', label: 'No service record found' }, { value: 'in-date', label: 'Service programme and actions appear current' },
      { value: 'overdue-or-unknown', label: 'Due date or condition uncertain' }, { value: 'new-system', label: 'New or materially altered system' },
    ],
    resultResourceHeading: 'Weekly checks and specialist servicing do different jobs',
    resultResourceBody: 'A weekly call-point test checks the warning path used that day. A competent service examines the panel, power, devices, interfaces, records and defects under an agreed programme. Home Office guidance gives examples, not a universal statutory visit price or a substitute for the fire risk assessment.',
    primaryLinks: [
      { label: 'Fire Safety Order article 17', detail: 'Legal maintenance duty for fire precautions', url: 'https://www.legislation.gov.uk/uksi/2005/1541/article/17' },
      { label: 'Home Office offices and shops guide', detail: 'Weekly user checks, competent servicing and records', url: 'https://www.gov.uk/government/publications/fire-safety-risk-assessment-offices-and-shops/fire-safety-risk-assessment-offices-and-shops-accessible' },
      { label: 'Home Office small premises guide', detail: 'Risk-based warning arrangements and maintenance', url: 'https://www.gov.uk/government/publications/making-your-small-non-domestic-premises-safe-from-fire/a-guide-to-making-your-small-non-domestic-premises-safe-from-fire-accesible' },
    ],
    priceEvidence: [
      { label: 'Dale Montague Electrical', url: 'https://www.dme-ltd.co.uk/pricing-structure', note: 'Published fire alarm testing and inspection prices: £170 ex VAT up to 20 points, £220 for 21–40, £270 for 41–60; more than 60 needs a quote. Confirm service depth.' },
      { label: 'Safetec Protection', url: 'https://safetecprotection.co.uk/fire-alarm-service/', note: 'Provider advertises six-monthly servicing from £125 for its Dorset and Hampshire area; starting price, not an upper limit.' },
      { label: 'Paragon Fire and Security', url: 'https://www.paragonfire.co.uk/fire-alarm-maintenance/', note: 'Provider advertises fire alarm servicing from £60 per visit and a combined alarm and emergency-lighting plan from £75 per visit. These are starting prices with different scope.' },
    ],
  },
  'emergency-lighting': {
    id: 'emergency-lighting', name: 'emergency escape lighting inspection and testing', shortName: 'Emergency lighting testing', eyebrow: 'Escape lighting decision aid',
    question: 'Does my emergency lighting need testing?',
    promise: 'Check the fire-safety signals and prepare a comparable testing brief in about 2 minutes.',
    description: 'Separate the need for emergency escape lighting from the need to test an installed system, plan the scope and compare evidenced providers.',
    legalBasis: 'In England and Wales, Fire Safety Order article 14 requires emergency lighting where an emergency route or exit needs illumination if normal lighting fails. Article 17 requires fire precautions to be maintained where necessary. Home Office guidance describes typical monthly functional and annual full-discharge tests; those frequencies are guidance, not a universal statutory certificate interval.',
    legalSource: 'https://www.legislation.gov.uk/uksi/2005/1541/article/14',
    guidePath: '/emergency-lighting/do-i-need-emergency-lighting-testing', costPath: '/emergency-lighting/cost', supplierPath: '/emergency-lighting/suppliers', toolkitPath: '/emergency-lighting/buying-toolkit',
    workHeading: 'What emergency escape lighting is present?',
    workHelp: 'Choose installed systems or areas where the fire risk assessment leaves the provision uncertain. Do not assume every small premises needs installed luminaires.',
    workOptions: [
      { value: 'self-contained', label: 'Self-contained emergency luminaires', detail: 'Individual battery-backed fittings and exit signs' },
      { value: 'central-battery', label: 'Central battery system', detail: 'Multiple fittings supplied from a central emergency source' },
      { value: 'self-test', label: 'Automatic or self-test system', detail: 'Automated tests and fault indications need review' },
      { value: 'multi-building', label: 'More than one building', detail: 'Separate asset lists and reporting may be needed' },
      { value: 'no-installed', label: 'No installed emergency lighting', detail: 'A fire risk assessment must settle whether routes need it' },
      { value: 'unknown-system', label: 'Unsure what is installed', detail: 'The system and fire-risk decision need scoping first' },
    ],
    signalHeading: 'What has prompted the review?',
    signalHelp: 'Choose all that apply. A failed escape-route fitting needs prompt action, not just a future routine test.',
    signalOptions: [
      { value: 'test-due', label: 'A scheduled function or duration test is due', detail: 'The logbook or maintenance plan calls for a test' },
      { value: 'failed-fitting', label: 'A fitting, battery or indicator has failed', detail: 'Record the affected escape route and arrange prompt attention' },
      { value: 'missing-logbook', label: 'Test log or asset list is missing', detail: 'The responsible person cannot evidence the maintenance position' },
      { value: 'route-change', label: 'Escape route or occupancy has changed', detail: 'The fire risk assessment and lighting design may need review' },
      { value: 'dark-route', label: 'Route may be dark on normal-lighting failure', detail: 'A competent fire-safety review should decide whether provision is needed' },
      { value: 'unknown-duration', label: 'Rated duration or test method is unknown', detail: 'Agree the designed duration and test arrangement before pricing' },
      { value: 'no-concern', label: 'No listed issue', detail: 'This does not establish that the fire precautions are adequate' },
    ],
    assetLabel: 'Emergency luminaires and illuminated signs', secondaryLabel: 'Central battery units (if any)',
    documentationLabel: 'Fire risk assessment, asset schedule and test log', documentationOptions: sharedDocumentation,
    inspectionLabel: 'Current emergency-lighting testing position',
    inspectionOptions: [
      { value: 'none', label: 'No test record found' }, { value: 'in-date', label: 'Tests and actions appear current' },
      { value: 'overdue-or-unknown', label: 'Due date or status uncertain' }, { value: 'new-system', label: 'New or altered installation' },
    ],
    resultResourceHeading: 'Provision and maintenance are different decisions',
    resultResourceBody: 'The fire risk assessment decides whether escape routes need emergency illumination. If a system is installed, its design, rated duration and test method shape a maintenance programme. Home Office guidance describes monthly function and annual full-discharge tests, with recharging precautions afterwards.',
    primaryLinks: [
      { label: 'Fire Safety Order article 14', detail: 'Legal requirement where escape routes need emergency illumination', url: 'https://www.legislation.gov.uk/uksi/2005/1541/article/14' },
      { label: 'Fire Safety Order article 17', detail: 'Maintenance of fire precautions', url: 'https://www.legislation.gov.uk/uksi/2005/1541/article/17' },
      { label: 'Home Office escape-lighting guidance', detail: 'Suitability, typical tests, records and recharge precautions', url: 'https://www.gov.uk/government/publications/fire-safety-risk-assessment-offices-and-shops/fire-safety-risk-assessment-offices-and-shops-accessible' },
    ],
    priceEvidence: [
      { label: 'Dale Montague Electrical', url: 'https://www.dme-ltd.co.uk/pricing-structure', note: 'Publishes £160 excluding VAT up to 25 points, then £6 per additional point, for an emergency lighting test; confirm annual full-duration scope and local applicability.' },
      { label: 'Hexo Electrical Testing', url: 'https://hexoelectricaltesting.co.uk/prices/emergency-light-testing-prices/', note: 'Publishes annual three-hour testing from £199 excluding VAT for London and the South East; medium, large and multi-site work needs a bespoke quote.' },
      { label: 'Wire Now', url: 'https://www.wirenow.co.uk/emergency-lighting-testing-maintenance', note: 'Publishes annual duration testing from £225 plus VAT for its London, Hertfordshire and Essex coverage; this is a starting price, not an upper bound.' },
    ],
  },
  lev: {
    id: 'lev',
    name: 'Local exhaust ventilation thorough examination and test',
    shortName: 'LEV testing',
    eyebrow: 'LEV examination finder',
    question: 'Does my extraction system need an LEV test?',
    promise: 'Build an initial answer and a comparable testing brief in about 2 minutes.',
    description: 'Check likely COSHH examination duties, understand what a proper TExT should include, estimate a planning range and compare evidenced UK specialists.',
    legalBasis: 'COSHH regulation 9 requires control measures to be maintained. Most LEV systems must be thoroughly examined and tested at least every 14 months, with shorter maximum intervals for specified processes.',
    legalSource: 'https://www.hse.gov.uk/lev/faqs.htm',
    guidePath: '/lev/do-i-need-an-lev-test',
    costPath: '/lev/cost',
    supplierPath: '/lev/suppliers',
    toolkitPath: '/lev/buying-toolkit',
    workHeading: 'What airborne contaminant does the system control?',
    workHelp: 'Include contaminants generated by the process, not only substances bought in. Choose every relevant type.',
    workOptions: [
      { value: 'wood-dust', label: 'Wood dust', detail: 'Sawing, sanding, routing or machining timber and boards' },
      { value: 'welding-fume', label: 'Welding or metal fume', detail: 'Welding, soldering, brazing, plasma cutting or thermal work' },
      { value: 'spray-mist', label: 'Spray mist or coating', detail: 'Paint, powder coating, adhesives or other sprayed products' },
      { value: 'stone-dust', label: 'Stone, silica or construction dust', detail: 'Cutting, grinding or shaping mineral materials' },
      { value: 'metal-dust', label: 'Metal dust', detail: 'Grinding, polishing, finishing or additive manufacture' },
      { value: 'solvent-vapour', label: 'Solvent or chemical vapour', detail: 'Vapours released from a process, bath, vessel or cleaning activity' },
      { value: 'laboratory-fume', label: 'Laboratory or pharmaceutical contaminant', detail: 'Fume cupboards, microbiological cabinets or contained process work' },
      { value: 'other-contaminant', label: 'Other airborne contaminant', detail: 'Another dust, fume, mist, smoke, gas or vapour' },
      { value: 'none-known', label: 'No contaminant identified', detail: 'Use only if the equipment is general ventilation rather than source capture' },
    ],
    signalHeading: 'What kind of extraction is involved?',
    signalHelp: 'A system can still be LEV when it is small, portable or fitted directly to a tool.',
    signalOptions: [
      { value: 'fixed-ducted', label: 'Fixed ducted system', detail: 'One or more hoods connected to ductwork, a fan and discharge or filter' },
      { value: 'on-tool', label: 'On-tool extraction', detail: 'Extraction integrated with or attached to a power tool' },
      { value: 'spray-booth', label: 'Spray booth or room', detail: 'Mechanical extraction controlling spray, mist or vapour' },
      { value: 'fume-cupboard', label: 'Fume cupboard or cabinet', detail: 'Laboratory, pharmaceutical or containment equipment' },
      { value: 'portable', label: 'Portable extraction unit', detail: 'A movable fume, dust or filtration unit' },
      { value: 'recirculating', label: 'Air is recirculated', detail: 'Filtered air is discharged back into the workplace' },
      { value: 'unknown-system', label: 'Not sure', detail: 'The equipment captures contaminant, but its configuration is unclear' },
    ],
    assetLabel: 'Number of LEV systems',
    secondaryLabel: 'Total hoods or extraction points',
    documentationLabel: 'Commissioning data, logbook and previous reports',
    documentationOptions: sharedDocumentation,
    inspectionLabel: 'Last thorough examination and test',
    inspectionOptions: [
      { value: 'none', label: 'Never tested' },
      { value: 'in-date', label: 'Tested within its stated interval' },
      { value: 'overdue-or-unknown', label: 'Overdue or date unknown' },
      { value: 'new-system', label: 'New or newly installed system' },
    ],
    resultResourceHeading: 'A TExT is different from routine servicing',
    resultResourceBody: 'HSE describes a three-stage check: physical examination, technical performance measurements and professional judgement about whether the system is controlling exposure. Repairs and servicing may be needed, but do not by themselves replace that examination.',
    primaryLinks: [
      { label: 'HSE LEV FAQs', detail: 'Duty, intervals and practical employer questions', url: 'https://www.hse.gov.uk/lev/faqs.htm' },
      { label: 'HSE HSG258', detail: 'Detailed design, testing and report guidance', url: 'https://books.hse.gov.uk/gempdf/hsg258.pdf' },
      { label: 'COSHH regulation 9', detail: 'Legal maintenance and examination requirement', url: 'https://www.legislation.gov.uk/uksi/2002/2677/regulation/9' },
    ],
    priceEvidence: [
      { label: 'Tim Prestage Ltd', url: 'https://timprestage.co.uk/lev-testing-and-certification/', note: 'Publishes approximately £200 plus VAT for one system with up to five extraction points.' },
      { label: 'Impact Technical Services', url: 'https://www.impacttechnicalservices.co.uk/services/lev-testing/', note: 'Publishes a starting point of £250 for a smaller single-point system.' },
      { label: 'Spray Direct', url: 'https://www.spraydirect.co.uk/acatalog/Spray-Booth-Local-Exhaust-Ventilation-Testing-LEV.html', note: 'Publishes £245 ex VAT per spray-booth fan at the checked date.' },
    ],
  },
  'pressure-systems': {
    id: 'pressure-systems',
    name: 'Pressure systems written scheme and examination',
    shortName: 'Pressure systems / PSSR',
    eyebrow: 'Pressure-system duty finder',
    question: 'Does my pressure system need a written scheme?',
    promise: 'Identify the obvious PSSR signals and build a competent-person brief in about 2 minutes.',
    description: 'Check likely PSSR relevance, understand the written-scheme and examination sequence, estimate a planning range and compare evidenced UK providers.',
    legalBasis: 'Before qualifying pressure equipment is used, a suitable written scheme of examination must be in place and the covered parts must be examined by a competent person in accordance with it.',
    legalSource: 'https://www.hse.gov.uk/pressure-systems/pssr.htm',
    guidePath: '/pressure-systems/do-i-need-a-written-scheme',
    costPath: '/pressure-systems/cost',
    supplierPath: '/pressure-systems/suppliers',
    toolkitPath: '/pressure-systems/buying-toolkit',
    workHeading: 'What pressure equipment is present?',
    workHelp: 'Choose equipment that belongs to the system, including vessels, associated pipework and protective devices where relevant.',
    workOptions: [
      { value: 'compressed-air', label: 'Compressed-air system', detail: 'Compressor, receiver, dryer, pipework and protective devices' },
      { value: 'steam-boiler', label: 'Steam boiler or steam system', detail: 'Steam at any pressure can be a relevant fluid under PSSR' },
      { value: 'refrigeration', label: 'Refrigeration or HVAC pressure plant', detail: 'Systems containing compressed or liquefied refrigerant' },
      { value: 'autoclave', label: 'Autoclave or steriliser', detail: 'A pressurised vessel used in healthcare, laboratory or manufacturing work' },
      { value: 'hot-water', label: 'Pressurised hot-water system', detail: 'Especially water kept above 110°C' },
      { value: 'process-vessel', label: 'Industrial process vessel', detail: 'Reactor, accumulator, heat exchanger or another pressure vessel' },
      { value: 'coffee-boiler', label: 'Commercial coffee boiler', detail: 'An espresso or beverage machine producing steam' },
      { value: 'gas-system', label: 'Compressed or liquefied gas system', detail: 'Gas vessel, associated pipework and protective devices' },
      { value: 'unknown-pressure', label: 'Other or uncertain pressure system', detail: 'The system stores pressure but its classification is unclear' },
    ],
    signalHeading: 'Which relevant-fluid indicators apply?',
    signalHelp: 'The exact system boundary and exclusions require competent review. These answers are only the initial screen.',
    signalOptions: [
      { value: 'steam', label: 'Steam at any pressure', detail: 'Includes fired or electrically heated steam equipment' },
      { value: 'gas-over-half-bar', label: 'Gas above 0.5 bar', detail: 'Compressed or liquefied gas, including air, above atmospheric pressure' },
      { value: 'hot-water-over-110', label: 'Pressurised water above 110°C', detail: 'High-temperature water capable of generating relevant vapour pressure' },
      { value: 'acetylene', label: 'Gas dissolved under pressure', detail: 'For example acetylene dissolved in a solvent' },
      { value: 'unknown-fluid', label: 'Pressure or fluid details unknown', detail: 'Treat missing design information as a scoping gap' },
      { value: 'no-relevant-fluid', label: 'None of these', detail: 'Use only after checking the operating pressure, temperature and fluid' },
    ],
    assetLabel: 'Number of pressure vessels or main plant items',
    secondaryLabel: 'Protective devices to be identified',
    documentationLabel: 'System drawings, safe limits and equipment records',
    documentationOptions: sharedDocumentation,
    inspectionLabel: 'Written scheme and current examination position',
    inspectionOptions: [
      { value: 'none', label: 'No written scheme or examination found' },
      { value: 'in-date', label: 'Written scheme and examinations believed current' },
      { value: 'overdue-or-unknown', label: 'Scheme exists but status is overdue or unclear' },
      { value: 'new-system', label: 'New system, not yet put into service' },
    ],
    resultResourceHeading: 'The scheme comes before the examination',
    resultResourceBody: 'The written scheme identifies the safety-critical parts, nature of examinations, preparation measures and maximum intervals. The examination then follows that system-specific scheme. Neither replaces routine operation, maintenance or safe-limit information.',
    primaryLinks: [
      { label: 'HSE PSSR overview', detail: 'Definitions, relevant fluids and competent-person role', url: 'https://www.hse.gov.uk/pressure-systems/pssr.htm' },
      { label: 'HSE written-scheme guide', detail: 'How to establish and review a suitable WSE', url: 'https://www.hse.gov.uk/pubns/indg178.htm' },
      { label: 'PSSR regulation 8', detail: 'Legal requirement for a written scheme', url: 'https://www.legislation.gov.uk/uksi/2000/128/regulation/8' },
    ],
    priceEvidence: [
      { label: 'Lloyd & Whyte', url: 'https://www.lloydwhyte.com/commercial-insurance/pressure-vessel-inspection/', note: 'Publishes £255 plus VAT and an administration fee for its specified pressure-vessel inspection service.' },
      { label: 'Bridge Coffee Roasters', url: 'https://bridgecoffeeroasters.co.uk/boilerinspections', note: 'Publishes £445 per coffee machine including its stated inspection, certification, records and standard parts.' },
      { label: 'United Coffee Company', url: 'https://www.united-coffee.co.uk/machines/statutory-pressure-testing/', note: 'Publishes a single-machine pressure-vessel test from £318.75 plus VAT.' },
    ],
  },
  loler: {
    id: 'loler',
    name: 'LOLER thorough examination',
    shortName: 'LOLER examinations',
    eyebrow: 'Lifting-equipment examination finder',
    question: 'Which lifting equipment needs a thorough examination?',
    promise: 'Turn an initial asset count into a defensible examination and quote brief in about 2 minutes.',
    description: 'Check likely LOLER relevance, understand normal examination intervals, estimate an asset-based planning range and compare evidenced UK providers.',
    legalBasis: 'LOLER requires systematic and detailed thorough examination by a competent person at specified points and intervals, with a written report and action on defects.',
    legalSource: 'https://www.hse.gov.uk/work-equipment-machinery/thorough-examinations-lifting-equipment.htm',
    guidePath: '/loler/does-loler-apply',
    costPath: '/loler/cost',
    supplierPath: '/loler/suppliers',
    toolkitPath: '/loler/buying-toolkit',
    workHeading: 'What lifting equipment or accessories are involved?',
    workHelp: 'Choose every relevant group. A provider will still need an itemised asset register before confirming a quote.',
    workOptions: [
      { value: 'passenger-lift', label: 'Passenger, platform or mobility lift', detail: 'Equipment intended to lift people within or around a building' },
      { value: 'goods-lift', label: 'Goods lift or hoist', detail: 'Fixed equipment lifting goods rather than people' },
      { value: 'forklift', label: 'Forklift, telehandler or attachment', detail: 'Materials-handling plant and lifting attachments' },
      { value: 'mewp', label: 'MEWP or access platform', detail: 'Mobile equipment used to raise people to a working position' },
      { value: 'crane-hoist', label: 'Crane, runway, beam or powered hoist', detail: 'Fixed, mobile or overhead lifting machinery' },
      { value: 'vehicle-lift', label: 'Vehicle lift, jack or workshop equipment', detail: 'Garage and maintenance lifting equipment' },
      { value: 'patient-hoist', label: 'Patient hoist or care equipment', detail: 'Equipment and accessories used to lift or support people' },
      { value: 'accessories', label: 'Slings, chains, shackles or accessories', detail: 'Items used to attach a load to lifting equipment' },
      { value: 'arborist-kit', label: 'Arborist climbing or rigging kit', detail: 'Ropes, harnesses, connectors and rigging equipment' },
      { value: 'unknown-lifting', label: 'Other or uncertain lifting equipment', detail: 'The item raises or lowers a load, but classification is unclear' },
    ],
    signalHeading: 'How is it used?',
    signalHelp: 'This affects the usual maximum interval and the competence needed for the equipment type.',
    signalOptions: [
      { value: 'lifts-people', label: 'Lifts people', detail: 'Normally points to a six-month maximum interval unless a scheme specifies otherwise' },
      { value: 'lifts-loads', label: 'Lifts goods or loads', detail: 'Other lifting equipment commonly has a 12-month maximum interval' },
      { value: 'lifting-accessory', label: 'Includes lifting accessories', detail: 'Accessories commonly have a six-month maximum interval' },
      { value: 'assembled-on-site', label: 'Assembled or installed at a location', detail: 'May need examination after assembly and before use' },
      { value: 'exceptional-event', label: 'Damage, major repair, relocation or long disuse', detail: 'Exceptional circumstances may trigger another examination' },
      { value: 'unknown-use', label: 'Use is uncertain', detail: 'The asset needs classification before an interval is assumed' },
    ],
    assetLabel: 'Main items of lifting equipment',
    secondaryLabel: 'Lifting accessories',
    documentationLabel: 'Asset register, declarations and previous reports',
    documentationOptions: sharedDocumentation,
    inspectionLabel: 'Current thorough-examination position',
    inspectionOptions: [
      { value: 'none', label: 'No examination records found' },
      { value: 'in-date', label: 'Reports believed current' },
      { value: 'overdue-or-unknown', label: 'Overdue or due dates unknown' },
      { value: 'new-system', label: 'New, relocated or newly assembled equipment' },
    ],
    resultResourceHeading: 'Thorough examination is not routine servicing',
    resultResourceBody: 'A competent person examines safety-critical parts, makes judgements about defects and issues the legally required report. Maintenance under PUWER remains separate. HSE advises that the examiner should have sufficient independence and should not simply assess their own maintenance work.',
    primaryLinks: [
      { label: 'HSE thorough-examination guide', detail: 'Triggers, intervals, reports and defect duties', url: 'https://www.hse.gov.uk/work-equipment-machinery/thorough-examinations-lifting-equipment.htm' },
      { label: 'HSE LOLER overview', detail: 'Scope and dutyholder introduction', url: 'https://www.hse.gov.uk/work-equipment-machinery/loler-overview.htm' },
      { label: 'LOLER regulation 9', detail: 'Legal thorough-examination requirements', url: 'https://www.legislation.gov.uk/uksi/1998/2307/regulation/9' },
    ],
    priceEvidence: [
      { label: 'Robinsons Facilities Services', url: 'https://www.robinsonsfs.com/services/lifting-and-hoisting-equipment/', note: 'Publishes examinations from £150 plus VAT per item and a £180 minimum visit charge.' },
      { label: 'The LOLER Man', url: 'https://thelolerman.co.uk/', note: 'Publishes £80 for small equipment and £115 for plant, with travel excluded.' },
      { label: 'LOLER for Arborists', url: 'https://www.lolerforarborists.co.uk/pricing', note: 'Publishes £75 for an initial kit examination and £65 for re-examination within its stated kit limits.' },
    ],
  },
  asbestos: {
    id: 'asbestos',
    name: 'asbestos survey and register support',
    shortName: 'Asbestos surveys',
    eyebrow: 'Asbestos survey finder',
    question: 'Which asbestos survey does my building need?',
    promise: 'Check the likely duty, survey type and quote scope in about 2 minutes.',
    description: 'Screen the obvious duty-to-manage and planned-work signals, see what a suitable survey should cover, estimate a transparent planning range and compare evidenced UK providers.',
    legalBasis: 'Regulation 4 of the Control of Asbestos Regulations 2012 places duties on those responsible for maintenance of non-domestic premises. The duty includes finding materials that may contain asbestos, assessing condition and managing the risk.',
    legalSource: 'https://www.hse.gov.uk/asbestos/duty/index.htm',
    guidePath: '/asbestos/do-i-need-an-asbestos-survey',
    costPath: '/asbestos/cost',
    supplierPath: '/asbestos/suppliers',
    toolkitPath: '/asbestos/buying-toolkit',
    workHeading: 'What premises or work are involved?',
    workHelp: 'Choose every relevant situation. A management survey and an intrusive refurbishment or demolition survey answer different questions.',
    workOptions: [
      { value: 'occupied-non-domestic', label: 'Occupied non-domestic premises', detail: 'Workplace, shop, office, factory, school, warehouse or other commercial building' },
      { value: 'common-parts', label: 'Common parts of domestic premises', detail: 'Shared corridors, plant rooms, lifts, roofs or service areas' },
      { value: 'maintenance-work', label: 'Routine maintenance is planned', detail: 'Work may reach concealed building fabric or services' },
      { value: 'refurbishment', label: 'Refurbishment or alteration', detail: 'Intrusive work will disturb part of the building' },
      { value: 'demolition', label: 'Demolition', detail: 'All or a substantial part of the structure will be removed' },
      { value: 'property-acquisition', label: 'Acquisition or lease review', detail: 'The buyer or tenant needs dependable building-risk information' },
      { value: 'unknown-use', label: 'Premises or work scope uncertain', detail: 'The dutyholder, building use or planned work is not yet clear' },
    ],
    signalHeading: 'Which asbestos risk signals apply?',
    signalHelp: 'Buildings constructed before 2000 may contain asbestos. Records and planned disturbance materially affect the survey brief.',
    signalOptions: [
      { value: 'built-before-2000', label: 'Built before 2000', detail: 'Asbestos-containing materials may be present' },
      { value: 'suspect-material', label: 'Suspect material is present', detail: 'Material has not been reliably identified' },
      { value: 'no-register', label: 'No usable asbestos register', detail: 'The live location and condition record is missing or incomplete' },
      { value: 'planned-disturbance', label: 'Work will disturb building fabric', detail: 'Refurbishment, installation or demolition reaches the work area' },
      { value: 'damaged-material', label: 'Material is damaged or deteriorating', detail: 'Condition may need prompt competent review' },
      { value: 'previous-findings', label: 'Previous asbestos findings', detail: 'A survey or sample has identified asbestos-containing material' },
      { value: 'unknown-building-age', label: 'Building age is unknown', detail: 'Construction information needs checking before exclusion' },
      { value: 'post-2000-evidence', label: 'Reliable post-2000 construction evidence', detail: 'Records indicate the relevant structure was built after asbestos use was prohibited' },
    ],
    assetLabel: 'Buildings or separate blocks in scope',
    secondaryLabel: 'Expected samples or suspect material locations',
    documentationLabel: 'Existing survey, register and management plan',
    documentationOptions: sharedDocumentation,
    inspectionLabel: 'Current survey and reinspection position',
    inspectionOptions: [
      { value: 'none', label: 'No survey or register found' },
      { value: 'in-date', label: 'Survey, register and reviews believed current' },
      { value: 'overdue-or-unknown', label: 'Records exist but status is unclear or overdue' },
      { value: 'new-system', label: 'New premises or newly planned work' },
    ],
    resultResourceHeading: 'Choose the survey for the decision being made',
    resultResourceBody: 'A management survey supports normal occupation and routine maintenance. Refurbishment or demolition work needs a more intrusive survey of the parts that will be disturbed. The survey brief should define areas, access, exclusions, sampling and the format needed for the live register or project controls.',
    primaryLinks: [
      { label: 'HSE asbestos duty', detail: 'Who has the duty to manage and what it involves', url: 'https://www.hse.gov.uk/asbestos/duty/index.htm' },
      { label: 'HSE survey guide', detail: 'Survey types, planning and choosing a surveyor', url: 'https://www.hse.gov.uk/asbestos/duty/arrange-asbestos-survey.htm' },
      { label: 'Control of Asbestos Regulations 2012', detail: 'Regulation 4 duty to manage asbestos', url: 'https://www.legislation.gov.uk/uksi/2012/632/regulation/4' },
    ],
    priceEvidence: [
      { label: 'ACMS UK', url: 'https://www.acmsuk.com/news/asbestos/asbestos-survey-cost/', note: 'Publishes commercial management-survey examples and explains major price drivers.' },
      { label: 'Elements Environmental', url: 'https://www.asbestossurveyingandtesting.com/knowledge-centre/guides/management-surveys', note: 'Publishes size-banded commercial management-survey guidance.' },
      { label: 'Supernova Asbestos Surveys', url: 'https://asbestos-surveys.org.uk/services', note: 'Publishes starting prices for management, refurbishment, demolition and reinspection work.' },
    ],
  },
  'fire-risk-assessment': {
    id: 'fire-risk-assessment',
    name: 'fire risk assessment',
    shortName: 'Fire risk assessments',
    eyebrow: 'Fire risk assessment finder',
    question: 'Does my premises need a fire risk assessment?',
    promise: 'Check the likely duty, assessment scope and quote inputs in about 2 minutes.',
    description: 'Identify the responsible-person and premises signals, see what a suitable assessment should cover, estimate a visible planning range and compare sourced providers.',
    legalBasis: 'In England and Wales, the Regulatory Reform (Fire Safety) Order 2005 requires the responsible person to make a suitable and sufficient assessment of risks to relevant persons and keep it under review. Different legislation applies in Scotland and Northern Ireland.',
    legalSource: 'https://www.gov.uk/workplace-fire-safety-your-responsibilities/fire-risk-assessments',
    guidePath: '/fire-risk-assessment/do-i-need-a-fire-risk-assessment',
    costPath: '/fire-risk-assessment/cost',
    supplierPath: '/fire-risk-assessment/suppliers',
    toolkitPath: '/fire-risk-assessment/buying-toolkit',
    workHeading: 'What type of premises is involved?',
    workHelp: 'Choose every relevant use. Mixed and shared premises can have more than one responsible person.',
    workOptions: [
      { value: 'office-retail', label: 'Office, shop or salon', detail: 'Non-domestic workplace or premises open to customers' },
      { value: 'factory-warehouse', label: 'Factory or warehouse', detail: 'Industrial, storage or distribution premises' },
      { value: 'hospitality', label: 'Restaurant, pub or venue', detail: 'Cooking, alcohol, public assembly or entertainment use' },
      { value: 'sleeping-accommodation', label: 'Hotel, guest accommodation or HMO', detail: 'People sleep at the premises and may be unfamiliar with escape routes' },
      { value: 'residential-common-parts', label: 'Block of flats common parts', detail: 'Shared areas, structure, external walls and flat entrance doors may need consideration' },
      { value: 'care-education', label: 'Care, healthcare or education', detail: 'Children, patients or people needing assistance may be present' },
      { value: 'construction-site', label: 'Construction or refurbishment site', detail: 'Temporary conditions, hot work and changing escape routes apply' },
      { value: 'mixed-use', label: 'Mixed-use or multi-occupied building', detail: 'Several uses, occupiers or responsible persons share the premises' },
      { value: 'none-private-home', label: 'Private home only', detail: 'A single private domestic dwelling with no business, paying guests or shared common parts' },
      { value: 'unknown-premises', label: 'Premises use is uncertain', detail: 'Ownership, occupation or fire-safety responsibility needs checking' },
    ],
    signalHeading: 'Which fire-safety scope signals apply?',
    signalHelp: 'These factors affect assessment depth, assessor competence and quotation effort. They do not determine the assessment outcome.',
    signalOptions: [
      { value: 'employees-public', label: 'Employees, customers or visitors attend', detail: 'Relevant persons use or may be near the premises' },
      { value: 'sleeping-risk', label: 'People sleep at the premises', detail: 'Sleeping risk changes evacuation and detection considerations' },
      { value: 'vulnerable-occupants', label: 'People may need assistance to escape', detail: 'Children, patients, residents or disabled people need suitable planning' },
      { value: 'dangerous-substances', label: 'Dangerous substances or higher fire load', detail: 'Fuel, gases, chemicals, combustible stock or process hazards are present' },
      { value: 'multiple-floors', label: 'Several floors or complex escape routes', detail: 'Travel distances, stairs, compartmentation and evacuation need closer review' },
      { value: 'shared-responsibility', label: 'Several occupiers or dutyholders', detail: 'Co-operation and co-ordination arrangements need assessment' },
      { value: 'material-change', label: 'Change, fire or near miss', detail: 'A change or event can trigger review of an existing assessment' },
      { value: 'unknown-fire-scope', label: 'Fire-safety information is incomplete', detail: 'Plans, occupancy, systems or previous findings need checking' },
      { value: 'no-complex-signals', label: 'None of these complexity signals', detail: 'The premises still needs its legal duty and assessment position checked' },
    ],
    assetLabel: 'Floors or distinct levels in scope',
    secondaryLabel: 'Separate occupancies or tenant areas',
    documentationLabel: 'Existing assessment, plans and fire-safety records',
    documentationOptions: sharedDocumentation,
    inspectionLabel: 'Current fire risk assessment position',
    inspectionOptions: [
      { value: 'none', label: 'No written assessment found' },
      { value: 'in-date', label: 'Assessment is recorded and believed current' },
      { value: 'overdue-or-unknown', label: 'Assessment exists but review status is unclear' },
      { value: 'new-system', label: 'New premises, use or occupancy' },
    ],
    resultResourceHeading: 'The responsible person owns the duty',
    resultResourceBody: 'A responsible person can carry out a straightforward assessment if competent, or appoint a competent assessor. Outsourcing the work does not transfer the legal responsibility. The brief should describe the premises, people, hazards, fire precautions, records, shared responsibilities and intended report.',
    primaryLinks: [
      { label: 'GOV.UK fire risk assessments', detail: 'Responsible-person duty and five assessment steps', url: 'https://www.gov.uk/workplace-fire-safety-your-responsibilities/fire-risk-assessments' },
      { label: 'Home Office five-step checklist', detail: 'Hazards, people, action, records and review', url: 'https://www.gov.uk/government/publications/fire-safety-risk-assessment-5-step-checklist/fire-safety-risk-assessment-5-step-checklist-accessible' },
      { label: 'Fire Safety Order article 9', detail: 'Legal risk-assessment and review requirement', url: 'https://www.legislation.gov.uk/uksi/2005/1541/article/9' },
    ],
    priceEvidence: [
      { label: 'R&W Fire Solutions', url: 'https://www.rwfiresolutions.com/fire-risk-assessments', note: 'Publishes starting prices of £250 for small, £450 for medium and £750 for large or complex premises.' },
      { label: 'MG Fire Safety Group', url: 'https://www.londonfireriskassessment.com/pricing/pricing', note: 'Publishes commercial-premises prices by stated floor-area band.' },
      { label: 'Landlord Compliance London', url: 'https://landlordcompliancelondon.uk/services/commercial-fire-risk-assessment', note: 'Publishes prices by floor count for communal areas and full buildings.' },
    ],
  },
  legionella: {
    id: 'legionella',
    name: 'legionella risk assessment',
    shortName: 'Legionella risk assessments',
    eyebrow: 'Legionella duty finder',
    question: 'Does my water system need a legionella risk assessment?',
    promise: 'Check the duty, water-system scope and quote inputs in about 2 minutes.',
    description: 'Identify the water-system and exposed-person signals, see what an assessment should cover, calculate a visible planning range and compare sourced UK providers.',
    legalBasis: 'UK employers and people in control of premises must assess and control legionella exposure risks under health and safety law and COSHH. HSE ACOP L8 explains how those duties apply to water systems.',
    legalSource: 'https://www.hse.gov.uk/pubns/priced/l8.pdf',
    guidePath: '/legionella/do-i-need-a-legionella-risk-assessment',
    costPath: '/legionella/cost',
    supplierPath: '/legionella/suppliers',
    toolkitPath: '/legionella/buying-toolkit',
    workHeading: 'Which water systems or premises are involved?',
    workHelp: 'Choose every relevant system or use. The assessment must cover the real water assets and people who can be exposed.',
    workOptions: [
      { value: 'commercial-hot-cold', label: 'Commercial hot and cold water', detail: 'Offices, shops, factories, warehouses or public buildings' },
      { value: 'rented-housing', label: 'Rented housing or HMO', detail: 'A landlord or managing agent controls the domestic water system' },
      { value: 'care-healthcare', label: 'Care or healthcare premises', detail: 'Residents or patients can have greater susceptibility' },
      { value: 'hotel-hospitality', label: 'Hotel, hospitality or guest accommodation', detail: 'Bedrooms, showers and variable occupancy increase the asset count' },
      { value: 'leisure-spa', label: 'Leisure, pool or spa system', detail: 'Spa pools and wet leisure systems need specialist assessment' },
      { value: 'cooling-system', label: 'Cooling tower or evaporative condenser', detail: 'An evaporative cooling system has a separate HSG274 control route' },
      { value: 'process-water', label: 'Other risk water system', detail: 'Vehicle wash, humidifier, misting, dental, industrial or process system' },
      { value: 'none-no-water-system', label: 'No water system under our control', detail: 'Use only after confirming no premises or work activity creates exposure responsibility' },
      { value: 'unknown-water-system', label: 'Water system is uncertain', detail: 'Ownership, assets or system layout needs checking' },
    ],
    signalHeading: 'Which water-risk signals apply?',
    signalHelp: 'These factors affect the risk assessment depth and provider competence. They do not mean legionella is present.',
    signalOptions: [
      { value: 'stored-hot-water', label: 'Stored hot water or calorifiers', detail: 'Water is heated and stored rather than produced only at the outlet' },
      { value: 'cold-water-storage', label: 'Cold-water storage tanks', detail: 'Stored water condition, turnover and temperature need assessment' },
      { value: 'recirculation', label: 'Recirculating hot-water system', detail: 'Flow, return, temperature and balance affect control' },
      { value: 'showers-spray', label: 'Showers or aerosol-producing outlets', detail: 'Spray can create an exposure route if the system is contaminated' },
      { value: 'vulnerable-users', label: 'People with increased susceptibility', detail: 'Age, illness or reduced immunity changes consequence and control needs' },
      { value: 'little-used-outlets', label: 'Little-used outlets or vacant areas', detail: 'Low turnover and stagnation need to be identified' },
      { value: 'temperature-concerns', label: 'Temperature or control concerns', detail: 'Monitoring indicates control targets are missed or uncertain' },
      { value: 'previous-positive', label: 'Previous positive sample or case concern', detail: 'Investigation and specialist control review may be required' },
      { value: 'unknown-controls', label: 'Controls and records are uncertain', detail: 'Responsibility, monitoring or the written scheme needs checking' },
      { value: 'no-complex-water-signals', label: 'None of these complexity signals', detail: 'A simple system still needs a suitable dutyholder assessment' },
    ],
    assetLabel: 'Water outlets in scope',
    secondaryLabel: 'Tanks, calorifiers or other main assets',
    documentationLabel: 'Existing assessment, schematic and control records',
    documentationOptions: sharedDocumentation,
    inspectionLabel: 'Current risk-assessment position',
    inspectionOptions: [
      { value: 'none', label: 'No assessment found' },
      { value: 'in-date', label: 'Assessment is recorded and believed current' },
      { value: 'overdue-or-unknown', label: 'Assessment exists but review status is unclear' },
      { value: 'new-system', label: 'New premises or water system' },
    ],
    resultResourceHeading: 'Assessment comes before the control programme',
    resultResourceBody: 'The assessment identifies the system, sources of risk, people exposed and controls required. Its findings should drive a written scheme with responsibilities, monitoring, maintenance and review. Routine sampling is not an automatic substitute for assessing and controlling the system.',
    primaryLinks: [
      { label: 'HSE ACOP L8', detail: 'Legal duties, risk assessment and control principles', url: 'https://www.hse.gov.uk/pubns/priced/l8.pdf' },
      { label: 'HSE HSG274', detail: 'Technical guidance for cooling, hot and cold, and other water systems', url: 'https://www.hse.gov.uk/pubns/books/hsg274.htm' },
      { label: 'HSE employer responsibilities', detail: 'Practical dutyholder steps and competence', url: 'https://www.hse.gov.uk/legionnaires/employers-responsibilities.htm' },
    ],
    priceEvidence: [
      { label: 'Birmingham Water Solutions', url: 'https://birminghamwatersolutions.com/pages/resources/legionella-risk-assessment-cost', note: 'Publishes £250 to £450 for a stated small low-complexity building and higher bands for larger systems.' },
      { label: 'Aqua Legion UK', url: 'https://www.aqualegion.com/', note: 'Publishes set-price packages from £295 plus VAT based on location, complexity and time.' },
      { label: 'uRisk', url: 'https://www.urisk.co.uk/how-much-does-a-legionella-risk-assessment-cost/', note: 'Publishes commercial assessments from £300 plus VAT and a stated range for larger or more complex sites.' },
    ],
  },
  'pat-testing': {
    id: 'pat-testing',
    name: 'portable electrical equipment inspection and testing',
    shortName: 'PAT and electrical equipment checks',
    eyebrow: 'Electrical equipment maintenance finder',
    question: 'Does my workplace equipment need PAT testing?',
    promise: 'Check whether testing fits the maintenance risk in about 2 minutes.',
    description: 'Separate the legal maintenance duty from the annual-PAT myth, estimate a visible inspection and testing range, and compare sourced UK providers.',
    legalBasis: 'The Electricity at Work Regulations 1989 require electrical equipment that may cause danger to be maintained so far as is reasonably practicable. They do not prescribe annual PAT testing. Inspection and test frequency should follow equipment type, use and environment.',
    legalSource: 'https://www.hse.gov.uk/electricity/faq-portable-appliance-testing.htm',
    guidePath: '/pat-testing/do-i-need-pat-testing',
    costPath: '/pat-testing/cost',
    supplierPath: '/pat-testing/suppliers',
    toolkitPath: '/pat-testing/buying-toolkit',
    workHeading: 'Which electrical equipment is under your control?',
    workHelp: 'Include movable, portable, stationary and fixed equipment supplied for work. A plug is not the legal boundary.',
    workOptions: [
      { value: 'office-it', label: 'Office and IT equipment', detail: 'Computers, monitors, chargers, printers, kettles and extension leads' },
      { value: 'hospitality-kitchen', label: 'Hospitality or kitchen equipment', detail: 'Portable and stationary appliances used by staff or guests' },
      { value: 'tools-construction', label: 'Tools or construction equipment', detail: 'Hand tools, transformers, leads and equipment used in harsher conditions' },
      { value: 'hire-equipment', label: 'Equipment supplied for hire', detail: 'Items inspected before issue or after return under a risk-based regime' },
      { value: 'rented-appliances', label: 'Appliances supplied with rented premises', detail: 'Electrical equipment provided for tenants, guests or residents' },
      { value: 'care-education', label: 'Care, education or public-use equipment', detail: 'Equipment used by staff, residents, pupils, patients or visitors' },
      { value: 'fixed-stationary', label: 'Fixed or stationary electrical equipment', detail: 'Equipment that is not portable but still needs maintenance planning' },
      { value: 'repaired-secondhand', label: 'Repaired, second-hand or returned equipment', detail: 'Equipment whose condition or repair history needs verification' },
      { value: 'none-controlled-equipment', label: 'No electrical equipment under our control', detail: 'Use only after checking employer, landlord and equipment-supply responsibilities' },
      { value: 'unknown-equipment', label: 'Equipment scope is uncertain', detail: 'Ownership, location or equipment categories need an inventory' },
    ],
    signalHeading: 'Which risk and use signals apply?',
    signalHelp: 'These signals help decide whether user checks, formal visual inspection, combined testing or specialist inspection is proportionate.',
    signalOptions: [
      { value: 'frequently-moved', label: 'Frequently moved or handled', detail: 'Leads, plugs and casings receive more wear than static office equipment' },
      { value: 'harsh-environment', label: 'Wet, dusty, outdoor or harsh use', detail: 'The environment raises the chance or consequence of damage' },
      { value: 'visible-damage', label: 'Damage or user concerns reported', detail: 'Damaged equipment should be removed from use and assessed promptly' },
      { value: 'public-or-hired', label: 'Used by the public or hired out', detail: 'Control, condition and user familiarity can vary between uses' },
      { value: 'earthed-equipment', label: 'Class I or earthed equipment', detail: 'Combined inspection and electrical tests may be needed to verify protection' },
      { value: 'repair-or-change', label: 'Repair, modification or change of use', detail: 'The maintenance regime should address the changed condition' },
      { value: 'cannot-disconnect', label: 'Business-critical or difficult to disconnect', detail: 'Access, shutdown and test method must be agreed before attendance' },
      { value: 'unknown-maintenance', label: 'Maintenance regime is unknown', detail: 'No clear inspection frequency, ownership or defect process is recorded' },
      { value: 'no-higher-risk-signals', label: 'None of these higher-risk signals', detail: 'Low-risk equipment may still need user checks or formal visual inspection' },
    ],
    assetLabel: 'Electrical equipment items in scope',
    secondaryLabel: 'Fixed, specialist or shutdown-sensitive items',
    documentationLabel: 'Equipment inventory, previous results and defect records',
    documentationOptions: sharedDocumentation,
    inspectionLabel: 'Current maintenance and inspection position',
    inspectionOptions: [
      { value: 'none', label: 'No inspection or maintenance regime found' },
      { value: 'in-date', label: 'Risk-based regime is recorded and current' },
      { value: 'overdue-or-unknown', label: 'Last checks or next review are unclear' },
      { value: 'new-system', label: 'New site, equipment batch or maintenance regime' },
    ],
    resultResourceHeading: 'PAT is one maintenance tool, not an annual legal certificate',
    resultResourceBody: 'HSE says the law requires equipment to be maintained to prevent danger, but does not prescribe an annual portable appliance test. A suitable regime can combine user checks, formal visual inspection, combined inspection and testing, repair controls and records according to risk.',
    primaryLinks: [
      { label: 'HSE PAT frequently asked questions', detail: 'Legal position, competence, records and risk-based frequency', url: 'https://www.hse.gov.uk/electricity/faq-portable-appliance-testing.htm' },
      { label: 'HSE INDG236', detail: 'Low-risk equipment checks and suggested initial frequencies', url: 'https://www.hse.gov.uk/pubns/indg236.htm' },
      { label: 'Electricity at Work Regulations regulation 4', detail: 'Legal maintenance duty for electrical systems and equipment', url: 'https://www.legislation.gov.uk/uksi/1989/635/regulation/4' },
    ],
    priceEvidence: [
      { label: 'Safety-PAT', url: 'https://safetypat.co.uk/prices-pat-testing/', note: 'Publishes a £25 site rate for up to ten appliances and a per-appliance structure for larger batches in its stated area.' },
      { label: 'PAT Checked', url: 'https://www.patchecked.co.uk/pricing/', note: 'Publishes a £70 minimum call-out and item rates by volume for its Midlands service.' },
      { label: 'London PAT', url: 'https://www.londonpat.com/', note: 'Publishes £80 plus VAT for up to 50 items and volume pricing for Inner London.' },
    ],
  },
  tm44: {
    id: 'tm44',
    name: 'TM44 air-conditioning inspection',
    shortName: 'TM44 inspections',
    eyebrow: 'Air-conditioning inspection finder',
    question: 'Does my air-conditioning system need a TM44 inspection?',
    promise: 'Check the 12 kW threshold and build a comparable inspection brief in about 2 minutes.',
    description: 'Check likely TM44 relevance in England and Wales, understand the inspection and report, estimate a planning range and compare sourced providers.',
    legalBasis: 'In England and Wales, air-conditioning systems with a combined effective rated output above 12 kW must be inspected by an accredited energy assessor at intervals not exceeding five years.',
    legalSource: 'https://www.gov.uk/government/publications/air-conditioning-inspections-for-buildings/a-guide-to-air-conditioning-inspections',
    guidePath: '/tm44/do-i-need-a-tm44-inspection',
    costPath: '/tm44/cost',
    supplierPath: '/tm44/suppliers',
    toolkitPath: '/tm44/buying-toolkit',
    workHeading: 'What air-conditioning equipment is controlled as part of the building system?',
    workHelp: 'Count the combined effective rated output of systems under the same control. Several smaller units can together exceed 12 kW.',
    workOptions: [
      { value: 'split-multisplit', label: 'Split or multi-split systems', detail: 'Wall, cassette, ducted or floor units connected to outdoor units' },
      { value: 'vrf-vrv', label: 'VRF or VRV system', detail: 'Multi-zone variable refrigerant flow equipment and controls' },
      { value: 'chiller-ahu', label: 'Chiller or air-handling plant', detail: 'Central cooling plant, chilled water and associated AHUs' },
      { value: 'mixed-comfort-cooling', label: 'Mixed comfort-cooling systems', detail: 'Several equipment types serving offices, retail, hospitality or public premises' },
      { value: 'server-room-cooling', label: 'Server-room cooling', detail: 'Dedicated comfort or close-control cooling serving IT spaces' },
      { value: 'process-cooling', label: 'Process or production cooling', detail: 'Cooling connected to industrial or production activity' },
      { value: 'multiple-buildings', label: 'Systems across several buildings', detail: 'A portfolio or site with separate system boundaries' },
      { value: 'none-air-conditioning', label: 'No air-conditioning system', detail: 'Ventilation or heating only, with no mechanical cooling' },
      { value: 'unknown-air-conditioning', label: 'Equipment scope is uncertain', detail: 'The plant list, system boundary or cooling function is unclear' },
    ],
    signalHeading: 'Which capacity and inspection signals apply?',
    signalHelp: 'Use equipment labels, maintenance records or a plant schedule where available. Unknown capacity is a reason to verify, not proof that the duty applies.',
    signalOptions: [
      { value: 'combined-over-12kw', label: 'Combined capacity above 12 kW', detail: 'Several units under the same control together exceed the threshold' },
      { value: 'single-system-over-12kw', label: 'A system is above 12 kW', detail: 'One system has an effective rated output over 12 kW' },
      { value: 'single-control', label: 'Several units under one control', detail: 'Units serve one building or are managed as one system' },
      { value: 'report-over-five-years', label: 'Report is more than five years old', detail: 'The previous inspection date is outside the normal maximum interval' },
      { value: 'no-report', label: 'No TM44 report found', detail: 'No inspection report or register reference is available' },
      { value: 'new-system', label: 'New or altered system', detail: 'New plant, controls or capacity may change the system boundary' },
      { value: 'unknown-capacity', label: 'Capacity is unknown', detail: 'Nameplates, schedules or rated outputs need checking' },
      { value: 'no-over-12kw', label: 'Confirmed at or below 12 kW', detail: 'Combined effective rated output has been checked and does not exceed 12 kW' },
    ],
    assetLabel: 'Indoor or outdoor air-conditioning units in scope',
    secondaryLabel: 'Chillers, AHUs or central plant items',
    documentationLabel: 'Plant list, previous TM44 report and maintenance or control records',
    documentationOptions: sharedDocumentation,
    inspectionLabel: 'Current TM44 inspection position',
    inspectionOptions: [
      { value: 'none', label: 'No report or register reference found' },
      { value: 'in-date', label: 'Report is less than five years old' },
      { value: 'overdue-or-unknown', label: 'Report is older than five years or date unknown' },
      { value: 'new-system', label: 'New or materially changed system' },
    ],
    resultResourceHeading: 'TM44 is an energy assessment, not routine maintenance',
    resultResourceBody: 'The inspection reviews accessible equipment, controls, sizing and operating efficiency, then records recommendations. It does not replace servicing, refrigerant leak checks, repairs or workplace safety duties.',
    primaryLinks: [
      { label: 'GOV.UK TM44 inspection guide', detail: 'Scope, 12 kW threshold, inspection cycle and responsibilities', url: 'https://www.gov.uk/government/publications/air-conditioning-inspections-for-buildings/a-guide-to-air-conditioning-inspections' },
      { label: 'GOV.UK inspection summary', detail: 'Accredited assessor, report contents and enforcement information', url: 'https://www.gov.uk/get-your-air-conditioning-system-inspected' },
      { label: 'Energy Performance of Buildings Regulations', detail: 'The England and Wales regulatory framework', url: 'https://www.legislation.gov.uk/uksi/2012/3118/contents' },
    ],
    priceEvidence: [
      { label: 'AccuTemp', url: 'https://accutemp.co.uk/tm44-inspections', note: 'Publishes a fixed price from £450 plus VAT and a stated range of £450 to £1,800 plus VAT for most single-site work.' },
      { label: 'Robinsons Facilities Services', url: 'https://www.robinsonsfs.com/services/tm44-inspection/', note: 'Publishes smaller split-system inspections from £300 plus VAT and larger or central-plant work typically from £400 to £1,000 plus VAT.' },
      { label: 'Heat Pump Installers London', url: 'https://heatpumpinstallerslondon.com/f-gas/tm44-air-conditioning-inspection', note: 'Publishes TM44 inspections from £245 plus VAT for London and the Home Counties.' },
    ],
  },
  'workplace-noise': {
    id: 'workplace-noise', name: 'workplace noise risk assessment', shortName: 'Workplace noise', eyebrow: 'Noise exposure assessment finder',
    question: 'Do I need a workplace noise risk assessment?',
    promise: 'Check exposure signals and prepare a comparable survey brief in about 2 minutes.',
    description: 'Identify when employee noise exposure calls for assessment, see what the work should cover, estimate a planning range and compare sourced providers.',
    legalBasis: 'Under the Control of Noise at Work Regulations 2005, employers must assess risks when employees are likely to be exposed at or above the lower exposure action value: 80 dB(A) daily or weekly exposure, or 135 dB(C) peak sound pressure. This is a Great Britain guide.',
    legalSource: 'https://www.hse.gov.uk/noise/employers.htm',
    guidePath: '/workplace-noise/do-i-need-a-noise-assessment', costPath: '/workplace-noise/cost', supplierPath: '/workplace-noise/suppliers', toolkitPath: '/workplace-noise/buying-toolkit',
    workHeading: 'Which work exposes employees to noise?',
    workHelp: 'Select the tasks and processes, including intermittent or impact noise. The risk depends on level, duration and worker exposure.',
    workOptions: [
      { value: 'machining', label: 'Machining or metal fabrication', detail: 'CNC work, grinding, cutting, presses or fabrication' },
      { value: 'woodworking-noise', label: 'Woodworking machinery', detail: 'Sawing, planing, routing or sanding' },
      { value: 'construction-tools', label: 'Construction or maintenance tools', detail: 'Drilling, breaking, cutting or powered hand tools' },
      { value: 'food-production', label: 'Food or drink production', detail: 'Processing, filling, packaging or bottling lines' },
      { value: 'vehicle-workshop', label: 'Vehicle workshop', detail: 'Compressed air, impact tools, testing or repair work' },
      { value: 'entertainment-music', label: 'Music or entertainment work', detail: 'Amplified sound affecting employees or performers' },
      { value: 'variable-shifts', label: 'Variable tasks or shifts', detail: 'Employees move between noisy and quieter activities' },
      { value: 'none-noisy-work', label: 'No potentially noisy work identified', detail: 'Employees are not exposed to intrusive or impact noise at work' },
      { value: 'unknown-noise-work', label: 'Unsure what work is in scope', detail: 'Tasks or employee exposure have not been mapped' },
    ],
    signalHeading: 'What exposure indicators apply?',
    signalHelp: 'Conversation tests are screening clues from HSE, not sound measurements or a personal exposure calculation.',
    signalOptions: [
      { value: 'intrusive-six-hours', label: 'Intrusive noise for much of a shift', detail: 'Normal conversation is possible, but noise is intrusive for around six hours' },
      { value: 'shout-two-metres', label: 'Shouting at two metres', detail: 'Workers need to shout to speak clearly at two metres for around two hours' },
      { value: 'impact-noise', label: 'Short loud impacts', detail: 'Hammering, presses, explosions or other peak noise' },
      { value: 'existing-80db', label: 'Existing evidence near 80 dB(A) exposure', detail: 'Earlier measurements or reliable data suggest the lower action value' },
      { value: 'hearing-concern', label: 'Worker hearing concerns', detail: 'Reports of ringing ears, hearing difficulty or noise complaints' },
      { value: 'changed-process', label: 'Plant or work pattern changed', detail: 'New machinery, production rate, layout or shift duration' },
      { value: 'unknown-exposure', label: 'Exposure is unknown', detail: 'No reliable task duration or noise data is available' },
      { value: 'no-exposure-signal', label: 'No listed indicator', detail: 'No intrusive, impact or measured concern identified' },
    ],
    assetLabel: 'Noisy tasks or process areas to assess', secondaryLabel: 'Worker groups or shifts needing exposure estimates',
    documentationLabel: 'Machine data, earlier surveys and task-duration records', documentationOptions: sharedDocumentation,
    inspectionLabel: 'Current workplace noise assessment',
    inspectionOptions: [
      { value: 'none', label: 'No assessment recorded' }, { value: 'in-date', label: 'Assessment reflects current work' },
      { value: 'overdue-or-unknown', label: 'Assessment status or validity uncertain' }, { value: 'new-system', label: 'New or changed work pattern' },
    ],
    resultResourceHeading: 'A risk assessment is more than a noise reading',
    resultResourceBody: 'HSE expects a reliable estimate of employees’ daily or weekly exposures, comparison with action and limit values, identified controls and an action plan. Measurement is useful where existing information cannot establish exposure.',
    primaryLinks: [
      { label: 'HSE employer duties', detail: 'Action values and employer requirements', url: 'https://www.hse.gov.uk/noise/employers.htm' },
      { label: 'HSE assessing noise risks', detail: 'Exposure estimates, records, controls and competence', url: 'https://www.hse.gov.uk/noise/risks.htm' },
      { label: 'Control of Noise at Work Regulations 2005', detail: 'Legal text for risk assessment and exposure controls', url: 'https://www.legislation.gov.uk/uksi/2005/1643/regulation/5' },
    ],
    priceEvidence: [
      { label: 'NOVA Acoustics', url: 'https://www.novaacoustics.co.uk/noise-at-work-surveys-and-assessments/', note: 'Publishes £800 to £900 plus VAT for smaller straightforward workplace assessments.' },
      { label: 'The Safety Effect', url: 'https://www.consultmesh.co.uk/service/workplace-noise-assessments/', note: 'Publishes £595 to £1,975 as the range of work undertaken in 2025.' },
      { label: 'LESH Safety', url: 'https://www.leshonline.co.uk/costofworkplacenoisesurvey', note: 'Publishes £850 to £1,500 for smaller straightforward assessments and higher prices for complex sites.' },
    ],
  },
  'hand-arm-vibration': {
    id: 'hand-arm-vibration', name: 'hand-arm vibration risk assessment', shortName: 'Hand-arm vibration', eyebrow: 'Vibration exposure assessment finder',
    question: 'Do I need a hand-arm vibration risk assessment?',
    promise: 'Check tool-use signals and prepare a comparable assessment brief in about 2 minutes.',
    description: 'Map powered-tool use, trigger time and existing vibration data; see likely scope, a planning range and sourced providers.',
    legalBasis: 'The Control of Vibration at Work Regulations 2005 require Great Britain employers to assess and control risks from hand-arm vibration. The daily exposure action value is 2.5 m/s² A(8) and the limit value is 5 m/s² A(8). HSE says an initial assessment can use representative existing data and trigger time; measurement is not automatically necessary.',
    legalSource: 'https://www.hse.gov.uk/vibration/hav/responsibilities.htm',
    guidePath: '/hand-arm-vibration/do-i-need-a-vibration-assessment', costPath: '/hand-arm-vibration/cost', supplierPath: '/hand-arm-vibration/suppliers', toolkitPath: '/hand-arm-vibration/buying-toolkit',
    workHeading: 'Which vibrating tools or processes are used?',
    workHelp: 'Include powered tools held or guided by hand. This guide does not assess whole-body vibration from vehicle seats.',
    workOptions: [
      { value: 'hammer-tools', label: 'Hammer-action tools', detail: 'Breakers, hammer drills, chipping hammers or needle scalers' },
      { value: 'grinders-cutters', label: 'Grinders or cutters', detail: 'Angle grinders, cut-off tools, saws or polishers' },
      { value: 'rotary-tools', label: 'Rotary and drilling tools', detail: 'Drills, sanders, routers or similar powered tools' },
      { value: 'forestry-landscape', label: 'Forestry or grounds tools', detail: 'Chainsaws, strimmers, hedge trimmers or mowers guided by hand' },
      { value: 'impact-assembly', label: 'Impact assembly or repair', detail: 'Impact wrenches, riveters or other vibrating workshop tools' },
      { value: 'multiple-tools', label: 'Several tools in a worker’s day', detail: 'Exposure from more than one tool or task must be combined' },
      { value: 'none-vibrating-tools', label: 'No relevant hand-held tools identified', detail: 'No regular hand-transmitted vibration from work equipment' },
      { value: 'unknown-vibrating-work', label: 'Unsure what is in scope', detail: 'Tool inventory or worker tasks have not been mapped' },
    ],
    signalHeading: 'What exposure clues apply?',
    signalHelp: 'HSE’s time examples are rough screening guides, not legal pass/fail cut-offs for every tool.',
    signalOptions: [
      { value: 'hammer-fifteen-minutes', label: 'Hammer tools around 15 minutes or more daily', detail: 'HSE flags this as a possible action-value exposure' },
      { value: 'rotary-one-hour', label: 'Some rotary tools around one hour or more daily', detail: 'A rough HSE action-value signal for some tools' },
      { value: 'manufacturer-warning', label: 'Tool handbook warns of vibration risk', detail: 'Manufacturer data or warnings need checking against actual use' },
      { value: 'existing-eav', label: 'Previous estimate near or above the action value', detail: 'Earlier data or exposure points suggest controls may be needed' },
      { value: 'worker-concern', label: 'Worker reports a vibration-related concern', detail: 'Do not enter personal medical information here; arrange appropriate advice' },
      { value: 'changed-tools', label: 'Tools or work pattern changed', detail: 'New equipment, materials, duration or maintenance condition' },
      { value: 'unknown-trigger-time', label: 'Actual trigger time is unknown', detail: 'Hours on site are not the same as hands-on vibrating time' },
      { value: 'no-vibration-signal', label: 'No listed exposure clue', detail: 'No warning, duration or prior evidence selected' },
    ],
    assetLabel: 'Distinct tool or process groups', secondaryLabel: 'Worker groups or tasks needing exposure estimates',
    documentationLabel: 'Tool data, trigger-time records and earlier assessments', documentationOptions: sharedDocumentation,
    inspectionLabel: 'Current vibration risk assessment',
    inspectionOptions: [
      { value: 'none', label: 'No assessment recorded' }, { value: 'in-date', label: 'Assessment reflects current work' },
      { value: 'overdue-or-unknown', label: 'Assessment status uncertain' }, { value: 'new-system', label: 'New tools or changed work pattern' },
    ],
    resultResourceHeading: 'Trigger time and vibration magnitude both matter',
    resultResourceBody: 'HSE expects a reasonable estimate of each worker’s daily exposure, using representative tool vibration data and actual hands-on trigger time. A competent person should decide whether direct measurement is needed, then identify controls and health-surveillance implications.',
    primaryLinks: [
      { label: 'HSE employer responsibilities', detail: 'Duties and exposure action and limit values', url: 'https://www.hse.gov.uk/vibration/hav/responsibilities.htm' },
      { label: 'HSE vibration risk assessment', detail: 'Tool inventory, trigger time and exposure estimation', url: 'https://www.hse.gov.uk/vibration/hav/assessrisks.htm' },
      { label: 'HSE measurement guidance', detail: 'When direct tool measurement is warranted', url: 'https://www.hse.gov.uk/vibration/hav/measurement-monitoring.htm' },
    ],
    priceEvidence: [
      { label: 'Air Dust Odour', url: 'https://www.airdustodour.co.uk/noise-assessment-cost-uk.html', note: 'Publishes around £600–£1,000 plus VAT for a single-site HAV risk-assessment method, or £900–£1,500 plus VAT with direct tool measurement. One provider example, not a market median.' },
      { label: 'SGS United Kingdom', url: 'https://www.sgs.com/en-gb/services/hand-arm-vibration-assessments', note: 'Describes tailored assessment and measurement; no numeric public tariff on the checked page.' },
      { label: 'SOCOTEC UK', url: 'https://www.socotec.co.uk/our-services/occupational-hygiene/hand-arm-and-whole-body-vibration-assessments', note: 'Describes on-site assessment and control advice; no numeric public tariff on the checked page.' },
    ],
  },
  'commercial-eicr': {
    id: 'commercial-eicr', name: 'commercial electrical installation condition report', shortName: 'Commercial EICR', eyebrow: 'Fixed wiring inspection finder',
    question: 'Does my workplace need a fixed wiring inspection?',
    promise: 'Check the maintenance signals and build an EICR quote brief in about 2 minutes.',
    description: 'Identify fixed-installation risks, understand what an EICR covers, estimate a source-linked planning range and compare evidenced providers.',
    legalBasis: 'The Electricity at Work Regulations 1989 require electrical systems to be maintained to prevent danger so far as reasonably practicable. HSE advises arranging inspection and testing of fixed wiring. The Regulations do not impose a universal five-year EICR interval for commercial premises.',
    legalSource: 'https://www.hse.gov.uk/electricity/introduction.htm',
    guidePath: '/commercial-eicr/do-i-need-a-commercial-eicr', costPath: '/commercial-eicr/cost', supplierPath: '/commercial-eicr/suppliers', toolkitPath: '/commercial-eicr/buying-toolkit',
    workHeading: 'Which fixed electrical installations are in scope?',
    workHelp: 'Count distribution boards and final circuits later. Portable plug-in appliances are a separate service.',
    workOptions: [
      { value: 'office-retail', label: 'Office or retail fixed wiring', detail: 'Distribution boards, lighting, sockets and wired-in equipment' },
      { value: 'industrial', label: 'Industrial or workshop installation', detail: 'Three-phase distribution, machinery supplies or harsh conditions' },
      { value: 'hospitality', label: 'Hospitality or leisure premises', detail: 'Customer areas, kitchens, plant and back-of-house circuits' },
      { value: 'multi-site', label: 'Several premises', detail: 'A comparable programme needs a board and circuit schedule for each site' },
      { value: 'special-location', label: 'Wet or other special location', detail: 'Pools, washdown areas or locations needing specialist inspection planning' },
      { value: 'none-fixed', label: 'No controlled fixed installation identified', detail: 'The premises boundary or responsibility may still need confirmation' },
      { value: 'unknown-installation', label: 'Unsure what is controlled', detail: 'Lease or asset records do not establish the installation boundary' },
    ],
    signalHeading: 'Why is inspection being considered?',
    signalHelp: 'These are risk and procurement clues, not a statutory interval calculator.',
    signalOptions: [
      { value: 'damage-fault', label: 'Damage, fault or overheating is reported', detail: 'Dangerous conditions need competent attention now, not a routine booking queue' },
      { value: 'deterioration', label: 'Age or environment may have caused deterioration', detail: 'Wet, dusty, corrosive or mechanically demanding conditions' },
      { value: 'no-current-report', label: 'No useful current installation report', detail: 'The scope and condition of the fixed wiring are not evidenced' },
      { value: 'change-of-use', label: 'Use, tenancy or installation changed', detail: 'A material change can affect the safety basis and inspection plan' },
      { value: 'insurer-request', label: 'Insurer or client requests an EICR', detail: 'A contractual request is distinct from a universal statutory interval' },
      { value: 'unknown-condition', label: 'Installation condition is unknown', detail: 'A competent person should help set inspection scope and timing' },
      { value: 'no-electrical-signal', label: 'No listed concern', detail: 'No trigger selected does not prove the installation is safe' },
    ],
    assetLabel: 'Distribution boards or consumer units', secondaryLabel: 'Approximate final circuits',
    documentationLabel: 'Circuit schedules, previous EICR and maintenance records', documentationOptions: sharedDocumentation,
    inspectionLabel: 'Current fixed-wiring inspection position',
    inspectionOptions: [
      { value: 'none', label: 'No EICR or equivalent record found' }, { value: 'in-date', label: 'Current report and actions reviewed' },
      { value: 'overdue-or-unknown', label: 'Due date or condition uncertain' }, { value: 'new-system', label: 'New or materially changed installation' },
    ],
    resultResourceHeading: 'Maintenance duty is not a universal five-year certificate rule',
    resultResourceBody: 'HSE says electrical installations must be maintained to prevent danger and fixed wiring should be inspected and tested. A competent person sets the scope and risk-based interval. An EICR records condition, limitations and coded observations; it does not itself repair defects.',
    primaryLinks: [
      { label: 'HSE electrical safety', detail: 'Maintenance and fixed-wiring inspection advice', url: 'https://www.hse.gov.uk/electricity/introduction.htm' },
      { label: 'Electricity at Work regulation 4', detail: 'Legal system-maintenance duty', url: 'https://www.legislation.gov.uk/uksi/1989/635/regulation/4' },
      { label: 'HSE inspection interval clarification', detail: 'No universal statutory interval; competent-person judgement', url: 'https://www.hse.gov.uk/healthservices/faqs.htm' },
    ],
    priceEvidence: [
      { label: 'Hexo Electrical Testing', url: 'https://hexoelectricaltesting.co.uk/prices/fixed-wire-testing-prices/', note: 'London and South East weekday tariff: £169 + VAT for up to ten circuits, then £10 + VAT per additional circuit. Larger premises require a bespoke quote.' },
      { label: 'District Group Services', url: 'https://www.districtgroupservices.co.uk/wp-content/uploads/District-Group-Prices.pdf', note: 'Its 2024/25 commercial schedule lists £50 + VAT per main switch and £19 + VAT per circuit. Historical provider tariff, not a current national quote.' },
      { label: 'Dale Montague Electrical', url: 'https://www.dme-ltd.co.uk/pricing-structure', note: 'Publishes a £168 minimum, £60 per board and £18 per circuit, excluding VAT. Confirm the date and local applicability.' },
    ],
  },
}

const labelFor = (definition: ServiceDefinition, value: string) =>
  [...definition.workOptions, ...definition.signalOptions].find((option) => option.value === value)?.label ?? value

const routineExtinguisherTypes = ['water-foam', 'co2', 'powder', 'wet-chemical']
export function isRoutineExtinguisherBrief(answers: ServiceAssessmentAnswers): boolean {
  return answers.serviceId === 'fire-extinguisher-servicing' && answers.sites === 1 && answers.secondaryCount === 0
    && Number.isInteger(answers.assetCount) && answers.assetCount >= 1
    && answers.workTypes.length > 0 && answers.workTypes.every((type) => routineExtinguisherTypes.includes(type))
    && !answers.riskSignals.some((signal) => ['used-damaged', 'extended-due', 'unknown-history', 'changed-risk'].includes(signal))
    && answers.inspectionStatus !== 'new-system'
}

function qualifyExtinguisherServicing(answers: ServiceAssessmentAnswers): QualificationResult {
  const definition = serviceDefinitions['fire-extinguisher-servicing']
  const traditional = answers.workTypes.some((type) => routineExtinguisherTypes.includes(type))
  const installed = traditional || answers.workTypes.includes('service-free')
  const serviceConcern = answers.riskSignals.some((signal) => ['service-due', 'missing-records', 'used-damaged', 'extended-due', 'unknown-history'].includes(signal))
  let status: QualificationResult['status'] = 'no-obvious-trigger'
  if (traditional && (serviceConcern || ['none', 'overdue-or-unknown'].includes(answers.inspectionStatus))) status = 'likely-relevant'
  else if (installed || answers.workTypes.includes('unknown-units') || answers.riskSignals.includes('changed-risk')) status = 'may-be-relevant'
  if (answers.workTypes.includes('service-free') && answers.riskSignals.includes('used-damaged')) status = 'likely-relevant'
  if (['scotland', 'northern-ireland'].includes(answers.region) && status === 'likely-relevant') status = 'may-be-relevant'
  const scope = installed || answers.workTypes.includes('unknown-units') ? [
    'Confirm unit identity, type, capacity, location and manufacturer maintenance programme',
    'Agree basic service, extended work or inspection scope for each unit',
    'Inspect condition and relevant pressure or weight indicators with a competent technician',
    'Identify faults, missing units and selection or siting concerns for the responsible person',
    'Record item-level work, labels, limitations and next maintenance actions',
    'Price recharge, overhaul, replacement and disposal separately before authorising work',
  ] : ['Review firefighting provision in the fire risk assessment', 'Ask a competent person to decide equipment selection, positioning and commissioning before requesting routine service prices']
  const caveats = [
    'This questionnaire is a procurement indication; it does not inspect equipment or establish legal compliance.',
    'The statutory duty described here is for England and Wales. Scotland and Northern Ireland have separate fire-safety law.',
    'Home Office offices and shops maintenance intervals are guidance for England; confirm the actual manufacturer programme.',
  ]
  if (answers.workTypes.includes('service-free')) caveats.push('P50 and other service-free units need their specific inspection programme checked. Do not assume they require a traditional annual contractor service.')
  if (answers.riskSignals.includes('used-damaged')) caveats.push('A used, damaged or suspect unit needs prompt competent attention and suitable interim provision arranged by the responsible person. Do not attempt pressure work yourself.')
  const factors = [...answers.workTypes, ...answers.riskSignals.filter((signal) => signal !== 'no-concern')].map((value) => `${labelFor(definition, value)} was selected`)
  factors.push(`Service record position: ${definition.inspectionOptions.find((option) => option.value === answers.inspectionStatus)?.label ?? answers.inspectionStatus}`)
  return { status, score: factors.length, triggeredFactors: factors, scope, caveats, complexity: answers.sites > 1 || answers.riskSignals.some((signal) => ['used-damaged', 'extended-due'].includes(signal)) ? 'complex' : 'standard' }
}

export function qualifyService(answers: ServiceAssessmentAnswers): QualificationResult {
  if (answers.serviceId === 'fire-door-inspection') return qualifyFireDoors(answers)
  if (answers.serviceId === 'kitchen-extract-cleaning') return qualifyKitchenExtract(answers)
  if (answers.serviceId === 'fire-extinguisher-servicing') return qualifyExtinguisherServicing(answers)
  const definition = serviceDefinitions[answers.serviceId]
  const factors: string[] = []
  const positiveWork = answers.workTypes.filter((value) => !value.startsWith('none-'))
  const positiveSignals = answers.riskSignals.filter((value) => !value.startsWith('no-') && !value.startsWith('unknown-'))

  positiveWork.forEach((value) => factors.push(`${labelFor(definition, value)} was selected`))
  positiveSignals.forEach((value) => factors.push(`${labelFor(definition, value)} affects the assessment or service scope`))
  if (answers.inspectionStatus === 'none') factors.push(answers.serviceId === 'fire-alarm-servicing' ? 'No fire-alarm service record was identified' : answers.serviceId === 'emergency-lighting' ? 'No emergency-lighting test record was identified' : answers.serviceId === 'pat-testing' ? 'No recorded electrical-equipment inspection or maintenance regime was identified' : answers.serviceId === 'commercial-eicr' ? 'No previous fixed-installation condition report was identified' : answers.serviceId === 'workplace-noise' ? 'No current workplace noise assessment was identified' : answers.serviceId === 'hand-arm-vibration' ? 'No current hand-arm vibration assessment was identified' : 'No previous statutory examination record was identified')
  if (answers.inspectionStatus === 'overdue-or-unknown') factors.push(answers.serviceId === 'fire-alarm-servicing' ? 'The fire-alarm service position is overdue or uncertain' : answers.serviceId === 'emergency-lighting' ? 'The emergency-lighting test position is overdue or uncertain' : answers.serviceId === 'pat-testing' ? 'The inspection and maintenance position is uncertain' : answers.serviceId === 'commercial-eicr' ? 'The fixed-wiring inspection and maintenance position is uncertain' : answers.serviceId === 'workplace-noise' ? 'The existing noise assessment may not reflect current work' : answers.serviceId === 'hand-arm-vibration' ? 'The existing vibration assessment may not reflect current tool use' : 'The examination position is overdue or uncertain')
  if (answers.inspectionStatus === 'new-system') factors.push(answers.serviceId === 'fire-alarm-servicing' ? 'A new or altered alarm needs commissioning records and a maintenance plan' : answers.serviceId === 'emergency-lighting' ? 'New or changed escape-lighting provision needs commissioning and a testing plan' : answers.serviceId === 'pat-testing' ? 'New equipment or a new site needs visual checking and a maintenance decision' : answers.serviceId === 'commercial-eicr' ? 'A new or changed installation needs its certification and inspection plan checked' : answers.serviceId === 'workplace-noise' ? 'New or changed work patterns need noise-exposure consideration' : answers.serviceId === 'hand-arm-vibration' ? 'New tools or changed trigger times need vibration-exposure consideration' : 'New, installed or assembled equipment needs pre-use consideration')
  if (answers.projectReason === 'change') factors.push('A material change, repair or relocation was identified')
  if (answers.documentationStatus !== 'available') factors.push('Supporting records are missing, incomplete or uncertain')

  let status: QualificationResult['status'] = 'no-obvious-trigger'
  if (answers.serviceId === 'lev') {
    if (positiveWork.length && answers.assetCount > 0) status = 'likely-relevant'
    else if (answers.riskSignals.includes('unknown-system') || positiveWork.length) status = 'may-be-relevant'
  }
  if (answers.serviceId === 'pressure-systems') {
    if (positiveSignals.length) status = 'likely-relevant'
    else if (answers.riskSignals.includes('unknown-fluid') || answers.workTypes.includes('unknown-pressure')) status = 'may-be-relevant'
  }
  if (answers.serviceId === 'loler') {
    if (positiveWork.length && !answers.workTypes.includes('unknown-lifting')) status = 'likely-relevant'
    else if (positiveWork.length || answers.riskSignals.includes('unknown-use')) status = 'may-be-relevant'
  }
  if (answers.serviceId === 'asbestos') {
    const intrusive = answers.workTypes.some((value) => ['refurbishment', 'demolition'].includes(value)) || answers.riskSignals.includes('planned-disturbance')
    const asbestosRiskSignals = ['built-before-2000', 'suspect-material', 'no-register', 'damaged-material', 'previous-findings']
    const dutySignals = answers.workTypes.some((value) => ['occupied-non-domestic', 'common-parts', 'maintenance-work'].includes(value)) && asbestosRiskSignals.some((value) => answers.riskSignals.includes(value))
    if (intrusive || dutySignals) status = 'likely-relevant'
    else if (answers.workTypes.includes('property-acquisition') || answers.workTypes.includes('unknown-use') || answers.riskSignals.includes('unknown-building-age')) status = 'may-be-relevant'
  }
  if (answers.serviceId === 'fire-risk-assessment') {
    const inScopePremises = positiveWork.filter((value) => value !== 'unknown-premises')
    if (inScopePremises.length) status = 'likely-relevant'
    else if (answers.workTypes.includes('unknown-premises')) status = 'may-be-relevant'
  }
  if (answers.serviceId === 'legionella') {
    const inScopeSystems = positiveWork.filter((value) => value !== 'unknown-water-system')
    if (inScopeSystems.length && answers.assetCount > 0) status = 'likely-relevant'
    else if (answers.workTypes.includes('unknown-water-system') || positiveSignals.length) status = 'may-be-relevant'
  }
  if (answers.serviceId === 'pat-testing') {
    const knownEquipment = positiveWork.filter((value) => value !== 'unknown-equipment')
    const strongTestSignals = ['harsh-environment', 'visible-damage', 'public-or-hired', 'earthed-equipment', 'repair-or-change']
    const testSignalSelected = strongTestSignals.some((value) => answers.riskSignals.includes(value))
    const highExposureWork = ['tools-construction', 'hire-equipment', 'repaired-secondhand'].some((value) => answers.workTypes.includes(value))
    if (knownEquipment.length && answers.assetCount > 0 && (testSignalSelected || highExposureWork)) status = 'likely-relevant'
    else if (knownEquipment.length || answers.workTypes.includes('unknown-equipment') || answers.riskSignals.includes('unknown-maintenance')) status = 'may-be-relevant'
  }
  if (answers.serviceId === 'tm44') {
    const knownCooling = positiveWork.filter((value) => value !== 'unknown-air-conditioning')
    const overThreshold = answers.riskSignals.some((value) => ['combined-over-12kw', 'single-system-over-12kw'].includes(value))
    if (knownCooling.length && overThreshold) status = 'likely-relevant'
    else if (answers.workTypes.includes('unknown-air-conditioning') || answers.riskSignals.includes('unknown-capacity') || (knownCooling.length && !answers.riskSignals.includes('no-over-12kw'))) status = 'may-be-relevant'
  }
  if (answers.serviceId === 'workplace-noise') {
    const knownWork = positiveWork.filter((value) => value !== 'unknown-noise-work')
    const exposureClue = ['intrusive-six-hours', 'shout-two-metres', 'impact-noise', 'existing-80db', 'hearing-concern'].some((value) => answers.riskSignals.includes(value))
    if (knownWork.length && exposureClue) status = 'likely-relevant'
    else if (knownWork.length || answers.workTypes.includes('unknown-noise-work') || answers.riskSignals.includes('unknown-exposure')) status = 'may-be-relevant'
    if (answers.region === 'northern-ireland' && status === 'likely-relevant') status = 'may-be-relevant'
  }
  if (answers.serviceId === 'hand-arm-vibration') {
    const knownTools = positiveWork.filter((value) => value !== 'unknown-vibrating-work')
    const exposureClue = ['hammer-fifteen-minutes', 'rotary-one-hour', 'manufacturer-warning', 'existing-eav', 'worker-concern'].some((value) => answers.riskSignals.includes(value))
    if (knownTools.length && exposureClue) status = 'likely-relevant'
    else if (knownTools.length || answers.workTypes.includes('unknown-vibrating-work') || answers.riskSignals.includes('unknown-trigger-time')) status = 'may-be-relevant'
    if (answers.region === 'northern-ireland' && status === 'likely-relevant') status = 'may-be-relevant'
  }
  if (answers.serviceId === 'commercial-eicr') {
    const knownInstallation = positiveWork.some((value) => value !== 'unknown-installation')
    const riskClue = ['damage-fault', 'deterioration', 'no-current-report', 'change-of-use'].some((value) => answers.riskSignals.includes(value))
    if (knownInstallation && (riskClue || answers.inspectionStatus === 'none')) status = 'likely-relevant'
    else if (knownInstallation || riskClue || answers.workTypes.includes('unknown-installation') || answers.riskSignals.includes('unknown-condition') || answers.riskSignals.includes('insurer-request')) status = 'may-be-relevant'
    if (answers.region === 'northern-ireland' && status === 'likely-relevant') status = 'may-be-relevant'
  }
  if (answers.serviceId === 'emergency-lighting') {
    const installed = answers.workTypes.some((value) => ['self-contained', 'central-battery', 'self-test', 'multi-building'].includes(value))
    const provisionConcern = answers.riskSignals.some((value) => ['route-change', 'dark-route'].includes(value))
    const testConcern = answers.riskSignals.some((value) => ['test-due', 'failed-fitting', 'missing-logbook'].includes(value))
    if (installed && (testConcern || answers.inspectionStatus === 'none' || answers.inspectionStatus === 'overdue-or-unknown')) status = 'likely-relevant'
    else if (installed || provisionConcern || answers.workTypes.includes('unknown-system') || answers.riskSignals.includes('unknown-duration')) status = 'may-be-relevant'
    if (['scotland', 'northern-ireland'].includes(answers.region) && status === 'likely-relevant') status = 'may-be-relevant'
  }
  if (answers.serviceId === 'fire-alarm-servicing') {
    const installed = answers.workTypes.some((value) => ['conventional-panel', 'addressable-panel', 'wireless-system', 'monitored-system', 'multi-building'].includes(value))
    const maintenanceClue = ['service-due', 'panel-fault', 'false-alarms', 'missing-logbook'].some((value) => answers.riskSignals.includes(value))
    if (installed && (maintenanceClue || answers.inspectionStatus === 'none' || answers.inspectionStatus === 'overdue-or-unknown')) status = 'likely-relevant'
    else if (installed || answers.workTypes.includes('unknown-system') || answers.riskSignals.includes('changed-layout')) status = 'may-be-relevant'
    if (['scotland', 'northern-ireland'].includes(answers.region) && status === 'likely-relevant') status = 'may-be-relevant'
  }

  const complexWork = answers.serviceId === 'lev'
    ? ['spray-booth', 'recirculating', 'laboratory-fume'].some((value) => answers.workTypes.includes(value) || answers.riskSignals.includes(value))
    : answers.serviceId === 'pressure-systems'
      ? ['steam-boiler', 'refrigeration', 'process-vessel'].some((value) => answers.workTypes.includes(value))
      : answers.serviceId === 'loler'
        ? ['passenger-lift', 'mewp', 'crane-hoist'].some((value) => answers.workTypes.includes(value))
        : answers.serviceId === 'asbestos'
          ? ['refurbishment', 'demolition'].some((value) => answers.workTypes.includes(value)) || ['planned-disturbance', 'damaged-material'].some((value) => answers.riskSignals.includes(value))
          : answers.serviceId === 'fire-risk-assessment'
            ? ['sleeping-accommodation', 'care-education', 'mixed-use', 'construction-site'].some((value) => answers.workTypes.includes(value)) || ['sleeping-risk', 'vulnerable-occupants', 'dangerous-substances', 'shared-responsibility'].some((value) => answers.riskSignals.includes(value))
            : answers.serviceId === 'legionella'
              ? ['care-healthcare', 'leisure-spa', 'cooling-system', 'process-water'].some((value) => answers.workTypes.includes(value)) || ['recirculation', 'vulnerable-users', 'previous-positive'].some((value) => answers.riskSignals.includes(value))
              : answers.serviceId === 'pat-testing'
                ? ['tools-construction', 'hire-equipment', 'care-education', 'fixed-stationary'].some((value) => answers.workTypes.includes(value)) || ['harsh-environment', 'visible-damage', 'public-or-hired', 'cannot-disconnect'].some((value) => answers.riskSignals.includes(value))
                : answers.serviceId === 'tm44'
                  ? ['vrf-vrv', 'chiller-ahu', 'mixed-comfort-cooling', 'process-cooling', 'multiple-buildings'].some((value) => answers.workTypes.includes(value))
                  : answers.serviceId === 'fire-alarm-servicing'
                    ? ['addressable-panel', 'wireless-system', 'monitored-system', 'multi-building'].some((value) => answers.workTypes.includes(value)) || answers.riskSignals.includes('panel-fault')
                  : answers.serviceId === 'emergency-lighting'
                    ? ['central-battery', 'self-test', 'multi-building'].some((value) => answers.workTypes.includes(value)) || answers.riskSignals.includes('failed-fitting')
                  : answers.serviceId === 'commercial-eicr'
                    ? ['industrial', 'special-location', 'multi-site'].some((value) => answers.workTypes.includes(value)) || answers.riskSignals.includes('damage-fault')
                  : answers.serviceId === 'workplace-noise'
                    ? ['impact-noise', 'variable-shifts', 'entertainment-music'].some((value) => answers.workTypes.includes(value) || answers.riskSignals.includes(value))
                    : ['hammer-tools', 'multiple-tools', 'forestry-landscape'].some((value) => answers.workTypes.includes(value)) || answers.riskSignals.includes('worker-concern')
  const score = positiveWork.length * 2 + positiveSignals.length * 2 + Math.min(answers.assetCount, 5) + (answers.sites > 1 ? 2 : 0) + (complexWork ? 4 : 0)
  const complexity = score >= 10 || answers.sites > 2 || answers.assetCount > 8 || complexWork ? 'complex' : 'standard'

  const scope = answers.serviceId === 'lev'
    ? [
        'Review of the process, contaminant and intended control performance',
        'Physical examination of hoods, ductwork, air cleaner, fan and discharge',
        'Airflow, pressure and capture-performance measurements at identified test points',
        'Comparison with commissioning or previous performance information where available',
        'Assessment of control effectiveness, defects and prioritised remedial actions',
        'A system-specific report, next-test date and information suitable for the LEV record',
      ]
    : answers.serviceId === 'pressure-systems'
      ? [
          'Confirm the system boundary, relevant fluid and safe operating limits',
          'Identify vessels, relevant pipework and every protective device within scope',
          'Draw up, review or certify the written scheme of examination as required',
          'Specify examination nature, preparation, frequency and any special safety measures',
          'Examine the covered parts in accordance with the written scheme',
          'Issue reports, identify repairs and deal with any imminent-danger findings',
        ]
      : answers.serviceId === 'loler' ? [
          'Validate an itemised asset and lifting-accessory register',
          'Confirm examination triggers and intervals for each equipment group',
          'Systematic examination of safety-critical parts by an equipment-competent person',
          'Functional checks or supplementary tests where the competent person requires them',
          'Written Schedule 1 report, next due date and clearly graded defects',
          'Immediate escalation and enforcing-authority reporting where legally required',
        ] : answers.serviceId === 'asbestos' ? [
          'Confirm the dutyholder, premises boundary, building age and available records',
          'Select a management or refurbishment and demolition survey for the actual decision',
          'Agree accessible areas, intrusive access, exclusions, sampling and reinstatement before attendance',
          'Inspect relevant areas and arrange accredited laboratory analysis where samples are taken',
          'Record locations, extent, condition and material or priority assessments as appropriate',
          'Deliver a usable report, register information and clear actions for management or planned work',
        ] : answers.serviceId === 'fire-risk-assessment' ? [
          'Confirm the responsible person, premises boundary, use, occupiers and shared responsibilities',
          'Identify fire hazards, ignition sources, fuel sources and people at risk',
          'Evaluate escape, detection, warning, firefighting, compartmentation and management measures',
          'Consider vulnerable people, dangerous substances and relevant fire-safety systems',
          'Record significant findings, prioritised actions and the emergency-plan implications',
          'Set review triggers and provide a written record the responsible person can maintain',
        ] : answers.serviceId === 'legionella' ? [
          'Confirm the dutyholder, responsible person, premises and water-system boundaries',
          'Build or verify a water-system schematic and asset or outlet inventory',
          'Identify conditions supporting growth, aerosol exposure routes and susceptible people',
          'Evaluate existing temperature, turnover, cleaning, monitoring and maintenance controls',
          'Define a written control scheme with responsibilities, tasks, limits and corrective actions',
          'Record findings, priorities, competence needs and triggers for assessment review',
        ] : answers.serviceId === 'pat-testing' ? [
          'Confirm who controls the equipment, premises, users and maintenance decisions',
          'Build or verify an itemised electrical-equipment inventory and risk groups',
          'Define user checks, formal visual inspection and combined test requirements by risk',
          'Agree shutdowns, access, exclusions and treatment of fixed or specialist equipment',
          'Inspect and test the agreed items with recorded results and clear pass or fail status',
          'Deliver the register, defects, removed-from-use actions and risk-based next-review plan',
        ] : answers.serviceId === 'tm44' ? [
          'Confirm the person in control, building boundary and systems counted together',
          'Verify effective rated output from plant schedules, labels and available records',
          'Review accessible equipment, refrigerant and air systems, controls and maintenance information',
          'Assess sizing, operating efficiency and opportunities to reduce energy use',
          'Record faults, recommendations, limitations and supporting evidence in the inspection report',
          'Lodge the report and keep its reference, inspection date and next due date available',
        ] : answers.serviceId === 'fire-alarm-servicing' ? [
          'Confirm the responsible person, fire risk assessment, panel type and system boundary',
          'List panels, detectors, call points, sounders, visual alarms and monitored or controlled interfaces',
          'Review logbook, weekly user tests, previous service reports, false alarms and open defects',
          'Agree safe test timing and notify the alarm receiving centre before and after testing where connected',
          'Inspect panel, power and representative devices under the agreed competent-person service plan',
          'Reset and restore the system; report tests, limitations, faults and separate remedial actions',
        ] : answers.serviceId === 'emergency-lighting' ? [
          'Confirm the fire risk assessment, responsible person, escape routes and installed system boundary',
          'List each luminaire, exit sign, central unit, test facility and designed rated duration',
          'Agree monthly function or annual full-duration testing as appropriate to the maintenance plan',
          'Plan safe timing and temporary precautions while batteries recharge after a full discharge',
          'Record each fitting, test result, failed component, limitation and prompt defect action',
          'Restore the system, confirm charging indicators and update the site test log',
        ] : answers.serviceId === 'commercial-eicr' ? [
          'Agree the premises boundary, distribution boards, main switches and final circuits',
          'Review previous EICR, installation certificates, circuit schedules and defect actions',
          'Plan safe isolation, access, operating restrictions and any agreed sampling limitations',
          'Inspect and test the fixed installation using a competent person and suitable instruments',
          'Issue an EICR with circuit results, coded observations, overall outcome and limitations',
          'Separate urgent make-safe action, remedial quotations and later reinspection from the inspection fee',
        ] : answers.serviceId === 'workplace-noise' ? [
          'Map noisy tasks, process areas, worker groups and time spent on each activity',
          'Review existing machine data and earlier surveys; take representative measurements where needed',
          'Estimate personal daily or weekly exposure and relevant peak levels',
          'Compare exposures with the action and limit values in the GB regulations',
          'Review noise reduction at source, work organisation, hearing protection and health-surveillance needs',
          'Provide a written risk assessment with uncertainty, priorities, owners and review triggers',
        ] : [
          'Inventory hand-held or hand-guided tools, tasks, users and tool condition',
          'Determine actual hands-on trigger time for each tool and worker group',
          'Review representative manufacturer or field vibration data and its limitations',
          'Estimate combined daily A(8) exposure or exposure points against action and limit values',
          'Decide whether competent direct measurement is needed because suitable data is unavailable',
          'Record controls, training, health-surveillance implications, owners and review triggers',
        ]

  const lightingInstalled = answers.serviceId === 'emergency-lighting' && answers.workTypes.some((value) => ['self-contained', 'central-battery', 'self-test', 'multi-building'].includes(value))
  const alarmInstalled = answers.serviceId === 'fire-alarm-servicing' && answers.workTypes.some((value) => ['conventional-panel', 'addressable-panel', 'wireless-system', 'monitored-system', 'multi-building'].includes(value))
  if (answers.serviceId === 'fire-alarm-servicing' && !alarmInstalled) scope.splice(0, scope.length,
    'Confirm the responsible person, fire risk assessment, premises and warning arrangements',
    'Ask a competent fire-risk or alarm designer whether an installed system is needed',
    'Scope design and installation separately from routine service of any future system')
  if (answers.serviceId === 'emergency-lighting' && !lightingInstalled) scope.splice(0, scope.length,
    'Confirm the responsible person, fire risk assessment and escape-route layout',
    'Identify routes that may lack adequate illumination if normal lighting fails',
    'Ask a competent fire-risk or lighting specialist whether installed provision is needed',
    'Scope design and installation separately from testing of any future system')
  if (answers.documentationStatus !== 'available') scope.unshift(answers.serviceId === 'fire-alarm-servicing' ? alarmInstalled ? 'Reconstruct the device schedule and logbook before agreeing service coverage' : 'Find or update the fire risk assessment before buying alarm installation' : answers.serviceId === 'emergency-lighting' ? lightingInstalled ? 'Reconstruct the luminaire schedule, fire-risk decision and test log before agreeing the testing boundary' : 'Find or update the fire risk assessment before deciding on installation' : answers.serviceId === 'commercial-eicr' ? 'Confirm board and circuit counts and recover missing installation records before agreeing the testing boundary' : answers.serviceId === 'workplace-noise' ? 'Reconstruct task durations, worker groups and available noise information before estimating exposure' : answers.serviceId === 'hand-arm-vibration' ? 'Reconstruct tool data and trigger times before estimating exposure' : 'Reconstruct or verify missing equipment and baseline information before examination')

  return {
    status,
    score,
    triggeredFactors: factors.length ? factors : ['No clear statutory trigger was selected from the information supplied'],
    caveats: [
      `This finder is an initial procurement aid, not a ${definition.name.toLowerCase()} or legal determination.`,
      answers.serviceId === 'asbestos'
        ? 'A competent person must confirm the premises boundary, survey type, access, exclusions and project requirements.'
        : answers.serviceId === 'fire-risk-assessment'
          ? 'The responsible person must confirm that the assessment is suitable and sufficient for the premises, people and risks.'
          : answers.serviceId === 'legionella'
            ? 'A competent person must confirm the water-system boundary, exposure risks, controls and responsible-person arrangements.'
            : answers.serviceId === 'pat-testing'
              ? 'A competent person must confirm the equipment boundary and decide which user checks, visual inspections and electrical tests are proportionate to risk.'
              : answers.serviceId === 'tm44'
                ? 'This finder covers the England and Wales TM44 rules. An accredited energy assessor must confirm the system boundary, rated output and inspection requirement.'
                : answers.serviceId === 'fire-alarm-servicing'
                  ? ['scotland', 'northern-ireland'].includes(answers.region) ? 'This finder cites the Fire Safety Order for England and Wales. Confirm the applicable local duty and servicing plan with a competent fire-safety adviser.' : 'The fire risk assessment decides the appropriate warning system. A competent service engineer must confirm the installed system, scope, test coverage and defect response.'
                : answers.serviceId === 'emergency-lighting'
                  ? ['scotland', 'northern-ireland'].includes(answers.region) ? 'This finder cites the Fire Safety Order for England and Wales. Confirm the applicable local fire-safety duty and test programme with a competent person.' : 'The fire risk assessment determines where emergency lighting is needed; a competent person must confirm system design, test method, rated duration and remedial action.'
                : answers.serviceId === 'commercial-eicr'
                  ? answers.region === 'northern-ireland' ? 'This guide cites Great Britain regulations. Confirm the applicable Northern Ireland duties and inspection approach with a competent electrician.' : 'The law requires safe maintenance, not a universal commercial EICR interval. A competent electrician must confirm the inspection scope, timing and response to defects.'
                : answers.serviceId === 'workplace-noise'
                  ? answers.region === 'northern-ireland' ? 'This guide describes Great Britain rules. Northern Ireland has separate legislation; confirm the applicable duty with a competent adviser.' : 'A competent person must confirm exposure estimates, whether measurements are necessary and proportionate controls.'
                  : answers.serviceId === 'hand-arm-vibration'
                    ? answers.region === 'northern-ireland' ? 'This guide describes Great Britain rules. Confirm the applicable Northern Ireland duty with a competent adviser.' : 'A competent person must confirm actual trigger times, representative vibration data, exposure estimates and whether direct measurement is needed.'
                : 'A competent person must confirm the equipment boundary, operating conditions, exclusions and examination requirements.',
    ],
    scope,
    complexity,
  }
}

export const SERVICE_PRICE_MODELS = {
  'fire-door-inspection': FIRE_DOOR_PRICE_MODEL,
  'kitchen-extract-cleaning': { version: KITCHEN_EXTRACT_PRICE_MODEL.version, spread: 0 },
  'fire-extinguisher-servicing': {
    version: 'rcr-published-basic-service-2026-10-04', attendance: 15, perUnit: 7.5, spread: 0.25,
  },
  lev: {
    version: 'published-provider-calibration-2026-08-31', baseVisit: 225, perSystem: 185, perExtraPoint: 28,
    complexSystem: 220, missingBaseline: 90, additionalSite: 190, spread: 0.24,
  },
  'pressure-systems': {
    version: 'simple-system-calibration-2026-08-31', baseVisit: 280, perAsset: 115, perProtectiveDevice: 32,
    newWrittenScheme: 240, complexSystem: 380, additionalSite: 230, spread: 0.3,
  },
  loler: {
    version: 'published-provider-calibration-2026-08-31', baseVisit: 180, perMainItem: 82, perAccessory: 11,
    peopleLiftingItem: 35, complexEquipment: 95, additionalSite: 175, spread: 0.25,
  },
  asbestos: {
    version: 'published-provider-calibration-2026-09-10', baseVisit: 350, perBuilding: 250, perSample: 35,
    intrusiveSurvey: 250, complexPremises: 450, additionalSite: 300, spread: 0.28,
  },
  'fire-risk-assessment': {
    version: 'published-provider-calibration-2026-09-11', baseVisit: 200, perFloor: 65, perOccupancy: 45,
    sleepingOrVulnerable: 250, complexPremises: 350, additionalSite: 200, spread: 0.3,
  },
  legionella: {
    version: 'published-provider-calibration-2026-09-12', baseVisit: 250, perOutlet: 8, perMainAsset: 45,
    higherRiskSystem: 300, complexSystem: 400, additionalSite: 225, spread: 0.28,
  },
  'pat-testing': {
    version: 'published-provider-calibration-2026-09-13', baseVisit: 55, perItem: 1.2, perSpecialistItem: 6,
    complexSite: 65, additionalSite: 50, spread: 0.25,
  },
  tm44: {
    version: 'published-provider-calibration-2026-09-14', baseVisit: 300, perUnit: 40, perCentralPlant: 150,
    complexSystem: 300, missingRecords: 100, additionalSite: 250, spread: 0.25,
  },
  'workplace-noise': {
    version: 'published-provider-calibration-2026-09-29', baseVisit: 500, perTask: 65, perWorkerGroup: 45,
    complexSurvey: 350, missingRecords: 80, additionalSite: 400, spread: 0.25,
  },
  'hand-arm-vibration': {
    version: 'single-provider-anchor-2026-09-30', baseVisit: 600, perToolGroup: 50, perWorkerGroup: 40,
    directMeasurement: 350, missingRecords: 80, additionalSite: 400, spread: 0.25,
  },
  'commercial-eicr': {
    version: 'published-provider-tariff-curves-2026-10-01', tenCircuitVisit: 169, extraCircuit: 10,
    districtPerBoard: 50, districtPerCircuit: 19, spread: 0,
  },
  'emergency-lighting': {
    version: 'published-provider-anchor-2026-10-02', firstTwentyFivePoints: 160, extraPoint: 6, spread: 0.25,
  },
  'fire-alarm-servicing': {
    version: 'published-provider-device-tiers-2026-10-03', upToTwenty: 170, upToForty: 220, upToSixty: 270, spread: 0.25,
  },
} as const

export function estimateServicePrice(
  answers: ServiceAssessmentAnswers,
  result = qualifyService(answers),
): PriceEstimate {
  if (answers.serviceId === 'fire-door-inspection') return estimateFireDoors(answers)
  if (answers.serviceId === 'kitchen-extract-cleaning') return estimateKitchenExtract(answers, result)
  const factors: PriceEstimate['factors'] = []
  if (answers.serviceId === 'fire-extinguisher-servicing') {
    const model = SERVICE_PRICE_MODELS['fire-extinguisher-servicing']
    if (!isRoutineExtinguisherBrief(answers)) return {
      low: 0, high: 0, currency: 'GBP', factors: [],
      assumptions: ['An itemised quotation is required for unknown, service-free, used or damaged units, extended servicing, fire blankets or several sites.', 'No zero-cost service is implied. Confirm the inventory, manufacturer programme and required work.'],
    }
    factors.push({ label: 'RCR published standard attendance', amount: model.attendance }, { label: `${answers.assetCount} basic services at the RCR published unit rate`, amount: answers.assetCount * model.perUnit })
    const anchor = model.attendance + answers.assetCount * model.perUnit
    return { low: Math.floor(anchor * (1 - model.spread)), high: Math.ceil(anchor * (1 + model.spread)), currency: 'GBP', factors,
      assumptions: ['One planned basic-service visit at one site; exact unit count is correct.', 'The anchor is one local provider tariff, excluding VAT, checked on 4 October 2026. It is not a national market rate or a quote from the matched providers.', 'The 25% planning margin is a Vendor Atlas configuration choice, not measured quote variation.', 'RCR travel beyond 50 miles from its Suffolk base costs extra; that charge is not modelled. Obtain a local quotation.', 'Refills, discharge tests, overhaul, replacement units, disposal, fire blankets, access equipment and urgent attendance are excluded.'] }
  }
  if (answers.serviceId === 'lev') {
    const model = SERVICE_PRICE_MODELS.lev
    factors.push({ label: 'Site attendance and report setup', amount: model.baseVisit })
    factors.push({ label: `${answers.assetCount} LEV system${answers.assetCount === 1 ? '' : 's'}`, amount: answers.assetCount * model.perSystem })
    if (answers.secondaryCount > 5) factors.push({ label: `${answers.secondaryCount - 5} extraction points above the first five`, amount: (answers.secondaryCount - 5) * model.perExtraPoint })
    if (result.complexity === 'complex') factors.push({ label: 'Complex system or measurement allowance', amount: model.complexSystem })
    if (answers.documentationStatus !== 'available') factors.push({ label: 'Missing baseline or commissioning information', amount: model.missingBaseline })
    if (answers.sites > 1) factors.push({ label: `${answers.sites - 1} additional site attendance allowance`, amount: (answers.sites - 1) * model.additionalSite })
  } else if (answers.serviceId === 'pressure-systems') {
    const model = SERVICE_PRICE_MODELS['pressure-systems']
    factors.push({ label: 'Competent-person attendance and reporting', amount: model.baseVisit })
    factors.push({ label: `${answers.assetCount} pressure plant item${answers.assetCount === 1 ? '' : 's'}`, amount: answers.assetCount * model.perAsset })
    if (answers.secondaryCount) factors.push({ label: `${answers.secondaryCount} protective device${answers.secondaryCount === 1 ? '' : 's'} to identify`, amount: answers.secondaryCount * model.perProtectiveDevice })
    if (answers.inspectionStatus === 'none' || answers.inspectionStatus === 'new-system') factors.push({ label: 'New written-scheme preparation allowance', amount: model.newWrittenScheme })
    if (result.complexity === 'complex') factors.push({ label: 'Complex pressure-system allowance', amount: model.complexSystem })
    if (answers.sites > 1) factors.push({ label: `${answers.sites - 1} additional site attendance allowance`, amount: (answers.sites - 1) * model.additionalSite })
  } else if (answers.serviceId === 'loler') {
    const model = SERVICE_PRICE_MODELS.loler
    factors.push({ label: 'Minimum site attendance and reporting', amount: model.baseVisit })
    factors.push({ label: `${answers.assetCount} main lifting-equipment item${answers.assetCount === 1 ? '' : 's'}`, amount: answers.assetCount * model.perMainItem })
    if (answers.secondaryCount) factors.push({ label: `${answers.secondaryCount} lifting accessor${answers.secondaryCount === 1 ? 'y' : 'ies'}`, amount: answers.secondaryCount * model.perAccessory })
    if (answers.riskSignals.includes('lifts-people')) factors.push({ label: 'People-lifting examination allowance', amount: answers.assetCount * model.peopleLiftingItem })
    if (result.complexity === 'complex') factors.push({ label: 'Complex equipment allowance', amount: model.complexEquipment })
    if (answers.sites > 1) factors.push({ label: `${answers.sites - 1} additional site attendance allowance`, amount: (answers.sites - 1) * model.additionalSite })
  } else if (answers.serviceId === 'asbestos') {
    const model = SERVICE_PRICE_MODELS.asbestos
    factors.push({ label: 'Survey planning, attendance and report setup', amount: model.baseVisit })
    factors.push({ label: `${answers.assetCount} building or block${answers.assetCount === 1 ? '' : 's'} in scope`, amount: answers.assetCount * model.perBuilding })
    if (answers.secondaryCount) factors.push({ label: `${answers.secondaryCount} sample or suspect-location allowance`, amount: answers.secondaryCount * model.perSample })
    if (answers.workTypes.some((value) => ['refurbishment', 'demolition'].includes(value)) || answers.riskSignals.includes('planned-disturbance')) factors.push({ label: 'Intrusive refurbishment or demolition survey allowance', amount: model.intrusiveSurvey })
    if (result.complexity === 'complex') factors.push({ label: 'Complex premises, access or risk allowance', amount: model.complexPremises })
    if (answers.sites > 1) factors.push({ label: `${answers.sites - 1} additional site attendance allowance`, amount: (answers.sites - 1) * model.additionalSite })
  } else if (answers.serviceId === 'fire-risk-assessment') {
    const model = SERVICE_PRICE_MODELS['fire-risk-assessment']
    factors.push({ label: 'Assessment planning, attendance and report setup', amount: model.baseVisit })
    factors.push({ label: `${answers.assetCount} floor or level${answers.assetCount === 1 ? '' : 's'} in scope`, amount: answers.assetCount * model.perFloor })
    if (answers.secondaryCount) factors.push({ label: `${answers.secondaryCount} separate occupanc${answers.secondaryCount === 1 ? 'y' : 'ies'}`, amount: answers.secondaryCount * model.perOccupancy })
    if (answers.riskSignals.some((value) => ['sleeping-risk', 'vulnerable-occupants'].includes(value))) factors.push({ label: 'Sleeping or vulnerable-occupant assessment allowance', amount: model.sleepingOrVulnerable })
    if (result.complexity === 'complex') factors.push({ label: 'Complex premises or fire-risk allowance', amount: model.complexPremises })
    if (answers.sites > 1) factors.push({ label: `${answers.sites - 1} additional site attendance allowance`, amount: (answers.sites - 1) * model.additionalSite })
  } else if (answers.serviceId === 'legionella') {
    const model = SERVICE_PRICE_MODELS.legionella
    factors.push({ label: 'Assessment planning, attendance and report setup', amount: model.baseVisit })
    factors.push({ label: `${answers.assetCount} water outlet${answers.assetCount === 1 ? '' : 's'} in scope`, amount: answers.assetCount * model.perOutlet })
    if (answers.secondaryCount) factors.push({ label: `${answers.secondaryCount} tank, calorifier or main asset${answers.secondaryCount === 1 ? '' : 's'}`, amount: answers.secondaryCount * model.perMainAsset })
    if (answers.workTypes.some((value) => ['care-healthcare', 'leisure-spa', 'cooling-system'].includes(value)) || answers.riskSignals.includes('vulnerable-users')) factors.push({ label: 'Higher-risk system or susceptible-person allowance', amount: model.higherRiskSystem })
    if (result.complexity === 'complex') factors.push({ label: 'Complex water-system allowance', amount: model.complexSystem })
    if (answers.sites > 1) factors.push({ label: `${answers.sites - 1} additional site attendance allowance`, amount: (answers.sites - 1) * model.additionalSite })
  } else if (answers.serviceId === 'pat-testing') {
    const model = SERVICE_PRICE_MODELS['pat-testing']
    factors.push({ label: 'Minimum attendance, setup and register', amount: model.baseVisit })
    factors.push({ label: `${answers.assetCount} electrical equipment item${answers.assetCount === 1 ? '' : 's'}`, amount: answers.assetCount * model.perItem })
    if (answers.secondaryCount) factors.push({ label: `${answers.secondaryCount} fixed, specialist or shutdown-sensitive item${answers.secondaryCount === 1 ? '' : 's'}`, amount: answers.secondaryCount * model.perSpecialistItem })
    if (result.complexity === 'complex') factors.push({ label: 'Complex access, equipment or scheduling allowance', amount: model.complexSite })
    if (answers.sites > 1) factors.push({ label: `${answers.sites - 1} additional site attendance allowance`, amount: (answers.sites - 1) * model.additionalSite })
  } else if (answers.serviceId === 'tm44') {
    const model = SERVICE_PRICE_MODELS.tm44
    factors.push({ label: 'Accredited-assessor attendance, report and lodgement', amount: model.baseVisit })
    factors.push({ label: `${answers.assetCount} air-conditioning unit${answers.assetCount === 1 ? '' : 's'} in scope`, amount: answers.assetCount * model.perUnit })
    if (answers.secondaryCount) factors.push({ label: `${answers.secondaryCount} chiller, AHU or central plant item${answers.secondaryCount === 1 ? '' : 's'}`, amount: answers.secondaryCount * model.perCentralPlant })
    if (result.complexity === 'complex') factors.push({ label: 'Complex system or controls allowance', amount: model.complexSystem })
    if (answers.documentationStatus !== 'available') factors.push({ label: 'Missing plant or control records allowance', amount: model.missingRecords })
    if (answers.sites > 1) factors.push({ label: `${answers.sites - 1} additional site attendance allowance`, amount: (answers.sites - 1) * model.additionalSite })
  } else if (answers.serviceId === 'fire-alarm-servicing') {
    const model = SERVICE_PRICE_MODELS['fire-alarm-servicing']
    if (answers.sites === 1 && answers.assetCount <= 60) {
      const tier = answers.assetCount <= 20 ? model.upToTwenty : answers.assetCount <= 40 ? model.upToForty : model.upToSixty
      factors.push({ label: `DME published inspection tier for ${answers.assetCount} alarm point${answers.assetCount === 1 ? '' : 's'}`, amount: tier })
    }
  } else if (answers.serviceId === 'emergency-lighting') {
    const model = SERVICE_PRICE_MODELS['emergency-lighting']
    factors.push({ label: `${Math.max(1, answers.sites)} site test visit${answers.sites === 1 ? '' : 's'}, up to 25 fittings per site`, amount: Math.max(1, answers.sites) * model.firstTwentyFivePoints })
    if (answers.assetCount > 25 * answers.sites) factors.push({ label: `${answers.assetCount - 25 * answers.sites} fittings above the 25-per-site allowance`, amount: (answers.assetCount - 25 * answers.sites) * model.extraPoint })
  } else if (answers.serviceId === 'commercial-eicr') {
    const model = SERVICE_PRICE_MODELS['commercial-eicr']
    const circuits = Math.max(1, answers.secondaryCount)
    const sites = Math.max(1, answers.sites)
    const hexo = model.tenCircuitVisit * sites + Math.max(0, circuits - 10 * sites) * model.extraCircuit
    const district = Math.max(1, answers.assetCount) * model.districtPerBoard + circuits * model.districtPerCircuit
    factors.push({ label: `Hexo weekday example: ${sites} visit${sites === 1 ? '' : 's'}, ${circuits} circuits`, amount: hexo })
    factors.push({ label: `District 2024/25 example: ${Math.max(1, answers.assetCount)} board${answers.assetCount === 1 ? '' : 's'}, ${circuits} circuits`, amount: district })
  } else if (answers.serviceId === 'workplace-noise') {
    const model = SERVICE_PRICE_MODELS['workplace-noise']
    factors.push({ label: 'Survey planning, attendance and written assessment', amount: model.baseVisit })
    factors.push({ label: `${answers.assetCount} task or process area${answers.assetCount === 1 ? '' : 's'}`, amount: answers.assetCount * model.perTask })
    if (answers.secondaryCount) factors.push({ label: `${answers.secondaryCount} worker group${answers.secondaryCount === 1 ? '' : 's'} or shift${answers.secondaryCount === 1 ? '' : 's'}`, amount: answers.secondaryCount * model.perWorkerGroup })
    if (result.complexity === 'complex') factors.push({ label: 'Variable, impact or complex-exposure allowance', amount: model.complexSurvey })
    if (answers.documentationStatus !== 'available') factors.push({ label: 'Missing task-duration or prior-survey records', amount: model.missingRecords })
    if (answers.sites > 1) factors.push({ label: `${answers.sites - 1} additional site attendance allowance`, amount: (answers.sites - 1) * model.additionalSite })
  } else {
    const model = SERVICE_PRICE_MODELS['hand-arm-vibration']
    factors.push({ label: 'Tool inventory, exposure assessment and written action plan', amount: model.baseVisit })
    factors.push({ label: `${answers.assetCount} tool or process group${answers.assetCount === 1 ? '' : 's'}`, amount: answers.assetCount * model.perToolGroup })
    if (answers.secondaryCount) factors.push({ label: `${answers.secondaryCount} worker group${answers.secondaryCount === 1 ? '' : 's'} or task pattern${answers.secondaryCount === 1 ? '' : 's'}`, amount: answers.secondaryCount * model.perWorkerGroup })
    if (result.complexity === 'complex') factors.push({ label: 'Specialist measurement planning allowance for a complex brief', amount: model.directMeasurement })
    if (answers.documentationStatus !== 'available') factors.push({ label: 'Missing tool or trigger-time records allowance', amount: model.missingRecords })
    if (answers.sites > 1) factors.push({ label: `${answers.sites - 1} additional site attendance allowance`, amount: (answers.sites - 1) * model.additionalSite })
  }

  if (answers.serviceId === 'fire-alarm-servicing' && (answers.assetCount > 60 || answers.sites > 1)) return {
    low: 0, high: 0, currency: 'GBP', factors: [],
    assumptions: ['Bespoke quote required: the published device tiers stop at 60 points and do not cover a multi-site programme.', 'Record device counts, panels, monitoring links, site access and the service depth for comparable quotations.'],
  }
  const midpoint = factors.reduce((total, factor) => total + factor.amount, 0)
  if (answers.serviceId === 'commercial-eicr') {
    return {
      low: Math.min(...factors.map((factor) => factor.amount)), high: Math.max(...factors.map((factor) => factor.amount)), currency: 'GBP', factors,
      assumptions: [
        'This is a comparison of two published provider tariff formulas, not a national market range or supplier quotation',
        'Hexo tariff covers weekday visits in London and the South East; its larger-premises work requires a bespoke quotation',
        'For multiple sites the Hexo example assumes circuits are distributed evenly enough for the ten-circuit inclusion at each site; obtain per-site counts before relying on it',
        'District Group Services upper comparison uses its published 2024/25 schedule, not a confirmed current tariff',
        'Approximate total circuit count and board count are correct; costs for complex, inaccessible or three-phase installations may be higher',
        'VAT, parking, travel, out-of-hours work, remedial repairs, repeat tests and specialist access are excluded',
      ],
    }
  }
  const spread = SERVICE_PRICE_MODELS[answers.serviceId].spread
  const lowFloor = answers.serviceId === 'pat-testing' ? 50 : 150
  const highFloor = answers.serviceId === 'pat-testing' ? 75 : 200
  return {
    low: Math.max(lowFloor, Math.round((midpoint * (1 - spread)) / 25) * 25),
    high: Math.max(highFloor, Math.round((midpoint * (1 + spread)) / 25) * 25),
    currency: 'GBP',
    factors,
    assumptions: [
      'One planned visit per site during normal working hours',
      answers.serviceId === 'fire-alarm-servicing' ? 'The source price is DME’s fire alarm testing and inspection tier for one site. Confirm whether the scope includes the required competent-person service.' : answers.serviceId === 'emergency-lighting' ? 'This models a routine test of an installed system; no new design, installation or remediation is included. Confirm rated duration and test type.' : answers.serviceId === 'asbestos' ? 'Premises and agreed survey areas are safely accessible' : answers.serviceId === 'fire-risk-assessment' ? 'Premises, records and agreed areas are accessible during the assessment' : answers.serviceId === 'legionella' ? 'Water outlets, plant areas and available records are accessible during the assessment' : answers.serviceId === 'pat-testing' ? 'Equipment is available, identifiable, safely accessible and can be disconnected as agreed' : answers.serviceId === 'tm44' ? 'Air-conditioning equipment, controls and available plant records are safely accessible' : answers.serviceId === 'workplace-noise' ? 'Representative tasks and shifts are accessible; unusual, night or weekend work may need separate attendance' : answers.serviceId === 'hand-arm-vibration' ? 'Tool inventory, representative use and hands-on trigger times are available; measurement is separately scoped where needed' : 'Equipment is available, identifiable and safely accessible for examination',
      'VAT, repairs, replacement parts, specialist access and intrusive testing are excluded',
      'Calibration sources cover only some simple/common jobs and are not an awarded-quote market benchmark',
      'This is deterministic Vendor Atlas planning guidance, not a supplier quotation',
    ],
  }
}

export function defaultServiceAnswers(serviceId: IndustrialServiceId): ServiceAssessmentAnswers {
  return {
    serviceId,
    sector: 'manufacturing',
    workTypes: [],
    riskSignals: [],
    assetCount: 1,
    secondaryCount: serviceId === 'lev' ? 1 : serviceId === 'asbestos' ? 4 : serviceId === 'fire-risk-assessment' ? 1 : serviceId === 'legionella' ? 1 : serviceId === 'commercial-eicr' ? 10 : 0,
    sites: 1,
    size: 'small',
    documentationStatus: 'unknown',
    inspectionStatus: 'overdue-or-unknown',
    projectReason: 'first-examination',
    region: 'midlands',
    postcode: '',
    timescale: 'one-month',
  }
}
