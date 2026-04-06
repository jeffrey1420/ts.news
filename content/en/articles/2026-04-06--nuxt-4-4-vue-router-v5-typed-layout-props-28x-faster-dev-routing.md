---
title: "Nuxt 4.4 Ships Vue Router v5, Typed Layout Props, and 28x Faster Dev Routing"
description: "Nuxt's latest point release brings major under-the-hood improvements: Vue Router v5, a custom useFetch factory API, an accessibility announcer composable, and a routing system migration that makes hot-module replacement up to 28x faster."
date: "2026-04-06"
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["nuxt", "vue", "javascript", "typescript", "router", "accessibility"]
---

Nuxt 4.4 landed on March 12, 2026, and it's one of the most substantial point releases in the 4.x cycle. The headline additions — Vue Router v5, custom `useFetch` factories, and an accessibility announcer composable — sit alongside a routing engine migration that dramatically speeds up the development experience.

## Vue Router v5

The most significant dependency upgrade is Vue Router v5, which removes Nuxt's historical dependency on `unplugin-vue-router`. This is the first major vue-router bump since Nuxt 3 launched. For most applications, the upgrade should be transparent. If you were using `unplugin-vue-router` directly in other projects, you can remove it from your dependencies.

Typed routes are expected to exit experimental status in a future release — the groundwork is being laid now.

## Custom `useFetch` / `useAsyncData` factories

This is the feature that module authors and API-heavy applications will reach for first. `createUseFetch` lets you instantiate a fully-typed fetch client with your own defaults:

```ts
// composables/api.ts
export const useApiFetch = createUseFetch((currentOptions) => {
  const runtimeConfig = useRuntimeConfig()
  return {
    ...currentOptions,
    baseURL: currentOptions.baseURL ?? runtimeConfig.public.baseApiUrl,
  }
})
```

```vue
<!-- pages/dashboard.vue -->
<script setup lang="ts">
// baseURL from runtimeConfig applied automatically
const { data: users } = await useApiFetch('/users')
</script>
```

The factory function gives you full control over how options merge — including interceptors and composed headers. There's a matching `createUseAsyncData` for the same pattern.

## Typed layout props

Layouts can now receive typed props directly from `definePageMeta`, without workarounds like `provide/inject`:

```vue
<!-- pages/dashboard.vue -->
definePageMeta({
  layout: {
    name: 'panel',
    props: {
      sidebar: true,
      title: 'Dashboard',
    },
  },
})
```

```vue
<!-- layouts/panel.vue -->
<script setup lang="ts">
defineProps<{
  sidebar?: boolean
  title?: string
}>()
</script>
```

If your layout defines props, you'll get full autocomplete and type-checking in `definePageMeta`.

## Accessibility: `useAnnouncer` composable

Nuxt 4.4 ships a new `useAnnouncer` composable and `<NuxtAnnouncer>` component for dynamic in-page announcements — form submissions, loading states, search results that don't trigger navigation. Pair it with `<NuxtRouteAnnouncer>` for page-level navigation:

```vue
<template>
  <NuxtAnnouncer />
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

This is part of Nuxt's broader accessibility roadmap.

## 28x faster dev routing with unrouting

Nuxt migrated its file-system route generation to [unrouting](https://github.com/unjs/unrouting), which uses a trie data structure for route construction. Cold start is roughly the same (~8ms vs ~6ms for large apps), but hot-module replacement is dramatically faster: up to 28x faster when editing existing pages, and ~15% faster even when adding or removing pages. The system is also now deterministic — route generation is no longer sensitive to page file ordering.

## Smarter ISR/SWR payload handling

Cached routes (ISR/SWR) with payload extraction had a problem: browser requests for `_payload.json` triggered a full SSR re-render, which in serverless environments could spin up a second lambda before the first response finished streaming. Nuxt 4.4 fixes this with a new `payloadExtraction: 'client'` mode that inlines the full payload in the initial HTML and adds a runtime in-memory LRU cache for subsequent `_payload.json` requests.

## Other improvements

- **`useCookie` refresh option** — extend a cookie's expiration without touching its value, useful for session management
- **`clearNuxtState` reset** — now resets to the initial value instead of `undefined`, aligning with `useAsyncData` behavior
- **Import protection** — improved error messages with suggested fixes when importing protected modules

## FAQ

**Is Vue Router v5 a breaking change?**
For most Nuxt apps, no. The upgrade should be transparent. Direct usage of `unplugin-vue-router` in other projects is the affected case.

**When does `payloadExtraction: 'client'` become the default?**
With `compatibilityVersion: 5` in a future release. The runtime LRU cache is active for all users immediately.

**How do I try the new routing performance?**
It's automatic in 4.4. Edit any page file and observe HMR response in the terminal — the improvements are most visible in large applications with many route files.
