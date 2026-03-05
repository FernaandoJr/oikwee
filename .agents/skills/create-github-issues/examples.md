# Examples

## From a single user request

**User:** "Create an issue for adding error handling to getSession"

- **Title:** `[Fix] Add error handling for AuthService.getSession()`
- **Body:** File + Problem (no try/catch, callers may not handle) + Acceptance (try/catch and typed result or document that callers must catch)
- **Labels:** `enhancement` (if exists)

## From an audit finding

**Finding:** "Env validated on first access; first request can fail with raw Missing required env."

- **Title:** `[Config] Validate required env at API startup`
- **Body:** File: `apps/api/src/constants/envs.ts`. Problem: lazy validation. Acceptance: validate all required keys in server.ts before serve(), exit with clear message if missing.
- **Labels:** `enhancement` or none

## Title-only request

**User:** "Open an issue: Make API port configurable"

- **Title:** `[Config] Make API port configurable`
- **Body:** File: `apps/api/src/server.ts`. Problem: port 8787 hardcoded. Acceptance: use process.env.PORT ?? 8787 so deployment can override.
- **Labels:** optional
