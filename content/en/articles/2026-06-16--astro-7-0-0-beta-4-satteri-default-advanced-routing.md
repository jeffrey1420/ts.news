---
title: "Astro 7.0.0-beta.4 Makes Sätteri the Default Markdown Processor, Promotes Advanced Routing, Custom Logger, and Queued Rendering to Stable"
description: "Astro 7.0.0-beta.4 (June 15, 2026) flips the Sätteri Rust-based Markdown pipeline on by default, removes the experimental flag from advanced routing, the custom logger, and the new rendering engine, deletes the deprecated astro db/login/logout/link/init CLI commands, and folds the dev-server background mode added in alpha.2 into the default CLI."
date: 2026-06-16
image: "/images/heroes/2026-06-16--astro-7-0-0-beta-4-satteri-default-advanced-routing.png"
author: lschvn
tags: ["frameworks", "tooling", "performance"]
tldr:
  - "Astro 7.0.0-beta.4 shipped on June 15, 2026, the fourth beta on the 7.0 line, and the first one in which the previously opt-in [Sätteri Rust-based Markdown pipeline](/articles/2026-06-01-astro-6-4-rust-satteri-markdown-optimizer) is the default `.md` processor. `@astrojs/markdown-remark` is no longer installed by default; projects that need the unified/remark/rehype stack now have to add it explicitly."
  - "The 7.0 line also stabilizes three features that have been behind experimental flags in 6.x: advanced routing (with first-class Hono support and a new `src/fetch.ts` default entrypoint), the custom logger (with built-in `json`, `node`, and `console` handlers), and the streaming rendering engine that replaced `experimental.queuedRendering`. `fetchFile` is now a top-level config option."
  - "Other 7.0 changes that affect day-to-day work: the `astro db`, `astro login`, `astro logout`, `astro link`, and `astro init` CLI commands are removed, the deprecated `astro:transitions` event constants and `createAnimationScope` helper are gone, and the `astro dev` background mode added in alpha.2 is now the default in agent contexts. The 7.0 line is also the first to officially support Vite 8 (see the [Vite 8.1 beta notes](/articles/2026-06-15-vite-8-1-beta-wasm-esm-chunk-importmap))."
faq:
  - question: "What is new in Astro 7.0.0-beta.4?"
    answer: "Astro 7.0.0-beta.4 (June 15, 2026) is the fourth beta on the 7.0 line. The headline change is that Sätteri, the native Rust Markdown processor that was opt-in in 6.4, is now the default `.md` processor. The 7.0 line also stabilizes advanced routing, the custom logger, and the new streaming rendering engine, removes several deprecated CLI commands and transition event constants, and promotes the `astro dev --background` mode added in 7.0.0-alpha.2 to be the default in AI-agent contexts."
  - question: "What is Sätteri and why is it the default in Astro 7?"
    answer: "Sätteri is Astro's native Rust Markdown processor, distributed as `@astrojs/markdown-satteri`. It was introduced in [Astro 6.4](/articles/2026-06-01-astro-6-4-rust-satteri-markdown-optimizer) as an opt-in replacement for the unified/remark/rehype pipeline, with measured build-time wins of roughly 50 to 80 percent on content-heavy sites. In 7.0.0-beta.4 it becomes the default for every new and upgraded Astro project. The legacy pipeline is still available by installing `@astrojs/markdown-remark` and setting `markdown.processor: unified()` in `astro.config.mjs`."
  - question: "What changes if I was using the experimental advanced routing flag in Astro 6?"
    answer: "The advanced routing feature introduced behind `experimental.advancedRouting` in 6.3 is now stable in 7.0 and enabled by default. The default entrypoint is now `src/fetch.ts` instead of `src/app.ts`, and the `fetchFile` option is a top-level config key, not nested under `experimental`. The migration is: drop the `experimental.advancedRouting` flag from your config, and either rename your custom entrypoint to `src/fetch.ts` or set `fetchFile: 'app.ts'` to keep the old path. The integration with Hono (via `astro/hono`) is also stabilized, with `getFetchState()` now exposed as a public API for Hono middleware."
  - question: "Are the `astro db`, `astro login`, and `astro init` commands removed?"
    answer: "Yes. The `astro db`, `astro login`, `astro logout`, `astro link`, and `astro init` CLI commands are removed in 7.0. The `@astrojs/db` package is deprecated, and the team recommends using a database client (Drizzle, Kysely, etc.) directly instead. The `astro init` command had been mostly replaced by `npm create astro@latest` for some time; the other four are products Astro is no longer investing in."
  - question: "Does Astro 7 support Vite 8?"
    answer: "Yes. Astro 7.0 is the first major line to officially support Vite 8. The 7.0.0-alpha.1 patch specifically removes the warning that Astro does not support Vite v8, and the rest of the 7.0 betas are built and tested against the Vite 8 stable branch. The recent [Vite 8.1 beta](/articles/2026-06-15-vite-8-1-beta-wasm-esm-chunk-importmap) covers what the new Vite line brings in features."
  - question: "Is Astro 7.0.0-beta.4 safe to use in production?"
    answer: "No. This is a beta on the 7.0 line, with the standard caveats: APIs may still change before 7.0.0 stable, several experimental features are being stabilized, and the Sätteri default is a behavior change for any project that relied on the implicit unified pipeline. Use 7.0.0-beta.4 to validate that your Markdown pipeline still works, that your `experimental.advancedRouting` config has been migrated to the new `fetchFile` top-level option, and that you are not depending on the removed CLI commands. Do not pin production to it."
