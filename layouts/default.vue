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

const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div class="container">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">TS</span>
            </div>
            <span class="text-xl font-bold tracking-tight font-serif">
              ts.news
            </span>
          </NuxtLink>
          
          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <NuxtLink
              v-for="item in navigation"
              :key="item.to"
              :to="item.to"
              class="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors relative py-1"
              active-class="text-[var(--color-text)]"
            >
              {{ item.label }}
              <span class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </NuxtLink>
          </nav>
          
          <!-- Right side -->
          <div class="flex items-center gap-4">
            <!-- Mobile menu button -->
            <button
              class="md:hidden p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
              @click="mobileMenuOpen = !mobileMenuOpen"
              :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
            >
              <UIcon v-if="mobileMenuOpen" name="i-heroicons-x-mark" class="w-5 h-5" />
              <UIcon v-else name="i-heroicons-bars-3" class="w-5 h-5" />
            </button>
            
            <!-- Dark mode toggle -->
            <button
              class="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
              @click="isDark = !isDark"
            >
              <UIcon
                v-if="isDark"
                name="i-heroicons-sun"
                class="w-5 h-5 text-amber-500"
              />
              <UIcon
                v-else
                name="i-heroicons-moon"
                class="w-5 h-5 text-[var(--color-text-secondary)]"
              />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)]">
        <nav class="container py-4 flex flex-col gap-2">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors px-4 py-2 rounded-lg hover:bg-[var(--color-bg-tertiary)]"
            active-class="text-[var(--color-text)] bg-[var(--color-bg-tertiary)]"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </header>
    
    <!-- Main content -->
    <main class="container py-8 md:py-12">
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="border-t border-[var(--color-border)] mt-auto">
      <div class="container">
        <div class="py-8 md:py-12">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <!-- Logo & tagline -->
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">TS</span>
              </div>
              <div>
                <p class="font-serif font-semibold">ts.news</p>
                <p class="text-xs text-[var(--color-text-muted)]">TypeScript & Web Tech News</p>
              </div>
            </div>
            
            <!-- Links -->
            <nav class="flex items-center gap-6 text-sm">
              <NuxtLink
                v-for="item in navigation"
                :key="item.to"
                :to="item.to"
                class="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                {{ item.label }}
              </NuxtLink>
            </nav>
            
            <!-- Copyright -->
            <p class="text-sm text-[var(--color-text-muted)]">
              &copy; {{ new Date().getFullYear() }} ts.news. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
