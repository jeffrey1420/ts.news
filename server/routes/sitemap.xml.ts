import { defineEventHandler, setHeader } from 'h3'
import { absoluteSiteUrl } from '~~/shared/utils/site'
import { getCollectionName } from '~~/shared/utils/locale'

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

function localePath(path: string, locale: string): string {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=300')

  const [articlesEn, articlesFr, articlesDe] = await Promise.all([
    queryCollection(event, 'articles_en').order('date', 'DESC').all(),
    queryCollection(event, 'articles_fr').order('date', 'DESC').all(),
    queryCollection(event, 'articles_de').order('date', 'DESC').all(),
  ])

  const allArticles = [
    ...articlesEn.map(a => ({ ...a, locale: 'en' })),
    ...articlesFr.map(a => ({ ...a, locale: 'fr' })),
    ...articlesDe.map(a => ({ ...a, locale: 'de' })),
  ]

  const latestDate = formatDate(allArticles[0]?.date)
  const uniqueTags = [...new Set(allArticles.flatMap(a => a.tags ?? []))]

  const urls = [
    // Index pages
    { loc: absoluteSiteUrl('/'), lastmod: latestDate, changefreq: 'daily', priority: '1.0' },
    { loc: absoluteSiteUrl('/articles'), lastmod: latestDate, changefreq: 'daily', priority: '0.9' },
    { loc: absoluteSiteUrl('/fr/articles'), lastmod: latestDate, changefreq: 'daily', priority: '0.9' },
    { loc: absoluteSiteUrl('/de/articles'), lastmod: latestDate, changefreq: 'daily', priority: '0.9' },
    // Author
    { loc: absoluteSiteUrl('/authors/lschvn'), lastmod: latestDate, changefreq: 'monthly', priority: '0.6' },
    // Tag pages (shared across locales)
    ...uniqueTags.map(tag => ({
      loc: absoluteSiteUrl(`/tags/${tag}`),
      lastmod: latestDate,
      changefreq: 'weekly',
      priority: '0.7',
    })),
    // Articles with correct locale prefix
    ...allArticles.map(article => ({
      loc: absoluteSiteUrl(localePath(article.path, article.locale)),
      lastmod: formatDate(article.date),
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ]

  const entries = urls.map((url) => `
    <url>
      <loc>${escapeXml(url.loc)}</loc>
      ${url.lastmod ? `<lastmod>${escapeXml(url.lastmod)}</lastmod>` : ''}
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries}
</urlset>
`
})
