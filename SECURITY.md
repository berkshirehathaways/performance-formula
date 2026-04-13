# Security Policy

## Scope
This repository is intended to be public and fork-friendly.
Please do not commit secrets, credentials, personal data, or internal-only documents.

## Before You Open a PR
Run these checks locally:

1. Search for obvious secret patterns:
   `rg -n --hidden --no-ignore -S "(api[_-]?key|secret|token|password|private[_-]?key|BEGIN (RSA|EC|OPENSSH|PGP)|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36,}|sk-[A-Za-z0-9]{20,}|DATABASE_URL|mongodb(\\+srv)?:\\/\\/|postgres(ql)?:\\/\\/)" .`
2. Search for possible personal data:
   `rg -n --hidden --no-ignore -S "([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}|[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}|passport|ssn|resident|주민등록|계좌번호)" .`
3. Ensure no `.env*` or key files are tracked.

## Responsible Disclosure
If you find a vulnerability, do not open a public issue with exploit details.
Open a private security report through GitHub Security Advisories if available.
If unavailable, open an issue with minimal details and request private contact.

## Data & Privacy Notes
- This app stores user input in browser `localStorage` (`compass_v5`).
- Data is not synced server-side by default.
- If you fork and add backend/auth, update this file and README privacy notes.
