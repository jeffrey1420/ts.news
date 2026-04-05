---
title: "ESLint v10 Drops Legacy Config — And the JS Ecosystem Is Taking Notes"
description: "ESLint's biggest breaking-change release in years finalises flat config, removes eslintrc support entirely, and adds JSX reference tracking. But the bigger story might be what's nipping at its heels."
date: "2026-04-05"
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["javascript", "typescript", "eslint", "tooling", "openjs"]
---

ESLint v10 landed this month, and while the headline reads like an internal cleanup — flat config is now final, legacy eslintrc is gone — the release exposes a fracture line in the JavaScript tooling landscape that's been building for years.

## What actually changed

The headline removal is `LegacyESLint`, the compatibility layer that kept `.eslintrc.json` working after flat config (`eslint.config.js`) became the default in v9. That's gone entirely. The `defineParser()`, `defineRule()`, `defineRules()`, and `getRules()` methods on `Linter` are gone. `shouldUseFlatConfig()` now unconditionally returns `true`.

The config file lookup also changed meaningfully: ESLint now resolves configuration from the directory of each linted file rather than the current working directory. For monorepos where packages need different rule sets, this is a direct fix to a long-standing pain point.

JSX reference tracking is the other major addition. Previously, ESLint's `no-unused-vars` would flag components imported and used only in JSX as unused — a false positive that required workarounds like `@eslint-react/jsx-uses-vars`. That plugin is no longer needed.

`RuleTester` gets three new assertion options — `requireMessage`, `requireLocation`, and `requireData` — letting plugin authors enforce stricter, more consistent test definitions. Stack traces now include the index and file location of failing test cases.

Node.js support tightened to `^20.19.0 || ^22.13.0 || >=24` — all of v21 and v23 are dropped.

## The migration

The official tool handles it cleanly:

```bash
px @eslint/migrate-config .eslintrc.json
```

This generates an `eslint.config.mjs` that teams review and adjust. The [official migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0) covers every breaking change in detail.

One wrinkle: `eslint-plugin-react` hadn't declared ESLint 10 in its peer dependencies at the time of release, causing install conflicts for React projects. `eslint-config-next` had a [similar open issue](https://github.com/vercel/next.js/issues/91702). Both have since been addressed, but it's a reminder that ecosystem lag is real when a breaking change this significant ships.

## The competitive context

ESLint has sat largely unchallenged as the default JS linter for over a decade. That position is now being tested from two directions simultaneously.

[Biome](https://biomejs.dev/) combines linting and formatting in a single tool — no separate ESLint + Prettier setup — with 467 rules covering ESLint, TypeScript ESLint, and other sources. Its v2.4 release (February 2026) added embedded CSS and GraphQL snippet support, 15 HTML accessibility rules, and experimental full parsing for Vue, Svelte, and Astro. It ships a Rust-based parser and is known for significantly lower memory usage.

[Oxc](https://oxc.rs/) takes the performance argument further. Its linter, Oxlint, claims 50–100x faster throughput than ESLint depending on CPU core count. It has 700+ rules, true type-aware linting via its `tsgo` project, and supports ESLint JS plugins natively. Its formatter, Oxfmt, benchmarks 30x faster than Prettier and 3x faster than Biome. All of it is open source under the OpenJS Foundation.

The trade-off is rule coverage. Oxlint doesn't yet match ESLint's full catalogue, and Biome is still catching up on TypeScript-specific rules. But the trajectory is clear, and the performance gap is not marginal — it's structural. ESLint's single-threaded JavaScript architecture has a ceiling that Rust-based alternatives don't share.

tldr[]
- ESLint v10 removes LegacyESLint and legacy eslintrc entirely — flat config is the only option now, and config lookup starts from each file's directory for better monorepo support
- JSX reference tracking eliminates a long-standing false positive with no-unused-vars, and RuleTester gets meaningful improvements for plugin authors
- Rust-based challengers Biome and Oxc are making real inroads: Biome combines linting and formatting in one tool, while Oxlint claims 50–100x throughput over ESLint with 700+ rules and ESLint plugin compatibility

faq[]
- **Should I upgrade immediately?** If you're on Vercel or a platform with managed ESLint, your config will likely be updated automatically. For custom setups, test in CI before rolling out.
- **Does this break my React project?** Possibly — if eslint-plugin-react hasn't been updated for your project, you may hit peer dependency conflicts. Check your package manager's resolution output.
- **Should I switch to Biome or Oxlint?** Not yet for full ESLint parity, but worth evaluating if lint performance is a bottleneck. Both are production-ready for most projects.
- **What's the Node.js requirement?** v10 needs Node.js 20.19+, 22.13+, or 24+. Node 21 and 23 are dropped.
