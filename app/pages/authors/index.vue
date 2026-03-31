<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'
import { getCollectionName } from '~~/shared/utils/locale'

const route = useRoute()
const { locale, t } = useI18n()

const authorsCollection = computed(() => getCollectionName('authors', locale.value))
const articlesCollection = computed(() => getCollectionName('articles', locale.value))

const { data: authors } = await useAsyncData(() => `authors:${route.path}`, () =>
  queryCollection(authorsCollection.value).all()
)

const { data: articles } = await useAsyncData(() => `authors:${route.path}:counts`, () =>
  queryCollection(articlesCollection.value).all()
)

const authorsWithCounts = computed(() => {
  return (authors.value ?? []).map(author => {
    const count = (articles.value ?? []).filter(a => a.author === author.path.split('/').pop()).length
    return { ...author, articleCount: count }
  })
})

const title = computed(() => t('nav.about'))
const description = `Meet the writers behind ${siteConfig.name}.`
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
      :title="t('nav.about')"
      :description="description"
    />

    <UPageBody>
      <UContainer>
        <div v-if="authorsWithCounts.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="author in authorsWithCounts"
            :key="author.path"
            :to="localePath(author.path)"
            class="block group"
          >
            <UCard class="hover:ring-1 hover:ring-default transition-all">
              <div class="flex items-center gap-4 mb-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <UIcon name="i-lucide-user" class="w-6 h-6 text-muted" />
                </div>
                <div>
                  <h3 class="font-semibold text-highlighted group-hover:text-primary transition-colors">
                    {{ author.name }}
                  </h3>
                  <p class="text-xs text-dimmed">{{ author.articleCount }} articles</p>
                </div>
              </div>
              <p class="text-sm text-muted line-clamp-2">{{ author.bio }}</p>
            </UCard>
          </NuxtLink>
        </div>
        <UEmpty
          v-else
          icon="i-lucide-users"
          :title="t('author.no_articles')"
          :description="t('articles.check_back')"
        />
      </UContainer>
    </UPageBody>
  </div>
</template>
