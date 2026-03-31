<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'
import { getCollectionName, DEFAULT_LOCALE } from '~~/shared/utils/locale'

const route = useRoute()
const { loggedIn } = useUserSession()
const { locale, t } = useI18n()

const articlesCollection = computed(() => getCollectionName('articles', locale.value))

const { data: article } = await useAsyncData(route.path, async () => {
  // Try current locale first
  let content = await queryCollection(articlesCollection.value).path(route.path).first()

  // Fallback to English if not found
  if (!content && locale.value !== DEFAULT_LOCALE) {
    content = await queryCollection(getCollectionName('articles', DEFAULT_LOCALE)).path(route.path).first()
  }

  // Redirect to English version if content exists there
  if (!content && locale.value !== DEFAULT_LOCALE) {
    const enPath = route.path.replace(/^\/[a-z]{2}\//, '/')
    navigateTo(enPath, { redirectCode: 302 })
  }

  return content
})

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings(articlesCollection.value, route.path)
)

const { data: relatedArticles } = await useAsyncData(`${route.path}-related`, async () => {
  const currentTags = new Set(article.value?.tags ?? [])

  if (!currentTags.size) {
    return []
  }

  const articles = await queryCollection(articlesCollection.value)
    .order('date', 'DESC')
    .all()

  return articles
    .filter(candidate => candidate.path !== route.path)
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

const canonicalUrl = absoluteSiteUrl(route.path)
const articleImage = article.value.image
  ? (article.value.image.startsWith('http') ? article.value.image : absoluteSiteUrl(article.value.image))
  : absoluteSiteUrl(siteConfig.defaultOgImage)
const articleTitle = article.value.title
const articleDescription = article.value.description
const articleTags = article.value.tags ?? []

useSeoMeta({
  title: articleTitle,
  description: articleDescription,
  author: article.value.author,
  keywords: articleTags.join(', '),
  ogTitle: `${articleTitle} | ${siteConfig.name}`,
  ogDescription: articleDescription,
  ogType: 'article',
  ogUrl: canonicalUrl,
  ogImage: articleImage,
  ogImageAlt: articleTitle,
  articlePublishedTime: article.value.date,
  articleModifiedTime: article.value.date,
  articleTag: articleTags,
  articleAuthor: article.value.author,
  twitterTitle: `${articleTitle} | ${siteConfig.name}`,
  twitterDescription: articleDescription,
  twitterImage: articleImage,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      key: 'article-schema',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: articleTitle,
        description: articleDescription,
        url: canonicalUrl,
        datePublished: new Date(article.value.date).toISOString(),
        dateModified: new Date(article.value.date).toISOString(),
        inLanguage: locale.value === 'en' ? 'en-US' : locale.value === 'fr' ? 'fr-FR' : 'de-DE',
        image: [articleImage],
        articleSection: articleTags[0],
        keywords: articleTags,
        wordCount: article.value.readingTime ? article.value.readingTime * 250 : articleDescription.split(/\s+/).length,
        isAccessibleForFree: true,
        author: {
          '@type': 'Person',
          name: article.value.author || siteConfig.name,
          url: absoluteSiteUrl('/authors/' + (article.value.author || 'lschvn')),
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
          '@id': canonicalUrl,
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
            item: absoluteSiteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('nav.articles'),
            item: absoluteSiteUrl('/articles'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: articleTitle,
            item: canonicalUrl,
          },
        ],
      }),
    },
    ...(article.value.faq?.length
      ? [{
          key: 'faq-schema',
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: (article.value.faq ?? []).map((item: any) => ({
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
})

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
        loading="lazy"
        class="w-full h-64 object-cover rounded-lg mb-8"
      />
      <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mb-6">
        <NuxtLink
          v-for="tag in article.tags"
          :key="tag"
          :to="'/tags/' + tag"
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
        <NuxtLink v-if="article.author" :to="'/authors/' + article.author" class="flex items-center gap-2 font-medium text-default hover:text-primary transition-colors">
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
    <UContentSurround :surround="surround" />

    <!-- Related articles -->
    <template v-if="relatedArticles?.length">
      <USeparator class="my-12" />

      <section>
        <h2 class="text-xl font-bold text-highlighted mb-3">{{ t('article.related') }}</h2>
        <p class="text-sm text-muted mb-8">
          {{ t('article.related_description') }}
        </p>

        <UCarousel
          v-slot="{ item, index }"
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
            :to="item.path"
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
          <NuxtLink to="/login" class="text-primary font-medium underline underline-offset-2">{{ t('common.login') }}</NuxtLink>
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
