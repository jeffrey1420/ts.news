---
title: "Vite+: One CLI to Rule Them All — Or Just Another Layer of Hype?"
description: "VoidZero's Vite+ promises to unify runtime, package manager, bundler, linter, formatter, and test runner under a single command. We read the announcements, benchmarked the claims, and talked to people using it in production. Here is what we found."
date: "2026-03-22"
category: "deep-dive"
author: lschvn
tags: ["vite", "javascript", "tooling", "rolldown", "oxc", "build-tools", "open-source"]
readingTime: 14
image: "https://viteplus.dev/og.jpg"
tldr:
  - "Vite+ is an alpha CLI by VoidZero (Evan You) wrapping Vite, Vitest, Oxlint, Oxfmt, Rolldown, and tsdown under a single `vp` command."
  - "Rolldown delivers 1.6x–7.7x faster production builds than Vite 7; Oxlint is 50–100x faster than ESLint; Oxfmt ~30x faster than Prettier."
  - "All tools share the same Oxc parser/resolver, eliminating redundant AST rebuilding across the pipeline."
  - "Vite+ is MIT-licensed; VoidZero's revenue comes from planned VoidCloud enterprise layer — the open-source commitment is genuine but worth watching."
---

Every few years, someone in the JavaScript ecosystem announces a unified toolchain — fewer config files, one command to learn, less time babysitting build pipelines. The outcome is usually more complicated than advertised. But Vite+, from VoidZero (founded by Vue.js and Vite creator Evan You, backed by $4.6 million from Accel), arrives with tools whose performance claims are independently verified: Rolldown delivers 1.6× to 7.7× faster production builds than Vite 7, and Oxlint runs 50-100× faster than ESLint.

Vite+ is the latest entrant in this tradition, and it arrives with more credibility than most. It comes from VoidZero, the company founded in late 2024 by Evan You, creator of Vue.js and Vite. The team includes core contributors to Vite, Vitest, Oxc, and former contributors to Rspack. The company raised $4.6 million in seed funding from Accel, with backing from figures at Supabase, Netlify, Sentry, and NuxtLabs.

That pedigree is worth taking seriously. But credibility does not equal substance, and "unified toolchain" has been tried before. This article is an attempt to separate what Vite+ actually is from what it claims to be, and to answer the questions that the announcement posts leave open.

## What Exactly Is Vite+?

Vite+ is an alpha-stage CLI that wraps a set of existing VoidZero projects — Vite, Vitest, Oxlint, Oxfmt, Rolldown, and tsdown — under a single entry point called `vp`.

The commands are:

- `vp env`: manages Node.js installation globally and per-project
- `vp install`: delegates to a package manager (defaults to pnpm)
- `vp dev`: runs the Vite development server
- `vp check`: runs Oxlint (linter), Oxfmt (formatter), and tsgo (type checking) in one pass
- `vp test`: runs Vitest
- `vp build`: builds with Rolldown
- `vp run`: executes package.json scripts via Vite Task, a new runner with caching and dependency awareness
- `vp pack`: packages libraries using tsdown + Rolldown

The stated goal is to replace the sequence of separate commands and config files that a typical project requires — `pnpm install`, `vite`, `vitest`, `eslint`, `prettier`, `tsc --noEmit`, `rollup` — with one binary and one configuration file (`vite.config.ts`).

On paper, Vite+ is a polished distribution of tools that already exist. It does not introduce new parsing algorithms or novel bundling strategies. It wraps and orchestrates existing Rust-based tooling that VoidZero has already open-sourced.

## Why Is VoidZero Doing This?

The strategic logic is coherent, even if the "unified toolchain" framing is partly marketing.

VoidZero's core argument is that the JavaScript ecosystem has accumulated too many seams between tools. ESLint parses your code. Prettier formats it. tsc type-checks it. Rollup bundles it. Vitest tests it. Each tool does its own parsing, its own traversal, its own transformation. The AST gets rebuilt from source over and over. The tooling is fast individually, but the pipeline has structural inefficiencies that no amount of incremental optimization inside each tool can fix.

The VoidZero vision — articulated most clearly in Evan You's founding announcement — is to own the full stack of the toolchain: parser (oxc-parser), transformer (oxc-transform), linter (Oxlint), formatter (Oxfmt), bundler (Rolldown), test runner (Vitest), and dev server (Vite). If every tool shares the same AST representation and the same resolver, you eliminate redundant parsing and you can optimize the whole pipeline as a system rather than as a collection of independent components.

This is the same vertical integration argument that Bun made for the JavaScript runtime layer, and that Turbopack made for the bundler layer. VoidZero is making it for the entire frontend toolchain.

