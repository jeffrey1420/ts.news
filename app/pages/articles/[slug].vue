<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'
import { getCollectionName, getLocaleLanguage } from '~~/shared/utils/locale'
import type { ContentSurroundLink } from '@nuxt/ui'

const route = useRoute()
const { loggedIn } = useUserSession()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const articlesCollection = computed(() => getCollectionName('articles', locale.value))
const slug = computed(() => String(route.params.slug))
const articlePath = computed(() => `/articles/${slug.value}`)

// Single list query matched in JS: @nuxt/content's query sanitizer rejects any
// SQL containing `--`, which breaks .path()/.first() for slugs with double dashes.
const { data: articles } = await useAsyncData(
  () => `article:${locale.value}:${slug.value}`,
  () => queryCollection(articlesCollection.value).order('date', 'DESC').all(),
  { watch: [locale, slug] }
)

const articleIndex = computed(() => (articles.value ?? []).findIndex(item => item.path === articlePath.value))
const article = computed(() => articleIndex.value >= 0 ? articles.value![articleIndex.value] : null)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

// Non-reactive snapshot for setup-time meta (matches the original behavior)
const currentArticle = article.value

// Articles are sorted date DESC: the next item is the older article, the previous one is newer
const surround = computed(() => {
  const list = articles.value ?? []
  return [list[articleIndex.value + 1] ?? null, (articleIndex.value > 0 ? list[articleIndex.value - 1] : null) ?? null]
})

const localizedSurround = computed(() =>
  (surround.value ?? []).map(item => (item ? { ...item, path: localePath(item.path) } : null)) as ContentSurroundLink[]
)

const relatedArticles = computed(() => {
  const currentTags = new Set(article.value?.tags ?? [])

  if (!currentTags.size) {
    return []
  }

  return (articles.value ?? [])
    .filter(candidate => candidate.path !== article.value?.path)
    .map((candidate) => {
      const sharedTags = (candidate.tags ?? []).filter(tag => currentTags.has(tag))

      return {
        ...candidate,
        sharedTags,
        sharedTagCount: sharedTags.length,
      }
    })
    .filter(candidate => candidate.sharedTagCount > 0)
    .sort((left, right) => {
      if (right.sharedTagCount !== left.sharedTagCount) {
        return right.sharedTagCount - left.sharedTagCount
      }

      return new Date(right.date).getTime() - new Date(left.date).getTime()
    })
    .slice(0, 3)
})

const { data: comments, refresh: refreshComments } = await useFetch('/api/comments', {
  query: { slug: route.path },
})

const canonicalUrl = computed(() => absoluteSiteUrl(route.path))
const localeLanguage = computed(() => getLocaleLanguage(locale.value))
const articleImage = currentArticle.image
  ? (currentArticle.image.startsWith('http') ? currentArticle.image : absoluteSiteUrl(currentArticle.image))
  : absoluteSiteUrl(siteConfig.defaultOgImage)
const articleTitle = currentArticle.title
const articleDescription = currentArticle.description
const articleTags = currentArticle.tags ?? []

useSeoMeta({
  title: articleTitle,
  description: articleDescription,
  author: currentArticle.author,
  keywords: articleTags.join(', '),
  ogTitle: `${articleTitle} | ${siteConfig.name}`,
  ogDescription: articleDescription,
  ogType: 'article',
  ogUrl: canonicalUrl,
  ogImage: articleImage,
  ogImageAlt: articleTitle,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  articlePublishedTime: currentArticle.date,
  articleModifiedTime: currentArticle.date,
  articleTag: articleTags,
  articleAuthor: currentArticle.author ? [currentArticle.author] : undefined,
  twitterTitle: `${articleTitle} | ${siteConfig.name}`,
  twitterDescription: articleDescription,
  twitterImage: articleImage,
})

