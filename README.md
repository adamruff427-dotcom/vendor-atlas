# Vendor Atlas

Vendor Atlas is a lightweight UK procurement and compliance marketplace for compulsory B2B services. The live industrial-compliance estate covers DSEAR assessment, LEV thorough examination and test, pressure-system written schemes/examinations under PSSR, and LOLER thorough examinations.

Public site: `https://vendoratlas.artificiallyconfident.com/`

Every questionnaire is decision and procurement support. Vendor Atlas does not carry out a statutory assessment or examination, provide legal advice, certify compliance or approve suppliers.

## Current product scope

The MVP helps a UK business:

1. identify whether DSEAR assessment is likely to be relevant;
2. see the selected hazards, processes and project conditions behind that indication;
3. understand likely assessment scope;
4. obtain an explainable planning cost range;
5. compare three providers against the same deterministic matching criteria;
6. inspect a 12-provider evidence directory;
7. prepare a comparable brief, competence check and quote scorecard; and
8. submit one consistent project brief without automatically contacting suppliers.

Decision-support pages cover the DSEAR duty, likely cost drivers, specialist selection, manufacturing, breweries/distilleries, woodworking, spray booths, combustible dust, lithium batteries and DSEAR versus COSHH.

LEV, pressure systems and LOLER each have the same product standard:

1. a three-question-stage qualification journey with an explicit uncertain state;
2. source-backed explanations of the factors behind the result;
3. a service-specific likely appointment scope;
4. a deterministic planning range with every adjustment exposed;
5. three deterministically matched providers with plain-English reasons and gaps;
6. a full provider evidence directory with claim-level source URLs;
7. a printable buying toolkit, competence questions, quote scorecard and report acceptance check;
8. durable quote-intent capture through the same D1 enquiry workflow; and
9. substantive overview, decision, cost, supplier and comparison guides based on HSE and legislation.

Public routes use one product hostname and path-based verticals: `/dsear`, `/lev`, `/pressure-systems` and `/loler`. This consolidates the Vendor Atlas evidence and buying standard without coupling the qualification rules.

## Architecture

- React 19 and TypeScript
- Vinext/Vite application and server routes
- Cloudflare Worker-compatible Sites deployment
- Cloudflare D1 for submitted quote enquiries
- Drizzle schema and generated SQLite migration
- Vitest and Testing Library
- Minimal hand-written CSS; no authentication, AI or supplier-email dependency
- First-party funnel events plus optional, consent-gated Google Analytics 4

The core model uses generic `ServiceId`, `ServiceCategory`, `Supplier`, `ServiceSupplier`, `AssessmentAnswers`, `ServiceAssessmentAnswers`, `QualificationResult`, `PriceEstimate`, matching, evidence and enquiry types. DSEAR retains its proven hazard-specific rules; later verticals share generic equipment, work, documentation, inspection-status, site and procurement fields while keeping independent service rules and price configuration.

## Data model

Supplier records include:

- name and website;
- geographical coverage;
- sectors and service categories;
- capabilities and hazard experience;
- qualifications/professional-membership evidence;
- insurance evidence status;
- delivery modes;
- pricing evidence;
- a source URL and checked date for every material claim; and
- verification status.

Unknown evidence remains explicitly unknown. Provider-source evidence is not presented as Vendor Atlas approval.

Quote enquiries store project answers, the resulting indication, estimate, shortlist identifiers, company/contact details, consent, timestamp and workflow status. No automated supplier email exists in this version. A person reviews the brief, aims to contact the buyer within two working days and seeks permission before sharing contact details with a supplier.

## Qualification models

The DSEAR rules are deterministic. A selected dangerous-substance hazard produces `likely-relevant`; a specialist process without a selected hazard produces `may-be-relevant`; and neither produces `no-obvious-trigger`. The result is deliberately an initial indication. Hazard count, specialist processes, number of sites and site scale create an explainable complexity score used for scope and matching.

