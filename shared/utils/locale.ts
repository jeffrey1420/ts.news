export const SUPPORTED_LOCALES = ['en', 'fr', 'de'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en'

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  fr: 'Fran\u00e7ais',
  de: 'Deutsch',
}

export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
}

export function getCollectionName(
  type: 'articles' | 'authors',
  locale: string
): `${typeof type}_${SupportedLocale}` {
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE
  return `${type}_${validLocale}` as `${typeof type}_${SupportedLocale}`
}

export function getLocaleFromPath(path: string): SupportedLocale {
  const firstSegment = path.split('/').filter(Boolean)[0]
  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment
  }
  return DEFAULT_LOCALE
}

export function removeLocaleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean)
  if (segments.length > 0 && segments[0] && isValidLocale(segments[0])) {
    return '/' + segments.slice(1).join('/')
  }
  return path
}

export function addLocaleToPath(path: string, locale: SupportedLocale): string {
  if (locale === DEFAULT_LOCALE) {
    return path
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${cleanPath}`
}