---

[Astro 7.0.0-beta.4](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.4) shipped on June 15, 2026, the fourth beta on the 7.0 line and the first one where the previously opt-in [Sätteri](https://github.com/withastro/astro/pull/16966) Rust-based Markdown pipeline is the default. The release also lands on top of two prior betas (7.0.0-beta.3 on June 9 and 7.0.0-beta.2 earlier in June) that did most of the work to stabilize advanced routing, the custom logger, and the new streaming rendering engine, plus two alphas (7.0.0-alpha.2 and 7.0.0-alpha.0) that brought the Vite 8 upgrade and the `astro dev --background` mode for AI coding agents. The 7.0 line follows the [Astro 6 launch in March](/articles/2026-03-30-astro-6-rust-compiler-cloudflare) and the [Astro 6.4 Sätteri opt-in](/articles/2026-06-01-astro-6-4-rust-satteri-markdown-optimizer); the headline 7.0 story is that almost every experimental feature that 6.x shipped behind a flag has graduated, the default Markdown processor is now Rust, and a handful of long-deprecated APIs are finally deleted.

## Sätteri becomes the default Markdown processor

The headline of 7.0.0-beta.4 is [PR #16966](https://github.com/withastro/astro/pull/16966), which switches the default `.md` processor from the legacy unified/remark/rehype pipeline to Sätteri, the native Rust Markdown processor that Astro 6.4 shipped as an opt-in. The motivation is build performance: the [Astro 6.4 launch post](https://astro.build/blog/astro-6-4/) measured roughly 50 to 80 percent build-time wins on content-heavy sites, and the team has been treating Sätteri as the future of Astro Markdown since the Rust markdown optimizer landed. Beta.4 makes that future the default for every new and upgraded Astro project.

The change is mechanical for projects that do not touch `markdown.remarkPlugins` or `markdown.rehypePlugins`. The deprecation warnings on those config keys, which Astro 6.4 introduced, are now triggered by default; the keys still work as long as `@astrojs/markdown-remark` is installed and `markdown.processor` is set to `unified()`:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  markdown: {
    processor: unified(),
  },
});
```

If the project only used Markdown through the defaults (no remark/rehype plugins, no GFM, no syntax highlighting via unified), the upgrade is a no-op. Sätteri is API-compatible with the standard Markdown feature set that Astro's `.md` files use out of the box, and Astro 6.4 already added support for syntax highlighting via Shiki and GFM tables in Sätteri. The main migration cost is for projects that pulled in `remark-mermaid`, `rehype-slug`, or other custom plugins; those need to be ported to Sätteri's extension API or stay on the legacy pipeline.

The other practical effect is bundle size: `@astrojs/markdown-remark` and its transitive unified ecosystem are no longer installed by default, which means smaller `node_modules` and a faster cold install for projects that do not need them. The deprecation warning is now a hard requirement: if a config sets `markdown.remarkPlugins` or `markdown.rehypePlugins`, Astro 7.0 will refuse to start without `@astrojs/markdown-remark` as a direct dependency.

## Advanced routing is stable, `fetchFile` is a top-level option

The biggest feature that 7.0 promotes from experimental is [advanced routing](https://github.com/withastro/astro/pull/16877), introduced behind `experimental.advancedRouting` in Astro 6.3. The feature gives full control over how requests flow through an Astro application, with first-class support for non-Astro routers like Hono. The 7.0 promotion makes it the default behavior, drops the experimental flag, and moves the entrypoint configuration to a new top-level `fetchFile` option.

The default entrypoint is now `src/fetch.ts` instead of `src/app.ts`. Projects that do not customize the entrypoint do not need to do anything; the new file is auto-created on first run. Projects that wrote a custom `src/app.ts` and relied on the experimental flag have two options:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  fetchFile: 'app.ts', // keep the old entrypoint path
});
```

Or, if the project is starting fresh on 7.0, rename the entrypoint to `src/fetch.ts` and drop the `experimental.advancedRouting` flag entirely. `fetchFile: null` disables the entrypoint for projects that want to keep `src/fetch.ts` as their own file.

The promotion also stabilizes the `astro/hono` integration. `getFetchState()` is now a public API on `astro/hono`, retrievable from a Hono context object so third-party packages can build Hono middleware that interacts with Astro's per-request state. The integration gives `astro/hono` the same extensibility that `astro/fetch` has had since 6.0.

## Custom logger and the new rendering engine are stable

