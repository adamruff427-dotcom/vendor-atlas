"use client";

import { useMemo, useState } from "react";
import { CircleAlert, CircleCheckBig, CircleHelp } from "lucide-react";
import { track } from "../analytics";
import { suppliersForService } from "../data/service-suppliers";
import {
  defaultServiceAnswers,
  estimateServicePrice,
  qualifyService,
  serviceDefinitions,
} from "../domain/service-assessment";
import { matchServiceSuppliers } from "../domain/service-matching";
import { isActionableFirstAidBrief } from "../domain/first-aid-training";
import { isActionableFaceFitBrief } from "../domain/rpe-face-fit-testing";
import { isActionableCommercialEpcBrief } from "../domain/commercial-epc";
import type {
  Region,
  Sector,
  ServiceAssessmentAnswers,
  ServiceEnquiry,
  ServiceId,
  ServiceSupplierMatch,
} from "../domain/types";

type IndustrialServiceId = Exclude<ServiceId, "dsear">;

const sectors: Array<{ value: Sector; label: string }> = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "food-drink", label: "Food, drink, brewery or hospitality" },
  { value: "woodworking", label: "Woodworking or joinery" },
  { value: "automotive", label: "Automotive, garage or bodyshop" },
  { value: "chemicals", label: "Chemical or process industry" },
  { value: "energy-waste", label: "Energy, waste or utilities" },
  { value: "laboratory", label: "Laboratory, healthcare or education" },
  { value: "other", label: "Other" },
];

const commercialPropertyTypes: Array<{ value: Sector; label: string }> = [
  { value: 'commercial-office', label: 'Office' },
  { value: 'commercial-retail', label: 'Shop or retail unit' },
  { value: 'commercial-warehouse', label: 'Warehouse or distribution' },
  { value: 'commercial-industrial', label: 'Industrial or workshop' },
  { value: 'commercial-hospitality', label: 'Hospitality or leisure' },
  { value: 'commercial-mixed', label: 'Mixed-use property' },
  { value: 'commercial-public', label: 'Public or community building' },
  { value: 'commercial-other', label: 'Other commercial building' },
];

const regions: Array<{ value: Region; label: string }> = [
  { value: "scotland", label: "Scotland" },
  { value: "north", label: "North of England" },
  { value: "midlands", label: "Midlands" },
  { value: "wales", label: "Wales" },
  { value: "south-west", label: "South West" },
  { value: "south-east", label: "South East" },
  { value: "london", label: "London" },
  { value: "northern-ireland", label: "Northern Ireland" },
];

function ToggleCard({ checked, onChange, title, detail, type = 'checkbox', name }: { checked: boolean; onChange: () => void; title: string; detail?: string; type?: 'checkbox' | 'radio'; name?: string }) {
  return (
    <label className={`toggle-card ${checked ? "selected" : ""}`}>
      <input type={type} name={name} checked={checked} onChange={onChange} />
      <span><strong>{title}</strong>{detail && <small>{detail}</small>}</span>
    </label>
  );
}

