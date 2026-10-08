# Website Ad Analysis Tool

Product and technical specification · Version 0.2 · 8 October 2026

## Purpose and recommendation

Build a web app where Joan can enter a public website URL, capture the advertisements visible during a browser visit, and inspect structured analysis beside the original evidence. The initial example is https://www.marca.com. The product studies advertising displayed on publisher pages, rather than finding all campaigns belonging to a company.

Start with a single URL, a single desktop browser visit, static creative screenshots, human review of detected placements, and a searchable results dashboard. Validate capture reliability before adding daily monitoring. This document defines the intended application; no application has been built or live Marca placements verified.

## Product value and intended users

The product turns a sampled publisher-page visit into an organised advertising research record. Its value is reducing manual screenshots, transcription, tagging and comparison while retaining evidence users can inspect. The primary audience is creative strategists and agency researchers who already gather these examples manually. Demand and time savings are hypotheses to validate with real users.

| Beneficiary | Use case | Practical value | Limit |
|---|---|---|---|
| Creative strategists | Compare hooks, offers and formats | Prepare evidence-backed creative briefs | Ideas to test, not proven winners |
| Agency researchers | Gather examples across publishers | Reduce transcription and organise client research | Sampled collection, not complete coverage |
| Brand marketing teams | Review visible category messaging | Understand how captured advertisers communicate | No verified targeting or performance |
| Publisher advertising teams | Review placement appearance | Document cropping, readability and visible creatives | Does not replace an ad-server audit |
| Designers and copywriters | Find references by message or format | Develop original creative concepts with accessible examples | No automatic rights to reuse captured artwork |
| Analysts | Export consistent observations | Compare a sample with traceable evidence | Counts are not market share |

### Why companies would use it

Teams that repeatedly inspect publisher pages could replace scattered screenshots and spreadsheets with a searchable collection combining source context, visible copy and consistent categories. A colleague can inspect the original evidence behind a recommendation. Self-hosting and inspectable source code allow teams to adapt schemas and control storage.

It is a poor fit for teams seeking competitor spend, ROAS, revenue, attribution or comprehensive campaign discovery. For occasional screenshots, a manual workflow may be sufficient. Validate the tool against the same research task performed manually before claiming efficiency gains.

### Product success measures

Measure time to the first useful reviewed result, manual correction effort, capture success, extraction quality, cost per usable result and repeat use in research tasks. Agree pilot targets before evaluation. The business value is useful research with less effort at an acceptable cost; advertising profitability is outside the product's measurement scope.

## Input and output

| Input | Requirement | Purpose |
|---|---|---|
| Public publisher URL | Required for capture | Defines the page to visit, such as https://www.marca.com |
| Screenshot image | Alternative | Supports analysis when browser capture is unavailable |
| Confirmed crop regions | Required before analysis | Selects the actual ad evidence |
| Browser context | Recorded defaults | Explains viewport, language, execution region and consent |
| Research label | Optional | Groups examples into a research project |
| Model credentials and budget | Analysis setup | Enables paid model calls with controlled spending |

| Output | User receives |
|---|---|
| Visit record | URLs, timestamps, browser context, result and capture limitations |
| Evidence | Page screenshot and confirmed placement crops |
| Analysis | Visible copy, readable brand, offer, CTA, format and hook categories |
| Interpretation | Brief explanation and apparent product use case, with uncertainty |
| Collection | Searchable creative cards, filters and sample-based pattern counts |
| Export | CSV with observations, analysis and provenance references |

### Example from input to decision

Input: submit https://www.marca.com. The tool opens the page, proposes visible ad crops and asks the user to confirm them. Imagine a confirmed crop reads “Save 20 percent on running shoes” with a “Shop now” button. This is a fictional illustration, not an advertisement verified on Marca.

Output: the crop and capture context, readable copy, a discount hook category and a running-related product use case. Campaign targeting and performance stay unknown. The researcher can compare discount messaging with other captured examples and prepare a creative hypothesis to test separately.

## What the tool can establish

The tool can record that a creative appeared at a particular URL, at a particular time, under a recorded browser configuration. It can describe visible content and classify creative patterns. It cannot establish an advertiser’s targeting settings, campaign budget, revenue, conversions, profitability or complete campaign inventory from a screenshot.

Repeated sightings indicate observed frequency within our sample. They must not be presented as popularity, market share or proof that an ad is winning. An apparent audience is an interpretation of messaging, not a verified audience purchased by the advertiser.

