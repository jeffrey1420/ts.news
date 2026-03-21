<script setup lang="ts">
const error = useError()

const is404 = computed(() => error.value?.statusCode === 404)

const handleError = () => clearError({ redirect: '/' })

useSeoMeta({
  title: is404.value ? 'Page Not Found - ts.news' : 'Error - ts.news',
  description: is404.value ? 'The page you are looking for does not exist.' : 'An error occurred on ts.news.',
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <div class="mb-8">
        <span class="text-8xl font-bold text-gray-200 dark:text-gray-800">
          {{ is404 ? '404' : error?.statusCode || 'Error' }}
        </span>
      </div>
      
      <h1 class="text-2xl font-bold mb-4">
        {{ is404 ? 'Page Not Found' : 'Something Went Wrong' }}
      </h1>
      
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ is404 
          ? "The page you're looking for doesn't exist or has been moved."
          : error?.message || 'An unexpected error occurred.' 
        }}
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          @click="handleError"
        >
          Back to Homepage
        </button>
        
        <NuxtLink
          to="/articles"
          class="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Browse Articles
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
