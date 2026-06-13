import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import {
  createIndexingClient,
  notifyGoogleIndexingBatch,
  pingWebSub,
} from '~~/server/utils/indexing'
import { absoluteSiteUrl } from '~~/shared/utils/site'
import { SUPPORTED_LOCALES, type SupportedLocale } from '~~/shared/utils/locale'

/**
 * Manual / webhook trigger for the real-time indexing push.
 *
 * Pushes recently published article URLs to the Google Indexing API and pings
 * the WebSub hub for affected RSS feeds. Equivalent to `scripts/notify-indexing.ts`
 * but callable over HTTP (e.g. from a deploy webhook).
 *
 * Auth: `Authorization: Bearer <NUXT_INDEXING_PUSH_TOKEN>`.
 * Body (optional): { hours?: number, websub?: boolean }
 */
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000

function localePath(path: string, locale: SupportedLocale): string {
  return locale === 'en' ? path : `/${locale}${path}`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  // Auth guard.
  if (!config.indexingPushToken) {
    throw createError({ statusCode: 503, statusMessage: 'Indexing push not configured' })
  }
  const auth = getHeader(event, 'authorization') ?? ''
  if (auth !== `Bearer ${config.indexingPushToken}`) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody<{ hours?: number, websub?: boolean }>(event).catch(() => ({}))
  const hours = Number(body?.hours) > 0 ? Number(body.hours) : 48
  const websub = body?.websub !== false
  const cutoff = Date.now() - (hours === 48 ? TWO_DAYS_MS : hours * 60 * 60 * 1000)

  // Collect recent article URLs across locales.
  const collections = await Promise.all(
    SUPPORTED_LOCALES.map(async locale => ({
      locale,
      articles: await queryCollection(event, `articles_${locale}`).order('date', 'DESC').all(),
    })),
  )
  const localesWithFresh = new Set<SupportedLocale>()
  const urls = collections.flatMap(({ locale, articles }) =>
    articles
      .filter(a => new Date(a.date).getTime() >= cutoff)
      .map((a) => {
        localesWithFresh.add(locale)
        return absoluteSiteUrl(localePath(a.path, locale))
      }),
  )

  const response: Record<string, unknown> = { hours, count: urls.length, urls }

  if (urls.length && config.googleIndexingClientEmail && config.googleIndexingPrivateKey) {
    const client = createIndexingClient({
      clientEmail: config.googleIndexingClientEmail,
      privateKey: config.googleIndexingPrivateKey,
    })
    response.indexing = await notifyGoogleIndexingBatch(client, urls, 'URL_UPDATED')
  }
  else if (urls.length) {
    response.indexing = 'skipped: credentials not configured'
  }

  if (websub && urls.length) {
    response.websub = await Promise.all(
      [...localesWithFresh].map(async locale => ({
        feed: absoluteSiteUrl(localePath('/rss.xml', locale)),
        ...(await pingWebSub(absoluteSiteUrl(localePath('/rss.xml', locale)), config.websubHubUrl)),
      })),
    )
  }

  return response
})
