/**
 * Generates hero cards (1200x630 og-ready) for every article plus benchmark
 * charts, in the Cursor-derived design language: cream canvas, warm ink,
 * hairline depth, one orange voltage, pastel topic chips.
 *
 * Usage: bun scripts/generate-images.ts
 */
import { Resvg } from '@resvg/resvg-js'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const C = {
  canvas: '#f7f7f4',
  canvasSoft: '#fafaf7',
  card: '#ffffff',
  ink: '#26251e',
  body: '#5a5852',
  muted: '#807d72',
  hairline: '#e6e5e0',
  hairlineStrong: '#cfcdc4',
  orange: '#f54e00',
  peach: '#dfa88f',
  mint: '#9fc9a2',
  blue: '#9fbbe0',
  lavender: '#c0a8dd',
  gold: '#c08532',
  error: '#cf2d56',
}

const TOPIC_ACCENT: Record<string, string> = {
  typescript: C.blue,
  javascript: C.gold,
  runtimes: C.mint,
  tooling: C.peach,
  frameworks: C.lavender,
  css: C.lavender,
  ai: C.peach,
  security: C.error,
  performance: C.gold,
  ecosystem: C.mint,
}

const GLYPH: Record<string, string> = {
  typescript: 'TS',
  javascript: '{ }',
  runtimes: '>_',
  tooling: '<>',
  frameworks: '</>',
  css: '#',
  ai: '*',
  security: '!',
  performance: '%',
  ecosystem: '@',
}