The rules never return “not required.” The no-trigger state tells the user to check substance labels, safety data and omitted process details with a competent person.

LEV returns `likely-relevant` where an identified airborne contaminant is controlled by one or more extraction systems; uncertain system classification remains `may-be-relevant`. Its scope covers process and contaminant review, physical examination, measurements, benchmark comparison, control judgement, prioritised defects and a system-specific record.

Pressure systems returns `likely-relevant` for explicit relevant-fluid indicators such as steam, gas above 0.5 bar above atmosphere or pressurised water above 110°C. Unknown fluid or pressure data returns `may-be-relevant`. Its scope preserves the required sequence: define the system, establish or review a suitable written scheme, then examine and report in accordance with it.

LOLER returns `likely-relevant` for identified lifting equipment or accessories and keeps unclassified equipment at `may-be-relevant`. Its scope covers itemised assets, first-use/installation/periodic/exceptional triggers, equipment-specific competent examination, Schedule 1 reporting and defect escalation.

All four models explicitly state that the finder is not the legal determination or statutory work. Tests cover positive, uncertain and no-obvious-trigger states and ensure the models never produce contradictory result, scope or price combinations.

## Pricing models

Pricing does not use an LLM. The current visible configuration is calibrated against three published provider price pages and starts from site size:

- micro: £1,600
- small: £2,200
- medium: £3,500
- large: £5,500

It then adds exact allowances for multiple hazard types (£300 each above two), a specialist process/zoning review (£900), combustible-dust complexity (£650), a new-installation/design review (£450), each additional site (£1,100), and a Northern Ireland travel assumption for a GB-based provider (£500). The calculator presents a ±22% standard or ±30% complex range, rounded to £50.

