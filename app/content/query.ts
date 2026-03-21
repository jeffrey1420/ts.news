/**
 * Content query utilities for ts.news
 * 
 * This module provides helper functions for querying Nuxt Content.
 * In Nuxt Content v3, queryContent is globally available, but these
 * helpers provide a consistent interface across the app.
 */

import { queryContent, type QueryBuilder } from '#imports'

export interface Article {
  _path: string
  title: string
  description?: string
  date?: string
  readTime?: number
  tags?: string[]
  featured?: boolean
  body?: any
}

/**
 * Base query for articles
 */
function articleQuery(): QueryBuilder {
  return queryContent('articles').sort({ date: -1 })
}

/**
 * Get all articles
 */
export function queryAllArticles(): QueryBuilder {
  return articleQuery()
}

/**
 * Get featured articles
 */
export function queryFeaturedArticles(): QueryBuilder {
  return articleQuery().where({ featured: true }).limit(1)
}

/**
 * Get a single article by path
 */
export function queryArticleByPath(path: string): QueryBuilder {
  return queryContent(path)
}

/**
 * Get a single article by slug
 */
export function queryArticleBySlug(slug: string): QueryBuilder {
  return queryArticleByPath(`/articles/${slug}`)
}

/**
 * Get articles by tag
 */
export function queryArticlesByTag(tag: string): QueryBuilder {
  return articleQuery().where({ tags: { $contains: tag } })
}

/**
 * Calculate reading time from text content
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

/**
 * Format a date string for display
 */
export function formatArticleDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
