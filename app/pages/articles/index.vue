<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'

const { data: articles } = await useAsyncData('all-articles', () =>
  queryCollection('articles').order('date', 'DESC').all()
)

const title = 'Articles'
const description = 'Archive of TypeScript, JavaScript, tooling, security, and web platform stories published on typescript.news.'
const canonicalUrl = absoluteSiteUrl('/articles')
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
      key: 'articles-schema',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${title} | ${siteConfig.name}`,
        url: canonicalUrl,
        description,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: (articles.value ?? []).map((article, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteSiteUrl(article.path),
            name: article.title,
          })),
        },
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
      title="Articles"
      description="TypeScript, JavaScript, tooling, security, and web platform coverage in one archive."
    />

    <UPageBody>
      <UContainer>
        <p class="mb-8 text-sm text-muted">
          Explore every story published on typescript.news, from TypeScript releases and framework shifts to supply chain security incidents.
        </p>

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

        <UEmpty v-else icon="i-lucide-newspaper" title="No articles yet" description="Check back soon." />
      </UContainer>
    </UPageBody>
  </div>
</template>
