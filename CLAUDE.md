# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**oiKwee** is a personal expense management platform built as a monorepo. It provides a dashboard for tracking expenses, recurring bills, and spending patterns with features like budget limits, payment tracking, and monthly summaries.

- **Frontend**: Next.js 16 with React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: Hono (lightweight HTTP framework) with Node.js
- **Database**: MongoDB
- **Auth**: better-auth with OAuth providers (Google, GitHub, Discord)
- **Monorepo**: pnpm workspaces + Turbo

## Monorepo Structure

```
├── apps/
│   ├── web/              # Next.js frontend application
│   └── api/              # Hono backend API server
├── packages/
│   ├── domains/          # Shared business logic (expense schemas/types via Zod)
│   ├── i18n/             # Internationalization (pt-BR default, en-US fallback)
│   ├── ui/               # Shared React components (shadcn/ui based)
│   ├── eslint-config/    # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
```

## Commands

```bash
pnpm install              # Install all dependencies

pnpm dev                  # Start all apps concurrently
pnpm build                # Build all apps and packages
pnpm check                # ⚠️ ALWAYS run after any change — tsc + eslint, zero warnings allowed
pnpm lint                 # Lint all code (--max-warnings=0)
pnpm check-types          # Type-check all TypeScript (tsc --noEmit)
pnpm format               # Format with Prettier

# Run a single app
pnpm exec turbo dev --filter=web   # Frontend at http://localhost:3000
pnpm exec turbo dev --filter=api   # Backend at http://localhost:8787
```

## Mandatory Check After Every Change

**ALWAYS run `pnpm check` after making any code change before considering the task done.**

This runs TypeScript type checking (`tsc --noEmit`) and ESLint (`--max-warnings=0`) across the entire monorepo in parallel via Turbo. The check must pass with zero errors and zero warnings. Fix all issues before reporting the task as complete.

## Architecture

### Authentication Flow
- **Backend** (`apps/api/src/auth.ts`): better-auth with MongoDB adapter; supports email/password and OAuth; custom `signUpProvider` field on users; middleware validates session on every request.
- **Frontend** (`apps/web/src/auth/`): `AuthService` handles login/signup/logout; token stored in localStorage; axios interceptors inject Bearer token; automatic redirect to signin on 401.

### API Architecture
- Framework: Hono with CORS (restricted to `WEB_APP_ORIGIN`)
- Routes mounted at `/api/v1/`:
  - `/api/v1/auth/*` — authentication (better-auth handler)
  - `/api/v1/expenses` — CRUD for expenses
- `validateUser()` middleware scopes all queries to the authenticated user's `userId`
- `toResponse()` utility converts MongoDB `_id` to string for API responses

### Expenses Domain
- **Shared schemas** (`packages/domains/src/expenses/index.ts`): `Expense`, `CreateExpenseSchema`, `UpdateExpenseSchema` — used by both backend validation and frontend forms to keep them in sync.
- **Backend routes** (`apps/api/src/routes/expenses.ts`): GET list, POST create, GET by id, PATCH update, DELETE; all sorted by date DESC.
- **Frontend services** (`apps/web/src/services/api.ts`): axios instance with token injection and centralized error handling.

### Frontend Structure
- **App Router**: `app/dashboard/` for main views, `app/auth/` for auth flows.
- **Data fetching**: React Query for server state; `useDataTable` hook handles sorting, filtering, pagination for the expenses table; query invalidation on mutations.
- **Forms**: react-hook-form + Zod resolvers, aligned with domain schemas.
- **i18n**: `useTranslation()` hook; locale stored in `NEXT_LOCALE` cookie.

### Workspace Dependencies
Packages reference each other via `workspace:*`. `web` imports `@oikwee/domains`, `@repo/i18n`, `@repo/ui`; `api` imports `@oikwee/domains`. Local changes propagate without publishing.

## Environment Variables

**apps/web/.env**:
```
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_WEB_URL=http://localhost:3000
```

**apps/api/.env**:
```
MONGODB_URI=mongodb+srv://...
BETTER_AUTH_SECRET=<random-secret>
WEB_APP_ORIGIN=http://localhost:3000
API_URL=http://localhost:8787
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
```

## Key Patterns

### Adding a New API Endpoint
1. Define/update schema in `packages/domains` with Zod
2. Add route in `apps/api/src/routes/` using `zValidator()` and `validateUser()`
3. Add frontend service call in `apps/web/src/services/api.ts`
4. Wire up React Query hooks and form validation using the shared schema

### Expense Types
- Type 2 requires an installments count
- Recurrence uses `recurrenceGroupId` to link related expenses
- All expenses store `userId` for user isolation

### Notes
- React Compiler is enabled in Next.js config for automatic memoization
- React Scan is included in root layout for performance debugging (dev)
- Portuguese (pt-BR) is the default locale
