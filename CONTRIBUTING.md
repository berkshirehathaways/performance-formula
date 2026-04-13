# Contributing Guide

## Quick Start
1. Fork this repository.
2. Create a feature branch: `git checkout -b feat/your-change`.
3. Make focused changes with clear commit messages.
4. Validate JS syntax: `node --check js/*.js`.
5. Open a Pull Request using the PR template.

## Ground Rules
- Keep strict Step 3 diagnostic flow and planning lock behavior intact unless intentionally changed.
- Prefer small, reviewable diffs.
- Do not introduce new dependencies unless justified.
- Escape user-controlled text before rendering into HTML.

## Security & Privacy
- Never commit API keys, tokens, passwords, or private keys.
- Never commit personal datasets, internal docs, or company-only metadata.
- Follow `SECURITY.md` checks before opening PR.

## PR Quality Bar
- Explain why the change is needed.
- Describe behavior impact and verification steps.
- Call out risks and follow-up tasks clearly.
