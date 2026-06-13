import { defineEventHandler } from 'h3'
import { absoluteSiteUrl } from '~~/shared/utils/site'

// AI/LLM crawlers explicitly welcomed for generative engine visibility
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'Bytespider',
  'CCBot',
  'cohere-ai',
  'MistralAI-User',
]

export default defineEventHandler((event) => {
  event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  event.node.res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300')

  const aiSections = AI_CRAWLERS.map(bot => `User-agent: ${bot}
Allow: /
`).join('\n')

  return `User-agent: *
Allow: /
Disallow: /login
Disallow: /api/

${aiSections}
# LLM-friendly content overview
# ${absoluteSiteUrl('/llms.txt')}
# ${absoluteSiteUrl('/llms-full.txt')}

Sitemap: ${absoluteSiteUrl('/sitemap.xml')}
Sitemap: ${absoluteSiteUrl('/news-sitemap.xml')}
Sitemap: ${absoluteSiteUrl('/sitemap-news.xml')}
`
})
