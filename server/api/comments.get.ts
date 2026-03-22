export default defineEventHandler((event) => {
  const { slug } = getQuery(event)

  if (!slug || typeof slug !== 'string') {
    throw createError({ statusCode: 400, message: 'slug query parameter is required.' })
  }

  const db = useDB()

  const comments = db.prepare(`
    SELECT c.id, c.content, c.created_at, u.name as author_name
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.article_slug = ?
    ORDER BY c.created_at DESC
  `).all(slug)

  return comments
})
