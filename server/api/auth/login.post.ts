export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email?.trim() || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required.' })
  }

  const db = useDB()

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim()) as {
    id: number
    name: string
    email: string
    password: string
  } | undefined

  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid email or password.' })
  }

  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Invalid email or password.' })
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })

  return { user: { id: user.id, name: user.name, email: user.email } }
})
