# Vendor Atlas pilot operations

The public product is deliberately automated only up to durable capture. A person reviews project briefs and decides whether to contact the buyer or approach a supplier.

## Daily check

On each working day:

1. Open the Vendor Atlas site in Codex and ask: `Show new Vendor Atlas enquiries from the production D1 enquiries table.`
2. Treat returned contact and project details as confidential buyer information.
3. Exclude clearly labelled QA/example records from buyer-intent counts.
4. Contact a genuine buyer from `hello@cloudable.biz`, aiming to respond within two working days.
5. Confirm the project details and ask permission before sending their identity or contact information to any supplier.

The Sites database viewer provides the same read-only table access when a manual check outside Codex is preferred.

## Funnel review

Ask Codex to read the production `analytics_events` table and summarise counts for:

- `landing_page_view`
- `assessment_started`
- `assessment_completed`
- `results_viewed`
- `supplier_viewed`
- `quote_request_started`
- `quote_request_completed`

The event table intentionally contains no questionnaire answers, company names, contact names, email addresses or telephone numbers. Its counts are directional: they are not unique-user analytics and may include repeated visits or automated traffic.

Review the dedicated **Vendor Atlas** Google Analytics 4 property separately for consented page views, acquisition sources and the same named product events. The web stream measurement ID is `G-R0FM31KWS7`. GA4 will undercount total traffic because it does not load until a visitor allows it; do not compare its total directly with the always-on first-party landing count as though they use the same denominator.

For the weekly pilot note, record:

1. first-party landing, assessment-start, result and completed-brief counts;
2. GA4 consented users and sessions by source/medium;
3. landing → assessment-start, start → result and result → completed-brief conversion;
4. supplier-profile outbound clicks; and
5. obvious QA, bot or operator traffic that should be excluded from interpretation.

Never send questionnaire answers, company names, contact names, email addresses or telephone numbers to GA4.

## Pricing calibration

The current deterministic model is calibrated against three public provider price pages, not awarded quotes. For every genuine quote received, retain an anonymised record of the quoted fee, VAT/travel treatment, number of sites, size band, hazards, whether HAC calculations/drawings are included, other deliverables and material exclusions. Do not update the public model from a single outlier. Review only a scope-normalised set, version every change and keep the earlier configuration reproducible.

## Human review boundary

- Do not tell a buyer that Vendor Atlas has approved a supplier.
- Review the provider-source evidence and disclose evidence gaps.
- Request named-assessor competence, relevant project experience, insurance and quotation exclusions before an introduction is treated as suitable.
- Do not accept payment for shortlist position.
- Record commercial terms separately and disclose any introduction fee before it could affect a buyer or supplier decision.

## Data requests

Requests to inspect, correct or delete a submitted brief go to `hello@cloudable.biz`. Match the request carefully before changing or disclosing a record. Database deletion or status changes are manual operator actions and should be recorded.
