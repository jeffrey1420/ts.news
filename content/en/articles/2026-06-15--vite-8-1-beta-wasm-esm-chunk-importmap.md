---
title: "Vite 8.1 Beta Lands Direct `.wasm` Imports, `build.chunkImportMap`, and a `server.hmr` → `server.ws` Rename"
description: "Vite 8.1.0-beta.0 (June 15, 2026) is the first beta of the 8.1 line. It ships the WASM ESM Integration standard as direct .wasm imports, a build.chunkImportMap option that uses import maps to improve chunk cache hit rates, integration with Vite Task for zero-config build caching, support for lightningcss plugin dependencies, and a breaking rename of every `server.hmr` option to `server.ws`."
date: 2026-06-15
image: "/images/heroes/2026-06-15--vite-8-1-beta-wasm-esm-chunk-importmap.png"
author: lschvn
tags: ["tooling", "javascript", "typescript"]
tldr:
  - "Vite 8.1.0-beta.0 shipped on June 15, 2026 as the first beta of the 8.1 line and the first feature release on the [Vite 8 stable branch](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks). It lands direct .wasm imports via the [WASM ESM Integration](https://github.com/WebAssembly/esm-integration) draft standard, a build.chunkImportMap option that uses browser import maps for chunk-level cache stability, integration with Vite Task for zero-config build caching, and a breaking rename that moves all `server.hmr` options to `server.ws`."
  - "The WASM ESM Integration support closes the long-standing vite#4551, and replaces the `?init` / `?url` / `?raw` suffixes with a single import pattern that the bundler resolves into proper ESM glue code. Vite parses the binary, extracts imports and exports, and emits an import-friendly module that works in both dev and SSR builds."
  - "Other 8.1 changes that affect day-to-day work: `import.meta.glob` gains a `caseSensitive` option, `html.additionalAssetSources` lets you register custom elements and attributes as asset sources, Vite tracks dependencies when loading config with the native Node loader, and the `bundledDev` flag is folded into `DevEnvironment` instead of being a separate environment. The release also bumps Rolldown to 1.1.1 (see the [Rolldown 1.1.0 notes](/articles/2026-06-05--rolldown-1-1-0-lazybarrel-default-tsconfig))."
faq:
  - question: "What is new in Vite 8.1 beta?"
    answer: "Vite 8.1.0-beta.0 is the first feature release on the Vite 8 stable branch, published on June 15, 2026. The headline items are direct .wasm imports via the WASM ESM Integration standard (no more `?init` suffix), a `build.chunkImportMap` option that uses import maps for better chunk caching, integration with Vite Task for zero-config build caching, lightningcss plugin dependency support, an `html.additionalAssetSources` config for custom elements, a `caseSensitive` option for `import.meta.glob`, and a breaking rename that moves every `server.hmr` option to `server.ws`. The release also updates Rolldown to 1.1.1."
  - question: "How do direct .wasm imports work in Vite 8.1?"
    answer: "You import a .wasm file the same way you would import any other ES module: `import add from './add.wasm'`. Vite parses the binary, extracts its imports and exports, and emits glue code that returns a WebAssembly.Module instance. The old `?init`, `?url`, and `?raw` query suffixes still work, but the default import path now matches the WASM ESM Integration draft. The feature is based on the WebAssembly community group's esm-integration proposal and works in both client and SSR builds."
  - question: "What does the `server.hmr` to `server.ws` rename change?"
    answer: "Before 8.1, every WebSocket option (host, port, clientPort, path, timeout, overlay) lived under `server.hmr` in vite.config.ts. From 8.1, all of these options are at `server.ws` instead, and `server.hmr` becomes a boolean toggle for whether HMR is enabled. The fix is mechanical: search your config for `server.hmr` and split it into `server.ws` (for ws options) and `server.hmr` (for the boolean enable flag). The rename fixes the long-standing problem that you could not configure ws options while HMR was disabled."
  - question: "What is build.chunkImportMap and why does it matter?"
    answer: "`build.chunkImportMap` is a new build option that emits an import map alongside the chunk graph, so the browser can resolve chunk URLs through the map rather than via the import statement alone. Because import map entries are stable across rebuilds when the chunk file path does not change, the browser can reuse previously fetched chunks across deploys. The option is implemented on top of Rolldown's experimental chunkImportMap feature and relies on `import.meta.resolve` in the browser, so it does not apply to older browsers; the `plugin-legacy` companion covers them with SystemJS."
  - question: "How does Vite 8.1 integrate with Vite Task?"
    answer: "Vite 8.1 pulls in a new `@voidzero-dev/vite-task-client` dependency that lets it talk to Vite Task at runtime through the same IPC the runner already uses. Vite declares its build inputs, outputs, and `envPrefix` envs through the client, which is a no-op when Vite runs outside Vite Task. The result is that `vp run vite build` caches correctly without any manual env or input declaration in the task config. The change is a companion to the [Vite+ unified toolchain](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source) work."
  - question: "Is Vite 8.1 beta safe to use in production?"
    answer: "No, this is a beta. The Rolldown swap that landed in Vite 8.0 still surfaces plugin edge cases, and the 8.1 beta adds new ones on top. Use 8.1.0-beta.0 to validate that your plugin chain still works, your `server.hmr` config has been migrated to `server.ws`, and your WASM imports are still emitted correctly. Do not pin production to it. A stable 8.1.0 will follow in the coming weeks once the beta feedback is processed."
