# Beta validation scope

[ONBOARDING_CHECKS.md](ONBOARDING_CHECKS.md) records performed checks and environment limits.
[GitHub Actions](https://github.com/canmils/adlens/actions/workflows/checks.yml) provides per-commit runs.

| Check | What it establishes | What it does not establish |
| --- | --- | --- |
| `npm test` | URL/network rejection, auth/origin checks, CSV handling, provider contracts and jsdom notes/filtering | Actual Chromium rendering, live AI quality |
| `npm run test:browser` | Fictional upload → crop → notes → downloads → reload → delete in Chromium | Detection accuracy on arbitrary sites |
| Docker smoke | Browser installed and executable by the runtime user; synthetic screenshot works | Safe remote multi-user hosting |
| Live capture observation | Whether one specified URL returned a reviewable screenshot/candidates at that time | Universal compatibility, ad identity, spend or performance |

CI records a blocked live source as an observation without failing the whole build. Read its
JSON artifact and job log: `status: review` with a screenshot is a successful capture;
`failed` or `cancelled` is not. Zero candidates does not mean a website carries no ads.
A candidate may be editorial or another non-ad iframe and needs human confirmation.

Known limits: no scheduled monitoring, retention cleanup, complete workspace export/import,
shared account database or verified targeting/spend/conversions. The daily request count is not
a currency budget. Exact-image cache is not perceptual deduplication. SPECIFICATION.md contains
future targets; README.md describes the supported beta. Provider tests use synthetic responses.