// slug -> [display name, kicker, primary topic]
const HEROES: Record<string, [string, string, string]> = {
  '2026-03-23-claude-code-rise-ai-coding-tool-2026': ['Claude Code', 'AI coding tools', 'ai'],
  '2026-03-23-typescript-7-native-preview-go-compiler': ['TypeScript 7', 'Native preview', 'typescript'],
  '2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark': ['Bun · Node · Deno', 'Runtime benchmark', 'runtimes'],
  '2026-03-25-ai-dev-tool-rankings-march-2026': ['AI Tool Rankings', 'March 2026', 'ai'],
  '2026-03-25-state-of-js-2025-typescript-vite': ['State of JS 2025', 'Survey results', 'ecosystem'],
  '2026-03-26-typescript-6-0-final-javascript-release': ['TypeScript 6.0', 'Release', 'typescript'],
  '2026-03-26-vite-8-rolldown-era': ['Vite 8', 'The Rolldown era', 'tooling'],
  '2026-03-27-state-of-js-2025-typescript-wins': ['State of JS 2025', 'TypeScript wins', 'ecosystem'],
  '2026-03-30--bun-v1-3-11-cron-anthropic': ['Bun 1.3.11', 'Release', 'runtimes'],
  '2026-03-30-astro-6-rust-compiler-cloudflare': ['Astro 6', 'Release', 'frameworks'],
  '2026-03-31--axios-npm-supply-chain-attack': ['Axios', 'Supply chain attack', 'security'],
  '2026-03-31--claude-code-source-leak-analysis': ['Claude Code', 'Source map leak', 'security'],
  '2026-03-31--hermes-agent-vs-openclaw-ai-agent-comparison': ['Hermes vs OpenClaw', 'AI agents', 'ai'],
  '2026-03-31--pretext-chenglou-text-measurement-layout': ['PreText', 'Text layout', 'css'],
  '2026-04-01--rivet-agent-os-in-process-ai-agent-os': ['Rivet Agent OS', 'AI infrastructure', 'ai'],
  '2026-04-01-knip-v6-oxc-parser-performance': ['Knip v6', 'Release', 'tooling'],
  '2026-04-01-numpy-ts-1-2-half-native-performance': ['numpy-ts 1.2', 'NumPy parity', 'javascript'],
  '2026-04-02--github-copilot-ai-training-data-policy': ['GitHub Copilot', 'Training data policy', 'ai'],
  '2026-04-02--intellij-idea-javascript-typescript-free': ['IntelliJ IDEA', 'Free for JS & TS', 'tooling'],
  '2026-04-03--inertia-js-3-0-release-modern-monolith': ['Inertia.js 3.0', 'Release', 'frameworks'],
  '2026-04-03--node-js-march-2026-security-releases': ['Node.js', 'Security releases', 'security'],
  '2026-04-04-next-js-16-2-stable-adapter-api-cross-platform': ['Next.js 16.2', 'Stable', 'frameworks'],
  '2026-04-04-tanstack-db-06-sqlite-persistence-local-first': ['TanStack DB 0.6', 'Local-first', 'frameworks'],
  '2026-04-05--eslint-v10-flat-config-rust-alternatives': ['ESLint v10', 'Release', 'tooling'],
  '2026-04-05--oxc-rust-javascript-toolchain-benchmarks': ['Oxc', 'Toolchain benchmarks', 'tooling'],
  '2026-04-06--nuxt-4-4-vue-router-v5-typed-layout-props-28x-faster-dev-routing': ['Nuxt 4.4', 'Release', 'frameworks'],
  '2026-04-06--typescript-6-last-release-before-go-rewrite': ['TypeScript 6', 'Before the Go era', 'typescript'],
  '2026-04-07--anthropic-project-glasswing-ai-finds-zero-days-faster-than-humans': ['Project Glasswing', 'AI security', 'security'],
  '2026-04-07--deno-2-7-stabilizes-temporal-api-windows-arm-npm-overrides': ['Deno 2.7', 'Temporal stable', 'runtimes'],
  '2026-04-07--emdash-cloudflares-typescript-wordpress-successor': ['EmDash', 'Cloudflare CMS', 'frameworks'],
  '2026-04-08--astro-6-1-sharp-images-smartypants-i18n-fallback-routes': ['Astro 6.1', 'Release', 'frameworks'],
  '2026-04-08--vite-8-stable-seven-patches-in-three-weeks': ['Vite 8', 'Stable', 'tooling'],
  '2026-04-09--state-of-typescript-2026-ecosystem-retrospective': ['State of TypeScript', '2026 retrospective', 'typescript'],
  '2026-04-09--webstorm-2026-1-service-powered-ts-engine-ai-agents': ['WebStorm 2026.1', 'Release', 'tooling'],
  '2026-04-11--google-jsir-mlir-javascript-intermediate-representation': ['Google JSIR', 'JS intermediate rep.', 'security'],
  '2026-04-11--quickbeam-javascript-runtime-beam-vm-elixir-otp': ['QuickBEAM', 'JS on the BEAM VM', 'runtimes'],
  '2026-04-12--jetstream-3-browser-benchmark-2026-overhaul': ['JetStream 3', 'Browser benchmark', 'performance'],
  '2026-04-12--nodejs-25-stream-iter-async-streams': ['Node.js 25', 'Async streams', 'runtimes'],
  '2026-04-13--bun-1-3-12-webview-browser-automation-using-await-using': ['Bun 1.3.12', 'Webview automation', 'runtimes'],
  '2026-04-13--css-text-box-trim-margin-block-vertical-center': ['text-box-trim', 'CSS', 'css'],
  '2026-04-14--turborepo-96-percent-faster-ai-agents-humans': ['Turborepo 2.9', '96% faster', 'tooling'],
  '2026-04-15--vite-plus-alpha-unified-toolchain-open-source': ['Vite+', 'Alpha, open source', 'tooling'],
  '2026-04-16--swc-v1-15-26-rust-javascript-compiler': ['SWC 1.15', 'Release', 'tooling'],
  '2026-04-16--vue-3-6-beta-vapor-mode-alien-signals': ['Vue 3.6 Beta', 'Vapor Mode', 'frameworks'],
  '2026-04-17--svelte-march-2026-context-html-comments-error-boundaries': ['Svelte', 'March 2026 updates', 'frameworks'],
  '2026-04-17--typescript-6-0-bridge-to-go-native': ['TypeScript 6.0', 'Bridge to native', 'typescript'],
  '2026-04-18--next-js-16-3-0-canary-prefetch-cache-dev-overlay': ['Next.js 16.3', 'Canary', 'frameworks'],
  '2026-04-18--oxc-v0-126-turbopack-magic-comments-allocator-breaking': ['Oxc 0.126', 'Release', 'tooling'],
  '2026-04-19--bun-joins-anthropic-ai-coding-infrastructure': ['Bun + Anthropic', 'Acquisition', 'ai'],
  '2026-04-19--opencode-desktop-electron-tauri-typescript': ['OpenCode Desktop', 'Release', 'ai'],
  '2026-04-20--astro-6-1-8-critical-filename-bug-netlify-security': ['Astro 6.1.8', 'Critical fix', 'security'],
  '2026-04-20--nitro-v3-beta-tracing-dep-tracing-vercel-queues': ['Nitro v3 Beta', 'Tracing', 'frameworks'],
  '2026-06-01--astro-6-4-rust-satteri-markdown-optimizer': ['Astro 6.4', 'Release', 'frameworks'],
  '2026-06-01--deno-2-8-audit-fix-ci-pack-subcommands': ['Deno 2.8', 'Release', 'runtimes'],
  '2026-06-02--oxc-v0-134-oxlint-1-68-oxfmt-0-53-vue-typescript-rules': ['Oxc 0.134', 'Release', 'tooling'],
  '2026-06-02--turborepo-v2-9-16-heap-allocation-profiling-pnpm-fixes': ['Turborepo 2.9.16', 'Release', 'tooling'],
  '2026-06-03--nitro-v3-0-260522-beta-tracing-vfs-vercel-queues': ['Nitro v3 Beta', 'Tracing & VFS', 'frameworks'],
  '2026-06-03--node-js-26-3-0-buffer-pool-permission-drop': ['Node.js 26.3', 'Release', 'runtimes'],
  '2026-06-05--astro-6-4-4-routing-i18n-dev-fixes': ['Astro 6.4.4', 'Patch', 'frameworks'],
  '2026-06-05--rolldown-1-1-0-lazybarrel-default-tsconfig': ['Rolldown 1.1', 'Release', 'tooling'],
  '2026-06-06--npm-supply-chain-attack-red-hat-mini-shai-hulud': ['npm', 'Supply chain attack', 'security'],
  '2026-06-06--state-of-web-dev-ai-2026-survey': ['Web Dev AI 2026', 'Survey', 'ai'],
  '2026-06-07--fresh-2-3-zero-js-view-transitions-websocket': ['Fresh 2.3', 'Zero JS, for real', 'frameworks'],
  '2026-06-07--nitro-v3-260603-beta-custom-framework-commands': ['Nitro v3 Beta', 'Framework commands', 'frameworks'],
  '2026-06-12--kimi-k2-7-code-mimo-code': ['Kimi + MiMo', 'Open-source coding models', 'ai'],
  '2026-06-13--anthropic-fable-mythos-suspended-us-government': ['Fable 5 Suspended', 'US export control', 'security'],
  '2026-06-13--fable-mythos-export-control-deep-dive': ['Fable & Mythos', 'Export control deep dive', 'security'],
  '2026-06-14--esbuild-0-28-1-deno-rce-windows-path-traversal': ['esbuild 0.28.1', 'Deno RCE + using bug', 'security'],
  '2026-06-14--openrouter-fusion-compound-ai-draco': ['OpenRouter Fusion', 'Compound AI + DRACO', 'ai'],
  '2026-06-15--vite-8-1-beta-wasm-esm-chunk-importmap': ['Vite 8.1 Beta', 'WASM ESM + importmap', 'tooling'],
  '2026-06-15--mistral-le-chaton-fat-24-hour-fake-model': ['Le Chaton Fat', 'Meme of the day', 'ai'],
  '2026-06-15--playwright-1-61-webauthn-passkeys-webstorage': ['Playwright 1.61', 'WebAuthn + WebStorage', 'tooling'],
  '2026-06-16--astro-7-0-0-beta-4-satteri-default-advanced-routing': ['Astro 7 Beta', 'Sätteri default + routing', 'frameworks'],
  '2026-06-16--deno-desktop-subcommand-wef-cef-browserwindow': ['Deno Desktop', 'WEF + BrowserWindow', 'runtimes'],
  '2026-06-16--staan-european-search-api-deep-dive': ['Staan', 'European search API', 'ai'],
  '2026-06-16--spacex-acquires-cursor-60-billion-deep-dive': ['SpaceX · Cursor', '$60bn acquisition', 'ai'],
  '2026-06-16--glm-5-2-long-horizon-deep-dive': ['GLM-5.2', 'Z.ai 1M context, MIT', 'ai'],
  '2026-06-17--google-cloud-okf-open-knowledge-format-deep-dive': ['Open Knowledge Format', 'Google Cloud spec, v0.1', 'ai'],
  '2026-06-17--pnpm-11-7-frozen-store-publish-batch': ['pnpm 11.7', 'Frozen store + lockfile fix', 'tooling'],
  '2026-06-18--openai-codex-0-141-noise-relay-cross-platform-exec': ['Codex 0.141', 'Noise relay + cross-OS exec', 'ai'],
  '2026-06-18--typephp-swoole-aot-native-binary-php': ['TypePHP', 'Swoole AOT renamed, native binary', 'runtimes'],
  '2026-06-18--node-js-june-2026-security-releases': ['Node.js', 'June 2026 security release', 'security'],
  '2026-06-19--react-router-v8-major-release-future-flags-esm': ['React Router v8', 'Major release: future flags graduate', 'frameworks'],
  '2026-06-19--pnpm-11-8-dry-run-install-node-package-map-sbom': ['pnpm 11.8', 'Dry-run + package maps + SBOM', 'tooling'],
  '2026-06-20--typescript-7-0-rc-go-compiler-10x-faster': ['TypeScript 7.0 RC', 'Go compiler, ~10x faster', 'typescript'],
  '2026-06-20--astro-7-0-0-beta-6-stable-cache-jsx-whitespace': ['Astro 7 Beta', 'Stable cache + JSX default', 'frameworks'],
  '2026-06-21--bun-react-compiler-bundler-integration-20x': ['Bun', 'React Compiler, ~20x faster', 'tooling'],
  '2026-06-22--oxc-v0-137-react-compiler-treeshake-perf': ['Oxc v0.137', 'Minifier treeshake + React Compiler fix', 'tooling'],
  '2026-06-22--sakana-fugu-multi-agent-orchestration-frontier': ['Sakana Fugu', 'Multi-agent orchestration', 'ai'],
  '2026-06-22--astro-7-stable-vite8-rust-compiler-ai-agents': ['Astro 7.0.0', 'Stable · Vite 8 · AI dev server', 'frameworks'],
  '2026-06-23--oxlint-v1-71-oxfmt-v0-56': ['Oxlint v1.71 · Oxfmt v0.56', 'Bucketed dispatch + v0.137 pickup', 'tooling'],
  '2026-06-23--swc-v1-15-43-react-compiler-template-literal-bug': ['SWC v1.15.43', 'React Compiler + template-literal fix', 'tooling'],
  '2026-06-24--node-js-24-18-krypton-lts-buffer-pool-turboshake': ['Node.js 24.18.0', 'Krypton LTS · Web Crypto + Buffer', 'runtimes'],
  '2026-06-25--node-js-26-4-current-vfs-loader-package-maps': ['Node.js 26.4.0', 'Current · node:vfs + loader maps', 'runtimes'],
  '2026-06-25--anthropic-alibaba-qwen-claude-distillation': ['Anthropic · Alibaba', 'Claude distillation, 28.8M exchanges', 'ai'],
  '2026-06-24--vite-8-1-stable-bundled-dev-mode': ['Vite 8.1', 'Bundled dev + WASM ESM', 'tooling'],
  '2026-06-26--deno-2-9-cold-start-supply-chain-tests': ['Deno 2.9', 'Cold start + supply chain', 'runtimes'],
  '2026-06-27--openai-codex-0-142-token-budgets-multi-agent-web-search': ['Codex 0.142', 'Token budgets + multi-agent', 'ai'],
  '2026-06-27--cline-4-0-sdk-rewrite-clinepass-customize-marketplace-plugins': ['Cline 4.0', 'SDK rewrite + ClinePass', 'ai'],
  '2026-06-28--prettier-3-9-micromark-yaml-graphql-rust-flow-parser': ['Prettier 3.9', 'Five parser upgrades', 'tooling'],
  '2026-06-29--cline-4-0-1-rollback-sdk-migration-v4-0-2-restores': ['Cline 4.0.1 · 4.0.2', 'Rollback + SDK return', 'ai'],
  '2026-06-30--oxlint-v1-72-oxfmt-v0-57-ast-builder-css-graphql-native': ['Oxlint · Oxfmt', 'v1.72 · v0.57 · AstBuilder + CSS', 'tooling'],
  '2026-06-30--npm-11-18-linked-install-strategy-stable-phantom-deps': ['npm 11.18', 'Linked strategy stable', 'ecosystem'],
  '2026-07-01--claude-sonnet-5-default-model-claude-code-1m-context': ['Claude Sonnet 5', 'Default in Claude Code', 'ai'],
  '2026-07-01--fastify-v5-9-0-security-perf-http2-buffer-chunking': ['Fastify v5.9.0', 'Security, perf, TSTyche', 'runtimes'],
  '2026-07-02--claude-code-2-1-198-chrome-ga-background-agents-auto-pr': ['Claude Code 2.1.198', 'Chrome GA · auto-PR · /dataviz', 'ai'],
  'cursor-composer-2-kimi-k25': ['Composer 2 + Kimi', 'AI models', 'ai'],
  'vinext-cloudflare-vercel': ['vinext', 'Next.js on Vite', 'frameworks'],
  'vite-plus-unified-toolchain': ['Vite+', 'Unified toolchain', 'tooling'],
  'vue-35-major-improvements': ['Vue 3.5', 'Deep dive', 'frameworks'],
  // specific heroes referenced from rewritten articles
  'numpy-ts-1-2': ['numpy-ts 1.2', 'NumPy parity', 'javascript'],
}

