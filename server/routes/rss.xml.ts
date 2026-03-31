import { defineEventHandler, setHeader } from 'h3'
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'
const feedUrl = absoluteSiteUrl('/rss.xml')

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function cdata(value: string) {
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=300')

  const articles = await queryCollection(event, 'articles')
    .order('date', 'DESC')
    .all()

  const lastBuildDate = articles[0]?.date ? new Date(articles[0].date).toUTCString() : new Date().toUTCString()

  const items = articles.map((article) => {
    const link = absoluteSiteUrl(article.path)
    const pubDate = article.date ? new Date(article.date).toUTCString() : lastBuildDate
    const categories = article.tags?.length
      ? article.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n        ')
      : ''
    const creator = `<dc:creator>${escapeXml('lschvn')}</dc:creator>`

    return `
      <item>
        <title>${escapeXml(article.title)}</title>
        <link>${escapeXml(link)}</link>
        <guid isPermaLink="true">${escapeXml(link)}</guid>
        <pubDate>${escapeXml(pubDate)}</pubDate>
        <description>${cdata(article.description)}</description>
        ${creator}
        ${categories}
      </item>`
  }).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <image>
      <url>${escapeXml(absoluteSiteUrl(siteConfig.defaultOgImage))}</url>
      <title>${siteConfig.name}</title>
      <link>${siteConfig.url}</link>
    </image>
    ${items}
  </channel>
</rss>
`
})