Two other 6.x experimental features graduate in 7.0. [PR #16745](https://github.com/withastro/astro/pull/16745) stabilizes the custom logger, which lets projects replace Astro's default console output with structured JSON, or a custom logger entrypoint that talks to a log aggregation service. The new built-in handlers are `logHandlers.json()`, `logHandlers.node()`, and `logHandlers.console()`:

```js
import { defineConfig, logHandlers } from 'astro/config';

export default defineConfig({
  logger: logHandlers.json({
    pretty: true,
    level: 'warn',
  }),
});
```

`context.logger` is now always available in API routes and middleware, even without a custom logger configured, which removes a long-standing footgun where a project that did not opt in would silently get a default logger that could not be customized.

[PR #16981](https://github.com/withastro/astro/pull/16981) removes `experimental.queuedRendering` entirely, since the streaming rendering engine that replaced it is now stable. The old queue-based engine is gone; the new engine streams components as they are encountered, drops node polling (which did not yield concrete savings), and shrinks the content cache to a tag-name cache. The migration is to remove the `experimental.queuedRendering: {}` flag from the config; if a project had it set, the key no longer exists and Astro 7.0 will warn about it before falling back to the default.

## Background dev server for AI coding agents

The 7.0.0-alpha.2 release added a feature that has been quietly popular with the AI-coding-agent ecosystem: [background dev server management](https://github.com/withastro/astro/pull/16610). When an AI coding agent is detected, `astro dev` now automatically starts the dev server as a detached background process, writing a lock file (`.astro/dev.json`) with the server's URL, port, and PID. The new subcommands are `astro dev --background` (start in the background), `astro dev stop` (kill it), `astro dev status` (check URL, PID, uptime), and `astro dev logs` (with `--follow` / `-f` to stream new output).

The motivation is straightforward: AI coding agents (Claude Code, Codex CLI, Cursor) run in terminals where a foreground dev server blocks the agent's main loop. The background mode keeps the server alive across the agent's tool calls and writes structured output to a log file the agent can tail. The opt-out is `ASTRO_DEV_BACKGROUND=0`. The feature is now the default in agent contexts, which is most of the AI-coding-agent CLI landscape by mid-2026.

The lock file is also the wedge for a broader capability the team is building toward: agents can read `.astro/dev.json` to know which dev server is associated with a project, restart it on demand, and clean it up at the end of a session. The same lock pattern is the foundation for the `astro dev` lifecycle hooks several integrators have been asking for since 6.4.

## What is removed in Astro 7.0

The 7.0 line is also a clean-up release. [PR #17010](https://github.com/withastro/astro/pull/17010) removes the `astro db`, `astro login`, `astro logout`, `astro link`, and `astro init` CLI commands. `@astrojs/db` is deprecated; the team's recommendation is to use a database client (Drizzle, Kysely, etc.) directly. `astro init` had been mostly replaced by `npm create astro@latest`. The other three were products Astro is no longer investing in.

The deprecated `astro:transitions` and `astro:transitions/client` helpers (`TRANSITION_BEFORE_PREPARATION`, `TRANSITION_AFTER_PREPARATION`, `TRANSITION_BEFORE_SWAP`, `TRANSITION_AFTER_SWAP`, `TRANSITION_PAGE_LOAD`, the two `isTransition*Event()` type guards, and `createAnimationScope()`) are also removed. The replacement is to use the lifecycle event names directly (`event.type === 'astro:before-preparation'`, `'astro:after-swap'`, etc.). The internal `state.provide()`, `state.resolve()`, `state.finalizeAll()`, and `App.Providers` extension points on the advanced routing API are also removed; the public replacement is `locals` for per-request state.

The 7.0 line is also the first to officially support Vite 8; the [7.0.0-alpha.1 patch](https://github.com/withastro/astro/releases/tag/astro%407.0.0-alpha.1) explicitly removes the warning that Astro does not support Vite v8. The 7.0 betas are built and tested against the Vite 8 stable branch, which means the [Vite 8.1 beta features](/articles/2026-06-15-vite-8-1-beta-wasm-esm-chunk-importmap) (direct `.wasm` imports, `build.chunkImportMap`, the `server.hmr` → `server.ws` rename) are available to Astro 7 projects as soon as the user upgrades Vite to 8.1.

## Who is affected

The migration cost for the average Astro project is low: most projects will see a faster Markdown pipeline on upgrade, and the new defaults just work. The riskier migrations are the ones that touched `experimental.advancedRouting` (drop the flag, decide whether to rename to `src/fetch.ts` or set `fetchFile`), the ones that used `astro:transitions` event constants (replace with the string event names), and the ones that depend on the removed CLI commands (`astro db`, `astro login`, `astro logout`, `astro link`, `astro init`).

The 7.0 stable cut is expected once the current beta feedback stabilizes, with the deprecation warnings on `markdown.remarkPlugins`, `markdown.rehypePlugins`, and `markdown.remarkRehype` continuing to be loud for another release cycle before they become hard errors. Until then, 7.0.0-beta.4 is the right version to validate against, and the right time to file any remaining complaints about the Sätteri default or the new `src/fetch.ts` entrypoint convention.
