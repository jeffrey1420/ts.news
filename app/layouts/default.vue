<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Articles', to: '/articles' },
  { label: 'About', to: '/about' },
]
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
    <header class="border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold tracking-tight">
          ts.news
        </NuxtLink>
        
        <nav class="flex items-center gap-6">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            active-class="text-gray-900 dark:text-white"
          >
            {{ item.label }}
          </NuxtLink>
          
          <button
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="isDark = !isDark"
          >
            <UIcon
              v-if="isDark"
              name="i-heroicons-sun"
              class="w-5 h-5"
            />
            <UIcon
              v-else
              name="i-heroicons-moon"
              class="w-5 h-5"
            />
          </button>
        </nav>
      </div>
    </header>
    
    <main class="max-w-4xl mx-auto px-4 py-8">
      <slot />
    </main>
    
    <footer class="border-t border-gray-200 dark:border-gray-800 mt-16">
      <div class="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>ts.news — TypeScript & Web Tech News</p>
      </div>
    </footer>
  </div>
</template>
