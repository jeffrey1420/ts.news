<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'

const { data: allArticles } = await useAsyncData('all-articles', () =>
  queryCollection('articles').order('date', 'DESC').all()
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

const featuredArticle = computed(() => allArticles.value?.[0] ?? null)

const sevenDaysAgo = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d
})

const thisWeekArticles = computed(() =>
  (allArticles.value ?? []).filter(a => new Date(a.date) >= sevenDaysAgo.value)
)

const topicRails = [
  { label: 'TypeScript', tags: ['typescript'] },
  { label: 'Tooling', tags: ['tooling', 'vite'] },
  { label: 'Frameworks', tags: ['framework', 'astro'] },
  { label: 'Security', tags: ['security'] },
  { label: 'AI Devtools', tags: ['ai'] },
] as const

function articlesByTags(tags: readonly string[], limit = 3) {
  return (allArticles.value ?? [])
    .filter(a => a.tags?.some(t => tags.includes(t)))
    .slice(0, limit)
}

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
        hasPart: {
          '@type': 'ItemList',
          itemListElement: (allArticles.value ?? []).map((article, index) => ({
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
      title="typescript.news"
      description="Daily TypeScript, JavaScript, and web platform news for developers who ship code."
      :links="[
        { label: 'Read articles', to: '/articles', icon: 'i-lucide-newspaper', size: 'lg' },
      ]"
    />

    <UContainer>
      <UPageCTA
        title="Stay in the loop"
        description="Subscribe to our RSS feed — never miss a story."
        :links="[
          { label: 'Subscribe via RSS', to: '/rss.xml', icon: 'i-lucide-rss', color: 'neutral', variant: 'outline' },
        ]"
      />
    </UContainer>

    <UPageSection
      v-if="featuredArticle"
      headline="Featured"
      :title="featuredArticle.title"
    >
      <UBlogPost
        :title="featuredArticle.title"
        :description="featuredArticle.description"
        :date="formatDate(featuredArticle.date)"
        :image="featuredArticle.image"
        :badge="featuredArticle.tags?.[0] ? { label: featuredArticle.tags[0], color: 'primary' as const, variant: 'subtle' as const } : undefined"
        :to="featuredArticle.path"
        orientation="horizontal"
      />
    </UPageSection>

    <USeparator />

    <UPageSection
      v-if="thisWeekArticles.length"
      headline="This Week in TS"
      title="What happened this week"
    >
      <UBlogPosts>
        <UBlogPost
          v-for="article in thisWeekArticles"
          :key="article.path"
          :title="article.title"
          :description="article.description"
          :date="formatDate(article.date)"
          :image="article.image"
          :badge="article.tags?.[0] ? { label: article.tags[0], color: 'primary' as const, variant: 'subtle' as const } : undefined"
          :to="article.path"
        />
      </UBlogPosts>
    </UPageSection>

    <USeparator />

    <template v-for="rail in topicRails" :key="rail.label">
      <UPageSection :headline="rail.label" :title="`Latest in ${rail.label}`">
        <UBlogPosts v-if="articlesByTags(rail.tags).length">
          <UBlogPost
            v-for="article in articlesByTags(rail.tags)"
            :key="article.path"
            :title="article.title"
            :description="article.description"
            :date="formatDate(article.date)"
            :image="article.image"
            :badge="article.tags?.[0] ? { label: article.tags[0], color: 'primary' as const, variant: 'subtle' as const } : undefined"
            :to="article.path"
          />
        </UBlogPosts>
        <p v-else class="text-muted text-sm">
          No articles yet.
        </p>
      </UPageSection>
    </template>
  </div>
</template>
