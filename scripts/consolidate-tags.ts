/**
 * One-shot migration: collapse ~180 freeform tags into 10 canonical tags.
 * Usage: bun scripts/consolidate-tags.ts [--dry]
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const CANONICAL = [
  'typescript',
  'javascript',
  'runtimes',
  'tooling',
  'frameworks',
  'css',
  'ai',
  'security',
  'performance',
  'ecosystem',
] as const

type Canonical = (typeof CANONICAL)[number]

// Display priority: first tag becomes the article badge.
const PRIORITY: Canonical[] = ['security', 'ai', 'css', 'runtimes', 'frameworks', 'tooling', 'typescript', 'performance', 'javascript', 'ecosystem']

const MAP: Record<string, Canonical | null> = {
  // typescript
  'typescript': 'typescript', 'ts': 'typescript', 'go': 'typescript', 'project-corsa': 'typescript', 'project corsa': 'typescript',
  // javascript / web platform
  'javascript': 'javascript', 'webdev': 'javascript', 'web': 'javascript', 'web development': 'javascript', 'dom': 'javascript',
  'browser': 'javascript', 'frontend': 'javascript', 'temporal-api': 'javascript', 'numpy': 'javascript',
  'scientific-computing': 'javascript', 'library': 'javascript',
  // runtimes
  'runtime': 'runtimes', 'runtimes': 'runtimes', 'nodejs': 'runtimes', 'node.js': 'runtimes', 'node': 'runtimes',
  'deno': 'runtimes', 'bun': 'runtimes', 'quickbeam': 'runtimes', 'beam': 'runtimes', 'erlang': 'runtimes',
  'elixir': 'runtimes', 'otp': 'runtimes', 'v8': 'runtimes', 'webassembly': 'runtimes', 'wasm': 'runtimes',
  'streams': 'runtimes', 'async-iteration': 'runtimes', 'http': 'runtimes', 'browser-automation': 'runtimes',
  // tooling
  'tooling': 'tooling', 'vite': 'tooling', 'rolldown': 'tooling', 'oxc': 'tooling', 'swc': 'tooling',
  'compiler': 'tooling', 'build-tools': 'tooling', 'bundler': 'tooling', 'turbopack': 'tooling',
  'turborepo': 'tooling', 'monorepo': 'tooling', 'eslint': 'tooling', 'rust': 'tooling', 'voidzero': 'tooling',
  'developer-tools': 'tooling', 'ide': 'tooling', 'webstorm': 'tooling', 'jetbrains': 'tooling',
  'intellij idea': 'tooling', 'parcel': 'tooling', 'cli': 'tooling', 'electron': 'tooling', 'tauri': 'tooling',
  'markdown': 'tooling', 'mlir': 'tooling', 'knip': 'tooling',
  // frameworks
  'framework': 'frameworks', 'frameworks': 'frameworks', 'astro': 'frameworks', 'vue': 'frameworks',
  'vue 3': 'frameworks', 'vapor mode': 'frameworks', 'nuxt': 'frameworks', 'next.js': 'frameworks',
  'nextjs': 'frameworks', 'react': 'frameworks', 'svelte': 'frameworks', 'sveltekit': 'frameworks',
  'fresh': 'frameworks', 'inertia.js': 'frameworks', 'nitro': 'frameworks', 'spa': 'frameworks',
  'ssr': 'frameworks', 'router': 'frameworks', 'reactivity': 'frameworks', 'alien-signals': 'frameworks',
  'tanstack': 'frameworks', 'local-first': 'frameworks', 'database': 'frameworks', 'sqlite': 'frameworks',
  'rails': 'frameworks', 'laravel': 'frameworks', 'django': 'frameworks', 'cms': 'frameworks',
  'wordpress': 'frameworks', 'vinext': 'frameworks', 'i18n': 'frameworks', 'images': 'frameworks',
  'websocket': 'frameworks', 'view-transitions': 'css', 'server': 'frameworks',
  // css / design
  'css': 'css', 'layout': 'css', 'typography': 'css', 'accessibility': 'css',
  // ai
  'ai': 'ai', 'ai agents': 'ai', 'ai-agents': 'ai', 'agents': 'ai', 'claude-code': 'ai', 'copilot': 'ai',
  'cursor': 'ai', 'anthropic': 'ai', 'openclaw': 'ai', 'hermes-agent': 'ai', 'nousresearch': 'ai',
  'coding-tools': 'ai', 'coding-agents': 'ai', 'machine learning': 'ai', 'moonshot': 'ai', 'kimi': 'ai',
  'opencode': 'ai', 'rivet': 'ai',
  // security
  'security': 'security', 'supply-chain': 'security', 'zero-day': 'security', 'vulnerabilities': 'security',
  'cybersecurity': 'security', 'cve': 'security', 'tls': 'security', 'sandbox': 'security', 'crypto': 'security',
  'privacy': 'security', 'data privacy': 'security', 'decompilation': 'security', 'jsir': 'security',
  'project glasswing': 'security',
  // performance
  'performance': 'performance', 'benchmark': 'performance', 'jetstream': 'performance', 'webkit': 'performance',
  // ecosystem / industry
  'ecosystem': 'ecosystem', 'npm': 'ecosystem', 'open source': 'ecosystem', 'open-source': 'ecosystem',
  'vercel': 'ecosystem', 'cloudflare': 'ecosystem', 'microsoft': 'ecosystem', 'google': 'ecosystem',
  'github': 'ecosystem', 'netlify': 'ecosystem', 'survey': 'ecosystem', 'state-of-js': 'ecosystem',
  'state of js': 'ecosystem', 'news': 'ecosystem', 'analysis': 'ecosystem', 'rankings': 'ecosystem',
  'licensing': 'ecosystem', 'controversy': 'ecosystem', 'infrastructure': 'ecosystem', 'deployment': 'ecosystem',
  'openjs': 'ecosystem', 'self-hosted': 'ai',
  // English leftovers
  'formatter': 'tooling', 'linting': 'tooling', 'opentelemetry': 'tooling', 'static-sites': 'frameworks',
  // French
  'agents ia': 'ai', 'agents-ia': 'ai', 'ia': 'ai', 'analyse': 'ecosystem', 'api-temporelle': 'javascript',
  'auto-hébergé': 'ai', 'calcul-scientifique': 'javascript', 'compilateur': 'tooling', 'décompilation': 'security',
  'enquête': 'ecosystem', 'navigateur': 'javascript', 'outillage': 'tooling', 'réactivité': 'frameworks',
  'sécurité': 'security', 'sites-statiques': 'frameworks', 'vie privée': 'security', 'écosystème': 'ecosystem',
  // German
  'datenschutz': 'security', 'dekompilierung': 'security', 'ki': 'ai', 'ki-agenten': 'ai', 'leistung': 'performance',
  'reaktivität': 'frameworks', 'selbst-gehostet': 'ai', 'sicherheit': 'security', 'umfrage': 'ecosystem',
  'werkzeuge': 'tooling', 'wissenschaftliches-rechnen': 'javascript', 'ökosystem': 'ecosystem',
  // dropped entirely (noise)
  'release': null, 'tags:': null,
}

const dry = process.argv.includes('--dry')
const root = join(import.meta.dirname, '..')
const unknown = new Map<string, string[]>()
let changed = 0

for (const locale of ['en', 'fr', 'de']) {
  const dir = join(root, 'content', locale, 'articles')
  for (const file of readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const path = join(dir, file)
    const src = readFileSync(path, 'utf8')
    const fmEnd = src.indexOf('\n---', 4)
    if (!src.startsWith('---') || fmEnd === -1) continue
    const fm = src.slice(0, fmEnd + 4)

    // Capture the whole tags block: inline array (possibly multiline) or dash list.
    const tagsBlock = fm.match(/^tags:\s*(\[[\s\S]*?\]|(?:\s*\n(?:\s+-\s+.*\n?)+))/m)
    if (!tagsBlock) continue

    const rawTags = [...tagsBlock[1].matchAll(/["']([^"']+)["']|-\s+(.+?)\s*$|(?:\[|,)\s*([^\s"',[\]]+)/gm)]
      .map(m => (m[1] ?? m[2] ?? m[3] ?? '').trim().replace(/["',]/g, ''))
      .filter(Boolean)

    const mapped: Canonical[] = []
    for (const tag of rawTags) {
      const key = tag.toLowerCase()
      const canonical = key in MAP ? MAP[key] : undefined
      if (canonical === undefined) {
        if (!unknown.has(key)) unknown.set(key, [])
        unknown.get(key)!.push(`${locale}/${file}`)
        continue
      }
      if (canonical && !mapped.includes(canonical)) mapped.push(canonical)
    }

    const final = mapped.sort((a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b)).slice(0, 3)
    if (!final.length) final.push('ecosystem')

    const newLine = `tags: [${final.map(t => `"${t}"`).join(', ')}]`
    const newFm = fm.replace(tagsBlock[0], `${newLine}\n`).replace(/\n\n+(?=[a-zA-Z]+:|---)/g, '\n')
    if (newFm !== fm) {
      changed++
      if (!dry) writeFileSync(path, newFm + src.slice(fmEnd + 4))
    }
  }
}

console.log(`${dry ? '[dry] ' : ''}rewrote tags in ${changed} files`)
if (unknown.size) {
  console.log('\nUNKNOWN TAGS (dropped):')
  for (const [tag, files] of [...unknown.entries()].sort()) console.log(`  ${tag}  (${files.length}x, e.g. ${files[0]})`)
}
