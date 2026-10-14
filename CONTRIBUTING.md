# Contributing

Read README.md first for the supported workflow, inputs, outputs, limitations and verification commands. Reproducible bugs, documentation corrections, accessibility fixes and fictional examples are welcome.

## Report or suggest

Use https://github.com/canmils/adlens/issues. Include the user problem, OS/runtime versions, commit (`git rev-parse HEAD`), exact command, sanitized error, expected and actual result, and the smallest public/fictional input. Feature requests should explain who benefits and how to verify the result. Never include keys, private company data or personal details.

## Submit a change

1. Fork this repository and clone your fork.
2. Add upstream: `git remote add upstream https://github.com/canmils/adlens.git`.
3. Create a branch: `git switch -c improve-onboarding`.
4. Follow README installation and first-use instructions; make one focused change and update examples/docs.
5. Run the README verification commands. Record unavailable checks honestly; mocked calls do not establish live provider quality.
6. Review `git diff` and `git status` for unintended files/secrets. Commit intended files, push your branch, and open a pull request to the default branch.
7. Explain the problem, resulting behavior, validation and remaining limitations.

Keep private inputs and outputs outside tracked examples. Preserve upstream attribution and licenses. A repository without a license does not grant a general reuse license. Use fictional or explicitly licensed fixtures. Maintainers review before merging.

## Project-specific guidance

# Contributing

Run `npm ci`, `npm test` and `npm run check` before submitting a change. Explain the user-facing problem, final behaviour and verification. Keep observations separate from interpretations. Do not add unsupported performance claims.

Detection changes need controlled synthetic fixtures and evidence of false positives and misses. Never commit credentials, captured real-world advertising assets or personal data. Browser capture should not click ads or bypass access restrictions. Accessibility changes should preserve keyboard use and visible focus.

The initial architecture is deliberately small: browser-local collection, one authenticated backend user and one capture at a time. Multi-user hosting, scheduled monitoring, local-model adapters and hardened browser isolation need separate designs.
