---
title: "Astro 7.0.0 Stable Ships Vite 8, Makes the Rust Compiler Default, Adds a Background Dev Server for AI Coding Agents, and Promotes Route Caching, Advanced Routing, and Sätteri to First-Class"
description: "Astro 7.0.0, published on 2026-06-22, lands the 7.0 stable branch after ten weeks of beta. The headline changes: a Vite 8 upgrade, the Rust-based Astro compiler as the default (the Go compiler is removed), the Sätteri Markdown pipeline as the default (remark/rehype moves out of the default install), advanced routing promoted from experimental (with src/fetch.ts as the new default entrypoint), route caching promoted from experimental (top-level cache and routeRules, with cacheNetlify() and cacheVercel() providers landing in the same release), a background dev server mode designed for AI coding agents (astro dev --background, .astro/dev.json lockfile, astro dev stop|status|logs), compressHTML: 'jsx' as the new default, the @astrojs/db package removed, and every official integration bumped a major version (vue 7, react 6, svelte 9, preact 6, solid-js 7, vercel 11, netlify 8, node 11). create-astro@5.1.0, shipped in the same release wave, now writes an AGENTS.md file into every new project with a CLAUDE.md symlink pointing at it."
date: 2026-06-22
image: "/images/heroes/2026-06-22--astro-7-stable-vite8-rust-compiler-ai-agents.png"
author: lschvn
tags: ["frameworks", "ai", "tooling"]
tldr:
  - "Astro 7.0.0 stable, published 2026-06-22, lands Vite 8 (PR #15819, delucis), promotes the Rust-based compiler to default and removes the Go compiler (PR #16462, Princesseuh), and moves the Sätteri Markdown pipeline to default with @astrojs/markdown-remark no longer installed by default (PR #16966). Advanced routing is promoted out of experimental and src/fetch.ts becomes the default entrypoint instead of src/app.ts (PR #16877, matthewp)."
  - "Route caching, behind experimental.cache and experimental.routeRules since v6.0.0, is promoted to a stable top-level cache and routeRules config block with cacheNetlify() and cacheVercel() first-party providers in the same release (PR #17116, ascorbic, and PR #16335 for the providers). The custom logger feature, also experimental since v6.2.0, is stable now with built-in logHandlers.json and logHandlers.node (PR #16745, ematipico). The queuedRendering experimental flag is removed because the streaming replacement is now stable (PR #16981)."
  - "The most agent-specific change is the background dev server mode: astro dev --background starts the dev server as a detached process, writes a .astro/dev.json lockfile with URL/port/PID, and adds astro dev stop, astro dev status, and astro dev logs (-f to follow). Automatic detection of AI coding agents flips it on by default; opt out with ASTRO_DEV_BACKGROUND=0 (PR #16610, matthewp). In the same release wave, create-astro@5.1.0 writes an AGENTS.md file into every new project and creates a CLAUDE.md symlink (hard-link fallback) pointing at it (PR #17122)."
