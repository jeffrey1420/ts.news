---
title: "Oxc v0.135 Lands the React Compiler Rust Port and a `#[non_exhaustive]` AST Break"
description: "Oxc 0.135 integrates the React Compiler Rust port, marks AST nodes as #[non_exhaustive] (a breaking change for downstream Rust crates), adds two new template-escape AstBuilder methods, and brings dozens of parser strictness and codegen whitespace fixes."
date: 2026-06-12
image: "/images/heroes/2026-06-12--oxc-v0-135-react-compiler-ast-breaking.png"
author: lschvn
tags: ["tooling", "performance", "typescript"]
tldr:
  - "Oxc 0.135 integrates Meta's React Compiler as a Rust tool inside the oxc monorepo (PR #22942), giving downstream bundlers and toolchains a first-class Rust implementation to plug into."
  - "The release marks Oxc AST nodes as #[non_exhaustive], a breaking change that requires a patch release for every downstream Rust crate that pattern-matches on the AST."
  - "Oxlint v1.69 ships schemas for 30+ ESLint rules, adds Vue rules (next-tick-style, require-direct-export, no-reserved-props, require-prop-types), and oxfmt 0.54 rounds out the release."
faq:
  - question: "What broke in Oxc 0.135?"
    answer: "Two breaking changes. First, every Oxc AST node is now marked #[non_exhaustive] (PR #23046), so downstream Rust crates that pattern-match exhaustively on AST variants will need a patch release and an explicit `_ =>` arm or wildcard. Second, two new AstBuilder methods were added (template_element_escape_raw and template_element_escape_raw_with_lone_surrogates, PR #23047); existing AstBuilder users do not break, but any custom builder will need to be aware of the new method shapes."
  - question: "What is the React Compiler Rust port, and why does it matter?"
    answer: "Meta's React Compiler memoizes React components and hooks automatically. Until now the implementation was TypeScript inside the React repo. The Rust port is a from-scratch rewrite that lives inside the oxc monorepo from 0.135 onward, and downstream tools (Vinext, Rolldown, future bundlers) can call into it without depending on Node or a JS runtime."
  - question: "Which downstream tools are affected by 0.135?"
    answer: "Any Rust crate that pattern-matches on Oxc AST: Rolldown (used by Vite/Vinext), oxc-traverse, oxc-transform, and any custom transformer built on top of oxc_parser. JS/TS bundlers that ship as standalone binaries (Rolldown CLI, Vite, Vinext) will pick up the new AST through their normal update flow; their users do not need to do anything."
  - question: "What is the practical impact on a TypeScript project?"
    answer: "If you only consume Oxc through Vite, Rolldown, or oxlint, you get the new rules, the codegen whitespace fixes for smaller minified output, and (eventually) a faster React Compiler in your bundler. The breaking change is invisible to JS/TS users; it lands on Rust downstream maintainers."
---

[Oxc 0.135.0](https://github.com/oxc-project/oxc/releases/tag/crates_v0.135.0) and [oxlint 1.69.0](https://github.com/oxc-project/oxc/releases/tag/apps_v1.69.0) shipped on June 8, 2026. The headline is the React Compiler Rust port landing inside the oxc monorepo. The subhead is a breaking AST change that every Rust downstream needs to handle.

## React Compiler, in Rust

The most consequential change in 0.135 is [PR #22942, "react_compiler: Integrate the Rust port of the React Compiler"](https://github.com/oxc-project/oxc/pull/22942). Meta has been writing a from-scratch Rust port of the React Compiler, and 0.135 is the version where it ships as a first-class crate inside the oxc workspace. The compiler analyzes React function components and hooks, then emits memoized output that skips re-renders when props and state are referentially stable.

For Rust-based JS/JSX/TS toolchains, this is the missing piece. The previous implementation lived in the React repo as TypeScript, which meant any Rust tool that wanted React Compiler output had to shell out to Node or bundle a JS runtime. With the Rust port inside oxc, Rolldown, Vinext, and future bundlers can integrate the compiler directly, which is the path the VoidZero tooling stack has been building toward since [Vite+ alpha launched](/articles/2026-04-15-vite-plus-alpha-unified-toolchain-open-source).

For application developers, the visible change is incremental: smaller minified output and faster builds as downstream bundlers adopt the new crate. The architectural move is what matters for the ecosystem.

## The `#[non_exhaustive]` breaking change

0.135 also marks every Oxc AST node as `#[non_exhaustive]` (PR #23046). This is a real breaking change for Rust downstreams that pattern-match exhaustively on AST variants: Rolldown, oxc-traverse, oxc-transform, and any custom transformer built on top of `oxc_parser` will need a patch release with an explicit wildcard arm or `_ =>` branch.

In practice the patch is mechanical. The change is upstream's first time touching AST public surface since the project started treating the AST as a stable contract, and it signals a wider hardening push. If you maintain a Rust crate that depends on oxc, expect a small PR to land soon.

A second, smaller addition: two new `AstBuilder` methods, `template_element_escape_raw` and `template_element_escape_raw_with_lone_surrogates` (PR #23047), for codegen paths that need to handle unpaired surrogates in template literals. Existing builder users do not break, but custom builders should pick up the new methods.

## Parser, codegen, and oxlint

The 0.135 parser gains several strictness checks that previously slipped through. Reserved type-declaration names are now reported, as are import-type aliases to non-external references, abstract private class fields, and duplicate switch default clauses. The codegen side adds a long list of whitespace fixes for minified output: tighter conditional-type and constructor-type spacing, dropped redundant spaces after `else` and `export default`, and proper spacing around postfix `++` and `--` operators.

Oxlint 1.69 ships schemas for [30+ ESLint rules](https://github.com/oxc-project/oxc/releases/tag/apps_v1.69.0), including `jest/vitest/max-expects`, `jest/vitest/expect-expect`, `jest/vitest/consistent-test-it`, `import-max-dependencies`, `prefer-default-export`, `sort-vars`, `radix`, `prefer-const`, `no-warning-comments`, `no-unused-vars`, `no-shadow`, `no-restricted-exports`, `no-param-reassign`, `no-magic-numbers`, `no-inner-declarations`, `no-constant-condition`, `no-empty-function`, `id-match`, `capitalized-comments`, `id-length`, `complexity`, and `class-methods-use-this`. The Vue analyzer picks up `next-tick-style`, `require-direct-export`, `no-reserved-props`, and `require-prop-types`. oxfmt 0.54 rounds out the release with formatter-side fixes that were not breaking.

The release is the natural follow-up to the [0.134 drop covered here](/articles/2026-06-02--oxc-v0-134-oxlint-1-68-oxfmt-0-53-vue-typescript-rules), and tracks the project's accelerated cadence: a 0.126 release in [April added Turbopack magic comments and an allocator break](/articles/2026-04-18--oxc-v0-126-turbopack-magic-comments-allocator-breaking), a 0.134 in June added Vue and TypeScript rules, and 0.135 lands the React Compiler Rust port. Rolldown, which uses Oxc, picked up [lazyBarrel as the default in 1.1.0](/articles/2026-06-05--rolldown-1-1-0-lazybarrel-default-tsconfig); the next Rolldown minor is the place to expect the React Compiler integration to surface in production builds.
