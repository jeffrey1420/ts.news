// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-auth-utils',
    '@nuxt/content',
    '@nuxt/a11y',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    'nuxt-llms',
  ],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  runtimeConfig: {
    // Server-only secrets for the real-time indexing push. Set via env:
    //   NUXT_GOOGLE_INDEXING_CLIENT_EMAIL, NUXT_GOOGLE_INDEXING_PRIVATE_KEY,
    //   NUXT_WEBSUB_HUB_URL, NUXT_INDEXING_PUSH_TOKEN
    googleIndexingClientEmail: '',
    googleIndexingPrivateKey: '',
    websubHubUrl: 'https://pubsubhubbub.appspot.com/',
    // Bearer token required to call POST /api/indexing/notify.
    indexingPushToken: '',
  },
  routeRules: {
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/_ipx/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },
  css: ['~/assets/css/main.css'],
  i18n: {
    baseUrl: 'https://typescript.news',
    locales: [
      { code: 'en', name: 'English', language: 'en-US', file: 'en.json' },
      { code: 'fr', name: 'Fran\u00e7ais', language: 'fr-FR', file: 'fr.json' },
      { code: 'de', name: 'Deutsch', language: 'de-DE', file: 'de.json' },
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
    full: {
      title: 'Full article content',
      description: 'Complete markdown content of every typescript.news article',
    },
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
        { rel: 'alternate', type: 'application/rss+xml', title: 'typescript.news Flux RSS (Français)', href: '/fr/rss.xml' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'typescript.news RSS-Feed (Deutsch)', href: '/de/rss.xml' },
        { rel: 'preconnect', href: 'https://goatcounter.lschvn.foo' },
        { rel: 'preconnect', href: 'https://opapi.lschvn.foo' },
      ],
      script: [
        { 'data-goatcounter': 'https://goatcounter.lschvn.foo/count', async: true, src: '//goatcounter.lschvn.foo/count.js' },
        {
          innerHTML: "window.op=window.op||function(){var n=[];return new Proxy(function(){arguments.length&&n.push([].slice.call(arguments))},{get:function(t,r){return'q'===r?n:function(){n.push([r].concat([].slice.call(arguments)))}},has:function(t,r){return'q'===r}}) }();window.op('init',{apiUrl:'https://opapi.lschvn.foo',clientId:'79de0000-8d5b-4504-8704-b96ae99ef82b',trackScreenViews:true,trackOutgoingLinks:true,trackAttributes:true});",
        },
        { src: 'https://openpanel.dev/op1.js', defer: true, async: true },
      ],
    },
  },
})
