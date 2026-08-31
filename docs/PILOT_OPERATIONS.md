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

## Human review boundary

- Do not tell a buyer that Vendor Atlas has approved a supplier.
- Review the provider-source evidence and disclose evidence gaps.
- Request named-assessor competence, relevant project experience, insurance and quotation exclusions before an introduction is treated as suitable.
- Do not accept payment for shortlist position.
- Record commercial terms separately and disclose any introduction fee before it could affect a buyer or supplier decision.

## Data requests

Requests to inspect, correct or delete a submitted brief go to `hello@cloudable.biz`. Match the request carefully before changing or disclosing a record. Database deletion or status changes are manual operator actions and should be recorded.
