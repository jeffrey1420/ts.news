---
title: "Knip v6 Lands oxc Parser for 2-4x Performance Gains Across the Board"
description: "The popular dependency and unused-code scanner for JavaScript and TypeScript gets a major overhaul, replacing its TypeScript backend with the Rust-based oxc-parser — and the results are dramatic."
date: 2026-04-01
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["typescript", "javascript", "tooling", "performance", "open-source", "rust"]
faq:
  - question: "What is Knip?"
    answer: "Knip is an open-source CLI tool that finds unused files, dependencies, and exports in JavaScript and TypeScript projects. Think of it as a linting tool for dead code — it helps you clean up your repo before shipping."
  - question: "What is oxc?"
    answer: "oxc is a suite of Rust-based JavaScript/TypeScript tools developed by the Oxc Project (oxc.rs). It includes a parser (oxc-parser), a linter, and a resolver — all written in Rust for maximum speed. The oxc project is the same foundation behind Rolldown and Biome."
  - question: "How do I upgrade to Knip v6?"
    answer: "Run `npm install -D knip@latest` or the equivalent for your package manager. Note that Knip v6 requires Node.js v20.19.0 or newer — Node.js v18 is no longer supported."
  - question: "I was using the classMembers issue type. Is it gone?"
    answer: "Yes, the classMembers issue type was removed in v6. It relied on TypeScript's JS-based LanguageService API (findReferences), which won't be available in the upcoming Go-based TypeScript v7. If your project depends on this, open a GitHub issue on the Knip repo to discuss alternatives."
tldr:
  - "Knip v6 replaces the TypeScript backend entirely with oxc-parser and oxc-resolver, cutting analysis time by 2-4x on large projects."
  - "Astro's codebase went from 4.0s to 2.0s, Sentry from 11.0s to 4.0s, and Microsoft's own TypeScript repo from 3.7s to 0.9s."
  - "The update requires Node.js v20.19.0 or newer, and the classMembers issue type was removed since it depended on TypeScript's JS-based LanguageService API."
  - "The TypeScript v7 rewrite in Go (expected later in 2026) will break the LanguageService API that classMembers relied on, making the switch to oxc timely rather than optional."
---

The team behind [Knip](https://github.com/webpro-nl/knip), the widely-used open-source tool for finding unused files, dependencies, and exports in JavaScript and TypeScript projects, has shipped version 6 — and the headline number is hard to ignore: **2 to 4 times faster** across the board.

The key change is a complete swap of the TypeScript backend for [oxc-parser](https://oxc.rs/docs/guide/usage/parser), the Rust-based parser from the Oxc Project. Author Lars Kappert calls it the natural next step after years of incremental tuning.

## Why the TypeScript backend hit a wall

Knip has always parsed each file only once, but the old TypeScript-based engine carried the overhead of wiring up an entire program and typechecker along with it. That setup was designed for IDEs and language servers — keeping symbols connected across a project — which is considerably more than what a single-pass static analyzer needs.

> "The TypeScript backend made the setup as a whole harder and slower than it needed to be, especially to keep large monorepos in check," Kappert wrote in the [v6 announcement](https://knip.dev/blog/knip-v6).

The TypeScript team is also in the process of rewriting the compiler in Go for v7 (a project Microsoft previewed in March 2026). That rewrite would have eventually broken the LanguageService-based APIs that Knip's more niche features — like `classMembers` tracking — relied on. The move to oxc was as much about future-proofing as performance.

## The numbers

The Knip team benchmarked v5.88.0 against v6.0.0 on real-world projects:

| Project | v5.88.0 | v6.0.0 | Speedup |
|---|---|---|---|
| Astro | 4.0s | 2.0s | 2.0x |
| TanStack Query | 3.8s | 1.7s | 2.2x |
| Rolldown | 3.7s | 1.7s | 2.2x |
| Sentry | 11.0s | 4.0s | 2.8x |
| TypeScript (microsoft/TypeScript) | 3.7s | 0.9s | 4.1x |

The Rust-based parser tears through the Microsoft TypeScript repo in under a second.

## What else changed in v6

Beyond the core performance work, several plugins were updated to statically analyze configuration files directly rather than importing them — including ESLint (flat config), tsdown, and tsup. This removes the need to actually load transitive dependencies just to scan them, further improving speed and reducing memory pressure.

Support for **TypeScript namespaces and modules** improved too, via a new `namespaceMembers` issue type that was previously ignored in v5.

## Breaking changes to be aware of

- **Node.js v20.19.0+ required** — v18 support is dropped
- **classMembers issue type removed** — no longer viable without TypeScript's JS-based LanguageService API
- `--include-libs` and `--isolate-workspaces` flags removed — these are now the default (and only) behavior
- `--experimental-tags` renamed to `--tags`
- Reporter function signatures changed: `issues.files` is now consistent with other issue shapes
- JSON reporter now consistently uses arrays for all issue types

## Upgrade path

```bash
npm install -D knip@latest
```

If your project relies on the `classMembers` feature, [open an issue on GitHub](https://github.com/webpro-nl/knip/issues) — Kappert has signaled openness to finding a solution, possibly a dedicated companion tool.

The [full migration guide and documentation](https://knip.dev) are on the Knip website.