useHead(() => ({
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    // Raw markdown version for LLM agents and readers
    { rel: 'alternate', type: 'text/markdown', title: `${articleTitle} (Markdown)`, href: absoluteSiteUrl(`/md/${locale.value}/articles/${slug.value}.md`) },
  ],
  script: [
    {
      key: 'article-schema',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: articleTitle,
        description: articleDescription,
        url: canonicalUrl.value,
        datePublished: new Date(currentArticle.date).toISOString(),
        dateModified: new Date(currentArticle.date).toISOString(),
        inLanguage: localeLanguage.value,
        image: [articleImage],
        articleSection: articleTags[0],
        keywords: articleTags.join(', '),
        wordCount: currentArticle.readingTime ? currentArticle.readingTime * 250 : articleDescription.split(/\s+/).length,
        isAccessibleForFree: true,
        author: {
          '@type': 'Person',
          name: currentArticle.author || siteConfig.name,
          url: absoluteSiteUrl(localePath(`/authors/${currentArticle.author || 'lschvn'}`)),
          sameAs: ['https://github.com/lschvn'],
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: siteConfig.url,
          logo: {
            '@type': 'ImageObject',
            url: absoluteSiteUrl(siteConfig.defaultOgImage),
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl.value,
        },
      }),
    },
    {
      key: 'article-breadcrumb-schema',
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
            name: t('nav.articles'),
            item: absoluteSiteUrl(localePath('/articles')),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: articleTitle,
            item: canonicalUrl.value,
          },
        ],
      }),
    },
    ...(currentArticle.faq?.length
      ? [{
          key: 'faq-schema',
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: (currentArticle.faq ?? []).map((item: { question: string, answer: string }) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }]
      : []),
  ],
}))

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value === 'en' ? 'en-US' : locale.value === 'fr' ? 'fr-FR' : 'de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const newComment = ref('')
const posting = ref(false)

async function postComment() {
  if (!newComment.value.trim()) return
  posting.value = true
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: { slug: route.path, content: newComment.value },
    })
    newComment.value = ''
    await refreshComments()
  } finally {
    posting.value = false
  }
}

</script>

