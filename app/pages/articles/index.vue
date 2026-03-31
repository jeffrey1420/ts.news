<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'

const { data: articles } = await useAsyncData('all-articles', () =>
  queryCollection('articles').order('date', 'DESC').all()
)

const selectedTag = ref<string | null>(null)

const allTags = computed(() => {
  const tagSet = new Set<string>()
  for (const article of articles.value ?? []) {
    for (const tag of article.tags ?? []) {
      tagSet.add(tag)
    }
  }
  return [...tagSet].sort()
})

const filteredArticles = computed(() => {
  const list = articles.value ?? []
  if (!selectedTag.value) return list
  return list.filter(article => (article.tags ?? []).includes(selectedTag.value!))
})

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

        <!-- Tag filters -->
        <div v-if="allTags.length" class="flex flex-wrap gap-2 mb-6">
          <UButton
            label="All"
            size="xs"
            :variant="selectedTag === null ? 'solid' : 'outline'"
            :color="selectedTag === null ? 'primary' : 'neutral'"
            @click="selectedTag = null"
          />
          <UButton
            v-for="tag in allTags"
            :key="tag"
            :label="tag"
            size="xs"
            :variant="selectedTag === tag ? 'solid' : 'outline'"
            :color="selectedTag === tag ? 'primary' : 'neutral'"
            @click="selectedTag = tag"
          />
        </div>

        <p v-if="selectedTag" class="mb-6 text-sm text-muted">
          Showing {{ filteredArticles.length }} article{{ filteredArticles.length === 1 ? '' : 's' }} tagged "{{ selectedTag }}"
        </p>

        <UBlogPosts v-if="filteredArticles.length">
          <UBlogPost
            v-for="article in filteredArticles"
            :key="article.path"
            :title="article.title"
            :description="article.description"
            :date="formatDate(article.date)"
            :image="article.image"
            :badge="article.tags?.[0] ? { label: article.tags[0], color: 'primary' as const, variant: 'subtle' as const, to: `/tags/${article.tags[0]}` } : undefined"
            :to="article.path"
          />
        </UBlogPosts>

        <UEmpty v-else icon="i-lucide-newspaper" title="No articles yet" description="Check back soon." />
      </UContainer>
    </UPageBody>
  </div>
</template>
