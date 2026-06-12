import { defineEventHandler, setHeader } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import { absoluteSiteUrl } from '~~/shared/utils/site'
import { LOCALE_LANGUAGE_TAGS, SUPPORTED_LOCALES, type SupportedLocale } from '~~/shared/utils/locale'

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function formatDate(date?: string) {
  return date ? new Date(date).toISOString() : undefined
}

function localePath(path: string, locale: SupportedLocale): string {
  if (locale === 'en') return path
  return `/${locale}${path === '/' ? '' : path}`
}

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq: string
  priority: string
  alternates?: { hreflang: string, href: string }[]
}

// hreflang alternates for a path that exists in every locale
function alternatesFor(path: string) {
  const alternates = SUPPORTED_LOCALES.map(locale => ({
    hreflang: LOCALE_LANGUAGE_TAGS[locale],
    href: absoluteSiteUrl(localePath(path, locale)),
  }))
  alternates.push({ hreflang: 'x-default', href: absoluteSiteUrl(localePath(path, 'en')) })
  return alternates
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=300')

  const [articlesEn, articlesFr, articlesDe] = await Promise.all([
    queryCollection(event, 'articles_en').order('date', 'DESC').all(),
    queryCollection(event, 'articles_fr').order('date', 'DESC').all(),
    queryCollection(event, 'articles_de').order('date', 'DESC').all(),
  ])

  const articlesByLocale: Record<SupportedLocale, typeof articlesEn> = {
    en: articlesEn,
    fr: articlesFr,
    de: articlesDe,
  }

  const allArticles = SUPPORTED_LOCALES.flatMap(locale =>
    articlesByLocale[locale].map(article => ({ ...article, locale })),
  )

  const latestDate = formatDate(articlesEn[0]?.date)
  const uniqueTags = [...new Set(allArticles.flatMap(a => a.tags ?? []))]
  const slugsWithAllLocales = new Set(
    articlesEn
      .filter(article => SUPPORTED_LOCALES.every(locale =>
        articlesByLocale[locale].some(candidate => candidate.path === article.path),
      ))
      .map(article => article.path),
  )

  const urls: SitemapUrl[] = [
    // Home pages
    ...SUPPORTED_LOCALES.map(locale => ({
      loc: absoluteSiteUrl(localePath('/', locale)),
      lastmod: latestDate,
      changefreq: 'daily',
      priority: '1.0',
      alternates: alternatesFor('/'),
    })),
    // Index pages
    ...SUPPORTED_LOCALES.flatMap(locale => [
      { loc: absoluteSiteUrl(localePath('/articles', locale)), lastmod: latestDate, changefreq: 'daily', priority: '0.9', alternates: alternatesFor('/articles') },
      { loc: absoluteSiteUrl(localePath('/tags', locale)), lastmod: latestDate, changefreq: 'weekly', priority: '0.6', alternates: alternatesFor('/tags') },
      { loc: absoluteSiteUrl(localePath('/authors', locale)), lastmod: latestDate, changefreq: 'monthly', priority: '0.5', alternates: alternatesFor('/authors') },
      { loc: absoluteSiteUrl(localePath('/authors/lschvn', locale)), lastmod: latestDate, changefreq: 'monthly', priority: '0.6', alternates: alternatesFor('/authors/lschvn') },
    ]),
    // Tag pages per locale
    ...SUPPORTED_LOCALES.flatMap(locale =>
      uniqueTags.map(tag => ({
        loc: absoluteSiteUrl(localePath(`/tags/${tag}`, locale)),
        lastmod: latestDate,
        changefreq: 'weekly',
        priority: '0.7',
        alternates: alternatesFor(`/tags/${tag}`),
      })),
    ),
    // Articles with correct locale prefix
    ...allArticles.map(article => ({
      loc: absoluteSiteUrl(localePath(article.path, article.locale)),
      lastmod: formatDate(article.date),
      changefreq: 'weekly',
      priority: '0.8',
      alternates: slugsWithAllLocales.has(article.path) ? alternatesFor(article.path) : undefined,
    })),
  ]

  const entries = urls.map(url => `
    <url>
      <loc>${escapeXml(url.loc)}</loc>
      ${url.lastmod ? `<lastmod>${escapeXml(url.lastmod)}</lastmod>` : ''}
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
      ${(url.alternates ?? []).map(alt => `<xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}"/>`).join('\n      ')}
    </url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${entries}
</urlset>
`
})
