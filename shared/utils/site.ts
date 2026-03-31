import type { SupportedLocale } from './locale'

export const siteConfig = {
  name: 'typescript.news',
  url: 'https://typescript.news',
  description: 'Daily TypeScript, JavaScript, and web platform news for developers who ship code.',
  locale: 'en_US',
  rssPath: '/rss.xml',
  defaultOgImage: '/og-default.svg',
} as const

export const locales = [
  { code: 'en' as SupportedLocale, name: 'English', language: 'en-US' },
  { code: 'fr' as SupportedLocale, name: 'Fran\u00e7ais', language: 'fr-FR' },
  { code: 'de' as SupportedLocale, name: 'Deutsch', language: 'de-DE' },
]

export function absoluteSiteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString()
}
