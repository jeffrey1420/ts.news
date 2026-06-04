---
title: "Rolldown 1.1.0 Lands Lazy Barrel Optimization and TypeScript-Aligned Project References"
description: "Rolldown 1.1.0 enables experimental.lazyBarrel by default, bringing meaningful build-time improvements for projects with large barrel files, while also fixing tsconfig project reference resolution to match TypeScript behavior."
date: 2026-06-04
image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200"
author: lschvn
tags:
  - Rolldown
  - Vite
  - bundler
  - performance
  - TypeScript
tldr:
  - experimental.lazyBarrel now defaults to true, skipping compilation of unused barrel exports for meaningful build-time gains on component libraries like Ant Design and MUI
  - tsconfig project-reference resolution now matches TypeScript's behavior, fixing a long-standing mismatch that caused path aliases to resolve incorrectly in monorepos
  - Rolldown 1.1.0 upgrades oxc to v0.134.0 and adds import.meta.glob caseSensitive option alongside sourcemap and code-splitting improvements
---

Rolldown 1.1.0 dropped on June 3, and it ships two behavior-changing improvements that will matter to anyone building with Vite or using Rolldown directly. This is a minor version with breaking defaults, so worth reading before upgrading.

## lazyBarrel Enabled by Default

The headline change: `experimental.lazyBarrel` now defaults to `true`. Rolldown can now detect when a barrel re-export file has no side effects, and skip compiling the re-exported modules that are never actually imported.

For most projects this is invisible — the output is identical. But for codebases with large barrel files, particularly component libraries like Ant Design or `@mui/icons-material`, this translates into a real build-time speedup. The optimization kicks in automatically when the barrel is recognized as side-effect-free.

The opt-out exists but is marked temporary:

```js
// rolldown.config.js
export default {
  experimental: { lazyBarrel: false },
}
```

Rolldown's team notes this flag will be removed in a future release. If you need to disable it, open an issue so the underlying detection can be fixed instead.

## TypeScript Project References Now Work Correctly

The second significant change is a fix to how Rolldown resolves solution-style tsconfig setups — the kind Vite scaffolds with a root `tsconfig.json` that only lists references, delegating actual compiler options to `tsconfig.app.json` or `tsconfig.node.json`.

Rolldown was previously resolving project references differently from how `tsc` does it:

- **Reference match priority**: When the root has references, a referenced project that includes a file now takes precedence over the root — matching TypeScript. Previously the root matched first, overriding project-level `paths` settings.
- **allowJs behavior**: Whether `.js`/`.jsx` files are included is now decided by each referenced project's own `allowJs`, not the root's. This means `tsconfig.app.json` with `allowJs: true` + `paths` now resolves aliases for JS files even when the root doesn't set `allowJs`.

For most Vite monorepo setups this is a **fix**, not a regression. The standard paths aliases now work as expected, resolving a bug reported as [#8468](https://github.com/rolldown/rolldown/issues/8468).

If you relied on the old "root wins" behavior: there is no toggle to restore it, because the old behavior was the bug. The recommended path is to align your config with TypeScript by declaring paths on the referenced project that actually owns the files.

## Other Changes

Rolldown 1.1.0 also includes:

- `import.meta.glob` gains a `caseSensitive` option
- New `SOURCEMAP_BROKEN` warnings for the `renderChunk` and `transform` hooks
- `NO_SIDE_EFFECTS` hint now fires when `@__PURE__` is incorrectly placed before function declarations
- Code-splitting gains `group-local includeDependenciesRecursively` support
- oxc upgraded to v0.134.0, bringing stricter TypeScript declaration parsing

Rolldown powers Vite's bundler, so these improvements will be felt automatically once Vite adopts the new Rolldown version. Watch for a Vite update in the coming days.
