/**
 * Real-time indexing push for newly published articles.
 *
 * Finds every article published within a rolling window (default 48h) across
 * all locales, then:
 *   1. Pushes each article URL to the Google Indexing API (URL_UPDATED).
 *   2. Pings the WebSub/PubSubHubbub hub for each locale RSS feed.
 *
 * Designed for a git/deploy publishing flow: run it as the last step of your
 * deploy pipeline or from the daily publish cron, AFTER the new content is live.
 *
 * Usage:
 *   bun scripts/notify-indexing.ts                 # push articles from last 48h
 *   bun scripts/notify-indexing.ts --hours=24      # custom window
 *   bun scripts/notify-indexing.ts --dry-run       # list URLs, ping nothing
 *   bun scripts/notify-indexing.ts --no-websub     # Indexing API only
 *
 * Required env (see .env.example):
 *   GOOGLE_INDEXING_CLIENT_EMAIL   service account email
 *   GOOGLE_INDEXING_PRIVATE_KEY    service account private key (escaped \n ok)
 * Optional env:
 *   SITE_URL                       default https://typescript.news
 *   WEBSUB_HUB_URL                 default https://pubsubhubbub.appspot.com/
 *   INDEXING_WINDOW_HOURS          default 48 (overridden by --hours)
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  DEFAULT_WEBSUB_HUB,
  createIndexingClient,
  notifyGoogleIndexingBatch,
  pingWebSub,
} from '../server/utils/indexing'

const LOCALES = ['en', 'fr', 'de'] as const
type Locale = (typeof LOCALES)[number]

const CONTENT_ROOT = join(import.meta.dir, '..', 'content')

function parseArgs(argv: string[]) {
  const args = { dryRun: false, websub: true, hours: Number(process.env.INDEXING_WINDOW_HOURS) || 48 }
  for (const arg of argv) {
    if (arg === '--dry-run') args.dryRun = true
    else if (arg === '--no-websub') args.websub = false
    else if (arg.startsWith('--hours=')) args.hours = Number(arg.slice('--hours='.length)) || args.hours
  }
  return args
}

/** Extract a frontmatter scalar value (handles quoted and bare values). */
function frontmatterValue(frontmatter: string, key: string): string | undefined {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (!match) return undefined
  return match[1].trim().replace(/^["']|["']$/g, '')
}

interface RecentArticle {
  locale: Locale
  slug: string
  date: Date
  url: string
}

function localePathPrefix(locale: Locale): string {
  // Matches nuxt i18n `prefix_except_default` with defaultLocale 'en'.
  return locale === 'en' ? '' : `/${locale}`
}

function collectRecentArticles(siteUrl: string, cutoff: Date): RecentArticle[] {
  const found: RecentArticle[] = []
  for (const locale of LOCALES) {
    const dir = join(CONTENT_ROOT, locale, 'articles')
    let files: string[]
    try {
      files = readdirSync(dir).filter(name => name.endsWith('.md'))
    }
    catch {
      continue // locale dir may not exist
    }
    for (const file of files) {
      const raw = readFileSync(join(dir, file), 'utf8')
      // Tolerate both LF and CRLF (Windows checkouts).
      const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
      if (!fmMatch) continue
      const dateStr = frontmatterValue(fmMatch[1], 'date')
      if (!dateStr) continue
      const date = new Date(dateStr)
      if (Number.isNaN(date.getTime()) || date < cutoff) continue

      const slug = file.replace(/\.md$/, '')
      const url = new URL(`${localePathPrefix(locale)}/articles/${slug}`, siteUrl).toString()
      found.push({ locale, slug, date, url })
    }
  }
  return found.sort((a, b) => b.date.getTime() - a.date.getTime())
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const siteUrl = process.env.SITE_URL || 'https://typescript.news'
  const hubUrl = process.env.WEBSUB_HUB_URL || DEFAULT_WEBSUB_HUB
  const cutoff = new Date(Date.now() - args.hours * 60 * 60 * 1000)

  const articles = collectRecentArticles(siteUrl, cutoff)
  console.log(`Found ${articles.length} article(s) published in the last ${args.hours}h:`)
  for (const a of articles) console.log(`  [${a.locale}] ${a.url}`)

  if (args.dryRun) {
    console.log('\n--dry-run: not pinging anything.')
    return
  }

  // --- Google Indexing API ---
  if (articles.length) {
    const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL ?? ''
    const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY ?? ''
    if (!clientEmail || !privateKey) {
      console.error('\nSkipping Google Indexing API: GOOGLE_INDEXING_CLIENT_EMAIL / GOOGLE_INDEXING_PRIVATE_KEY not set.')
    }
    else {
      console.log('\nPushing to Google Indexing API...')
      const client = createIndexingClient({ clientEmail, privateKey })
      const results = await notifyGoogleIndexingBatch(client, articles.map(a => a.url), 'URL_UPDATED')
      for (const r of results) {
        console.log(`  ${r.ok ? 'OK ' : 'ERR'} ${r.url}${r.ok ? '' : ` (${r.status ?? '-'}: ${r.error})`}`)
      }
      const failed = results.filter(r => !r.ok).length
      if (failed) process.exitCode = 1
    }
  }

  // --- WebSub ping (one per locale RSS feed) ---
  if (args.websub && articles.length) {
    const localesToPing = [...new Set(articles.map(a => a.locale))]
    console.log('\nPinging WebSub hub for affected RSS feeds...')
    for (const locale of localesToPing) {
      const feedUrl = new URL(`${localePathPrefix(locale)}/rss.xml`, siteUrl).toString()
      const res = await pingWebSub(feedUrl, hubUrl)
      console.log(`  ${res.ok ? 'OK ' : 'ERR'} ${feedUrl}${res.ok ? '' : ` (${res.status ?? '-'}: ${res.error})`}`)
      if (!res.ok) process.exitCode = 1
    }
  }

  console.log('\nDone.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
