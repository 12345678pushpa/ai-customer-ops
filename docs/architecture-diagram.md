## Diagram (v1)

React (client) 
   │
   ▼
Node/Express API (server)
   │
   ├──▶ MySQL (structured data)
   ├──▶ MongoDB (flexible/event data)
   └──▶ (later) Redis, AI service, external APIs (Gmail, Calendar)



   ## Database Access

- ORM: Prisma (type-safe MySQL client for Node/TypeScript)
- Schema lives in `server/prisma/schema.prisma`
- Migrations tracked in `server/prisma/migrations/`
- `DATABASE_URL` is set per-environment via `.env` (never committed; see `.env.example` for the shape)

## Data Models (so far)

**User** (MySQL)
- id, email (unique), password (hashed), role (ADMIN | MEMBER), createdAt
- Passwords are always hashed before storage — see Authentication section below (added once auth routes exist)


## Note: Prisma 7 driver adapters

Prisma 7 removed direct `url` support in `schema.prisma`. Connection config now lives in:
- `prisma.config.ts` — used by the Prisma CLI (migrations)
- `src/prisma.ts` — instantiates `PrismaClient` with an explicit driver adapter (`@prisma/adapter-mariadb` for MySQL) at runtime

This is a deliberate architecture change in Prisma 7, not a misconfiguration.

## Authentication

**Flow:**
1. `POST /auth/register` — validates email/password, checks for duplicates, hashes password with bcrypt, creates User (role defaults to `MEMBER`)
2. `POST /auth/login` — verifies email exists, compares hashed password, issues a JWT (1 hour expiry) containing `userId` and `role`
3. Protected routes use `authenticate` middleware (`src/middleware/auth.ts`) — reads `Authorization: Bearer <token>` header, verifies JWT signature/expiry, attaches `userId`/`role` to the request
4. `GET /auth/profile` — example protected route, returns the logged-in user's own data

**Security notes:**
- Passwords are never stored in plain text (bcrypt, salt rounds = 10)
- JWT signed with `JWT_SECRET` (random 256-bit value, stored in `.env`, never committed)
- Tokens expire after 1 hour (no refresh token yet — planned for a later day)

**Known environment gotchas (for future reference):**
- MySQL 8's default `caching_sha2_password` auth plugin isn't compatible with `@prisma/adapter-mariadb` — local dev DB user was switched to `mysql_native_password`
- Prisma 7 requires driver adapters (`@prisma/adapter-mariadb`) instead of a direct `url` in `schema.prisma`; connection config now lives in `prisma.config.ts` and `src/prisma.ts`
- Project uses native ESM (`"type": "module"`) — all relative imports must include `.js` extension (even in `.ts` source files), per Node's ESM resolution rules