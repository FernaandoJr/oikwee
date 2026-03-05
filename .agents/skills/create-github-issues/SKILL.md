---
name: create-github-issues
description: Creates well-formed GitHub issues with clear titles, descriptions, and labels. Use when the user asks to create an issue, post an issue, open a GitHub issue, file an issue, or report something as an issue.
---

# Creating GitHub Issues

## When to Use

Apply this skill when the user asks to:
- Create an issue (about something specific or from a plan/audit)
- Post or open a GitHub issue
- File or report something as an issue
- Turn findings (e.g. from a codebase audit) into issues

## Workflow

1. **Resolve scope** – One issue per actionable item. If the user describes multiple things, create one issue per item.
2. **Draft title and body** – Use the format below.
3. **Check labels** – Run `gh label list` in the repo; use only existing labels (or skip labels). Do not assume custom labels exist.
4. **Create the issue** – From repo root, use `gh issue create`. Prefer `--body-file` for bodies with backticks, quotes, or spaces to avoid shell escaping (e.g. PowerShell).

## Title Format

Use a short prefix and a clear, specific summary:

- `[Bug]` – Incorrect behavior, fix required
- `[Feature]` – New capability or user-facing change
- `[Fix]` – Correction that isn’t a new feature
- `[Refactor]` – Code structure/quality, no behavior change
- `[Docs]` – Documentation only
- `[Config]` – Configuration, env, or deployment
- `[Chore]` – Tooling, scripts, monorepo tasks
- `[Security]` – Security-related change or risk
- `[Testing]` – Tests, coverage, or test infra

**Examples:** `[Bug] signOut sends headers as request body`, `[Docs] Replace root README with monorepo content`

## Body Template

Keep the body scannable. Include only what’s needed:

```markdown
**File:** `path/to/file.ts` (optional line ref)

**Problem:** One to three sentences describing the issue or gap.

**Acceptance:** What “done” looks like (criteria, behavior, or fix in one sentence).
```

- Omit **File** if the issue is repo-wide (e.g. “add tests”).
- For bugs, **Acceptance** can be the minimal fix.
- For refactors/features, **Acceptance** should be testable (e.g. “Single shared axios client with 401 handling”).

## Creating the Issue

**From repo root** (e.g. `c:\GitHub\oikwee`):

```bash
gh issue create --title "Title here" --body "Body text"
```

With labels (only if they exist from `gh label list`):

```bash
gh issue create --title "Title" --body "Body" --label "bug" --label "documentation"
```

**When the body has special characters** (backticks, quotes, newlines, `user.id`-style text):

1. Write the body to a temp file, e.g. `.gh-issue-body.md`.
2. Run: `gh issue create --title "Title" --body-file .gh-issue-body.md --label "bug"`
3. Delete the temp file after creation.

## Label Mapping

Use only labels that exist. Common defaults and mapping:

| Intent    | Prefer if exists |
|----------|-------------------|
| Bug      | `bug`             |
| Docs     | `documentation`   |
| New feature / improvement | `enhancement` |
| Good for newcomers | `good first issue` |
| Needs help | `help wanted`   |

If a suggested label doesn’t exist, omit it; do not pass unknown labels to `gh issue create`.

## Checklist Before Submitting

- [ ] Title starts with a type prefix and is specific
- [ ] Body has **Problem** (and **File** when relevant) and **Acceptance**
- [ ] Only existing labels are used
- [ ] Command run from repo root; `gh auth status` is valid if needed
- [ ] Temp body file deleted after use

## Example (Single Issue)

**User:** “Create an issue for fixing the signOut sending headers as body.”

**Agent:**
1. Title: `[Bug] signOut sends headers as request body`
2. Body: Problem (axios post signature, body vs config) + Acceptance (use correct post args or no body).
3. `gh label list` → use `bug` only.
4. `gh issue create --title "[Bug] signOut sends headers as request body" --body-file .gh-issue-body.md --label "bug"`
5. Delete `.gh-issue-body.md`.

## Batch Issues

When creating many issues (e.g. from an audit):

- Create a small body file per issue (or one reused file overwritten each time) to avoid shell escaping.
- Use a consistent title/body format across issues.
- After creation, give the user a short summary table: issue number, title, and link.
