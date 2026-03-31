<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'
import { getCollectionName } from '~~/shared/utils/locale'
import { resolveTopicLabel, topicDefinitions } from '~~/shared/utils/topics'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const articlesCollection = computed(() => getCollectionName('articles', locale.value))

const { data: allArticles } = await useAsyncData(() => `home:${route.path}`, () =>
  queryCollection(articlesCollection.value).order('date', 'DESC').all()
)

const title = 'TypeScript & Web Dev News'
const description = computed(() => t('home.hero_description'))
const canonicalUrl = computed(() => absoluteSiteUrl(route.path))
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

const topicRails = computed(() =>
  topicDefinitions.map(topic => ({
    ...topic,
    label: resolveTopicLabel(topic, t),
  }))
)

function articlesByTags(tags: readonly string[], limit = 3) {
  return (allArticles.value ?? [])
    .filter(a => a.tags?.some(t => tags.includes(t)))
    .slice(0, limit)
}

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [
    {
      key: 'home-schema',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${title} | ${siteConfig.name}`,
        url: canonicalUrl.value,
        description: description.value,
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
            url: absoluteSiteUrl(localePath(article.path)),
            name: article.title,
          })),
        },
      }),
    },
  ],
}))

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value === 'en' ? 'en-US' : locale.value === 'fr' ? 'fr-FR' : 'de-DE', {
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
      :description="t('home.hero_description')"
      :links="[
        { label: t('home.read_articles'), to: localePath('/articles'), icon: 'i-lucide-newspaper', size: 'lg' },
      ]"
    />

    <UContainer>
      <UPageCTA
      :title="t('home.stay_in_loop')"
      :description="t('home.rss_description')"
      :links="[
          { label: t('home.subscribe_rss'), href: '/rss.xml', external: true, icon: 'i-lucide-rss', color: 'neutral', variant: 'outline' },
        ]"
      />
    </UContainer>

    <UPageSection
      v-if="featuredArticle"
      :headline="t('home.featured')"
      :title="featuredArticle.title"
    >
      <UBlogPost
        :title="featuredArticle.title"
        :description="featuredArticle.description"
        :date="formatDate(featuredArticle.date)"
        :image="featuredArticle.image"
        :badge="featuredArticle.tags?.[0] ? { label: featuredArticle.tags[0], color: 'primary' as const, variant: 'subtle' as const } : undefined"
        :to="localePath(featuredArticle.path)"
        orientation="horizontal"
      />
    </UPageSection>

    <USeparator />

    <UPageSection
      v-if="thisWeekArticles.length"
      :headline="t('home.this_week')"
      :title="t('home.this_week_description')"
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
          :to="localePath(article.path)"
        />
      </UBlogPosts>
    </UPageSection>

    <USeparator />

    <template v-for="rail in topicRails" :key="rail.slug">
      <UPageSection :title="t('home.latest_in_topic', { topic: rail.label })">
        <template #headline>
          <span class="inline-flex items-center gap-2">
            <UIcon :name="rail.icon" class="h-4 w-4" />
            {{ rail.label }}
          </span>
        </template>

        <UBlogPosts v-if="articlesByTags(rail.tags).length">
          <UBlogPost
            v-for="article in articlesByTags(rail.tags)"
            :key="article.path"
            :title="article.title"
            :description="article.description"
            :date="formatDate(article.date)"
            :image="article.image"
            :badge="article.tags?.[0] ? { label: article.tags[0], color: 'primary' as const, variant: 'subtle' as const } : undefined"
            :to="localePath(article.path)"
          />
        </UBlogPosts>
        <p v-else class="text-muted text-sm">
          {{ t('home.no_articles') }}
        </p>
      </UPageSection>
    </template>
  </div>
</template>
