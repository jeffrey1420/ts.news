// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/seo',
  ],
  
  app: {
    head: {
      title: 'ts.news - TypeScript & Web Tech News',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Clean, developer-focused news for TypeScript and web tech. No fluff, no ads — just well-written long-form articles and news reporting.' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  
  colorMode: {
    preference: 'light',
    fallback: 'light',
  },
  
  content: {
    highlight: {
      theme: 'github-dark',
    },
  },
})
