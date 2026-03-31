import { DEFAULT_LOCALE } from '~~/shared/utils/locale'

export default defineNuxtRouteMiddleware((to) => {
  const defaultLocalePrefix = new RegExp(`^/${DEFAULT_LOCALE}(?=/|$)`)

  if (!defaultLocalePrefix.test(to.path)) {
    return
  }

  const normalizedPath = to.path.replace(defaultLocalePrefix, '') || '/'

  return navigateTo({
    path: normalizedPath,
    query: to.query,
    hash: to.hash,
  }, {
    redirectCode: 301,
    replace: true,
  })
})
