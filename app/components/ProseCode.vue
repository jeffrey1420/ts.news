<script setup lang="ts">
const props = defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
}>()
</script>

<template>
  <div class="prose-code relative group my-6">
    <!-- Header bar -->
    <div class="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 rounded-t-lg border-b border-gray-700">
      <div class="flex items-center gap-2">
        <!-- Traffic lights -->
        <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
        <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
        <span class="w-3 h-3 rounded-full bg-green-500/80"></span>
      </div>
      
      <span v-if="filename" class="text-xs text-gray-400 font-mono">
        {{ filename }}
      </span>
      <span v-else-if="language" class="text-xs text-gray-400 font-mono uppercase">
        {{ language }}
      </span>
    </div>
    
    <!-- Code content -->
    <pre class="!mt-0 !rounded-t-none !bg-[#0d1117] !border !border-gray-700 !border-t-0 rounded-lg overflow-x-auto"><code><slot /></code></pre>
    
    <!-- Copy button -->
    <button
      class="absolute top-12 right-3 p-2 rounded-md bg-gray-700/50 hover:bg-gray-600 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
      aria-label="Copy code"
    >
      <UIcon name="i-heroicons-clipboard" class="w-4 h-4" />
    </button>
  </div>
</template>

<style>
/* Override for Shiki/Duo tone in content */
.prose pre {
  margin: 0;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.prose pre code {
  display: block;
  padding: var(--space-4);
  min-height: 100%;
}
</style>
