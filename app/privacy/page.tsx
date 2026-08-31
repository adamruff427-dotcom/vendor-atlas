import type { Metadata } from 'next'
import { AnalyticsSettingsButton } from '../../src/components/GoogleAnalytics'

export const metadata: Metadata = {
  title: 'Privacy and analytics',
  description: 'How the Vendor Atlas pilot handles quote enquiries and analytics.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <article className="content-page">
      <header className="content-hero"><div className="shell narrow"><span className="eyebrow">Pilot notice</span><h1>Privacy and analytics</h1><p className="lead">Vendor Atlas is a product pilot operated by Cloudable Ltd. This notice explains the limited data used by the DSEAR finder.</p><AnalyticsSettingsButton /></div></header>
      <div className="shell article-grid">
        <div>
          <section><h2>Assessment answers</h2><p>Your questionnaire answers are used in your browser to calculate the qualification indication, estimate and supplier matches. They are included in a project brief only if you choose to submit one.</p></section>
          <section><h2>Project briefs</h2><p>When you submit a brief, we store the project answers, company name, contact name, business email, optional phone number, consent record, shortlist and estimate. A person will review the request and may contact you about arranging comparable quotations. Your contact details are not automatically sent to suppliers.</p></section>
          <section><h2>First-party funnel measurement</h2><p>We record a limited set of journey events on Vendor Atlas infrastructure: landing page viewed, assessment started and completed, results viewed, supplier viewed, and quote request started and completed. Records contain the event name, server time, page and a small allowlist of result status, service or supplier identifiers. They do not contain questionnaire answers, names, email addresses or phone numbers. These counts are used to test whether the service is useful and are not advertising profiles.</p></section>
          <section><h2>Hosting and security</h2><p>Vendor Atlas is delivered through OpenAI Sites and Cloudflare infrastructure. Those services necessarily receive technical request data such as IP address, browser information and requested pages, and Cloudflare may set a strictly necessary security cookie for bot and abuse protection. Vendor Atlas does not use that technical data or cookie for advertising.</p></section>
          <section><h2>Optional Google Analytics</h2><p>If you choose “Allow Google Analytics”, Google Analytics 4 also measures page visits, traffic sources, basic interactions such as scrolls and outbound links, and the same non-contact funnel events. The separate Vendor Atlas property uses measurement ID <code>G-R0FM31KWS7</code>. Advertising storage, advertising user data and advertising personalisation remain denied. Google Analytics does not load before permission is given.</p><p>Your choice is stored on this device. You can withdraw it at any time using <AnalyticsSettingsButton />. The site then tells Google to deny analytics storage and removes the first-party Google Analytics cookies it can identify for this property.</p><p>Google describes how Analytics processes and safeguards data in its <a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noreferrer">data safeguards guidance</a>.</p></section>
          <section><h2>Retention and requests</h2><p>Pilot project briefs and first-party measurement records will be reviewed and removed when no longer needed for follow-up or product validation. Google Analytics retention is managed in the separate Vendor Atlas property. To ask about, correct or delete a submitted request, email <a href="mailto:hello@cloudable.biz">hello@cloudable.biz</a>.</p></section>
        </div>
        <aside className="sources"><strong>Operator</strong><p>Cloudable Ltd<br />Company number 12104646<br />Vendor Atlas pilot</p><a href="mailto:hello@cloudable.biz">hello@cloudable.biz</a><p>Last updated 31 August 2026.</p></aside>
      </div>
    </article>
  )
}
