<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'
import { getCollectionName } from '~~/shared/utils/locale'
import { getTopicMeta } from '~~/shared/utils/topics'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const articlesCollection = computed(() => getCollectionName('articles', locale.value))

const { data: articles } = await useAsyncData(() => `tags:${route.path}`, () =>
  queryCollection(articlesCollection.value).order('date', 'DESC').all()
)

const allTags = computed(() => {
  const tagSet = new Set<string>()
  for (const article of articles.value ?? []) {
    for (const tag of article.tags ?? []) {
      tagSet.add(tag)
    }
  }
  return [...tagSet].sort()
})

const title = computed(() => t('tag.view_all_tags'))
const description = `Browse all article tags on ${siteConfig.name}.`
const canonicalUrl = computed(() => absoluteSiteUrl(route.path))

useSeoMeta({
  title,
  description,
  ogTitle: computed(() => `${title.value} | ${siteConfig.name}`),
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogImage: absoluteSiteUrl(siteConfig.defaultOgImage),
  ogImageAlt: siteConfig.name,
  twitterTitle: `${title} | ${siteConfig.name}`,
  twitterDescription: description,
  twitterImage: absoluteSiteUrl(siteConfig.defaultOgImage),
})

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
}))
</script>

<template>
  <div>
    <UPageHero
      :title="t('tag.view_all_tags')"
      :description="description"
    />

    <UPageBody>
      <UContainer>
        <div v-if="allTags.length" class="flex flex-wrap gap-3">
          <NuxtLink
            v-for="tag in allTags"
            :key="tag"
            :to="localePath(`/tags/${tag}`)"
          >
            <UBadge
              :label="tag"
              :icon="getTopicMeta(tag, t).icon"
              variant="subtle"
              size="lg"
              class="hover:bg-primary/20 transition-colors cursor-pointer"
            />
          </NuxtLink>
        </div>
        <UEmpty
          v-else
          icon="i-lucide-tag"
          :title="t('tag.no_articles')"
          :description="t('articles.check_back')"
        />
      </UContainer>
    </UPageBody>
  </div>
</template>
