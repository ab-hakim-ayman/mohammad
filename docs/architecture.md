# Architecture

## Overview

This project uses Next.js App Router with feature-based architecture.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL
- TanStack Query
- Zustand
- npm
- localized routing under src/app/[locale]

## Main Folders

- `src/app` — App Router pages, layouts, loading/error/not-found, API route handlers
- `src/app/api` — backend API routes
- `src/app/[locale]` — localized frontend routes
- `src/features` — feature modules
- `src/core/server` — server utilities
- `src/shared` — shared components, API client, types, i18n, and theme
- `prisma` — Prisma schema and seed scripts
- `src/generated/prisma` — generated Prisma client output

## API Route Groups

```txt
src/app/api/auth
src/app/api/admin
src/app/api/public
```

## Frontend Route Groups

```txt
src/app/[locale]/admin
src/app/[locale]/public
src/app/[locale]/login
```

## Feature Modules

Existing features:

- `about`
- `achievement`
- `audit`
- `auth`
- `blog`
- `career`
- `case-study`
- `category`
- `client`
- `contact`
- `education`
- `event`
- `faq`
- `gallery`
- `hero`
- `quote`
- `media`
- `newsletter`
- `partner`
- `profile`
- `project`
- `service`
- `skill`
- `specialization`
- `tag`
- `team`
- `team-member`
- `technology`
- `testimonial`
- `user`

Recommended feature structure:

```txt
src/features/{feature}/
  api/            # frontend API client functions
  components/     # feature UI components
  hooks/          # TanStack Query hooks
  repositories/   # server-side Prisma/database access
  schemas/        # Zod schemas
  services/       # business logic
  store/          # Zustand UI state if needed
  types/          # TypeScript types
```

## Layer Responsibilities

### Route Handlers

Located in `src/app/api`.

Responsibilities:

- parse request
- validate params/query/body
- check auth/permission
- call service
- return response

### Services

Located in `src/features/{feature}/services`.

Responsibilities:

- business logic
- publish/archive behavior
- orchestration
- calling repositories

### Repositories

Located in `src/features/{feature}/repositories`.

Responsibilities:

- Prisma queries
- filtering/search/sorting
- pagination
- relation include/select

### API Clients

Located in `src/features/{feature}/api`.

Responsibilities:

- frontend API calls
- typed payloads/responses

### Hooks

Located in `src/features/{feature}/hooks`.

Responsibilities:

- TanStack Query queries and mutations
- invalidation

## Important Utilities

Server utilities:

```txt
src/core/server/http/response.ts
src/core/server/http/handler.ts
src/core/server/http/errors.ts
src/core/server/security/auth.ts
src/core/server/cache.ts
src/core/server/mail
src/core/server/security/token.ts
src/core/server/prisma.ts
```

Shared utilities:

```txt
src/shared/lib/client.ts
src/shared/i18n
src/shared/theme
src/shared/types
src/shared/components
```

## Project Tree Snapshot

