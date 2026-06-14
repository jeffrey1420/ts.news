---
title: "Astro 6.4.4 Patches Seven Bugs Across Routing, i18n, and Dev Experience"
description: "Astro 6.4.4 is a patch release fixing issues with dynamic routes, i18n domain routing, client-side component editing, and route pattern casing."
date: 2026-06-05
image: "/images/heroes/2026-06-05--astro-6-4-4-routing-i18n-dev-fixes.png"
author: lschvn
tags: ["frameworks", "javascript"]
tldr:
  - Fixes Astro.routePattern correctly preserving parameter casing from filenames (previously lowercased internally)
  - Resolves dynamic routes returning 500 errors when using domain-based i18n routing in SSR mode
  - Client-side component edits no longer trigger unnecessary full program reloads during development
---

Astro 6.4.4 landed on June 3rd, 2026, with a focused patch release addressing seven bugs across routing, internationalization, and the development experience.

## Route Pattern Casing Fix

One of the more subtle but impactful fixes corrects how `Astro.routePattern` handles dynamic parameter names. Previously, a file at `src/pages/blog/[postId].astro` would return `/blog/[postid]` for `Astro.routePattern` due to an internal `.toLowerCase()` call. The method now correctly preserves the original casing from the filename, returning `/blog/[postId]`.

This matters for projects that generate routes programmatically and rely on consistent casing for further processing.

## SSR i18n Domain Routing Fixed

Dynamic routes in SSR mode were returning a 500 `"TypeError: Missing parameter"` error when using domain-based internationalized routing. The bug was traced to how Astro matched incoming requests against route patterns in multi-domain i18n configurations.

Additionally, `Astro.currentLocale` now correctly returns the domain's locale on dynamic routes served from a mapped domain, rather than incorrectly returning the default locale.

## Dev Experience: No More Full Reloads on Client Component Edits

Previously, editing a client-side component (using `client:idle`, `client:load`, etc.) during development would trigger an unnecessary full program reload of the backend. This has been corrected, component edits now properly trigger just the expected hot module replacement without restarting the server.

## Other Fixes

- `App.match()` no longer throws on request paths containing an invalid percent-encoding sequence
- Static file endpoints using `getStaticPaths` with `.html` in dynamic param values (e.g. `{ path: 'file.html' }`) no longer fail with `NoMatchingStaticPathFound` during build, the `.html` suffix is no longer incorrectly stripped
- Style stripping issues on case-sensitive file systems (e.g. running `astro dev` from `d:\dev\app` when the folder on disk is `D:\dev\app`) have been resolved
- Dynamic routes no longer return the string `[object Object]` instead of expected content in certain runtimes

The `@astrojs/mdx` integration was also updated to v6.0.2, pulling in an updated Sätteri processor (v0.8.0) from the Markdown parser work that shipped in Astro 6.4.

Astro 6.4.4 is available on npm now.
