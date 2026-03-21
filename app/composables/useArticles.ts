/**
 * Composable for fetching articles with Nuxt Content v3
 */
export const useArticles = () => {
  /**
   * Fetch all articles sorted by date (newest first)
   */
  const fetchAll = () =>
    useAsyncData('articles', () =>
      queryCollection('articles')
        .order('date', 'DESC')
        .all()
    )

  /**
   * Fetch featured article
   */
  const fetchFeatured = () =>
    useAsyncData('featured-articles', () =>
      queryCollection('articles')
        .where({ featured: true })
        .first()
    )

  /**
   * Fetch a single article by slug
   */
  const fetchBySlug = (slug: string) =>
    useAsyncData(`article-${slug}`, () =>
      queryCollection('articles')
        .path(`/articles/${slug}`)
        .first()
    )

  /**
   * Fetch articles by tag
   */
  const fetchByTag = (tag: string) =>
    useAsyncData(`articles-tag-${tag}`, () =>
      queryCollection('articles')
        .where('tags', 'LIKE', `%${tag}%`)
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
