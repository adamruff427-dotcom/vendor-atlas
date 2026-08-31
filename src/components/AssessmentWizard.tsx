"use client";
import { useMemo, useState } from "react";
import { estimateDsearPrice, qualifyDsear } from "../domain/dsear";
import { matchSuppliers } from "../domain/matching";
import type {
  AssessmentAnswers,
  Enquiry,
  Hazard,
  Region,
  Sector,
  SupplierMatch,
} from "../domain/types";
import { suppliers } from "../data/suppliers";
import { track } from "../analytics";

const defaultAnswers: AssessmentAnswers = {
  sector: "manufacturing",
  processes: [],
  hazards: [],
  sites: 1,
  size: "small",
  existingAssessment: "none",
  projectReason: "first-assessment",
  region: "midlands",
  postcode: "",
  timescale: "one-month",
};
const hazardOptions: Array<[Hazard, string, string]> = [
  [
    "flammable-liquids",
    "Flammable liquids",
    "Products labelled flammable or with relevant safety-data hazards",
  ],
  ["solvents-paints", "Solvents or paints", "Coating, cleaning, thinning, mixing or spraying"],
  ["lpg-gases", "LPG or flammable gases", "Cylinders, bulk storage, supply or process use"],
  ["combustible-dust", "Combustible dust", "Fine wood, food, metal, plastic or other process dust"],
  ["fuels", "Fuels", "Petrol, diesel, heating oil or similar storage/transfer"],
  [
    "batteries",
    "Battery charging or storage",
    "Charging, bulk storage, damaged batteries or processing",
  ],
  ["pressurised-gases", "Gases under pressure", "Cylinders, manifolds or pressurised systems"],
];
const processOptions = [
  ["spray-painting", "Spray painting/coating"],
  ["dust-extraction", "Dust extraction"],
  ["bulk-powder", "Bulk powder handling"],
  ["fuel-transfer", "Fuel transfer/dispensing"],
  ["battery-processing", "Battery processing/recycling"],
  ["storage-only", "Storage only"],
  ["other-process", "Another process"],
] as const;

function ToggleCard({
  checked,
  onChange,
  title,
  detail,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  detail?: string;
}) {
  return (
    <label className={`toggle-card ${checked ? "selected" : ""}`}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>
        <strong>{title}</strong>
        {detail && <small>{detail}</small>}
      </span>
    </label>
  );
}