Calibration sources are [OTECSA Consulting](https://otecsaconsulting.com/cost-of-dsear/), [DSEAR RA Ltd](https://dsearriskassessments.co.uk/pricing/) and [York Green Safety Partners](https://www.yorkgreen.co.uk/services/dsear). Their published ranges do not use identical scopes, so the calculator remains planning guidance—not a market tariff, supplier quotation or claim about a listed provider's price. VAT, laboratory testing, remediation/design work and exceptional travel are excluded. The next calibration step is anonymised, scope-normalised awarded-quote data.

The other models are also deterministic and versioned:

- LEV: site attendance + systems + extraction points above the first five + complexity + missing benchmark data + additional sites. Initial calibration uses provider-published examples around simple single systems and a per-fan spray-booth service; it is not extrapolated as a market tariff.
- Pressure systems: competent-person attendance + pressure plant items + protective devices + new written-scheme allowance + system complexity + additional sites. Public calibration is limited mainly to simpler individual pressure vessels and coffee boilers, so the range is deliberately wider and explicitly unsuitable as an industrial market average.
- LOLER: minimum attendance + main lifting-equipment items + accessories + people-lifting allowance + complex equipment + additional sites. Public calibration includes per-item, plant and arborist-kit examples with materially different inclusions.

Every result shows the arithmetic, assumptions, excluded work and exact provider-price sources. All models exclude VAT, repairs, replacement parts, unusual access and specialist testing unless stated. The priority calibration input is scope-normalised awarded quote data collected through real projects.

## Matching models

Supplier matching is deterministic and unpaid:

- stated UK-wide or regional coverage: 4 points;
- provider-evidenced sector fit: 3 points;
- relevant hazard evidence: up to 6 points;
- project-complexity fit: 2 points; and
- hazardous-area-classification capability when the scope indicates it: 2 points.

The highest three scores are returned with human-readable reasons and evidence gaps. Name order is the stable tie-breaker. Qualifications, marketing claims and prices are not silently inferred or used in ranking.

LEV, pressure systems and LOLER use a parallel deterministic model:

- evidenced region coverage: 4 points;
- evidenced sector relevance: 3 points;
- selected equipment/process specialism matches: up to 8 points;
- standard or complex project fit: 3 points; and
- explicit core examination or written-scheme capability: 2 points.

The service is filtered before scoring. Missing region, sector or equipment evidence becomes a visible gap. Qualification wording, insurance statements, prices and paid placement do not influence ranking.

## Supplier evidence

The evidence directory contains 12 real providers, checked against their own public pages on 31 August 2026:

- [DW Consulting Services](https://www.dsearuk.com/)
- [DSEAR Assessments](https://dsearassessments.co.uk/)
- [DSEAR RA Ltd](https://dsearriskassessments.co.uk/)
- [OTECSA Consulting](https://www.dsearassessment.co.uk/)
- [SOCOTEC UK](https://www.socotec.co.uk/our-services/dsear-compliance)
- [PIB Risk Management](https://www.pib-riskmanagement.co.uk/consultancy/dsear)
- [York Green Safety Partners](https://www.yorkgreen.co.uk/services/dsear)
- [EPIT Group](https://www.epitgroup.com/consultancy/dsear-assessments/)
- [SGS United Kingdom](https://www.sgs.com/-/media/sgscorp/documents/corporate/technical-documents/baseefa-documents/technical-guides-and-wallcharts/dsear/bas-ps-025-sgs-crs-baseefa-dsear-services-brochure-en.cdn.en-GB.pdf)
- [Pyroban](https://www.pyroban.com/wp-content/uploads/2025/07/EXS-brochure-2025-July.pdf)
- [AL23 Safety](https://al23safety.com/dsear-risk-assessment/)
- [Inglewood Engineering](https://www.inglewoodengineering.com/dsear-compliance/area-classification-and-risk-assessment/)

The app retains the individual provider page supporting each displayed coverage, sector, hazard, capability or published-price claim. Unsupported coverage is displayed as “not evidenced publicly”. Public qualification and insurance details that could not be verified are not invented; the buyer is told to request them during pre-qualification. Directory inclusion and “provider source checked” are not Vendor Atlas approval.

The industrial examination directory adds real provider-source-checked records including Rayalon Filter Services, Combined Air, Apex LEV Services, Occupational Hygiene Services, Impact Technical Services, Mandate Systems, Bureau Veritas UK, Allianz Engineering Inspection Services, Zurich Engineering, Velocity Safety, SEIS, Certex UK, LOLER Examinations, Qualitas Asset Compliance, Robinsons Facilities Services and Safety Check Engineering.

Some providers appear in more than one vertical only where a checked source supports each service. The directory records exact coverage wording, equipment or process capabilities, provider-stated qualifications or accreditation, price evidence, insurance gaps and the public URL supporting every material claim. Accreditation and competence statements remain provider evidence until the buyer verifies the current scope and named person.

## Buyer toolkit

Each of `/dsear/buying-toolkit`, `/lev/buying-toolkit`, `/pressure-systems/buying-toolkit` and `/loler/buying-toolkit` is a printable procurement pack containing:

- an information-preparation checklist;
- a common project-brief format;
- competence and evidence questions;
- a three-provider quote-comparison scorecard;
- a report-acceptance check; and
- post-appointment review triggers linked to Regulation 5 and HSE L138.

This creates a consistent scope before prices are compared. It does not certify assessor competence or replace buyer due diligence.

## Evidence rules

Regulatory explanations prefer:

- [HSE DSEAR guidance](https://www.hse.gov.uk/fireandexplosion/dsear-background.htm)
- [The Dangerous Substances and Explosive Atmospheres Regulations 2002](https://www.legislation.gov.uk/uksi/2002/2776/contents)
- [HSE L138 Approved Code of Practice and guidance](https://www.hse.gov.uk/pubns/priced/l138.pdf)

The interface distinguishes legislation/regulator material, Vendor Atlas interpretation and provider-source evidence. Each decision guide has a practical checkpoint, explains what can change the answer and annotates every external reference with what it can help the reader verify. Sector and hazard pages add only relevant primary references rather than repeating a generic source list. The interface avoids legal conclusions, official-approval language, unsupported qualifications, invented prices and inferred experience.

Primary sources for the added services include:

- [HSE HSG258](https://books.hse.gov.uk/gempdf/hsg258.pdf), [HSE LEV FAQs](https://www.hse.gov.uk/lev/faqs.htm) and [COSHH regulation 9](https://www.legislation.gov.uk/uksi/2002/2677/regulation/9);
- [HSE PSSR overview](https://www.hse.gov.uk/pressure-systems/pssr.htm), [HSE written-scheme guidance](https://www.hse.gov.uk/pubns/indg178.htm) and [PSSR regulations 8–9](https://www.legislation.gov.uk/uksi/2000/128/part/II/crossheading/written-scheme-of-examination);
- [HSE thorough-examination guidance](https://www.hse.gov.uk/work-equipment-machinery/thorough-examinations-lifting-equipment.htm), [HSE LOLER overview](https://www.hse.gov.uk/work-equipment-machinery/loler-overview.htm) and [LOLER regulation 9](https://www.legislation.gov.uk/uksi/1998/2307/regulation/9).

## Analytics

The application exposes a small adapter and these named events:

- `landing_page_view`
- `assessment_started`
- `assessment_completed`
- `results_viewed`
- `supplier_viewed`
- `quote_request_started`
- `quote_request_completed`

The adapter always sends those events to a first-party `/api/events` endpoint backed by D1. Each record contains only the event name, server timestamp, page path and a small allowlist of non-contact metadata (`service`, result `status` or supplier identifier). It does not store questionnaire answers or contact details.

The site also has a dedicated Google Analytics 4 web stream (`G-R0FM31KWS7`) for visits, acquisition and the same named product events. The Google tag is not inserted until a visitor chooses “Allow Google Analytics”. Page views are emitted explicitly on initial load and client-side navigation. Advertising storage, Google Signals and ad-personalisation signals remain disabled. A persistent notice links to the privacy explanation and reopens the choice; withdrawing permission removes the tag and known first-party GA cookies. No questionnaire answers or contact fields are included in Google event payloads.

First-party event counts are directional rather than unique-user analytics and may contain repeated visits or automated traffic. GA4 reports only consented traffic, so it must not be treated as a complete traffic count. See [`docs/PILOT_OPERATIONS.md`](docs/PILOT_OPERATIONS.md) for the manual lead and funnel-review routine.

## Local setup

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
npm run dev
```

The local site is normally available at `http://localhost:3000/`. D1 is supplied through the local Cloudflare-compatible runtime.

Validation:

```bash
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

Regenerate a migration after changing `db/schema.ts`:

```bash
npm run db:generate
```

## Deployment

The repository is designed for OpenAI Sites/Cloudflare-compatible hosting. `.openai/hosting.json` declares the logical D1 binding. Production deployment packages the Worker/server output, static assets and Drizzle migration. The public release uses the custom hostname shown above, with the underlying ChatGPT Sites address retained as a hosting fallback.

Runtime secrets are not required for the MVP. Do not add credentials to the repository.

## Roadmap

- Phase 1: DSEAR assessment procurement — implemented
- Phase 2: LEV examination and testing — implemented
- Phase 3: PSSR written schemes and examinations — implemented
- Phase 4: LOLER thorough examinations — implemented
- Separate digital-assurance experiment: ISO 42001, followed by ISO 27001 and SOC 2 only if evidence supports it

The immediate roadmap is evidence and commercial validation rather than another vertical: collect scope-normalised quotes, verify funnel behaviour, review supplier corrections, test real enquiry handling and recalibrate the deterministic models. Future verticals should preserve the generic service/supplier/evidence/matching model and add a new configuration rather than copying or coupling the DSEAR implementation.
