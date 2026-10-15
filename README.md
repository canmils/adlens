# AdLens

Open-source advertising research from the ads visible on publisher pages.

**Input:** a public website URL or an uploaded screenshot. **Output:** reviewed ad crops, visible copy, offers, CTAs, creative categories, evidence and CSV exports. **Value:** less manual screenshot organisation and a traceable reference collection for creative briefs.

Built for creative strategists, agency researchers and marketing teams. It describes a sampled visit; it cannot establish competitor spend, actual targeting, conversions, revenue or winning campaigns. Accepts general public URLs, but capture is best effort and some sites block access or do not render ads.

## Install and start locally

Requires Git, Node.js **22 or newer**, npm and a modern browser with site storage enabled.
Run commands from the repository root. Model keys are not needed for capture or manual notes.

Windows PowerShell:

```powershell
git clone https://github.com/canmils/adlens.git
cd adlens
npm ci
npx playwright install chromium
Copy-Item .env.example .env
npm start
```

macOS/Linux:

```sh
git clone https://github.com/canmils/adlens.git
cd adlens
npm ci
npx playwright install chromium
cp .env.example .env
npm start
```

Linux browser dependency errors: run `npx playwright install --with-deps chromium` where you can
install system packages. A failed/truncated browser download is an installation failure, not a
successful capture setup. Screenshot upload/manual research still works without backend Chromium.

Open **http://127.0.0.1:3000**. Keep the terminal open; Ctrl+C stops the backend.
`npm start` loads `.env` automatically. Leave `OPENAI_API_KEY` blank for free use.
The backend health URL is http://127.0.0.1:3000/api/health; without a key expect
`analysisAvailable: false`. If APP_TOKEN is configured, that endpoint requires the token too.

## First use: a repeatable free example

Run `npm run example` to generate a fictional PNG, then follow the
[worked example](examples/README.md): upload → preview crop → save → add manual notes → download image
and CSV → reload and verify saved notes. The example lists exact coordinates and expected fields.
It is authored test material, not a captured real advertisement.

For an existing PNG/JPEG/WebP screenshot, upload it directly; generating the example is optional.
PNG/JPEG/WebP uploads must be under 8 MB and at most 40 million pixels.

## Optional paid AI

Set `OPENAI_API_KEY` in the backend `.env` and restart. A ChatGPT subscription does not include
API credits. `OPENAI_MODEL` defaults to `gpt-4.1-mini`; confirm access on your account.
Open a saved creative and click **Analyse creative** to send that crop to OpenAI. Saving notes,
opening a creative or capturing a site does not automatically call AI.

The backend token in Settings is **APP_TOKEN, never your OpenAI key**. AI fields are drafts;
review visible text against the image and distinguish observations from interpretations.
Re-analysis can replace fields after confirmation and preserve prior fields in local history.
There is no provider-independent proof of targeting, spend or campaign success.

## Workflow

1. Enter a publisher URL, such as https://www.marca.com, and capture a visit. This is a live compatibility test, not a guaranteed source of ads.
2. Review candidate placements. Iframes may contain editorial content, so confirmation matters.
3. Confirm candidates or crop an uploaded/page screenshot by dragging across the image or using pixel coordinates and preview.
4. Open a saved creative and run AI analysis or write manual notes.
5. Search the collection, filter categories and export selected metadata as CSV.

The interface keeps images and notes in this browser's IndexedDB. The backend keeps captures and response cache in `data/`. Clearing site data removes the local collection. CSV is not an image backup; download important crops individually. There is no shared user database or telemetry.

## Hosted interface and backend

The published static interface supports screenshot review and local notes immediately. Automatic browser capture and paid AI require this Node backend. Static hosting and GitHub Pages cannot run Chromium.

For a remotely connected backend, serve it over HTTPS, set a strong `APP_TOKEN` (minimum 24 characters when binding beyond loopback), and set `ALLOWED_ORIGIN` to the exact frontend origin. Enter backend URL and access token in Settings. Token is session memory; the OpenAI key stays server-side. Prefer running the frontend and backend together on localhost for initial use.

This is a single-user beta, not a hardened multi-tenant capture service. Deploy browser workers in an isolated container/network with outbound rules denying private, metadata and internal destinations. URL and request DNS checks are defence in depth, not a complete DNS-rebinding defence. Chromium receives a filtered environment without model credentials, but process isolation and a restrictive outbound network are still required for remote deployment. No CAPTCHA/login bypass is implemented.

## Docker

The image installs Chromium in a shared path accessible to its non-root application user.
This is important: installing into root's browser cache would leave capture unavailable at runtime.


```sh
docker build -t adlens .
docker run --rm -p 127.0.0.1:3000:3000 --env-file .env -e HOST=0.0.0.0 -e APP_TOKEN=replace-with-a-long-random-token -v adlens-data:/app/data adlens
```

