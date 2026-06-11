#!/usr/bin/env node
// 前端 MVVM model scaffolding：產生 app/composables/model/use<Model>.ts 與 types/<Model>.d.ts。
// 純 Node 內建模組，免 npm install。
//
// 用法：
//   node .claude/skills/skill-penguin/scripts/create-bff-model.mjs <ModelName> [--resource <plural>]
//
// 範例：
//   node .claude/skills/skill-penguin/scripts/create-bff-model.mjs Product

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SKILL_ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..')
const ASSETS = path.join(SKILL_ROOT, 'assets', 'bff-template')

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
    console.error('❌ 缺少 ModelName。用法：create-bff-model.mjs <ModelName> [--resource <plural>]')
    process.exit(1)
}

const Model = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1)
const model = Model.toLowerCase()
function pluralize(w) {
    if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies'
    if (/(s|x|z|ch|sh)$/.test(w)) return w + 'es'
    return w + 's'
}
const resource = args.resource || pluralize(model)

const MANIFEST = [
    { tmpl: 'model/useModel.ts', out: `FE/Nuxt/app/composables/model/use${Model}.ts` },
    { tmpl: 'types/Model.d.ts', out: `FE/Nuxt/types/${Model}.d.ts` },
]

function render(content) {
    return content
        .split('__Model__').join(Model)
        .split('__model__').join(model)
        .split('__resource__').join(resource)
}

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

console.log(`\n🐧 bff-model：use${Model}（/api/${resource}）`)
if (created.length) {
    console.log('\n✅ 已產生：')
    created.forEach((f) => console.log(`   + ${f}`))
}
if (skipped.length) {
    console.log('\n⏭️  已存在，略過：')
    skipped.forEach((f) => console.log(`   = ${f}`))
}
console.log('\n📌 Post-steps（待補）：')
console.log(`   1. types/${Model}.d.ts 的欄位需對應後端 ${Model}DTO（範例只示範 name）。`)
console.log(`   2. MVVM 鐵則：page 的 <script> 不可直接 fetch，一律透過 use${Model}() 取/改資料。`)
console.log(`   3. 需先用 bff-api 產生 /api/${resource} 路由，此 model 才有後端可打。\n`)