---

[Vite 8.1.0-beta.0](https://github.com/vitejs/vite/releases/tag/v8.1.0-beta.0) shipped on June 15, 2026, the first feature release on the [Vite 8 stable branch](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks) and the first 8.x beta since the [Vite 8 stable cut on March 12](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks). After ten weeks of small patch releases against the v8.0 line, the Vite team is using 8.1 to land a cluster of changes that have been sitting in PRs for months: a real implementation of the WASM ESM Integration standard for direct `.wasm` imports, a `build.chunkImportMap` option that uses browser import maps to stabilize chunk caching, integration with the Voidzero Vite Task runner for zero-config build caching, support for lightningcss plugin dependencies, and a long-overdue breaking rename that moves every `server.hmr` option to `server.ws`. The release also bumps Rolldown to 1.1.1 (see the [Rolldown 1.1.0 notes](/articles/2026-06-05--rolldown-1-1-0-lazybarrel-default-tsconfig) for the 1.1 line background).

The beta drops just over three months after Vite 8.0 stable, which is a faster cadence than the 5.x to 6.x transition. Most of the 8.1 features are opt-in or behind new config keys, so the upgrade from 8.0 is largely non-breaking, with the one notable exception of the `server.hmr` rename, which will require a config edit for any project that currently sets WebSocket options.

## Direct `.wasm` imports via the WASM ESM Integration standard

The headline feature of 8.1 is [PR #21779](https://github.com/vitejs/vite/issues/21779), which closes the long-standing [issue #4551](https://github.com/vitejs/vite/issues/4551) by adding support for importing `.wasm` files directly without the `?init` suffix. The feature implements the [WASM ESM Integration](https://github.com/WebAssembly/esm-integration) draft from the WebAssembly community group, the same spec that lets browsers treat `.wasm` files as ES modules natively.

The new import pattern looks like this:

```js
// Old (Vite 8.0 and earlier)
import init from './add.wasm?init';
const instance = await init();

// New (Vite 8.1+)
import { add } from './add.wasm';
console.log(add(2, 3));
```

Under the hood, Vite parses the binary, extracts its imports and exports, and emits glue code that returns a properly-typed `WebAssembly.Module` instance. The plugin handles both dev and SSR build modes, and the `?init`, `?url`, and `?raw` query suffixes still work, so existing code does not need to migrate in lockstep.

The shift matters because every other bundler in the JavaScript ecosystem has had to invent a non-standard import suffix for WASM. Vite 8.1 aligns the import path with the eventual browser-level spec, which means the same import statement will work in a future where browsers ship WASM ESM natively and Vite falls away. The feature is independent of browser support today, because Vite still does the parsing and glue generation; the browser-level spec just standardizes the long-term target.

## `build.chunkImportMap` for stable chunk caching

[PR #21580](https://github.com/vitejs/vite/issues/21580) adds a new `build.chunkImportMap` option, implemented on top of [Rolldown's experimental chunkImportMap feature](https://rolldown.rs/reference/InputOptions.experimental#chunkimportmap). The motivation is chunk cache stability across deploys.

In a default Rolldown build, every chunk filename contains a content hash, and import statements point directly at the hashed URL. When a single source file changes, every chunk that imports it (directly or transitively) gets a new hash, which cascades through the import graph and invalidates more chunks than strictly necessary. Import maps decouple the import statement from the chunk URL: the statement says `import { x } from '/chunks/x.js'`, the import map says `/chunks/x.js` resolves to `/chunks/x-abc123.js`, and when the chunk content is unchanged, the hashed URL stays the same and the browser reuses it.

The implementation relies on `import.meta.resolve` in the browser, so `chunkImportMap` only works on browsers that support it. The companion [plugin-legacy](https://github.com/vitejs/vite) release covers older browsers with SystemJS-based import map support. Two follow-up caveats are worth noting: `experimental.renderBuiltUrl` does not currently work with this option, and the optimization does not yet apply to CSS and assets, only to JavaScript chunks.

The fix targets the long-running issues [#6773](https://github.com/vitejs/vite/issues/6773) and [#10636](https://github.com/vitejs/vite/issues/10636), which means this is a feature the Vite team has been considering since the v3 era. It is opt-in and gated by Rolldown's experimental flag, so it is worth measuring on a real production build before turning it on by default.

## Vite Task integration for zero-config build caching

[PR #22453](https://github.com/vitejs/vite/issues/22453) integrates Vite with the Voidzero Vite Task runner (`vp run` in [Vite+](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source)) so that `vite build` can be cached with zero user configuration. The mechanism is a small new dependency, `@voidzero-dev/vite-task-client`, that Vite calls at the relevant code paths to declare its build inputs, outputs, and `envPrefix` envs. The calls are no-ops when Vite runs outside Vite Task, so there is no cost for users who are not on the runner.

The problem this solves is real and annoying: Vite Task tracks file reads and writes at the syscall level, but env vars have to be declared manually in the task config. Most projects use the `VITE_*` prefix convention for client-visible env vars, and previously the developer had to keep two configs in sync, the `envPrefix` in `vite.config.ts` and the `env` list in the Vite Task config, or the cache would silently produce wrong bundles. With 8.1, Vite reports the `VITE_*` envs it actually reads, and Vite Task fingerprints them automatically. Forgetting to declare an env no longer produces a stale-cache bug.

The integration is a building block in the [Vite+ unified toolchain](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source) story: it makes the runner's caching story meaningful for Vite users without forcing a config migration, and it gives Voidzero a way to incrementally add more task-level optimizations to `vite build` without changing the Vite config surface.

## The `server.hmr` → `server.ws` rename

[PR #21357](https://github.com/vitejs/vite/issues/21357) is the breaking change of the release. Before 8.1, every WebSocket-related option (host, port, clientPort, path, timeout, overlay) lived under `server.hmr` in `vite.config.ts`. The problem this caused is that you could not configure the WebSocket settings when HMR itself was disabled by `server.hmr: false`, because the config object was off entirely.

The 8.1 split is straightforward:

```ts
// Old (Vite 8.0 and earlier)
export default defineConfig({
  server: {
    hmr: {
      host: 'localhost',
      port: 24678,
      clientPort: 24678,
    },
  },
});

// New (Vite 8.1+)
export default defineConfig({
  server: {
    hmr: false, // boolean toggle, same as before
    ws: {
      host: 'localhost',
      port: 24678,
      clientPort: 24678,
    },
  },
});
```

The migration is mechanical: grep your config for `server.hmr` and split it into `server.ws` (for the WebSocket options) and `server.hmr` (for the boolean enable flag). Any config that only used `server.hmr: true` or `server.hmr: false` does not need changes. The rename has been discussed since issue [#18489](https://github.com/vitejs/vite/issues/18489) was opened, and it lands in 8.1 as the single breaking change of the line.

## Other 8.1 changes worth knowing

The rest of the 8.1 beta is a mix of small ergonomic improvements and refactors:

- **`html.additionalAssetSources`** ([#21412](https://github.com/vitejs/vite/issues/21412)) lets you register custom HTML elements and attributes as asset sources, for things like `<html-import src="...">` or `<img data-src-dark="..." data-src-light="...">`. Without this, Vite only rewrites URLs in a hardcoded list of elements, which breaks the URLs in custom web components.
- **`import.meta.glob` `caseSensitive` option** ([#21707](https://github.com/vitejs/vite/issues/21707)) gives glob pattern matching an opt-in case-sensitive mode. The default remains case-insensitive to match glob semantics, but on case-sensitive filesystems (Linux, macOS) the case-insensitive match can produce surprising results.
- **Lightningcss plugin dependency support** ([#21748](https://github.com/vitejs/vite/issues/21748)) makes Vite honor plugin dependencies declared by `lightningcss` itself, so adding a lightningcss plugin no longer requires manual registration on the Vite side.
- **Multiple hosts in `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`** ([#21501](https://github.com/vitejs/vite/issues/21501)) lets the env variable take a comma-separated list of allowed hosts, instead of a single one.
- **Dependency tracking for native config loading** ([#22602](https://github.com/vitejs/vite/issues/22602)) tracks dependencies of the `vite.config.ts` when Vite loads it through the native Node loader, so edits to imported config files correctly trigger a dev server restart.
- **`bundledDev` folded into `DevEnvironment`** ([#22587](https://github.com/vitejs/vite/issues/22587)) removes the separate `DevEnvironment` subclass for `bundledDev` mode. The flag is now an option on the standard `DevEnvironment` class, which simplifies plugin code that has to handle both modes.
- **Pnpm global virtual store fs restrictions** ([#22415](https://github.com/vitejs/vite/issues/22415)) apply the correct fs restrictions when a dep is installed in pnpm's gvs layout, so Vite correctly distinguishes which deps can be read from the dev server and which cannot.
- **Sourcemap preservation for optimized deps with follow-up transforms** ([#22428](https://github.com/vitejs/vite/issues/22428)) keeps the original sourcemap intact when a dep is re-transformed after pre-bundling, so stack traces still point at the original source.

## How to try it

```bash
bun add -D vite@8.1.0-beta.0
# or
npm install -D vite@8.1.0-beta.0
```

A few things to validate as you upgrade:

1. The `server.hmr` rename. If your config sets any WebSocket option, move it to `server.ws` and keep `server.hmr` as the boolean enable flag.
2. Your WASM imports. Run the dev server and a production build, and confirm that both the new direct import pattern and the legacy `?init` pattern still emit working code.
3. Plugin behavior on Rolldown 1.1.1. The Vite 8.0 stable release surfaced several plugin edge cases during the patch cycle, and 8.1 carries the same inheritance. The Rolldown update itself is small, but the combined effect on plugin chains warrants a smoke test.
4. `import.meta.glob` with `caseSensitive: true` on case-sensitive filesystems, if your project relies on glob matching for routing or asset collection.

Vite 8.1 is a beta, not a stable release, and the Vite team will run a few weeks of beta feedback before cutting 8.1.0 stable. The breaking change is small, the new features are opt-in, and the dependency on Rolldown 1.1.1 is the same as Vite 8.0.x already had, so the upgrade risk for projects on 8.0 stable is low. Pin to 8.0.16 for production, and use 8.1.0-beta.0 to validate that your plugin chain and config survive the rename. Stable 8.1 will land in the coming weeks.
