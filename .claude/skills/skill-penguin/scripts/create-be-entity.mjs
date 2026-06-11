#!/usr/bin/env node
// 後端三層 scaffolding：依 scope 產生 entity / repository / service / controller / domain。
// 純 Node 內建模組（fs / path），免 npm install。
//
// 用法：
//   node .claude/skills/skill-penguin/scripts/create-be-entity.mjs <EntityName> [--scope controller|service|repo] [--resource <plural>]
//
// 範例：
//   node .claude/skills/skill-penguin/scripts/create-be-entity.mjs Product
//   node .claude/skills/skill-penguin/scripts/create-be-entity.mjs Category --scope service --resource categories

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SKILL_ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..')
const ASSETS = path.join(SKILL_ROOT, 'assets', 'be-template')

// ── 參數解析 ──────────────────────────────────────────────
function parseArgs(argv) {
    const out = { _: [], scope: 'controller', resource: null }
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i]
        if (a === '--scope') out.scope = argv[++i]
        else if (a.startsWith('--scope=')) out.scope = a.slice('--scope='.length)
        else if (a === '--resource') out.resource = argv[++i]
        else if (a.startsWith('--resource=')) out.resource = a.slice('--resource='.length)
        else out._.push(a)
    }
    return out
}

const args = parseArgs(process.argv.slice(2))
const EntityRaw = args._[0]
if (!EntityRaw) {
    console.error('❌ 缺少 EntityName。用法：create-be-entity.mjs <EntityName> [--scope controller|service|repo] [--resource <plural>]')
    process.exit(1)
}

const SCOPE_LEVEL = { repo: 0, service: 1, controller: 2 }
if (!(args.scope in SCOPE_LEVEL)) {
    console.error(`❌ 未知 scope：${args.scope}（可用：repo / service / controller）`)
    process.exit(1)
}
const scopeLevel = SCOPE_LEVEL[args.scope]

// ── 命名衍生 ──────────────────────────────────────────────
const ENTITY = EntityRaw.charAt(0).toUpperCase() + EntityRaw.slice(1) // PascalCase
const entity = ENTITY.toLowerCase()                                   // package 區段 / 變數名
function pluralize(w) {
    if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies'
    if (/(s|x|z|ch|sh)$/.test(w)) return w + 'es'
    return w + 's'
}
const resource = args.resource || pluralize(entity)

// ── 動態偵測後端 base package（/init-template 後會是 com.penguin.<slug>）──
const PENGUIN_DIR = path.join(REPO_ROOT, 'BE/SpringBoot/src/main/java/com/penguin')
let slug
try {
    const subdirs = fs.readdirSync(PENGUIN_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
    if (subdirs.length !== 1) {
        console.error(`❌ com/penguin/ 下應只有一個 package 子目錄，實際找到：[${subdirs.join(', ')}]`)
        process.exit(1)
    }
    slug = subdirs[0]
} catch (e) {
    console.error(`❌ 找不到後端 package 目錄：${PENGUIN_DIR}`)
    process.exit(1)
}
const PACKAGE = `com.penguin.${slug}`
const pkgPath = `com/penguin/${slug}`
const BE = `BE/SpringBoot/src/main/java/${pkgPath}`

// ── 範本對應表（scope：repo=0 / service=1 / controller=2）──
const MANIFEST = [
    { tmpl: 'Entity.java.tmpl', out: `${BE}/entity/${ENTITY}.java`, scope: 0 },
    { tmpl: 'RowMapper.java.tmpl', out: `${BE}/repository/rowmapper/${ENTITY}RowMapper.java`, scope: 0 },
    { tmpl: 'Repository.java.tmpl', out: `${BE}/repository/${ENTITY}Repository.java`, scope: 0 },
    { tmpl: 'RepositoryImpl.java.tmpl', out: `${BE}/repository/impl/${ENTITY}RepositoryImpl.java`, scope: 0 },
    { tmpl: 'Condition.java.tmpl', out: `${BE}/domain/${entity}/${ENTITY}Condition.java`, scope: 0 },
    { tmpl: 'DTO.java.tmpl', out: `${BE}/domain/${entity}/${ENTITY}DTO.java`, scope: 1 },
    { tmpl: 'CreateCommand.java.tmpl', out: `${BE}/domain/${entity}/${ENTITY}CreateCommand.java`, scope: 1 },
    { tmpl: 'UpdateCommand.java.tmpl', out: `${BE}/domain/${entity}/${ENTITY}UpdateCommand.java`, scope: 1 },
    { tmpl: 'NotFoundException.java.tmpl', out: `${BE}/domain/${entity}/exception/${ENTITY}NotFoundException.java`, scope: 1 },
    { tmpl: 'Service.java.tmpl', out: `${BE}/service/${ENTITY}Service.java`, scope: 1 },
    { tmpl: 'ServiceImpl.java.tmpl', out: `${BE}/service/impl/${ENTITY}ServiceImpl.java`, scope: 1 },
    { tmpl: 'Controller.java.tmpl', out: `${BE}/controller/${entity}/${ENTITY}Controller.java`, scope: 2 },
    { tmpl: 'ExceptionHandler.java.tmpl', out: `${BE}/domain/${entity}/exception/${ENTITY}ExceptionHandler.java`, scope: 2 },
]

function render(content) {
    return content
        .split('__PACKAGE__').join(PACKAGE)
        .split('__ENTITY__').join(ENTITY)
        .split('__entity__').join(entity)
        .split('__resource__').join(resource)
}

// ── 產生檔案 ──────────────────────────────────────────────
const created = []
const skipped = []
for (const item of MANIFEST) {
    if (item.scope > scopeLevel) continue
    const absOut = path.join(REPO_ROOT, item.out)
    if (fs.existsSync(absOut)) {
        skipped.push(item.out)
        continue
    }
    const tmpl = fs.readFileSync(path.join(ASSETS, item.tmpl), 'utf8')
    fs.mkdirSync(path.dirname(absOut), { recursive: true })
    fs.writeFileSync(absOut, render(tmpl))
    created.push(item.out)
}

// ── 輸出報告 ──────────────────────────────────────────────
console.log(`\n🐧 be-entity：${ENTITY}（scope=${args.scope}，package=${PACKAGE}，resource=${resource}）`)
if (created.length) {
    console.log('\n✅ 已產生：')
    created.forEach((f) => console.log(`   + ${f}`))
}
if (skipped.length) {
    console.log('\n⏭️  已存在，略過：')
    skipped.forEach((f) => console.log(`   = ${f}`))
}
console.log('\n📌 Post-steps（待補）：')
console.log(`   1. 在 Database/schema.sql 建立 ${resource} 資料表（複數命名）。`)
console.log(`   2. 依 schema 補欄位：entity/${ENTITY}.java、${ENTITY}RowMapper、${ENTITY}DTO、`)
console.log(`      ${ENTITY}CreateCommand / ${ENTITY}UpdateCommand / ${ENTITY}Condition，`)
console.log(`      以及 ${ENTITY}RepositoryImpl 的 BASE_SELECT / INSERT / UPDATE / WHERE。`)
console.log(`   3. 範本預設只示範 name 欄位；其餘欄位移除或替換成你的欄位。`)
console.log(`   4. 端點為 /api/${resource}（index 分頁 / getById / create / update / delete）。`)
console.log(`   5. 重新打包：cd BE/SpringBoot && make re\n`)
