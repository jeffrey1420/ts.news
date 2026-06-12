import { createError, defineEventHandler, getRouterParam, setHeader } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import { isValidLocale } from '~~/shared/utils/locale'

// Serves the raw markdown source of an article, e.g. /md/en/articles/<slug>.md
// Linked from article pages via <link rel="alternate" type="text/markdown">
// so LLM agents can fetch clean markdown instead of parsing HTML.
export default defineEventHandler(async (event) => {
  const locale = getRouterParam(event, 'locale') ?? ''
  const slug = (getRouterParam(event, 'slug') ?? '').replace(/\.md$/, '')

  if (!isValidLocale(locale) || !slug) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  // Match in JS instead of .path(): the query sanitizer rejects SQL containing `--`,
  // which many article slugs include.
  const articles = await queryCollection(event, `articles_${locale}`)
    .select('path', 'rawbody')
    .all()
  const article = articles.find(item => item.path === `/articles/${slug}`)

  if (!article?.rawbody) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  setHeader(event, 'X-Robots-Tag', 'noindex')

  return article.rawbody
})