export function ServiceAssessmentWizard({ serviceId }: { serviceId: IndustrialServiceId }) {
  const definition = serviceDefinitions[serviceId];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => defaultServiceAnswers(serviceId));
  const [confirmed, setConfirmed] = useState({ sector: false, documentation: false, inspection: false, reason: false, size: false, region: false, timescale: false });
  const [showQuote, setShowQuote] = useState(false);
  const [submission, setSubmission] = useState<"idle" | "sending" | "submitted" | "error">("idle");
  const result = useMemo(() => qualifyService(answers), [answers]);
  const estimate = useMemo(() => estimateServicePrice(answers, result), [answers, result]);
  const matches = useMemo(
    () => matchServiceSuppliers(suppliersForService(serviceId), answers, result),
    [answers, result, serviceId],
  );

  const stepLabels = serviceId === 'workplace-first-aid-training'
    ? ["Course and decision", "Why training is considered", "People, sites and timing"]
    : serviceId === 'rpe-face-fit-testing'
      ? ["Selected facepiece", "Selected test method", "Wearers, sites and timing"]
      : serviceId === 'commercial-epc'
        ? ['Property transaction', 'Building services', 'Records, area and timing']
      : ["Equipment and work", "Duty indicators", "Site and records"];
  const isEpc = serviceId === 'commercial-epc';
  const detailsComplete = confirmed.documentation && confirmed.inspection && (isEpc || confirmed.reason) && confirmed.size && confirmed.region && confirmed.timescale;
  const noTightFacepiece = serviceId === 'rpe-face-fit-testing' && answers.workTypes.includes('no-tight-fitting');
  const countComplete = isEpc
    ? answers.assetCount >= 1 && answers.secondaryCount >= 1
    : serviceId === 'rpe-face-fit-testing'
    ? noTightFacepiece ? answers.assetCount === 0 && answers.secondaryCount === 0 : answers.assetCount >= 1 && answers.secondaryCount >= 1 && answers.secondaryCount <= answers.assetCount
    : serviceId === 'fire-door-inspection'
    ? answers.workTypes.includes('no-installed') || answers.assetCount + answers.secondaryCount >= 1
    : serviceId === 'kitchen-extract-cleaning'
      ? answers.workTypes.includes('no-extract-system') || answers.assetCount >= 1
      : answers.assetCount >= 1;
  const canContinue = step === 0
    ? confirmed.sector && answers.workTypes.length > 0
    : step === 1
      ? answers.riskSignals.length > 0 || serviceId === 'rpe-face-fit-testing' && answers.workTypes.includes('no-tight-fitting')
      : step === 2
        ? detailsComplete && countComplete && answers.sites >= 1
        : true;

  const toggle = (key: "workTypes" | "riskSignals", value: string) => {
    setAnswers((current) => {
      if (serviceId === 'workplace-first-aid-training' || serviceId === 'commercial-epc' && key === 'workTypes' || serviceId === 'rpe-face-fit-testing' && key === 'riskSignals') return { ...current, [key]: [value] };
      const isNone = value.startsWith("none-") || value.startsWith("no-");
      const heightAlternative = serviceId === 'fire-door-inspection' && ['over-11m', 'height-unknown'].includes(value);
      const withoutExclusive = current[key].filter((item) => !item.startsWith("none-") && !item.startsWith("no-") && !(heightAlternative && item !== value && ['over-11m', 'height-unknown'].includes(item)));
      const next = isNone
        ? current[key].includes(value) ? [] : [value]
        : withoutExclusive.includes(value) ? withoutExclusive.filter((item) => item !== value) : [...withoutExclusive, value];
      if (key === 'workTypes' && serviceId === 'kitchen-extract-cleaning') {
        if (next.includes('no-extract-system')) return { ...current, workTypes: next, assetCount: 0 };
        if (current.workTypes.includes('no-extract-system')) return { ...current, workTypes: next, assetCount: Math.max(1, current.assetCount) };
      }
      if (key === 'workTypes' && serviceId === 'rpe-face-fit-testing') {
        if (next.includes('no-tight-fitting')) return { ...current, workTypes: next, assetCount: 0, secondaryCount: 0 };
        if (current.workTypes.includes('no-tight-fitting')) return { ...current, workTypes: next, assetCount: Math.max(1, current.assetCount), secondaryCount: 1 };
      }
      return { ...current, [key]: next };
    });
  };

  const next = () => {
    if (!canContinue) return;
    if (step === 0) track("assessment_started", { service: serviceId });
    if (step === 2) {
      track("assessment_completed", { service: serviceId, status: result.status });
      track("results_viewed", { service: serviceId, status: result.status });
    }
    setStep((value) => Math.min(3, value + 1));
    document.getElementById("assessment")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="assessment" className="wizard-panel" aria-labelledby="wizard-heading">
      <div className="wizard-head">
        <div><span className="eyebrow">Free two-minute procurement check</span><h2 id="wizard-heading">{definition.question}</h2></div>
        <span className="step-count">{step === 3 ? "Check complete" : `${stepLabels[step]} · Question ${step + 1} of 3`}</span>
      </div>
      <div className="progress-compact" aria-label={step === 3 ? "Assessment questions complete" : `Assessment progress: question ${step + 1} of 3`} role="progressbar" aria-valuemin={0} aria-valuemax={3} aria-valuenow={Math.min(step + 1, 3)}>
        <span style={{ width: `${(Math.min(step + 1, 3) / 3) * 100}%` }} />
      </div>

      {step === 0 && (
        <div className="wizard-step">
          <h3>{definition.workHeading}</h3>
          <p className="hint">{definition.workHelp}</p>
          <div className="form-grid">
            <label>{isEpc ? 'Type of commercial property' : 'Business or industry'}
              <select required value={confirmed.sector ? answers.sector : ""} onChange={(event) => { setAnswers({ ...answers, sector: event.target.value as Sector }); setConfirmed({ ...confirmed, sector: true }); }}>
                <option value="" disabled>{isEpc ? 'Choose the closest building use' : 'Choose the closest industry'}</option>
                {(isEpc ? commercialPropertyTypes : sectors).map((sector) => <option key={sector.value} value={sector.value}>{sector.label}</option>)}
              </select>
            </label>
            <fieldset className="full"><legend>{definition.workHeading}</legend><div className="option-grid">
              {definition.workOptions.map((option) => <ToggleCard key={option.value} checked={answers.workTypes.includes(option.value)} onChange={() => toggle("workTypes", option.value)} title={option.label} detail={option.detail} type={serviceId === 'workplace-first-aid-training' || isEpc ? 'radio' : 'checkbox'} name={serviceId === 'workplace-first-aid-training' ? 'first-aid-course' : isEpc ? 'commercial-epc-transaction' : undefined} />)}
            </div></fieldset>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="wizard-step">
          <h3>{definition.signalHeading}</h3><p className="hint">{definition.signalHelp}</p>
          <div className="option-grid">
            {definition.signalOptions.map((option) => <ToggleCard key={option.value} checked={answers.riskSignals.includes(option.value)} onChange={() => toggle("riskSignals", option.value)} title={option.label} detail={option.detail} type={serviceId === 'workplace-first-aid-training' || serviceId === 'rpe-face-fit-testing' ? 'radio' : 'checkbox'} name={serviceId === 'workplace-first-aid-training' ? 'first-aid-assessment-status' : serviceId === 'rpe-face-fit-testing' ? 'rpe-test-method' : undefined} />)}
          </div>
          <div className="evidence-note"><strong>Why we ask</strong><p>{definition.legalBasis} <a href={definition.legalSource} target="_blank" rel="noreferrer">Check the primary guidance</a>.</p></div>
        </div>
      )}

      {step === 2 && (
        <div className="wizard-step">
          <h3>{serviceId === 'workplace-first-aid-training' ? 'Learners, records, location and timing' : serviceId === 'rpe-face-fit-testing' ? 'Wearers, sites, records and timing' : isEpc ? 'Records, area, sites and timing' : 'Equipment, records, location and timing'}</h3>
          <p className="hint">{serviceId === 'workplace-first-aid-training' ? 'Use the number of people and sessions in the employer’s current plan. The provider must confirm class size and course prerequisites.' : serviceId === 'rpe-face-fit-testing' ? 'Count each wearer-and-facepiece test, including separate models or sizes used by one person. If no tight-fitting facepiece is selected, leave the test count at zero.' : isEpc ? 'Use the approximate gross internal floor area if known. The provider must confirm the property boundary, floor area and current certificate before fixing a price.' : 'Counts do not need to be perfect. An explicit estimate is more useful than leaving the supplier to assume.'}</p>
          <div className="form-grid">
            <label>{definition.assetLabel}<input type="number" min={serviceId === 'fire-door-inspection' || serviceId === 'kitchen-extract-cleaning' && answers.workTypes.includes('no-extract-system') || noTightFacepiece ? 0 : 1} max={isEpc ? '100000' : '500'} value={answers.assetCount} onChange={(event) => { const minimum = serviceId === 'fire-door-inspection' || serviceId === 'kitchen-extract-cleaning' && answers.workTypes.includes('no-extract-system') || noTightFacepiece ? 0 : 1; const assetCount = Math.max(minimum, Number(event.target.value)); setAnswers({ ...answers, assetCount, secondaryCount: noTightFacepiece ? 0 : Math.min(answers.secondaryCount, assetCount) }); }} /></label>
            <label>{definition.secondaryLabel}<input type="number" min={isEpc || serviceId === 'rpe-face-fit-testing' && !noTightFacepiece ? 1 : 0} max="5000" disabled={noTightFacepiece} value={answers.secondaryCount} onChange={(event) => setAnswers({ ...answers, secondaryCount: Math.max(isEpc || serviceId === 'rpe-face-fit-testing' && !noTightFacepiece ? 1 : 0, Number(event.target.value)) })} /></label>
            <label>Number of sites<input type="number" min="1" max="100" value={answers.sites} onChange={(event) => setAnswers({ ...answers, sites: Math.max(1, Number(event.target.value)) })} /></label>
            <label>{isEpc ? 'Building-services complexity' : 'Approximate site size'}
              <select required value={confirmed.size ? answers.size : ""} onChange={(event) => { setAnswers({ ...answers, size: event.target.value as ServiceAssessmentAnswers["size"] }); setConfirmed({ ...confirmed, size: true }); }}>
                <option value="" disabled>{isEpc ? 'Choose a service-complexity view' : 'Choose a site size'}</option>{isEpc ? <><option value="micro">Straightforward single building</option><option value="small">Some additional systems or zones</option><option value="medium">Several systems or building parts</option><option value="large">Complex, multi-let or unusual building</option></> : <><option value="micro">Micro workshop/unit</option><option value="small">Small site</option><option value="medium">Medium site</option><option value="large">Large or complex site</option></>}
              </select>
            </label>
            <label>{definition.documentationLabel}
              <select required value={confirmed.documentation ? answers.documentationStatus : ""} onChange={(event) => { setAnswers({ ...answers, documentationStatus: event.target.value as ServiceAssessmentAnswers["documentationStatus"] }); setConfirmed({ ...confirmed, documentation: true }); }}>
                <option value="" disabled>Choose the record position</option>{definition.documentationOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label>{definition.inspectionLabel}
              <select required value={confirmed.inspection ? answers.inspectionStatus : ""} onChange={(event) => { setAnswers({ ...answers, inspectionStatus: event.target.value as ServiceAssessmentAnswers["inspectionStatus"] }); setConfirmed({ ...confirmed, inspection: true }); }}>
                <option value="" disabled>Choose the current position</option>{definition.inspectionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            {!isEpc && <label>{serviceId === 'workplace-first-aid-training' ? 'What is prompting the training plan?' : serviceId === 'rpe-face-fit-testing' ? 'What prompted these fit tests?' : 'Reason for commissioning'}
              <select required value={confirmed.reason ? answers.projectReason : ""} onChange={(event) => { setAnswers({ ...answers, projectReason: event.target.value as ServiceAssessmentAnswers["projectReason"] }); setConfirmed({ ...confirmed, reason: true }); }}>
                <option value="" disabled>Choose the reason</option>{serviceId === 'workplace-first-aid-training' ? <><option value="first-examination">First planned training or first course for this group</option><option value="new-installation">New starters or changed work arrangements</option><option value="change">Review after a change in people, work or shifts</option><option value="routine">Planned refresher or requalification</option></> : <><option value="first-examination">First appointment or unknown history</option><option value="new-installation">New installation, equipment or pre-use</option><option value="change">Change, repair, relocation or exceptional event</option><option value="routine">Routine periodic work</option></>}
              </select>
            </label>}
            <label>Region
              <select required value={confirmed.region ? answers.region : ""} onChange={(event) => { setAnswers({ ...answers, region: event.target.value as Region }); setConfirmed({ ...confirmed, region: true }); }}>
                <option value="" disabled>Choose a UK region</option>{regions.map((region) => <option key={region.value} value={region.value}>{region.label}</option>)}
              </select>
            </label>
            <label>Postcode or town (optional)<input value={answers.postcode} onChange={(event) => setAnswers({ ...answers, postcode: event.target.value })} placeholder="e.g. B24" /></label>
            <label>Desired timescale
              <select required value={confirmed.timescale ? answers.timescale : ""} onChange={(event) => { setAnswers({ ...answers, timescale: event.target.value as ServiceAssessmentAnswers["timescale"] }); setConfirmed({ ...confirmed, timescale: true }); }}>
                <option value="" disabled>Choose a timescale</option><option value="urgent">Urgently</option><option value="one-month">Within one month</option><option value="three-months">Within three months</option><option value="planning">Early planning</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {step === 3 && <ServiceResults serviceId={serviceId} answers={answers} result={result} estimate={estimate} matches={matches} quoteOpen={showQuote} onQuote={() => { setShowQuote(true); track("quote_request_started", { service: serviceId }); window.setTimeout(() => document.getElementById("quote-request")?.scrollIntoView({ behavior: "smooth" }), 0); }} />}
      <div className="wizard-actions">
        {step > 0 && <button className="button secondary" type="button" onClick={() => { setShowQuote(false); setSubmission("idle"); setStep((value) => Math.max(0, value - 1)); }}>Back</button>}
        {step < 3 && <button className="button primary" type="button" onClick={next} disabled={!canContinue}>{step === 2 ? "See my result" : "Continue"}</button>}
      </div>
      {step < 3 && !canContinue && <p className="completion-hint" role="status">{step === 0 ? "Choose an industry and at least one equipment or work type." : step === 1 ? "Select at least one duty indicator, including an explicit unknown or none answer." : "Complete the required record, site and timing fields."}</p>}
      {showQuote && <ServiceQuoteForm answers={answers} result={result} estimate={estimate} matches={matches} submission={submission} setSubmission={setSubmission} />}
    </section>
  );
}

function ServiceResults({ serviceId, answers, result, estimate, matches, quoteOpen, onQuote }: {
  serviceId: IndustrialServiceId;
  answers: ServiceAssessmentAnswers;
  result: ReturnType<typeof qualifyService>;
  estimate: ReturnType<typeof estimateServicePrice>;
  matches: ServiceSupplierMatch[];
  quoteOpen: boolean;
  onQuote: () => void;
}) {
  const definition = serviceDefinitions[serviceId];
  const isKitchen = serviceId === 'kitchen-extract-cleaning';
  const isEpc = serviceId === 'commercial-epc';
  const isPat = serviceId === "pat-testing";
  const isEicr = serviceId === "commercial-eicr";
  const isLighting = serviceId === "emergency-lighting";
  const isFireAlarm = serviceId === "fire-alarm-servicing";
  const isFirstAid = serviceId === 'workplace-first-aid-training';
  const isRpeFaceFit = serviceId === 'rpe-face-fit-testing';
  const isDoor = serviceId === "fire-door-inspection";
  const doorSpecialistBrief = !isDoor || result.status === "likely-relevant";
  const isExtinguisher = serviceId === "fire-extinguisher-servicing";
  const hasInstalledLighting = !isLighting || answers.workTypes.some((value) => ['self-contained', 'central-battery', 'self-test', 'multi-building'].includes(value));
  const hasInstalledAlarm = !isFireAlarm || answers.workTypes.some((value) => ['conventional-panel', 'addressable-panel', 'wireless-system', 'monitored-system', 'multi-building'].includes(value));
  const hasExtinguisherBrief = !isExtinguisher || answers.workTypes.some((value) => ['water-foam', 'co2', 'powder', 'wet-chemical', 'service-free', 'unknown-units'].includes(value));
  const hasKitchenSystem = !isKitchen || !answers.workTypes.includes('no-extract-system');
  const kitchenBriefNeeded = !isKitchen || (hasKitchenSystem && result.status !== 'no-obvious-trigger');
  const hasFirstAidBrief = !isFirstAid || isActionableFirstAidBrief(answers, result);
  const hasFaceFitBrief = !isRpeFaceFit || isActionableFaceFitBrief(answers, result);
  const hasEpcBrief = !isEpc || isActionableCommercialEpcBrief(answers, result);
  const hasServiceableSystem = hasInstalledLighting && hasInstalledAlarm && hasExtinguisherBrief && doorSpecialistBrief && kitchenBriefNeeded && hasFirstAidBrief && hasFaceFitBrief && hasEpcBrief;
  const quoteOnly = (isFireAlarm || isExtinguisher || isDoor || isKitchen || isFirstAid || isRpeFaceFit || isEpc) && estimate.low === 0 && estimate.high === 0;
  const firstAidCourse = answers.workTypes[0] === 'efaw' ? 'EFAW' : answers.workTypes[0] === 'faw' ? 'FAW' : answers.workTypes[0] === 'faw-requalification' ? 'FAW requalification' : 'workplace first-aid';
  const defaultHeading = isEpc
    ? hasEpcBrief ? 'A new commercial EPC is likely to be relevant' : result.status === 'no-obvious-trigger' ? 'No new EPC appointment is indicated by these answers' : 'Check the property and transaction before commissioning an EPC'
    : isRpeFaceFit
    ? hasFaceFitBrief ? 'RPE face-fit testing is likely to be relevant' : answers.workTypes.includes('no-tight-fitting') && result.status === 'no-obvious-trigger' ? 'No tight-fitting facepiece was selected' : 'Resolve the facepiece and test method before requesting comparable fit-test quotes'
    : isFirstAid
    ? hasFirstAidBrief ? `Your needs assessment identifies ${firstAidCourse} training to arrange` : result.status === 'no-obvious-trigger' ? 'Your assessment does not currently identify training to buy' : 'The training decision needs review before you request quotes'
    : isDoor ? (result.status === "likely-relevant" ? "Specialist fire door inspection is likely to be relevant" : result.status === "may-be-relevant" ? "Routine checks may be relevant; a paid specialist is not automatically needed" : "Confirm fire door provision in the fire risk assessment") : isExtinguisher && !hasExtinguisherBrief ? "Review portable firefighting provision before buying a service" : isFireAlarm && !hasInstalledAlarm ? result.status === "may-be-relevant" ? "Fire-warning provision needs a risk review" : "No installed-system service brief was identified" : isLighting && !hasInstalledLighting ? result.status === "may-be-relevant" ? "Emergency lighting provision needs a fire-risk review" : "No installed-system testing brief was identified" : result.status === "likely-relevant" ? `${definition.shortName} is likely to be relevant` : result.status === "may-be-relevant" ? `${definition.shortName} may be relevant; get the equipment scoped` : `No obvious ${definition.shortName} trigger was identified`;
  const heading = !isKitchen ? defaultHeading : !hasKitchenSystem ? 'No grease-laden kitchen extract system was identified' : result.status === 'likely-relevant' ? 'A kitchen extract clean or review is likely to be relevant' : result.status === 'may-be-relevant' ? 'Kitchen extract cleaning may be relevant; confirm the system and records' : 'No new cleaning trigger was identified';
  const resultDescription = isEpc
    ? hasEpcBrief ? 'You selected a sale, letting or lease-transfer event, no current certificate, and fixed building services. That is a strong signal to verify the property record and obtain an accredited assessor’s quote; it is not a legal ruling.' : result.status === 'no-obvious-trigger' ? 'Your answers do not currently point to a new certificate appointment. Check the exact property on the official register and revisit this if a sale, letting or relevant property event is planned.' : 'The transaction, existing certificate, building definition or jurisdiction is unresolved. Confirm it before buying an assessment; this finder will not turn missing information into a legal conclusion.'
    : isRpeFaceFit
    ? hasFaceFitBrief ? 'Your answers show a selected tight-fitting facepiece and test method, with an incomplete fit-test record or a new or changed wearer, mask or appointment. This is a buying signal, not a decision that a respirator is needed or suitable.' : result.status === 'no-obvious-trigger' ? 'Your answers do not identify a tight-fitting facepiece with an outstanding or changed test record. This does not decide whether RPE or any exposure control is adequate.' : 'The facepiece or employer-selected test method is uncertain or inconsistent. Resolve that with the person responsible for RPE selection before comparing test prices.'
    : isFirstAid
    ? hasFirstAidBrief ? `Based on your employer’s existing needs assessment, preparing a quote brief for ${firstAidCourse} is a reasonable next step. The employer—not this questionnaire—decides the course, number of trained people and adequacy of cover.` : result.status === 'no-obvious-trigger' ? 'Your answers say the current employer assessment does not identify a training course to purchase. This finder will not suggest a supplier quote.' : 'The answers do not establish an employer decision to buy training. Review the first-aid needs assessment and certificate records before selecting a course or requesting quotes.'
    : isKitchen ? !hasKitchenSystem ? "This finder is only for cleaning an installed grease-laden kitchen extract system. It does not decide whether your premises needs one." : result.status === "no-obvious-trigger" ? "Your answers did not identify a new cleaning signal. Keep the existing programme under review and follow the premises risk assessment and any applicable insurer or contract terms." : "Your answers suggest a reason to review or scope the clean. This is not a legal determination: fire-safety duties depend on the premises and its identified precautions, and TR19 Grease does not create a universal statutory interval."
    : isDoor ? "Your answers distinguish basic checks from specialist condition work. A checking duty does not itself require a paid survey. Defects and adequacy questions need appropriate competent attention."
    : result.status === "no-obvious-trigger" ? (isFireAlarm ? "That does not establish adequate fire warning. Check the fire risk assessment and any installed system's service records." : isLighting ? "That does not establish adequate escape lighting. Check the fire risk assessment and any installed system's maintenance records." : isPat ? "That is not a legal exemption. Confirm who controls the equipment and keep a risk-based maintenance regime even where combined electrical testing is not justified." : isEicr ? "That is not electrical safety clearance. Confirm responsibility, condition and a risk-based inspection plan with a competent electrician." : "That is not a legal exemption. Recheck the equipment, operating data and any uncertainty with a competent person before deciding that no examination is required.")
    : isFireAlarm ? "An installed system or warning concern needs competent review. A panel fault or disabled zone needs prompt attention." : isLighting ? "An installed system or escape-route concern needs a competent fire-safety and maintenance review. A failed fitting may need prompt action." : isPat ? "Your answers identify equipment, use or record signals that justify a competent maintenance review and may justify combined inspection and testing." : isEicr ? "Your answers identify fixed-wiring condition or record signals that justify competent electrical review. A dangerous fault needs immediate action, not a routine booking." : "Your answers identify equipment, operating or record signals that justify system-specific competent-person review or examination.";
  const priceEyebrow = (isFirstAid || isRpeFaceFit || isEpc) && !quoteOnly ? 'One provider’s published tariff' : quoteOnly ? 'Bespoke price required' : isKitchen ? 'Single-provider price example' : isExtinguisher ? 'Illustrative basic-service budget' : 'Indicative planning range';
  const priceValue = isFirstAid || isRpeFaceFit || isEpc ? `£${estimate.low.toLocaleString()}` : `£${estimate.low.toLocaleString()}–£${estimate.high.toLocaleString()}`;
  const priceDescription = isEpc
    ? 'One London-area supplier’s published floor-area tariff including VAT. It is not a UK-wide price, market average or quote from the matched providers. Confirm coverage, area, inclusions and current price directly.'
    : isRpeFaceFit
    ? 'This repeats one provider’s published on-site package for a single site and up to 16 tests; it is not a UK market range, a matched-provider comparison or a live quote. VAT and travel are excluded.'
    : isFirstAid
    ? 'This is one provider’s published course fee for a narrow, single-class case, not a national market range or a matched-provider quote.'
    : isKitchen ? 'One provider says most jobs start from £300–£500. This is that provider’s published example, not a national market range or a quote from the matched suppliers.'
    : isDoor ? 'One South Coast provider’s non-intrusive condition-inspection tariff with minimum and possible call-out. This is not a national market range.'
    : isExtinguisher ? 'One Suffolk provider’s attendance and unit tariff, with a 25% planning margin. Travel and work beyond a basic service are extra. Get a local quotation.'
    : isEicr ? 'Two published provider tariff examples, calculated from your counts. Neither is a live quote or national market rate.'
    : 'Deterministic Vendor Atlas estimate. It is not a quote and is not generated by AI.';
  const alternativeTitle = isEpc
    ? result.status === 'no-obvious-trigger' ? 'Check the register before buying a new certificate' : 'Resolve the legal boundary or transaction first'
    : isRpeFaceFit
    ? answers.workTypes.includes('no-tight-fitting') && result.status === 'no-obvious-trigger' ? 'Do not order a fit test for a facepiece that has not been selected' : 'Confirm the exact facepiece and method with the responsible person'
    : isFirstAid
    ? result.status === 'no-obvious-trigger' ? 'Do not buy a course based on this finder' : answers.region === 'northern-ireland' ? 'Check the Northern Ireland position separately' : 'Complete or review the employer needs assessment'
    : isKitchen ? !hasKitchenSystem ? 'Confirm what extraction equipment is installed' : 'Continue the existing condition-based programme'
    : isDoor ? 'Use the routine-check guide or confirm required door provision'
    : isExtinguisher ? 'Confirm firefighting provision in the fire risk assessment'
    : 'Do not price servicing for a system that may not exist';
  const alternativeBody = isEpc
    ? 'The government guide contains exceptions and property-specific rules. Search the exact address on the official EPC register, check that the certificate remains valid and ask an accredited non-domestic energy assessor or legal adviser to confirm any unclear transaction.'
    : isRpeFaceFit
    ? answers.workTypes.includes('no-tight-fitting') && result.status === 'no-obvious-trigger' ? 'This finder covers testing of an employer-selected tight-fitting facepiece. It does not select respiratory protection or decide whether exposure is adequately controlled.' : 'Use the make, model, type and size already selected by the employer’s RPE plan. Ask the responsible person to resolve unknown or inconsistent answers; this finder will not choose a facepiece or test method.'
    : isFirstAid
    ? result.status === 'no-obvious-trigger' ? 'The employer’s current assessment does not identify training to procure. Keep the needs assessment under review when the workplace, workforce, shifts or risks change.' : answers.region === 'northern-ireland' ? 'This finder uses Great Britain law and guidance. Confirm the local rules and suitable course evidence before asking for quotes.' : 'HSE says the employer should assess first-aid needs. Resolve the course, number of trained people and certificate position with the responsible employer before sending a quote brief.'
    : isKitchen ? !hasKitchenSystem ? 'Confirm the kitchen equipment and the fire risk assessment before requesting cleaning prices.' : 'Your answers and records do not point to a new external cleaning brief today. Recheck the system condition and any specific fire-risk, insurer or contract action when circumstances change.'
    : isDoor ? 'The Home Office says a specialist should not be necessary for basic regulation 10 checks. If no doors are identified, confirm provision through the fire risk assessment. Record checks and escalate defects; do not buy a detailed inspection solely because a routine checking duty exists.'
    : isExtinguisher ? 'A competent person should decide which portable equipment, positions and commissioning are needed before you buy an annual service.'
    : 'Ask a competent fire-risk or system designer to decide whether installed provision is needed. A servicing fee would not answer that design question.';
  const Icon = result.status === "likely-relevant" ? CircleCheckBig : result.status === "may-be-relevant" ? CircleHelp : CircleAlert;
  return (
    <div className="results">
      <div className={`result-banner ${result.status}`}><span className="result-status-icon" aria-hidden="true"><Icon strokeWidth={1.8} /></span><div><span className="eyebrow">Your initial indication</span><h3>{heading}</h3><p>{resultDescription}</p></div></div>
      <div className="results-grid">
        <section><h4>Why this result</h4><p className="result-explanation">{isEpc ? 'These are the transaction, certificate and building-service signals you supplied. They do not establish that the legal test is met; the exact property and any exception must be checked.' : isRpeFaceFit ? 'These are the selected-facepiece, method and record signals in your answers. Only the employer or responsible competent person decides whether RPE is needed, suitable and correctly selected.' : isFirstAid ? 'These are the employer decision and certificate signals recorded in your answers. Only the employer’s needs assessment can establish whether training is appropriate.' : 'These are the decision signals recorded in your answers. The final position depends on the real equipment boundary, use, condition and applicable exclusions.'}</p><ul className="check-list">{result.triggeredFactors.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section><h4>{isEpc ? 'What to include in the EPC brief' : isRpeFaceFit ? 'What to include in the fit-test brief' : isFirstAid ? 'What to include in the training brief' : 'Likely appointment scope'}</h4><p className="result-explanation">{isEpc ? 'Send each provider the same property address, transaction, approximate floor area, existing certificate reference, building use and services. Ask for the certificate and recommendations report, including exclusions and the accredited assessor or scheme details.' : isRpeFaceFit ? 'Use one line per wearer-and-facepiece combination. Ask every provider to confirm the named method, test protocol, adapter or test-mask requirements and individual record.' : isFirstAid ? 'Use the selected course, learner count, class count, location and timing to ask providers for the same written deliverable. Confirm prerequisites and certificate details directly.' : 'Use this as the starting scope for comparable quotations. The competent person may narrow or expand it after reviewing the equipment and records.'}</p><ul>{result.scope.map((item) => <li key={item}>{item}</li>)}</ul></section>
      </div>
      <section className="result-resource"><div><span className="eyebrow">Use the result carefully</span><h4>{definition.resultResourceHeading}</h4><p>{definition.resultResourceBody}</p></div><div className="result-links">{definition.primaryLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} <span aria-hidden>↗</span><small>{link.detail}</small></a>)}<a href={definition.guidePath}>{isFirstAid ? 'Review HSE and provider evidence' : 'Read the Vendor Atlas decision guide'}<small>{isFirstAid ? 'Provider claims are not Vendor Atlas or HSE approval' : 'Thresholds, unknowns and next actions'}</small></a></div></section>
      {hasServiceableSystem ? <section className="price-card"><div><span className="eyebrow">{priceEyebrow}</span>{quoteOnly ? <p>{estimate.assumptions[0]}</p> : <><p className="price">{priceValue} <small>{isKitchen ? "VAT not stated" : isEpc ? 'inc VAT' : "ex VAT"}</small></p><p>{priceDescription}</p></>}<p className="calibration-note">{isEpc ? 'The displayed amount repeats one provider’s published tariff only where its stated area band and London coverage fit.' : isRpeFaceFit || isFirstAid ? 'Exact provider price evidence and its limits are retained with the source record.' : 'Early model calibrated only against the limited published prices identified for simpler/common jobs.'} <a href={isEpc ? '#source-note' : definition.costPath}>{isEpc || isRpeFaceFit || isFirstAid ? 'See the source and scope limits' : 'See the exact sources and limitations'}</a>.</p></div><details><summary>How this was calculated</summary><table><tbody>{estimate.factors.map((factor) => <tr key={factor.label}><td>{factor.label}</td><td>£{factor.amount.toLocaleString()}</td></tr>)}</tbody></table><ul>{estimate.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></details></section> : <section className="result-resource"><div><span className="eyebrow">Different next step</span><h4>{alternativeTitle}</h4><p>{alternativeBody}</p></div>{isEpc ? <a href="#source-note">Review the official EPC sources</a> : isRpeFaceFit ? <a href={definition.guidePath}>Review the HSE and provider sources</a> : isFirstAid ? <a href={definition.guidePath}>Review the HSE and provider sources</a> : !isKitchen && <a href="/fire-risk-assessment">Review the fire risk assessment route</a>}</section>}
      {hasServiceableSystem && <section className="matches"><div className="section-head"><div><span className="eyebrow">Evidence-backed shortlist</span><h3>{isEpc ? 'Providers with commercial EPC evidence for this region' : isRpeFaceFit ? 'Providers with evidence for your method and region' : isFirstAid ? 'Providers with evidence for this course and region' : 'Specialists that may fit'}</h3></div><p>{isEpc ? 'Matched using published regional coverage, stated commercial-building capability and stated service complexity. Listed alphabetically, not paid-ranked. Confirm current assessor accreditation, exact scope, insurance and terms directly.' : isRpeFaceFit ? 'Deterministic match: advertised method, selected region, sector and stated complexity. No paid placement; confirm exact mask compatibility, named tester, competence and terms directly.' : isFirstAid ? 'Matched only for an evidenced course, region and simple single-class brief. No paid placement; check current credentials and terms directly.' : 'Ranked only on your region, sector, equipment, complexity and required capability. No paid placement.'}</p></div>{matches.length > 0 ? <div className="supplier-grid">{matches.map((match) => <ServiceSupplierCard key={match.supplier.id} match={match} serviceId={serviceId} />)}</div> : <p className="result-explanation">This brief is larger or more complex than the provider evidence used for automated matching. A person can review the scope before suggesting providers.</p>}<div className="matches-footer">{isEpc ? <a href="#source-note">Review the provider evidence in this finder</a> : isFirstAid || isKitchen || isRpeFaceFit ? <a href={definition.supplierPath}>Review provider evidence and sources</a> : <a href={definition.supplierPath}>Review the full evidence directory</a>}<span>{suppliersForService(serviceId).length} providers with source records · unknowns shown explicitly</span></div></section>}
      {hasServiceableSystem && <div className="quote-cta"><div><h3>{isEpc ? 'Get comparable EPC quotes' : isFirstAid ? 'Get comparable course quotes' : 'Get comparable quotes'}</h3><p>{isEpc ? 'Send the same property boundary, transaction, floor area, certificate and services information for human review. Your details are not automatically shared with providers.' : isRpeFaceFit ? 'Send one consistent wearer, facepiece, method, site and timing brief for human review. Your contact details are not automatically shared with providers.' : isFirstAid ? 'Send one consistent course, learner, class, location and timing brief for human review. Your contact details are not automatically shared with providers.' : 'Send one consistent equipment and project brief for human review. Your details are not automatically shared with suppliers.'}</p><a className="quote-toolkit-link" href={isEpc ? '#source-note' : definition.toolkitPath}>{isEpc || isFirstAid || isKitchen || isRpeFaceFit ? 'Review the sources and scope' : 'Or use the free buying toolkit yourself'}</a></div>{!quoteOpen && <button className="button primary light" onClick={onQuote} aria-expanded="false">{isEpc ? 'Continue with EPC quote brief' : isRpeFaceFit ? 'Continue with fit-test quote brief' : isFirstAid ? 'Continue with training quote brief' : 'Continue with my project brief'}</button>}</div>}
      <div className="disclaimer"><strong>{isEpc ? 'This is not a legal ruling, EPC, exemption check or energy assessment.' : isRpeFaceFit ? 'This is not a COSHH assessment, RPE selection decision, face-fit test or legal determination.' : isFirstAid ? 'This is not a first-aid needs assessment, course recommendation or legal determination.' : isKitchen ? "This is not a fire risk assessment, system inspection or legal determination." : isDoor ? "This is not a fire door inspection or fire-resistance test." : isExtinguisher ? "This is not an extinguisher inspection, service or fire risk assessment." : isFireAlarm ? "This is not a fire risk assessment, alarm service or legal decision." : isLighting ? "This is not a fire risk assessment, emergency-lighting test or legal decision." : isPat ? "This is not electrical equipment inspection, testing or a legal decision." : isEicr ? "This is not an EICR, electrical safety clearance or legal decision." : "This is not the statutory examination or legal decision."}</strong> {result.caveats.join(" ")}</div>
    </div>
  );
}

function ServiceSupplierCard({ match, serviceId }: { match: ServiceSupplierMatch; serviceId: IndustrialServiceId }) {
  const supplier = match.supplier;
  return <article className="supplier-card"><div><span className="verification">Evidence found · checked {new Date(supplier.lastVerifiedDate).toLocaleDateString("en-GB")}</span><h4>{supplier.name}</h4><p>{match.reasons.slice(0, 3).join(". ")}.</p></div><ul className="tag-list">{supplier.capabilities.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul><details><summary>Evidence and caveats</summary>{supplier.evidence.map((evidence) => <p key={`${evidence.sourceUrl}:${evidence.claim}`}><a href={evidence.sourceUrl} target="_blank" rel="noreferrer" onClick={() => track("supplier_viewed", { supplier: supplier.id, service: serviceId })}>{evidence.claim}</a></p>)}{match.gaps.length > 0 && <p><strong>Gaps:</strong> {match.gaps.join(". ")}.</p>}<p><strong>Insurance:</strong> {supplier.insuranceEvidence}</p><p><strong>Pricing:</strong> {supplier.pricingEvidence}</p></details><a className="text-link" href={supplier.website} target="_blank" rel="noreferrer" onClick={() => track("supplier_viewed", { supplier: supplier.id, service: serviceId })}>Visit provider website <span aria-hidden>↗</span></a></article>;
}

function ServiceQuoteForm({ answers, result, estimate, matches, submission, setSubmission }: {
  answers: ServiceAssessmentAnswers;
  result: ReturnType<typeof qualifyService>;
  estimate: ReturnType<typeof estimateServicePrice>;
  matches: ServiceSupplierMatch[];
  submission: "idle" | "sending" | "submitted" | "error";
  setSubmission: (value: "idle" | "sending" | "submitted" | "error") => void;
}) {
  const definition = serviceDefinitions[answers.serviceId];
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmission("sending"); const form = new FormData(event.currentTarget);
    const enquiry: ServiceEnquiry = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), serviceId: answers.serviceId, answers, qualification: result, estimate, matchedSupplierIds: matches.map((match) => match.supplier.id), companyName: String(form.get("companyName")), contactName: String(form.get("contactName")), businessEmail: String(form.get("businessEmail")), phone: String(form.get("phone") || ""), consent: true, status: "received" };
    try { const response = await fetch("/api/enquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...enquiry, website: String(form.get("website") || "") }) }); if (!response.ok) throw new Error("Request not saved"); track("quote_request_completed", { service: answers.serviceId }); setSubmission("submitted"); } catch { track("quote_request_failed", { service: answers.serviceId, status: "save_failed" }); setSubmission("error"); }
  };
  if (submission === "submitted") return <div className="success-box" role="status"><strong>Your {definition.shortName.toLowerCase()} project brief has been received.</strong><p>A person will review it and we aim to contact you within two working days. No supplier has been contacted and your details have not been automatically shared.</p></div>;
  return <form id="quote-request" className="quote-form" onSubmit={submit}><span className="eyebrow">Comparable quote brief</span><h3>Who should we contact about this project?</h3><p>{answers.serviceId === 'rpe-face-fit-testing' ? 'A person will review the selected method, wearer count, facepiece details, site and timing. Your details are not automatically sent to fit-test providers.' : answers.serviceId === 'workplace-first-aid-training' ? 'A person will review the selected course, learner count, location and timing. Your details are not automatically sent to training providers.' : 'A person will review the equipment, estimate and shortlist. Your details are not automatically sent to suppliers.'}</p><div className="form-grid"><label>Company name<input name="companyName" required maxLength={120} autoComplete="organization" /></label><label>Contact name<input name="contactName" required maxLength={120} autoComplete="name" /></label><label>Business email<input name="businessEmail" required maxLength={200} type="email" autoComplete="email" /></label><label>Phone (optional)<input name="phone" maxLength={40} type="tel" autoComplete="tel" /></label><label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label><label className="consent full"><input name="consent" required type="checkbox" /><span>I consent to Cloudable Ltd, operating Vendor Atlas, storing this project brief and my contact information so it can review and follow up my request. I understand my details are not automatically shared with suppliers.</span></label></div>{submission === "error" && <p className="form-error" role="alert">We could not save the request. Your details have not been submitted. Please try again or email <a href="mailto:hello@cloudable.biz">hello@cloudable.biz</a>.</p>}<button className="button primary" disabled={submission === "sending"} type="submit">{submission === "sending" ? "Sending…" : "Send project brief for review"}</button></form>;
}
