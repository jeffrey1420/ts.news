<script setup lang="ts">
interface Props {
  title: string
  description?: string
  date?: string
  readTime?: number
  tags?: string[]
  slug: string
  featured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tags: () => [],
})

const formattedDate = computed(() => {
  if (!props.date) return null
  return new Date(props.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})
</script>

<template>
  <article
    class="card group cursor-pointer"
    :class="{ 'card-elevated': true }"
  >
    <NuxtLink :to="`/articles/${slug}`" class="block">
      <!-- Tags -->
      <div v-if="tags.length" class="flex flex-wrap gap-2 mb-3">
        <TagBadge v-for="tag in tags.slice(0, 3)" :key="tag" :tag="tag" />
      </div>
      
      <!-- Title -->
      <h2
        class="font-serif font-semibold text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
        :class="{ 'text-2xl': featured }"
      >
        {{ title }}
      </h2>
      
      <!-- Description -->
      <p v-if="description" class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {{ description }}
      </p>
      
      <!-- Meta -->
      <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span v-if="formattedDate" class="flex items-center gap-1.5">
          <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
          {{ formattedDate }}
        </span>
        <span v-if="readTime" class="flex items-center gap-1.5">
          <UIcon name="i-heroicons-clock" class="w-4 h-4" />
          {{ readTime }} min read
        </span>
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
