---
title: "Oxc v0.126.0: Turbopack Magic Comments Land in the Parser, Allocator Breaking Changes"
description: "Oxc v0.126.0 ships support for Turbopack magic comments in the parser, a breaking rename of Box and Vec allocator methods, new NAPI transform options for enum optimization, and continued performance work on the lexer and allocator."
date: 2026-04-18
image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Oxc", "Rust", "JavaScript", "Turbopack", "Rolldown", "SWC", "Tooling"]
tldr:
  - Oxc v0.126.0 adds parser support for Turbopack magic comments (`/* webpack */`, `/* resource */`, etc.), improving compatibility with code that uses webpack-style annotations
  - A breaking change renames Box and Vec methods in the allocator crate — projects depending on Oxc's internal allocator API will need updates
  - NAPI transform users can now control `optimizeConstEnums` and `optimizeEnums` directly, giving more control over enum inlining in the compiled output
---

## What Changed

Oxc's April 16 release — crates v0.126.0 — is a relatively quiet one in terms of user-facing features but ships meaningful tooling improvements and one unavoidable breaking change.

### Turbopack Magic Comments in the Parser

The headline feature is [parser support for Turbopack magic comments](https://github.com/oxc-project/oxc/pull/20803). These are special comments like `/* webpackChunkName */`, `/* webpackPreload */`, and `/* resource */` that bundlers use to communicate metadata about dynamic imports and code splitting. Until now, the Oxc parser treated them as plain comments. With this change, they're recognized and preserved semantically, which means tools built on Oxc — including Rolldown, the Rust-based successor to Rollup — can process webpack-annotated code more accurately.

If you're using ` Rolldown` or any toolchain that wraps Oxc's parser, this should reduce spurious warnings and improve tree-shaking decisions when working with code originally written for webpack.

### Allocator Breaking Changes

The more disruptive change is a [rename of `Box` and `Vec` methods in the allocator crate](https://github.com/oxc-project/oxc/pull/21395). This is a breaking change targeting projects that directly depend on Oxc's internal allocator API — most users of Oxc through Rolldown or oxlint won't be affected.

The rename aligns the allocator's method naming with updated Rust idioms and removes some historical inconsistencies that accumulated as the crate evolved. If you're maintaining a fork or a deep integration with Oxc internals, budget time to update your method calls after upgrading.

### NAPI Transform: Enum Optimization Controls

The NAPI transform — used by the Node.js binding for `oxc_transform` — now exposes `optimizeConstEnums` and `optimizeEnums` as configurable options. These flags control whether the transformer should inline enum values at compile time, reducing runtime enum lookup overhead. The addition is straightforward but useful for performance-sensitive TypeScript projects that use enums heavily.

### Performance: Arena and Lexer

Two commits targeted steady-state performance improvements:

- The allocator's [Arena chunk allocation was simplified](https://github.com/oxc-project/oxc/pull/21475), reducing overhead when creating new memory chunks during large file processing.
- The lexer [refactored out `LexerContext`](https://github.com/oxc-project/oxc/pull/21275), a structural cleanup that reduces branching during tokenization.

Neither of these are user-visible behavior changes, but they contribute to Oxc's continuing lead in JavaScript parsing and transformation benchmarks.

### Bug Fixes

A handful of fixes landed in this release:

- The transformer now [preserves correct execution order for class field accessors](https://github.com/oxc-project/oxc/pull/21369) when `useDefineForClassFields: false` — a niche but important edge case for projects with non-standard class field semantics.
- The minifier fixed a bug [producing illegal `var;` when folding unused argument copies](https://github.com/oxc-project/oxc/pull/21421) — a code generation bug that could produce invalid JavaScript output.
- Update expressions are now treated as unconditionally side-effectful, [fixing a minification correctness issue](https://github.com/oxc-project/oxc/issues/21456) where the minifier could incorrectly remove expressions.

## FAQ

### Does this affect oxlint users?

No. oxlint is built on Oxc's linting infrastructure, not the allocator or parser changes in this release. You should be able to update without any config changes.

### What about Rolldown users?

Rolldown benefits from the Turbopack magic comment support and any parser correctness fixes. The allocator breaking change is internal and should not affect Rolldown's public API.

### How do I update?

```bash
cargo update -p oxc_allocator
```

And rebuild. If you have a direct dependency on the allocator crate's Box or Vec methods, check the [CHANGELOG](https://github.com/oxc-project/oxc/blob/main/CHANGELOG.md) for the full list of renamed methods.

### Is there an oxlint release tied to this?

Yes — [oxlint v1.60.0](https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.60.0) was released on April 13 alongside this cycle's work, bringing oxlint's lint rule coverage up to date with the latest parser changes.
