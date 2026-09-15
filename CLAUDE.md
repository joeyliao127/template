# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

__PROJECT_DISPLAY__ is a full-stack starter template:
- **BE/** — Spring Boot (Java 21) REST API, JWT auth
- **FE/** — Nuxt 4 frontend with BFF (Backend For Frontend) pattern
- **Database/** — PostgreSQL schema and seed data
- **Docker/** — Docker Compose for local dev and production

> This is a clean skeleton. Two placeholders are used: `__PROJECT_DISPLAY__` (brand/display name, e.g. shown in titles) and `__PROJECT_NAME__` (lowercase machine slug for Docker/PG/domain/cookie). The Java package uses `template`. Run `/init-template` when starting a new project to replace the placeholders and rename the Java package (see `BE/SpringBoot/README.md` → 第一次使用 template).

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
./mvnw test               # 後端測試（需要 Docker 開著，見「測試」）
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

## 測試

後端：JUnit 5 ＋ Spring Boot Test（MockMvc）＋ Testcontainers PostgreSQL。範例是 `User` 的三支測試：`UserRepositoryImplTest`、`UserServiceImplTest`、`UserControllerTest`。
執行：`cd BE/SpringBoot && ./mvnw test`，需要 Docker 開著（IntelliJ 直接執行測試 class 也可以，工作目錄要是 `BE/SpringBoot`）。

**寫法**
- 放 `src/test/java`，package 與原 class 相同，class 名稱＝原 class＋`Test`。
- 分層：repository 測 SQL、service 測業務規則與數字、controller 測 HTTP 狀態碼與回應格式。
- 每個 class 自己加 `@SpringBootTest`，用 `@Autowired` 注入真的 bean，不用共用基底類別；要把依賴換成假的才用 `@MockBean`。
- 會寫資料的測試方法加 `@Transactional`，跑完自動回滾，每支測試開始時資料都一樣。
- 斷言用 JUnit 5 的 `assertEquals`、`assertNotNull`、`assertNull`、`assertTrue`／`assertFalse`、`assertThrows`，不用 AssertJ。
- `@DisplayName` 用中文寫「情境：預期」，邊界情境以「邊界：」開頭；class 上方 Javadoc 寫這個 class 依賴的前置資料。
- controller：class 加 `@AutoConfigureMockMvc`；`RequestBuilder requestBuilder = MockMvcRequestBuilders.post(...).header(...).content(json)`，再 `mockMvc.perform(requestBuilder).andDo(print()).andExpect(status().is(201))`；請求內容用 `ObjectMapper` 把 command 轉成 JSON。網址要含 `/api` 前綴（`WebConfig` 統一加上）。需要登入的 API 用 `JWTProvider.generateToken(...)` 產 token 放進 `Authorization: Bearer ...`，token 裡的使用者要存在測試資料。

**設定與資料**（`BE/SpringBoot/src/test/resources/`）
- `application.properties` 會整個取代 main 那份（不是合併），測試需要的設定都要寫在這裡。
- 資料庫用 Testcontainers 的 `jdbc:tc:postgresql:<版本>://localhost/<資料庫名>`，開一個跟開發環境同版本的 PostgreSQL，跑完銷毀。不用 H2：H2 載不進 PostgreSQL 專屬語法（`TIMESTAMPTZ`、部分索引、enum 等），要另外維護一份 schema，而且測不到列鎖、條件更新這類 PostgreSQL 行為。
- schema 直接讀 `Database/schema.sql`（單一來源，不另存一份）；測試資料是 `src/test/resources/data.sql`。`Database/data.sql` 是正式種子資料，不給測試用。
- 網址帶 `prepareThreshold=0`：每個不同的 Spring context 啟動都會重跑 schema.sql，重建 enum 型別後，其他 context 連線裡快取的查詢會報 `cached plan must not change result type`。
- `junit-platform.properties` 設單一測試逾時 120 秒，卡在鎖等待時直接失敗，不會一直掛著。

**常見陷阱**
- 業務檢查「先查再擋」：重複、狀態、庫存等先查詢再丟例外，資料庫約束只當最後防線。PostgreSQL 交易中一句 SQL 失敗後，同交易的後續查詢都會被拒，測試就無法在例外之後確認資料沒變。直接測約束的 repository 測試，例外之後不要再查資料庫。
- 需要真的 commit 的測試（併發、`REQUIRES_NEW` 的獨立交易）不加 `@Transactional`：併發要各自 commit 才測得到鎖；`REQUIRES_NEW` 包在測試交易裡會等外層放鎖而卡死。這類測試自己清理，例如 `@Sql(statements = "TRUNCATE TABLE ... RESTART IDENTITY CASCADE;", executionPhase = AFTER_TEST_METHOD)` 再接 `@Sql(scripts = "classpath:data.sql", ...)` 重新載入。**TRUNCATE 結尾一定要有分號**，否則 Spring 改用換行切句，只執行到第一行。還原只清空重載資料，不重跑 schema.sql。併發測試 class 以 `ConcurrencyTest` 結尾，讓人一眼看出它不回滾。
- 併發測試用「先握鎖」寫法：第一個操作在交易內做完但先不 commit，確認第二個操作在等鎖（例如 1 秒後還沒做完），再放行第一個 commit。只讓兩邊同時起跑的話，沒加鎖的實作也常常會過。
- 錯誤情境要能因為對的理由失敗：先確認正常路徑成立，再測被擋（例如先確認正確密碼登得進去，再測密碼錯誤被擋）。

**前端**：不加測試框架。改完畫面用 Claude in Chrome 做瀏覽器驗證（實際操作流程，檢查畫面、console 與 network）。

## Environment Configuration
Copy `Docker/.template.env` to `Docker/.env` and configure service IPs/ports/secrets. The `.env` is gitignored.

## Scaffolding Skills
`.claude/skills/skill-penguin/` provides `be-entity` / `bff-api` / `bff-model` skills to scaffold a new feature's backend three layers, BFF API, and MVVM model using `User` as the blueprint.

## Test Account
Email: `admin@__PROJECT_NAME__.com` / Password: `admin1234`
Sign-in endpoint: `POST /api/users/signIn`
