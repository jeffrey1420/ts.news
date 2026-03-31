---
title: "TypeScript 6.0 Ships: The Last JavaScript-Based Release Before the Go Rewrite"
description: "Microsoft ships TypeScript 6.0 as the final release built on the original JavaScript codebase. DOM type updates, improved inference, subpath imports, and a migration flag set the stage for the native Go-based TypeScript 7.0."
image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop"
date: "2026-03-26"
category: Release
author: tsw
readingTime: 4
tags: ["typescript", "javascript", "microsoft", "release", "compiler", "nodejs"]
---

Microsoft released TypeScript 6.0 on March 23, 2026. It is, by design, the end of an era. This is the last major version of TypeScript built on the original JavaScript-based compiler codebase. TypeScript 7.0, currently in development and written in Go, will arrive later this year with native execution speeds and shared-memory multithreading.

Daniel Rosenwasser, principal program manager for TypeScript, [called it](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) a "bridge" between TypeScript 5.9 and 7.0 — and the description fits. 6.0 is less about flashy new language features and more about cleaning house and getting the ecosystem ready for the jump to native code.

## What's New in TypeScript 6.0

**DOM type updates** bring TypeScript's built-in type definitions in line with the latest web standards, including adjustments to the Temporal APIs. If you've been tracking the evolving `Date` alternatives in JavaScript, this matters.

**Improved inference for contextually sensitive functions** is the most significant user-facing change. TypeScript can now infer parameter types across property order in object literals, even with methods written in traditional syntax. Previously, passing `consume` before `produce` in a generic call would leave `y` typed as `unknown` — that now works correctly.

**Subpath imports** allow more precise `paths` mappings in `tsconfig.json`, letting you map nested imports without catching unrelated siblings.

**A new migration flag** — `--goToJS` — helps projects navigate the transition to TypeScript 7.0 by identifying patterns that will behave differently under the Go-based compiler.

## Breaking Changes to Know

TypeScript 6.0 carries a meaningful number of breaking changes relative to 5.x. Microsoft is using this release to retire patterns that won't survive the jump to 7.0.

Import assertions syntax (`import ... assert {...}`) is now deprecated and will produce errors in 7.0. The newer `import()` syntax with `with` (e.g. `import(..., { with: {...} })`) is the replacement.

Function expression type-checking in generic JSX contexts has been tightened. Code that relied on loose inference here may need explicit type arguments in 6.0.

The overall direction from the TypeScript team is clear: if something is deprecated in 6.0, it will not exist in 7.0. Treat warnings as errors and plan accordingly.

## Why the Go Rewrite Matters

The move to Go is not cosmetic. The current TypeScript compiler, running on Node.js, has well-documented performance ceilings — especially on large codebases. The Go rewrite targets two things: native execution speed and shared-memory multithreading, which the current architecture cannot leverage effectively.

Early benchmarks from Microsoft suggest the Go-based compiler is significantly faster at type-checking large projects. That's the main thing keeping large enterprise TypeScript codebases awake at night.

## What This Means for Your Projects

If you're on TypeScript 5.x, upgrading to 6.0 should be relatively straightforward for most projects — but read the breaking changes list before you do. If you're on an older version, this is the moment to audit deprecated patterns and clean them up before 7.0 lands.

The TypeScript team has published guidance on the migration path at [devblogs.microsoft.com/typescript](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/).

Install the new version with:

```bash
npm install -D typescript@6
```
