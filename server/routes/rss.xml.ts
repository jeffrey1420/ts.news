import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const siteUrl = 'https://typescript.news'
  
  // Query all articles from the 'articles' collection
  const articles = await queryCollection(event, 'articles')
    .order({ date: 'DESC' })
    .all()

  const rssItems = articles.map((article) => {
    const title = article.title || 'Untitled'
    const description = article.description || ''
    const link = `${siteUrl}/articles/${article.path?.split('/').pop() || article.path}`
    const pubDate = article.date ? new Date(article.date).toUTCString() : new Date().toUTCString()

    return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`
  }).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ts.news - TypeScript &amp; Web Tech News</title>
    <link>${siteUrl}</link>
    <description>Clean, developer-focused news for TypeScript and web tech. No fluff, no ads — just well-written long-form articles and news reporting.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  
  return rss
})