The business model: Vite+ itself is MIT-licensed and fully open source. VoidZero's revenue comes from "VoidCloud," an enterprise layer that presumably adds security scanning, compliance tooling, and managed infrastructure — the same model that HashiCorp used with Terraform, and that Redis adopted before its licensing controversy.

## What Is Actually New vs. Repackaged?

This distinction matters.

**Rolldown** is the most significant original contribution. It is a Rust-based bundler built on Oxc, designed to replace both esbuild (which Vite used for dev transforms) and Rollup (which Vite used for production builds). Rolldown is genuinely new infrastructure, and its performance numbers are real. On a mid-sized React application (180K lines of TypeScript, 60 routes), one developer measured production builds dropping from 94 seconds (Rollup) to 11 seconds (Rolldown) — roughly 8.5× faster. Other teams report 4× to 20× improvements depending on project size.

**Oxc** is the underlying engine. It provides the parser, transformer, resolver, linter, and formatter. Oxlint is 50–100× faster than ESLint. Oxfmt is roughly 30× faster than Prettier. These are real numbers from the Oxc project's own benchmarks, and they have been independently verified in several community tests.

**Vite Task** is the new piece inside Vite+. It is a task runner that adds automated caching to script execution — if the inputs haven't changed, it skips the task and replays the cached output. It also understands the monorepo dependency graph and executes tasks in the right order. This is genuinely useful for large monorepos, and the caching behavior is a quality-of-life improvement that most teams have been approximating with Turbo or Nx.

**tsdown** is a library packaging tool that generates TypeScript declaration files and bundles libraries for npm. It is included but not novel.

What is not new: Vite, Vitest, Oxlint, Oxfmt, and Rolldown all existed before Vite+. Vite+ is a distribution mechanism, not a research project.

## The Performance Claims: Real, but Read the Fine Print

The headline claims are bold:

- ~1.6× to ~7.7× faster production builds compared to Vite 7
- ~50× to ~100× faster linting than ESLint
- Up to ~30× faster formatting than Prettier
- Up to 100,000 component mounts in 100ms (Vue 3.6 with Vapor Mode)

These numbers are real, but they require context.

The 1.6× to 7.7× build speed improvement is real and significant, but the variance is large. Smaller projects see modest gains. Complex codebases with many modules see the bigger wins. The number to watch is not the ceiling — it's the fact that production builds, which have been the slowest part of the development cycle for years, are getting 5–10× faster across the board. The Vue team has reported [similar performance gains with Vapor Mode](/articles/vue-35-major-improvements) — 100,000 component mounts in 100ms — underscoring how broadly Rust-based tooling is reshaping performance expectations.

The linting and formatting numbers are the most dramatic, and they are also the least surprising. ESLint and Prettier are written in JavaScript. Oxlint and Oxfmt are written in Rust. The performance gap between these implementations has been demonstrated repeatedly — Biome showed similar numbers before Oxfmt shipped. The real question is not whether Oxlint is faster (it is), but whether it covers enough of the ESLint and Prettier surface area to be a complete replacement for teams with complex rule configurations.

The Vue 3.6 / Vapor Mode numbers are not a Vite+ feature. They are a separate release, and they are still in beta.

## The Unified Toolchain Concept: Substance or Sloganeering?

"Unified toolchain" is a phrase that should be examined critically.

In Vite+'s case, it means that all the tools share the same configuration file (`vite.config.ts`) and the same CLI entry point. The tools themselves are integrated at the configuration layer. Under the hood, Oxlint, Oxfmt, Rolldown, Vitest, and tsdown are still separate binaries that communicate through defined interfaces. You are not getting a single Rust program that does everything — you are getting a single wrapper that orchestrates several Rust programs.

This is not necessarily a problem. Good composition of good tools is more valuable than a monolithic tool that does everything poorly. But it is worth being clear about what "unified" means here: it means consistent configuration and a consistent CLI, not a single integrated program.

The more substantive part of the unification claim is the shared AST and resolver layer. Because Oxc provides the parser and resolver that Rolldown, Oxlint, and Oxfmt all use, the system avoids parsing the same source file three or four times across the toolchain. In a large monorepo, that adds up.

## The Alpha Status: What It Actually Means

Vite+ is explicitly alpha. VoidZero has not attempted to hide this — the announcement post is titled "Announcing Vite+ Alpha." But alpha deserves scrutiny here.

**What alpha means in practice:**

- Some APIs will change before stable release
- Plugin compatibility, particularly for edge cases in the Rollup plugin API, may not be fully tested
- Performance regressions are possible as the toolchain matures
- Documentation is incomplete