const SANS = `'Helvetica Neue', Helvetica, Arial, sans-serif`
const MONO = `Menlo, monospace`

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function heroSvg(name: string, kicker: string, topic: string): string {
  const accent = TOPIC_ACCENT[topic] ?? C.peach
  const glyph = GLYPH[topic] ?? '*'
  const nameSize = name.length > 16 ? 84 : name.length > 11 ? 104 : 124
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${C.canvas}"/>
  <!-- faint grid -->
  ${Array.from({ length: 13 }, (_, i) => `<line x1="${100 * i}" y1="0" x2="${100 * i}" y2="630" stroke="${C.hairline}" stroke-width="1" opacity="0.55"/>`).join('')}
  ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${105 * i}" x2="1200" y2="${105 * i}" stroke="${C.hairline}" stroke-width="1" opacity="0.55"/>`).join('')}
  <!-- oversized topic glyph -->
  <text x="1090" y="500" text-anchor="end" font-family="${MONO}" font-size="430" fill="${accent}" opacity="0.28">${esc(glyph)}</text>
  <!-- frame -->
  <rect x="36" y="36" width="1128" height="558" fill="none" stroke="${C.hairlineStrong}" stroke-width="1.5"/>
  <!-- kicker pill -->
  <rect x="84" y="96" width="${kicker.length * 11.5 + 44}" height="40" rx="20" fill="${accent}"/>
  <text x="${84 + (kicker.length * 11.5 + 44) / 2}" y="122" text-anchor="middle" font-family="${SANS}" font-size="17" font-weight="600" letter-spacing="2" fill="${C.ink}">${esc(kicker.toUpperCase())}</text>
  <!-- headline -->
  <text x="82" y="368" font-family="${SANS}" font-size="${nameSize}" font-weight="400" letter-spacing="-3" fill="${C.ink}">${esc(name)}</text>
  <!-- baseline rule -->
  <line x1="84" y1="412" x2="520" y2="412" stroke="${C.orange}" stroke-width="4"/>
  <!-- wordmark -->
  <text x="84" y="540" font-family="${SANS}" font-size="30" font-weight="600" letter-spacing="-0.5" fill="${C.ink}">typescript<tspan fill="${C.orange}">.news</tspan></text>
  <text x="1116" y="540" text-anchor="end" font-family="${MONO}" font-size="19" fill="${C.muted}">daily web platform news</text>
</svg>`
}

interface Bar { label: string, value: number, display: string, accent?: string }
function chartSvg(title: string, subtitle: string, bars: Bar[], source: string, unitNote: string): string {
  const W = 1200
  const top = 178
  const rowH = 86
  const H = top + bars.length * rowH + 96
  const maxV = Math.max(...bars.map(b => b.value))
  const barMax = 760
  const rows = bars.map((b, i) => {
    const y = top + i * rowH
    const w = Math.max(10, (b.value / maxV) * barMax)
    const color = b.accent ?? C.ink
    return `
    <text x="84" y="${y + 24}" font-family="${SANS}" font-size="24" font-weight="600" fill="${C.ink}">${esc(b.label)}</text>
    <rect x="84" y="${y + 38}" width="${barMax}" height="26" fill="${C.canvasSoft}" stroke="${C.hairline}"/>
    <rect x="84" y="${y + 38}" width="${w}" height="26" fill="${color}"/>
    <text x="${84 + barMax + 22}" y="${y + 58}" font-family="${MONO}" font-size="22" fill="${C.ink}">${esc(b.display)}</text>`
  }).join('')
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${C.canvas}"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="${C.card}" stroke="${C.hairline}" stroke-width="1.5"/>
  <text x="84" y="96" font-family="${SANS}" font-size="40" font-weight="400" letter-spacing="-1" fill="${C.ink}">${esc(title)}</text>
  <text x="84" y="132" font-family="${SANS}" font-size="21" fill="${C.body}">${esc(subtitle)}</text>
  ${rows}
  <text x="84" y="${H - 56}" font-family="${MONO}" font-size="17" fill="${C.muted}">${esc(unitNote)}</text>
  <text x="${W - 84}" y="${H - 56}" text-anchor="end" font-family="${MONO}" font-size="17" fill="${C.muted}">${esc(source)}</text>
</svg>`
}

