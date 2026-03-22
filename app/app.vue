<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { loggedIn, user, clear } = useUserSession()

const navItems: NavigationMenuItem[] = [
  { label: 'Home', icon: 'i-lucide-home', to: '/' },
  { label: 'Articles', icon: 'i-lucide-newspaper', to: '/articles' },
]

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  navigateTo('/')
}
</script>

<template>
  <UApp>
    <UHeader>
      <template #title>
        <span class="font-bold text-xl tracking-tight">
          typescript<span class="text-primary">.news</span>
        </span>
      </template>

      <UNavigationMenu :items="navItems" />

      <template #right>
        <UColorModeButton />

        <template v-if="loggedIn">
          <span class="text-sm text-muted hidden sm:inline">{{ user?.name }}</span>
          <UButton icon="i-lucide-log-out" variant="ghost" color="neutral" size="sm" @click="logout" />
        </template>
        <UButton v-else icon="i-lucide-user" variant="ghost" color="neutral" size="sm" to="/login" />
      </template>

      <template #body>
        <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <NuxtRouteAnnouncer />
      <NuxtPage
        :transition="{
          name: 'page',
          mode: 'out-in',
        }"
      />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          &copy; {{ new Date().getFullYear() }} typescript.news
        </p>
      </template>

      <template #right>
        <span class="text-muted text-sm">Built with Nuxt, for developers.</span>
      </template>
    </UFooter>
  </UApp>
</template>
