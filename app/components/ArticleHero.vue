<script setup lang="ts">
interface Props {
  title: string
  description?: string
  date?: string
  readTime?: number
  tags?: string[]
  slug: string
}

const props = withDefaults(defineProps<Props>(), {
  tags: () => [],
})

const formattedDate = computed(() => {
  if (!props.date) return null
  return new Date(props.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<template>
  <article class="relative overflow-hidden rounded-2xl">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950"></div>
    
    <!-- Decorative elements -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
    <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3"></div>
    
    <NuxtLink :to="`/articles/${slug}`" class="block relative p-8 md:p-12">
      <!-- Featured label -->
      <div class="flex items-center gap-2 mb-4">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
          <UIcon name="i-heroicons-star-solid" class="w-4 h-4" />
          Featured
        </span>
      </div>
      
      <!-- Tags -->
      <div v-if="tags.length" class="flex flex-wrap gap-2 mb-4">
        <TagBadge v-for="tag in tags.slice(0, 2)" :key="tag" :tag="tag" variant="light" />
      </div>
      
      <!-- Title -->
      <h2 class="font-serif text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
        {{ title }}
      </h2>
      
      <!-- Description -->
      <p v-if="description" class="text-blue-100/90 text-lg mb-6 max-w-2xl line-clamp-2">
        {{ description }}
      </p>
      
      <!-- Meta -->
      <div class="flex items-center gap-6 text-white/80 text-sm">
        <span v-if="formattedDate" class="flex items-center gap-2">
          <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
          {{ formattedDate }}
        </span>
        <span v-if="readTime" class="flex items-center gap-2">
          <UIcon name="i-heroicons-clock" class="w-5 h-5" />
          {{ readTime }} min read
        </span>
      </div>
      
      <!-- CTA -->
      <div class="mt-6 flex items-center gap-2 text-white font-medium group/cta">
        <span>Read article</span>
        <UIcon
          name="i-heroicons-arrow-right"
          class="w-5 h-5 transition-transform group-hover/cta:translate-x-1"
        />
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
