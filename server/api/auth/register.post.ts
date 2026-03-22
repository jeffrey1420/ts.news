export default defineEventHandler(async (event) => {
  const { name, email, password } = await readBody(event)

  if (!name?.trim() || !email?.trim() || !password) {
    throw createError({ statusCode: 400, message: 'Name, email, and password are required.' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, message: 'Password must be at least 6 characters.' })
  }

  const db = useDB()

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim())
  if (existing) {
    throw createError({ statusCode: 409, message: 'An account with this email already exists.' })
  }

  const hashed = await hashPassword(password)

  const result = db.prepare(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
  ).run(name.trim(), email.trim(), hashed)

  await setUserSession(event, {
    user: {
      id: result.lastInsertRowid as number,
      name: name.trim(),
      email: email.trim(),
    },
  })

  return { user: { id: result.lastInsertRowid, name: name.trim(), email: email.trim() } }
})
