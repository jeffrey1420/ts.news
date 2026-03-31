<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'

const route = useRoute()
const slug = route.params.slug as string

const { data: author } = await useAsyncData(`author-${slug}`, () =>
  queryCollection('authors').path(`/authors/${slug}`).first()
)

if (!author.value) {
  throw createError({ statusCode: 404, statusMessage: 'Author not found', fatal: true })
}

const { data: articles } = await useAsyncData(`author-${slug}-articles`, async () => {
  const allArticles = await queryCollection('articles')
    .order('date', 'DESC')
    .all()

  return allArticles.filter(article => article.author === slug)
})

const authorName = author.value.name
const authorBio = author.value.bio
const canonicalUrl = absoluteSiteUrl(`/authors/${slug}`)

const authorImage = author.value.avatar
  ? (author.value.avatar.startsWith('http') ? author.value.avatar : absoluteSiteUrl(author.value.avatar))
  : absoluteSiteUrl(siteConfig.defaultOgImage)

useSeoMeta({
  title: `${authorName} — Author`,
  description: authorBio,
  ogTitle: `${authorName} | ${siteConfig.name}`,
  ogDescription: authorBio,
  ogType: 'profile',
  ogUrl: canonicalUrl,
  ogImage: authorImage,
  ogImageAlt: `${authorName} profile picture`,
  twitterTitle: `${authorName} | ${siteConfig.name}`,
  twitterDescription: authorBio,
  twitterImage: authorImage,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      key: 'author-schema',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: authorName,
        description: authorBio,
        url: canonicalUrl,
        sameAs: [
          author.value.github,
          author.value.twitter,
          author.value.website,
        ].filter(Boolean),
      }),
    },
    {
      key: 'author-breadcrumb-schema',
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
            name: 'Authors',
            item: absoluteSiteUrl('/authors'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: authorName,
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
  <article v-if="author" class="max-w-2xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
    <!-- Breadcrumb -->
    <nav class="mb-8">
      <ol class="flex items-center gap-2 text-sm text-muted">
        <li><NuxtLink to="/" class="hover:text-default transition-colors">Home</NuxtLink></li>
        <li>/</li>
        <li class="text-default">{{ author.name }}</li>
      </ol>
    </nav>

    <!-- Author Header -->
    <UCard class="mb-12">
      <div class="flex items-start gap-6">
        <div class="flex-shrink-0 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <UIcon name="i-lucide-user" class="w-8 h-8 text-muted" />
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-highlighted mb-3">
            {{ author.name }}
          </h1>
          <p class="text-default leading-relaxed mb-4">{{ author.bio }}</p>
          <div class="flex items-center gap-4">
            <UButton
              v-if="author.github"
              :to="author.github"
              icon="i-lucide-github"
              variant="outline"
              size="sm"
              target="_blank"
              label="GitHub"
            />
            <UButton
              v-if="author.twitter"
              :to="author.twitter"
              icon="i-lucide-twitter"
              variant="outline"
              size="sm"
              target="_blank"
              label="Twitter"
            />
            <UButton
              v-if="author.website"
              :to="author.website"
              icon="i-lucide-globe"
              variant="outline"
              size="sm"
              target="_blank"
              label="Website"
            />
          </div>
        </div>
      </div>
    </UCard>

    <!-- Articles by Author -->
    <section v-if="articles?.length">
      <h2 class="text-xl font-bold text-highlighted mb-8">Articles by {{ author.name }}</h2>

      <div class="space-y-8">
        <NuxtLink
          v-for="article in articles"
          :key="article.path"
          :to="article.path"
          class="block group"
        >
          <UCard class="hover:ring-1 hover:ring-default transition-all">
            <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mb-3">
              <UBadge
                v-for="tag in article.tags.slice(0, 3)"
                :key="tag"
                :label="tag"
                variant="subtle"
                size="xs"
              />
            </div>
            <h3 class="text-lg font-semibold text-highlighted group-hover:text-primary transition-colors mb-2">
              {{ article.title }}
            </h3>
            <p class="text-sm text-muted line-clamp-2 mb-3">{{ article.description }}</p>
            <div class="flex items-center gap-3 text-xs text-dimmed">
              <time :datetime="article.date">{{ formatDate(article.date) }}</time>
              <span v-if="article.readingTime">{{ article.readingTime }} min read</span>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </section>

    <p v-else class="text-sm text-muted">No articles published yet.</p>
  </article>
</template>
