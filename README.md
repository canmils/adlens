# AdLens

Open-source advertising research from the ads visible on publisher pages.

**Input:** a public website URL or an uploaded screenshot. **Output:** reviewed ad crops, visible copy, offers, CTAs, creative categories, evidence and CSV exports. **Value:** less manual screenshot organisation and a traceable reference collection for creative briefs.

Built for creative strategists, agency researchers and marketing teams. It describes a sampled visit; it cannot establish competitor spend, actual targeting, conversions, revenue or winning campaigns. Accepts general public URLs, but capture is best effort and some sites block access or do not render ads.

## Run locally

Requires Node.js 22 or newer. On Windows, use PowerShell; on macOS/Linux, use a terminal.

```sh
npm ci
npx playwright install chromium
cp .env.example .env
npm start
```

Windows configuration copy: `Copy-Item .env.example .env`. Open http://127.0.0.1:3000. Capture and screenshot research work without an OpenAI key. For AI analysis, edit `.env` and set `OPENAI_API_KEY`; restart the app. Keep this file private. The model defaults to `gpt-4.1-mini` and is configurable through `OPENAI_MODEL`; verify availability on your account.

## Workflow

1. Enter a publisher URL, such as https://www.marca.com, and capture a visit.
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
