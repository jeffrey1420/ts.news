---
title: "Vue 3.6 Enters Beta: Vapor Mode Complete, Reactivity Revamped"
description: "Vue 3.6 has entered beta with the completion of Vapor Mode — a virtual-DOM-free compilation path — and a major reactivity system overhaul based on alien-signals, promising significant performance gains."
image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=1200&h=630&fit=crop"
date: "2026-04-16"
category: Frameworks
author: lschvn
readingTime: 5
tags: ["Vue", "Vue 3", "Vapor Mode", "JavaScript", "performance", "reactivity", "alien-signals"]
tldr:
  - "Vue 3.6 beta has shipped with Vapor Mode achieving full feature parity with the traditional virtual DOM mode — a compilation target that bypasses the vdom entirely for direct DOM operations."
  - "The @vue/reactivity package has been refactored using alien-signals, a signals implementation that provides better performance and lower memory overhead than the previous reactive() implementation."
  - "Vapor Mode enables Vue templates to compile to highly optimized JavaScript that manipulates the DOM directly, similar to what Solid or Svelte do, but maintaining full compatibility with Vue's component model."
faq:
  - q: "What is Vapor Mode in Vue?"
    a: "Vapor Mode is a new compilation target for Vue 3 that compiles templates to direct DOM manipulation code instead of virtual DOM operations. It was first announced at VueConf 2025 and has been in development since. Unlike the virtual DOM approach (which creates vnode objects and diffs them), Vapor Mode compiles template code to JavaScript that directly creates, updates, and removes DOM nodes. This makes Vue apps significantly faster and smaller because the virtual DOM layer is eliminated entirely at runtime."
  - q: "How does Vapor Mode differ from Nuxt/Vue server-side rendering?"
    a: "SSR and Vapor Mode are independent concepts. SSR renders Vue components to HTML on the server for fast first-paint. Vapor Mode is about the compilation strategy on the client — it can be used with or without SSR. When SSR and Vapor Mode are combined, the server renders HTML once (as always) and the client hydrates it using Vapor's efficient DOM update mechanisms instead of the heavier vdom hydration process."
  - q: "What is alien-signals?"
    a: "alien-signals is a high-performance signals implementation that Vue's core team adopted for @vue/reactivity in 3.6. Signals are a reactive primitive where accessing a signal automatically tracks dependencies and triggers updates in dependent computations. The alien-signals implementation prioritizes execution speed and minimal memory allocation over some of the debugging ergonomics of Vue's previous implementation."
  - q: "Do I need to change my Vue code for Vapor Mode?"
    a: "Vapor Mode is designed to be as compatible as possible with existing Vue 3 component code. The goal is that most components using standard Composition API patterns will work without modification. Components that rely heavily on internal Vue vdom APIs or bypass Vue's reactivity system may require adjustments. The Vue team has been testing against real-world Vue applications to identify compatibility gaps before stable release."
---

Vue 3.6 beta has landed, and it marks a pivotal moment for the framework's evolution. The headline achievements: **Vapor Mode has reached feature parity with the virtual DOM system**, and the reactivity package has undergone a foundational refactor using the alien-signals library. Together, these changes position Vue 3.6 as one of the most significant releases in the framework's history.

## Vapor Mode: Feature Complete

Vapor Mode is Vue's answer to a question the frontend world has been asking for years: what if we could have the ergonomics and component model of Vue with the runtime efficiency of compiled, direct-DOM frameworks like Solid or Svelte?

The core idea is straightforward. In the current Vue 3 compilation model, templates are compiled to render functions that produce virtual DOM nodes. When state changes, Vue creates a new virtual DOM tree and diffs it against the previous tree to determine the minimal set of real DOM mutations needed. This vdom diffing is fast enough for most applications, but it is not free — the creation of vnode objects and the diffing algorithm both consume CPU and memory.

Vapor Mode replaces this entirely. Instead of compiling templates to render functions, it compiles them to JavaScript that directly calls DOM APIs. A `v-for` loop over a list becomes a loop that calls `document.createElement` and `appendChild` directly. A `v-if` becomes a conditional that inserts or removes nodes. The result is a bundle with no virtual DOM runtime and fewer allocations at runtime.

The Vue team first outlined Vapor Mode in late 2024 and has been iterating on it throughout 2025. With 3.6 beta, the team has reached a milestone: **Vapor Mode now supports all stable features available in virtual DOM mode**. That means components using `v-if`, `v-for`, `v-show`, `v-model`, slots, `Suspense`, and the Composition API should work in Vapor Mode without modification.

The exception is `Suspense` in Vapor-only mode — it is not yet supported, though Vapor components can render inside a vdom-based `Suspense` boundary.

### What Changes in Practice

For developers, the transition is designed to be mostly invisible. You write Vue components the same way. Under the hood, the compiler chooses the Vapor path. The bundle that reaches the browser is smaller because the vdom runtime is gone, and the runtime behavior is faster because DOM updates bypass the diffing step.

For library authors and developers using Vue's lower-level APIs — `h()`, `createVNode`, direct component instance manipulation — there may be adjustments needed. Vapor Mode works at the template compilation level, so code that goes through the render function pipeline still functions normally.

## @vue/reactivity Overhaul with alien-signals

The reactivity system, the engine that powers Vue's `ref()`, `reactive()`, `computed()`, and `watch()`, has been refactored to use [alien-signals](https://github.com/stackblitz/alien-signals). This is a foundational change rather than a surface API change — `ref()` and `reactive()` still work the same way.

The motivation is performance. The previous reactivity implementation, while well-engineered, had some overhead from the way it tracked dependencies and scheduled updates. alien-signals is designed with a narrower focus: execute reactive computations as quickly as possible with minimal memory allocation. The Vue team evaluated several signals implementations and chose alien-signals for its benchmark performance and its alignment with Vue's update scheduling model.

This refactor affects the `@vue/reactivity` package directly, which is also published separately on npm and used in projects outside of Vue — including some Solid.js integrations and other frameworks that adopted Vue's reactivity primitives.

## Hydration Improvements

3.6 beta also ships a large batch of hydration-related fixes — over 30 commits in the beta.10 release alone. Vue 3's server-side rendering hydration, which matches the server-rendered HTML against the client-side component tree, has been tightened across edge cases involving:

- Multi-root hydration boundaries and async components
- Teleport targets with missing or changing targets
- Slot content hydration with fallback content
- Dynamic components rendered across SSR and client boundaries

These are the kind of fixes that only surface in complex real-world applications, and their presence indicates Vue 3.6 is being hardened for production use cases at scale.

## Looking Toward Stable

Vue 3.6 entering beta means the feature set is locked and the team is focused on stabilization and compatibility fixes. Barring major regressions discovered during the beta period, the stable release should follow within weeks. The Vue team has been iterating quickly — beta.1 shipped on March 30 and beta.10 was published on April 13, indicating active development.

For project teams running Vue 3, now is a good time to test the 3.6 beta against your application, particularly if you use Vapor Mode-compatible code patterns. The Vue team's policy is to avoid breaking changes in minor releases, but the reactivity internals change in 3.6 means edge cases in custom reactivity usage are worth testing.
