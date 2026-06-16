---
title: "Rolldown 1.1.0 Lands with lazyBarrel Enabled by Default"
description: "Rolldown 1.1.0 introduces two notable behavior changes: experimental.lazyBarrel is now enabled by default, and tsconfig project-reference resolution has been updated to match TypeScript's behavior."
date: 2026-06-05
image: "/images/heroes/2026-06-05--rolldown-1-1-0-lazybarrel-default-tsconfig.png"
author: lschvn
tags: ["tooling", "javascript"]
tldr:
  - "experimental.lazyBarrel" now defaults to true, skipping compilation of unused barrel exports for significant build-time speedups on large component libraries
  - oxc_resolver upgraded to 11.21.0, fixing tsconfig project-reference resolution to match TypeScript's behavior exactly
  - The lazyBarrel opt-out flag is planned for removal in a future release
---

Rolldown 1.1.0 landed on June 3rd, 2026, and despite being a minor release, it ships two behavior changes that developers should review before upgrading.

## lazyBarrel Enabled by Default

The headline change is that `experimental.lazyBarrel` now defaults to `true`. When a barrel module (a file that re-exports from other modules) is recognized as side-effect-free, Rolldown skips compiling the re-exported modules that are never actually imported by the consuming code.

The practical impact is most noticeable on large component libraries such as Ant Design or `@mui/icons-material`. In many codebases, these libraries export hundreds of icons or components through barrel files, but any given application only uses a handful. With lazyBarrel enabled by default, Rolldown can now skip the unused exports entirely, reducing both compile time and output bundle size.

The release notes acknowledge one edge case: if a barrel is incorrectly classified as side-effect-free, the optimization could drop a module that was being relied on for its side effects. The opt-out is straightforward for now:

```js
export default {
  experimental: { lazyBarrel: false },
}
```

The Rolldown team notes this opt-out flag is planned for removal in a future release. If you encounter a case where you need to disable it, the recommendation is to open an issue so the underlying detection logic can be improved instead.

## tsconfig Project Reference Resolution Now Matches TypeScript

The second change involves how Rolldown resolves paths through solution-style tsconfig files (the pattern Vite scaffolds by default, where `tsconfig.json` only lists references and delegates the real settings to `tsconfig.app.json` or `tsconfig.node.json`).

Upgrading oxc_resolver from 11.19.1 to 11.20.0, then to 11.21.0, brings Rolldown's resolution in line with how `tsc` itself behaves:

- **Reference match priority**: when the root tsconfig has references, a referenced project that includes a file now takes precedence over the root. Previously the root matched first, which meant the root's `compilerOptions.paths` were applied even when a referenced project owned the file.

- **allowJs behavior**: whether a `.js`, `.jsx`, `.mjs`, or `.cjs` file is included is now decided by each referenced project's own `allowJs` setting, not the root's. This means if `tsconfig.app.json` sets `allowJs: true` with path aliases, those aliases will now correctly resolve for `.js` files even when the root tsconfig does not set `allowJs`.

The release acknowledges this is a behavior change for projects that relied on the previous "root wins" resolution. The recommended path forward is to align your tsconfig structure with TypeScript's expectations rather than work around Rolldown's previous behavior.

## Other Changes

The full changelog also includes:

- `import.meta.glob` now supports a `caseSensitive` option
- A `SOURCEMAP_BROKEN` warning is now emitted for the `renderChunk` and `transform` hooks when sourcemaps may be invalid
- Improved error messaging: missing tsconfig files now report `TSCONFIG_ERROR` instead of `UNHANDLEABLE_ERROR`
- Code-splitting now supports `group-local` `includeDependenciesRecursively`
- Multiple bug fixes in the chunk optimizer for dynamic entry handling

Rolldown 1.1.0 is available on npm now.

---

faq:
  - question: "What does 'lazyBarrel' mean in Rolldown?"
    answer: "A 'barrel' is a file that re-exports from multiple other modules. lazyBarrel optimization detects when a barrel has no side effects and skips compiling the unused re-exported modules, speeding up builds for large libraries."
  - question: "My build broke after upgrading Rolldown. What should I check?"
    answer: "First, check if you're relying on side effects from a barrel file's re-exports. You can temporarily opt out with `experimental: { lazyBarrel: false }`. Second, if you use TypeScript project references, verify your tsconfig structure matches TypeScript's expected layout."
  - question: "How does this affect Vite users?"
    answer: "Rolldown is the bundler powering [Vite 8](/articles/2026-04-08-vite-8-stable-seven-patches-in-three-weeks) and later. These changes apply automatically when you upgrade Rolldown as a dependency or when Vite ships a new Rolldown version."
