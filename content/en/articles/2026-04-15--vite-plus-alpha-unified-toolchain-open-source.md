---
title: "Vite+ Alpha Launches: VoidZero's Unified Toolchain Wants to Replace Your Entire JS Dev Stack"
description: "Vite+ Alpha drops today under MIT license, unifying Vite, Vitest, Oxlint, Oxfmt, and Rolldown into a single vp binary. Node.js runtime and package manager management included."
image: "https://viteplus.dev/og.jpg"
date: "2026-04-15"
category: Tooling
author: lschvn
readingTime: 5
tags: ["vite", "javascript", "tooling", "voidzero", "rolldown", "oxc", "release"]
tldr:
  - "Vite+ Alpha is out under MIT license, combining Vite, Vitest, Oxlint, Oxfmt, Rolldown, and tsdown into a single vp binary."
  - "New Vite Task runner handles monorepo builds with automatic input tracking and caching — no manual configuration required."
  - "VoidZero open-sourced Vite+ after initially considering a paid license, citing community feedback as the reason for the MIT switch."
faq:
  - q: "Is Vite+ replacing Vite?"
    a: "No. Vite+ is a meta-layer on top of Vite 8 (and Vitest, Oxlint, Oxfmt, Rolldown, and tsdown). The underlying projects remain independent. Vite+ simply manages them under one consistent CLI."
  - q: "How does Vite+ differ from just using Vite 8 directly?"
    a: "Vite 8 handles dev server and production builds. Vite+ adds vp install (smart package manager), vp check (linting + formatting + type-checking), vp test (Vitest), vp run (task runner with caching), vp pack (library bundling via tsdown), and vp env (Node.js version management) — all in one binary with a single config file."
  - q: "What about licensing? Is this really free?"
    a: "Yes, MIT licensed. VoidZero initially considered a commercial license but changed course, citing that paid gating would create friction for the workflows developers already enjoy. Their business model centers on Void Cloud, their managed platform."
---

VoidZero today released Vite+ Alpha, a unified development toolchain that collapses the sprawling complexity of modern JavaScript tooling into a single binary called `vp`. The announcement covers everything from runtime management to production builds, and it's all open source under the MIT license.

## What's Inside Vite+

Vite+ orchestrates a stack of established Rust-powered tools:

- **Vite 8** — dev server and build orchestrator
- **Vitest 4.1** — test runner
- **Oxlint 1.52** — ESLint-compatible linter (50–100× faster)
- **Oxfmt beta** — Prettier-compatible formatter (up to 30× faster)
- **Rolldown** — production bundler (1.6× to 7.7× faster than Vite 7)
- **tsdown** — TypeScript library bundler
- **Vite Task** — new task runner with automatic caching

The pitch is a single dependency that replaces `node` version managers, `pnpm`/`npm`/`yarn`, `vite`, `vitest`, `eslint`, `prettier`, and various CI caching scripts. One `vite.config.ts` to rule them all.

## The vp Commands

```bash
vp env          # Manages Node.js globally and per-project
vp install      # Installs deps, auto-selects the right package manager
vp dev          # Starts Vite dev server with instant HMR
vp check        # Runs Oxlint + Oxfmt + type-checking in one pass
vp test         # Runs Vitest
vp build        # Production build via Rolldown + Oxc
vp run          # Task runner with automatic caching
vp pack         # Bundle library for npm or create standalone binaries
vp create       # Scaffold new projects or monorepos
```

`vp check --fix` handles linting and formatting fixes in one command. `vp run` mimics `pnpm run` interface-wise but adds automatic input fingerprinting — if nothing changed, it replays cached output instantly without re-running the task.

## Vite Task: Smarter Monorepo Builds

The most novel piece is Vite Task, a task runner built into Vite+. It tracks which input files a command actually uses (via fingerprinting) and skips execution entirely if inputs haven't changed. Multi-command scripts like `tsc && vp build` are split into independently cached sub-tasks.

Configuration lives in `vite.config.ts`:

```ts
export default defineConfig({
  run: {
    tasks: {
      'generate:icons': {
        command: 'node scripts/generate-icons.js',
        cache: true,
        envs: ['ICON_THEME'],
      },
    },
  },
})
```

The first run generates icons; subsequent runs skip it unless source files or `ICON_THEME` change.

## From Paid to MIT

VoidZero initially planned a commercial license with paid features. The Alpha announcement walks that back: *"We got tired of debating which features should be paid and how they should be gated, as this only creates friction in the workflows our open-source users already enjoy."* The company's business model now centers on Void Cloud, their managed hosting platform.

## Numbers

- **78.7k** GitHub stars
- **69M+** weekly npm downloads (Vite ecosystem)
- **35M+** weekly npm downloads (Rolldown + Oxc tools combined)

## Getting Started

```bash
# macOS / Linux
curl -fsSL https://vite.plus | bash

# Windows (PowerShell)
irm https://vite.plus/ps1 | iex

# Then
vp help
vp create my-app
```

Migration is a single `vp migrate` command, or you paste the migration prompt into your favorite AI coding assistant.

This is an alpha. The toolchain is functional but the team is clear that stabilization and frequent releases will follow. For developers tired of juggling half a dozen config files and CLI tools, Vite+ is worth watching — or trying today.