```txt
.
├── AGENTS.md
├── eslint.config.mjs
├── middleware.ts
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── prisma
│   ├── schema.prisma
│   ├── seeds
│   │   ├── abouts.seed.ts
│   │   ├── blogs.seed.ts
│   │   ├── categories.seed.ts
│   │   ├── contacts.seed.ts
│   │   ├── heroes.seed.ts
│   │   ├── newsletters.seed.ts
│   │   ├── projects.seed.ts
│   │   ├── skills.seed.ts
│   │   ├── specializations.seed.ts
│   │   ├── tags.seed.ts
│   │   ├── technologies.seed.ts
│   │   ├── testimonials.seed.ts
│   │   └── user.seed.ts
│   └── seed.ts
├── prisma.config.ts
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── admin
│   │   │   │   ├── abouts
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── blogs
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── categories
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── contacts
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── heroes
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── newsletters
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── projects
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── skills
│   │   │   │   │   ├── categories
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── specializations
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── tags
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── technologies
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── testimonials
│   │   │   │       ├── [id]
│   │   │   │       │   └── route.ts
│   │   │   │       └── route.ts
│   │   │   ├── auth
│   │   │   │   ├── login
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout
│   │   │   │   │   └── route.ts
│   │   │   │   └── me
│   │   │   │       └── route.ts
│   │   │   └── public
│   │   │       ├── abouts
│   │   │       │   └── route.ts
│   │   │       ├── blogs
│   │   │       │   ├── route.ts
│   │   │       │   └── [slug]
│   │   │       │       └── route.ts
│   │   │       ├── categories
│   │   │       │   ├── route.ts
│   │   │       │   └── [slug]
│   │   │       │       └── route.ts
│   │   │       ├── contacts
│   │   │       │   └── route.ts
│   │   │       ├── heroes
│   │   │       │   └── route.ts
│   │   │       ├── newsletters
│   │   │       │   └── route.ts
│   │   │       ├── projects
│   │   │       │   ├── route.ts
│   │   │       │   └── [slug]
│   │   │       │       └── route.ts
│   │   │       ├── skills
│   │   │       │   └── route.ts
│   │   │       ├── specializations
│   │   │       │   └── route.ts
│   │   │       ├── tags
│   │   │       │   ├── route.ts
│   │   │       │   └── [slug]
│   │   │       │       └── route.ts
│   │   │       ├── technologies
│   │   │       │   └── route.ts
│   │   │       └── testimonials
│   │   │           └── route.ts
│   │   ├── error.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── [locale]
│   │   │   ├── admin
│   │   │   │   ├── abouts
│   │   │   │   │   ├── create
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── blogs
│   │   │   │   │   ├── create
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── categories
│   │   │   │   │   ├── create
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── contacts
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── heroes
│   │   │   │   │   ├── create
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── newsletters
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── projects
│   │   │   │   │   ├── create
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── skills
│   │   │   │   │   ├── create
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── specializations
│   │   │   │   │   ├── create
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── tags
│   │   │   │   │   ├── create
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── technologies
│   │   │   │   │   ├── create
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── edit
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── testimonials
│   │   │   │       ├── create
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── [id]
│   │   │   │       │   ├── edit
│   │   │   │       │   │   └── page.tsx
│   │   │   │       │   └── page.tsx
│   │   │   │       └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── not-found.tsx
│   │   │   ├── page.tsx
│   │   │   └── public
│   │   │       ├── abouts
│   │   │       │   └── page.tsx
│   │   │       ├── blogs
│   │   │       │   ├── page.tsx
│   │   │       │   └── [slug]
│   │   │       │       └── page.tsx
│   │   │       ├── categories
│   │   │       │   ├── page.tsx
│   │   │       │   └── [slug]
│   │   │       │       └── page.tsx
│   │   │       ├── contacts
│   │   │       │   └── page.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── heroes
│   │   │       │   └── page.tsx
│   │   │       ├── projects
│   │   │       │   ├── page.tsx
│   │   │       │   └── [slug]
│   │   │       │       └── page.tsx
│   │   │       ├── skills
│   │   │       │   └── page.tsx
│   │   │       ├── specializations
│   │   │       │   └── page.tsx
│   │   │       ├── tags
│   │   │       │   ├── page.tsx
│   │   │       │   └── [slug]
│   │   │       │       └── page.tsx
│   │   │       ├── technologies
│   │   │       │   └── page.tsx
│   │   │       └── testimonials
│   │   │           └── page.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── core
│   │   ├── logger
│   │   │   └── logger.ts
│   │   ├── server
│   │   │   ├── http
│   │   │   │   ├── errors.ts
│   │   │   │   ├── handler.ts
│   │   │   │   └── response.ts
│   │   │   ├── security
│   │   │   │   ├── auth.ts
│   │   │   │   └── token.ts
│   │   │   ├── cache.ts
│   │   │   └── prisma.ts
│   │   └── utils
│   │       └── utils.ts
│   ├── features
│   │   ├── about
│   │   │   ├── api
│   │   │   │   └── about.api.ts
│   │   │   ├── components
│   │   │   │   ├── AboutForm.tsx
│   │   │   │   ├── AboutList.tsx
│   │   │   │   └── AboutSection.tsx
│   │   │   ├── hooks
│   │   │   │   └── useAbout.ts
│   │   │   ├── repositories
│   │   │   │   └── about.repository.ts
│   │   │   ├── schemas
│   │   │   │   └── about.schema.ts
│   │   │   ├── services
│   │   │   │   └── about.service.ts
│   │   │   ├── store
│   │   │   │   └── about.store.ts
│   │   │   └── types
│   │   │       ├── about.types.ts
│   │   │       └── index.ts
│   │   ├── auth
│   │   │   ├── api
│   │   │   │   └── auth.api.ts
│   │   │   ├── components
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── hooks
│   │   │   │   └── useAuth.ts
│   │   │   ├── repositories
│   │   │   │   └── auth.repository.ts
│   │   │   ├── schemas
│   │   │   │   └── auth.schema.ts
│   │   │   ├── services
│   │   │   │   └── auth.service.ts
│   │   │   └── types
│   │   │       ├── auth.types.ts
│   │   │       └── index.ts
│   │   ├── blog
│   │   │   ├── api
│   │   │   │   └── blog.api.ts
│   │   │   ├── components
│   │   │   │   ├── BlogCard.tsx
│   │   │   │   ├── BlogForm.tsx
│   │   │   │   ├── BlogList.tsx
│   │   │   │   └── BlogSection.tsx
│   │   │   ├── hooks
│   │   │   │   └── useBlog.ts
│   │   │   ├── repositories
│   │   │   │   └── blog.repository.ts
│   │   │   ├── schemas
│   │   │   │   └── blog.schema.ts
│   │   │   ├── services
│   │   │   │   └── blog.service.ts
│   │   │   ├── store
│   │   │   │   ├── blog-section.store.ts
│   │   │   │   └── blog.store.ts
│   │   │   └── types
│   │   │       ├── blog.types.ts
│   │   │       └── index.ts
│   │   ├── category
│   │   │   ├── api
│   │   │   │   └── category.api.ts
│   │   │   ├── components
│   │   │   │   ├── CategoryForm.tsx
│   │   │   │   ├── CategoryList.tsx
│   │   │   │   └── CategorySection.tsx
│   │   │   ├── hooks
│   │   │   │   └── useCategory.ts
│   │   │   ├── repositories
│   │   │   │   └── category.repository.ts
│   │   │   ├── schemas
│   │   │   │   └── category.schema.ts
│   │   │   ├── services
│   │   │   │   └── category.service.ts
│   │   │   ├── store
│   │   │   │   └── category.store.ts
│   │   │   └── types
│   │   │       ├── category.types.ts
│   │   │       └── index.ts
│   │   ├── contact
│   │   │   ├── api
│   │   │   │   └── contact.api.ts
│   │   │   ├── components
│   │   │   │   ├── ContactDetail.tsx
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   └── ContactList.tsx
│   │   │   ├── hooks
│   │   │   │   └── useContact.ts
│   │   │   ├── repositories
│   │   │   │   └── contact.repository.ts
│   │   │   ├── schemas
│   │   │   │   └── contact.schema.ts
│   │   │   ├── services
│   │   │   │   └── contact.service.ts
│   │   │   ├── store
│   │   │   │   └── contact.store.ts
│   │   │   └── types
│   │   │       ├── contact.types.ts
│   │   │       └── index.ts
│   │   ├── hero
│   │   │   ├── api
│   │   │   │   └── hero.api.ts
│   │   │   ├── components
│   │   │   │   ├── HeroForm.tsx
│   │   │   │   ├── HeroList.tsx
│   │   │   │   └── HeroSection.tsx
│   │   │   ├── hooks
│   │   │   │   └── useHero.ts
│   │   │   ├── index.ts
│   │   │   ├── repositories
│   │   │   │   └── hero.repository.ts
│   │   │   ├── schemas
│   │   │   │   └── hero.schema.ts
│   │   │   ├── services
│   │   │   │   └── hero.service.ts
│   │   │   ├── store
│   │   │   │   └── hero.store.ts
│   │   │   └── types
│   │   │       ├── hero.types.ts
│   │   │       └── index.ts
│   │   ├── newsletter
│   │   │   ├── api
│   │   │   │   └── newsletter.api.ts
│   │   │   ├── components
│   │   │   │   ├── NewsletterList.tsx
│   │   │   │   ├── NewsletterSection.tsx
│   │   │   │   ├── SubscribeForm.tsx
│   │   │   │   └── UnsubscribeButton.tsx
│   │   │   ├── hooks
│   │   │   │   └── useNewsletter.ts
│   │   │   ├── repositories
│   │   │   │   └── newsletter.repository.ts
│   │   │   ├── schemas
│   │   │   │   └── newsletter.schema.ts
│   │   │   ├── services
│   │   │   │   └── newsletter.service.ts
│   │   │   ├── store
│   │   │   │   └── newsletter.store.ts
│   │   │   └── types
│   │   │       ├── index.ts
│   │   │       └── newsletter.types.ts
│   │   ├── project
│   │   │   ├── api
│   │   │   │   └── project.api.ts
│   │   │   ├── components
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── ProjectForm.tsx
│   │   │   │   ├── ProjectList.tsx
│   │   │   │   └── ProjectSection.tsx
│   │   │   ├── hooks
│   │   │   │   └── useProject.ts
│   │   │   ├── index.ts
│   │   │   ├── repositories
│   │   │   │   └── project.repository.ts
│   │   │   ├── schemas
│   │   │   │   └── project.schema.ts
│   │   │   ├── services
│   │   │   │   └── project.service.ts
│   │   │   ├── store
│   │   │   │   ├── project-section.store.ts
│   │   │   │   └── project.store.ts
│   │   │   └── types
│   │   │       ├── index.ts
│   │   │       └── project.types.ts
│   │   ├── skill
│   │   │   ├── api
│   │   │   │   └── skill.api.ts
│   │   │   ├── components
│   │   │   │   ├── SkillCard.tsx
│   │   │   │   ├── SkillForm.tsx
│   │   │   │   ├── SkillList.tsx
│   │   │   │   └── SkillSection.tsx
│   │   │   ├── hooks
│   │   │   │   └── useSkill.ts
│   │   │   ├── index.ts
│   │   │   ├── repositories
│   │   │   │   └── skill.repository.ts
│   │   │   ├── schemas
│   │   │   │   └── skill.schema.ts
│   │   │   ├── services
│   │   │   │   └── skill.service.ts
│   │   │   ├── store
│   │   │   │   ├── skill-section.store.ts
│   │   │   │   └── skill.store.ts
│   │   │   └── types
│   │   │       ├── index.ts
│   │   │       └── skill.types.ts
│   │   ├── specialization
│   │   │   ├── api
│   │   │   │   └── specialization.api.ts
│   │   │   ├── components
│   │   │   │   ├── SpecializationCard.tsx
│   │   │   │   ├── SpecializationForm.tsx
│   │   │   │   ├── SpecializationList.tsx
│   │   │   │   └── SpecializationSection.tsx
│   │   │   ├── hooks
│   │   │   │   └── useSpecialization.ts
│   │   │   ├── repositories
│   │   │   │   └── specialization.repository.ts
│   │   │   ├── schemas
│   │   │   │   └── specialization.schema.ts
│   │   │   ├── services
│   │   │   │   └── specialization.service.ts
│   │   │   ├── store
│   │   │   │   └── specialization.store.ts
│   │   │   └── types
│   │   │       ├── index.ts
│   │   │       └── specialization.types.ts
│   │   ├── tag
│   │   │   ├── api
│   │   │   │   └── tag.api.ts
│   │   │   ├── components
│   │   │   │   ├── TagForm.tsx
│   │   │   │   ├── TagList.tsx
│   │   │   │   └── TagSection.tsx
│   │   │   ├── hooks
│   │   │   │   └── useTag.ts
│   │   │   ├── repositories
│   │   │   │   └── tag.repository.ts
│   │   │   ├── schemas
│   │   │   │   └── tag.schema.ts
│   │   │   ├── services
│   │   │   │   └── tag.service.ts
│   │   │   ├── store
│   │   │   │   └── tag.store.ts
│   │   │   └── types
│   │   │       ├── index.ts
│   │   │       └── tag.types.ts
│   │   ├── technology
│   │   │   ├── api
│   │   │   │   └── technology.api.ts
│   │   │   ├── components
│   │   │   │   ├── TechnologyCard.tsx
│   │   │   │   ├── TechnologyForm.tsx
│   │   │   │   ├── TechnologyList.tsx
│   │   │   │   └── TechnologySection.tsx
│   │   │   ├── hooks
│   │   │   │   └── useTechnology.ts
│   │   │   ├── index.ts
│   │   │   ├── repositories
│   │   │   │   └── technology.repository.ts
│   │   │   ├── schemas
│   │   │   │   └── technology.schema.ts
│   │   │   ├── services
│   │   │   │   └── technology.service.ts
│   │   │   ├── store
│   │   │   │   └── technology.store.ts
│   │   │   └── types
│   │   │       ├── index.ts
│   │   │       └── technology.types.ts
│   │   └── testimonial
│   │       ├── api
│   │       │   └── testimonial.api.ts
│   │       ├── components
│   │       │   ├── TestimonialCard.tsx
│   │       │   ├── TestimonialForm.tsx
│   │       │   ├── TestimonialList.tsx
│   │       │   └── TestimonialSection.tsx
│   │       ├── hooks
│   │       │   └── useTestimonial.ts
│   │       ├── repositories
│   │       │   └── testimonial.repository.ts
│   │       ├── schemas
│   │       │   └── testimonial.schema.ts
│   │       ├── services
│   │       │   └── testimonial.service.ts
│   │       ├── store
│   │       │   └── testimonial.store.ts
│   │       └── types
│   │           ├── index.ts
│   │           └── testimonial.types.ts
│   ├── generated
│   │   └── prisma
│   │       ├── browser.ts
│   │       ├── client.ts
│   │       ├── commonInputTypes.ts
│   │       ├── enums.ts
│   │       ├── internal
│   │       │   ├── class.ts
│   │       │   ├── prismaNamespaceBrowser.ts
│   │       │   └── prismaNamespace.ts
│   │       ├── models
│   │       │   ├── About.ts
│   │       │   ├── Blog.ts
│   │       │   ├── Category.ts
│   │       │   ├── Contact.ts
│   │       │   ├── Education.ts
│   │       │   ├── Hero.ts
│   │       │   ├── Newsletter.ts
│   │       │   ├── Project.ts
│   │       │   ├── Skill.ts
│   │       │   ├── Specialization.ts
│   │       │   ├── Tag.ts
│   │       │   ├── Technology.ts
│   │       │   ├── Testimonial.ts
│   │       │   └── User.ts
│   │       └── models.ts
│   ├── shared
│   │   ├── api
│   │   │   ├── client.ts
│   │   │   └── index.ts
│   │   ├── components
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SectionTitle.tsx
│   │   │   ├── SectionWrapper.tsx
│   │   │   └── index.ts
│   │   ├── i18n
│   │   │   ├── components
│   │   │   │   └── LanguageSwitcher.tsx
│   │   │   ├── config.ts
│   │   │   ├── index.ts
│   │   │   ├── messages
│   │   │   │   ├── bn.json
│   │   │   │   └── en.json
│   │   │   ├── navigation.ts
│   │   │   ├── request.ts
│   │   │   └── routing.ts
│   │   ├── theme
│   │   │   ├── config.ts
│   │   │   ├── index.ts
│   │   │   ├── provider.tsx
│   │   │   └── ThemeToggle.tsx
│   │   └── types
│   │       ├── api.ts
│   │       └── index.ts
├── tailwind.config.ts
├── tsconfig.json
└── tsconfig.tsbuildinfo
```

## Architecture Rules

- Follow the existing feature module pattern.
- Keep route handlers thin.
- Keep business logic in services.
- Keep Prisma queries in repositories.
- Keep reusable UI in shared/shadcn components.
- Do not import server-only modules into client components.
- Do not manually edit generated Prisma files.
