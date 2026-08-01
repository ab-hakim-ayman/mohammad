# Coding Standards

## General

- Prefer readable code.
- Keep files focused.
- Keep functions small.
- Follow existing patterns.
- Avoid duplicate logic.
- Avoid unnecessary dependencies.
- Do not modify unrelated files.

## TypeScript

- Avoid `any`.
- Type API payloads/responses.
- Type component props.
- Reuse feature types from `src/features/{feature}/types`.
- Keep shared API types in `src/shared/types/api.ts` when appropriate.

## Naming

Components:

```txt
SkillForm.tsx
ProjectList.tsx
HeroSection.tsx
```

Hooks:

```txt
useSkill.ts
useProject.ts
useAuth.ts
```

API files:

```txt
skill.api.ts
project.api.ts
auth.api.ts
```

Schemas:

```txt
skill.schema.ts
project.schema.ts
```

Services/repositories:

```txt
skill.service.ts
skill.repository.ts
```

Stores:

```txt
skill.store.ts
project-section.store.ts
```

## Generated Files

Do not manually edit:

```txt
src/generated/prisma
```

## Do Not

- Do not invent API routes.
- Do not invent DB fields.
- Do not duplicate server state in Zustand.
- Do not create huge components.
- Do not add random CSS when Tailwind/shadcn exists.
- Do not expose secrets to client code.
