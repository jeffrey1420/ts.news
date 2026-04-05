---
title: "Oxc Is Quietly Building the Fastest JavaScript Toolchain in Rust — And It's Almost Ready"
description: "While ESLint v10 was wrestling with legacy cleanup, the Oxc project shipped a linter 100x faster, a formatter 30x faster than Prettier, and a parser that leaves SWC in the dust. Here's what the JavaScript oxidation compiler actually is."
date: "2026-04-05"
image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&h=630&fit=crop"
author: lschvn
tags: ["javascript", "rust", "tooling", "oxc", "performance", "typescript"]
---

There's a project called [Oxc](https://oxc.rs/) that most JavaScript developers haven't heard of yet. It's the JavaScript Oxidation Compiler — a collection of high-performance JavaScript tools written in Rust. And depending on which benchmark you look at, it might already be the fastest thing in the category.

## What Oxc actually is

Oxc isn't a single tool. It's a suite of components that each target a specific job in the JavaScript tooling pipeline:

- **Oxlint** — an ESLint-compatible linter claiming 50–100x faster throughput than ESLint, with 700+ rules and ESLint JS plugin support
- **Oxfmt** — a Prettier-compatible formatter benchmarking 30x faster than Prettier and 3x faster than Biome
- **oxc-parser** — a JavaScript/TypeScript parser that's 3x faster than SWC and 5x faster than Biome on parsing benchmarks
- **oxc-transform** — a transpiler handling TypeScript, JSX, and React Fast Refresh
- **oxc-resolver** — a module resolver 28x faster than webpack's enhanced-resolve
- **oxc-minify** — an alpha-stage minifier with dead code elimination and variable name mangling

All of it is open source, and all of it comes from [Void Zero](https://voidzero.dev/), the company behind the project.

## The numbers are not close

Oxc's own benchmarks are worth looking at directly. On a MacBook Pro M3 Max parsing `typescript.js`:

- Oxc: 26.3ms
- SWC: 84.1ms
- Biome: 130.1ms

For linting, Oxlint is 50–100x faster than ESLint depending on CPU core count. For formatting, Oxfmt is 3x faster than Biome and 35x faster than Prettier. The transformer is 4x faster than SWC, uses 20% less memory, and ships as a 35MB package versus SWC's 37MB.

These aren't incremental gains. They're an architectural gap.

## Type-aware linting without tsc

One of the more interesting claims is "true type-aware linting powered by tsgo." Most type-aware ESLint rules (or Biome's type inference) require running the TypeScript compiler as a separate step or implementing custom type inference. Oxc's approach apparently doesn't rely on `tsc` in the same way — which would be meaningful for lint speed in large TypeScript codebases.

## ESLint plugin compatibility

Oxlint supports ESLint JS plugins natively. This is the critical unlock for adoption: teams don't need to rewrite their existing rule configurations from scratch. If a plugin is written in plain JavaScript (the majority of the ESLint ecosystem), it can run on Oxlint with minimal friction.

Rule coverage is the remaining gap. Oxlint has 700+ rules, but ESLint's ecosystem is much larger. For teams with specific, niche rule requirements, this may still be a blocker.

## The bigger picture

Oxc fits into a broader pattern in the JavaScript ecosystem: tools originally written in JavaScript being rewritten in Rust (or Go, as TypeScript is reportedly exploring) for performance. Biome did it first with a combined linter+formatter. SWC set the baseline. Rolldown did it for bundling. Oxc is doing it across the entire pipeline.

ESLint v10's release this week — with its painful legacy migration and the community's frustration around migration paths — is a reminder that incumbency doesn't protect against a better product. Oxc isn't there yet on ecosystem parity. But the trajectory is one to watch closely in 2026.

tldr[]
- Oxc is a Rust-based JavaScript toolchain from Void Zero covering linting, formatting, parsing, transforming, and module resolution — all claiming significant performance leads over existing JS-native alternatives
- Oxlint is 50–100x faster than ESLint with 700+ rules and ESLint JS plugin compatibility; Oxfmt is 30x faster than Prettier and 3x faster than Biome
- The main remaining gap is ecosystem breadth — Oxlint doesn't yet match ESLint's full rule catalogue, but the architecture advantage is structural, not incremental

faq[]
- **Can I replace ESLint with Oxlint today?** For most projects, probably — Oxlint has 700+ rules and supports ESLint JS plugins. But check your specific rule requirements first.
- **Is Oxc production-ready?** The linter (Oxlint) and formatter (Oxfmt) are considered stable. The minifier is alpha. The parser passes all Test262 stage 4 tests.
- **How does it compare to Biome?** Biome combines linting and formatting in one tool and has more mature framework support (Vue, Svelte, Astro). Oxc is faster on raw performance and covers more of the pipeline (transformer, resolver, minifier).
- **Who funds this?** Void Zero is the company behind Oxc. They have gold, silver, and bronze sponsors, and the project is open source under the OpenJS Foundation.
