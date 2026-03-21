<script setup lang="ts">
const route = useRoute()
const { data: article } = await useAsyncData(route.path, () =>
  queryContent(route.path).findOne()
)

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
</script>

<template>
  <article v-if="article">
    <header class="mb-8">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span v-if="article.date">{{ article.date }}</span>
        <span v-if="article.readTime">{{ article.readTime }} min read</span>
      </div>
      <h1 class="text-4xl font-bold tracking-tight">
        {{ article.title }}
      </h1>
      <p v-if="article.description" class="text-xl text-gray-600 dark:text-gray-300 mt-4">
        {{ article.description }}
      </p>
    </header>
    
    <div class="prose prose-lg dark:prose-invert max-w-none">
      <ContentRenderer :value="article" />
    </div>
    
    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Back to articles
      </NuxtLink>
    </div>
  </article>
</template>
