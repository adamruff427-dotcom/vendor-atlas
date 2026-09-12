import Link from 'next/link'
import { LandingAnalytics } from './LandingAnalytics'
import { DecisionMap, GuideIcon, StageIcon } from './VisualLanguage'
import { ServiceAssessmentWizard } from './ServiceAssessmentWizard'
import { TechnicalDiagram } from './TechnicalDiagram'
import { serviceDefinitions } from '../domain/service-assessment'
import { servicePages } from '../content/service-pages'
import { suppliersForService } from '../data/service-suppliers'
import type { ServiceId } from '../domain/types'

type IndustrialServiceId = Exclude<ServiceId, 'dsear'>

export function ServiceLanding({ serviceId }: { serviceId: IndustrialServiceId }) {
  const definition = serviceDefinitions[serviceId]
  const pages = servicePages[serviceId]
  const suppliers = suppliersForService(serviceId)
  const mapCopy = serviceId === 'lev'
    ? { firstTitle: 'Contaminant and extraction', firstDetail: 'What is captured, by which systems and hoods?', signalDetail: 'Which facts point to a COSHH TExT duty?' }
    : serviceId === 'pressure-systems'
      ? { firstTitle: 'Fluid and pressure system', firstDetail: 'Which vessels, devices and operating conditions?', signalDetail: 'Which facts point to PSSR and a written scheme?' }
      : serviceId === 'loler'
        ? { firstTitle: 'Equipment and lifting use', firstDetail: 'What lifts people, loads or connects them?', signalDetail: 'Which facts point to a LOLER examination?' }
        : serviceId === 'asbestos'
          ? { firstTitle: 'Premises and planned work', firstDetail: 'Which buildings, areas and fabric may be disturbed?', signalDetail: 'Which facts point to a survey or register gap?' }
          : serviceId === 'fire-risk-assessment'
            ? { firstTitle: 'Premises and responsible people', firstDetail: 'Who controls which buildings, floors and occupancies?', signalDetail: 'Which facts set the fire assessment depth?' }
            : { firstTitle: 'Water systems and people', firstDetail: 'Which outlets, assets and users are exposed?', signalDetail: 'Which facts set the legionella assessment depth?' }

  return (
    <>
      <LandingAnalytics service={serviceId} />
      <section className="hero service-hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{definition.eyebrow}</span>
            <h1>{definition.question}</h1>
            <p className="lead">{definition.promise}</p>
            <p>{definition.description}</p>
            <a className="button primary" href="#assessment">Start the check</a>
            <p className="microcopy">Free · no account · no AI-generated prices</p>
          </div>
          <DecisionMap {...mapCopy} />
        </div>
      </section>
      <div className="shell">
        <ServiceAssessmentWizard serviceId={serviceId} />
        <TechnicalDiagram serviceId={serviceId} />
        <section className="explainer">
          <div><span className="eyebrow">Built for a real appointment</span><h2>From uncertain duty to a comparable brief</h2></div>
          <div className="three-cols">
            <article><StageIcon stage="check" /><strong>1. Check relevance</strong><p>Use the equipment, operating and record signals without pretending a short finder makes the legal determination.</p></article>
            <article><StageIcon stage="scope" /><strong>2. See the likely scope</strong><p>Understand the examination, documentation and preparation that providers need to price on the same basis.</p></article>
            <article><StageIcon stage="compare" /><strong>3. Compare evidence</strong><p>Match on location, sector, equipment, complexity and required capability—not advertising spend.</p></article>
          </div>
        </section>
        <section className="guide-links">
          <div className="resource-strip">
            <div><span className="eyebrow">{definition.shortName} buyer tools</span><h2>Use the same standard for every quote</h2><p>Turn the result into a documented scope, competence check and comparable provider shortlist.</p></div>
            <div className="resource-strip-links">
              <Link href={definition.toolkitPath}><strong>Buying toolkit</strong><span>Printable brief, evidence questions, quote scorecard and report acceptance check.</span></Link>
              <Link href={definition.supplierPath}><strong>UK evidence directory</strong><span>{suppliers.length} providers with sourced claims, visible gaps and no paid ranking.</span></Link>
            </div>
          </div>
          <div><span className="eyebrow">Practical decision guides</span><h2>Read only what helps the buying decision</h2></div>
          <div className="link-grid">
            {pages.slice(1).map((page) => <Link href={page.path} key={page.path}><span className="guide-card-type"><GuideIcon kind={page.eyebrow} />{page.eyebrow}</span><strong>{page.title}</strong><span>{page.description}</span><small><b>Use this to:</b> {page.cardPrompt}</small></Link>)}
          </div>
        </section>
      </div>
    </>
  )
}