faq:
  - question: "What is the headline change in Astro 7.0.0?"
    answer: "Three large architectural shifts in one release: Vite 8 is now the default dev and build toolchain, the Rust-based Astro compiler is the default (the Go compiler is removed, and the experimental.rustCompiler flag is no longer needed), and the Sätteri Markdown pipeline is the default (remark/rehype is no longer installed by default). On top of that, advanced routing and route caching both graduate out of experimental, and the dev server gets a new background mode designed for AI coding agents."
  - question: "How does the new background dev server mode for AI agents work?"
    answer: "When Astro detects an AI coding agent (the detector looks for known agent environment variables and CLI markers), `astro dev` automatically starts the server as a detached background process and writes a `.astro/dev.json` lockfile containing the server's URL, port, and PID. Three new subcommands ship alongside it: `astro dev stop` shuts the server down, `astro dev status` reports whether one is running, and `astro dev logs` (with `-f` to follow) tails its output. The same flow runs manually with `astro dev --background`. Set `ASTRO_DEV_BACKGROUND=0` in the environment to opt out and force foreground behaviour."
  - question: "What does create-astro@5.1.0 add for AI coding agents?"
    answer: "Every new project created with `npm create astro@latest` now gets an `AGENTS.md` file at the project root with a short Dev section pointing at `astro dev --background` and the `astro dev stop` / `status` / `logs` subcommands, plus a Documentation section with links to the routing, Astro components, content collections, and i18n guides. `create-astro` also creates a `CLAUDE.md` symlink pointing at the same file (with a `fs.linkSync` hard-link fallback if the symlink call fails). On a fresh project, both files exist and point at the same content, so any AI coding agent that looks for either filename will pick up the same Astro context."
  - question: "Does the compressHTML: 'jsx' default break existing sites?"
    answer: "It can. Astro now strips whitespace around elements using JSX rules by default, the same way React does. Whitespace and line breaks between elements are removed; meaningful whitespace on a single line (like a space between two inline elements) is preserved unless you write it explicitly with `{\" \"}`. Sites that relied on whitespace preservation between inline elements will see different rendered HTML. To restore the prior Astro behaviour, set `compressHTML: true` (HTML-aware compression, still removes some whitespace) or `compressHTML: false` (preserve all whitespace). This default flipped in [Astro 7.0.0-beta.5 on 2026-06-18](/articles/2026-06-20--astro-7-0-0-beta-6-stable-cache-jsx-whitespace), and the same article walks through the migration in detail."
  - question: "What do I have to change to migrate from experimental.cache and experimental.routeRules in v6?"
    answer: "Move the cache and routeRules blocks out of `experimental` and onto the top level of your Astro config. The block shape is the same; the only change is the nesting. If you used a custom entrypoint under `experimental.advancedRouting.fetchFile`, that option also moves to the top level (`fetchFile: 'app.ts'`, or rename the file to `src/fetch.ts` which is now the default). For cache providers, the first-party options `cacheNetlify()` and `cacheVercel()` from `@astrojs/netlify/cache` and `@astrojs/vercel/cache` are now the documented stable choices; memoryCache from `astro/config` is the default for local dev."
  - question: "What is removed in 7.0 that I might still depend on?"
    answer: "Three removals to check before upgrading: `@astrojs/db` (deprecated in v6.4.5, now removed, along with `astro db`, `astro login`, `astro logout`, `astro link`, and `astro init`; replace with `node:sqlite` if you used it for local storage, or with Drizzle ORM if you used the schema/query API); the deprecated transition helpers `TRANSITION_BEFORE_PREPARATION`, `TRANSITION_AFTER_PREPARATION`, `TRANSITION_BEFORE_SWAP`, `TRANSITION_AFTER_SWAP`, `TRANSITION_PAGE_LOAD`, `isTransitionBeforePreparationEvent()`, `isTransitionBeforeSwapEvent()`, and `createAnimationScope()` (use the lifecycle event names directly, e.g. `event.type === 'astro:before-preparation'`); and the experimental `queuedRendering` flag, whose streaming replacement is now the default behaviour."
  - question: "Why is the Rust compiler the default now?"
    answer: "The Rust-based Astro compiler (`@astrojs/compiler-rs`) has been the recommended path since the experimental.rustCompiler flag shipped in v6, and the Go compiler is now removed. The release notes are direct: the Rust compiler is faster, more reliable, gives faster build times and faster dev iteration, and is also stricter about invalid syntax (unclosed HTML tags throw rather than being silently ignored). The Go binary is gone in 7.0; if your `astro.config.mjs` still has `experimental: { rustCompiler: true }`, remove it (the flag no longer exists)."
  - question: "What changes for the framework integrations?"
    answer: "Every official integration bumps a major version in lockstep with the 7.0 stable release: `@astrojs/vue` to 7.0.0, `@astrojs/react` to 6.0.0, `@astrojs/svelte` to 9.0.0 (which also pulls in `@sveltejs/vite-plugin-svelte` v7), `@astrojs/preact` to 6.0.0, `@astrojs/solid-js` to 7.0.0, `@astrojs/mdx` gets the same Vite 8 + Sätteri treatment, `@astrojs/vercel` to 11.0.0 (with cacheVercel()), `@astrojs/netlify` to 8.0.0 (with cacheNetlify()), and `@astrojs/node` to 11.0.0. The Container API also gets a new entrypoint: `getContainerRenderer()` now lives at `@astrojs/react/container-renderer` (and equivalent paths for Preact, Svelte, Solid, Vue, and MDX) to keep bundlers from pulling the entire package root when only the Container API is needed. The old import paths still work but log a deprecation warning."
---

