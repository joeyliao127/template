# Backend — 架構介紹

此為 template 的後端：一個只保留「使用者 + JWT 驗證」的 Spring Boot 骨架，作為新專案擴充領域的起點。
設計上刻意維持精簡——只有 `User` 一個領域、無 RBAC、無業務資料表，方便用 scaffolding 快速長出新功能。

## 設計原則

- **三層式 + DDD-lite**：Controller / Service / Repository 三層；`domain/` 依領域擺放 command / dto / exception，前期單純、後期可往 DDD 擴充。
- **Interface / Impl 分離**：Service 與 Repository 都以 interface 對上層暴露，實作放在 `impl/`，降低上層模組對實作的耦合，方便替換與測試。
- **原生 JDBC**：資料存取一律使用 `NamedParameterJdbcTemplate`，不使用 JPA / QueryDSL，以保有複雜查詢的控制權。
- **JWT-only 安全**：Spring Security 僅驗證「JWT 有效且使用者存在 DB」，不含角色權限（RBAC）。

## 套件結構

```
com.penguin.template/            # template 佔位 package；/init-template 會改成 com.penguin.<slug>
├── common/        # 共用物件（PageCommand、ApiResponse、PageResponse、ValidationExceptionHandler）
├── config/        # Spring 設定（WebSecurity、JWTConfig、OpenApiConfig、WebConfig、PasswordEncoderConfig）
├── controller/    # REST 端點（user）
├── domain/        # 各領域物件：auth、user（command / dto / exception / exceptionHandler）
├── entity/        # 對應 DB 欄位的 entity（User）
├── repository/    # interface 直接放本層；impl/ 放 JDBC 實作；rowmapper/ 放 ResultSet → entity
└── service/       # interface 直接放本層；impl/ 放實作（UserService、JWTService）
```

## 各層職責

- **Controller**：驗證前端參數（`@Valid`）；GET 分頁用 `PageCommand` 接 Query String；錯誤統一交由各領域的 `@RestControllerAdvice` Exception Handler 回覆 `ApiResponse`。
- **Service**：應用邏輯；跨領域時可注入其他領域的 Service / Repository。
- **Repository（JDBC）**：interface 定義方法、`impl/` 以 `NamedParameterJdbcTemplate` 撰寫 SQL、`rowmapper/` 負責轉成 entity。動態過濾建議用整句靜態 SQL + null-guard（`(:param IS NULL OR col = :param)`），避免字串拼接。
- **entity**：對應 DB 欄位的純資料物件。
- **common / config**：跨領域共用物件與 Spring 設定。

## 認證流程（JWT）

- 註冊 `POST /api/users/signUp` → 建立使用者。
- 登入 `POST /api/users/signIn` → 驗證密碼（BCrypt）→ 簽發 JWT。
- 受保護請求 → `JWTAuthenticationFilter` 解析 Bearer token → `AuthFacade` 驗證 token 並確認使用者存在 DB → 放行。

## OpenAPI / Swagger

- 由 `springdoc-openapi-starter-webmvc-ui` 自動掃描 `/api/**` Controller（`WebConfig` 統一前綴），提供 Swagger UI 與 OpenAPI 文件。
- `/swagger-ui/**`、`/api/v3/api-docs/**` 與登入端點已在 `WebSecurity` 放行，其餘路徑需 JWT。

---

## 環境需求

- **Docker / Docker Compose**：整套服務（PG、Redis、Spring Boot、Nuxt、Nginx）都跑在 Compose。後端採**多階段建構**，用 Docker 啟動時 **host 不需安裝 Java / Maven**（在 build 容器內完成打包）。
- **Node.js ≥ 18 LTS**：初始化與 scaffolding 是 `.mjs` 腳本（`init-template`、`be-entity`…）；純 Node 內建模組、免 `npm install`，但需先裝 Node。
- **mkcert**：本機 HTTPS 憑證工具。安裝後需先執行一次 `mkcert -install`（把本機 CA 裝進系統信任庫，瀏覽器才信任）。
- **（選用）JDK 21**：只有要在 IDE 直接跑後端 / 測試（不透過 Docker）才需要；pom 設 `java.version=21`，內含 `./mvnw`。
- **OS**：以 macOS / Linux 為主；Windows 建議在 WSL 下執行腳本。

## 第一次使用 template

這個 repo 是一個乾淨的全端骨架；專案名稱用 **兩個佔位符** 表示，初始化後替換即可變成你的新專案。

| 佔位符 | 用途 | 範例 | 規則 |
|--------|------|------|------|
| `__PROJECT_DISPLAY__` | 品牌／顯示名（OpenAPI 標題、`WEBSITE_NAME`、Sidebar、README 標題） | `YanduoERP` | 任意字串，可含大寫 |
| `__PROJECT_NAME__` | 機器用 slug（Docker Compose 專案名、GHCR image repo、PostgreSQL、域名、cookie） | `yanduoerp` | **必須全小寫**，符合 `^[a-z][a-z0-9_-]*$` |

> 為什麼分兩個？Docker Compose 專案名與 image repo 名 **強制小寫**，但品牌名常含大寫——分開才能兩者兼顧。
> Java package 用真實字 `template` 佔位（語法不允許 `__…__`），值同 slug。

### 步驟 0：初始化

```bash
cp -r template my-project && cd my-project
rm -rf .git && git init
```

接著執行 `/init-template`，它會一次完成：替換兩個佔位符、把 Java package `com.penguin.template` 與 `TemplateApplication` 改名為你的 slug、並建立含 `JWT_SECRET` 的 `Docker/.env`。

> 若只是評估 template、未跑 init，請先手動 `cp Docker/.template.env Docker/.env`。

### 步驟 1：一次性前置（每台機器一次）

```bash
mkcert -install        # 將本機 CA 裝進系統信任庫
```

### 步驟 2：啟動全部服務

```bash
# 1) 產生 nginx 用的本機 HTTPS 憑證（憑證不存在會導致 nginx 啟動失敗）
#    從 ssl 目錄執行，憑證才會生成在正確位置
cd Docker/nginx/ssl && sh generate-ssl.sh && cd -

# 2) 設定 hosts，讓網域指向本機
echo "127.0.0.1 __PROJECT_NAME__.local.com" | sudo tee -a /etc/hosts

# 3) 啟動全部服務
cd Docker && sh startup.sh
```

`startup.sh` 會自動：起 PG / Redis → **等 PG 就緒**（首次自動匯入 `schema.sql` / `data.sql`）→ **多階段 build jar** → 起 Spring Boot / Nuxt / Nginx。

啟動後：
- 前端（HTTPS）：`https://__PROJECT_NAME__.local.com`
- Swagger UI（後端直連）：`http://localhost:8080/swagger-ui/index.html`

**改完後端 Java、要重新打包**：

```bash
cd BE/SpringBoot && make re      # = docker-compose -f ../../Docker/docker-compose-app.yaml up -d --build springboot
```
