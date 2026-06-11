---
name: skill-penguin
description: Scaffolding skills for this full-stack template — grow a new feature's backend three layers (be-entity), Nuxt BFF CRUD routes (bff-api), and frontend MVVM model + types (bff-model). Use when the user wants to scaffold/長出 a new entity/resource (e.g. "建一個 Product 的後端三層 / BFF / model", "scaffold a new entity", "be-entity / bff-api / bff-model").
---

# skill-penguin — Scaffolding

以 `User` 領域為藍本，快速長出新 entity 的「後端三層 + BFF API + 前端 MVVM model」。
三個腳本皆為 Node ≥ 18 ES module，**只用內建模組（fs / path），免 `npm install`**。

base package 會**動態偵測** `BE/SpringBoot/src/main/java/com/penguin/` 底下唯一子目錄，
因此 `/init-template` 把 package 改成 `com.penguin.<slug>` 後仍正確運作（不寫死 `template`）。

共用慣例：
- 不覆蓋既有檔案：目標已存在則跳過並提示。
- 命名衍生：傳入 `EntityName`（PascalCase，如 `Product`）→ 衍生 `Product`（類別）、`product`（小寫變數 / package 區段）、`products`（複數 resource，`--resource` 可覆蓋）。
- 範本以 `__ENTITY__` / `__entity__` / `__resource__` /（後端再加 `__PACKAGE__`）佔位；前端用 `__Model__` / `__model__` / `__resource__`。
- 每支腳本執行後會印出「已產生清單」與「Post-steps（待補 TODO）」。

> 三者通常依序使用：**be-entity → bff-api → bff-model**，最後再做頁面（頁面 `<script>` 不可直接 fetch，一律透過 model）。

---

## be-entity — 後端三層

**觸發詞**：「建後端三層」「be-entity」「scaffold backend entity」「長一個 XXX 的 controller/service/repo」

**執行**：
```bash
node .claude/skills/skill-penguin/scripts/create-be-entity.mjs <EntityName> [--scope controller|service|repo] [--resource <plural>]
```
- `--scope controller`（預設）= 全套；`service` = service + repo；`repo` = 只 repo。
- 範例：`node .claude/skills/skill-penguin/scripts/create-be-entity.mjs Product`

**產生的檔案**（以 `Product`、scope=controller、package=`com.penguin.template` 為例）：
```
entity/Product.java
repository/ProductRepository.java        repository/impl/ProductRepositoryImpl.java
repository/rowmapper/ProductRowMapper.java
service/ProductService.java              service/impl/ProductServiceImpl.java
controller/product/ProductController.java
domain/product/ProductDTO.java
domain/product/ProductCreateCommand.java domain/product/ProductUpdateCommand.java
domain/product/ProductCondition.java
domain/product/exception/ProductNotFoundException.java
domain/product/exception/ProductExceptionHandler.java
```
慣例：原生 `NamedParameterJdbcTemplate`（非 JPA）；查詢用「整句靜態 SQL + null-guard」；Service / Repository 皆 interface + `impl/`；統一回 `ApiResponse`，分頁用 `PageCommand` / `PageResponse`；每個 domain 一個 `@RestControllerAdvice`。CRUD 端點：`/api/products` 的 index（分頁）/ getById / create / update / delete。

**Post-steps**：在 `Database/schema.sql` 建 `products` 表 → 依 schema 補 entity / DTO / RowMapper / Command / Condition / RepositoryImpl SQL 的欄位（範本只示範 `name`）→ `cd BE/SpringBoot && make re` 重新打包。

---

## bff-api — Nuxt BFF 路由

**觸發詞**：「建 BFF API」「bff-api」「scaffold BFF routes」「幫 products 開代理路由」

**執行**：
```bash
node .claude/skills/skill-penguin/scripts/create-bff-api.mjs <NameOrResource> [--resource <plural>]
```
- 範例：`node .claude/skills/skill-penguin/scripts/create-bff-api.mjs Product`

**產生的檔案**（`server/api/products/`）：
```
index.get.ts        index.post.ts
[id]/index.get.ts   [id]/index.put.ts   [id]/index.delete.ts
[...products].ts    # 403 catch-all
```
透過 `server/utils/backendFetch.ts` 代理到 Spring Boot `/api/products`，並自 session 帶上 Bearer token（JWT 留在 BFF 端，瀏覽器只有 session cookie）。

**Post-steps**：後端端點需先用 be-entity 產生；若要把後端錯誤碼轉前端訊息，可在 `server/error/ResourceErrorCode.ts` 加碼並用 `server/composables/useThrowApiError.ts` 丟出 → 再用 bff-model 產生前端 model。

---

## bff-model — 前端 MVVM model + 型別

**觸發詞**：「建前端 model」「bff-model」「scaffold model」「幫 Product 寫 useProduct」

**執行**：
```bash
node .claude/skills/skill-penguin/scripts/create-bff-model.mjs <ModelName> [--resource <plural>]
```
- 範例：`node .claude/skills/skill-penguin/scripts/create-bff-model.mjs Product`

**產生的檔案**：
```
app/composables/model/useProduct.ts   # index / get / create / update / remove，打 /api/products
types/Product.d.ts                    # 對應後端 DTO，含 ProductCreateDTO / ProductUpdateDTO
```
分頁型別沿用 `types/index.d.ts` 的 `Pagination<T>`。

**Post-steps**：`types/Product.d.ts` 欄位需對應後端 `ProductDTO`（範本只示範 `name`）；**MVVM 鐵則**：page 的 `<script>` 不可直接 fetch，一律透過 `useProduct()`；需先用 bff-api 產生 `/api/products` 路由。
