<script setup lang="ts">
const { data: articles } = await useAsyncData('articles', () => 
  queryContent('articles')
    .sort({ date: -1 })
    .find()
)
</script>

<template>
  <div>
    <section class="mb-12">
      <h1 class="text-4xl font-bold tracking-tight mb-4">
        Latest Articles
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        TypeScript and web technology news, no fluff.
      </p>
    </section>
    
    <section v-if="articles?.length" class="space-y-6">
      <article
        v-for="article in articles"
        :key="article._path"
        class="group"
      >
        <NuxtLink :to="article._path" class="block">
          <div class="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span v-if="article.date">{{ article.date }}</span>
              <span v-if="article.readTime">{{ article.readTime }} min read</span>
            </div>
            <h2 class="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {{ article.title }}
            </h2>
            <p v-if="article.description" class="text-gray-600 dark:text-gray-300">
              {{ article.description }}
            </p>
          </div>
        </NuxtLink>
      </article>
    </section>
    
    <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
      <p>No articles yet. Check back soon!</p>
    </div>
  </div>
</template>
