import type { Metadata } from "next";
import Link from "next/link";
import { AssessmentWizard } from "../src/components/AssessmentWizard";
import { LandingAnalytics } from "../src/components/LandingAnalytics";
import { DecisionMap, GuideIcon, StageIcon } from "../src/components/VisualLanguage";
import { pages } from "../src/content/pages";

export const metadata: Metadata = {
  title: "DSEAR assessment finder and cost estimator",
  alternates: { canonical: "/" },
};

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
