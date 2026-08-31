import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pages } from "../../../src/content/pages";
import { DecisionMarker, GuideIcon } from "../../../src/components/VisualLanguage";

type Props = { params: Promise<{ slug?: string[] }> };
function resolvePage(slug?: string[]) {
  const path = `/dsear${slug?.length ? `/${slug.join("/")}` : ""}`;
  return pages.find((page) => page.path === path);
}
export async function generateStaticParams() {
  return pages.map((page) => ({
    slug: page.path === "/dsear" ? [] : page.path.replace("/dsear/", "").split("/"),
  }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = resolvePage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: { title: page.title, description: page.description, url: page.path },
  };
}

export default async function DsearPage({ params }: Props) {
  const { slug } = await params;
  const page = resolvePage(slug);
  if (!page) notFound();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    author: { "@type": "Organization", name: "Vendor Atlas" },
    publisher: { "@type": "Organization", name: "Vendor Atlas" },
    mainEntityOfPage: `https://vendoratlas.artificiallyconfident.com${page.path}`,
  };
  return (
    <article className="content-page">
      <header className="content-hero">
        <div className="shell narrow">
          <div className="guide-hero-label">
            <GuideIcon kind={page.eyebrow} size="large" />
            <span className="eyebrow">{page.eyebrow}</span>
          </div>
          <h1>{page.title}</h1>
          <p className="lead">{page.intro}</p>
          <Link className="button primary" href="/#assessment">
            Check my situation
          </Link>
        </div>
      </header>
      <div className="shell article-grid">
        <div>
          <section className="decision-panel" aria-labelledby="decision-heading">
            <div className="decision-panel-label">
              <DecisionMarker />
              <span className="eyebrow">Decision checkpoint</span>
            </div>
            <h2 id="decision-heading">{page.decision.heading}</h2>
            <p>{page.decision.summary}</p>
            <ul>
              {page.decision.checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
            <p className="decision-action">
              <strong>What to do next:</strong> {page.decision.action}
            </p>
          </section>
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {section.detail && <p>{section.detail}</p>}
              {section.points && (
                <ul>
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          {page.path === "/dsear/cost" && (
            <section className="market-evidence-panel">
              <span className="eyebrow">Current calibration evidence</span>
              <h2>Published ranges are a sense-check, not a market average</h2>
              <p>Vendor Atlas recalibrated its first model on 31 August 2026 against three provider-published ranges. They are commercial sources and their inclusions differ, so the calculator uses them as an order-of-magnitude boundary—not as proof of the price a competitive tender will achieve.</p>
              <ul>
                <li><a href="https://otecsaconsulting.com/cost-of-dsear/" target="_blank" rel="noreferrer">OTECSA Consulting <span aria-hidden>↗</span></a>: publishes £1,500–£3,500 for a small/simple site, £3,000–£6,000 for mid-sized work and £5,000–£10,000 for complex work.</li>
                <li><a href="https://dsearriskassessments.co.uk/pricing/" target="_blank" rel="noreferrer">DSEAR RA Ltd <span aria-hidden>↗</span></a>: publishes around £2,000–£3,000 for small single-site work, £3,500–£4,500 for most assessments and £5,000–£10,000 for larger/complex sites.</li>
                <li><a href="https://www.yorkgreen.co.uk/services/dsear" target="_blank" rel="noreferrer">York Green Safety Partners <span aria-hidden>↗</span></a>: publishes £3,000–£15,000+ for a scope it says includes HAC drawings and an ATEX equipment audit.</li>
              </ul>
              <p><strong>What is still missing:</strong> awarded quote data normalised to the same brief. Vendor Atlas will not describe the model as a market benchmark until that evidence exists.</p>
              <Link className="button secondary" href="/dsear/buying-toolkit">Use the comparable-quote standard</Link>
            </section>
          )}
          {page.path === "/dsear/who-can-carry-out-a-dsear-assessment" && (
            <section className="next-tools-panel"><h2>Put the selection rules into practice</h2><p>Use the directory to see exactly which public claims were found, then send each shortlisted provider the same brief and competence questions.</p><div className="hero-actions"><Link className="button primary" href="/dsear/suppliers">Browse the evidence directory</Link><Link className="button secondary" href="/dsear/buying-toolkit">Open the buying toolkit</Link></div></section>
          )}
        </div>
        <aside className="sources">
          <span className="eyebrow">Go deeper</span>
          <strong>Primary sources and further reading</strong>
          <p>Each link explains what it can help you verify. HSE and legislation remain the authority; Vendor Atlas provides the buying interpretation.</p>
          {page.sources.map((source) => (
            <div className="source-item" key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.label} <span aria-hidden>↗</span>
              </a>
              <p>{source.context}</p>
            </div>
          ))}
          <p className="source-disclaimer">External guidance can change. Check the source and publication status before relying on it.</p>
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </article>
  );
}
