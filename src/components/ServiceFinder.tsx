'use client'

import { useEffect, useRef, useState } from 'react'
import { AssessmentWizard } from './AssessmentWizard'
import { ServiceAssessmentWizard } from './ServiceAssessmentWizard'
import { TechnicalDiagram } from './TechnicalDiagram'
import { suppliersForService } from '../data/service-suppliers'
import { track } from '../analytics'
import { serviceDefinitions } from '../domain/service-assessment'
import { isServiceId, serviceIds, type ServiceId } from '../domain/types'

type GuideLinks = Record<ServiceId, Array<{ path: string; title: string }>>

export function ServiceFinder({ initialService, guides }: { initialService: ServiceId; guides: GuideLinks }) {
  const [service, setService] = useState(initialService)
  const [queryLoaded, setQueryLoaded] = useState(false)
  const trackedLanding = useRef(false)
  const definition = service === 'dsear' ? null : serviceDefinitions[service]
  const activeDefinition = definition ?? serviceDefinitions['kitchen-extract-cleaning']
  const name = definition?.shortName ?? 'DSEAR'
  const toolkit = definition?.toolkitPath ?? '/dsear/buying-toolkit'
  const directory = definition?.supplierPath ?? '/dsear/suppliers'

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get('service')
    if (requestedService && isServiceId(requestedService)) setService(requestedService)
    setQueryLoaded(true)
  }, [])

  useEffect(() => {
    if (queryLoaded && !trackedLanding.current) {
      track('landing_page_view', { service })
      trackedLanding.current = true
    }
  }, [queryLoaded, service])

  const selectService = (nextService: ServiceId) => {
    setService(nextService)
    const url = new URL(window.location.href)
    if (nextService === 'dsear') url.searchParams.delete('service')
    else url.searchParams.set('service', nextService)
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
  }

  return <div className="shell finder-shell">
    <header className="finder-intro">
      <span className="eyebrow">UK compliance service finder</span>
      <h1>Check what you need.<br />Find the right specialist.</h1>
      <p>Choose a service and answer a few practical questions. See why it may apply, what the work involves, an indicative cost and suitable providers.</p>
      <span className="microcopy">Free · no account · usually about two minutes</span>
    </header>

    <div className="service-picker" id="finder">
      <label htmlFor="compliance-service">Which service are you looking for?</label>
      <select id="compliance-service" value={service} aria-describedby="service-change-note" onChange={event => selectService(event.target.value as ServiceId)}>
        {serviceIds.map(id => <option value={id} key={id}>{id === 'dsear' ? 'DSEAR — fire and explosion risk' : serviceDefinitions[id].shortName}</option>)}
      </select>
      <p id="service-change-note">Changing service starts a fresh check. Each service has its own questions, evidence and pricing rules.</p>
    </div>

    {service === 'dsear' ? <AssessmentWizard key={service} /> : <ServiceAssessmentWizard key={service} serviceId={service} />}

    <section className="finder-resources" id="guidance" aria-labelledby="finder-guidance-heading">
      <h2 id="finder-guidance-heading">More help with {name}</h2>
      <p>Use these when you need more detail before appointing someone. This questionnaire is decision support, not a professional assessment or a legal determination.</p>
      {service === 'workplace-first-aid-training'
        ? <div className="finder-resource-actions"><a href="#assessment">Start the shared training check</a><a href={activeDefinition.guidePath}>HSE sources and provider evidence</a></div>
        : service === 'rpe-face-fit-testing'
        ? <div className="finder-resource-actions"><a href="#assessment">Start the shared face-fit check</a><a href={activeDefinition.guidePath}>HSE, Fit2Fit and provider evidence</a></div>
        : service === 'kitchen-extract-cleaning'
        ? <div className="finder-resource-actions"><a href="#assessment">Start the kitchen extract check</a><a href={activeDefinition.guidePath}>Sources and provider evidence</a></div>
        : <div className="finder-resource-actions"><a href={toolkit}>Buying toolkit and quote checklist →</a><a href={directory}>Supplier evidence directory →</a></div>}
      <details key={service}>
        <summary>Guides, technical explanations and references</summary>
        <ul>{guides[service].map(guide => <li key={guide.path}><a href={guide.path}>{guide.title}</a></li>)}</ul>
        {service !== 'dsear' && <>
          <div className="finder-source-notes" id="source-note">
            <h3>Duty and technical sources</h3>
            <p>{activeDefinition.legalBasis}</p>
            <ul>{activeDefinition.primaryLinks.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noreferrer">{link.label}</a> — {link.detail}</li>)}</ul>
            {activeDefinition.priceEvidence.length > 0 && <><h3>Published price evidence</h3><ul>{activeDefinition.priceEvidence.map(item => <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.label}</a> — {item.note}</li>)}</ul></>}
            {service === 'kitchen-extract-cleaning' && <><h3>Supplier evidence checked</h3><ul>{suppliersForService(service).map(supplier => <li key={supplier.id}><a href={supplier.website} target="_blank" rel="noreferrer">{supplier.name}</a> — {supplier.evidence[0]?.claim} Evidence found from provider source; not a Vendor Atlas approval.</li>)}</ul></>}
            {service === 'workplace-first-aid-training' && <><h3>Provider evidence checked</h3><ul>{suppliersForService(service).map(supplier => <li key={supplier.id}><a href={supplier.website} target="_blank" rel="noreferrer">{supplier.name}</a> — {supplier.evidence[0]?.claim} Evidence found from provider source; not a Vendor Atlas approval.</li>)}</ul><p>HSE stopped approving first-aid training providers. Check current course and awarding evidence, trainer competence, insurance and terms directly before purchase.</p></>}
            {service === 'rpe-face-fit-testing' && <><h3>Provider evidence checked</h3><ul>{suppliersForService(service).map(supplier => <li key={supplier.id}><a href={supplier.website} target="_blank" rel="noreferrer">{supplier.name}</a> — {supplier.evidence[0]?.claim} Evidence found from provider source; not a Vendor Atlas approval.</li>)}</ul><p>We record provider and Fit2Fit directory evidence as found, not an approval. Confirm the exact facepiece, selected method, named tester, competence and current insurance before appointment.</p></>}
          </div>
          <TechnicalDiagram serviceId={service} />
        </>}
      </details>
    </section>
  </div>
}
