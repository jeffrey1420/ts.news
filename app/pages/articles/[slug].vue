<script setup lang="ts">
const route = useRoute()
const { loggedIn } = useUserSession()

const { data: article } = await useAsyncData(route.path, () =>
  queryCollection('articles').path(route.path).first()
)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('articles', route.path)
)

const { data: comments, refresh: refreshComments } = await useFetch('/api/comments', {
  query: { slug: route.path },
})

useSeoMeta({
  title: `${article.value.title} — typescript.news`,
  description: article.value.description,
  ogTitle: article.value.title,
  ogDescription: article.value.description,
  ogType: 'article',
  ogSiteName: 'typescript.news',
  articlePublishedTime: article.value.date,
  twitterCard: 'summary',
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
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
      <img
        v-if="article.image"
        :src="article.image"
        :alt="article.title"
        class="w-full h-64 object-cover rounded-lg mb-8"
      />
      <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mb-6">
        <UBadge
          v-for="tag in article.tags"
          :key="tag"
          :label="tag"
          variant="subtle"
          size="sm"
        />
      </div>

      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-highlighted leading-tight mb-6">
        {{ article.title }}
      </h1>

      <div class="flex flex-wrap items-center gap-4 text-sm text-muted">
        <span v-if="article.author" class="font-medium text-default">{{ article.author }}</span>
        <time :datetime="article.date">{{ formatDate(article.date) }}</time>
        <span v-if="article.readingTime">{{ article.readingTime }} min read</span>
      </div>
    </header>

    <USeparator class="mb-12" />

    <!-- Body -->
    <div class="article-content">
      <ContentRenderer :value="article" />
    </div>

    <!-- Prev / Next -->
    <USeparator class="my-12" />
    <UContentSurround :surround="surround" />

    <!-- Comments -->
    <USeparator class="my-12" />

    <section>
      <h2 class="text-xl font-bold text-highlighted mb-8">Comments</h2>

      <!-- Post form -->
      <div v-if="loggedIn" class="mb-10">
        <UTextarea
          v-model="newComment"
          placeholder="Share your thoughts..."
          :rows="3"
          class="mb-3"
        />
        <UButton
          label="Post comment"
          :loading="posting"
          :disabled="!newComment.trim()"
          size="sm"
          @click="postComment"
        />
      </div>
      <div v-else class="mb-10 p-5 rounded-lg bg-muted text-center">
        <p class="text-sm text-muted">
          <NuxtLink to="/login" class="text-primary font-medium underline underline-offset-2">Log in</NuxtLink>
          to join the conversation.
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
      <p v-else class="text-sm text-muted">No comments yet. Be the first to share your thoughts.</p>
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
