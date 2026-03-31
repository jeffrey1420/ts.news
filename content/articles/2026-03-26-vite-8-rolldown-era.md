---
title: "Vite 8 Beta Lands: Rolldown is the New Heart of the Build Pipeline"
description: "The Vite 8 beta drops ESBuild and Rollup in favor of Rolldown, signaling a full Rust-based future for the JavaScript build toolchain. What changes, what breaks, and why it matters."
image: "https://opengraph.githubassets.com/80d818d1ffc6c3698c6a86f9be7dc3212b3713a3d3403d7bdb434efaba84e7fa/vitejs/vite"
date: "2026-03-26"
category: Tooling
author: lschvn
readingTime: 4
tags: ["vite", "javascript", "rolldown", "oxc", "build-tools", "tooling", "release"]
tldr:
  - "Vite 8 beta replaces both ESBuild and Rollup with Rolldown as the unified bundler — the biggest internal change since Vite's initial release."
  - "Rolldown is built by the Oxc team and offers faster builds with lower memory usage, especially on large codebases."
  - "Rolldown usage jumped from 1% to 10% in one year per the State of JS 2025 survey, even before Vite 8's stable release."
  - "Plugins written against Rollup's hook system may need updates; Vite plugin authors should test against the beta now."
---

The Vite 8 beta is here, and the headline change has been on the roadmap for two years: Rolldown is now the default bundler, replacing both ESBuild (used for dependencies) and Rollup (used for production builds). This is the most consequential change to Vite's internals since its initial release.

Rolldown, built by the same team behind the Rust-based JavaScript parser Oxc, aims to be a drop-in Rollup replacement with better performance. Vite 8 ships it as the unified bundler underneath the familiar dev server and build commands you've been using.

## What Changes

In practice, most projects should see faster build times and lower memory usage — particularly on larger codebases where the Node.js-based bundlers hit their ceiling. Rolldown runs natively and is designed to leverage multi-threaded hardware in ways that Rollup cannot.

The migration path from Vite 7 to 8 is described by the Vite team as straightforward for the majority of projects, but there are breaking changes. Plugins written against Rollup's hook system may need updates. Projects that rely on fine-grained control over the bundling process should test early.

## A Larger Trend: Rust Eating the Build Pipeline

Rolldown's ascension is part of a broader shift. The State of JavaScript 2025 survey showed Rolldown jumping from 1% to 10% usage in a single year, even before Vite 8's official release. Turbopack, Vercel's Rust-based alternative, sits at 28% usage — but the satisfaction scores tell a different story. Vite's ecosystem moat has proven durable. This Rust-based tooling movement extends beyond Vite: [VoidZero's Vite+](/articles/vite-plus-unified-toolchain) wraps Rolldown, Oxc, and a suite of other Rust tools under a single CLI, representing the most coherent unified interface to the Rust-based JavaScript toolchain to date.

The pattern is consistent: tools written in Rust are displacing JavaScript-based equivalents in the build pipeline not because developers are chasing novelty, but because performance differences are significant and real. TypeScript has [the Go rewrite coming](/articles/typescript-7-native-preview-go-compiler). Vite has Rolldown. The JavaScript toolchain is being rewritten in native languages, piece by piece.

## When Does Vite 8 Land?

The beta is available now for testing. The Vite team has not published a hard release date, but the expectation based on previous release cycles is a stable release within the next few months. If you're maintaining a Vite plugin or a project with custom build configuration, now is the time to test against the beta and report compatibility issues.

```bash
npm install vite@beta
```

Check the [Vite 8 migration guide](https://vite.dev/guide/migration) for the full list of breaking changes before upgrading.
