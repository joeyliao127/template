#!/usr/bin/env node
// init-template：把此 template 初始化為新專案。
// 用法：node .claude/commands/init-template.mjs <ProjectName> <description...>
//   - <ProjectName> 為品牌顯示名（可含大寫），會自動推導小寫 slug
//   - 其餘參數視為專案描述（用於 README）

import fs from 'node:fs'
import path from 'node:path'
import { randomBytes } from 'node:crypto'

const RED = '\x1b[31m', GREEN = '\x1b[32m', CYAN = '\x1b[36m', DIM = '\x1b[2m', R = '\x1b[0m'
const die = (m) => { console.error(`${RED}✗ ${m}${R}`); process.exit(1) }
const ok = (m) => console.log(`${GREEN}✓${R} ${m}`)

const argv = process.argv.slice(2)
const display = (argv[0] || '').trim()
const description = argv.slice(1).join(' ').trim()
if (!display) die('用法：node .claude/commands/init-template.mjs <ProjectName> <description>')

const root = process.cwd()
// 1) 確認在專案根目錄
for (const f of ['Docker/.template.env', 'BE/SpringBoot/pom.xml', 'FE/Nuxt/nuxt.config.ts']) {
    if (!fs.existsSync(path.join(root, f))) die(`請在專案根目錄執行（找不到 ${f}）`)
}

// 2) 推導並驗證 slug（machine 用：Docker Compose 專案名、GHCR repo、PG、域名…皆須全小寫）
const slug = display
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
if (!/^[a-z][a-z0-9_-]*$/.test(slug)) {
    die(`無法從 "${display}" 推導出合法 slug（需可化為 ^[a-z][a-z0-9_-]*$，例如以字母開頭、全小寫）`)
}
// Java 主類名（PascalCase，從 slug 推導以確保合法識別字）
const pascal = slug.split(/[-_]+/).filter(Boolean).map((s) => s[0].toUpperCase() + s.slice(1)).join('')
const appClass = `${pascal}Application`

console.log(`${CYAN}init-template${R}  display=${display}  slug=${slug}  class=${appClass}`)

// 3) Java package 改名（檔案系統搬移）：com.penguin.template → com.penguin.<slug>
const moveDir = (base) => {
    const from = path.join(root, base, 'template')
    const to = path.join(root, base, slug)
    if (fs.existsSync(from)) fs.renameSync(from, to)
}
const beMain = 'BE/SpringBoot/src/main/java/com/penguin'
const beTest = 'BE/SpringBoot/src/test/java/com/penguin'
moveDir(beMain)
moveDir(beTest)
const moveFile = (dir, from, to) => {
    const f = path.join(dir, from)
    if (fs.existsSync(f)) fs.renameSync(f, path.join(dir, to))
}
moveFile(path.join(root, beMain, slug), 'TemplateApplication.java', `${appClass}.java`)
moveFile(path.join(root, beTest, slug), 'TemplateApplicationTests.java', `${appClass}Tests.java`)
ok(`Java package 改名 → com.penguin.${slug}（主類 ${appClass}）`)

// 4) 全專案文字替換（含原始碼、設定、文件範例路徑）
const EXCLUDE_DIRS = new Set(['.git', 'node_modules', '.nuxt', 'target', 'dist', '.output', '.idea'])
const BIN_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.pem', '.woff', '.woff2', '.ttf', '.eot', '.pdf', '.lock'])
const SELF_DIR = path.join('.claude', 'commands') // 避免改到自己這支腳本
const rules = [
    [/__PROJECT_DISPLAY__/g, display],
    [/__PROJECT_NAME__/g, slug],
    [/com\.penguin\.template/g, `com.penguin.${slug}`],
    [/com\/penguin\/template/g, `com/penguin/${slug}`],
    [/TemplateApplication/g, appClass],
]
let changed = 0
const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const fp = path.join(dir, ent.name)
        const rel = path.relative(root, fp)
        if (ent.isDirectory()) {
            if (EXCLUDE_DIRS.has(ent.name) || rel === SELF_DIR) continue
            walk(fp)
        } else if (ent.isFile()) {
            if (BIN_EXT.has(path.extname(ent.name).toLowerCase())) continue
            let txt
            try { txt = fs.readFileSync(fp, 'utf8') } catch { continue }
            if (txt.includes('\x00')) continue // 跳過二進位檔
            let out = txt
            for (const [re, val] of rules) out = out.replace(re, val)
            if (out !== txt) { fs.writeFileSync(fp, out); changed++ }
        }
    }
}
walk(root)
ok(`替換佔位符與 package 參照（${changed} 個檔案）`)

