# Backend Guidelines

## Stack

- Next.js App Router route handlers
- TypeScript
- Prisma
- PostgreSQL
- Zod schemas
- Feature services/repositories
- Core server utilities under `src/core/server`

## API Route Pattern

Use this flow:

```txt
route.ts
  -> validate params/query/body
  -> check auth/permission if needed
  -> call service
  -> service calls repository
  -> repository uses Prisma
  -> return API response
```

## Route Handler Rules

- Keep route handlers thin.
- Validate all input.
- Use existing response utilities from `src/core/server`.
- Do not expose stack traces/raw Prisma errors.
- Do not duplicate business logic across routes.

## Service Rules

Services live in `src/features/{feature}/services`.

Use services for:

- business logic
- publish/archive behavior
- read/replied behavior
- orchestration

## Repository Rules

Repositories live in `src/features/{feature}/repositories`.

Use repositories for:

- Prisma queries
- filtering/search/sorting
- pagination
- relation include/select

## Validation Rules

Schemas live in `src/features/{feature}/schemas`.

Validate:

- request body
- query params
- route params
- public form input

## Prisma Rules

- Use `prisma/schema.prisma` as the source of truth.
- Do not edit `src/generated/prisma` manually.
- Do not return `User.password`.
- Use `select` to limit returned fields.
- Use `include` only when relations are needed.
- Handle unique constraint errors.

## Public API Rules

Public APIs should normally return:

- `isPublished = true`
- `isArchived = false` where available
- `isActive = true` for hero where applicable

## Admin API Rules

- Admin APIs require authentication.
- Admin APIs may return draft/unpublished records.
- Support list query params consistently.

## Security Rules

- Validate input.
- Do not trust frontend auth.
- Return 401 for unauthenticated.
- Return 403 for forbidden.
- Hide internal errors.
- Do not log tokens/passwords/secrets.
