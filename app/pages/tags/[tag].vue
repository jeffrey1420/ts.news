<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'
import { getCollectionName } from '~~/shared/utils/locale'
import { getTopicMeta } from '~~/shared/utils/topics'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const tag = route.params.tag as string

const articlesCollection = computed(() => getCollectionName('articles', locale.value))
const { data: taggedArticles } = await useAsyncData(() => `tag:${locale.value}:${tag}`, async () => {
  const articles = await queryCollection(articlesCollection.value).order('date', 'DESC').all()

  return articles.filter(article =>
    (article.tags ?? []).some(value => value.toLowerCase() === tag.toLowerCase())
  )
})

const canonicalUrl = computed(() => absoluteSiteUrl(route.path))
const pageTitle = `Articles tagged "${tag}"`
const pageDescription = computed(() => t('tag.no_tagged', { tag }))
const topicMeta = computed(() => getTopicMeta(tag, t))

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: `${pageTitle} | ${siteConfig.name}`,
  ogDescription: pageDescription,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogImage: absoluteSiteUrl(siteConfig.defaultOgImage),
  ogImageAlt: siteConfig.name,
  twitterTitle: `${pageTitle} | ${siteConfig.name}`,
  twitterDescription: pageDescription,
  twitterImage: absoluteSiteUrl(siteConfig.defaultOgImage),
})

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [
    {
      key: 'tag-collection-schema',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle,
        description: pageDescription.value,
        url: canonicalUrl.value,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: taggedArticles.value.map((article, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteSiteUrl(localePath(article.path)),
            name: article.title,
          })),
        },
      }),
    },
    {
      key: 'tag-breadcrumb-schema',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('nav.home'),
            item: absoluteSiteUrl(localePath('/')),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('nav.topics'),
            item: absoluteSiteUrl(localePath('/tags')),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tag,
            item: canonicalUrl.value,
          },
        ],
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
      :title="`#${tag}`"
      :description="pageDescription"
      class="mb-8"
    />

    <UPageBody>
    <UContainer>
      <template v-if="taggedArticles.length">
        <div class="mb-4 text-sm text-muted">
          {{ taggedArticles.length }} article{{ taggedArticles.length === 1 ? '' : 's' }} tagged with
          <UBadge :label="tag" :icon="topicMeta.icon" variant="subtle" size="sm" />
        </div>

        <UBlogPosts>
          <UBlogPost
            v-for="article in taggedArticles"
            :key="article.path"
            :title="article.title"
            :description="article.description"
            :date="formatDate(article.date)"
            :image="article.image"
            :to="localePath(article.path)"
          />
        </UBlogPosts>
      </template>

      <template v-else>
        <UEmpty
          icon="i-lucide-tag"
          :title="t('tag.no_articles')"
          :description="t('tag.no_tagged', { tag })"
        >
          <template #footer>
            <UButton
              :label="t('tag.browse_all')"
              :to="localePath('/articles')"
              color="primary"
            />
          </template>
        </UEmpty>
      </template>

      <USeparator class="my-12" />

      <div class="text-center">
        <UButton
          :label="t('tag.view_all_tags')"
          :to="localePath('/tags')"
          variant="outline"
          color="neutral"
          size="sm"
        />
      </div>
      </UContainer>
    </UPageBody>
  </div>
</template>
