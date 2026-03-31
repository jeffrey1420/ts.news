<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'

const { data: articles } = await useAsyncData('latest-articles', () =>
  queryCollection('articles').order('date', 'DESC').limit(6).all()
)

const title = 'TypeScript & Web Dev News'
const description = 'Daily TypeScript, JavaScript, and web platform news covering releases, tooling, security, frameworks, and developer workflows.'
const canonicalUrl = absoluteSiteUrl('/')
const ogImage = absoluteSiteUrl(siteConfig.defaultOgImage)

useSeoMeta({
  title,
  description,
  ogTitle: `${title} | ${siteConfig.name}`,
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogImage,
  ogImageAlt: siteConfig.name,
  twitterTitle: `${title} | ${siteConfig.name}`,
  twitterDescription: description,
  twitterImage: ogImage,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      key: 'home-schema',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${title} | ${siteConfig.name}`,
        url: canonicalUrl,
        description,
        isPartOf: {
          '@type': 'WebSite',
          name: siteConfig.name,
          url: siteConfig.url,
        },
        hasPart: (articles.value ?? []).map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteSiteUrl(article.path),
          name: article.title,
        })),
      }),
    },
  ],
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div>
    <UPageHero
      title="typescript.news"
      description="Daily TypeScript, JavaScript, and web platform news for developers who ship code."
      :links="[
        { label: 'Read articles', to: '/articles', icon: 'i-lucide-newspaper', size: 'lg' },
      ]"
    />

    <UPageSection headline="Latest" title="Recent TypeScript and web development articles">
      <UBlogPosts v-if="articles?.length">
        <UBlogPost
          v-for="article in articles"
          :key="article.path"
          :title="article.title"
          :description="article.description"
          :date="formatDate(article.date)"
          :image="article.image"
          :badge="article.tags?.[0] ? { label: article.tags[0], color: 'primary' as const, variant: 'subtle' as const } : undefined"
          :to="article.path"
        />
      </UBlogPosts>

      <p class="mt-8 text-sm text-muted">
        Browse the latest TypeScript release analysis, framework updates, tooling news, and developer security coverage.
      </p>
    </UPageSection>
  </div>
</template>
