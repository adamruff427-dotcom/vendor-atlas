import type { Metadata } from "next";
import Link from "next/link";
import { AssessmentWizard } from "../src/components/AssessmentWizard";
import { LandingAnalytics } from "../src/components/LandingAnalytics";
import { DecisionMap, GuideIcon, StageIcon } from "../src/components/VisualLanguage";
import { pages } from "../src/content/pages";
import { suppliers } from "../src/data/suppliers";

export const metadata: Metadata = {
  title: "UK industrial compliance service finder",
  description: "Check DSEAR, LEV, pressure-system and LOLER duties, estimate likely costs and compare evidenced UK specialists.",
  alternates: { canonical: "/" },
};

const serviceChoices = [
  { href: "/#assessment", label: "DSEAR", question: "Do dangerous substances create a fire or explosion duty?", status: "Current assessment" },
  { href: "/lev", label: "LEV", question: "Does extraction need a thorough examination and test?", status: "Assessment and quotes" },
  { href: "/pressure-systems", label: "Pressure systems", question: "Does the system need a written scheme and examination?", status: "Assessment and quotes" },
  { href: "/loler", label: "LOLER", question: "Which lifting assets need thorough examination?", status: "Assessment and quotes" },
];

export default function Home() {
  return (
    <>
      <LandingAnalytics />
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">DSEAR assessment finder</span>
            <h1>Do I need a DSEAR assessment?</h1>
            <p className="lead">Find out in about 2 minutes.</p>
            <p>
              Answer practical questions about your substances, processes and sites. Get an
              explainable indication, likely scope, planning cost and shortlist of UK specialists.
            </p>
            <a className="button primary" href="#assessment">
              Start the check
            </a>
            <p className="microcopy">Free · no account · no AI-generated prices</p>
          </div>
          <DecisionMap />
        </div>
      </section>
      <div className="shell">
        <AssessmentWizard />
        <section className="service-estate" aria-labelledby="service-estate-heading">
          <div className="section-head"><div><span className="eyebrow">Industrial compliance estate</span><h2 id="service-estate-heading">Four compulsory decisions, one buying standard</h2></div><p>Each route gives you a source-backed indication, transparent planning range, evidence-led shortlist and comparable quote brief.</p></div>
          <div className="service-estate-grid">{serviceChoices.map((service) => <Link href={service.href} key={service.label}><span className="service-status">{service.status}</span><strong>{service.label}</strong><span>{service.question}</span><small>Open the decision tool →</small></Link>)}</div>
        </section>
        <section className="explainer">
          <div>
            <span className="eyebrow">Built for a real buying decision</span>
            <h2>From uncertainty to a comparable brief</h2>
          </div>
          <div className="three-cols">
            <article>
              <StageIcon stage="check" />
              <strong>1. Check relevance</strong>
              <p>
                Map obvious dangerous-substance and process signals without pretending a
                questionnaire can determine compliance.
              </p>
            </article>
            <article>
              <StageIcon stage="scope" />
              <strong>2. See the scope</strong>
              <p>
                Understand the work a specialist may need to quote, from inventory and ignition
                sources to zoning where relevant.
              </p>
            </article>
            <article>
              <StageIcon stage="compare" />
              <strong>3. Compare evidence</strong>
              <p>
                Match on region, sector, hazards, complexity and capabilities—not advertising spend.
              </p>
            </article>
          </div>
        </section>
        <section className="guide-links">
          <div className="resource-strip">
            <div><span className="eyebrow">DSEAR buyer tools</span><h2>Use the same standard for every quote</h2><p>Move from a screening result to a documented brief, competence check and comparable supplier shortlist.</p></div>
            <div className="resource-strip-links">
              <Link href="/dsear/buying-toolkit"><strong>Buying toolkit</strong><span>Printable brief, evidence questions, quote scorecard and report acceptance check.</span></Link>
              <Link href="/dsear/suppliers"><strong>UK specialist directory</strong><span>{suppliers.length} providers with sourced claims, public evidence gaps and no paid ranking.</span></Link>
            </div>
          </div>
          <div>
            <span className="eyebrow">Practical DSEAR guides</span>
            <h2>Read only what helps your decision</h2>
          </div>
          <div className="link-grid">
            {pages.slice(1).map((page) => (
              <Link href={page.path} key={page.path}>
                <span className="guide-card-type">
                  <GuideIcon kind={page.eyebrow} />
                  {page.eyebrow}
                </span>
                <strong>{page.title}</strong>
                <span>{page.description}</span>
                <small><b>Use this to:</b> {page.cardPrompt}</small>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