**The more meaningful question is what alpha does not tell you:** whether the team will maintain the same pace of development once the initial excitement fades, whether the enterprise layer (VoidCloud) will create pressure to restrict features in the open-source version, and whether the toolchain will remain MIT-licensed as it matures.

The MIT license is a genuine commitment — VoidZero explicitly abandoned a paid license model after community feedback. But the company's business model depends on something beyond the MIT-licensed tools. That something is not yet public. Worth watching.

## Migration and Adoption Friction

For teams already using Vite, the migration path is genuinely smooth:

1. Install `vp` globally
2. Run `vp migrate` — an automated migration tool
3. Replace individual commands (`vite`, `vitest`, `eslint`, `prettier`, `tsc`) with `vp dev`, `vp test`, `vp check`, `vp build`

The `vp migrate` command is the key piece. It attempts to read your existing ESLint and Prettier configs and translate them to Oxlint and Oxfmt equivalents. For standard configurations, this works. For teams with extensive custom ESLint rules or complex Prettier plugin setups, some manual migration work is likely.

The bigger friction point is philosophical: teams that have carefully tuned their ESLint rule sets over years may be reluctant to switch to Oxlint, even though Oxlint passes most of the commonly used rules. The Oxlint project maintains a compatibility table showing exactly which ESLint rules are implemented and which are not. Before adopting Vite+, it is worth checking that your critical rules are covered.

## Who Should Care Now, and Who Should Wait

**Upgrade now if:**
- You are starting a new project in 2026 and want a fast, minimal config
- You are already using Vite and want to simplify your toolchain without changing behavior
- You have a large monorepo and want the Vite Task caching for script execution

**Wait if:**
- Your project uses complex custom ESLint rules that Oxlint does not yet support
- You are on an older Vite version and cannot spare cycles to test the migration
- Your team relies on specific tooling integrations that have not been tested with Rolldown

## The Skeptical Case

The strongest argument against Vite+ is that it is a repackaging of existing tools dressed in a unified branding. If you are already using Vite 8 with Rolldown, Oxlint, and Vitest, Vite+ gives you a nicer CLI and one config file. That is real value — but it is incremental value on top of tools you could already compose yourself.

The second concern is the VoidZero dependency. Vite was originally a community project with no company behind it. It is now a company with venture funding, an enterprise product roadmap, and a business model that has not been fully disclosed. The MIT license is genuine protection. But the history of open-source infrastructure companies is littered with licenses that changed when the business model demanded it. Terraform, Redis, and Elasticsearch all started with permissive licenses and later restricted them. VoidZero has been explicit about its intentions — but explicit is not the same as permanent.

The third concern is ecosystem lock-in. Vite+ only works with tools from the VoidZero stack. If you want to use Biome instead of Oxlint, or SWC instead of Rolldown, Vite+ is not the right choice. The "one true toolchain" model is appealing until you want to use something outside it.

## The Editorial Judgment

Vite+ is not a revolution. It is a well-designed distribution of genuinely good tooling that was already worth using individually.

The Rust-based JavaScript toolchain — Oxc, Rolldown, and the projects built on them — represents a real and significant performance leap over the JavaScript-based tools it replaces. That leap is not marketing. Independent benchmarks confirm it, and developers using these tools in production are reporting consistent results. This Rust migration is visible across the ecosystem: [Vite 8 has adopted Rolldown](/articles/vite-8-rolldown-era) as its unified bundler, replacing both ESBuild and Rollup in one move.

What Vite+ adds on top of those tools is convenience: one binary, one config file, one mental model for the full development cycle. For new projects and teams frustrated with tooling complexity, that convenience is worth something.

The alpha label should be taken seriously. "Alpha" means the team is still working out edge cases, and the ecosystem is still catching up. But the foundation — Vite 8, Rolldown, Oxc — is more mature than the "alpha" label on Vite+ itself suggests.

Whether Vite+ becomes the standard entry point for the VoidZero toolchain or remains a niche convenience depends on whether the promised VoidCloud enterprise product creates enough separation between the open-source and commercial layers to keep the community's trust. That story is still being written. Separately, the [TypeScript compiler itself is getting a native rewrite](/articles/typescript-7-native-preview-go-compiler) — in Go rather than Rust — signaling that the native tooling wave extends beyond the build pipeline into language infrastructure.

For now: the tools underneath Vite+ are worth knowing regardless of whether you use the wrapper. Rolldown is replacing Rollup. Oxlint is replacing ESLint for teams that want speed. The JavaScript tooling landscape is shifting toward native languages, and Vite+ is the most coherent interface to that shift so far.
