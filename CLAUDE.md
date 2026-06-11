# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

__PROJECT_DISPLAY__ is a full-stack starter template:
- **BE/** — Spring Boot (Java 21) REST API, JWT auth
- **FE/** — Nuxt 4 frontend with BFF (Backend For Frontend) pattern
- **Database/** — PostgreSQL schema and seed data
- **Docker/** — Docker Compose for local dev and production

> This is a clean skeleton. Two placeholders are used: `__PROJECT_DISPLAY__` (brand/display name, e.g. shown in titles) and `__PROJECT_NAME__` (lowercase machine slug for Docker/PG/domain/cookie). The Java package uses `template`. See `TEMPLATE.md` for the rename steps when starting a new project.

## Development Commands

### Start Infrastructure (required before running either app)
```bash
cd Docker
cp .template.env .env
docker-compose -f docker-compose-services.yaml up -d   # PostgreSQL (5432) + Redis (6379)
```

### Frontend (Nuxt 4)
```bash
cd FE/Nuxt
pnpm install
pnpm dev                  # Dev server
pnpm build_production     # Production build
pnpm openapi:types        # Regenerate TS types from Spring Boot OpenAPI spec
```

### Backend (Spring Boot)
```bash
cd BE/SpringBoot
./mvnw clean install      # Build
./mvnw spring-boot:run    # Run (port 8080)
```

Swagger UI: `http://localhost:8080/swagger-ui/index.html`

> 注意：`pnpm` / `mvn` 指令通常需在對應 Docker 容器內執行（`docker exec`），或請使用者手動執行。

## Architecture

### Request Flow
```
Browser → Nginx → Nuxt BFF (server/api/) → Spring Boot (8080) → PostgreSQL (5432)
                          ↓
                       Redis (6379, sessions)
```

### BFF Pattern (Critical Design Decision)
The Nuxt `server/api/` directory acts as a secure gateway — **JWT tokens are stored server-side in the BFF, never in the browser**. The browser only receives an HTTP-only session cookie. Frontend pages call `/api/*` routes; those routes proxy to Spring Boot with the JWT attached server-side.

### Backend Structure (three-layer + DDD-lite)
```
BE/SpringBoot/src/main/java/com/penguin/template/
├── domain/          # Business objects by feature (auth, user) — command/dto/exception
├── controller/      # REST endpoints (user)
├── service/         # interface + impl/ (UserService, JWTService)
├── repository/      # interface + impl/ + rowmapper/ (NamedParameterJdbcTemplate, NOT JPA)
├── entity/          # Domain entities (User)
├── config/          # Spring config (Security, JWT, OpenAPI, WebConfig)
└── common/          # Shared utilities (ApiResponse, PageCommand, exceptions)
```

**Important:** Raw JDBC (`NamedParameterJdbcTemplate`) for all DB queries — not JPA/QueryDSL.
Spring Security is JWT-only: it verifies the user exists in the DB. No RBAC.

### Frontend Structure (MVVM)
```
FE/Nuxt/
├── app/
│   ├── pages/       # Route pages (signIn, index)
│   ├── components/  # Vue components (dashboard, settings, form, ui)
│   ├── composables/ # Reusable composition functions (model/ = API-fetching composables)
│   └── layouts/     # dashboard / default / main
└── server/
    ├── api/         # BFF endpoints (auth, user) — proxy to Spring Boot
    ├── middleware/  # Session.ts
    └── plugins/     # Auth.ts, Redis.ts
```

**MVVM 鐵則**：禁止在 `.vue` 的 script 區塊直接 `fetch`。fetch 只能透過 model（`composables/model/` 的 composable）執行，由 ViewModel（script）調用與重組。

### Key Database Tables
- `users` — id, username, email, password, created_at, updated_at
- `schema_version` — migration tracking

## Environment Configuration
Copy `Docker/.template.env` to `Docker/.env` and configure service IPs/ports/secrets. The `.env` is gitignored.

## Scaffolding Skills
`.claude/skills/skill-penguin/` provides `be-entity` / `bff-api` / `bff-model` skills to scaffold a new feature's backend three layers, BFF API, and MVVM model using `User` as the blueprint.

## Test Account
Email: `admin@__PROJECT_NAME__.com` / Password: `admin1234`
Sign-in endpoint: `POST /api/users/signIn`
