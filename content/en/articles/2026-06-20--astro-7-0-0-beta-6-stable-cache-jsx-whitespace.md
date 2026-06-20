---
title: "Astro 7.0.0-beta.6 Stabilizes Route Caching and Promotes JSX Whitespace Compression to Default"
description: "Astro 7.0.0-beta.6 (June 19, 2026) promotes the experimental route caching API to top-level stable, dropping the experimental.cache and experimental.routeRules flags in favor of a new top-level cache config and a cache helper. Beta.5 (June 18) made 'jsx' the default compressHTML mode, changing the rendered output of every site that relied on the legacy whitespace preservation. Beta.6 also pulls in @astrojs/markdown-satteri 0.3.1-beta.2."
date: 2026-06-20
image: "/images/heroes/2026-06-20--astro-7-0-0-beta-6-stable-cache-jsx-whitespace.png"
author: lschvn
tags: ["frameworks", "tooling", "performance"]
tldr:
  - "Astro 7.0.0-beta.6 (June 19, 2026) promotes route caching, introduced experimentally in 6.0, to a stable top-level API. The experimental.cache and experimental.routeRules config keys are gone, replaced by a top-level cache config and a declarative routeRules config that map onto standard HTTP caching semantics across providers."
  - "Beta.5 (June 18) made 'jsx' the default value for compressHTML. Whitespace around elements is now stripped the way React and similar frameworks do it. Sites that relied on whitespace between inline elements being preserved will see different rendered HTML unless they switch compressHTML back to true (HTML-aware) or false (preserve everything)."
  - "Beta.6 also pulls in @astrojs/markdown-satteri 0.3.1-beta.2 and a small batch of fixes: Vite and Rolldown build warnings are cleaned up, and the custom 500.astro page no longer receives an empty error prop when the error originates in middleware (a beta.5 fix that ships with the beta.6 release)."
faq:
  - question: "What changed in Astro 7.0.0-beta.6?"
    answer: "The headline change in beta.6 is that route caching, which has been experimental since 6.0, is now stable. The experimental.cache and experimental.routeRules config keys are removed; you now configure caching at the top level of astro.config.mjs, and declare per-route rules in a top-level routeRules block. Astro translates those rules into provider-specific headers (memoryCache, Cloudflare KV, Vercel ISR, etc.) or runtime behavior. Beta.6 also pulls in @astrojs/markdown-satteri 0.3.1-beta.2 and cleans up Vite and Rolldown build warnings."
  - question: "What changed in Astro 7.0.0-beta.5?"
    answer: "Beta.5 changed the default value of compressHTML to 'jsx', which strips whitespace between elements the way React, Solid, and similar JSX-based frameworks do it. Whitespace around elements is removed; whitespace that is meaningful within a single line, like a single space between two inline elements, is preserved unless you write it explicitly with {' '}. To restore Astro's earlier behavior, set compressHTML: true (HTML-aware compression) or compressHTML: false (preserve all whitespace)."
  - question: "How do I migrate from experimental.cache and experimental.routeRules in Astro 6?"
    answer: "Move cache and routeRules out of the experimental block. Use memoryCache, cloudflareKV, vercelISR, or another provider from astro/config as the value of cache.provider, and put your per-route rules in routeRules at the top level of the config. In routes, use Astro.cache in .astro pages or context.cache in API routes and middleware to set directives that Astro translates into the right headers or runtime behavior for the configured provider."
  - question: "Will the new compressHTML default break my site?"
    answer: "It can, if your templates relied on whitespace between inline elements being preserved in the rendered output. Inline whitespace is the most common casualty: a literal newline between two inline tags is now stripped the same way React does it. If you need a space that JSX would otherwise remove, write it explicitly with {' '}. To keep Astro's earlier behavior while you audit, set compressHTML: true (HTML-aware compression that still trims some whitespace) or compressHTML: false (preserve all whitespace)."
  - question: "Do routeRules work on prerendered pages?"
    answer: "routeRules apply to on-demand rendered pages and endpoints. For prerendered pages, the cache directives are encoded at build time into the static HTML's Cache-Control headers via the routeRules config, which means the rule still controls how long a CDN caches the prerendered output. The full provider matrix (memoryCache, fsCache, cloudflareKV, vercelISR, etc.) is documented in the route caching guide that ships with 7.0."
  - question: "Is Astro 7.0.0-beta.6 safe to use in production?"
    answer: "No. Beta.6 is feature-frozen for the 7.0 line but is still a beta, with the standard caveats. APIs may still change before 7.0 stable, two major defaults (the JSX compressHTML mode in beta.5 and the route caching graduation in beta.6) change rendered output or config shape for existing projects, and the @astrojs/markdown-satteri version pinned in beta.6 is itself a pre-release. Use beta.6 to validate your cache config migration, your Markdown pipeline, and your whitespace assumptions, but pin production to the current 6.x line."
---

