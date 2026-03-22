<script setup lang="ts">
const { data: articles } = await useAsyncData('latest-articles', () =>
  queryCollection('articles').order('date', 'DESC').limit(6).all()
)

useSeoMeta({
  title: 'typescript.news — TypeScript & Web Dev News',
  description: 'What\'s happening in TypeScript and the web platform, written by people who ship code.',
  ogTitle: 'typescript.news — TypeScript & Web Dev News',
  ogDescription: 'What\'s happening in TypeScript and the web platform, written by people who ship code.',
  ogType: 'website',
  ogSiteName: 'typescript.news',
  twitterCard: 'summary',
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
      title="typescript.news"
      description="What's happening in TypeScript and the web platform, written by people who ship code."
      :links="[
        { label: 'Read articles', to: '/articles', icon: 'i-lucide-newspaper', size: 'lg' },
      ]"
    />

    <UPageSection headline="Latest" title="Recent articles">
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
    </UPageSection>
  </div>
</template>
