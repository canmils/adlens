# Onboarding verification

## 15 October 2026

- Fresh `npm ci` completed on Linux, Node 24.
- Eight existing offline tests passed: security, provider contract, HTTP auth/missing-key,
  and frontend notes/filtering with jsdom and IndexedDB fixtures.
- Source syntax checked with `npm run check`.
- Chromium installation failed locally with a truncated/invalid download archive.
  No local real-browser or live Marca capture is therefore claimed as successful.

## Confirmed GitHub results

[Implementation run 38710017238](https://github.com/canmils/adlens/actions/runs/38710017238)
for commit `b3028b2374a7219a863296e9587ea044f9e5a2bd` passed:

- Eight offline tests on both Ubuntu and Windows.
- Real Chromium onboarding: generated fictional PNG, upload, crop preview/save, manual notes,
  evidence PNG and CSV downloads, reload persistence and confirmed deletion.
- Docker Chromium launch and synthetic screenshot as the non-root application user.
- Live Marca observation at 2026-10-15 09:03 UTC: status `review`, page title returned and
  screenshot available, **zero candidates detected**. This validates page capture on that visit,
  not successful ad detection or absence of advertising. Live AI remains untested.

The browser test initially exposed a real evidence-download failure: fetching a data URL
was blocked by the existing Content Security Policy. Download now constructs a Blob directly
from the local image bytes, without loosening that policy; the browser regression passed.

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
