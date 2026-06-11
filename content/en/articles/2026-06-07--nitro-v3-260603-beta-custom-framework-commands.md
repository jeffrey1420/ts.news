---
title: "Nitro v3.0.260603-beta: Custom Framework Commands and Default Preset Config"
description: "Nitro's latest beta adds support for custom framework preview and deploy commands, introduces a defaultPreset config option for customizing the fallback preset, and fixes a type-stripping edge case."
date: 2026-06-07
image: "/images/heroes/2026-06-07--nitro-v3-260603-beta-custom-framework-commands.png"
author: lschvn
tags: ["runtimes", "frameworks", "typescript"]
tldr:
  - "Nitro 3 beta now lets frameworks inject custom preview and deploy commands, enabling tighter integration with platform-specific tooling."
  - "A new defaultPreset config option allows you to customize the fallback preset when no explicit preset is specified, giving more control over deployment behavior."
  - "A type-stripping fix ensures TypeScript extension-only retries are handled correctly, preventing potential build issues with certain module resolutions."
faq:
  - question: "What does 'custom framework preview/deploy commands' mean in Nitro 3?"
    answer: "Framework plugins can now provide their own preview and deploy commands that Nitro will invoke as part of the build pipeline. This allows frameworks built on top of Nitro to wire in platform-specific tooling without needing separate CLI entrypoints."
  - question: "What is the defaultPreset config option?"
    answer: "The defaultPreset option lets you set which preset Nitro should fall back to when no explicit preset is configured. Previously the fallback was hardcoded; now you can customize it — useful when your setup needs a specific default that differs from the out-of-box behavior."
  - question: "What was the type-stripping fix in this release?"
    answer: "The fix ensures that when TypeScript retries resolving a module path with added extensions (.ts, .tsx), Nitro only strips extensions it actually retried — not all possible extensions. This prevents edge cases where legitimate module resolution could be incorrectly skipped."
---

Nitro's v3 beta train keeps rolling. Build `3.0.260603-beta` — the date-stamped versioning means June 3, 2026 — is a small release, but two of its changes matter to anyone building a framework on top of Nitro, which since the [v3 beta announcement](https://nitro.build/blog/v3-beta) includes TanStack Start and the upcoming Nuxt major.

## Frameworks can now own `preview` and `deploy`

Nitro has always handled the build; what happens after was left to the platform. This release lets framework plugins register their own preview and deploy commands, so a framework can wire platform-specific tooling into the same pipeline its users already run.

Concretely: if your framework targets, say, Cloudflare with a custom workflow, it can now expose that as the canonical `preview`/`deploy` path rather than documenting a separate CLI. Less "run our other tool after the build", more one pipeline that does the right thing per platform.

## `defaultPreset`: control the fallback

When no deployment preset is configured and none is detected, Nitro used to fall back to a hardcoded default. A new `defaultPreset` config option makes that fallback explicit:

```ts
export default defineNitroConfig({
  defaultPreset: "cloudflare_module",
});
```

This is most useful in monorepos and framework presets where "no preset specified" should mean something specific to your setup — not whatever Nitro happens to default to.

## A type-stripping edge case, fixed

The release also fixes a subtle module-resolution bug: when resolution retries a path with added TypeScript extensions (`.ts`, `.tsx`), Nitro now only strips the extensions it actually retried, instead of all possible ones. Edge case, but the kind that produces a baffling "module not found" in exactly one file of a large project.

## Should you update?

If you're on the v3 beta already, yes — it's a safe incremental update via `npm i nitro@beta`. If you're a framework author, the custom command hooks are the headline: they're the first piece of v3's "bring your own framework" story that extends past the build step into deployment. For everyone else, this is a good reminder that v3 is iterating fast — weekly date-stamped betas — ahead of [Nuxt 5 shipping on Nitro v3 and H3 v2](/articles/2026-06-03--nitro-v3-0-260522-beta-tracing-vfs-vercel-queues).
