# Code Review Checklist

## General

- [ ] Solves requested task.
- [ ] No unrelated files changed.
- [ ] Existing architecture followed.
- [ ] TypeScript types correct.
- [ ] No careless `any`.
- [ ] No unused imports/dead code.

## Frontend

- [ ] Uses shadcn/ui/Tailwind consistently.
- [ ] API calls are not inside UI components.
- [ ] TanStack Query handles API/server state.
- [ ] Zustand only handles shared UI/client state.
- [ ] Loading/error/empty states handled.
- [ ] UI responsive.
- [ ] Accessibility basics covered.

## Backend

- [ ] Input validation exists.
- [ ] Admin APIs check auth.
- [ ] Response shape matches docs/api.md.
- [ ] HTTP statuses are correct.
- [ ] Prisma fields match schema.
- [ ] Sensitive fields excluded.
- [ ] Errors are safe.

## API/DB

- [ ] Endpoint/payload/response documented.
- [ ] Query params follow convention.
- [ ] Schema changes documented.
- [ ] Generated Prisma files not edited manually.

## Security

- [ ] Secrets not exposed.
- [ ] Password/token not logged.
- [ ] `User.password` not returned.
- [ ] Public POST endpoints validate input.

## Verification

- [ ] `npm run lint` passed or failure explained.
- [ ] `npx tsc --noEmit` passed or failure explained.
- [ ] `npm run build` passed or failure explained.
- [ ] Tests passed if available.
