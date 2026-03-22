export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const { slug, content } = await readBody(event)

  if (!slug || !content?.trim()) {
    throw createError({ statusCode: 400, message: 'slug and content are required.' })
  }

  const db = useDB()

  const result = db.prepare(
    'INSERT INTO comments (article_slug, user_id, content) VALUES (?, ?, ?)'
  ).run(slug, session.user.id, content.trim())

  return {
    id: result.lastInsertRowid,
    content: content.trim(),
    author_name: session.user.name,
    created_at: new Date().toISOString(),
  }
})
