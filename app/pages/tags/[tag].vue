<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'

const route = useRoute()
const tag = route.params.tag as string

const { data: allArticles } = await useAsyncData(`tag-${tag}`, () =>
  queryCollection('articles').order('date', 'DESC').all()
)

const taggedArticles = computed(() =>
  (allArticles.value ?? []).filter(article =>
    (article.tags ?? []).map(t => t.toLowerCase()).includes(tag.toLowerCase())
  )
)

const canonicalUrl = absoluteSiteUrl('/tags/' + tag)
const pageTitle = `Articles tagged "${tag}"`
const pageDescription = `Browse all articles tagged with "${tag}" on ${siteConfig.name}.`

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: `${pageTitle} | ${siteConfig.name}`,
  ogDescription: pageDescription,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogImage: absoluteSiteUrl(siteConfig.defaultOgImage),
  twitterTitle: `${pageTitle} | ${siteConfig.name}`,
  twitterDescription: pageDescription,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      key: 'tag-collection-schema',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle,
        description: pageDescription,
        url: canonicalUrl,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: taggedArticles.value.map((article, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteSiteUrl(article.path),
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
            name: 'Home',
            item: absoluteSiteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tags',
            item: absoluteSiteUrl('/tags'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tag,
            item: canonicalUrl,
          },
        ],
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
      :title="`#${tag}`"
      :description="pageDescription"
      class="mb-8"
    />

    <UPageBody>
    <UContainer>
      <template v-if="taggedArticles.length">
        <div class="mb-4 text-sm text-muted">
          {{ taggedArticles.length }} article{{ taggedArticles.length === 1 ? '' : 's' }} tagged with
          <UBadge :label="tag" variant="subtle" size="sm" />
        </div>

        <UBlogPosts>
          <UBlogPost
            v-for="article in taggedArticles"
            :key="article.path"
            :title="article.title"
            :description="article.description"
            :date="formatDate(article.date)"
            :image="article.image"
            :to="article.path"
          />
        </UBlogPosts>
      </template>

      <template v-else>
        <UEmpty
          icon="i-lucide-tag"
          title="No articles found"
          :description="`No articles are currently tagged with '${tag}'.`"
        >
          <template #footer>
            <UButton
              label="Browse all articles"
              to="/articles"
              color="primary"
            />
          </template>
        </UEmpty>
      </template>

      <USeparator class="my-12" />

      <div class="text-center">
        <UButton
          label="View all tags"
          to="/tags"
          variant="outline"
          color="neutral"
          size="sm"
        />
      </div>
      </UContainer>
    </UPageBody>
  </div>
</template>
