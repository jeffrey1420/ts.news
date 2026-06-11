<script setup lang="ts">
const props = defineProps<{
  items: Array<{ title: string, path: string }>
}>()

const localePath = useLocalePath()

// duplicated for a seamless CSS loop
const loop = computed(() => [...props.items, ...props.items])
</script>

<template>
  <div class="marquee border-y border-default bg-elevated/60 backdrop-blur-sm overflow-hidden" aria-hidden="false">
    <div class="marquee-track flex items-center gap-0 py-3">
      <NuxtLink
        v-for="(item, index) in loop"
        :key="`${item.path}-${index}`"
        :to="localePath(item.path)"
        class="flex shrink-0 items-center gap-3 px-6 text-sm text-muted hover:text-highlighted transition-colors whitespace-nowrap"
      >
        <span class="text-primary font-mono">//</span>
        {{ item.title }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.marquee-track {
  width: max-content;
  animation: marquee-scroll 60s linear infinite;
}

.marquee:hover .marquee-track {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>
