import type { Metadata } from 'next'
import Link from 'next/link'
import { TrackedSupplierLink } from '../../../src/components/TrackedSupplierLink'
import { suppliers } from '../../../src/data/suppliers'

export const metadata: Metadata = {
  title: 'UK DSEAR specialist directory',
  description: 'Compare public evidence for UK DSEAR assessment and hazardous-area specialists without paid ranking.',
  alternates: { canonical: '/dsear/suppliers' },
}

const regionLabels: Record<string, string> = {
  'uk-wide': 'UK-wide', 'great-britain': 'Great Britain', scotland: 'Scotland', north: 'North of England', midlands: 'Midlands', wales: 'Wales', 'south-west': 'South West', 'south-east': 'South East', london: 'London', 'northern-ireland': 'Northern Ireland',
}

export default function SupplierDirectoryPage() {
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'UK DSEAR specialist evidence directory',
    itemListElement: suppliers.map((supplier, index) => ({ '@type': 'ListItem', position: index + 1, name: supplier.name, url: supplier.website })),
  }
  return (
    <article className="content-page supplier-directory-page">
      <header className="content-hero"><div className="shell narrow"><span className="eyebrow">Evidence directory</span><h1>UK DSEAR specialists</h1><p className="lead">A market map of {suppliers.length} providers with claim-level source links, explicit evidence gaps and no paid ranking.</p><div className="hero-actions"><Link className="button primary" href="/#assessment">Find matches for my project</Link><Link className="button secondary" href="/dsear/buying-toolkit">Open the buying toolkit</Link></div></div></header>
      <div className="shell directory-intro">
        <section className="decision-panel"><span className="eyebrow">How to read this directory</span><h2>Evidence found is not approval</h2><p>Vendor Atlas records what a provider says on a public source and when it was checked. It does not independently certify competence, insurance, capacity or project fit. Ask the same evidence questions of every shortlisted provider.</p><ul><li>Match experience to your substances, process and likely zoning work.</li><li>Request named-assessor competence and current insurance evidence.</li><li>Compare deliverables and exclusions before comparing the headline price.</li></ul></section>
      </div>
      <div className="shell directory-grid">
        {suppliers.map((supplier) => (
          <article className="directory-card" key={supplier.id}>
            <div className="directory-card-head"><div><span className="verification">Provider source checked · {new Date(supplier.lastVerifiedDate).toLocaleDateString('en-GB')}</span><h2>{supplier.name}</h2></div><span className="evidence-count">{supplier.evidence.length} sourced claim{supplier.evidence.length === 1 ? '' : 's'}</span></div>
            <dl className="supplier-facts">
              <div><dt>Stated coverage</dt><dd>{supplier.geographicalCoverage.map((region) => regionLabels[region] ?? region).join(', ') || 'Not evidenced publicly'}</dd></div>
              <div><dt>Delivery</dt><dd>{supplier.deliveryModes.map((mode) => mode.replace('-', ' ')).join(', ')}</dd></div>
              <div><dt>Capabilities found</dt><dd>{supplier.capabilities.join(', ')}</dd></div>
              <div><dt>Pricing evidence</dt><dd>{supplier.pricingEvidence}</dd></div>
              <div><dt>Insurance evidence</dt><dd>{supplier.insuranceEvidence}</dd></div>
            </dl>
            {supplier.qualificationsAndMemberships.length > 0 && <div className="directory-evidence-note"><strong>Qualification or membership evidence found</strong><p>{supplier.qualificationsAndMemberships.join(' ')}</p></div>}
            <details><summary>View every recorded source</summary><ol className="source-claim-list">{supplier.evidence.map((item) => <li key={`${item.sourceUrl}:${item.claim}`}><TrackedSupplierLink href={item.sourceUrl} supplierId={supplier.id}>{item.claim} <span aria-hidden>↗</span></TrackedSupplierLink><small>Provider source checked {new Date(item.checkedOn).toLocaleDateString('en-GB')}</small></li>)}</ol></details>
            <TrackedSupplierLink className="button secondary" href={supplier.website} supplierId={supplier.id}>Visit provider source <span aria-hidden>↗</span></TrackedSupplierLink>
          </article>
        ))}
      </div>
      <div className="shell evidence-method"><h2>Maintenance rule</h2><p>Profiles are rechecked when a material claim is challenged, a provider asks for a correction, or before a provider is used in a live buyer shortlist after the recorded check becomes stale. A missing public claim is shown as an evidence gap, not treated as proof that the capability does not exist.</p><p>Provider pages are commercial sources. Regulatory claims elsewhere on Vendor Atlas use HSE or legislation wherever possible.</p></div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  )
}
