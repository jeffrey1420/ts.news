---
title: "Vue 3.5: The 'Minor' Release That Rewrote the Rules of Frontend Performance"
description: "Vue 3.5 arrived with no breaking changes and a set of internals improvements that should make any developer pay attention — 56% less memory usage, lazy hydration, and a stabilized reactive props API."
date: "2026-03-22"
author: "ts.news team"
tags: ["vue", "javascript", "frontend", "performance", "ssr", "typescript"]
readingTime: 10
---

Vue 3.5 dropped in September 2024, and Evan You called it a minor release. The developer community's response was roughly: *"This does not feel like a minor release."*

The numbers back that instinct up. Vue 3.5's refactored reactivity system delivers **56% lower memory usage** and **up to 10× faster operations on large, deeply reactive arrays**. Those aren't incremental gains — they're the kind of improvements that change what "large-scale Vue" means in practice.

This article is a look at what actually changed, what it means for your applications, and where Vue is headed next.

## What Made Vue 3.5 Worth Upgrading

### A Rewritten Reactivity System

The core change is a full internal refactor of how Vue tracks reactive state. The goal was eliminating stale computed values and memory leaks that could accumulate during server-side rendering — a class of bug that tends to surface in production under sustained load.

The result was a net win across the board: lower memory usage, better performance on deeply nested reactive structures, and resolution of long-standing issues with "hanging computeds" in SSR contexts. Critically, the refactor had **no behavior changes** — everything that worked before still works. It is purely an internal improvement.

For applications that maintain large reactive data structures — think dashboards with real-time data, complex forms, or collaborative editing surfaces — these gains compound into meaningfully snappier interactions.

### Reactive Props Destructure, Now Stabilized

One of the most-wanted features from the Composition API RFC process landed in 3.5 with its stabilization. Previously, destructuring props in `<script setup>` would break reactivity. The workaround was `withDefaults()` and explicit prop typing, which worked but felt verbose.

```typescript
// Before 3.5 — the only reliable way
const props = withDefaults(
  defineProps<{
    count?: number
    message?: string
  }>(),
  { count: 0, message: 'hello' }
)

// After 3.5 — native destructuring works reactively
const { count = 0, message = 'hello' } = defineProps<{
  count?: number
  message?: string
}>()
```

The catch: computed properties and composables that consume destructured props still need a getter wrapper to maintain reactivity tracking. `watch(() => count)` works; `watch(count)` raises a compile error. This is a deliberate guard rail, not a bug.

### Lazy Hydration for SSR

Server-side rendering performance has been a known pain point in the Vue ecosystem. The traditional SSR hydration model hydrates the entire page at once, which creates a waterfall of work on the client that users experience as slow Time-to-Interactive.

Vue 3.5 introduces a lower-level API for controlling hydration strategy. `defineAsyncComponent()` now accepts a `hydrate` option that lets you specify when a component should be hydrated:

```typescript
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  hydrate: hydrateOnVisible()
})
```

Components can now be deferred until they scroll into view, become interactive, or match other conditions. The Nuxt team immediately began building higher-level syntax on top of this API, which tells you how long this capability has been needed.

### useId(): Stable IDs Across Server and Client

Form accessibility requires unique `for`/`id` pairs. In SSR applications, generating these on the server and matching them on the client is a common source of hydration mismatches — the server generates one ID, the client generates another.

`useId()` solves this by generating IDs that are stable across the server/client boundary:

```vue
<script setup>
import { useId } from 'vue'
const id = useId()
</script>

<template>
  <form>
    <label :for="id">Email:</label>
    <input :id="id" type="email" />
  </form>
</template>
```

The same component rendered on the server or client produces the same ID. No more hydration warnings from mismatched form field associations.

### data-allow-mismatch

SSR applications frequently produce content that legitimately differs between server and client renders — timestamps displayed in the user's local timezone, dates formatted by `Intl`, content that depends on client-side state available only after hydration.

Previously, these differences would produce console warnings that were noise rather than signal. `data-allow-mismatch` lets you explicitly suppress warnings for known, acceptable discrepancies:

