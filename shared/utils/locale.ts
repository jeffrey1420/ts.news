export const SUPPORTED_LOCALES = ['en', 'fr', 'de'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en'

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  fr: 'Fran\u00e7ais',
  de: 'Deutsch',
}

export const LOCALE_LANGUAGE_TAGS: Record<SupportedLocale, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
}

export const LOCALE_OG_TAGS: Record<SupportedLocale, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  de: 'de_DE',
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

export function getLocaleLanguage(locale: string): string {
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE
  return LOCALE_LANGUAGE_TAGS[validLocale]
}

export function getLocaleOgTag(locale: string): string {
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE
  return LOCALE_OG_TAGS[validLocale]
}
