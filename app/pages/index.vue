<script setup lang="ts">
const { fetchAll, fetchFeatured } = useArticles()

const { data: allArticles } = await fetchAll()
const { data: featuredArticles } = await fetchFeatured()

const featured = computed(() => featuredArticles.value?.[0] || allArticles.value?.[0])
const latestArticles = computed(() => {
  if (!allArticles.value) return []
  // If first article is featured, start from second
  const featuredPath = featured.value?._path
  return allArticles.value.filter(a => a._path !== featuredPath).slice(0, 6)
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="mb-16">
      <div class="text-center mb-10">
        <h1 class="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          TypeScript & <span class="text-gradient">Web Tech</span> News
        </h1>
        <p class="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Clean, developer-focused coverage of TypeScript, frameworks, and modern web technologies. No fluff.
        </p>
      </div>
      
      <!-- Featured Article -->
      <ArticleHero
        v-if="featured"
        :title="featured.title"
        :description="featured.description"
        :date="featured.date"
        :read-time="featured.readTime"
        :tags="featured.tags || []"
        :slug="featured._path?.split('/').pop() || ''"
      />
    </section>
    
    <!-- Latest Articles -->
    <section>
      <div class="flex items-center justify-between mb-8">
        <h2 class="font-serif text-2xl md:text-3xl font-semibold">Latest Articles</h2>
        <NuxtLink
          to="/articles"
          class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View all
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>
      
      <div v-if="latestArticles.length" class="grid gap-6 md:grid-cols-2">
        <ArticleCard
          v-for="article in latestArticles"
          :key="article._path"
          :title="article.title"
          :description="article.description"
          :date="article.date"
          :read-time="article.readTime"
          :tags="article.tags || []"
          :slug="article._path?.split('/').pop() || ''"
        />
      </div>
      
      <div v-else class="text-center py-16">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
          <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-[var(--color-text-muted)]" />
        </div>
        <p class="text-[var(--color-text-secondary)]">No articles yet. Check back soon!</p>
      </div>
    </section>
    
    <!-- Newsletter CTA -->
    <section class="mt-20 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
      <h2 class="font-serif text-2xl md:text-3xl font-bold mb-4">Stay in the loop</h2>
      <p class="text-blue-100 mb-6 max-w-lg mx-auto">
        Get notified when new articles drop. No spam, just quality content about TypeScript and web tech.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          placeholder="you@example.com"
          class="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <button class="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors">
          Subscribe
        </button>
      </div>
    </section>
  </div>
</template>