## Primary user journey

1. Enter a public HTTP or HTTPS URL and select Capture ads.
2. See the job advance through opening the page, handling consent, scrolling, detecting placements, capturing evidence and analysing creatives.
3. Review proposed ad regions in the page screenshot. Confirm, exclude or adjust candidates before paid analysis in the first version.
4. Inspect each confirmed placement with its image, visible text, creative categories, uncertainty and capture context.
5. Filter the collection and compare recurring formats, offers, hooks and calls to action.
6. Export observations and analysis as CSV, with links to evidence where available.

If automation is blocked, show the reason and allow a screenshot upload with manual region selection. Uploaded material must be labelled as user supplied; its URL and capture context remain unverified unless independently recorded.

## First version scope

| Capability | First version |
|---|---|
| URL input | One public page per capture job |
| Browser | Isolated desktop Chromium session with fixed viewport |
| Coverage | Bounded scrolling of the submitted page; no site crawl |
| Ads | Static screenshots of visible placements, including visible iframe content |
| Detection | Heuristics plus user confirmation and manual crop selection |
| Analysis | Visible text extraction and bounded creative classification |
| Evidence | Page screenshot, placement crop, timestamp and browser context |
| Dashboard | Job status, creative cards, detail view and filters |
| Export | CSV for selected results |
| Access | Private single-user app with authentication if hosted |
| Recovery | Clear blocked, partial, empty and failed outcomes |

Excluded from the first version: autonomous recurring collection, video or audio interpretation, clicking ads, following redirects to advertiser landing pages, bypassing login or access restrictions, mobile capture, performance attribution, revenue estimates and multi-user teams. A video’s captured frame may be reviewed as an image but must be labelled as a partial view of video content.

## Capture behaviour

### Browser context

Use an isolated session, record the viewport, browser version, language, timezone and consent outcome. A cloud browser does not automatically represent a visitor in Spain. Record the actual execution region when known; otherwise show Unknown. Do not claim that language or timezone settings change IP geolocation.

Default to a clean session rather than reusing personal browsing cookies. Reject optional tracking where the consent interface supports it. If this prevents ads from loading, report that limitation. Any future alternative consent profile must be explicitly selected and recorded, because different profiles can produce different ads.

### Loading and scrolling

Use bounded waits for page readiness and ad loading; a continuous network stream must not keep a job running indefinitely. Scroll through a bounded number of viewports to trigger lazy loading. Proposed initial limits are five scroll steps, a 60-second capture budget and one page per job; these are implementation defaults to tune during the pilot, not performance guarantees.

Capture candidates when they become visible. For animated placements, the screenshot records one instant. Retain per-placement capture timestamps because ads can rotate during the visit. Avoid clicking the creative or generating intentional advertising interactions.

### Placement detection

Combine signals such as advertisement labels, common ad container identifiers, iframe geometry and visual layout. None is conclusive alone: an iframe can contain non-ad content, and an ad can appear without an obvious label. Distinguish banner/display ads, sponsored content candidates and ordinary editorial content. Sponsored article content should require user confirmation.

Browser screenshots can include visible cross-origin iframe pixels even when parent-page scripts cannot inspect the iframe DOM. Detection and metadata extraction can still be incomplete. Preserve the screenshot rather than claiming to have extracted a creative source URL or click destination that was not accessible.

For each candidate, store the rectangle, detection signals and review decision. If overlay obstruction, blank pixels or failed rendering make the crop unusable, mark it and skip analysis until recaptured or corrected.

### Honest result states

| Outcome | Meaning |
|---|---|
| Complete | Capture and analysis completed for confirmed candidates; not proof of exhaustive coverage |
| Partial | Some placements or stages succeeded and others did not |
| No candidates detected | Detection found none; ads may still have been missed or not loaded |
| Blocked | Consent, login, bot challenge, access policy or another barrier prevented capture |
| Failed | A technical error prevented a usable result |
| Cancelled | The user stopped the job |

Marca is a validation target, not a promised supported integration. Earlier text retrieval was denied by robots.txt; that does not establish whether browser capture will work. Check permitted access and live browser behaviour during implementation. Do not circumvent a denial or challenge.

## Analysis contract

Every result separates observation from interpretation and missing information. Keep the original crop visible so the user can assess the output.