function render(svg: string, out: string, width: number) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true, defaultFontFamily: 'Helvetica Neue' },
  })
  writeFileSync(out, resvg.render().asPng())
}

const root = join(import.meta.dirname, '..')
const heroDir = join(root, 'public/images/heroes')
const chartDir = join(root, 'public/images/charts')
mkdirSync(heroDir, { recursive: true })
mkdirSync(chartDir, { recursive: true })

for (const [slug, [name, kicker, topic]] of Object.entries(HEROES)) {
  render(heroSvg(name, kicker, topic), join(heroDir, `${slug}.png`), 1200)
}
console.log(`heroes: ${Object.keys(HEROES).length}`)

const charts: Array<[string, string, string, Bar[], string, string]> = [
  ['numpy-ts-performance', 'NumPy vs numpy-ts, honestly', 'Average relative op time across the validated suite — lower is better', [
    { label: 'NumPy (C / BLAS)', value: 1, display: '1x', accent: C.mint },
    { label: 'numpy-ts 1.2 (pure TypeScript)', value: 15, display: '~15x slower', accent: C.gold },
  ], 'source: author benchmarks (HN, numpyts.dev)', 'relative time, baseline = native NumPy'],

  ['typescript-native-compile', 'Compiling the VS Code codebase', 'TypeScript compiler, TS 5.8 (JS) vs TS 7 native preview (Go)', [
    { label: 'tsc 5.8 (JavaScript)', value: 77.8, display: '77.8 s', accent: C.gold },
    { label: 'TS 7 native preview (Go)', value: 7.5, display: '7.5 s — 10.4x faster', accent: C.mint },
  ], 'source: Microsoft TypeScript team', 'full type-check, seconds — lower is better'],

  ['vinext-build', 'vinext vs Next.js 16: build time', 'Same 33-route App Router app — client bundles also shrink 57% (72.9 KB vs 168.9 KB)', [
    { label: 'Next.js 16 (Turbopack)', value: 7.38, display: '7.38 s', accent: C.gold },
    { label: 'vinext (Vite + Rolldown)', value: 1.67, display: '1.67 s — 4.4x faster', accent: C.mint },
  ], 'source: blog.cloudflare.com/vinext — "directional, not definitive"', 'production build, seconds — lower is better'],

  ['turborepo-time-to-first-task', 'Turborepo 2.9: time to first task', 'Measured range across open and closed source Turborepos — scales with repo size', [
    { label: 'Smallest measured improvement', value: 81, display: '81% faster', accent: C.blue },
    { label: 'Largest measured improvement', value: 96, display: '96% faster', accent: C.mint },
  ], 'source: vercel.com — Turborepo 2.9 release', 'reduction in time before the first task starts'],

  ['glasswing-benchmarks', 'Claude Mythos Preview vs Opus 4.6', 'Security-relevant benchmarks from the Glasswing announcement', [
    { label: 'CyberGym — Mythos Preview', value: 83.1, display: '83.1%', accent: C.error },
    { label: 'CyberGym — Opus 4.6', value: 66.6, display: '66.6%', accent: C.hairlineStrong },
    { label: 'SWE-bench Verified — Mythos', value: 94.6, display: '94.6%', accent: C.error },
    { label: 'SWE-bench Verified — Opus 4.6', value: 91.3, display: '91.3%', accent: C.hairlineStrong },
  ], 'source: anthropic.com/glasswing', 'score, higher is better'],
]

