# Contributing

Run `npm ci`, `npm test` and `npm run check` before submitting a change. Explain the user-facing problem, final behaviour and verification. Keep observations separate from interpretations. Do not add unsupported performance claims.

Detection changes need controlled synthetic fixtures and evidence of false positives and misses. Never commit credentials, captured real-world advertising assets or personal data. Browser capture should not click ads or bypass access restrictions. Accessibility changes should preserve keyboard use and visible focus.

The initial architecture is deliberately small: browser-local collection, one authenticated backend user and one capture at a time. Multi-user hosting, scheduled monitoring, local-model adapters and hardened browser isolation need separate designs.