[Astro 7.0.0 stable](https://github.com/withastro/astro/releases/tag/astro%407.0.0) shipped on June 22, 2026, ten weeks after the [first 7.0 alpha](https://github.com/withastro/astro/releases/tag/astro%407.0.0-alpha.0) and one beta past the [beta.6 article we ran on 2026-06-20](/articles/2026-06-20--astro-7-0-0-beta-6-stable-cache-jsx-whitespace). The release promotes almost every long-running experimental API to stable, swaps the toolchain over to [Vite 8](/articles/2026-03-26-vite-8-rolldown-era), and bakes two new workflows into the default project: a background dev server designed for AI coding agents, and an `AGENTS.md` file at the root of every new project (with a `CLAUDE.md` symlink pointing at it).

The whole 7.0 line has been telegraphing this release. The Rust compiler graduated from experimental behind a flag, Sätteri moved Markdown off JavaScript and onto a native Rust pipeline, advanced routing replaced the legacy SSR entrypoint, and the cache layer that [shipped experimentally in v6.0](/articles/2026-03-30-astro-6-rust-compiler-cloudflare) is now a stable top-level config. Stable just means the migration is mechanical; the breaking changes (`compressHTML: 'jsx'`, the `@astrojs/db` removal, the dropped transition helpers, the major bumps on every integration) are real.

## Vite 8 and the Rust compiler both become the default

The Vite 8 upgrade ([PR #15819](https://github.com/withastro/astro/pull/15819), delucis) and the Rust compiler promotion ([PR #16462](https://github.com/withastro/astro/pull/16462), Princesseuh) are the two foundational changes in the release. The previous beta builds needed `experimental.rustCompiler: true` in the config; 7.0 removes the Go-based compiler entirely, so the flag is gone with it. The release notes describe the Rust compiler as "faster and more reliable", and the new strictness is a real behaviour change: unclosed HTML tags now throw rather than being silently ignored, and semantically invalid HTML is left for the browser to handle, the same way `document.write()` does.

The [Sätteri Markdown pipeline](https://github.com/withastro/astro/pull/16966) (Princesseuh) is now the default, and `@astrojs/markdown-remark` is no longer installed by default. The release pins `@astrojs/markdown-satteri@0.3.1`. The `markdown.remarkPlugins`, `markdown.rehypePlugins`, and `markdown.remarkRehype` config options still work, but only when `@astrojs/markdown-remark` is explicitly installed and used. The [beta.4 article on Sätteri defaulting](/articles/2026-06-16--astro-7-0-0-beta-4-satteri-default-advanced-routing) walks through the migration in detail; the [beta.6 article](/articles/2026-06-20--astro-7-0-0-beta-6-stable-cache-jsx-whitespace) covers the `compressHTML: 'jsx'` flip and the route caching promotion from experimental.

## Background dev server for AI coding agents

The most agent-specific change in 7.0 is a new background mode for `astro dev` ([PR #16610](https://github.com/withastro/astro/pull/16610), matthewp). When Astro detects an AI coding agent (the detector checks a small set of known environment variables and CLI markers), `astro dev` automatically starts the dev server as a detached background process instead of blocking the agent's terminal. A lock file at `.astro/dev.json` records the server's URL, port, and PID, and three new subcommands ship alongside:

- `astro dev --background` to start the server as a background process explicitly.
- `astro dev stop` to shut the running server down.
- `astro dev status` to check whether a server is running and read the URL, PID, and uptime.
- `astro dev logs` (with `-f` to follow) to read the server output.

The release notes are explicit about opt-out: set `ASTRO_DEV_BACKGROUND=0` before `astro dev` to force foreground behaviour even when an agent is detected. The motivation, also from the PR description, is that AI coding agents cannot usefully hold a foreground dev server in their terminal: a server that is bound to a TTY disappears when the agent moves to the next task, and a server that is not bound holds the port hostage for the next agent iteration.

## AGENTS.md and CLAUDE.md in every new project

In the same release wave, `create-astro@5.1.0` ([PR #17122](https://github.com/withastro/astro/pull/17122), matthewp) now writes a default `AGENTS.md` file into every new project after the template copy step. The generated file is short on purpose:

```
# Development

Start the dev server in background mode:

astro dev --background

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

# Documentation

Full documentation: https://docs.astro.build

Commonly needed references:

- Routing
- Astro Components
- Content Collections
- Internationalization
```

`create-astro` also creates a `CLAUDE.md` file at the project root pointing at the same content, via `fs.symlinkSync('AGENTS.md', claudePath)` with an `fs.linkSync` hard-link fallback if the symlink call fails on the host filesystem. Both files end up holding the same Astro onboarding content, and any AI coding agent that looks for either filename (`AGENTS.md` for the open AGENTS.md convention used by Codex and others, `CLAUDE.md` for Claude Code) will pick it up. This is the first major framework scaffolder to ship an `AGENTS.md` file by default; the Vite ecosystem has been converging on the filename since Codex made it a convention in early 2026.

## Route caching, advanced routing, and the custom logger all graduate

Three long-running experimental features graduate to stable in 7.0. Route caching ([PR #17116](https://github.com/withastro/astro/pull/17116), ascorbic) moves out of `experimental.cache` and `experimental.routeRules` into top-level `cache` and `routeRules` config blocks. The first-party cache providers `cacheNetlify()` (durable cache, shared across edge nodes) and `cacheVercel()` (Vercel-CDN-Cache-Control + Vercel-Cache-Tag) ship in the same release as separate entrypoints in the `@astrojs/netlify/cache` and `@astrojs/vercel/cache` modules. A shared helper module `astro/cache/provider-utils` is exported for third-party provider authors.

Advanced routing ([PR #16877](https://github.com/withastro/astro/pull/16877), matthewp) drops the `experimental.advancedRouting` flag. The default entrypoint is now `src/fetch.ts` instead of `src/app.ts`, and the `fetchFile` option moves to the top level of the config. The custom logger feature ([PR #16745](https://github.com/withastro/astro/pull/16745), ematipico) is also stable, with built-in `logHandlers.json`, `logHandlers.node`, and `logHandlers.console` handlers plus a third-party `entrypoint` path for structured logging against Kibana, Logstash, CloudWatch, Grafana, or Loki.

The `experimental.queuedRendering` flag ([PR #16981](https://github.com/withastro/astro/pull/16981), ematipico) is removed because the streaming replacement is now the default rendering engine; the queue construction and node polling are gone, and only the tag cache survives in a smaller form.

## `@astrojs/db` is gone

`@astrojs/db`, deprecated in v6.4.5, is removed in 7.0. The CLI commands that depended on it (`astro db`, `astro login`, `astro logout`, `astro link`, `astro init`) are gone too. The migration paths the release notes call out: [`node:sqlite`](https://nodejs.org/api/sqlite.html) (available since Node.js 22.5.0) for local SQLite storage under the Node adapter, [Drizzle ORM](https://orm.drizzle.team/) for the schema and query API, or any other database library if you target Turso, PlanetScale, Neon, or similar.

The deprecated transition helpers in `astro:transitions` and `astro:transitions/client` (`TRANSITION_BEFORE_PREPARATION`, `TRANSITION_AFTER_PREPARATION`, `TRANSITION_BEFORE_SWAP`, `TRANSITION_AFTER_SWAP`, `TRANSITION_PAGE_LOAD`, `isTransitionBeforePreparationEvent()`, `isTransitionBeforeSwapEvent()`, `createAnimationScope()`) are also removed. The lifecycle event names are the canonical API now: `event.type === 'astro:before-preparation'`, and so on.

## Every integration bumps a major version

The 7.0 stable wave ships the major bumps in lockstep. `@astrojs/vue@7.0.0`, `@astrojs/react@6.0.0`, `@astrojs/svelte@9.0.0` (also pulls in `@sveltejs/vite-plugin-svelte` v7), `@astrojs/preact@6.0.0`, `@astrojs/solid-js@7.0.0`, and the MDX integration all carry the Vite 8 upgrade plus a new `container-renderer` entrypoint that holds the `getContainerRenderer()` export; importing from the package root still works but logs a deprecation warning. The server adapter majors are `@astrojs/vercel@11.0.0` (with `cacheVercel()`), `@astrojs/netlify@8.0.0` (with `cacheNetlify()`), and `@astrojs/node@11.0.0` (patches only; non-ASCII filename serving, the `astrobot-houston` patch).

The new Container API entrypoint is worth highlighting because it is a real bundle-size win. A typical SSR app that only uses the Container API was importing the entire integration package (`@astrojs/react` with the full client runtime, server runtime, types, and JSX factory) just to call `getContainerRenderer()`. The new `@astrojs/react/container-renderer` entrypoint ships only the Container API surface, and the equivalent paths exist for `@astrojs/preact/container-renderer`, `@astrojs/svelte/container-renderer`, `@astrojs/solid-js/container-renderer`, `@astrojs/vue/container-renderer`, and the MDX integration. Most apps will not need to change anything; the change pays off for library authors and integration authors who want to keep their dependency footprint tight.

## What to watch

The Astro team's pattern over the 7.0 cycle has been to graduate one or two experimental features per beta and roll the migration into the next stable. Two follow-ups are likely in the next two to four weeks. The first is the `astro@7.0.1` and `astro@7.0.2` patches that usually follow a stable release and tend to fix the `compressHTML: 'jsx'` regressions that only show up on real-world content (markdown tables with surrounding inline elements, MDX components that emit raw whitespace, etc.). The second is the `create-astro` updates that extend the `AGENTS.md` content with per-template notes; the scaffold currently only writes the same generic Astro context for every template, and the team has hinted that template-specific notes will follow in `create-astro@5.2.0`.