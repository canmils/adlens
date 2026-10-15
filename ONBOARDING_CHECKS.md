# Onboarding verification

## 15 October 2026

- Fresh `npm ci` completed on Linux, Node 24.
- Eight existing offline tests passed: security, provider contract, HTTP auth/missing-key,
  and frontend notes/filtering with jsdom and IndexedDB fixtures.
- Source syntax checked with `npm run check`.
- Chromium installation failed locally with a truncated/invalid download archive.
  No local real-browser or live Marca capture is therefore claimed as successful.

## Added validation paths

- `npm run test:browser`: actual Chromium screenshot generation, upload, coordinate preview/crop,
  manual notes, PNG/CSV download, reload persistence and confirmed deletion. No OpenAI key or
  real advertisements are used. Server data is isolated in a temporary directory.
- `npm run example`: generates an authored PNG from the fictional HTML fixture.
- `node scripts/check-live.mjs https://www.marca.com`: distinct live observation, records success,
  blocking or failure. A failed capture is never described as evidence of detected ads.
- Docker image now installs Chromium in `/ms-playwright`, accessible to non-root `node`.
  CI launches Chromium and takes a synthetic screenshot as that application user.
- CI fast tests run on Ubuntu and Windows; the browser job runs on Ubuntu.

See the [workflow history](https://github.com/canmils/adlens/actions/workflows/checks.yml)
for the run matching your commit. A configured test is not proof that it passed. Live observation
is uploaded as `live-capture-observation`; that step allows blocked sites explicitly, so inspect
its status rather than inferring live compatibility from a green workflow.

## Remaining limits

Paid OpenAI accuracy, general website detection quality, native macOS execution, accessibility
compliance and remote deployment isolation are not established. CSV is metadata, not a complete
workspace backup. Browser IndexedDB remains separate from server data; no bulk restore tool exists.
Passing synthetic tests does not establish demand, time savings or commercial readiness.
