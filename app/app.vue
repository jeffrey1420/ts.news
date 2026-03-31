<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'

const { loggedIn, user, clear } = useUserSession()

const navItems: NavigationMenuItem[] = [
  { label: 'Home', icon: 'i-lucide-home', to: '/' },
  { label: 'Articles', icon: 'i-lucide-newspaper', to: '/articles' },
  { label: 'Topics', icon: 'i-lucide-tag', children: [
    { label: 'TypeScript', to: '/tags/typescript' },
    { label: 'Security', to: '/tags/security' },
    { label: 'Frameworks', to: '/tags/framework' },
    { label: 'Tooling', to: '/tags/tooling' },
    { label: 'AI Devtools', to: '/tags/ai' },
  ] },
]

useHead({
  titleTemplate: (title) => title ? `${title} · ${siteConfig.name}` : siteConfig.name,
  meta: [
    { name: 'application-name', content: siteConfig.name },
    { name: 'apple-mobile-web-app-title', content: siteConfig.name },
  ],
  script: [
    {
      key: 'website-schema',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        inLanguage: 'en-US',
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: siteConfig.url,
          logo: {
            '@type': 'ImageObject',
            url: absoluteSiteUrl(siteConfig.defaultOgImage),
          },
        },
      }),
    },
  ],
})

useSeoMeta({
  applicationName: siteConfig.name,
  ogSiteName: siteConfig.name,
  ogLocale: siteConfig.locale,
  twitterCard: 'summary_large_image',
})

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  navigateTo('/')
}
</script>

<template>
  <UApp>
    <UHeader>
      <template #title>
        <span class="font-bold text-xl tracking-tight">
          typescript<span class="text-primary">.news</span>
        </span>
      </template>

      <UNavigationMenu :items="navItems" />

      <template #right>
        <UButton icon="i-lucide-github" variant="ghost" color="neutral" size="sm" to="https://github.com/jeffrey1420/ts.news" target="_blank" />
        <UButton icon="i-lucide-rss" variant="ghost" color="neutral" size="sm" to="/rss.xml" />

        <UColorModeButton />

        <template v-if="loggedIn">
          <span class="text-sm text-muted hidden sm:inline">{{ user?.name }}</span>
          <UButton icon="i-lucide-log-out" variant="ghost" color="neutral" size="sm" @click="logout" />
        </template>
        <UButton v-else icon="i-lucide-user" variant="ghost" color="neutral" size="sm" to="/login" />
      </template>

      <template #body>
        <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <NuxtRouteAnnouncer />
      <NuxtPage
        :transition="{
          name: 'page',
          mode: 'out-in',
        }"
      />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          &copy; {{ new Date().getFullYear() }} typescript.news
        </p>
      </template>

      <template #right>
        <div class="flex items-center gap-4 text-sm">
          <NuxtLink to="/tags/typescript" class="text-muted hover:text-default transition-colors">TypeScript</NuxtLink>
          <NuxtLink to="/tags/security" class="text-muted hover:text-default transition-colors">Security</NuxtLink>
          <NuxtLink to="/tags/ai" class="text-muted hover:text-default transition-colors">AI Devtools</NuxtLink>
          <NuxtLink to="/rss.xml" class="text-muted hover:text-default transition-colors">RSS</NuxtLink>
        </div>
      </template>
    </UFooter>
  </UApp>
</template>
