# API Documentation

## Overview

Implemented API routes live under:

```txt
src/app/api
```

The current surface is grouped into:

```txt
/api/auth/*
/api/admin/*
/api/public/*
```

## Access Model

- `/api/admin/*` requires authenticated admin/staff access.
- Some admin routes apply extra role checks on top of admin auth:
  - user management routes require management roles
  - quote routes require staff roles
- `/api/public/*` is public unless a route explicitly checks the current authenticated user.
- Public POST endpoints must validate input strictly.
- Some public GET routes are cached through `ApiServer.cachedPublic`.
- `GET` and `PATCH` on `/api/admin/profile/me` operate on the current authenticated user even though the path sits under `admin`.

## Response Envelope

### Success

```json
{
  "success": true,
  "message": "Success",
  "statusCode": 200,
  "data": {},
  "meta": {
    "timestamp": "2026-06-08T00:00:00.000Z"
  }
}
```

### Paginated success

```json
{
  "success": true,
  "message": "Success",
  "statusCode": 200,
  "data": {
    "data": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  },
  "meta": {
    "timestamp": "2026-06-08T00:00:00.000Z"
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Something went wrong",
  "statusCode": 400,
  "data": null,
  "errors": {},
  "meta": {
    "timestamp": "2026-06-08T00:00:00.000Z"
  }
}
```

## HTTP Status Codes

| Status | Meaning                      |
| ------ | ---------------------------- |
| 1      | Successful GET/PATCH/DELETE  |
| 2      | Successful POST/create       |
| 3      | Successful delete/no content |
| 4      | Bad request                  |
| 5      | Unauthenticated              |
| 6      | Forbidden                    |
| 7      | Not found                    |
| 8      | Duplicate/conflict           |
| 9      | Validation error if used     |
| 10     | Unexpected server error      |

## Common Query Patterns

Most list endpoints use a subset of the following filters. Exact support depends on the feature schema.

| Query                     | Typical use                |
| ------------------------- | -------------------------- |
| `page`                    | Paginated list page number |
| `limit`                   | Paginated list size        |
| `search`                  | Free text search           |
| `sort`                    | Sort field and direction   |
| `category`                | Category filtering         |
| `type`                    | Type filtering             |
| `isPublished`             | Published state filtering  |
| `isArchived`              | Archived state filtering   |
| `featured` / `isFeatured` | Featured state filtering   |
| `section`                 | Section filtering          |
| `role`                    | Role filtering             |
| `status`                  | Status filtering           |
| `teamId`                  | Team-scoped filtering      |
| `department`              | Department filtering       |
| `showOnTeam`              | Team visibility filtering  |

## Full API List

### Auth

| #   | Feature | Scope         | Endpoint                    | Method | Purpose                                       |
| --- | ------- | ------------- | --------------------------- | ------ | --------------------------------------------- |
| 11  | Auth    | Public        | `/api/auth/login`           | POST   | Login with email/password and set auth cookie |
| 12  | Auth    | Public        | `/api/auth/logout`          | POST   | Clear auth cookie                             |
| 13  | Auth    | Authenticated | `/api/auth/me`              | GET    | Return current authenticated user             |
| 14  | Auth    | Admin/staff   | `/api/auth/invite`          | POST   | Invite a new user                             |
| 15  | Auth    | Public        | `/api/auth/accept-invite`   | POST   | Accept an invite and set auth cookie          |
| 16  | Auth    | Public        | `/api/auth/forgot-password` | POST   | Send a password reset email                   |
| 17  | Auth    | Public        | `/api/auth/reset-password`  | POST   | Reset password with a token                   |
| 18  | Auth    | Authenticated | `/api/auth/change-password` | POST   | Change current user password                  |
| 19  | Auth    | Public        | `/api/auth/verify-token`    | POST   | Verify invite/reset token state               |

### People & Access Management

