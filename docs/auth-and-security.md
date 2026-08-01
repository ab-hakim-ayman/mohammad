# Auth and Security

## Auth Routes

```txt
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Protected Areas

Admin APIs:

```txt
/api/admin/*
```

Admin dashboard:

```txt
src/app/[locale]/admin
```

## Relevant Files

```txt
middleware.ts
src/core/server/security/auth.ts
src/core/server/security/token.ts
src/features/auth
```

## User Model Rules

- `User.email` is unique.
- `User.password` is sensitive.
- `User.password` must never be returned from APIs.
- Current role enum contains `ADMIN`.
- `isActive` should control access if implemented.

## Authentication Rules

- Admin routes require valid authentication.
- Server-side auth checks are mandatory.
- Frontend-only route protection is not enough.
- Return 401 when unauthenticated.
- Logout must clear session/cookie/token.

## Authorization Rules

- Admin actions require admin role.
- Return 403 when authenticated but not allowed.
- Keep permission logic centralized if possible.

## Security Rules

- Never commit `.env`.
- Never expose secrets to the browser.
- Never log passwords/tokens.
- Validate all input.
- Hide internal errors.
- Public POST endpoints must validate strictly.

## Public POST Endpoints

```txt
POST /api/public/contacts
POST /api/public/newsletters
```

Rules:

- validate input
- handle duplicates safely
- no sensitive logging
- add anti-spam/rate limiting if available

## Mail Delivery

Auth invitation and password reset flows use the server-side mail helper under `src/core/server/mail`.

Required environment variables:

```txt
RESEND_API_KEY
MAIL_FROM
APP_URL
```

Notes:

- Do not return invite/reset tokens to the client.
- Use absolute links in outbound emails.
- Keep mail failures logged server-side without exposing secrets.
