export const siteConfig = {
  name: 'typescript.news',
  url: 'https://typescript.news',
  description: 'Daily TypeScript, JavaScript, and web platform news for developers who ship code.',
  locale: 'en_US',
  rssPath: '/rss.xml',
  defaultOgImage: '/og-default.svg',
} as const

export function absoluteSiteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString()
}