| #   | Feature  | Scope  | Endpoint                              | Method | Purpose                           |
| --- | -------- | ------ | ------------------------------------- | ------ | --------------------------------- |
| 20  | Users    | Admin  | `/api/admin/users`                    | GET    | List users                        |
| 21  | Users    | Admin  | `/api/admin/users`                    | POST   | Create user                       |
| 22  | Users    | Admin  | `/api/admin/users/[id]`               | GET    | Get user by ID                    |
| 23  | Users    | Admin  | `/api/admin/users/[id]`               | PATCH  | Update user                       |
| 24  | Users    | Admin  | `/api/admin/users/[id]`               | DELETE | Delete user                       |
| 25  | Users    | Admin  | `/api/admin/users/[id]/status`        | PATCH  | Update account status             |
| 26  | Users    | Admin  | `/api/admin/users/[id]/role`          | PATCH  | Update role                       |
| 27  | Users    | Admin  | `/api/admin/users/[id]/resend-invite` | POST   | Resend invitation                 |
| 28  | Profiles | Public | `/api/public/profiles/team`           | GET    | Return team-ready public profiles |
| 29  | Profiles | Admin  | `/api/admin/profiles`                 | GET    | List profiles                     |
| 30  | Profiles | Admin  | `/api/admin/profiles/[id]`            | GET    | Get profile by ID                 |
| 31  | Profiles | Admin  | `/api/admin/profiles/[id]`            | PATCH  | Update profile by ID              |
| 32  | Profiles | Admin  | `/api/admin/profiles/[id]/visibility` | PATCH  | Update public/team visibility     |
| 33  | Profile  | Admin  | `/api/admin/profile/me`               | GET    | Get current user's profile        |
| 34  | Profile  | Admin  | `/api/admin/profile/me`               | PATCH  | Update current user's profile     |
| 35  | Quotes   | Public | `/api/public/quotes`                  | GET    | List published quotes             |
| 36  | Quotes   | Public | `/api/public/quotes/featured`         | GET    | Get featured quotes               |
| 37  | Quotes   | Admin  | `/api/admin/quotes`                   | GET    | List quotes                       |
| 38  | Quotes   | Admin  | `/api/admin/quotes`                   | POST   | Create quote                      |
| 39  | Quotes   | Admin  | `/api/admin/quotes/[id]`              | GET    | Get quote by ID                   |
| 40  | Quotes   | Admin  | `/api/admin/quotes/[id]`              | PATCH  | Update quote                      |
| 41  | Quotes   | Admin  | `/api/admin/quotes/[id]`              | DELETE | Delete quote                      |
| 42  | Quotes   | Admin  | `/api/admin/quotes/[id]/publish`      | PATCH  | Toggle publish state              |
| 43  | Quotes   | Admin  | `/api/admin/quotes/[id]/featured`     | PATCH  | Toggle featured state             |
| 44  | Quotes   | Admin  | `/api/admin/quotes/reorder`           | PATCH  | Reorder quotes                    |

### Content & Company Modules

