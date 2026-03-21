// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/seo',
  ],

  site: {
    url: 'https://typescript.news',
    name: 'ts.news - TypeScript & Web Tech News',
    description: 'Clean, developer-focused news for TypeScript and web tech. No fluff, no ads — just well-written long-form articles and news reporting.',
    defaultLocale: 'en',
  },

  app: {
    head: {
      title: 'ts.news - TypeScript & Web Tech News',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Clean, developer-focused news for TypeScript and web tech. No fluff, no ads — just well-written long-form articles and news reporting.' },
        { name: 'theme-color', content: '#ffffff' },
        { property: 'og:site_name', content: 'ts.news' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://typescript.news' },
        { property: 'og:title', content: 'ts.news - TypeScript & Web Tech News' },
        { property: 'og:description', content: 'Clean, developer-focused news for TypeScript and web tech. No fluff, no ads — just well-written long-form articles and news reporting.' },
        { property: 'og:image', content: 'https://typescript.news/og-default.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@tsnews' },
        { name: 'twitter:title', content: 'ts.news - TypeScript & Web Tech News' },
        { name: 'twitter:description', content: 'Clean, developer-focused news for TypeScript and web tech.' },
        { name: 'twitter:image', content: 'https://typescript.news/og-default.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'ts.news RSS Feed', href: '/rss.xml' },
      ],
      script: [
        { src: '//goatcounter.lschvn.foo/count.js', async: true, defer: true, 'data-goatcounter': 'https://goatcounter.lschvn.foo/count' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark',
          langs: [
            'typescript',
            'javascript',
            'vue',
            'html',
            'css',
            'json',
            'bash',
            'markdown',
            'yaml',
            'sql',
          ],
        },
        anchorLinks: true,
      },
    },
  },

  ui: {
    primary: 'blue',
    gray: 'slate',
  },
})