```html
<span data-allow-mismatch>{{ user.localBirthday }}</span>
```

You can scope it to specific mismatch types: `text`, `children`, `class`, `style`, or `attribute`. This is a quiet quality-of-life improvement that makes SSR debugging actually tractable in complex applications.

### useTemplateRef()

Template refs in Vue 3 required ref attributes to be statically analyzable by the compiler — meaning they had to be static strings, not dynamic bindings. If you wanted a ref whose name came from a variable, you were out of luck.

`useTemplateRef()` resolves this by matching refs by runtime string ID rather than compile-time analysis:

```vue
<script setup>
import { useTemplateRef } from 'vue'

const inputRef = useTemplateRef('input')
// works with dynamic ref names
</script>

<template>
  <input :ref="dynamicRefName" />
</template>
```

### Other Notable Additions

- **Deferred Teleport**: `<Teleport>` previously required its target to exist at mount time. The `defer` prop in 3.5 lets you teleport to elements that don't exist yet but will be rendered later in the same cycle.
- **onWatcherCleanup()**: A globally-imported API for registering cleanup callbacks inside watchers — the Vue-native answer to the AbortController pattern for canceling stale async operations.
- **Custom Elements improvements**: `useHost()`, `useShadowRoot()`, `this.$host`, `shadowRoot: false` mounting option, and nonce injection for security-sensitive CSP environments.

## TypeScript: Quietly Getting Better

Vue 3.5 also improved TypeScript inference in ways that matter for large codebases. Better inference for generic component types, improved typing for exposed template refs, and utility type fixes that reduce the need for manual type assertions.

If you've been using Vue with TypeScript and fighting with inference issues in `<script setup>`, 3.5 will make some of those fights disappear.

## Vue 3.6: What's Coming

While 3.5 was cleaning up the present, Vue 3.6 is aimed at the future — and the headline feature is **Vapor Mode**.

Vapor Mode is a compilation strategy that eliminates the virtual DOM entirely. Instead of diffing a virtual DOM tree on every update, it compiles Vue templates to direct DOM operations — the same strategy that Solid.js uses to achieve its benchmark-topping performance.

The compelling claim from Evan You: **Vapor Mode allows Vue to reach Solid.js-level rendering performance while keeping the exact same Vue API.** You don't rewrite your components. You opt individual sub-trees into Vapor mode, and the compiler handles the rest.

The performance target is striking: **100,000 component mounts in 100ms**. For context, Vue 3's virtual DOM handles roughly 10,000-20,000 component mounts in the same timeframe.

Vapor Mode is currently in beta (3.6.0-beta versions are on npm now). The integration into the core Vue repository is underway. A stable release is expected in 2026.

Also notable in the 3.6 pipeline:

- **Alien Signals**: A reactivity optimization that reduces memory usage by a further 14% compared to 3.5, developed by Johnson Chu
- **Vue base bundle under 10KB**: The runtime footprint is shrinking significantly
- **Rolldown 1.0**: The Rust-based Rollup replacement is now in production, which is the bundler underpinning Vite — faster builds for everyone using Vite in 2026

## Why It Matters

Vue's evolution has followed an interesting pattern. Each version has taken the framework further from "simple tool for small projects" and closer to "serious infrastructure for large applications" — without abandoning the developer experience that made Vue appealing in the first place.

Vue 3.5 is a case study in that balance. The memory and performance improvements are the kind that make production systems measurably better — not cosmetic, not theoretical, but real. The new APIs (lazy hydration, `useId`, `useTemplateRef`) address problems that developers have been working around for years.

The trajectory toward 3.6 and Vapor Mode suggests Vue is not satisfied with matching the competition. It wants to set the performance bar. That is an interesting ambition for a framework that has always defined itself by accessibility and ergonomics rather than raw speed.

Whether Vapor Mode delivers on its promise — and whether it can maintain compatibility with the existing ecosystem during the transition — will determine whether Vue 3.6 is remembered as a pivot point or just another release. The early signals are promising.
