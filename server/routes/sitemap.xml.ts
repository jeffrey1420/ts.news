import { defineEventHandler, setHeader } from 'h3'
import { absoluteSiteUrl } from '~~/shared/utils/site'

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

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=300')

  const articles = await queryCollection(event, 'articles_en')
    .order('date', 'DESC')
    .all()

  const latestArticleDate = formatDate(articles[0]?.date)

  const uniqueTags = [...new Set(articles.flatMap(article => article.tags ?? []))]

  const urls = [
    { loc: absoluteSiteUrl('/'), lastmod: latestArticleDate, changefreq: 'daily', priority: '1.0' },
    { loc: absoluteSiteUrl('/articles'), lastmod: latestArticleDate, changefreq: 'daily', priority: '0.9' },
    { loc: absoluteSiteUrl('/authors/lschvn'), lastmod: latestArticleDate, changefreq: 'monthly', priority: '0.6' },
    ...uniqueTags.map(tag => ({
      loc: absoluteSiteUrl(`/tags/${tag}`),
      lastmod: latestArticleDate,
      changefreq: 'weekly',
      priority: '0.7',
    })),
    ...articles.map(article => ({
      loc: absoluteSiteUrl(article.path),
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