Enter that access token in Settings. Model key is optional. Mounting the data volume retains server captures; the frontend collection still lives in the browser. Docker alone is not an outbound firewall. Add network policy before exposing remote capture.

## Costs and limits

Open-source code is free to use under its license; model calls and hosting may cost money. `MAX_ANALYSES_PER_DAY` caps attempted new analyses (including failed calls), not currency. Exact duplicate images with the same model/schema reuse cached analysis. Configure provider-side spend limits. No subsecond guarantee is made.

Capture is one desktop visit, five scroll steps, at most 20 candidates, with a 60-second job budget. Candidate detection is heuristic. The preview is the first viewport; candidates may come from later scroll positions. Consent rejection is attempted only for supported button labels, with outcome recorded. Geography remains unknown unless deployment context is independently known.

## Verification

```sh
npm test
npm run check
```

Tests cover URL/network safeguards, CSV formula handling, provider request structure, refusal handling, server authentication, cross-origin rejection and missing-key behaviour. A mocked provider test does not establish real model quality. See `VALIDATION.md` for current verification limits.

## Project layout

- `dist/`: responsive HTML, CSS and JavaScript interface.
- `backend/`: Node server, Playwright capture, URL checks and OpenAI Responses adapter.
- `test/`: meaningful security and integration checks.
- `SPECIFICATION.md`: product rationale and longer-term requirements. Some targets in that document are future scope; this README describes implemented beta behaviour.

## Contribution and license

Apache License 2.0. Captured third-party advertisements are not relicensed by the code license. Use synthetic or explicitly licensed fixtures in contributions. See `CONTRIBUTING.md` and `SECURITY.md`.

## Storage, backup and update

| Location | What it retains | Recovery limits |
| --- | --- | --- |
| Browser IndexedDB, per origin/profile | Uploads, visits, crops, notes and local AI history | Clearing site data loses it; server backup alone cannot restore the collection |
| Backend `data/` | Captured visits/screenshots, AI cache and usage counters | Optional `ADLENS_DATA_DIR` selects an alternate directory |
| CSV download | Filtered collection metadata and current field values | Not an image or complete workspace backup |
| Download evidence | One crop as PNG | Notes/context must be retained separately |

Before clearing browser data or changing machines, export CSV and download important crop images.
There is **no complete workspace export/import or automatic restore tool**. For preserved notes,
keep using the same browser profile and origin: `localhost` and `127.0.0.1` are different stores.
To move evidence, upload saved PNGs and re-enter notes from CSV; bulk CSV import is not implemented.

Stop the backend before copying its entire data directory. Keep `.env` private. To update, inspect
`git status`, preserve code changes on your branch, run `git pull --ff-only`, then `npm ci` and
`npx playwright install chromium`, and restart. Docker users rebuild the image and retain their
named `adlens-data` volume; never remove that volume as an update step.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Node/npm/Git not found | Install prerequisite, reopen terminal and check version |
| Chromium executable missing | Repeat `npx playwright install chromium`; install Linux system dependencies if required |
| Source blocks/challenges capture | Upload your permitted screenshot; no CAPTCHA/login bypass is provided |
| No ad candidates | Inspect preview; manually crop only actual ads. Zero candidates does not mean zero advertising |
| Backend disconnected | Check server terminal, URL, token, origin and HTTPS settings |
| AI disabled/error | Check backend `.env`, restart, model access, billing and connectivity |
| Collection appears empty | Check exact origin and browser profile; CSV/server backup does not restore IndexedDB |
| Port 3000 occupied | Stop the earlier server or set another PORT in `.env`; changing origin gives a separate browser collection |

## Verification and feedback

`npm test` and `npm run check` are fast offline checks. After installing Chromium,
`npm run test:browser` exercises the actual browser workflow with fictional evidence.
For a separate live capture observation:

```sh
node scripts/check-live.mjs https://www.marca.com
```

This does not call OpenAI. It writes `test-output/live-capture.json` with status, candidate count
and failure information, without captured image bytes. Failed/blocked capture returns a failure
exit status. CI explicitly uses `--allow-blocked` to retain the observation without making source
availability a release gate; **a green workflow is not proof that Marca capture succeeded**.
Read that observation and [VALIDATION.md](VALIDATION.md) / [ONBOARDING_CHECKS.md](ONBOARDING_CHECKS.md).

Report [bugs or suggestions](https://github.com/canmils/adlens/issues) with OS/Node version,
commit (`git rev-parse HEAD`), exact steps, a synthetic/permitted example and expected/actual behavior.
Never attach keys, personal information or unlicensed real advertisements. Useful feedback includes
missed ads, false positives, lost notes and corrections to AI output. See [CONTRIBUTING.md](CONTRIBUTING.md).
