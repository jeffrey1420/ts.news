<script setup lang="ts">
const { fetchAll } = useArticles()
const { data: articles } = await fetchAll()
</script>

<template>
  <div>
    <section class="mb-12">
      <h1 class="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Articles
      </h1>
      <p class="text-lg text-[var(--color-text-secondary)]">
        All TypeScript and web technology articles.
      </p>
    </section>
    
    <section v-if="articles?.length" class="grid gap-6 md:grid-cols-2">
      <ArticleCard
        v-for="article in articles"
        :key="article._path"
        :title="article.title"
        :description="article.description"
        :date="article.date"
        :read-time="article.readTime"
        :tags="article.tags || []"
        :slug="article._path?.split('/').pop() || ''"
      />
    </section>
    
    <div v-else class="text-center py-20">
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
        <UIcon name="i-heroicons-document-text" class="w-10 h-10 text-[var(--color-text-muted)]" />
      </div>
      <p class="text-lg text-[var(--color-text-secondary)] mb-2">No articles yet</p>
      <p class="text-sm text-[var(--color-text-muted)]">Check back soon for quality content</p>
    </div>
  </div>
</template>
