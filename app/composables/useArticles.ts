/**
 * Composable for fetching articles with consistent options
 */
export const useArticles = () => {
  /**
   * Fetch all articles sorted by date (newest first)
   */
  const fetchAll = () =>
    useAsyncData('articles', () =>
      queryContent('articles')
        .sort({ date: -1 })
        .find()
    )

  /**
   * Fetch featured articles (those marked as featured)
   */
  const fetchFeatured = () =>
    useAsyncData('featured-articles', () =>
      queryContent('articles')
        .where({ featured: true })
        .sort({ date: -1 })
        .limit(1)
        .find()
    )

  /**
   * Fetch a single article by slug
   */
  const fetchBySlug = (slug: string) =>
    useAsyncData(`article-${slug}`, () =>
      queryContent('articles')
        .where({ _path: `/articles/${slug}` })
        .findOne()
    )

  /**
   * Fetch articles by tag
   */
  const fetchByTag = (tag: string) =>
    useAsyncData(`articles-tag-${tag}`, () =>
      queryContent('articles')
        .where({ tags: { $contains: tag } })
        .sort({ date: -1 })
        .find()
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