export function AssessmentWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(defaultAnswers);
  const [confirmed, setConfirmed] = useState({
    sector: false,
    size: false,
    existingAssessment: false,
    projectReason: false,
    region: false,
    timescale: false,
  });
  const [noHazardsSelected, setNoHazardsSelected] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [submission, setSubmission] = useState<"idle" | "sending" | "submitted" | "error">("idle");
  const result = useMemo(() => qualifyDsear(answers), [answers]);
  const estimate = useMemo(() => estimateDsearPrice(answers, result), [answers, result]);
  const matches = useMemo(() => matchSuppliers(suppliers, answers, result), [answers, result]);
  const questionSteps = ["Your work", "Hazards", "Site and timing"];
  const siteDetailsConfirmed =
    confirmed.size &&
    confirmed.existingAssessment &&
    confirmed.projectReason &&
    confirmed.region &&
    confirmed.timescale;
  const canContinue =
    step === 0
      ? confirmed.sector
      : step === 1
        ? answers.hazards.length > 0 || noHazardsSelected
        : step === 2
          ? siteDetailsConfirmed
          : true;

  const toggle = <T extends string>(key: "hazards" | "processes", value: T) => {
    if (key === "hazards") setNoHazardsSelected(false);
    setAnswers((current) => ({
      ...current,
      [key]: current[key].includes(value as never)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  };
  const next = () => {
    if (!canContinue) return;
    if (step === 0) track("assessment_started");
    if (step === 2) {
      track("assessment_completed", { status: result.status });
      track("results_viewed", { status: result.status });
    }
    setStep((value) => Math.min(3, value + 1));
    document.getElementById("assessment")?.scrollIntoView({ behavior: "smooth" });
  };
  const back = () => setStep((value) => Math.max(0, value - 1));

  return (
    <section id="assessment" className="wizard-panel" aria-labelledby="wizard-heading">
      <div className="wizard-head">
        <div>
          <span className="eyebrow">Free two-minute check</span>
          <h2 id="wizard-heading">Do I need a DSEAR assessment?</h2>
        </div>
        <span className="step-count">
          {step === 3 ? "Assessment complete" : `${questionSteps[step]} · Question ${step + 1} of 3`}
        </span>
      </div>
      <div
        className="progress-compact"
        aria-label={step === 3 ? "Assessment questions complete" : `Assessment progress: question ${step + 1} of 3`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={Math.min(step + 1, 3)}
      >
        <span style={{ width: `${(Math.min(step + 1, 3) / 3) * 100}%` }} />
      </div>
      {step === 0 && (
        <div className="wizard-step">
          <h3>Tell us about the work</h3>
          <p className="hint">
            Choose the closest answer. You can give suppliers more detail later.
          </p>
          <div className="form-grid">
            <label>
              Business or industry
              <select
                required
                value={confirmed.sector ? answers.sector : ""}
                onChange={(e) => {
                  setAnswers({ ...answers, sector: e.target.value as Sector });
                  setConfirmed({ ...confirmed, sector: true });
                }}
              >
                <option value="" disabled>Choose the closest industry</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="food-drink">Food, drink, brewery or distillery</option>
                <option value="woodworking">Woodworking or joinery</option>
                <option value="automotive">Automotive, garage or bodyshop</option>
                <option value="chemicals">Chemical or process industry</option>
                <option value="energy-waste">Energy, waste or utilities</option>
                <option value="laboratory">Laboratory</option>
                <option value="other">Other</option>
              </select>
            </label>
            <fieldset className="full">
              <legend>Processes undertaken</legend>
              <div className="option-grid">
                {processOptions.map(([value, label]) => (
                  <ToggleCard
                    key={value}
                    checked={answers.processes.includes(value)}
                    onChange={() => toggle("processes", value)}
                    title={label}
                  />
                ))}
              </div>
              <p className="field-help">Select any that apply. Leave this blank if none of the listed processes apply.</p>
            </fieldset>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="wizard-step">
          <h3>Which substances or hazards are present?</h3>
          <p className="hint">
            Select everything that might apply. “Present” does not automatically mean the risk is
            significant.
          </p>
          <div className="option-grid">
            {hazardOptions.map(([value, label, detail]) => (
              <ToggleCard
                key={value}
                checked={answers.hazards.includes(value)}
                onChange={() => toggle("hazards", value)}
                title={label}
                detail={detail}
              />
            ))}
            <ToggleCard
              checked={noHazardsSelected}
              onChange={() => {
                setNoHazardsSelected((value) => !value);
                setAnswers({ ...answers, hazards: [] });
              }}
              title="None of these"
              detail="Select this only after checking the full list"
            />
          </div>
          <div className="evidence-note">
            <strong>Why we ask</strong>
            <p>
              HSE says DSEAR can apply to liquids, gases, vapours and dusts that create safety risks
              from fire, explosion or similar events.{" "}
              <a
                href="https://www.hse.gov.uk/fireandexplosion/dsear-background.htm"
                target="_blank"
                rel="noreferrer"
              >
                Read the HSE guidance
              </a>
              .
            </p>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="wizard-step">
          <h3>Site, current position and timing</h3>
          <div className="form-grid">
            <label>
              Number of sites
              <input
                type="number"
                min="1"
                max="50"
                value={answers.sites}
                onChange={(e) =>
                  setAnswers({ ...answers, sites: Math.max(1, Number(e.target.value)) })
                }
              />
            </label>
            <label>
              Approximate site size
              <select
                required
                value={confirmed.size ? answers.size : ""}
                onChange={(e) => {
                  setAnswers({ ...answers, size: e.target.value as AssessmentAnswers["size"] });
                  setConfirmed({ ...confirmed, size: true });
                }}
              >
                <option value="" disabled>Choose a site size</option>
                <option value="micro">Micro workshop/unit</option>
                <option value="small">Small site</option>
                <option value="medium">Medium site</option>
                <option value="large">Large/complex site</option>
              </select>
            </label>
            <label>
              Existing DSEAR assessment
              <select
                required
                value={confirmed.existingAssessment ? answers.existingAssessment : ""}
                onChange={(e) => {
                  setAnswers({
                    ...answers,
                    existingAssessment: e.target.value as AssessmentAnswers["existingAssessment"],
                  });
                  setConfirmed({ ...confirmed, existingAssessment: true });
                }}
              >
                <option value="" disabled>Choose the current position</option>
                <option value="none">None</option>
                <option value="current">Yes, believed current</option>
                <option value="old-or-unknown">Old or status unknown</option>
              </select>
            </label>
            <label>
              Reason for review
              <select
                required
                value={confirmed.projectReason ? answers.projectReason : ""}
                onChange={(e) => {
                  setAnswers({
                    ...answers,
                    projectReason: e.target.value as AssessmentAnswers["projectReason"],
                  });
                  setConfirmed({ ...confirmed, projectReason: true });
                }}
              >
                <option value="" disabled>Choose the reason</option>
                <option value="first-assessment">First assessment</option>
                <option value="new-installation">New installation</option>
                <option value="change">Material change</option>
                <option value="review">Periodic review</option>
              </select>
            </label>
            <label>
              Region
              <select
                required
                value={confirmed.region ? answers.region : ""}
                onChange={(e) => {
                  setAnswers({ ...answers, region: e.target.value as Region });
                  setConfirmed({ ...confirmed, region: true });
                }}
              >
                <option value="" disabled>Choose a UK region</option>
                <option value="scotland">Scotland</option>
                <option value="north">North of England</option>
                <option value="midlands">Midlands</option>
                <option value="wales">Wales</option>
                <option value="south-west">South West</option>
                <option value="south-east">South East</option>
                <option value="london">London</option>
                <option value="northern-ireland">Northern Ireland</option>
              </select>
            </label>
            <label>
              Postcode or town (optional)
              <input
                value={answers.postcode}
                onChange={(e) => setAnswers({ ...answers, postcode: e.target.value })}
                placeholder="e.g. B24"
              />
            </label>
            <label>
              Desired timescale
              <select
                required
                value={confirmed.timescale ? answers.timescale : ""}
                onChange={(e) => {
                  setAnswers({
                    ...answers,
                    timescale: e.target.value as AssessmentAnswers["timescale"],
                  });
                  setConfirmed({ ...confirmed, timescale: true });
                }}
              >
                <option value="" disabled>Choose a timescale</option>
                <option value="urgent">Urgently</option>
                <option value="one-month">Within one month</option>
                <option value="three-months">Within three months</option>
                <option value="planning">Early planning</option>
              </select>
            </label>
          </div>
        </div>
      )}
      {step === 3 && (
        <Results
          result={result}
          estimate={estimate}
          matches={matches}
          quoteOpen={showQuote}
          onQuote={() => {
            setShowQuote(true);
            track("quote_request_started");
            window.setTimeout(() => document.getElementById("quote-request")?.scrollIntoView({ behavior: "smooth" }), 0);
          }}
        />
      )}
      <div className="wizard-actions">
        {step > 0 && (
          <button className="button secondary" type="button" onClick={back}>
            Back
          </button>
        )}
        {step < 3 && (
          <button className="button primary" type="button" onClick={next} disabled={!canContinue}>
            {step === 2 ? "See my result" : "Continue"}
          </button>
        )}
      </div>
      {step < 3 && !canContinue && (
        <p className="completion-hint" role="status">
          {step === 0
            ? "Choose the closest industry to continue."
            : step === 1
              ? "Select at least one hazard, or confirm that none of the listed hazards apply."
              : "Complete the required site and timing fields to see your result."}
        </p>
      )}
      {showQuote && (
        <QuoteForm
          answers={answers}
          result={result}
          estimate={estimate}
          matches={matches}
          submission={submission}
          setSubmission={setSubmission}
        />
      )}
    </section>
  );
}

function Results({
  result,
  estimate,
  matches,
  quoteOpen,
  onQuote,
}: {
  result: ReturnType<typeof qualifyDsear>;
  estimate: ReturnType<typeof estimateDsearPrice>;
  matches: SupplierMatch[];
  quoteOpen: boolean;
  onQuote: () => void;
}) {
  const heading =
    result.status === "likely-relevant"
      ? "A DSEAR assessment is likely to be relevant"
      : result.status === "may-be-relevant"
        ? "DSEAR may be relevant—get the process scoped"
        : "No obvious DSEAR trigger was identified";
  return (
    <div className="results">
      <div className={`result-banner ${result.status}`}>
        <span className="eyebrow">Your initial indication</span>
        <h3>{heading}</h3>
        <p>
          {result.status === "no-obvious-trigger"
            ? "That does not prove DSEAR is irrelevant. Check substance labels, safety data sheets and processes with a competent person if anything was omitted or uncertain."
            : "Your answers identify dangerous-substance or process indicators that warrant a competent, site-specific assessment or review."}
        </p>
      </div>
      <div className="results-grid">
        <section>
          <h4>Why this result</h4>
          <p className="result-explanation">
            These are the screening signals in your answers. The final decision also depends on
            substance properties, quantities, release conditions, existing controls and who could
            be affected.
          </p>
          <ul className="check-list">
            {result.triggeredFactors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4>Likely assessment scope</h4>
          <p className="result-explanation">
            This is a starting scope for comparable quotations. A specialist may narrow or expand
            it after reviewing safety data, layouts and the actual work on site.
          </p>
          <ul>
            {result.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
      <section className="result-resource" aria-labelledby="result-resource-heading">
        <div>
          <span className="eyebrow">Use the result carefully</span>
          <h4 id="result-resource-heading">Check the underlying duty before acting</h4>
          <p>
            Regulation 5 is site-specific: it asks about the dangerous substance, supplier safety
            information, work process, amount, storage, maintenance, explosive atmospheres,
            ignition sources and possible effects. A short finder cannot verify those facts.
          </p>
        </div>
        <div className="result-links">
          <a href="https://www.hse.gov.uk/fireandexplosion/dsear.htm" target="_blank" rel="noreferrer">
            HSE quick guide <span aria-hidden>↗</span>
            <small>Plain-English duties and controls</small>
          </a>
          <a href="https://www.legislation.gov.uk/uksi/2002/2776/regulation/5" target="_blank" rel="noreferrer">
            Regulation 5 <span aria-hidden>↗</span>
            <small>The legal risk-assessment factors</small>
          </a>
          <a href="/dsear/do-i-need-a-dsear-assessment">
            Read the decision guide
            <small>Thresholds, uncertainties and escalation</small>
          </a>
        </div>
      </section>
      <section className="price-card">
        <div>
          <span className="eyebrow">Indicative planning range</span>
          <p className="price">
            £{estimate.low.toLocaleString()}–£{estimate.high.toLocaleString()} <small>ex VAT</small>
          </p>
          <p>Deterministic Vendor Atlas estimate. It is not a quote and is not generated by AI.</p>
        </div>
        <details>
          <summary>How this was calculated</summary>
          <table>
            <tbody>
              {estimate.factors.map((factor) => (
                <tr key={factor.label}>
                  <td>{factor.label}</td>
                  <td>£{factor.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul>
            {estimate.assumptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>
      </section>
      <section className="matches">
        <div className="section-head">
          <div>
            <span className="eyebrow">Evidence-backed shortlist</span>
            <h3>Specialists that may fit</h3>
          </div>
          <p>Ranked only on fit to your answers. No provider has paid for placement.</p>
        </div>
        <div className="supplier-grid">
          {matches.map((match) => (
            <SupplierCard key={match.supplier.id} match={match} />
          ))}
        </div>
      </section>
      <div className="quote-cta">
        <div>
          <h3>Get comparable quotes</h3>
          <p>
            Send one consistent project brief for human review. We will contact you about the next
            step and will not automatically share your details with suppliers.
          </p>
        </div>
        {!quoteOpen && (
          <button className="button primary light" onClick={onQuote} aria-expanded="false">
            Continue with my project brief
          </button>
        )}
      </div>
      <div className="disclaimer">
        <strong>This is not the legal assessment.</strong> {result.caveats.join(" ")}
      </div>
    </div>
  );
}

function SupplierCard({ match }: { match: SupplierMatch }) {
  const { supplier } = match;
  return (
    <article className="supplier-card">
      <div>
        <span className="verification">
          Evidence found · checked {new Date(supplier.lastVerifiedDate).toLocaleDateString("en-GB")}
        </span>
        <h4>{supplier.name}</h4>
        <p>{match.reasons.slice(0, 3).join(". ")}.</p>
      </div>
      <ul className="tag-list">
        {supplier.capabilities.slice(0, 3).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <details>
        <summary>Evidence and caveats</summary>
        {supplier.evidence.map((evidence) => (
          <p key={`${evidence.sourceUrl}:${evidence.claim}`}>
            <a
              href={evidence.sourceUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("supplier_viewed", { supplier: supplier.id })}
            >
              {evidence.claim}
            </a>
          </p>
        ))}
        <p>
          <strong>Insurance:</strong> {supplier.insuranceEvidence}
        </p>
        <p>
          <strong>Pricing:</strong> {supplier.pricingEvidence}
        </p>
      </details>
      <a
        className="text-link"
        href={supplier.website}
        target="_blank"
        rel="noreferrer"
        onClick={() => track("supplier_viewed", { supplier: supplier.id })}
      >
        Visit provider website <span aria-hidden>↗</span>
      </a>
    </article>
  );
}

function QuoteForm({
  answers,
  result,
  estimate,
  matches,
  submission,
  setSubmission,
}: {
  answers: AssessmentAnswers;
  result: ReturnType<typeof qualifyDsear>;
  estimate: ReturnType<typeof estimateDsearPrice>;
  matches: SupplierMatch[];
  submission: "idle" | "sending" | "submitted" | "error";
  setSubmission: (value: "idle" | "sending" | "submitted" | "error") => void;
}) {
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmission("sending");
    const form = new FormData(event.currentTarget);
    const enquiry: Enquiry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      serviceId: "dsear",
      answers,
      qualification: result,
      estimate,
      matchedSupplierIds: matches.map((m) => m.supplier.id),
      companyName: String(form.get("companyName")),
      contactName: String(form.get("contactName")),
      businessEmail: String(form.get("businessEmail")),
      phone: String(form.get("phone") || ""),
      consent: true,
      status: "received",
    };
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...enquiry, website: String(form.get("website") || "") }),
      });
      if (!response.ok) throw new Error("Request not saved");
      track("quote_request_completed", { service: "dsear" });
      setSubmission("submitted");
    } catch {
      setSubmission("error");
    }
  };
  if (submission === "submitted")
    return (
      <div className="success-box" role="status">
        <strong>Your project brief has been received.</strong>
        <p>
          A person will review it and we aim to contact you within two working days. No supplier has
          been contacted, and your details have not been automatically shared.
        </p>
      </div>
    );
  return (
    <form id="quote-request" className="quote-form" onSubmit={submit}>
      <span className="eyebrow">Comparable quote brief</span>
      <h3>Who should we contact about this project?</h3>
      <p>
        A person will review your assessment answers, estimate and shortlist. We aim to contact you
        within two working days. Your details are not automatically sent to suppliers.
      </p>
      <div className="form-grid">
        <label>
          Company name
          <input name="companyName" required maxLength={120} autoComplete="organization" />
        </label>
        <label>
          Contact name
          <input name="contactName" required maxLength={120} autoComplete="name" />
        </label>
        <label>
          Business email
          <input name="businessEmail" required maxLength={200} type="email" autoComplete="email" />
        </label>
        <label>
          Phone (optional)
          <input name="phone" maxLength={40} type="tel" autoComplete="tel" />
        </label>
        <label className="honeypot" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="consent full">
          <input name="consent" required type="checkbox" />
          <span>
            I consent to Cloudable Ltd, operating Vendor Atlas, storing this project brief and my
            contact information so it can review and follow up my request. I understand my details
            are not automatically shared with suppliers.
          </span>
        </label>
      </div>
      {submission === "error" && (
        <p className="form-error" role="alert">
          We could not save the request. Your details have not been submitted. Please try again or
          email <a href="mailto:hello@cloudable.biz">hello@cloudable.biz</a> if the problem continues.
        </p>
      )}
      <button className="button primary" disabled={submission === "sending"} type="submit">
        {submission === "sending" ? "Sending…" : "Send project brief for review"}
      </button>
    </form>
  );
}
