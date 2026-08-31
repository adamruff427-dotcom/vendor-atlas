# Vendor Atlas

Vendor Atlas is a lightweight UK procurement and compliance marketplace for compulsory B2B services. The first vertical is a DSEAR risk-assessment finder, deterministic cost estimator, evidence-backed supplier comparison and comparable-quote intake.

Public site: `https://vendoratlas.artificiallyconfident.com/`

The questionnaire is decision and procurement support. It does not conduct a legally suitable and sufficient DSEAR risk assessment, provide legal advice, certify compliance or approve suppliers.

## Current DSEAR scope

The MVP helps a UK business:

1. identify whether DSEAR assessment is likely to be relevant;
2. see the selected hazards, processes and project conditions behind that indication;
3. understand likely assessment scope;
4. obtain an explainable planning cost range;
5. compare three providers against the same deterministic matching criteria; and
6. submit one consistent project brief without automatically contacting suppliers.

Decision-support pages cover the DSEAR duty, likely cost drivers, specialist selection, manufacturing, breweries/distilleries, woodworking, spray booths, combustible dust, lithium batteries and DSEAR versus COSHH.

## Architecture

- React 19 and TypeScript
- Vinext/Vite application and server routes
- Cloudflare Worker-compatible Sites deployment
- Cloudflare D1 for submitted quote enquiries
- Drizzle schema and generated SQLite migration
- Vitest and Testing Library
- Minimal hand-written CSS; no analytics, authentication, AI or supplier-email dependency

The core model uses generic `ServiceCategory`, `Supplier`, `AssessmentAnswers`, `QualificationResult`, `PriceEstimate`, `SupplierMatch`, `EvidenceClaim` and `Enquiry` types. DSEAR is one configured service vertical rather than the shape of the platform itself.

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

Quote enquiries store project answers, the resulting indication, estimate, shortlist identifiers, company/contact details, consent, timestamp and workflow status. No automated supplier email exists in this version.

## Qualification model

The DSEAR rules are deterministic. A selected dangerous-substance hazard produces `likely-relevant`; a specialist process without a selected hazard produces `may-be-relevant`; and neither produces `no-obvious-trigger`. The result is deliberately an initial indication. Hazard count, specialist processes, number of sites and site scale create an explainable complexity score used for scope and matching.

The rules never return “not required.” The no-trigger state tells the user to check substance labels, safety data and omitted process details with a competent person.

## Pricing model

Pricing does not use an LLM. A visible configuration starts from site size:

- micro: £850
- small: £1,200
- medium: £1,900
- large: £3,000

It then adds exact allowances for multiple hazard types (£225 each above two), a specialist process/zoning review (£550), combustible-dust complexity (£450), a new-installation/design review (£350), each additional site (£750), and a Northern Ireland travel assumption for a GB-based provider (£500). The calculator presents a ±22% standard or ±30% complex range, rounded to £50.

This is Vendor Atlas planning guidance, not a supplier quotation or a claim about a provider's price. VAT, laboratory testing, remediation/design work and exceptional travel are excluded.

## Matching model

Supplier matching is deterministic and unpaid:

- stated UK-wide or regional coverage: 4 points;
- provider-evidenced sector fit: 3 points;
- relevant hazard evidence: up to 6 points;
- project-complexity fit: 2 points; and
- hazardous-area-classification capability when the scope indicates it: 2 points.

The highest three scores are returned with human-readable reasons and evidence gaps. Name order is the stable tie-breaker. Qualifications, marketing claims and prices are not silently inferred or used in ranking.

## Supplier evidence

The seed set contains four real UK providers, checked against their own public pages on 30 August 2026:

- [DW Consulting Services](https://www.dsearuk.com/)
- [DSEAR Assessments](https://dsearassessments.co.uk/)
- [DSEAR RA Ltd](https://dsearriskassessments.co.uk/)
- [OTECSA Consulting](https://www.dsearassessment.co.uk/)

The app retains the individual provider page supporting each displayed coverage, sector, hazard or capability claim. Public qualification and insurance details that could not be verified are not invented; the buyer is told to request them during pre-qualification.

## Evidence rules

Regulatory explanations prefer:

- [HSE DSEAR guidance](https://www.hse.gov.uk/fireandexplosion/dsear-background.htm)
- [The Dangerous Substances and Explosive Atmospheres Regulations 2002](https://www.legislation.gov.uk/uksi/2002/2776/contents)
- [HSE L138 Approved Code of Practice and guidance](https://www.hse.gov.uk/pubns/priced/l138.pdf)

The interface distinguishes legislation/regulator material, Vendor Atlas interpretation and provider-source evidence. It avoids legal conclusions, official-approval language, unsupported qualifications, invented prices and inferred experience.

## Analytics

The application exposes a small adapter and these named events:

- `landing_page_view`
- `assessment_started`
- `assessment_completed`
- `results_viewed`
- `supplier_viewed`
- `quote_request_started`
- `quote_request_completed`

No third-party analytics provider or marketing tracker is connected in this release. A visible notice states that activation boundary. Before connecting GA4, Plausible or another provider, update the privacy notice and implement any consent control required by the selected configuration.

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

## Roadmap — not implemented

- Phase 2: LEV examination and testing
- Phase 3: PSSR inspections
- Phase 4: LOLER inspections
- Separate digital-assurance experiment: ISO 42001, followed by ISO 27001 and SOC 2 only if evidence supports it

Future work should preserve the generic service/supplier/evidence/matching model and add a new vertical configuration rather than copying or coupling the DSEAR implementation.
