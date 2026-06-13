import { absoluteSiteUrl, siteConfig } from './site'

/**
 * Strongly-typed schema.org JSON-LD builders.
 *
 * These produce plain serializable objects (no Vue/Nitro coupling) so they can
 * be used from page setup (`useHead`), server routes, or tests. Stringify the
 * result with `JSON.stringify` when injecting into a `<script type="application/ld+json">`.
 *
 * @see https://schema.org/NewsArticle
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 */

/** Minimal schema.org types we emit, kept narrow on purpose. */
export interface JsonLdImageObject {
  '@type': 'ImageObject'
  url: string
}

export interface JsonLdPerson {
  '@type': 'Person'
  name: string
  url?: string
  sameAs?: string[]
}

export interface JsonLdOrganization {
  '@type': 'Organization'
  name: string
  url: string
  logo: JsonLdImageObject
}

export interface NewsArticleJsonLd {
  '@context': 'https://schema.org'
  '@type': 'NewsArticle'
  headline: string
  description?: string
  url: string
  datePublished: string
  dateModified: string
  inLanguage?: string
  image: string[]
  articleSection?: string
  keywords?: string
  wordCount?: number
  isAccessibleForFree: boolean
  author: JsonLdPerson
  publisher: JsonLdOrganization
  mainEntityOfPage: {
    '@type': 'WebPage'
    '@id': string
  }
}

/**
 * Input for {@link buildNewsArticleJsonLd}. `headline`, `datePublished`,
 * `url` and `image` are required; the rest are optional and dynamically
 * merged in when present.
 */
export interface NewsArticleInput {
  /** Article title. */
  headline: string
  /** Canonical absolute URL of the article page. */
  url: string
  /**
   * Publication date. Accepts a `Date` or any date-parseable string; it is
   * normalized to an ISO 8601 string in the output.
   */
  datePublished: string | Date
  /**
   * Last modified date. Defaults to `datePublished` when omitted. Normalized
   * to ISO 8601.
   */
  dateModified?: string | Date
  /** Short summary used as the article description. */
  description?: string
  /** BCP-47 language tag, e.g. `en-US`. */
  inLanguage?: string
  /**
   * Absolute image URL(s). A single string is wrapped into an array so the
   * output always satisfies Google's `image` requirement.
   */
  image: string | string[]
  /** Primary section/category (Google reads the first one). */
  articleSection?: string
  /** Comma-separated keywords, or an array that will be joined. */
  keywords?: string | string[]
  /** Word count of the body, if known. */
  wordCount?: number
  /** Author display name. Falls back to the site name. */
  authorName?: string
  /** Absolute URL of the author profile page. */
  authorUrl?: string
  /** External profiles for the author (GitHub, etc.). */
  authorSameAs?: string[]
  /** Whether the content is free to read. Defaults to `true`. */
  isAccessibleForFree?: boolean
}

function toIso(value: string | Date): string {
  return (value instanceof Date ? value : new Date(value)).toISOString()
}

/**
 * Build a Google-News-compliant `NewsArticle` JSON-LD object from typed input.
 *
 * Publisher is derived from {@link siteConfig}; `dateModified` defaults to
 * `datePublished`; a single `image` is coerced to an array.
 */
export function buildNewsArticleJsonLd(input: NewsArticleInput): NewsArticleJsonLd {
  const datePublished = toIso(input.datePublished)
  const dateModified = input.dateModified ? toIso(input.dateModified) : datePublished
  const image = Array.isArray(input.image) ? input.image : [input.image]
  const keywords = Array.isArray(input.keywords) ? input.keywords.join(', ') : input.keywords

  const author: JsonLdPerson = {
    '@type': 'Person',
    name: input.authorName || siteConfig.name,
  }
  if (input.authorUrl) author.url = input.authorUrl
  if (input.authorSameAs?.length) author.sameAs = input.authorSameAs

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    url: input.url,
    datePublished,
    dateModified,
    ...(input.inLanguage ? { inLanguage: input.inLanguage } : {}),
    image,
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    ...(keywords ? { keywords } : {}),
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
    isAccessibleForFree: input.isAccessibleForFree ?? true,
    author,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: absoluteSiteUrl(siteConfig.defaultOgImage),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
  }
}
