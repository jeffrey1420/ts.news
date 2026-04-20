---
title: "TypeScript 6.0: The Last JS Release Before the Go-Based Native Compiler"
description: "TypeScript 6.0 lands as a bridge release with new features like #/ subpath imports, stable type ordering, and a path toward TypeScript 7.0's native Go codebase."
date: 2026-04-17
image: "https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2026/03/ts-6.0-2.png"
author: lschvn
tags: ["TypeScript", "JavaScript", "Microsoft", "Compiler", "Go"]
tldr:
  - TypeScript 6.0 is the final release on the current JavaScript codebase — TypeScript 7.0 will be built in Go for native speed and shared-memory parallelism
  - New features include #/ subpath imports, Map.getOrInsert/getOrInsertComputed, Temporal API types, and relaxed type inference for methods not using `this`
  - Several defaults change: strict=true, module=esnext, types=[], rootDir=. — many projects will see 20-50% faster builds and may need explicit types config
faq:
  - q: "How do I prepare for TypeScript 7.0?"
    a: "Use TypeScript 6.0 now. Try the TypeScript 7.0 native preview in VS Code (extension ID: TypeScriptTeam.native-preview) or via npmx.dev. Use the new --stableTypeOrdering flag to catch potential differences early."
  - q: "Why did TypeScript rewrite in Go?"
    a: "The Go-based compiler aims for native execution speed and shared-memory multi-threading, which the current TypeScript implementation cannot efficiently achieve. The team announced this in 2025 and 7.0 is described as 'extremely close to completion'."
  - q: "What if my project breaks after upgrading to 6.0?"
    a: "Set 'types' explicitly (e.g. ['node', 'jest']), set 'rootDir' if sources are nested, set 'strict': false if you relied on the old default, and review the ignoreDeprecations option in tsconfig."
---

TypeScript 6.0 shipped this month, and it carries a weight most point releases don't: this is the last version built on the current JavaScript codebase. Everything from 7.0 onward will run on a Go-based native compiler that the team has been building for over a year.

## A Bridge to TypeScript 7.0

The headline story is what you don't get in 6.0. Microsoft describes it as a "bridge release" — aligning APIs and behavior so the jump to TypeScript 7.0's new codebase goes smoothly. The team is candid: "TypeScript 7.0 is actually extremely close to completion." You can already try the native preview in VS Code or via `npmx.dev/package/@typescript/native-preview`.

Most changes in 6.0 exist to smooth that transition. But there are still features worth knowing about.

## Less `this`-Sensitivity in Method Inference

A long-standing rough edge gets fixed. When TypeScript infers type parameters from a callback, it skips over "contextually sensitive" functions — functions with untyped parameters. Methods written with shorthand syntax were always treated as sensitive because they carry an implicit `this`, even when `this` is never used. Arrow functions didn't have this problem.

TypeScript 6.0 checks whether `this` is actually referenced before flagging a method as sensitive. If you never use `this`, the method participates in type inference normally. The fix was contributed by Mateusz Burzyński ([PR #62243](https://github.com/microsoft/TypeScript/pull/62243)).

## Subpath Imports Now Support `#/`

Node.js recently added support for subpath imports that start with `#/` rather than `#/something`. TypeScript 6.0 picks this up under `--moduleResolution nodenext` and `bundler`. You can now write:

```json
{
  "imports": {
    "#/*": "./dist/*"
  }
}
```

This aligns with the way bundlers typically handle path aliases and removes the need for a dummy segment after `#`.

## Combining `--moduleResolution bundler` with `commonjs`

Previously `--moduleResolution bundler` required `--module esnext` or `--module preserve`. With the deprecation of `moduleResolution: node`, this constraint is lifted. The new valid combination is `--module commonjs` with `--moduleResolution bundler`, which is a practical upgrade path for many existing projects ([PR #62320](https://github.com/microsoft/TypeScript/pull/62320)).

## Stable Type Ordering for 6.0-to-7.0 Migrations

TypeScript 7.0's parallel type checker sorts internal objects deterministically. TypeScript 6.0 introduces `--stableTypeOrdering` to make its output match that order. This is primarily a migration tool — the flag can slow type-checking by up to 25% — but it ensures declaration files and error messages don't shift unexpectedly when you eventually upgrade. The flag is not recommended for permanent use.

## ES2025 Target and New Built-in API Types

TypeScript 6.0 adds `es2025` as a valid value for `--target` and `--lib`. This brings `RegExp.escape` (stage 4) and moves `Promise.try`, iterator methods, and set methods into the stable lib. The Temporal API — the long-awaited date/time replacement for `Date` — also gets full built-in types in 6.0. The `Map` and `WeakMap` types gain `getOrInsert` and `getOrInsertComputed` (stage 4) for the common "get or create" pattern.

## DOM Lib Consolidation

The contents of `lib.dom.iterable.d.ts` and `lib.dom.asynciterable.d.ts` are now fully merged into `lib.dom.d.ts`. You no longer need to add `dom.iterable` to your `lib` array just to iterate a `NodeList`.

## Breaking Changes That Will Likely Affect You

TypeScript 6.0 flips several defaults that older projects may have relied on:

- **`strict` now defaults to `true`** — if you relied on implicit strictness being off, set `"strict": false` explicitly
- **`module` defaults to `esnext`** — ESM is now the assumed format for new projects
- **`target` defaults to the current year** (effectively `es2025` right now) — the `es5` target is deprecated
- **`types` now defaults to `[]`** instead of enumerating everything in `node_modules/@types` — this alone has cut build times 20-50% in the projects the team studied. Add explicit types: `["node", "jest"]` etc.
- **`rootDir` defaults to the tsconfig directory** rather than inferring from file locations — nested source directories may need explicit `rootDir` configuration
- **`noUncheckedSideEffectImports` now defaults to `true`**

## The Bottom Line

If you're starting a new project, 6.0 is a solid choice with sensible modern defaults. If you're on an existing codebase, budget time to add explicit `types` entries and check your `rootDir` before upgrading blindly. The Go-based 7.0 is close — the team wants you on 6.0 now so the transition is clean.

Install it: `npm install -D typescript@latest`
