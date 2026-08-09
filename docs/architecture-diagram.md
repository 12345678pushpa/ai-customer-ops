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