[Astro 7.0.0-beta.6](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.6) shipped on June 19, 2026, one day after [beta.5](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.5) on June 18, and continues the 7.0 line's run of graduating every long-running experimental feature to stable. The headline of beta.6 is that [route caching](https://github.com/withastro/astro/pull/17116), which has been behind `experimental.cache` and `experimental.routeRules` since the 6.0 launch, is now a top-level stable API. Beta.5, the release right before it, changed the `compressHTML` default to `'jsx'`, which alters the rendered output of any project that relied on whitespace between inline elements being preserved. Both changes land on top of the [beta.4 stabilization of the Sätteri Markdown pipeline as the default](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.4), covered in the [Astro 7.0.0-beta.4 release notes](/articles/2026-06-16--astro-7-0-0-beta-4-satteri-default-advanced-routing) earlier in the cycle.

The 7.0 line is on a fast burn toward stable. Beta.4 (June 15), beta.5 (June 18), beta.6 (June 19), and two alphas before them have graduated almost every experimental API 6.x shipped behind a flag, settled on Rust-native Markdown, switched the default whitespace handling to JSX-style, and now moved route caching to stable. The migration cost for any project on 6.x is real but mechanical: a config rename, a whitespace audit, and a check that your custom cache provider is one of the supported top-level options.

## Route caching is now stable

Route caching was the last major `experimental` block left from 6.0. Beta.6 promotes it to a top-level config. The migration is one rename plus a provider choice:

```js
// astro.config.mjs
import { defineConfig, memoryCache } from 'astro/config';

export default defineConfig({
  cache: {
    provider: memoryCache(),
  },
  routeRules: {
    '/blog/[...path]': { maxAge: 300, swr: 60 },
  },
});
```

In `.astro` pages you set directives with `Astro.cache`, and in API routes and middleware you use `context.cache`. Astro translates those directives into the appropriate headers or runtime behavior for the configured provider, so the same config works against memoryCache, fsCache, cloudflareKV, vercelISR, and the other providers that ship with the 7.0 line. The full provider matrix is documented in the [route caching guide](https://docs.astro.build/en/guides/caching/) that ships with the release.

For prerendered pages the rules still apply at build time: the directives are encoded into the static HTML's `Cache-Control` headers, which means a CDN in front of your site will respect the same `maxAge` and `swr` you would have used for an on-demand rendered page. This is the part that is the most subtle change for projects that already had a CDN in front of prerendered output: the same `routeRules` config now controls both the on-demand runtime cache and the static-asset cache headers.

## 'jsx' is the new default for compressHTML

[Beta.5](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.5) made `'jsx'` the new default value for the `compressHTML` option. This is the same whitespace-stripping mode React, Solid, Preact, and the other JSX-based frameworks use: whitespace around elements is removed, and a single line of meaningful whitespace between two inline elements is preserved.

The difference matters in practice. In the legacy HTML-aware compression mode (the old `compressHTML: true` default), Astro kept a single space between two inline elements when there was a literal newline between them in the source. In the new `'jsx'` default, that newline is stripped, which means a template like:

```astro
<p>
  Hello <span>world</span>
</p>
```

renders the same as before, but a template like:

```astro
<p>
  Click
  <a href="/x">here</a>
  for more
</p>
```

now renders without the line break between "Click", the link, and "for more". Anywhere you actually wanted that whitespace to be visible, write it explicitly with `{' '}`.

For projects that need to keep the old behavior while they audit, the migration is one line:

```js
// astro.config.mjs
export default defineConfig({
  compressHTML: true, // HTML-aware compression, the 6.x default
});
```

Set `compressHTML: false` to disable compression entirely, or `compressHTML: 'jsx'` to keep the new default explicitly. Beta.5 also fixes a handful of `astro/hono` and `astro/fetch` advanced routing bugs that have been landing across the 7.0 cycle, including one where the custom `500.astro` page received an empty `error` prop when the error originated in middleware.

## The wider 7.0 picture

Between beta.4 and beta.6, the 7.0 line has now stabilized or replaced almost every experimental feature that 6.x shipped behind a flag. Sätteri (Rust-native Markdown) is the default, advanced routing with Hono is stable, the custom logger is stable, the streaming rendering engine is stable, the JSX-style whitespace compression is the default, and route caching is now stable at the top level. The remaining 7.0 work before stable is mostly build tooling polish, the final `@astrojs/markdown-satteri` graduation, and the [Vite 8 support](https://vite.dev/) that landed across the alpha and beta cycle.

## What to do now

For projects on 6.x: upgrade to the latest 6.x patch and start the config migration early. Move `cache` and `routeRules` out of `experimental`, decide which provider you want, and run beta.6 against a staging branch. Audit your templates for the whitespace change: anywhere you rely on a newline between two inline elements producing visible whitespace, switch to `{' '}` or fall back to `compressHTML: true` until you have time to do the audit properly. The full list of breaking changes in the 7.0 line is in the [CHANGELOG](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md) on the `withastro/astro` repo. Pin production to the 6.x line and treat beta.6 as the validation target.