// 5) pom.xml artifactId / name
const pom = path.join(root, 'BE/SpringBoot/pom.xml')
fs.writeFileSync(pom, fs.readFileSync(pom, 'utf8')
    .replace('<artifactId>template</artifactId>', `<artifactId>${slug}</artifactId>`)
    .replace('<name>template</name>', `<name>${slug}</name>`))
ok(`pom.xml → ${slug}`)

// 6) 產生專案 README
const readme = `# ${display}

${description || 'TODO: 補上專案描述'}

採用前後端分離 + BFF 安全閘道架構，內建使用者註冊／登入（JWT + Spring Security），全部以 Docker Compose 運行。

## 預設帳號

由 \`Database/data.sql\` 種入一筆管理者帳號：

- 帳號：\`admin@${slug}.com\`
- 密碼：\`admin1234\`

## 技術總覽

- 前端：Nuxt 4（SSR + Server Routes BFF）、Nuxt UI、Tailwind CSS、i18n
- 後端：Spring Boot（Controller / Service / Repository 三層）
- 認證：JWT + Spring Security
- 資料庫：PostgreSQL（原生 JDBC，\`NamedParameterJdbcTemplate\`）
- 快取／Session：Redis
- 開發環境：Docker Compose

## 快速開始

\`\`\`bash
cd Docker
cp .template.env .env          # 填入 JWT_SECRET 等
docker-compose -f docker-compose-services.yaml up -d
docker-compose -f docker-compose-app.yaml up -d
\`\`\`

## 開發慣例

- **MVVM**：禁止在 \`.vue\` 的 script 直接 fetch，一律透過 \`composables/model/\` 的 composable。
- 後端資料存取使用原生 JDBC（非 JPA）。
- 新增 entity 可用 \`.claude/skills/skill-penguin\` 的 scaffolding skill，以 \`User\` 為藍本產生後端三層 + BFF API + MVVM model。
`
fs.writeFileSync(path.join(root, 'README.md'), readme)
ok('產生 README.md')

// 7) 建立 Docker/.env 並產生新的 JWT_SECRET（startup.sh 開箱即用）
const envTemplate = path.join(root, 'Docker/.template.env')
const envFile = path.join(root, 'Docker/.env')
if (fs.existsSync(envTemplate) && !fs.existsSync(envFile)) {
    const secret = randomBytes(32).toString('base64')
    const env = fs.readFileSync(envTemplate, 'utf8').replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`)
    fs.writeFileSync(envFile, env)
    ok('建立 Docker/.env 並產生新的 JWT_SECRET')
} else if (fs.existsSync(envFile)) {
    ok('Docker/.env 已存在，略過（保留你的設定）')
}

// 8) 移除 template 專用檔（新專案不需要）：TEMPLATE.md + 此 init-template 指令
const removeIfExists = (rel) => {
    const fp = path.join(root, rel)
    if (fs.existsSync(fp)) { fs.rmSync(fp, { recursive: true, force: true }); ok(`移除 ${rel}`) }
}
removeIfExists('TEMPLATE.md')
removeIfExists('.claude/commands/init-template.md')
removeIfExists('.claude/commands/init-template.mjs')
// 若 commands 目錄已空則一併移除
try {
    const cmdDir = path.join(root, '.claude', 'commands')
    if (fs.existsSync(cmdDir) && fs.readdirSync(cmdDir).length === 0) fs.rmdirSync(cmdDir)
} catch { /* ignore */ }

console.log(`\n${GREEN}完成${R}：${display} ${DIM}(slug: ${slug})${R}`)
console.log(`${DIM}已建立 Docker/.env（含新 JWT_SECRET）。接著可：cd Docker && sh startup.sh${R}`)
console.log(`${DIM}提醒：首次 pnpm install 會重新產生 lockfile；可 git init 重新建立版控。${R}`)
