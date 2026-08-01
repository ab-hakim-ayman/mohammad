# Frontend Guidelines

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- localized routes under `src/app/[locale]`

## Route Rules

- Public pages: `src/app/[locale]/public`
- Admin pages: `src/app/[locale]/admin`
- Login page: `src/app/[locale]/login/page.tsx`

## Component Rules

- Use functional components.
- Keep components small and focused.
- Use shadcn/ui components where appropriate.
- Use Tailwind CSS consistently.
- Keep feature-specific UI inside `src/features/{feature}/components`.
- Use shared components from `src/shared/components` when reusable.
- Do not put API calls directly inside UI components.

## Next.js Rules

- Use Server Components by default.
- Add `"use client"` only when using state, effects, event handlers, browser APIs, TanStack Query, Zustand, forms, or interactive shadcn components.
- Do not import Prisma/server utilities into client components.
- Do not expose private env variables in client code.

## Data Fetching

- Use feature API clients from `src/features/{feature}/api`.
- Use hooks from `src/features/{feature}/hooks`.
- Use TanStack Query for API data.
- Include params in query keys.
- Invalidate related queries after create/update/delete.

## State Management

Use TanStack Query for API/server state.

Use Zustand only for shared UI/client state:

- search/filter/sort/page params
- selected id
- modal open/close
- active tab/view mode
- section layout state

Do not store API data/loading/error in Zustand.

## Forms

- Use feature schemas from `src/features/{feature}/schemas`.
- Show validation errors.
- Disable submit button while pending.
- Show success/error feedback.
- Invalidate related queries after successful mutation.

## UI/UX

- Add loading state.
- Add error state.
- Add empty state.
- Ensure responsive layout.
- Use consistent spacing, typography, and colors.
- Follow shadcn/Tailwind design conventions.

## Accessibility

- Use semantic HTML.
- Use `<button>` for actions.
- Inputs need labels or accessible names.
- Images need alt text unless decorative.
- Dialogs/modals should be keyboard accessible.
