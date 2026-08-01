# Contributing Guide

## Before Starting

Read:

- `README.md`
- `AGENTS.md`
- `docs/architecture.md`
- Relevant docs under `docs/`

For complex changes, create/update `.agent/PLANS.md` first.

## Branch Naming

Use clear branch names:

```txt
feature/add-blog-editor
fix/admin-skill-pagination
refactor/project-service
docs/update-api-contract
```

## Commit Style

```txt
feat: add project create form
fix: correct skill pagination query
refactor: move blog filtering to query builder
docs: update API documentation
```

## Rules

- Keep changes focused.
- Do not change unrelated files.
- Follow existing feature structure.
- Use TypeScript properly.
- Avoid `any` unless unavoidable.
- Update docs when API, schema, auth, or architecture changes.
- Do not add dependencies unless necessary and explained.

## PR Checklist

- [ ] Code solves the requested task.
- [ ] No unrelated files changed.
- [ ] API contract is followed.
- [ ] Prisma schema is followed.
- [ ] Types are correct.
- [ ] Loading/error/empty states are handled.
- [ ] Auth/permission checks are included where needed.
- [ ] Docs are updated if needed.
- [ ] Lint/type/build checks pass or failures are explained.
