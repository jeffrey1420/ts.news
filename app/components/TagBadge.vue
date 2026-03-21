<script setup lang="ts">
interface Props {
  tag: string
  variant?: 'default' | 'light'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'sm',
})

const tagClass = computed(() => {
  const normalized = props.tag.toLowerCase().replace(/\s+/g, '-')
  const knownTags = [
    'typescript', 'javascript', 'vue', 'react', 'nuxt', 'next',
    'announcement', 'tutorial', 'news', 'guide', 'opinion'
  ]
  return knownTags.includes(normalized) ? `tag-${normalized}` : 'tag-default'
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center font-medium rounded-full transition-colors',
      tagClass,
      variant === 'light'
        ? 'bg-white/20 text-white'
        : 'bg-[var(--tag-bg)] text-[var(--tag-color)]',
      size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
    ]"
  >
    {{ tag }}
  </span>
</template>