| Field | Type | Rule |
|---|---|---|
| Visible text | Extracted text | Transcribe legible content; mark unclear passages |
| Advertiser name | Text or unknown | Only report a readable brand/name; do not guess identity from style |
| Language | Category or unknown | Based on visible copy |
| CTA text | Text or absent/unknown | Preserve exact readable wording |
| Visible offer | Text or absent/unknown | Include visible qualifiers and pricing units |
| Format | Category | Banner, product image, testimonial style, editorial style, other or unclear |
| Hook category | Category | Discount, problem/solution, aspiration, curiosity, social proof, urgency, other or unclear |
| Apparent audience | Interpretation | Explain the visible evidence; allow insufficient evidence |
| UGC appearance | Category | UGC-like, polished brand creative, mixed or unclear; appearance does not verify authorship |
| Creative explanation | Interpretation | Brief explanation grounded in the crop |
| Uncertainty | Notes | Missing context, small text, occlusion, ambiguous branding or unsupported inference |
| Performance | Unavailable | No inferred ROAS, CTR, conversion rate or winning label |

Do not infer sensitive personal attributes from people depicted. Audience interpretation should concern the product need or broad use case supported by copy, such as people seeking a running app.

### Model responsibilities

Official OpenAI documentation describes Decisions API as supporting image input with predicate, choice and score answers. It is appropriate for fixed categories such as hook type or whether an explicit discount is visible. It is not the endpoint for unrestricted transcription or a generated explanation.

Use the Responses API with structured output for visible text and short explanations. Treat Decisions as an optional classifier to evaluate against a single Responses call. Begin with the simpler path if it gives adequate quality; add a second endpoint only when measurement justifies the extra complexity and cost. Model choice and account availability must be rechecked at implementation time.

The application records endpoint/model, prompt and schema versions, usage and measured latency. Model probabilities are not validated accuracy rates. Use manual review and an Unclear option rather than treating a high probability as proof.

## Dashboard requirements

### Capture screen

URL input, browser context summary, Capture button, recent jobs and screenshot upload fallback. Explain that results represent a sampled visit. Never expose API keys in the browser.

### Review screen

Page screenshot with candidate rectangles, candidate crops and confirm/exclude/adjust controls. Show why each region was selected. A user-confirmed crop remains distinguishable from an automatically detected one.

### Results screen

Creative cards show the image, capture date, publisher URL, visible advertiser name and analysis state. Filters cover publisher, date, advertiser, language, hook category, format and review status. Detail view includes the full crop, extracted copy, observations, interpretations and uncertainty. Aggregate views count analysed captured creatives, with an explicit denominator and no ranking labelled Best performing.

### Job status and failures

Display queued, capturing, awaiting review, analysing and final outcome. Show useful error messages, retry options, counts of confirmed/excluded/failed candidates and measured durations. Retrying analysis should reuse existing evidence; recapture should create a new visit record.

## UI and user experience standards

Good UI and user experience are core requirements. Use readable typography, consistent spacing, clear hierarchy and image-first results. The main workflow must be understandable without knowledge of browser automation or AI endpoints. Primary navigation: New capture, Collection and Settings. Keep advanced options out of the default task flow. The interface must adapt to smaller screens even though initial capture uses a desktop viewport.

| Screen | Primary content | Main action | Experience requirement |
|---|---|---|---|
| Setup | Provider settings and spending limit | Test configuration | Explain capture-only mode; mask credentials |
| New capture | URL field, upload alternative and recent jobs | Capture ads | Inline validation with actionable feedback |
| Progress | Current stage and elapsed time | Review when ready | Background processing, cancellation and no invented progress percentages |
| Review | Page preview, regions and candidate crops | Analyse selected ads | Bulk confirm/exclude, crop adjustment and cost estimate when available |
| Collection | Large thumbnails and concise metadata | Open creative | Search copy and brands; preserve filters on return |
| Detail | Original evidence beside analysis | Correct or export | Easy image zoom, explicit unknowns and reversible edits |
| Settings | Budget, retention and capture defaults | Save settings | Plain descriptions and safe credential testing |

Provide keyboard navigation, visible focus, semantic labels and a non-drag alternative for crop adjustment. Do not communicate status through colour alone. Target WCAG 2.2 AA with keyboard, contrast and screen-reader checks before release; compliance has not yet been assessed.

Show essential observations first, then interpretations, uncertainty and source context. Keep technical diagnostics separately accessible. Preserve selection and filters when navigating. Keep user corrections distinguishable from original model output. Support undo for crop edits and exclusions; confirm destructive deletion.

