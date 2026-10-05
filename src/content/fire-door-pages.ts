import type { DecisionPage } from './pages'
import { doorSources } from '../domain/fire-doors'

const sources = [
  { label: 'Home Office: fire door fact sheet', url: doorSources.checks, context: 'England residential threshold, routine checks and the distinction from paid specialist work.' },
  { label: 'Home Office: detailed fire door guidance', url: doorSources.guidance, context: 'Condition, closing, resident access and the separate question of fire-door adequacy.' },
  { label: 'Regulation 10', url: doorSources.law, context: 'The England residential checking requirement; not a universal commercial annual-certificate rule.' },
  { label: 'Fire Safety Order article 17', url: doorSources.maintenance, context: 'England and Wales maintenance duty where necessary to safeguard relevant persons.' },
]

export const fireDoorPages: DecisionPage[] = [
  {
    path: '/fire-door-inspection', title: 'Fire door checks and specialist inspection finder', description: 'Understand routine fire door checks, specialist condition survey scope and evidence-linked providers.', cardPrompt: 'Separate the checking duty from the specialist purchase.', eyebrow: 'Fire door overview',
    intro: 'Fire doors form part of the premises fire precautions. The useful first question is not which certificate to buy, but whether you need routine condition checks, specialist defect investigation or a wider review of the fire-safety basis.',
    decision: { heading: 'Start with the actual reason for the work', summary: 'A routine check and a specialist survey answer different questions. Record the premises, jurisdiction, door locations, known faults and fire risk assessment actions before deciding what to commission.', checks: ['Find the fire risk assessment and door schedule.', 'Record faults, access limits and previous inspection findings.', 'Decide whether the immediate task is routine checking or specialist review.'], action: 'Use the finder to prepare a provisional brief. Where closing or damage is a concern, notify the responsible person promptly rather than waiting for a routine price comparison.' },
    sections: [
      { heading: 'Routine checks can be an in-house task', body: 'The Home Office says a specialist should not be necessary for the basic regulation 10 checks. The responsible person should understand the guidance, record checks and arrange competent attention for identified defects.' },
      { heading: 'A specialist purchase needs a defined question', body: 'A photographed condition survey can identify visible defects. An adequacy review, intrusive inspection, fire-resistance test and door replacement are separate scopes. Ask the provider what its method can and cannot establish.' },
      { heading: 'Keep responsibility after the report', body: 'The report should identify doors, limitations and actions. The responsible person still needs to arrange access, assign defect follow-up and keep the overall fire risk assessment and maintenance arrangements suitable.' },
    ], sources,
  },
  {
    path: '/fire-door-inspection/do-i-need-fire-door-inspection', title: 'Do I need a specialist fire door inspection?', description: 'Check the England residential threshold and distinguish routine checks from specialist condition work.', cardPrompt: 'What does the duty actually require?', eyebrow: 'Duty and decision',
    intro: 'Do not treat all buildings as if they have the same fire-door inspection timetable. England has a specific residential checking rule, while the wider maintenance duty and the need for specialist work depend on the premises and findings.',
    decision: { heading: 'A checking obligation does not automatically mean a paid survey', summary: 'For qualifying multi-occupied residential buildings in England with a top storey more than 11 metres above ground, regulation 10 requires quarterly communal checks and best-endeavours annual flat-entrance checks. Basic checks do not necessarily need a specialist.', checks: ['Confirm England, common escape areas and at least two domestic premises.', 'Confirm the top-storey height rather than guessing from floor count.', 'Separate routine condition checks from an adequacy question or known defect.'], action: 'Use the Home Office guide for the checking programme. If the height, premises scope or door adequacy is uncertain, obtain competent clarification and do not treat this questionnaire as a legal decision.' },
    sections: [
      { heading: 'Exactly 11 metres is not more than 11 metres', body: 'The specific threshold is more than 11 metres. Uncertain height must be confirmed from suitable building information. Lower buildings can still have maintenance duties; being outside this threshold is not a fire-safety exemption.' },
      { heading: 'Jurisdiction matters', body: 'Regulation 10 applies in England. The Fire Safety Order covers England and Wales, including appropriate maintenance where necessary. Scotland and Northern Ireland have different legislation and need their own duty review.' },
      { heading: 'Faults change the next action', body: 'Damage, poor closing, unauthorised alterations or missing evidence can require competent attention beyond a routine check. Tell the responsible person promptly. A detailed survey should answer the recorded question, not simply sell an annual certificate.' },
    ], sources,
  },
  {
    path: '/fire-door-inspection/cost', title: 'Fire door inspection cost: scope before price', description: 'See the sourced deterministic tariff example, exclusions and how to compare door inspection quotes.', cardPrompt: 'Count doors and agree the inspection method.', eyebrow: 'Cost and exclusions',
    intro: 'An inspection price is only useful when the door count, access and inspection method are stated. Do not compare an in-house routine check with a detailed condition survey, or assume either includes repairs and hidden-construction investigation.',
    decision: { heading: 'Compare the same door schedule and inspection scope', summary: 'The calculator uses a published local provider tariff for a single-site non-intrusive condition inspection. Its scenarios cover a minimum charge and possible call-out, not a nationwide market range or a live provider quotation.', checks: ['Count single-leaf and double-leaf doors separately.', 'State whether access, photographs and door-level reporting are included.', 'Separate intrusive work, repairs and repeat access from the inspection.'], action: 'Open the provider tariff linked in the finder and ask each specialist to quote the same schedule. Confirm current VAT, travel, minimum charge and access terms before accepting a price.' },
    sections: [
      { heading: 'An explained example, not market data', body: 'The finder displays the tariff arithmetic and source. There is no AI-generated price and no claim that the matched providers charge this amount. A local call-out scenario is not evidence of typical UK price variation.' },
      { heading: 'When no numeric estimate is shown', body: 'Routine-only checks, flat entrance access, uncertain door scope, care premises, new doors, more than 50 doors and several sites require an itemised quotation. The 50-door cap is our scope guard, not a statutory or provider limit. A blank numeric estimate does not mean inspection is free.' },
      { heading: 'Avoid a cheap but incomparable quote', body: 'Ask for the count basis, visit minimum, inspection method, exclusions, reporting date and failed-access charge. Repairs, replacements, opening-up and subsequent verification should be separately agreed rather than hidden within a pass/fail price.' },
    ], sources,
  },
  {
    path: '/fire-door-inspection/who-can-inspect-fire-doors', title: 'Who can inspect fire doors?', description: 'Compare routine-check competence, specialist inspection evidence and limitations before appointment.', cardPrompt: 'Match competence to the question being answered.', eyebrow: 'Choosing the person',
    intro: 'The right level of competence depends on the task. Basic condition and closing checks differ from resolving an uncertain installation or specifying remedial work. A provider website alone is not proof that the assigned person is suitable for your doors.',
    decision: { heading: 'Ask who will attend and what they will establish', summary: 'Choose the inspection method first, then ask for relevant door-type experience, training, any independently checkable scheme claim, a sample report and insurance for that exact work. Vendor Atlas retains provider sources but does not approve inspectors.', checks: ['Identify the named inspector and relevant door experience.', 'Check any scheme claim and current insurance directly.', 'Review a redacted door-level report and method limitations.'], action: 'Send providers the same door schedule and fire risk assessment action. Require written confirmation of scope and exclusions before appointment, and keep claimed credentials distinct from evidence actually checked.' },
    sections: [
      { heading: 'Routine-check competence', body: 'Government says a specialist should not be necessary for the basic regulation 10 checks. The responsible person should use the official guidance and know when a fault or uncertainty requires specialist escalation.' },
      { heading: 'Specialist condition work', body: 'Ask how the inspector checks leaf, frame, seals, hardware and closing, records inaccessible areas and communicates urgent faults. Experience with one door type does not automatically establish competence for all constructions.' },
      { heading: 'Evidence gaps are visible', body: 'The directory stores source URLs and checking dates. Provider-source evidence is not independent approval. Request current qualifications, insurance, subcontractor identity and a method appropriate to your building before relying on a shortlist.' },
    ], sources,
  },
  {
    path: '/fire-door-inspection/routine-checks-vs-condition-survey', title: 'Routine fire door checks versus a condition survey', description: 'Understand visible checks, survey limitations, resident access and the action record.', cardPrompt: 'Do not ask a visible check to prove hidden fire performance.', eyebrow: 'Scope and records',
    intro: 'A door can look intact while its original performance evidence remains uncertain. Conversely, an older door is not automatically unsuitable solely because it differs from current building-regulation specifications. Condition and adequacy need separate attention.',
    decision: { heading: 'Keep three questions separate', summary: 'Ask whether routine condition checks are current, whether visible defects need action and whether the existing door is adequate for the fire-safety strategy. These are connected questions, but a non-intrusive inspection does not answer all of them.', checks: ['Record closing, visible damage and unauthorised alterations.', 'Retain the specification or previous adequacy evidence where available.', 'State what hidden details and inaccessible doors remain unverified.'], action: 'Agree with the responsible person which question needs answering first. Record limitations and assign follow-up action rather than treating a photographed condition report as proof of a fire-resistance rating.' },
    sections: [
      { heading: 'Routine condition checks', body: 'The Home Office guidance describes checking for alterations or damage, seals and hinges, and whether the closer shuts the door properly. These checks support ongoing maintenance and do not replace the fire risk assessment.' },
      { heading: 'Resident access and records', body: 'For qualifying England buildings, flat entrance checks require best endeavours. Plan access attempts and keep records where access is not obtained. A missed appointment should not silently become a passed door in the report.' },
      { heading: 'Adequacy and remedial work', body: 'The fire risk assessment should address adequacy. Government cautions against automatically replacing older doors merely because they do not meet current standards. Competent assessment should address the actual performance basis, condition and required action.' },
    ], sources,
  },
]
