# __PROJECT_DISPLAY__

全端專案模板：Spring Boot（後端）+ Nuxt 4 BFF（前端）+ PostgreSQL + Redis，全部以 Docker Compose 運行。
內建使用者註冊／登入（JWT + Spring Security）骨架，以及 BFF 安全閘道設計，可作為新專案的起點。

> 📖 **架構總覽（圖示版）**：用瀏覽器開啟 [`docs/index.html`](docs/index.html)，以圖示方式說明請求流向、BFF、分層、MVVM 與命名佔位符，比文字更好讀。

> 這是從既有專案抽離出來的乾淨骨架。專案名稱以兩個佔位符表示：`__PROJECT_DISPLAY__`（品牌顯示名）與 `__PROJECT_NAME__`（小寫機器 slug）。複製後依 [TEMPLATE.md](TEMPLATE.md) 替換即可成為新專案。

## 預設帳號

由 `Database/data.sql` 種入一筆管理者帳號：

- 帳號：`admin@__PROJECT_NAME__.com`
- 密碼：`admin1234`

## 技術總覽

- 前端：Nuxt 4（SSR + Server Routes BFF）、Composition API、Nuxt UI、Tailwind CSS、i18n
- 後端：Spring Boot（Controller / Service / Repository 三層，保留 DDD-lite 分層）
- 認證：JWT + Spring Security Filter Chain（單純驗證使用者是否存在 DB）
- 資料庫：PostgreSQL（schema 僅 `users` + `schema_version`）
- 查詢：原生 JDBC（`NamedParameterJdbcTemplate`）
- 快取／Session：Redis
- 開發環境：Docker Compose

## 架構概覽

```
瀏覽器 → Nginx → Nuxt BFF（server/api）→ Spring Boot → PostgreSQL
                        ↓
                     Redis（session）
```

- **BFF 模式**：JWT 由 Nuxt server 端安全保存，瀏覽器只持有 HttpOnly session cookie，降低 XSS 風險。
- 前端頁面只呼叫 `/api/*`，由 BFF 代理轉發到 Spring Boot 並附上 JWT。

## 快速開始

```bash
# 1. 啟動基礎服務（PostgreSQL + Redis）
cd Docker
cp .template.env .env          # 填入 JWT_SECRET 等
docker-compose -f docker-compose-services.yaml up -d

# 2. 啟動應用（Spring Boot + Nuxt + Nginx）
docker-compose -f docker-compose-app.yaml up -d
```

## 腳手架工具

`.claude/skills/skill-penguin/` 提供三個 scaffolding skill，以 `User` 為藍本快速建立新 entity 的後端三層、BFF API 與 MVVM model。詳見該資料夾的 `SKILL.md`。
