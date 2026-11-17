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

## Superpowers coding workflow

For software implementation, debugging, refactoring and code review, load
`using-superpowers` and the relevant installed Superpowers skills before acting.
See [setup and verification](docs/SUPERPOWERS.md). If the skills are unavailable,
report the missing installation; do not claim that reading this file loads them.

- Clarify the goal and acceptance criteria with `brainstorming`; reuse an already
  approved brief and existing authorization instead of restarting approval.
- Use `writing-plans` for multi-step work, with small tasks and explicit checks.
- Use `using-git-worktrees` when isolation is needed. Preserve existing clean
  isolated checkouts and project-specific worktree restrictions.
- Follow `executing-plans`, or `subagent-driven-development` when delegation is
  authorized and available. Parallel work requires independent scopes and file ownership.
- For behavior changes use `test-driven-development`; for failures use
  `systematic-debugging`. Documentation/configuration-only changes need relevant
  validation, not artificial behavior tests.
- Use `requesting-code-review` / `receiving-code-review` and
  `verification-before-completion`; report commands actually run and remaining gaps.
- Finish with `finishing-a-development-branch`. Opening a PR does not authorize
  merging, deployment, deletion, paid services or changing permissions.

These are development-tool instructions, not a runtime dependency or a replacement
for domain agents. Existing safety rules, domain gates, ownership, permissions and
explicit user instructions remain in force. Do not apply coding rituals to ordinary
research, coaching or writing. Keep the existing simplicity guidelines.
