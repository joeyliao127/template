#!/usr/bin/env node
// Nuxt BFF scaffolding：在 server/api/<resource>/ 產生 CRUD 代理路由。
// 純 Node 內建模組，免 npm install。
//
// 用法：
//   node .claude/skills/skill-penguin/scripts/create-bff-api.mjs <NameOrResource> [--resource <plural>]
//
// 範例：
//   node .claude/skills/skill-penguin/scripts/create-bff-api.mjs Product        # → server/api/products
//   node .claude/skills/skill-penguin/scripts/create-bff-api.mjs products

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SKILL_ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..')
const ASSETS = path.join(SKILL_ROOT, 'assets', 'bff-template', 'api')

function parseArgs(argv) {
    const out = { _: [], resource: null }
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i]
        if (a === '--resource') out.resource = argv[++i]
        else if (a.startsWith('--resource=')) out.resource = a.slice('--resource='.length)
        else out._.push(a)
    }
    return out
}

const args = parseArgs(process.argv.slice(2))
const nameRaw = args._[0]
if (!nameRaw) {
    console.error('❌ 缺少名稱。用法：create-bff-api.mjs <NameOrResource> [--resource <plural>]')
    process.exit(1)
}

function pluralize(w) {
    if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies'
    if (/(s|x|z|ch|sh)$/.test(w)) return w + 'es'
    return w + 's'
}
const resource = args.resource || pluralize(nameRaw.toLowerCase())

const API = `FE/Nuxt/server/api/${resource}`
const MANIFEST = [
    { tmpl: 'index.get.ts', out: `${API}/index.get.ts` },
    { tmpl: 'index.post.ts', out: `${API}/index.post.ts` },
    { tmpl: 'id.index.get.ts', out: `${API}/[id]/index.get.ts` },
    { tmpl: 'id.index.put.ts', out: `${API}/[id]/index.put.ts` },
    { tmpl: 'id.index.delete.ts', out: `${API}/[id]/index.delete.ts` },
    { tmpl: 'catchall.ts', out: `${API}/[...${resource}].ts` },
]

const render = (content) => content.split('__resource__').join(resource)

const created = []
const skipped = []
for (const item of MANIFEST) {
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

console.log(`\n🐧 bff-api：/api/${resource}`)
if (created.length) {
    console.log('\n✅ 已產生：')
    created.forEach((f) => console.log(`   + ${f}`))
}
if (skipped.length) {
    console.log('\n⏭️  已存在，略過：')
    skipped.forEach((f) => console.log(`   = ${f}`))
}
console.log('\n📌 Post-steps（待補）：')
console.log(`   1. 路由透過 server/utils/backendFetch.ts 代理到後端 /api/${resource}，`)
console.log(`      並自 session 帶上 Bearer token；後端端點需先用 be-entity 產生。`)
console.log(`   2. 若要把後端錯誤碼轉成前端訊息，可在 server/error/ResourceErrorCode.ts`)
console.log(`      新增對應碼，並在路由內用 server/composables/useThrowApiError.ts 丟出。`)
console.log(`   3. 接著用 bff-model 產生前端 model（use<Model>）與型別。\n`)
