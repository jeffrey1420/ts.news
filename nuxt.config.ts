// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-auth-utils',
    '@nuxt/content',
    '@nuxt/a11y',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    'nuxt-llms',
  ],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  css: ['~/assets/css/main.css'],
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fr', name: 'Fran\u00e7ais', file: 'fr.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },
  llms: {
    domain: 'https://typescript.news',
    title: 'typescript.news',
    description: 'Daily TypeScript, JavaScript, and web platform news for developers who ship code.',
    sections: [
      { title: 'Articles', description: 'All TypeScript and web development articles', contentCollection: 'articles_en' },
      { title: 'Articles (French)', description: 'Articles in French', contentCollection: 'articles_fr' },
      { title: 'Articles (German)', description: 'Articles in German', contentCollection: 'articles_de' },
    ],
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'typescript.news RSS Feed', href: '/rss.xml' },
      ],
      script: [
        { 'data-goatcounter': 'https://goatcounter.lschvn.foo/count', async: true, src: '//goatcounter.lschvn.foo/count.js' },
      ],
    },
  },
})
