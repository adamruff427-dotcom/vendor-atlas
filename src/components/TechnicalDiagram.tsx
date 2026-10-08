import {
  AirVent,
  CircleGauge,
  Factory,
  Fan,
  FileCheck2,
  Filter,
  Gauge,
  HardHat,
  Link2,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
  UserRound,
  Wind,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { ServiceId } from '../domain/types'

type IndustrialServiceId = Exclude<ServiceId, 'dsear'>
type Node = { title: string; detail: string; icon: LucideIcon }

const diagrams: Record<IndustrialServiceId, { eyebrow: string; title: string; intro: string; nodes: Node[]; evidence: string[]; source: string; sourceLabel: string }> = {
  'fire-door-inspection': {
    eyebrow: 'Check, inspect, act', title: 'Keep routine checks and specialist inspection distinct', intro: 'A visible condition check does not prove hidden construction or fire resistance. Establish the existing fire-safety basis, record defects and agree what specialist work is needed.',
    nodes: [
      { title: 'Basis', detail: 'Fire risk assessment and door schedule', icon: FileCheck2 },
      { title: 'Check', detail: 'Condition and self-closing checks', icon: SearchCheck },
      { title: 'Escalate', detail: 'Defects, uncertain adequacy or survey action', icon: ShieldCheck },
      { title: 'Inspect', detail: 'Agreed non-intrusive or separate intrusive scope', icon: Gauge },
      { title: 'Act', detail: 'Door-level actions and responsible contact', icon: Wrench },
    ], evidence: ['Door identifiers', 'Access limitations', 'Photographed defects', 'Follow-up responsibility'], source: 'https://www.gov.uk/government/publications/fire-safety-england-regulations-2022/fact-sheet-fire-doors-regulation-10', sourceLabel: 'Home Office fire door fact sheet',
  },
  'kitchen-extract-cleaning': {
    eyebrow: 'Clean, verify, record', title: 'Compare the full grease-bearing path, not only the visible canopy', intro: 'Agree the complete system boundary and access before comparing cleaning prices. Hidden duct runs, risers and fans can change the work substantially.',
    nodes: [
      { title: 'Basis', detail: 'Fire-risk actions, system condition and any insurer terms', icon: FileCheck2 },
      { title: 'Map', detail: 'Canopy, filters, plenum, duct route, riser and fan', icon: PackageCheck },
      { title: 'Measure', detail: 'Record the agreed grease-condition evidence points', icon: Gauge },
      { title: 'Clean', detail: 'State access, included sections and excluded work', icon: Wrench },
      { title: 'Record', detail: 'Photos, readings, limitations and next review', icon: FileCheck2 },
    ], evidence: ['System schedule and access points', 'Included and inaccessible sections', 'Before-and-after evidence', 'Repairs and access work separated'], source: 'https://publications.thebesa.com/products/grease-specification-fire-risk-management-kitchen-extraction', sourceLabel: 'BESA TR19 Grease specification',
  },
  'workplace-first-aid-training': {
    eyebrow: 'Assess, train, record', title: 'Turn the employer’s needs assessment into a traceable training brief', intro: 'The employer decides the suitable first-aid arrangements. Once a course and learner numbers are selected, compare the same delivery and record requirements with each provider.',
    nodes: [
      { title: 'Assess', detail: 'Workplace, workforce, hazards and work patterns', icon: FileCheck2 },
      { title: 'Select', detail: 'Employer-chosen course and learner numbers', icon: UserRound },
      { title: 'Book', detail: 'Class size, date, venue and prerequisites', icon: PackageCheck },
      { title: 'Train', detail: 'Course delivery and assessment details', icon: HardHat },
      { title: 'Record', detail: 'Attendance, certificates and review triggers', icon: ShieldCheck },
    ], evidence: ['Current needs assessment', 'Selected course and cohort', 'Provider course and trainer evidence', 'Learner and certificate records'], source: 'https://www.hse.gov.uk/firstaid/what-employers-need-to-do.htm', sourceLabel: 'HSE first-aid employer guidance',
  },
  'fire-extinguisher-servicing': {
    eyebrow: 'Maintenance sequence', title: 'Trace each unit from inventory to recorded action', intro: 'The quote should follow the unit schedule and distinguish basic service from additional work.',
    nodes: [
      { title: 'Inventory', detail: 'Type, capacity, identity and location', icon: PackageCheck },
      { title: 'Programme', detail: 'Manufacturer instructions and service history', icon: FileCheck2 },
      { title: 'Inspect', detail: 'Condition and applicable pressure or weight checks', icon: Gauge },
      { title: 'Act', detail: 'Authorised service, replacement or siting review', icon: Wrench },
      { title: 'Record', detail: 'Item-level work, defects and next actions', icon: FileCheck2 },
    ], evidence: ['Unit schedule', 'Technician competence', 'Service-stage scope', 'Defects and authorised work'], source: 'https://www.bafe.org.uk/bafe-fire-safety-services/fire-extinguisher-service-and-maintenance', sourceLabel: 'BAFE extinguisher service guidance',
  },
  'fire-alarm-servicing': {
    eyebrow: 'Service sequence', title: 'Follow the warning path from device to occupants', intro: 'A service brief connects panel and power checks to field devices, monitored links and a traceable fault record.',
    nodes: [
      { title: 'Panel', detail: 'System identity, zones, event log and power', icon: Gauge },
      { title: 'Inputs', detail: 'Detectors and manual call points', icon: SearchCheck },
      { title: 'Outputs', detail: 'Sounders, visual alarms and controls', icon: Fan },
      { title: 'Links', detail: 'Monitoring and connected functions', icon: Link2 },
      { title: 'Record', detail: 'Faults, restoration and actions', icon: FileCheck2 },
    ],
    evidence: ['Panel and point schedule', 'User test log', 'Service results', 'Defect and restoration record'], source: 'https://www.gov.uk/government/publications/fire-safety-risk-assessment-offices-and-shops/fire-safety-risk-assessment-offices-and-shops-accessible', sourceLabel: 'Home Office fire-safety guide',
  },
  'emergency-lighting': {
    eyebrow: 'Testing sequence', title: 'Test the installed system without losing the escape plan', intro: 'Start with the fire-risk decision and fitting schedule, then agree the test, recharge precautions and failure response.',
    nodes: [
      { title: 'Routes', detail: 'Fire-risk decision and escape paths', icon: SearchCheck },
      { title: 'Inventory', detail: 'Fittings, signs, test points and rated duration', icon: PackageCheck },
      { title: 'Test', detail: 'Function or full-duration method', icon: Gauge },
      { title: 'Restore', detail: 'Supply, charging and temporary precautions', icon: ShieldCheck },
      { title: 'Record', detail: 'Results, defects and logbook actions', icon: FileCheck2 },
    ],
    evidence: ['Fire risk assessment', 'Fitting schedule', 'Rated-duration results', 'Defect and recharge actions'], source: 'https://www.gov.uk/government/publications/fire-safety-risk-assessment-offices-and-shops/fire-safety-risk-assessment-offices-and-shops-accessible', sourceLabel: 'Home Office fire safety guide',
  },
  'commercial-eicr': {
    eyebrow: 'Inspection sequence', title: 'An EICR starts with the installation boundary', intro: 'Board and circuit counts set the quote scope. A competent inspector then plans isolation, tests the agreed installation and records findings.',
    nodes: [
      { title: 'Map', detail: 'Premises, boards, circuits and responsibility', icon: PackageCheck },
      { title: 'Plan', detail: 'Access, safe isolation and agreed limitations', icon: ShieldCheck },
      { title: 'Inspect', detail: 'Visual condition and appropriate electrical tests', icon: SearchCheck },
      { title: 'Report', detail: 'Circuit results, codes and overall condition', icon: FileCheck2 },
      { title: 'Act', detail: 'Make-safe, remedial work and next review', icon: Wrench },
    ],
    evidence: ['Board and circuit schedule', 'Inspector and test method', 'Coded defects and limitations', 'Separate remedial actions'], source: 'https://www.hse.gov.uk/electricity/introduction.htm', sourceLabel: 'HSE electrical safety guidance',
  },
  lev: {
    eyebrow: 'System map', title: 'What a complete LEV examination follows', intro: 'A TExT follows the contaminant from capture to discharge and tests whether the complete control chain still performs as intended.',
    nodes: [
      { title: 'Source', detail: 'Dust, fume, mist or vapour generated by the work', icon: Factory },
      { title: 'Hood', detail: 'Capture position, enclosure and control at the source', icon: AirVent },
      { title: 'Duct', detail: 'Condition, transport velocity, leakage and test points', icon: Wind },
      { title: 'Cleaner', detail: 'Filter or collector condition and pressure behaviour', icon: Filter },
      { title: 'Fan & discharge', detail: 'Air mover, exhaust route and any recirculation risk', icon: Fan },
    ],
    evidence: ['Physical condition', 'Airflow and pressure measurements', 'Benchmark comparison', 'Control judgement and actions'], source: 'https://books.hse.gov.uk/gempdf/hsg258.pdf', sourceLabel: 'HSE HSG258',
  },
  'pressure-systems': {
    eyebrow: 'Duty sequence', title: 'The pressure system comes before the paperwork', intro: 'First define the real safety-critical system. The written scheme then controls what is examined, how and when.',
    nodes: [
      { title: 'Relevant fluid', detail: 'Steam, compressed gas or another in-scope fluid', icon: CircleGauge },
      { title: 'System boundary', detail: 'Vessels, associated pipework and connected plant', icon: Link2 },
      { title: 'Protective devices', detail: 'Safety valves and devices protecting against danger', icon: ShieldCheck },
      { title: 'Written scheme', detail: 'Parts, examination nature, preparation and intervals', icon: FileCheck2 },
      { title: 'Examination', detail: 'Competent-person work, report and danger actions', icon: SearchCheck },
    ],
    evidence: ['Safe operating limits', 'Equipment and device inventory', 'Suitable certified scheme', 'Examination report and actions'], source: 'https://www.hse.gov.uk/pubns/indg178.htm', sourceLabel: 'HSE INDG178',
  },
  loler: {
    eyebrow: 'Interval map', title: 'Classify the asset before assigning a due date', intro: 'The normal maximum interval follows what the item is and how it is used. A competent-person scheme or an exceptional event can change the route.',
    nodes: [
      { title: 'Lifts people', detail: 'Normally examine at least every six months', icon: UserRound },
      { title: 'Lifting accessory', detail: 'Normally examine at least every six months', icon: PackageCheck },
      { title: 'Other lifting equipment', detail: 'Normally examine at least every twelve months', icon: HardHat },
      { title: 'Examination scheme', detail: 'A competent person may specify different intervals', icon: FileCheck2 },
      { title: 'Exceptional event', detail: 'Damage, repair, relocation or long disuse can trigger examination', icon: Wrench },
    ],
    evidence: ['Item identity and lifting use', 'Installation and event history', 'Equipment-specific competent person', 'Schedule 1 report and defect action'], source: 'https://www.hse.gov.uk/work-equipment-machinery/thorough-examinations-lifting-equipment.htm', sourceLabel: 'HSE thorough-examination guidance',
  },
  asbestos: {
    eyebrow: 'Survey route', title: 'The building decision sets the survey depth', intro: 'The dutyholder, premises records and planned disturbance determine what must be inspected and how the result will be used.',
    nodes: [
      { title: 'Premises', detail: 'Dutyholder, building age, areas and maintenance responsibility', icon: Factory },
      { title: 'Decision', detail: 'Normal management, refurbishment, demolition or reinspection', icon: SearchCheck },
      { title: 'Survey plan', detail: 'Access, exclusions, intrusion, samples and safe working method', icon: FileCheck2 },
      { title: 'Findings', detail: 'Location, extent, condition, analysis and assessment', icon: PackageCheck },
      { title: 'Control', detail: 'Live register, management actions or project work controls', icon: ShieldCheck },
    ],
    evidence: ['Defined scope and exclusions', 'Sample and laboratory traceability', 'Marked locations and assessments', 'Register or project actions'], source: 'https://www.hse.gov.uk/pubns/priced/hsg264.pdf', sourceLabel: 'HSE HSG264',
  },
  'fire-risk-assessment': {
    eyebrow: 'Assessment sequence', title: 'Five steps connect hazards to managed action', intro: 'The Home Office sequence starts with the real premises and people, then records evaluated precautions, actions and review triggers.',
    nodes: [
      { title: 'Fire hazards', detail: 'Ignition, fuel, oxygen, processes and dangerous substances', icon: Factory },
      { title: 'People at risk', detail: 'Occupants, visitors, lone workers and people needing assistance', icon: UserRound },
      { title: 'Evaluate and act', detail: 'Escape, warning, protection and risk reduction', icon: SearchCheck },
      { title: 'Record and plan', detail: 'Significant findings, emergency plan, information and training', icon: FileCheck2 },
      { title: 'Review', detail: 'Recheck after change, doubt, fire, near miss or other trigger', icon: ShieldCheck },
    ],
    evidence: ['Premises and responsible-person scope', 'People and hazard findings', 'Evaluated fire precautions', 'Prioritised actions and review record'], source: 'https://www.gov.uk/government/publications/fire-safety-risk-assessment-5-step-checklist/fire-safety-risk-assessment-5-step-checklist-accessible', sourceLabel: 'Home Office five-step checklist',
  },
  legionella: {
    eyebrow: 'Control sequence', title: 'Assessment connects water assets to operating controls', intro: 'The responsible person needs a mapped system, evidence of risk conditions and a written scheme that defines what happens between assessments.',
    nodes: [
      { title: 'Water source', detail: 'Mains, storage, heating, cooling or process supply', icon: Factory },
      { title: 'System assets', detail: 'Tanks, calorifiers, loops, pipework and outlets', icon: Link2 },
      { title: 'Exposure', detail: 'Aerosols, system users and susceptible people', icon: UserRound },
      { title: 'Controls', detail: 'Temperature, turnover, cleaning, monitoring and action limits', icon: ShieldCheck },
      { title: 'Written scheme', detail: 'Named duties, tasks, records, corrective action and review', icon: FileCheck2 },
    ],
    evidence: ['System schematic and asset register', 'Risk and exposure findings', 'Control measurements and records', 'Written scheme and corrective actions'], source: 'https://www.hse.gov.uk/pubns/priced/l8.pdf', sourceLabel: 'HSE ACOP L8',
  },
  'pat-testing': {
    eyebrow: 'Maintenance sequence', title: 'Equipment risk sets the check and interval', intro: 'The maintenance decision starts with equipment, use and environment, then selects checks capable of finding the foreseeable defects.',
    nodes: [
      { title: 'Inventory', detail: 'Owner, location, equipment type, class and condition', icon: PackageCheck },
      { title: 'Risk group', detail: 'Movement, environment, users and fault history', icon: SearchCheck },
      { title: 'User check', detail: 'Visible damage and safe reporting before or during use', icon: UserRound },
      { title: 'Inspect or test', detail: 'Formal visual checks and suitable measurements where needed', icon: Gauge },
      { title: 'Act and review', detail: 'Isolate defects, keep records and change intervals using results', icon: ShieldCheck },
    ],
    evidence: ['Equipment scope and risk groups', 'Inspection and test method', 'Itemised results and exclusions', 'Defect actions and reviewed intervals'], source: 'https://www.hse.gov.uk/electricity/faq-portable-appliance-testing.htm', sourceLabel: 'HSE PAT guidance',
  },
  tm44: {
    eyebrow: 'Inspection sequence', title: 'System boundaries turn units into one inspection duty', intro: 'The assessor groups equipment under common control, verifies effective rated output and examines the energy performance of the complete air-conditioning system.',
    nodes: [
      { title: 'Plant inventory', detail: 'Indoor units, outdoor units, chillers, AHUs and rated outputs', icon: PackageCheck },
      { title: 'Control boundary', detail: 'The person, building and units managed as one system', icon: Link2 },
      { title: '12 kW threshold', detail: 'Combined effective rated output, not only one unit rating', icon: Gauge },
      { title: 'Inspection', detail: 'Accessible plant, controls, sizing, records and operation', icon: SearchCheck },
      { title: 'Lodged report', detail: 'Findings, recommendations, limitations and next due date', icon: FileCheck2 },
    ],
    evidence: ['Plant and system schedule', 'Capacity and grouping rationale', 'Accredited assessor details', 'Lodged report and recommendations'], source: 'https://www.gov.uk/government/publications/air-conditioning-inspections-for-buildings/a-guide-to-air-conditioning-inspections', sourceLabel: 'GOV.UK inspection guide',
  },
  'workplace-noise': {
    eyebrow: 'Exposure sequence', title: 'A sound reading is only one part of the assessment', intro: 'Noise risk depends on what each worker hears and for how long. A useful assessment connects tasks and shifts to exposure, controls and action.',
    nodes: [
      { title: 'Task map', detail: 'Processes, equipment, people and shift patterns', icon: Factory },
      { title: 'Sound evidence', detail: 'Existing data or representative measurements when needed', icon: Gauge },
      { title: 'Exposure', detail: 'Personal daily or weekly exposure and relevant peaks', icon: UserRound },
      { title: 'Compare', detail: 'Action and limit values, with uncertainty visible', icon: SearchCheck },
      { title: 'Control plan', detail: 'Reduce noise, protect workers and review after change', icon: ShieldCheck },
    ],
    evidence: ['Tasks and worker groups', 'Measurements and exposure method', 'Action-value comparison', 'Prioritised controls and review'], source: 'https://www.hse.gov.uk/noise/risks.htm', sourceLabel: 'HSE noise risk guidance',
  },
  'hand-arm-vibration': {
    eyebrow: 'Exposure sequence', title: 'Tool data and trigger time form the exposure estimate', intro: 'The assessment follows the work each person does, rather than assigning one vibration reading to a whole shift.',
    nodes: [
      { title: 'Tool inventory', detail: 'Hand-held and hand-guided tools and the work they do', icon: PackageCheck },
      { title: 'Trigger time', detail: 'Actual hands-on time for each tool and task', icon: Gauge },
      { title: 'Vibration data', detail: 'Representative source data or competent measurement', icon: SearchCheck },
      { title: 'Daily exposure', detail: 'Combine tasks against action and limit values', icon: UserRound },
      { title: 'Control plan', detail: 'Reduce exposure, train, review and consider surveillance', icon: ShieldCheck },
    ],
    evidence: ['Tool and worker scope', 'Trigger-time basis', 'Vibration-data source and uncertainty', 'Exposure calculation and controls'], source: 'https://www.hse.gov.uk/vibration/hav/assessrisks.htm', sourceLabel: 'HSE vibration risk guidance',
  },
}

export function TechnicalDiagram({ serviceId }: { serviceId: IndustrialServiceId }) {
  const diagram = diagrams[serviceId]
  return <section className={`technical-diagram technical-diagram-${serviceId}`} aria-labelledby={`${serviceId}-diagram-title`}>
    <div className="technical-diagram-copy"><span className="eyebrow">{diagram.eyebrow}</span><h2 id={`${serviceId}-diagram-title`}>{diagram.title}</h2><p>{diagram.intro}</p><a href={diagram.source} target="_blank" rel="noreferrer">Check against {diagram.sourceLabel} <span aria-hidden>↗</span></a></div>
    <ol className="technical-flow">{diagram.nodes.map(({ title, detail, icon: Icon }, index) => <li key={title}><span className="technical-node-icon" aria-hidden="true"><Icon strokeWidth={1.75} /></span><span className="technical-node-number">{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><small>{detail}</small></li>)}</ol>
    <div className="technical-evidence"><span><Gauge aria-hidden="true" /> Evidence a competent appointment should leave visible</span><ul>{diagram.evidence.map((item) => <li key={item}>{item}</li>)}</ul></div>
  </section>
}