Empty, loading and error states must explain the outcome and offer a relevant next action. Example: “No ad regions detected. Review the page screenshot or upload your own capture.” A blocked capture offers upload or retry. If cost cannot be estimated, state that before analysis and show the configured spending limit.

### Design validation

Before frontend implementation, prepare wireframes for setup, capture, review, collection and detail, including blocked and empty states, followed by a clickable prototype using synthetic examples. These are future deliverables, not artifacts already created by this document.

Test with three to five representative researchers or marketers: submit a URL, reject an editorial false positive, fix a crop, find an offer, distinguish observation from inference and export results. Record completion, wrong turns, review effort and understanding of sampling limits. Resolve critical usability issues before release. Use feedback to assess whether manual confirmation saves effort or becomes a bottleneck.
 
## Open source requirements

The application must be open source. Publish the frontend, server, browser worker, detection logic, analysis schemas, prompts, tests, installation instructions and deployment configuration. Core capture, review, analysis and export must be available in the source without an undisclosed proprietary service dependency.

Propose Apache License 2.0 for code, subject to the owner's final choice before publication. No license has been applied yet. Captured pages and ad creatives retain their own rights; the code license does not grant reuse rights over them. Public samples must be synthetic or explicitly licensed.

Support documented local installation and self-hosting, including a reproducible container setup. Users bring their own model credentials. Open-source code does not make commercial model APIs or hosting free. Keep provider integration behind an interface; initial OpenAI support must be openly implemented. Local model support is future scope until an adapter is implemented and tested.

Release requirements: README explaining input, output and value; LICENSE; secret-free example configuration; installation and troubleshooting guides; architecture and schemas; contribution guidance; security reporting route; and release notes. Default to no telemetry or central upload of users' evidence. Allow capture-only operation without model credentials.

Before release, test installation from the documented steps and an end-to-end configured run; verify no credentials or captured third-party ad assets enter the public repository. Publishing the repository is a later action, not part of this documentation update.

## Architecture approach

A web frontend submits jobs to an authenticated server. A separate browser worker performs bounded page visits in an isolated environment. The server stores visit records and evidence, queues analysis of confirmed crops, calls OpenAI and serves results to the dashboard.

Suggested implementation: a TypeScript web app, a Playwright browser worker, SQLite for a local pilot or PostgreSQL for hosting, and private file/object storage for screenshots. These are proposed choices, not installed dependencies or confirmed hosting capabilities. Browser automation requires a server or worker that can run Chromium; a static HTML site alone cannot provide reliable arbitrary-site capture.

Keep capture, detection, extraction and classification behind separate interfaces. This allows replacing a detector or model without losing the original evidence. A future browser extension could capture the user's actual browsing context if cloud capture proves inadequate, but adds a separate distribution and permissions project.

## Data records

| Record | Required fields |
|---|---|
| Capture job | ID, requested URL, created time, state, limits, error summary |
| Visit | ID, job ID, final page URL, context, consent outcome, start/end timestamps, capture outcome |
| Placement | ID, visit ID, rectangle, capture timestamp, detection signals, review state, crop reference |
| Creative | ID, image digest, image dimensions, evidence reference |
| Observation | Placement ID, creative ID, source kind, limitations |
| Analysis | Creative ID, result fields, model/endpoint, schema/prompt versions, usage, latency, state |
| User correction | Record ID, field, original value, corrected value, timestamp |

Keep each sighting even when the image is identical. Exact image hashing can avoid repeated analysis; differing screenshots of the same animated or resized creative may not match. Perceptual similarity can suggest duplicates later, with human review. Never silently merge materially different offers.

## Internal service interfaces

Proposed routes: POST /capture-jobs to submit a URL; GET /capture-jobs/{id} for progress; GET /capture-jobs/{id}/placements for candidates; PATCH /placements/{id} for confirmation or crop correction; POST /placements/{id}/analysis for confirmed evidence; GET /creatives for filtered results; GET /exports for CSV; DELETE /capture-jobs/{id} for associated evidence and records subject to shared creative references.

Requests should be idempotent where retries could create duplicate work or charges. Store durable stage transitions and error codes. Analysis failures must not destroy successful captures. Limit retries for transient service errors and allow cancellation between stages.

## Security and retention

