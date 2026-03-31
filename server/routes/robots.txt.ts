import { defineEventHandler } from 'h3'
import { absoluteSiteUrl } from '~~/shared/utils/site'

export default defineEventHandler((event) => {
  event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  event.node.res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300')

  return `User-agent: *
Allow: /
Disallow: /login

Sitemap: ${absoluteSiteUrl('/sitemap.xml')}
`
})
