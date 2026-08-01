# Database Schema

## Overview

This project uses PostgreSQL with Prisma.

Source of truth:

```txt
prisma/schema.prisma
```

Generated client:

```txt
src/generated/prisma
```

Do not edit generated Prisma files by hand.

## Current Models

- `User`
- `Profile`
- `UserInvitation`
- `PasswordResetToken`
- `AuditLog`
- `Media`
- `MediaAttachment`
- `LeadershipQuote`
- `About`
- `Blog`
- `Category`
- `Tag`
- `Project`
- `Skill`
- `Technology`
- `Specialization`
- `Hero`
- `Testimonial`
- `Contact`
- `Newsletter`
- `Service`
- `CaseStudy`
- `Client`
- `Achievement`
- `Gallery`
- `GalleryItem`
- `Partner`
- `Event`
- `Team`
- `TeamMember`
- `Faq`
- `Career`
- `JobApplication`

## Current Enums

- `UserRole`
- `AccountStatus`
- `TeamType`
- `TeamMemberRole`
- `Status`
- `SkillLevel`
- `TechnologyProficiency`
- `JobType`
- `ApplicationStatus`
- `GalleryType`
- `PartnerType`
- `LeadershipQuoteType`
- `AuditAction`
- `MediaProvider`
- `MediaResourceType`
- `MediaUsageType`

## Design Rules

- Use the Prisma schema exactly as defined.
- Respect `@map` and `@@map` database mappings.
- Do not invent fields or relations in API/feature code.
- Do not return `User.password` from APIs.
- Use `isPublished` for public visibility where available.
- Use `isArchived` and `archivedAt` for archive behavior where available.
- Use `publishedAt` when publishing where available.
- Use `slug` for public detail routes where available.
- Use `order` for display order where available.

## Key Relation Notes

- `Blog` relates to many `Category` and `Tag` records.
- `Project` relates to many `Technology` records and one optional `CaseStudy`.
- `User` owns auth, audit, invitation, profile, and creator/updater relations.
- `Profile` stores public-facing person details for the authenticated user.
- `LeadershipQuote` can point to a `Profile` author or fall back to stored author fields.
- `Media` is the canonical asset store for images, videos, and files.
- `MediaAttachment` is the generic cross-model bridge for referencing media from other records.

## Media Handling Notes

- Keep legacy string fields on existing models when they are still useful for compatibility.
- Prefer `Media` + `MediaAttachment` for new upload/reference flows.
- Use Cloudinary-backed asset storage for files uploaded through the new media feature.
- Support multiple uploads in a single request when building admin media workflows.

## Canonical Schema Snapshot

For the full schema, inspect `prisma/schema.prisma` directly. The document above is the maintained summary for architecture and implementation guidance.