| #   | Feature          | Scope  | Endpoint                              | Method | Purpose                             |
| --- | ---------------- | ------ | ------------------------------------- | ------ | ----------------------------------- |
| 45  | Abouts           | Public | `/api/public/abouts`                  | GET    | Get about section                   |
| 46  | Abouts           | Admin  | `/api/admin/abouts`                   | GET    | List about entries                  |
| 47  | Abouts           | Admin  | `/api/admin/abouts`                   | POST   | Create about entry                  |
| 48  | Abouts           | Admin  | `/api/admin/abouts/[id]`              | GET    | Get about entry by ID               |
| 49  | Abouts           | Admin  | `/api/admin/abouts/[id]`              | PATCH  | Update about entry                  |
| 50  | Abouts           | Admin  | `/api/admin/abouts/[id]`              | DELETE | Delete about entry                  |
| 51  | Blogs            | Public | `/api/public/blogs`                   | GET    | List published blogs                |
| 52  | Blogs            | Public | `/api/public/blogs/[slug]`            | GET    | Get blog by slug                    |
| 53  | Blogs            | Admin  | `/api/admin/blogs`                    | GET    | List blogs                          |
| 54  | Blogs            | Admin  | `/api/admin/blogs`                    | POST   | Create blog                         |
| 55  | Blogs            | Admin  | `/api/admin/blogs/[id]`               | GET    | Get blog by ID                      |
| 56  | Blogs            | Admin  | `/api/admin/blogs/[id]`               | PATCH  | Update blog                         |
| 57  | Blogs            | Admin  | `/api/admin/blogs/[id]`               | DELETE | Delete blog                         |
| 58  | Categories       | Public | `/api/public/categories`              | GET    | List published categories           |
| 59  | Categories       | Public | `/api/public/categories/[slug]`       | GET    | Get category by slug                |
| 60  | Categories       | Admin  | `/api/admin/categories`               | GET    | List categories                     |
| 61  | Categories       | Admin  | `/api/admin/categories`               | POST   | Create category                     |
| 62  | Categories       | Admin  | `/api/admin/categories/[id]`          | GET    | Get category by ID                  |
| 63  | Categories       | Admin  | `/api/admin/categories/[id]`          | PATCH  | Update category                     |
| 64  | Categories       | Admin  | `/api/admin/categories/[id]`          | DELETE | Delete category                     |
| 65  | Tags             | Public | `/api/public/tags`                    | GET    | List published tags                 |
| 66  | Tags             | Public | `/api/public/tags/[slug]`             | GET    | Get tag by slug                     |
| 67  | Tags             | Admin  | `/api/admin/tags`                     | GET    | List tags                           |
| 68  | Tags             | Admin  | `/api/admin/tags`                     | POST   | Create tag                          |
| 69  | Tags             | Admin  | `/api/admin/tags/[id]`                | GET    | Get tag by ID                       |
| 70  | Tags             | Admin  | `/api/admin/tags/[id]`                | PATCH  | Update tag                          |
| 71  | Tags             | Admin  | `/api/admin/tags/[id]`                | DELETE | Delete tag                          |
| 72  | Projects         | Public | `/api/public/projects`                | GET    | List published projects             |
| 73  | Projects         | Public | `/api/public/projects/[slug]`         | GET    | Get project by slug                 |
| 74  | Projects         | Admin  | `/api/admin/projects`                 | GET    | List projects                       |
| 75  | Projects         | Admin  | `/api/admin/projects`                 | POST   | Create project                      |
| 76  | Projects         | Admin  | `/api/admin/projects/[id]`            | GET    | Get project by ID                   |
| 77  | Projects         | Admin  | `/api/admin/projects/[id]`            | PATCH  | Update project                      |
| 78  | Projects         | Admin  | `/api/admin/projects/[id]`            | DELETE | Delete project                      |
| 79  | Skills           | Public | `/api/public/skills`                  | GET    | List published skills               |
| 80  | Skills           | Admin  | `/api/admin/skills`                   | GET    | List skills                         |
| 81  | Skills           | Admin  | `/api/admin/skills`                   | POST   | Create skill                        |
| 82  | Skills           | Admin  | `/api/admin/skills/[id]`              | GET    | Get skill by ID                     |
| 83  | Skills           | Admin  | `/api/admin/skills/[id]`              | PATCH  | Update skill                        |
| 84  | Skills           | Admin  | `/api/admin/skills/[id]`              | DELETE | Delete skill                        |
| 85  | Skills           | Admin  | `/api/admin/skills/categories`        | GET    | Return distinct skill categories    |
| 86  | Technologies     | Public | `/api/public/technologies`            | GET    | List published technologies         |
| 87  | Technologies     | Admin  | `/api/admin/technologies`             | GET    | List technologies                   |
| 88  | Technologies     | Admin  | `/api/admin/technologies`             | POST   | Create technology                   |
| 89  | Technologies     | Admin  | `/api/admin/technologies/[id]`        | GET    | Get technology by ID                |
| 90  | Technologies     | Admin  | `/api/admin/technologies/[id]`        | PATCH  | Update technology                   |
| 91  | Technologies     | Admin  | `/api/admin/technologies/[id]`        | DELETE | Delete technology                   |
| 92  | Specializations  | Public | `/api/public/specializations`         | GET    | List published specializations      |
| 93  | Specializations  | Admin  | `/api/admin/specializations`          | GET    | List specializations                |
| 94  | Specializations  | Admin  | `/api/admin/specializations`          | POST   | Create specialization               |
| 95  | Specializations  | Admin  | `/api/admin/specializations/[id]`     | GET    | Get specialization by ID            |
| 96  | Specializations  | Admin  | `/api/admin/specializations/[id]`     | PATCH  | Update specialization               |
| 97  | Specializations  | Admin  | `/api/admin/specializations/[id]`     | DELETE | Delete specialization               |
| 98  | Heroes           | Public | `/api/public/heroes`                  | GET    | Get active hero                     |
| 99  | Heroes           | Admin  | `/api/admin/heroes`                   | GET    | List heroes                         |
| 100 | Heroes           | Admin  | `/api/admin/heroes`                   | POST   | Create hero                         |
| 101 | Heroes           | Admin  | `/api/admin/heroes/[id]`              | GET    | Get hero by ID                      |
| 102 | Heroes           | Admin  | `/api/admin/heroes/[id]`              | PATCH  | Update hero                         |
| 103 | Heroes           | Admin  | `/api/admin/heroes/[id]`              | DELETE | Delete hero                         |
| 104 | Testimonials     | Public | `/api/public/testimonials`            | GET    | List published testimonials         |
| 105 | Testimonials     | Admin  | `/api/admin/testimonials`             | GET    | List testimonials                   |
| 106 | Testimonials     | Admin  | `/api/admin/testimonials`             | POST   | Create testimonial                  |
| 107 | Testimonials     | Admin  | `/api/admin/testimonials/[id]`        | PATCH  | Update testimonial                  |
| 108 | Testimonials     | Admin  | `/api/admin/testimonials/[id]`        | DELETE | Delete testimonial                  |
| 109 | Contacts         | Public | `/api/public/contacts`                | POST   | Submit contact form                 |
| 110 | Contacts         | Admin  | `/api/admin/contacts`                 | GET    | List contact messages               |
| 111 | Contacts         | Admin  | `/api/admin/contacts/[id]`            | GET    | Get contact message by ID           |
| 112 | Contacts         | Admin  | `/api/admin/contacts/[id]`            | PATCH  | Update contact status               |
| 113 | Contacts         | Admin  | `/api/admin/contacts/[id]`            | DELETE | Delete contact message              |
| 114 | Newsletters      | Public | `/api/public/newsletters`             | POST   | Subscribe to newsletter             |
| 115 | Newsletters      | Admin  | `/api/admin/newsletters`              | GET    | List subscribers                    |
| 116 | Newsletters      | Admin  | `/api/admin/newsletters/[id]`         | GET    | Get subscriber by ID                |
| 117 | Newsletters      | Admin  | `/api/admin/newsletters/[id]`         | PATCH  | Update subscriber                   |
| 118 | Newsletters      | Admin  | `/api/admin/newsletters/[id]`         | DELETE | Remove subscriber                   |
| 119 | Services         | Public | `/api/public/services`                | GET    | List published services             |
| 120 | Services         | Public | `/api/public/services/[slug]`         | GET    | Get service by slug                 |
| 121 | Services         | Admin  | `/api/admin/services`                 | GET    | List services                       |
| 122 | Services         | Admin  | `/api/admin/services`                 | POST   | Create service                      |
| 123 | Services         | Admin  | `/api/admin/services/[id]`            | GET    | Get service by ID                   |
| 124 | Services         | Admin  | `/api/admin/services/[id]`            | PATCH  | Update service                      |
| 125 | Services         | Admin  | `/api/admin/services/[id]`            | DELETE | Delete service                      |
| 126 | Case Studies     | Public | `/api/public/case-studies`            | GET    | List published case studies         |
| 127 | Case Studies     | Public | `/api/public/case-studies/[slug]`     | GET    | Get case study by slug              |
| 128 | Case Studies     | Admin  | `/api/admin/case-studies`             | GET    | List case studies                   |
| 129 | Case Studies     | Admin  | `/api/admin/case-studies`             | POST   | Create case study                   |
| 130 | Case Studies     | Admin  | `/api/admin/case-studies/[id]`        | GET    | Get case study by ID                |
| 131 | Case Studies     | Admin  | `/api/admin/case-studies/[id]`        | PATCH  | Update case study                   |
| 132 | Case Studies     | Admin  | `/api/admin/case-studies/[id]`        | DELETE | Delete case study                   |
| 133 | Clients          | Public | `/api/public/clients`                 | GET    | List published clients              |
| 134 | Clients          | Admin  | `/api/admin/clients`                  | GET    | List clients                        |
| 135 | Clients          | Admin  | `/api/admin/clients`                  | POST   | Create client                       |
| 136 | Clients          | Admin  | `/api/admin/clients/[id]`             | GET    | Get client by ID                    |
| 137 | Clients          | Admin  | `/api/admin/clients/[id]`             | PATCH  | Update client                       |
| 138 | Clients          | Admin  | `/api/admin/clients/[id]`             | DELETE | Delete client                       |
| 139 | Achievements     | Public | `/api/public/achievements`            | GET    | List published achievements         |
| 140 | Achievements     | Admin  | `/api/admin/achievements`             | GET    | List achievements                   |
| 141 | Achievements     | Admin  | `/api/admin/achievements`             | POST   | Create achievement                  |
| 142 | Achievements     | Admin  | `/api/admin/achievements/[id]`        | GET    | Get achievement by ID               |
| 143 | Achievements     | Admin  | `/api/admin/achievements/[id]`        | PATCH  | Update achievement                  |
| 144 | Achievements     | Admin  | `/api/admin/achievements/[id]`        | DELETE | Delete achievement                  |
| 145 | Partners         | Public | `/api/public/partners`                | GET    | List published partners             |
| 146 | Partners         | Admin  | `/api/admin/partners`                 | GET    | List partners                       |
| 147 | Partners         | Admin  | `/api/admin/partners`                 | POST   | Create partner                      |
| 148 | Partners         | Admin  | `/api/admin/partners/[id]`            | GET    | Get partner by ID                   |
| 149 | Partners         | Admin  | `/api/admin/partners/[id]`            | PATCH  | Update partner                      |
| 150 | Partners         | Admin  | `/api/admin/partners/[id]`            | DELETE | Delete partner                      |
| 151 | Galleries        | Public | `/api/public/galleries`               | GET    | List published galleries            |
| 152 | Galleries        | Public | `/api/public/galleries/[slug]`        | GET    | Get gallery by slug                 |
| 153 | Galleries        | Admin  | `/api/admin/galleries`                | GET    | List galleries                      |
| 154 | Galleries        | Admin  | `/api/admin/galleries`                | POST   | Create gallery                      |
| 155 | Galleries        | Admin  | `/api/admin/galleries/[id]`           | GET    | Get gallery by ID                   |
| 156 | Galleries        | Admin  | `/api/admin/galleries/[id]`           | PATCH  | Update gallery                      |
| 157 | Galleries        | Admin  | `/api/admin/galleries/[id]`           | DELETE | Delete gallery                      |
| 158 | Galleries        | Admin  | `/api/admin/galleries/[id]/items`     | POST   | Create gallery item under a gallery |
| 159 | Galleries        | Admin  | `/api/admin/galleries/items/[itemId]` | GET    | Get gallery item by ID              |
| 160 | Galleries        | Admin  | `/api/admin/galleries/items/[itemId]` | PATCH  | Update gallery item                 |
| 161 | Galleries        | Admin  | `/api/admin/galleries/items/[itemId]` | DELETE | Delete gallery item                 |
| 162 | Events           | Public | `/api/public/events`                  | GET    | List published events               |
| 163 | Events           | Public | `/api/public/events/[slug]`           | GET    | Get event by slug                   |
| 164 | Events           | Admin  | `/api/admin/events`                   | GET    | List events                         |
| 165 | Events           | Admin  | `/api/admin/events`                   | POST   | Create event                        |
| 166 | Events           | Admin  | `/api/admin/events/[id]`              | GET    | Get event by ID                     |
| 167 | Events           | Admin  | `/api/admin/events/[id]`              | PATCH  | Update event                        |
| 168 | Events           | Admin  | `/api/admin/events/[id]`              | DELETE | Delete event                        |
| 169 | Teams            | Public | `/api/public/teams`                   | GET    | List published teams                |
| 170 | Teams            | Public | `/api/public/teams/[slug]`            | GET    | Get team by slug                    |
| 171 | Teams            | Admin  | `/api/admin/teams`                    | GET    | List teams                          |
| 172 | Teams            | Admin  | `/api/admin/teams`                    | POST   | Create team                         |
| 173 | Teams            | Admin  | `/api/admin/teams/[id]`               | GET    | Get team by ID                      |
| 174 | Teams            | Admin  | `/api/admin/teams/[id]`               | PATCH  | Update team                         |
| 175 | Teams            | Admin  | `/api/admin/teams/[id]`               | DELETE | Delete team                         |
| 176 | Team Members     | Public | `/api/public/team-members`            | GET    | List published team members         |
| 177 | Team Members     | Public | `/api/public/team-members/[id]`       | GET    | Get team member by ID               |
| 178 | Team Members     | Admin  | `/api/admin/team-members`             | GET    | List team members                   |
| 179 | Team Members     | Admin  | `/api/admin/team-members`             | POST   | Create team member                  |
| 180 | Team Members     | Admin  | `/api/admin/team-members/[id]`        | GET    | Get team member by ID               |
| 181 | Team Members     | Admin  | `/api/admin/team-members/[id]`        | PATCH  | Update team member                  |
| 182 | Team Members     | Admin  | `/api/admin/team-members/[id]`        | DELETE | Delete team member                  |
| 183 | FAQs             | Public | `/api/public/faqs`                    | GET    | List published FAQs                 |
| 184 | FAQs             | Admin  | `/api/admin/faqs`                     | GET    | List FAQs                           |
| 185 | FAQs             | Admin  | `/api/admin/faqs`                     | POST   | Create FAQ                          |
| 186 | FAQs             | Admin  | `/api/admin/faqs/[id]`                | GET    | Get FAQ by ID                       |
| 187 | FAQs             | Admin  | `/api/admin/faqs/[id]`                | PATCH  | Update FAQ                          |
| 188 | FAQs             | Admin  | `/api/admin/faqs/[id]`                | DELETE | Delete FAQ                          |
| 189 | Careers          | Public | `/api/public/careers`                 | GET    | List published careers              |
| 190 | Careers          | Public | `/api/public/careers/[slug]`          | GET    | Get career by slug                  |
| 191 | Careers          | Admin  | `/api/admin/careers`                  | GET    | List careers                        |
| 192 | Careers          | Admin  | `/api/admin/careers`                  | POST   | Create career                       |
| 193 | Careers          | Admin  | `/api/admin/careers/[id]`             | GET    | Get career by ID                    |
| 194 | Careers          | Admin  | `/api/admin/careers/[id]`             | PATCH  | Update career                       |
| 195 | Careers          | Admin  | `/api/admin/careers/[id]`             | DELETE | Delete career                       |
| 196 | Job Applications | Public | `/api/public/job-applications`        | POST   | Submit job application              |
| 197 | Job Applications | Admin  | `/api/admin/job-applications`         | GET    | List job applications               |
| 198 | Job Applications | Admin  | `/api/admin/job-applications/[id]`    | GET    | Get job application by ID           |
| 199 | Job Applications | Admin  | `/api/admin/job-applications/[id]`    | PATCH  | Update job application              |
| 200 | Job Applications | Admin  | `/api/admin/job-applications/[id]`    | DELETE | Delete job application              |

