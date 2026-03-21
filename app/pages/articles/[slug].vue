<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { fetchBySlug, formatDate } = useArticles()
const { data: article } = await fetchBySlug(slug)

if (!article.value) {
  throw createError({
    statusCode: 404,
    message: 'Article not found',
  })
}

useSeoMeta({
  title: () => `${article.value?.title ?? 'Article'} - ts.news`,
  description: () => article.value?.description ?? '',
  ogTitle: () => article.value?.title ?? '',
  ogDescription: () => article.value?.description ?? '',
})

// Reading progress
const readingProgress = ref(0)
const articleRef = ref<HTMLElement | null>(null)

const updateProgress = () => {
  if (!articleRef.value) return
  
  const element = articleRef.value
  const rect = element.getBoundingClientRect()
  const totalHeight = element.offsetHeight
  const windowHeight = window.innerHeight
  const scrolled = -rect.top + windowHeight
  
  readingProgress.value = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100))
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})

const formattedDate = computed(() => {
  if (!article.value?.date) return null
  return formatDate(article.value.date)
})
</script>

<template>
  <div>
    <!-- Reading Progress Bar -->
    <div
      class="reading-progress"
      :style="{ width: `${readingProgress}%` }"
    ></div>
    
    <article ref="articleRef">
      <!-- Article Header -->
      <header class="mb-12 max-w-[var(--max-width-content)]">
        <!-- Back link -->
        <NuxtLink
          to="/articles"
          class="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] mb-8 transition-colors"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Back to articles
        </NuxtLink>
        
        <!-- Tags -->
        <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mb-4">
          <TagBadge
            v-for="tag in article.tags"
            :key="tag"
            :tag="tag"
            size="md"
          />
        </div>
        
        <!-- Title -->
        <h1 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          {{ article.title }}
        </h1>
        
        <!-- Description -->
        <p v-if="article.description" class="text-xl text-[var(--color-text-secondary)] mb-6">
          {{ article.description }}
        </p>
        
        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-6 text-sm text-[var(--color-text-muted)] pb-8 border-b border-[var(--color-border)]">
          <span v-if="formattedDate" class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
            {{ formattedDate }}
          </span>
          <span v-if="article.readTime" class="flex items-center gap-2">
            <UIcon name="i-heroicons-clock" class="w-5 h-5" />
            {{ article.readTime }} min read
          </span>
        </div>
      </header>
      
      <!-- Article Content -->
      <div class="prose">
        <ContentRenderer :value="article" />
      </div>
      
      <!-- Article Footer -->
      <footer class="mt-16 pt-8 border-t border-[var(--color-border)]">
        <!-- Tags -->
        <div v-if="article.tags?.length" class="mb-8">
          <p class="text-sm text-[var(--color-text-muted)] mb-3">Filed under:</p>
          <div class="flex flex-wrap gap-2">
            <TagBadge
              v-for="tag in article.tags"
              :key="tag"
              :tag="tag"
            />
          </div>
        </div>
        
        <!-- Back link -->
        <NuxtLink
          to="/articles"
          class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Back to all articles
        </NuxtLink>
      </footer>
    </article>
  </div>
</template>

<style>
/* Override content component styles */
article .prose pre {
  position: relative;
}

article .prose pre::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: #1a1a1a;
  border-radius: 0.75rem 0.75rem 0 0;
  border-bottom: 1px solid #333;
}

article .prose img {
  border-radius: 0.75rem;
}
</style>
