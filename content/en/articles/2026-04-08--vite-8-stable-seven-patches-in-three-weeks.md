---
title: "Vite 8 Stable Lands, Seven Patches Follow in Three Weeks"
description: "Vite 8.0.0 shipped stable on March 12, and the patch releases haven't stopped — v8.0.7 landed April 7 with fixes across CSS, SSR, WASM, and dev server behavior. A contrast to the long beta cycle."
image: "https://opengraph.githubassets.com/80d818d1ffc6c3698c6a86f9be7dc3212b3713a3d3403d7bdb434efaba84e7fa/vitejs/vite"
date: "2026-04-08"
category: Tooling
author: lschvn
readingTime: 4
tags: ["vite", "javascript", "build-tools", "tooling", "release", "rolldown"]
tldr:
  - "Vite 8.0.0 stable shipped March 12, 2026, with Rolldown as the unified bundler replacing both ESBuild and Rollup."
  - "Seven patch releases (v8.0.1 through v8.0.7) followed in three weeks, addressing CSS, WASM SSR, dev server restarts, and sourcemap handling."
  - "Forwarding browser console output to the dev server terminal was a highly requested DX improvement added in the beta cycle."
  - "The rapid patch cadence reflects the challenges of a major bundler swap — plugin authors and large projects should monitor the changelog closely."
faq:
  - q: "Is Vite 8 stable safe to use in production?"
    a: "With seven patches in three weeks, the Vite team is actively addressing regressions. For new projects, v8 is reasonable. For large existing projects with custom plugin configurations, review the changelog and test before upgrading."
  - q: "What's the difference between this article and the March 26 Vite 8 beta article?"
    a: "The March 26 article covered the beta features and the Rolldown migration in depth. This article focuses on the stable release and the unusually rapid patch cadence that followed it."
  - q: "Should I skip to v8 or stay on v7?"
    a: "If you're starting a new project, use v8. If you have a stable v7 project with complex build config, the v7 to v8 migration guide should be reviewed before upgrading. The Rolldown swap introduces edge-case differences in plugin behavior."
---

Vite 8.0.0 went stable on March 12, 2026. Three weeks and seven patch releases later, the Vite team is on v8.0.7 as of April 7. That's a faster response cadence than most major releases in the JavaScript ecosystem, and it reflects the complexity inherent in swapping out both ESBuild and Rollup for Rolldown as the unified bundler.

## What Stable Brought

The headline change from the beta cycle is Rolldown. Vite 8 is built around `rolldown 1.0.0-rc.9`, which replaced both ESBuild (used for dependency pre-bundling) and Rollup (used for production builds) with a single Rust-based bundler. The performance and memory benefits are real, particularly for larger projects, but so are the edge cases when you have hundreds of community plugins built against Rollup's exact hook interface.

Also new in the stable: browser console output is now forwarded to the dev server terminal. This was a frequently requested DX improvement — when you're debugging in the browser, the errors and logs now surface where you're already watching, instead of requiring a separate DevTools tab.

## The Patch Tally

The changelog from v8.0.1 to v8.0.7 shows fixes across a wide surface area:

- **v8.0.1** (March 19): Initial stable patch
- **v8.0.2** (March 23): Dev server watch behavior fixes
- **v8.0.3** (March 26): Further watcher refinements
- **v8.0.4** (April 6): CSS and SSR fixes
- **v8.0.5** (April 6): Additional SSR and module-runner fixes
- **v8.0.6** (April 7): Continued bug fixes
- **v8.0.7** (April 7): Latest patch

The rapid-fire April 6-7 releases suggest a specific batch of regressions was found and fixed quickly.

Notable fix categories across the cycle:
- **Dev server**: concurrent restart prevention, EADDRINUSE handling, proxy error responses (502 vs 500)
- **CSS**: public file URL handling with `server.origin`, CSS injection for IIFE output
- **WASM**: SSR support for `.wasm?init`, asset URL regex `lastIndex` reset bug
- **Module runner**: column number handling in sourcemaps, stacktrace robustness
- **TypeScript/transform**: tsconfig cache handling, symlink resolution

## Browser Console Forwarding: Small Detail, Big DX

The addition of browser console forwarding to the dev server terminal (merged in beta.17) deserves specific mention. Previously, browser console output was disconnected from the terminal where you're running `vite`. With the default dev server configuration, console.log, errors, and warnings now appear where you're already watching. It's a quality-of-life improvement that aligns Vite's dev experience with the kind of integrated feedback that tools like Turbopack offer.

## Vite 7 Still Supported

For projects not ready to move, Vite 7 remains supported. The v7 to v8 migration guide is available at vite.dev. The Vite team has been consistent that most straightforward projects migrate without significant issues, but projects with custom plugins or unusual bundler configurations should budget time for testing.

The upgrade path:

```bash
npm install vite@latest
```

Monitor the [CHANGELOG](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md) for your specific plugins — the community ecosystem is still catching up to the Rolldown interface.
