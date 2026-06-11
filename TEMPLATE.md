# 使用此 Template 建立新專案

這個 repo 是一個乾淨的全端骨架。專案名稱用 **兩個佔位符** 表示，複製後替換即可變成你的新專案。

## 佔位符說明

| 佔位符 | 用途 | 範例 | 規則 |
|--------|------|------|------|
| `__PROJECT_DISPLAY__` | 品牌／顯示名（OpenAPI 標題、`WEBSITE_NAME`、Sidebar 文字、README 標題、IDE 連線標籤） | `YanduoERP` | 任意字串，可含大寫 |
| `__PROJECT_NAME__` | 機器用 slug（Docker Compose 專案名、GHCR image repo、PostgreSQL DB、域名、cookie、container/network 名、admin email 網域） | `yanduoerp` | **必須全小寫**，符合 `^[a-z][a-z0-9_-]*$` |

> 為什麼要分兩個？因為 Docker Compose 專案名與 Docker image repo 名 **強制小寫**，PostgreSQL 識別字也慣例小寫；但品牌名常含大寫（如 `YanduoERP`）。分開才能兩者兼顧。
> 慣例：slug = 顯示名轉小寫並把不合法字元換成 `-`（例如 `Yanduo ERP` → `yanduo-erp`）。

## 步驟 0：複製並重新 init git

```bash
cp -r template my-project
cd my-project
rm -rf .git
git init
```

## 步驟 1：替換兩個佔位符

用編輯器的「全專案取代」，或下列指令（先 display、後 slug）：

```bash
# macOS (BSD sed)；Linux 把 sed -i '' 改成 sed -i
EXCLUDES="--exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.nuxt --exclude-dir=target"

grep -rl '__PROJECT_DISPLAY__' . $EXCLUDES | xargs sed -i '' 's/__PROJECT_DISPLAY__/YanduoERP/g'
grep -rl '__PROJECT_NAME__'    . $EXCLUDES | xargs sed -i '' 's/__PROJECT_NAME__/yanduoerp/g'
```

## 步驟 2：替換 Java package 名 `template`

Java 不允許用佔位符當 package，後端以真實字 `template` 作為佔位（值同 slug）：

- package：`com.penguin.template` → `com.penguin.yanduoerp`
- 主類：`TemplateApplication` / `TemplateApplicationTests`

最穩的方式是用 IntelliJ 對 `template` 這層 package 做 **Refactor → Rename**。或用指令：

```bash
cd BE/SpringBoot/src/main/java/com/penguin
mv template yanduoerp
cd -
grep -rl 'com\.penguin\.template' BE/SpringBoot/src | xargs sed -i '' 's/com\.penguin\.template/com.penguin.yanduoerp/g'
find BE/SpringBoot/src -name 'TemplateApplication*.java' | while read f; do
  sed -i '' 's/TemplateApplication/YanduoerpApplication/g' "$f"
  mv "$f" "$(echo "$f" | sed 's/TemplateApplication/YanduoerpApplication/')"
done
```

> `com.penguin` 是預設 group，可視需要一併改成你自己的。

## 步驟 3：建立 .env 並啟動

```bash
cd Docker
cp .template.env .env        # 填入 JWT_SECRET、POSTGRES 帳密等
docker-compose -f docker-compose-services.yaml up -d
docker-compose -f docker-compose-app.yaml up -d
```

## 預設帳號

`Database/data.sql` 會種入一筆管理者帳號：

- 帳號：`admin@<slug>.com`（例：`admin@yanduoerp.com`）
- 密碼：`admin1234`（BCrypt 雜湊；正式環境請更換）

## 驗證

1. `docker ps` 容器啟動正常。
2. 後端可 build（容器內 `./mvnw clean install`）。
3. 前端可訪問首頁 → 註冊/登入 → 進入儀表板。