<template>
  <article v-if="article" class="max-w-2xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
    <!-- Header -->
    <header class="mb-12">
      <NuxtImg
        v-if="article.image"
        :src="article.image"
        :alt="article.title"
        width="1200"
        height="630"
        format="webp"
        sizes="100vw sm:672px"
        loading="eager"
        fetchpriority="high"
        preload
        class="w-full h-64 object-cover rounded-lg mb-8"
      />
      <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mb-6">
        <NuxtLink
          v-for="tag in article.tags"
          :key="tag"
          :to="localePath(`/tags/${tag}`)"
        >
          <UBadge
            :label="tag"
            variant="subtle"
            size="sm"
          />
        </NuxtLink>
      </div>

      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-highlighted leading-tight mb-6">
        {{ article.title }}
      </h1>

      <div class="flex flex-wrap items-center gap-4 text-sm text-muted">
        <NuxtLink v-if="article.author" :to="localePath(`/authors/${article.author}`)" class="flex items-center gap-2 font-medium text-default hover:text-primary transition-colors">
          <UIcon name="i-lucide-user" class="w-4 h-4" />
          {{ article.author }}
        </NuxtLink>
        <time :datetime="article.date">{{ formatDate(article.date) }}</time>
        <span v-if="article.readingTime">{{ article.readingTime }} {{ t('article.min_read') }}</span>
      </div>
    </header>

    <USeparator class="mb-12" />

    <aside v-if="article.tldr?.length" class="mb-10 p-5 rounded-lg border border-primary/20 bg-primary/5">
      <h2 class="text-lg font-bold text-highlighted mb-3 flex items-center gap-2">
        <UIcon name="i-lucide-lightbulb" class="w-5 h-5 text-primary" />
        {{ t('article.tldr') }}
      </h2>
      <ul class="space-y-2">
        <li v-for="(item, index) in article.tldr" :key="index" class="flex gap-2 text-default">
          <span class="text-primary mt-1">&#x2022;</span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </aside>

    <!-- Body -->
    <div class="article-content">
      <ContentRenderer :value="article" />
    </div>

    <!-- FAQ -->
    <section v-if="article.faq?.length" class="my-12">
      <USeparator class="mb-8" />
      <h2 class="text-xl font-bold text-highlighted mb-6">{{ t('article.faq_title') }}</h2>
      <UAccordion
        :items="article.faq.map((item: any) => ({ label: item.question, content: item.answer }))"
        :unmount-on-hide="false"
      />
    </section>

    <!-- Prev / Next -->
    <USeparator class="my-12" />
    <UContentSurround :surround="localizedSurround" />

    <!-- Related articles -->
    <template v-if="relatedArticles?.length">
      <USeparator class="my-12" />

      <section>
        <h2 class="text-xl font-bold text-highlighted mb-3">{{ t('article.related') }}</h2>
        <p class="text-sm text-muted mb-8">
          {{ t('article.related_description') }}
        </p>

        <UCarousel
          v-slot="{ item }"
          :items="relatedArticles"
          orientation="horizontal"
          :arrows="true"
          :dots="true"
          class="w-full"
        >
          <UBlogPost
            :title="item.title"
            :description="item.description"
            :date="formatDate(item.date)"
            :image="item.image"
            :badge="item.sharedTags?.[0] ? { label: item.sharedTags[0], color: 'primary' as const, variant: 'subtle' as const } : undefined"
            :to="localePath(item.path)"
            class="mx-2"
          />
        </UCarousel>
      </section>
    </template>

    <!-- Comments -->
    <USeparator class="my-12" />

    <section>
      <h2 class="text-xl font-bold text-highlighted mb-8">{{ t('article.comments') }}</h2>

      <!-- Post form -->
      <div v-if="loggedIn" class="mb-10">
        <UTextarea
          v-model="newComment"
          :placeholder="t('article.share_thoughts')"
          :rows="3"
          class="mb-3"
        />
        <UButton
          :label="t('article.post_comment')"
          :loading="posting"
          :disabled="!newComment.trim()"
          size="sm"
          @click="postComment"
        />
      </div>
      <div v-else class="mb-10 p-5 rounded-lg bg-muted text-center">
        <p class="text-sm text-muted">
          <NuxtLink :to="localePath('/login')" class="text-primary font-medium underline underline-offset-2">{{ t('common.login') }}</NuxtLink>
          {{ t('article.login_to_comment') }}
        </p>
      </div>

      <!-- List -->
      <div v-if="comments?.length" class="space-y-8">
        <div v-for="comment in (comments as any[])" :key="comment.id">
          <div class="flex items-center gap-3 mb-1.5">
            <span class="text-sm font-medium text-highlighted">{{ comment.author_name }}</span>
            <span class="text-xs text-dimmed">{{ formatDate(comment.created_at) }}</span>
          </div>
          <p class="text-default leading-relaxed">{{ comment.content }}</p>
        </div>
      </div>
      <p v-else class="text-sm text-muted">{{ t('article.no_comments') }}</p>
    </section>
  </article>
</template>

<style scoped>
.article-content {
  font-size: 1.125rem;
  line-height: 1.8;
}

.article-content :deep(p) {
  margin-bottom: 1.5em;
}

.article-content :deep(h2) {
  margin-top: 2.5em;
  margin-bottom: 1em;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.article-content :deep(h3) {
  margin-top: 2em;
  margin-bottom: 0.75em;
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.4;
}

.article-content :deep(blockquote) {
  border-left: 3px solid var(--ui-primary);
  padding-left: 1.25em;
  margin: 2em 0;
  font-style: italic;
}

.article-content :deep(blockquote p) {
  margin-bottom: 0;
}

.article-content :deep(hr) {
  margin: 3em 0;
  border: none;
  border-top: 1px solid var(--ui-border-muted);
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin-bottom: 1.5em;
  padding-left: 1.5em;
}

.article-content :deep(li) {
  margin-bottom: 0.5em;
}

.article-content :deep(strong) {
  font-weight: 600;
  color: var(--ui-text-highlighted);
}

.article-content :deep(a) {
  color: var(--ui-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.article-content :deep(a:hover) {
  text-decoration-thickness: 2px;
}

.article-content :deep(pre) {
  margin: 2em 0;
  border-radius: 0.5rem;
}

.article-content :deep(table) {
  margin: 2em 0;
}
</style>
