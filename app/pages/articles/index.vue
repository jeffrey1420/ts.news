<script setup lang="ts">
const { data: articles } = await useAsyncData('all-articles', () =>
  queryCollection('articles').order('date', 'DESC').all()
)

useSeoMeta({
  title: 'Articles — typescript.news',
  description: 'Everything we\'ve written so far.',
  ogTitle: 'Articles — typescript.news',
  ogDescription: 'Everything we\'ve written so far.',
  ogSiteName: 'typescript.news',
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
      title="Articles"
      description="Everything we've written so far."
    />

    <UPageBody>
      <UContainer>
        <UBlogPosts v-if="articles?.length">
          <UBlogPost
            v-for="article in articles"
            :key="article.path"
            :title="article.title"
            :description="article.description"
            :date="formatDate(article.date)"
            :image="article.image"
            :badge="article.tags?.[0] ? { label: article.tags[0], color: 'primary' as const, variant: 'subtle' as const } : undefined"
            :to="article.path"
          />
        </UBlogPosts>

        <UEmpty v-else icon="i-lucide-newspaper" title="No articles yet" description="Check back soon." />
      </UContainer>
    </UPageBody>
  </div>
</template>
