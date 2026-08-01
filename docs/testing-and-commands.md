# Testing and Commands

## Package Manager

```txt
npm
```

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

If Turbopack file watching hits OS limits on your machine, `npm run dev` uses the Webpack dev server in this project for stability.

## Lint

```bash
npm run lint
```

## Type Check

If script exists:

```bash
npm run type-check
```

Otherwise:

```bash
npx tsc --noEmit
```

## Build

```bash
npm run build
```

## Test

If configured:

```bash
npm test
```

## Prisma

Generate client:

```bash
npx prisma generate
```

Migration:

```bash
npx prisma migrate dev
```

Studio:

```bash
npx prisma studio
```

Seed if configured:

```bash
npm run seed
```

## Before Finishing

Run relevant checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Manual QA

Frontend:

- page loads
- responsive UI
- loading/error/empty states
- form validation
- admin/public route behavior

Backend:

- expected HTTP status
- correct response shape
- validation works
- admin auth works
- public APIs return published data only
