import { defineEventHandler, setHeader } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'
import { SUPPORTED_LOCALES, type SupportedLocale } from '~~/shared/utils/locale'

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function localePath(path: string, locale: SupportedLocale): string {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

// Google News sitemap: only articles published within the last 48 hours qualify.
export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=300')

  const collections = await Promise.all(
    SUPPORTED_LOCALES.map(async locale => ({
      locale,
      articles: await queryCollection(event, `articles_${locale}`).order('date', 'DESC').all(),
    })),
  )

  const cutoff = Date.now() - TWO_DAYS_MS

  const entries = collections.flatMap(({ locale, articles }) =>
    articles
      .filter(article => new Date(article.date).getTime() >= cutoff)
      .map(article => `
    <url>
      <loc>${escapeXml(absoluteSiteUrl(localePath(article.path, locale)))}</loc>
      <news:news>
        <news:publication>
          <news:name>${escapeXml(siteConfig.name)}</news:name>
          <news:language>${locale}</news:language>
        </news:publication>
        <news:publication_date>${escapeXml(new Date(article.date).toISOString())}</news:publication_date>
        <news:title>${escapeXml(article.title)}</news:title>
        ${(article.tags ?? []).length ? `<news:keywords>${escapeXml((article.tags ?? []).join(', '))}</news:keywords>` : ''}
      </news:news>
    </url>`),
  ).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${entries}
</urlset>
`
})
