/**
 * Composable for fetching articles with consistent options
 * Updated for Nuxt Content v3
 */
import { queryCollection } from '#imports'

export const useArticles = () => {
  const collection = 'articles'

  /**
   * Fetch all articles sorted by date (newest first)
   */
  const fetchAll = () =>
    useAsyncData('articles', () =>
      queryCollection(collection)
        .order('date', 'DESC')
        .all()
    )

  /**
   * Fetch featured articles (those marked as featured)
   */
  const fetchFeatured = () =>
    useAsyncData('featured-articles', () =>
      queryCollection(collection)
        .where({ featured: true })
        .order('date', 'DESC')
        .first()
    )

  /**
   * Fetch a single article by slug
   */
  const fetchBySlug = (slug: string) =>
    useAsyncData(`article-${slug}`, () =>
      queryCollection(collection)
        .where({ _path: `/articles/${slug}` })
        .first()
    )

  /**
   * Fetch articles by tag
   */
  const fetchByTag = (tag: string) =>
    useAsyncData(`articles-tag-${tag}`, () =>
      queryCollection(collection)
        .where({ tags: { $contains: tag } })
        .order('date', 'DESC')
        .all()
    )

  /**
   * Calculate reading time from content
   */
  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  /**
   * Format date for display
   */
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return {
    fetchAll,
    fetchFeatured,
    fetchBySlug,
    fetchByTag,
    calculateReadTime,
    formatDate,
  }
}
