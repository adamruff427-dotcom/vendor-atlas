import Link from 'next/link'
import { DecisionMarker, GuideIcon } from './VisualLanguage'
import { serviceDefinitions } from '../domain/service-assessment'
import type { DecisionPage } from '../content/pages'
import type { ServiceId } from '../domain/types'

type IndustrialServiceId = Exclude<ServiceId, 'dsear'>

export function ServiceDecisionArticle({ serviceId, page }: { serviceId: IndustrialServiceId; page: DecisionPage }) {
  const definition = serviceDefinitions[serviceId]
  const articleJsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: page.title, description: page.description, author: { '@type': 'Organization', name: 'Vendor Atlas' }, publisher: { '@type': 'Organization', name: 'Vendor Atlas' }, mainEntityOfPage: `https://vendoratlas.artificiallyconfident.com${page.path}` }
  const showPriceEvidence = page.path === definition.costPath
  return (
    <article className="content-page">
      <header className="content-hero"><div className="shell narrow"><div className="guide-hero-label"><GuideIcon kind={page.eyebrow} size="large" /><span className="eyebrow">{page.eyebrow}</span></div><h1>{page.title}</h1><p className="lead">{page.intro}</p><Link className="button primary" href={`/${serviceId}#assessment`}>Check my situation</Link></div></header>
      <div className="shell article-grid">
        <div>
          <section className="decision-panel" aria-labelledby="decision-heading"><div className="decision-panel-label"><DecisionMarker /><span className="eyebrow">Decision checkpoint</span></div><h2 id="decision-heading">{page.decision.heading}</h2><p>{page.decision.summary}</p><ul>{page.decision.checks.map((check) => <li key={check}>{check}</li>)}</ul><p className="decision-action"><strong>What to do next:</strong> {page.decision.action}</p></section>
          {page.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p>{section.detail && <p>{section.detail}</p>}{section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}</section>)}
          {showPriceEvidence && <section className="market-evidence-panel"><span className="eyebrow">Current calibration evidence</span><h2>Published prices are boundaries, not a market average</h2><p>Vendor Atlas uses these commercial provider sources only to constrain the first deterministic model. The inclusions and equipment differ, so the model is not described as a market benchmark.</p><ul>{definition.priceEvidence.map((item) => <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.label} <span aria-hidden>↗</span></a>: {item.note}</li>)}</ul><p><strong>What is still missing:</strong> awarded quote data normalised to the same asset schedule, access conditions and deliverables. The calculator shows every adjustment so it can be replaced cleanly as that evidence arrives.</p><Link className="button secondary" href={definition.toolkitPath}>Use the comparable-quote standard</Link></section>}
          {page.eyebrow === 'Supplier guide' && <section className="next-tools-panel"><h2>Put the selection rules into practice</h2><p>Use the directory to see the public evidence actually found, then send every shortlisted provider the same equipment brief and competence questions.</p><div className="hero-actions"><Link className="button primary" href={definition.supplierPath}>Browse the evidence directory</Link><Link className="button secondary" href={definition.toolkitPath}>Open the buying toolkit</Link></div></section>}
        </div>
        <aside className="sources"><span className="eyebrow">Go deeper</span><strong>Primary sources and further reading</strong><p>Each link explains what it can help you verify. HSE and legislation remain the authority; Vendor Atlas provides the buying interpretation.</p>{page.sources.map((item) => <div className="source-item" key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.label} <span aria-hidden>↗</span></a><p>{item.context}</p></div>)}<p className="source-disclaimer">External guidance can change. Check the source and publication status before relying on it.</p></aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </article>
  )
}
