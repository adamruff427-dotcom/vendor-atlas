'use client'

import { useState } from 'react'
import { AssessmentWizard } from './AssessmentWizard'
import { ServiceAssessmentWizard } from './ServiceAssessmentWizard'
import { TechnicalDiagram } from './TechnicalDiagram'
import { serviceDefinitions } from '../domain/service-assessment'
import { serviceIds, type ServiceId } from '../domain/types'

type GuideLinks = Record<ServiceId, Array<{ path: string; title: string }>>

export function ServiceFinder({ initialService, guides }: { initialService: ServiceId; guides: GuideLinks }) {
  const [service, setService] = useState(initialService)
  const definition = service === 'dsear' ? null : serviceDefinitions[service]
  const name = definition?.shortName ?? 'DSEAR'
  const toolkit = definition?.toolkitPath ?? '/dsear/buying-toolkit'
  const directory = definition?.supplierPath ?? '/dsear/suppliers'

  return <div className="shell finder-shell">
    <header className="finder-intro">
      <span className="eyebrow">UK compliance service finder</span>
      <h1>Check what you need.<br />Find the right specialist.</h1>
      <p>Choose a service and answer a few practical questions. See why it may apply, what the work involves, an indicative cost and suitable providers.</p>
      <span className="microcopy">Free · no account · usually about two minutes</span>
    </header>

    <div className="service-picker" id="finder">
      <label htmlFor="compliance-service">Which service are you looking for?</label>
      <select id="compliance-service" value={service} aria-describedby="service-change-note" onChange={event => setService(event.target.value as ServiceId)}>
        {serviceIds.map(id => <option value={id} key={id}>{id === 'dsear' ? 'DSEAR — fire and explosion risk' : serviceDefinitions[id].shortName}</option>)}
      </select>
      <p id="service-change-note">Changing service starts a fresh check. Each service has its own questions, evidence and pricing rules.</p>
    </div>

    {service === 'dsear' ? <AssessmentWizard key={service} /> : <ServiceAssessmentWizard key={service} serviceId={service} />}

    <section className="finder-resources" id="guidance" aria-labelledby="finder-guidance-heading">
      <h2 id="finder-guidance-heading">More help with {name}</h2>
      <p>Use these when you need more detail before appointing someone. This questionnaire is decision support, not a professional assessment or a legal determination.</p>
      <div className="finder-resource-actions">
        <a href={toolkit}>Buying toolkit and quote checklist →</a>
        <a href={directory}>Supplier evidence directory →</a>
      </div>
      <details key={service}>
        <summary>Guides, technical explanations and references</summary>
        <ul>{guides[service].map(guide => <li key={guide.path}><a href={guide.path}>{guide.title}</a></li>)}</ul>
        {service !== 'dsear' && <TechnicalDiagram serviceId={service} />}
      </details>
    </section>
  </div>
}
