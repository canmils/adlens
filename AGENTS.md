# AdLens

Open-source advertising research from the ads visible on publisher pages. Input:
a public URL or a screenshot. Output: reviewed ad crops, copy, offers, CTAs,
categories, evidence and CSV exports. It describes one sampled visit; it never
claims spend, targeting, conversions or revenue.

## Commands

- Run: `npm start` (Node, reads `.env` if present)
- Tests: `npm test`, browser tests `npm run test:browser`
- Syntax check: `npm run check`
- Example: `npm run example`

## Layout

- `backend/`: `server.mjs`, `capture.mjs`, `analysis.mjs`, `security.mjs`.
- `dist/`: front end. `test/`: node tests. `examples/`: fictional example.

## Rules

- Keep claims inside what one sampled visit can show (see `SPECIFICATION.md` and `VALIDATION.md`).
- Never commit keys or `.env` files.

## Coding discipline (Karpathy guidelines)

Before writing, reviewing or refactoring code, load the `karpathy-guidelines` skill
(source: github.com/multica-ai/andrej-karpathy-skills, MIT). The short version:

1. **Read first.** Read the code, docs and tests you will touch before you change anything. Investigate; do not guess.
2. **Think before coding.** State your assumptions. If there is more than one reading of the task, name them. If something is unclear, stop and ask.
3. **Simplicity first.** Write the minimum code for the request. No speculative features, no early abstractions, no new dependency without a stated reason.
4. **Surgical changes.** Touch only what the task needs and match the existing style. Mention unrelated problems; do not fix them silently.
5. **Define success before building.** Turn the task into a check, for example a test that fails first and then passes.
6. **Test the behaviour and fix the root cause.** A green build is not enough. Do not patch symptoms.
7. **Explain what changed and why.** Files touched, the reason, and the checks you actually ran.
