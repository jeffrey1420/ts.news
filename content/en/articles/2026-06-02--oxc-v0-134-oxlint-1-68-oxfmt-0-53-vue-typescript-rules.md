---
title: "Oxc v0.134: oxlint v1.68 Adds Vue Linter Rules and TypeScript Accessor Checks"
description: "Oxc's June release ships oxlint v1.68.0 with two new Vue rules, a TypeScript method-signature-style linter rule, and parser improvements that reject ambient context misuse. oxfmt v0.53.0 ships formatter updates alongside performance work on token parsing."
date: 2026-06-02
image: "/images/heroes/2026-06-02--oxc-v0-134-oxlint-1-68-oxfmt-0-53-vue-typescript-rules.png"
author: lschvn
tags: ["frameworks", "tooling", "typescript"]
tldr:
  - oxlint v1.68.0 adds no-reserved-component-names and component-definition-name Vue linter rules, catching naming conflicts in component definitions
  - A new method-signature-style TypeScript rule enforces consistency between interface method syntax and class method syntax
  - The parser now emits specific TypeScript error codes (TS1094, TS1095, TS1051) for accessor type parameter issues and rejects generators, overload signatures, and invalid index signatures in ambient contexts
---

## oxlint v1.68.0: Vue and TypeScript Rules

The headline additions in oxlint v1.68.0 are two Vue-specific linter rules.

**`vue/no-reserved-component-names`** prevents using reserved names for Vue component definitions. Vue reserves names like `Switch`, `KeepAlive`, and `Teleport`, using them as local component names can cause rendering issues, especially when used with `resolveComponent` or in `.vue` file `<script>` blocks.

**`vue/component-definition-name`** is the counterpart rule that catches when component definition names conflict with HTML elements or Vue built-in components.

On the TypeScript side, **the new `method-signature-style` rule** enforces a consistent style for interface and class method declarations. It flags cases where a class method could be written as an interface method signature, helping keep TypeScript codebases uniform.

Also new in v1.68.0: **`override::exclude_files`** lets you exclude specific files from rule overrides, giving finer control over per-directory lint configuration without complex glob patterns.

## oxfmt v0.53.0: Formatter Updates

oxfmt ships alongside oxlint with formatting improvements. The full changelog for v0.53.0 is available on the [oxc-project/oxc releases page](https://github.com/oxc-project/oxc/releases).

## Parser: Tighter TypeScript Ambient Context Validation

This release brings a significant batch of parser improvements focused on TypeScript ambient context enforcement. The parser now emits precise error codes for a range of invalid declarations:

- **TS1094**: accessor type parameters (setters/getters with type parameters)
- **TS1095**: setters with a return type annotation
- **TS1051**: optional parameters in setters
- **TS1221 / TS1222**: generators and overload signatures in ambient contexts
- **TS1268 / TS1337**: invalid index signature parameter types
- **TS1038 / TS1036**: `declare` in already-declared ambient contexts and statements in ambient blocks
- **TS1316**: export-as-namespace inside a namespace body
- **TS1183**: function implementations in ambient contexts (e.g., inside `declare` blocks)

The parser also now rejects class member modifiers in invalid combinations, `module`-referencing imports/exports inside namespaces, and `implements` clauses where the class name itself is `implements`.

## Performance Work

Three changes target parser throughput:

1. **Cached token kind reuse in delimited-list loops**: avoids redundant token kind lookups in array/object literals, function parameters, and similar delimited constructs.
2. **peek_token instead of lookahead on the modifier path**: a lighter token peek replaces the heavier lookahead when scanning modifiers, reducing redundant token inspection.
3. **Deferred declare lookup for empty accessors**: skips unnecessary symbol resolution for accessors without bodies, shaving time during semantic analysis.

## Full Changelog

The complete release notes for oxc crates v0.134.0, oxlint v1.68.0, and oxfmt v0.53.0 are on the [oxc-project/oxc GitHub releases page](https://github.com/oxc-project/oxc/releases).

> **FAQ**
>
> **Q: How does oxlint compare to ESLint?**
> oxlint is a drop-in replacement for ESLint written in Rust. It aims for compatibility with ESLint rules and configs while delivering 10–100x faster performance on large codebases.
>
> **Q: Can oxfmt replace Prettier?**
> oxfmt is a Rust-based formatter that supports JavaScript, TypeScript, JSX, and Vue. It is Prettier-compatible for most formatting decisions and is significantly faster on large projects.
>
> **Q: What projects use Oxc?**
> Rolldown (the Rust-based Rollup successor), T ranspilation pipelines in production tooling, and various framework internal toolchains use Oxc under the hood.