## Special Route Notes

| Route                                       | Note                                                                    |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| `GET /api/admin/skills/categories`          | Returns the distinct skill categories used by the admin skill workspace |
| `GET /api/public/profiles/team`             | Returns team-ready public profiles for the company team page            |
| `PATCH /api/admin/profiles/[id]/visibility` | Updates `isPublic` and `showOnTeam`                                     |
| `POST /api/admin/users/[id]/resend-invite`  | Resends the invite flow for a user                                      |
| `PATCH /api/admin/users/[id]/status`        | Updates account status                                                  |
| `PATCH /api/admin/users/[id]/role`          | Updates account role                                                    |
| `PATCH /api/admin/quotes/[id]/publish`      | Toggles publish state                                                   |
| `PATCH /api/admin/quotes/[id]/featured`     | Toggles featured state                                                  |
| `PATCH /api/admin/quotes/reorder`           | Accepts an `items` array with `{ id, order }`                           |
| `POST /api/admin/galleries/[id]/items`      | Creates a gallery item under a gallery                                  |
| `GET /api/admin/galleries/items/[itemId]`   | Retrieves a gallery item by ID                                          |
| `GET /api/public/quotes/featured`           | Returns featured quotes                                                 |

## Feature Query Notes

| Feature           | Supported query params                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Users             | `page`, `limit`, `search`, `sort`, `role`, `status`                                                            |
| Profiles          | `page`, `limit`, `search`, `department`, `isPublic`, `showOnTeam`, `sort`                                      |
| Leadership quotes | `page`, `limit`, `search`, `sort`, `type`, `isPublished`, `isFeatured`, `section`                              |
| Services          | `page`, `limit`, `search`                                                                                      |
| Case studies      | `page`, `limit`, `search`                                                                                      |
| Skills            | Public: `category`, `limit`; Admin: `page`, `limit`, `search`, `sort`, `category`, `isPublished`, `isArchived` |
| Technologies      | `page`, `limit`, `search`, `sort`, `category`, `isPublished`, `isArchived`                                     |
| Teams             | Public list supports `limit`                                                                                   |
| Team members      | Public list supports `limit`, `teamId`                                                                         |
| Galleries         | Public list supports `limit`                                                                                   |
| Events            | Public list supports `limit`                                                                                   |
| Clients           | Public list supports `limit`                                                                                   |
| Achievements      | Public list supports `limit`                                                                                   |
| Partners          | Public list supports `limit`                                                                                   |

## API Change Checklist

When changing API behavior:

- Update this file.
- Update the feature API client.
- Update TanStack Query hooks.
- Update schemas and types.
- Update services and repositories.
- Update frontend components if the response shape changes.

### Media Library

| #   | Feature | Scope | Endpoint                                      | Method | Purpose                                                      |
| --- | ------- | ----- | --------------------------------------------- | ------ | ------------------------------------------------------------ |
| 201 | Media   | Admin | `/api/admin/media`                            | GET    | List uploaded media assets                                   |
| 202 | Media   | Admin | `/api/admin/media`                            | POST   | Upload one or more files to Cloudinary and create media rows |
| 203 | Media   | Admin | `/api/admin/media/[id]`                       | GET    | Get media asset by ID                                        |
| 204 | Media   | Admin | `/api/admin/media/[id]`                       | PATCH  | Update media metadata and archive state                      |
| 205 | Media   | Admin | `/api/admin/media/[id]`                       | DELETE | Archive media asset                                          |
| 206 | Media   | Admin | `/api/admin/media/[id]/attachments`           | POST   | Attach media to an entity/field                              |
| 207 | Media   | Admin | `/api/admin/media/attachments/[attachmentId]` | DELETE | Remove a media attachment                                    |
