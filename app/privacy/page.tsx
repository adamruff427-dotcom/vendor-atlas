import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy and analytics",
  description: "How the Vendor Atlas pilot handles quote enquiries and analytics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <article className="content-page"><header className="content-hero"><div className="shell narrow"><span className="eyebrow">Pilot notice</span><h1>Privacy and analytics</h1><p className="lead">Vendor Atlas is a product pilot operated by Cloudable Ltd. This notice explains the limited data used by the DSEAR finder.</p></div></header><div className="shell article-grid"><div><section><h2>Assessment answers</h2><p>Your questionnaire answers are used in your browser to calculate the qualification indication, estimate and supplier matches. They are included in a quote request only if you choose to submit one.</p></section><section><h2>Quote requests</h2><p>When you submit a request, we store the project answers, company name, contact name, business email, optional phone number, consent record, shortlist and estimate so we can evaluate demand and follow up the request. No automated email is sent to suppliers.</p></section><section><h2>Analytics status</h2><p>The interface exposes named funnel events so the pilot can later measure whether the journey is useful. No third-party analytics or marketing tracker is connected in this release. This notice and any consent control will be updated before optional tracking is activated.</p></section><section><h2>Retention and requests</h2><p>Pilot quote requests will be reviewed and removed when no longer needed for follow-up or product validation. To ask about, correct or delete a submitted request, email <a href="mailto:hello@cloudable.biz">hello@cloudable.biz</a>.</p></section></div><aside className="sources"><strong>Operator</strong><p>Cloudable Ltd<br/>Company number 12104646<br/>Vendor Atlas pilot</p><a href="mailto:hello@cloudable.biz">hello@cloudable.biz</a><p>Last updated 30 August 2026.</p></aside></div></article>;
}