for (const [file, title, subtitle, bars, source, note] of charts) {
  render(chartSvg(title, subtitle, bars, source, note), join(chartDir, `${file}.png`), 1200)
}
console.log(`charts: ${charts.length}`)

// site-wide default og card
const defaultOg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${C.canvas}"/>
  ${Array.from({ length: 13 }, (_, i) => `<line x1="${100 * i}" y1="0" x2="${100 * i}" y2="630" stroke="${C.hairline}" stroke-width="1" opacity="0.55"/>`).join('')}
  ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${105 * i}" x2="1200" y2="${105 * i}" stroke="${C.hairline}" stroke-width="1" opacity="0.55"/>`).join('')}
  <rect x="36" y="36" width="1128" height="558" fill="none" stroke="${C.hairlineStrong}" stroke-width="1.5"/>
  <circle cx="980" cy="180" r="26" fill="${C.peach}"/>
  <circle cx="1044" cy="180" r="26" fill="${C.mint}"/>
  <circle cx="980" cy="244" r="26" fill="${C.blue}"/>
  <circle cx="1044" cy="244" r="26" fill="${C.lavender}"/>
  <text x="82" y="350" font-family="${SANS}" font-size="96" font-weight="400" letter-spacing="-3" fill="${C.ink}">typescript<tspan fill="${C.orange}">.news</tspan></text>
  <line x1="84" y1="396" x2="520" y2="396" stroke="${C.orange}" stroke-width="4"/>
  <text x="84" y="470" font-family="${SANS}" font-size="30" fill="${C.body}">Daily TypeScript, JavaScript, and web platform news</text>
  <text x="84" y="540" font-family="${MONO}" font-size="19" fill="${C.muted}">en · fr · de — rss available</text>
</svg>`
render(defaultOg, join(root, 'public/og-default.png'), 1200)
console.log('default og card')
