---
title: "Astro 6.4 Ships Rust-Based Markdown Processor, Cuts Build Times"
description: "Astro 6.4 introduces an optional Rust-powered Sätteri markdown processor, a new configurable markdown.processor option, and adapter-level server directory preservation."
date: 2026-06-01
image: "/images/heroes/2026-06-01--astro-6-4-rust-satteri-markdown-optimizer.png"
author: lschvn
tags: ["frameworks", "typescript", "javascript"]
---

Astro 6.4 landed May 28 with one headline feature that matters for any content-heavy site: an optional Rust-based markdown processor called Sätteri, designed to replace the slow unified ecosystem for sites with hundreds or thousands of Markdown files.

<!-- more -->

## TLDR

- New `markdown.processor` config option lets you swap Astro's markdown pipeline
- `@astrojs/markdown-satteri` is a Rust-based processor that dramatically speeds up builds for markdown-heavy sites
- Build server directory structure is now preserved independently of the client directory via `preserveBuildServerDir`
- On-demand SSR routes now fall through correctly when a prerendered route matches but can't serve the request

---

## The Problem: Unified Is Slow at Scale

Astro's markdown pipeline has always used the unified ecosystem — remark and rehype plugins — which is powerful but notoriously slow at scale. Sites with many Markdown or MDX files end up with multi-minute build times because the unified processor parses and transforms content sequentially.

Astro 6.4 introduces `markdown.processor` as a top-level configuration option that replaces the existing `remarkPlugins` and `rehypePlugins` fields:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkToc from 'remark-toc';

export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkToc],
    }),
  },
});
```

Existing configurations using `remarkPlugins`, `rehypePlugins`, `gfm`, and `smartypants` still work — they're now marked deprecated and will be removed in a future major release.

---

## Sätteri: The Rust Alternative

Alongside the new config option, Astro ships `@astrojs/markdown-satteri`, a processor backed by the Rust Sätteri library:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  markdown: {
    processor: satteri({
      features: { directive: true },
    }),
  },
});
```

Sätteri is written in Rust and deliberately excludes the remark/rehype plugin ecosystem. Instead, it supports MDAST and HAST plugins natively — meaning existing plugins need to be rewritten to work with the new processor, but the payoff is significantly faster parsing at scale.

Sites with thousands of markdown files should see the most dramatic improvements. The Astro team cites the Sätteri project directly at [satteri.bruits.org](https://satteri.bruits.org/).

---

## Preserve Build Server Directory Separately

Astro 6.4 adds `preserveBuildServerDir` to the adapter features API. This mirrors the existing `preserveBuildClientDir` option but for the server output directory:

```ts
setAdapter({
  name: 'my-adapter',
  adapterFeatures: {
    buildOutput,
    preserveBuildClientDir: true,
    preserveBuildServerDir: true,
  },
});
```

Previously, preserving the client directory automatically affected the server directory structure. Now adapters can keep a consistent `dist/client/` and `dist/server/` layout independently, which matters for adapters that need specific directory arrangements regardless of build output type.

---

## SSR Route Fallthrough Fix

A long-standing edge case in Astro's on-demand rendering is now fixed. When a prerendered dynamic route and an SSR dynamic route shared the same URL pattern, requests to non-prerendered paths would 404 instead of falling through to the SSR handler — alphabetically sorted prerendered routes took precedence and blocked matching SSR routes.

The fix adds proper fallthrough logic: when a prerendered dynamic route matches but can't serve the request, Astro now tries subsequent matching routes.

---

## Other Fixes in 6.4

- Vite dependency optimizer race condition fixed for React in Astro Actions dev mode
- `X-Forwarded-Host` and `X-Forwarded-Proto` headers are now respected in custom `src/app.ts` fetch handlers
- Static preview server now correctly handles sites with non-prerendered routes
- Adapter-provided preview entrypoints bypass the static preview server entirely

---

## FAQ

**Should I switch to Sätteri immediately?**
If your site is fast enough with the unified ecosystem, stay on it. If you have hundreds of markdown files and build times are painful, Sätteri is worth a test. Be aware that remark/rehype plugins don't work with Sätteri — you'd need MDAST/HAST equivalents.

**Does Sätteri support all Astro markdown features?**
It supports directives. Full GFM (tables, tasklists, strikethrough) and smartypants are configurable via Sätteri's own options. The trade-off is documented on the Sätteri site.

**What about existing `remarkPlugins` and `rehypePlugins` configs?**
They still work in 6.4 but are deprecated. Astro recommends migrating to the new `processor` API proactively.
