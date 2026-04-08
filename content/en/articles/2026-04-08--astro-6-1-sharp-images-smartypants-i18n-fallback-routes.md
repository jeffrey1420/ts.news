---
title: "Astro 6.1 Brings Fine-Grained Image Control and Smarter i18n Routing"
description: "Astro 6.1 lets you tune Sharp's encoder settings at the pipeline level, adds advanced SmartyPants configuration, and exposes i18n fallback routes to the integration hook system. Cloudflare acquisition continues to shape the roadmap."
image: "https://opengraph.githubassets.com/1/withastro/astro"
date: "2026-04-08"
category: Frameworks
author: lschvn
readingTime: 4
tags: ["astro", "javascript", "frameworks", "images", "i18n", "markdown", "release"]
tldr:
  - "Astro 6.1 exposes Sharp encoder options at the pipeline level — MozJPEG, WebP effort, AVIF chroma subsampling, and PNG compression can now be set as defaults before per-image quality overrides."
  - "The SmartyPants Markdown plugin now accepts a full options object for fine-tuning dashes, quotes, backticks, and ellipses — useful for localization and typographic standards."
  - "Integrations can now access i18n fallback routes via `fallbackRoutes` on the `IntegrationResolvedRoute` type, fixing sitemap and routing integrations for sites using rewrite-based fallbacks."
  - "Astro joined Cloudflare in January 2026; the acquisition is visible in how the team prioritizes content-heavy, edge-deployed workloads."
faq:
  - q: "What's new in Astro 6.1 compared to 6.0?"
    a: "The headline features are pipeline-level Sharp encoder configuration, SmartyPants options object support, and `fallbackRoutes` exposure on the integration route hook. These are smaller additions compared to 6.0's experimental Rust compiler and refactored dev server."
  - q: "Do I need to change anything when upgrading from Astro 6.0?"
    a: "Astro 6.1 is a minor release — no breaking changes are expected. The Sharp image defaults are additive, and SmartyPants behavior is preserved unless you explicitly reconfigure it."
  - q: "What does 'i18n fallback routes for integrations' mean?"
    a: "Sites using `fallbackType: 'rewrite'` generate extra routes that weren't visible to integrations before. Astro 6.1 exposes these via the `astro:routes:resolved` hook so tools like the sitemap integration can include them."
---

Astro 6.1 dropped on March 31, and while it's not as dramatic a release as Astro 6.0's experimental Rust compiler, it ships three targeted improvements that address real friction points for content-heavy sites deployed at the edge.

## Sharp Image Service Gets Encoder-Level Controls

The most practically useful change: you can now set codec-specific defaults for Astro's built-in Sharp image pipeline directly in `astro.config.mjs`. Before 6.1, you could control per-image `quality`, but the underlying encoder options — MozJPEG level, WebP effort, AVIF chroma subsampling, PNG compression — were fixed.

In 6.1, with `astro/assets/services/sharp`, you get:

```js
// astro.config.mjs
export default defineConfig({
  image: {
    service: {
      config: {
        jpeg: { mozjpeg: true },
        webp: { effort: 4 },
        avif: { effort: 3, chromaSubsampling: '4:2:0' },
        png: { compressionLevel: 9 }
      }
    }
  }
});
```

These become defaults for compile-time image generation. Per-image `quality` set on `<Image />`, `<Picture />`, or `getImage()` still takes precedence — the hierarchy is preserved.

For sites generating hundreds of variant images at build time, the WebP effort and AVIF settings in particular can meaningfully shift the size/quality tradeoff without touching every image call.

## SmartyPants Gets an Options Object

Astro has long supported SmartyPants for automatic typographic refinement in Markdown. 6.1 surfaces the full `retext-smartypants` options object:

```js
export default defineConfig({
  markdown: {
    smartypants: {
      backticks: 'all',
      dashes: 'oldschool',
      ellipses: 'unspaced',
      openingQuotes: { double: '«', single: '‹' },
      closingQuotes: { double: '»', single: '›' },
      quotes: false
    }
  }
});
```

This matters for sites with localization requirements or strict typographic standards — French, German, and Nordic languages have specific quotation conventions that the boolean-only config couldn't express. The `oldschool` dash mode (`--` for en-dash) is another long-requested option.

## i18n Fallback Routes Now Visible to Integrations

The third change is invisible to end users but matters for the ecosystem: integrations can now see fallback routes generated for i18n configurations using `fallbackType: 'rewrite'`. Previously, these routes existed in the runtime but weren't exposed via the `astro:routes:resolved` hook. Integrations that build route indexes — most notably the sitemap integration — would miss generated fallback routes, producing incomplete sitemaps for multilingual sites.

6.1 adds `fallbackRoutes` to the `IntegrationResolvedRoute` type:

```js
'astro:routes:resolved': ({ routes }) => {
  for (const route of routes) {
    for (const fallback of route.fallbackRoutes) {
      console.log(fallback.pathname) // e.g. /fr/about/
    }
  }
}
```

## The Cloudflare Effect

Astro joined Cloudflare in January 2026, and the 6.1 release is consistent with that direction: content-heavy sites deployed on Workers/Pages, image optimization at the edge, typographic polish that serves readability. The team is no longer spread across funding concerns and can focus on the framework's core positioning. Astro remains MIT-licensed and platform-agnostic, but the roadmap increasingly reflects what Cloudflare's infrastructure makes easy.

Upgrade with:

```bash
npm install astro@latest
```
