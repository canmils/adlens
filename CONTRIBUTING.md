# Contributing to AdLens

Read README.md for supported scope, installation, privacy, costs and storage limitations.

1. Fork and clone your fork. Add upstream:
   `git remote add upstream https://github.com/canmils/adlens.git`.
2. Create a focused branch, for example `git switch -c improve-capture-review`.
3. Run `npm ci`, then `npm test` and `npm run check`.
4. For UI/cropping/persistence changes, install Chromium and run `npm run test:browser`.
   Docker changes need an image build and browser launch as the application user.
5. Include fictional fixtures and a reproducible example. Record unavailable checks honestly;
   mocked providers do not establish real AI quality, and blocked capture is not success.
6. Review `git diff` / `git status` for secrets or captured assets. Commit intended files,
   push your branch and open a PR to `main` describing the problem, behavior and verification.

Report bugs at https://github.com/canmils/adlens/issues with OS/Node version, commit, steps,
expected/actual result and sanitized error. Feature requests should explain who benefits and how
we would verify the result. Large changes should first establish a concrete scope in an issue.

Preserve Apache-2.0 attribution and dependency notices. Use synthetic or explicitly licensed
fixtures, never private client data or third-party ad captures without permission.
Keep observations separate from interpretations. Do not add unsupported performance claims,
click advertisements, bypass access restrictions or weaken private-network safeguards for tests.

Detection changes need evidence of misses and false positives. Accessibility changes should
preserve keyboard navigation and visible focus. Multi-user hosting, scheduled monitoring,
full workspace migration and hardened remote browser isolation require separate designs.
