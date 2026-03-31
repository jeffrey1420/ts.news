<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { getLocaleLanguage, getLocaleOgTag } from '~~/shared/utils/locale'
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'
import { resolveTopicLabel, topicDefinitions } from '~~/shared/utils/topics'

const { loggedIn, user, clear } = useUserSession()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const localeLanguage = computed(() => getLocaleLanguage(locale.value))
const localeOgTag = computed(() => getLocaleOgTag(locale.value))
const localizedHomeUrl = computed(() => absoluteSiteUrl(localePath('/')))

const navItems = computed<NavigationMenuItem[]>(() => [
  { label: t('nav.home'), icon: 'i-lucide-home', to: localePath('/') },
  { label: t('nav.articles'), icon: 'i-lucide-newspaper', to: localePath('/articles') },
  { label: t('nav.about'), icon: 'i-lucide-user', to: localePath('/authors/lschvn') },
  { label: t('nav.topics'), icon: 'i-lucide-tag', children: [
    ...topicDefinitions.map(topic => ({
      label: resolveTopicLabel(topic, t),
      icon: topic.icon,
      to: localePath(`/tags/${topic.slug}`),
    })),
  ] },
])

useHead(() => ({
  htmlAttrs: {
    lang: localeLanguage.value,
  },
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
        url: localizedHomeUrl.value,
        description: siteConfig.description,
        inLanguage: localeLanguage.value,
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
}))

useSeoMeta({
  applicationName: siteConfig.name,
  ogSiteName: siteConfig.name,
  ogLocale: localeOgTag,
  twitterCard: 'summary_large_image',
})

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  navigateTo(localePath('/'))
}
</script>

<template>
  <UApp>
    <UHeader :to="localePath('/')">
      <template #title>
        <span class="font-bold text-xl tracking-tight">
          typescript<span class="text-primary">.news</span>
        </span>
      </template>

      <UNavigationMenu :items="navItems" />

      <template #right>
        <LanguageSwitcher />
        <UButton icon="i-lucide-github" variant="ghost" color="neutral" size="sm" to="https://github.com/jeffrey1420/ts.news" target="_blank" />
        <UButton icon="i-lucide-rss" variant="ghost" color="neutral" size="sm" href="/rss.xml" external />

        <UColorModeButton />

        <template v-if="loggedIn">
          <span class="text-sm text-muted hidden sm:inline">{{ user?.name }}</span>
          <UButton icon="i-lucide-log-out" variant="ghost" color="neutral" size="sm" @click="logout" />
        </template>
        <UButton v-else icon="i-lucide-user" variant="ghost" color="neutral" size="sm" :to="localePath('/login')" />
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
          <NuxtLink :to="localePath('/tags/typescript')" class="text-muted hover:text-default transition-colors">TypeScript</NuxtLink>
          <NuxtLink :to="localePath('/tags/security')" class="text-muted hover:text-default transition-colors">Security</NuxtLink>
          <NuxtLink :to="localePath('/tags/ai')" class="text-muted hover:text-default transition-colors">AI Devtools</NuxtLink>
          <a href="/rss.xml" class="text-muted hover:text-default transition-colors">RSS</a>
        </div>
      </template>
    </UFooter>
  </UApp>
</template>