Keep credentials server-side and use authenticated access for screenshots and exports. Validate URL scheme and resolve hosts safely: block loopback, private networks, link-local addresses and cloud metadata endpoints, including redirects and DNS changes. The capture worker should have restricted network access and no access to app secrets or internal services.

Treat page text and images as untrusted evidence, not instructions. Analysis must not execute commands or follow requests embedded in an ad. Escape extracted content in the dashboard and protect CSV export against spreadsheet formula injection.

Use resource limits for visits, image size, concurrent jobs and model requests. For the private pilot, propose 30-day screenshot retention with user deletion and configurable limits. Retention and storage location are decisions to confirm before hosting. Avoid recording login sessions or unrelated personal browsing content.

## Cost and operational expectations

Costs include browser-worker runtime, storage and OpenAI usage. The pilot should record actual cost and latency per visit and per analysed creative. Do not publish a numerical price or subsecond promise before observing representative jobs and checking current pricing.

Set a maximum number of candidates per visit and a configurable daily analysis spend ceiling. Check the ceiling before starting a request and show skipped work clearly. The first version runs on demand; no schedule or recurring task is being created by this document.

## Validation and acceptance

Use controlled fixture pages for stable tests and a small set of permitted live publisher pages for feasibility. Manually annotate captured screenshots to assess detection against what was visibly rendered, not against all advertisements the publisher might serve.

| Check | Acceptance condition |
|---|---|
| Evidence | Every analysed result links to a readable crop and capture context |
| Missing ads | Empty and partial states are explicit; no false claim of complete inventory |
| Detection | Pilot reports false positives and missed visible placements against manual annotations |
| Review | User can reject editorial content and correct crop regions |
| Extraction | Pilot compares text, CTA and offer extraction with manual transcription |
| Interpretation | Results distinguish visible facts, inferred patterns and unknown fields |
| Failure recovery | Blocked visit, timeout and model error produce usable states and bounded retries |
| Deduplication | Repeated exact evidence avoids redundant analysis while retaining sightings |
| Security | Private-network URLs and redirects are blocked; browser worker cannot reach app secrets |
| Export | CSV preserves provenance and safely handles untrusted text |
| Cost | Usage and latency are recorded; configured limits stop additional work |
| Marca pilot | At least one usable permitted browser capture or a documented blocker with upload fallback |

For initial quality review, use approximately 30 manually reviewed crops spanning multiple formats. This is a pilot sample, not statistical proof of general accuracy. Agree numerical quality targets after examining the first sample and the user's tolerance for review work.

## Build sequence

1. Capture feasibility: test permitted access to Marca and several comparison pages; document consent, rendering and iframe constraints. Deliver screenshots and a feasibility decision.
2. Capture and review: implement bounded jobs, evidence storage, detection candidates and crop correction. Deliver a working capture workflow before AI integration.
3. Analysis: add structured extraction, optional fixed-category classification, uncertainties and versioned results. Validate against the manually reviewed sample.
4. Dashboard: add filtering, detail views, corrections, deduplication and CSV export. Validate failures and security boundaries.
5. Private pilot: measure coverage, latency, review effort and cost. Decide whether to improve capture, add a browser extension or introduce scheduled monitoring.

Do not estimate a delivery date until browser feasibility and deployment constraints are known. A later daily monitoring feature needs a persistent worker, scheduler, retained context profiles and an agreed sampling plan.

## Decisions for the next stage

The scope is settled: an open-source tool to analyse ads displayed on a submitted publisher page, starting with Marca, with a polished and accessible UI. The first deployment is a private single-user pilot; open-source distribution does not require publishing captured evidence. Suggested defaults are an English interface, desktop capture, on-demand runs and screenshot upload fallback. Before implementation, choose local versus hosted execution, confirm OpenAI API access, set a spend limit, validate capture feasibility and review wireframes. Confirm the code license before public release. No Spiral account is required for this scope.

## Sources and evidence boundaries

- OpenAI Decisions guide: https://developers.openai.com/api/docs/guides/decisions — retrieved during this conversation on 8 October 2026. Confirms image inputs and bounded decision output types; directs extraction and explanations to Responses with structured outputs. Recheck at implementation time.
- Example publisher: https://www.marca.com — supplied by Joan. Text retrieval was denied by robots.txt during this conversation. No claim is made about current page ads or browser capture success.
- All architecture, limits, retention settings and workflow details above are proposed product requirements, not claims that a live service has already been tested or deployed.
