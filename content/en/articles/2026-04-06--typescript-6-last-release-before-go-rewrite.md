---
title: "TypeScript 6.0 Lands as the Last Release Before the Go Rewrite"
description: "TypeScript 6.0 is out — and the Microsoft team is clear: it's a bridge release. The real story is what comes next: TypeScript 7, written in Go and already available as a preview, promises a 10x speedup."
date: "2026-04-06"
image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop"
author: lschvn
tags: ["typescript", "javascript", "microsoft", "compiler", "performance"]
---

TypeScript 6.0 landed on March 23, 2026, and the Microsoft team is not hiding the ball: this is a bridge release. TypeScript 6.0 smooths the path toward TypeScript 7 — a ground-up rewrite of the compiler and language service in Go, with a 10x speedup claim already verified in preview builds.

## What's actually new in 6.0

Most of the headline changes are about aligning with TypeScript 7 behavior, but a few concrete improvements landed in this release.

**Less context-sensitivity on `this`-less functions.** TypeScript 6.0 fixes a long-standing inference gap when methods and callbacks don't use `this`. Previously, a method like `consume(y) { return y.toFixed(); }` inside a generic call would fail type inference if another property came first — because TypeScript assumed `this` might need the generic type. Now, if `this` is never used, TypeScript skips the contextual sensitivity check and inference works correctly regardless of property order. This was contributed by Mateusz Burzyński.

**Subpath imports now support `#/` prefixes.** Node.js added support for `#/` as a bare subpath import prefix (instead of requiring `#root/` or similar). TypeScript 6.0 supports this under `--moduleResolution nodenext` and `bundler`. No more awkward workarounds for clean internal imports.

**`--moduleResolution bundler` + `--module commonjs` is now valid.** Previously this combination was rejected. With `--moduleResolution node` deprecated, the combination of `bundler` + `commonjs` is now the recommended upgrade path for many projects.

**`--stableTypeOrdering` flag.** TypeScript 7 uses parallel type checking, which assigns internal type IDs differently depending on processing order. This can cause declaration files to differ between 6.0 and 7.0. The new flag enforces deterministic ordering in 6.0 so differences are easier to spot during migration. Note: it can add up to 25% slowdown, so it's a migration tool, not a permanent setting.

**`es2025` target and lib.** TypeScript 6.0 adds `es2025` as a valid target and lib option, including new types for `RegExp.escape`.

**Import assertion syntax deprecated in `import()` calls.** The `import(..., { assert: {...}})` syntax is now deprecated alongside the static `import ... assert {...}` form.

## The real headline: TypeScript 7 is close

TypeScript 6.0 exists primarily to get the ecosystem ready for 7.0. The Go rewrite — codenamed "Project Corsa" — has been in progress since early 2025. The native preview (`@typescript/native-preview` on npm) is already stable enough for daily use, and a VS Code extension is updated nightly.

The language service (completions, go-to-definition, rename, find-all-references) is already fully functional in the native port. The compiler's type-checking is described as "very nearly complete" — of 20,000 test cases, only 74 show differences between 6.0 and the 7.0 preview. Parallelism via shared memory is the key architectural win, enabling dramatic speedups on large monorepos.

If you're on TypeScript 6.0 today, the team encourages you to also try the TypeScript 7 preview. The two can run side-by-side via `tsgo` (7.0) and `tsc` (6.0).

## FAQ

**Is TypeScript 6.0 a breaking change?**
Not significantly. Most changes are additive or behavioral alignments with 7.0. The `--stableTypeOrdering` flag is new, and import assertion deprecation is a warning-level change.

**Should I upgrade from 5.x to 6.0?**
Yes, especially if you're preparing for the 7.0 native port. The migration path from 6.0 to 7.0 is expected to be smooth.

**How do I try TypeScript 7?**
```bash
npm install -D @typescript/native-preview
# use tsgo instead of tsc
npx tsgo build
```
Or install the VS Code extension "TypeScript 7 (native preview)" from the marketplace.
