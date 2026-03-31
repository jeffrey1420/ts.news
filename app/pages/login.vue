<script setup lang="ts">
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'

const { loggedIn, fetch: refreshSession } = useUserSession()

if (loggedIn.value) {
  navigateTo('/')
}

useSeoMeta({
  title: 'Log in',
  description: 'Log in or create an account to comment on typescript.news articles.',
  robots: 'noindex, nofollow, noarchive',
  ogTitle: `Log in | ${siteConfig.name}`,
  ogDescription: 'Authentication page for typescript.news readers.',
})

useHead({
  link: [{ rel: 'canonical', href: absoluteSiteUrl('/login') }],
})

const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const error = ref('')

const loginFields = [
  { name: 'email', type: 'email' as const, label: 'Email', placeholder: 'you@example.com', required: true },
  { name: 'password', type: 'password' as const, label: 'Password', placeholder: 'Your password', required: true },
]

const registerFields = [
  { name: 'name', type: 'text' as const, label: 'Name', placeholder: 'Your name', required: true },
  { name: 'email', type: 'email' as const, label: 'Email', placeholder: 'you@example.com', required: true },
  { name: 'password', type: 'password' as const, label: 'Password', placeholder: 'At least 6 characters', required: true },
]

async function onLogin(event: any) {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: event.data })
    await refreshSession()
    navigateTo('/')
  } catch (e: any) {
    error.value = e.data?.message || 'Login failed.'
  } finally {
    loading.value = false
  }
}

async function onRegister(event: any) {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/register', { method: 'POST', body: event.data })
    await refreshSession()
    navigateTo('/')
  } catch (e: any) {
    error.value = e.data?.message || 'Registration failed.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto px-4 py-16">
    <UAlert v-if="error" :title="error" color="error" variant="subtle" class="mb-6" icon="i-lucide-circle-alert" />

    <UAuthForm
      v-if="mode === 'login'"
      title="Welcome back"
      description="Log in to join the conversation."
      icon="i-lucide-log-in"
      :fields="loginFields"
      :submit="{ label: 'Log in' }"
      :loading="loading"
      @submit="onLogin"
    >
      <template #footer>
        Don't have an account?
        <UButton label="Register" variant="link" class="p-0" @click="mode = 'register'" />
      </template>
    </UAuthForm>

    <UAuthForm
      v-else
      title="Create an account"
      description="Sign up to leave comments on articles."
      icon="i-lucide-user-plus"
      :fields="registerFields"
      :submit="{ label: 'Create account' }"
      :loading="loading"
      @submit="onRegister"
    >
      <template #footer>
        Already have an account?
        <UButton label="Log in" variant="link" class="p-0" @click="mode = 'login'" />
      </template>
    </UAuthForm>
  </div>
</template>
