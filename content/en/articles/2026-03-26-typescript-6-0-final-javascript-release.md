---
title: "TypeScript 6.0 Ships: The Last JavaScript-Based Release Before the Go Rewrite"
description: "Microsoft ships TypeScript 6.0 as the final release built on the original JavaScript codebase. DOM type updates, improved inference, subpath imports, and a migration flag set the stage for the native Go-based TypeScript 7.0."
image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop"
date: "2026-03-26"
category: Release
author: lschvn
readingTime: 4
tags: ["typescript", "javascript", "microsoft", "release", "compiler", "nodejs"]
tldr:
  - "TypeScript 6.0 released March 23, 2026 — the last major version on the JS-based compiler before the Go rewrite in TypeScript 7."
  - "Key features: improved inference for contextually sensitive functions, DOM type updates for Temporal APIs, and subpath imports."
  - "A new `--goToJS` migration flag helps projects identify patterns that will behave differently under the Go-based compiler."
  - "Import assertions syntax is deprecated in 6.0 and will error in 7.0 — projects should migrate to the `with` syntax now."
faq:
  - question: "Is TypeScript 6.0 a breaking upgrade?"
    answer: "TypeScript 6.0 carries a meaningful number of breaking changes relative to 5.x, particularly around import assertions syntax and function expression type-checking in generic JSX contexts. Microsoft is using this release to retire patterns that won't survive the jump to 7.0. Review the breaking changes list before upgrading."
  - question: "Should I wait for TypeScript 7.0?"
    answer: "No — TypeScript 6.0 is designed as a bridge release. The breaking changes in 6.0 prepare your codebase for 7.0, so upgrading now and fixing deprecation warnings will make the eventual 7.0 migration smoother."
  - question: "What is the Go rewrite of TypeScript?"
    answer: "TypeScript 7.0 is a full rewrite of the TypeScript compiler in Go, replacing the original JavaScript-based codebase. The Go rewrite targets native execution speed and shared-memory multithreading, which the current architecture cannot leverage effectively. Early benchmarks show significantly faster type-checking on large projects — the VS Code codebase compiles roughly 10x faster under the Go-based compiler."
---

Microsoft released TypeScript 6.0 on March 23, 2026. It is, by design, the end of an era. This is the last major version of TypeScript built on the original JavaScript-based compiler codebase. [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler), currently in development and written in Go, will arrive later this year with native execution speeds and shared-memory multithreading.

Daniel Rosenwasser, principal program manager for TypeScript, [called it](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) a "bridge" between TypeScript 5.9 and [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler) — and the description fits. 6.0 is less about flashy new language features and more about cleaning house and getting the ecosystem ready for the jump to native code.

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
