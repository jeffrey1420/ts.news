---
title: "TypeScript 7.0 RC Ships: The Go Compiler Hits Release Candidate, Roughly 10x Faster, With a Side-by-Side Migration Path"
description: "TypeScript 7.0 RC (June 18, 2026) is the release candidate of the compiler Microsoft ported from its bootstrapped TypeScript codebase to Go. It is often about 10x faster than TypeScript 6.0, ships a tsc6 compatibility package so it can run side-by-side with 6.0, adds --checkers/--builders/--singleThreaded parallelism controls and a rebuilt watch mode on a Go port of @parcel/watcher, and turns every 6.0 deprecation into a hard error. The stable release is planned within the next month, with a stable programmatic API deferred to 7.1."
date: 2026-06-20
image: "/images/heroes/2026-06-20--typescript-7-0-rc-go-compiler-10x-faster.png"
author: lschvn
tags: ["typescript", "tooling"]
tldr:
  - "TypeScript 7.0 RC shipped June 18, 2026 as npm install -D typescript@rc (reports 7.0.1-rc). It is the release candidate of the Go port Microsoft has been building for over a year, is often about 10x faster than TypeScript 6.0, and keeps the same type-checking semantics by being methodically ported rather than rewritten."
  - "Migration is designed to be non-disruptive: a new @typescript/typescript6 package ships a tsc6 binary, npm aliases let typescript-eslint keep importing from typescript, and a stable programmatic API is explicitly deferred to 7.1. The stable release is planned within the next month."
  - "7.0 adopts TypeScript 6.0's defaults and turns its deprecations into hard errors: target es5, moduleResolution node/node10, baseUrl, and module amd/umd/systemjs are all gone, while strict, module esnext, and stableTypeOrdering are now defaults. New --checkers, --builders, and --singleThreaded flags control parallel parsing, type-checking, emitting, and project-reference builds."
faq:
  - question: "Is TypeScript 7.0 RC a breaking change for existing code?"
    answer: "For type-checking results, no. The Go codebase was methodically ported from the TypeScript 6.0 implementation rather than rewritten, so its type-checking logic is structurally identical and produces the same results. The breaking changes are all in configuration: 7.0 adopts 6.0's new defaults (strict true, module esnext, types []) and turns 6.0's deprecations into hard errors (target es5, moduleResolution node/node10, baseUrl, module amd/umd/systemjs). Any project that compiles cleanly on 6.0 with stableTypeOrdering on and no ignoreDeprecations flag should compile identically on 7.0."
  - question: "How do I run TypeScript 7.0 alongside TypeScript 6.0?"
    answer: "Install the RC with npm install -D typescript@rc, which gives you the 7.0 tsc binary. For tools like typescript-eslint that import TypeScript directly via a peer dependency, use npm aliases: alias the typescript package to npm:@typescript/typescript6 so those tools keep using 6.0, and add a second alias (for example typescript-7) pointing at npm:typescript@rc to keep 7.0's tsc available via npx. @typescript/typescript6 also ships a tsc6 binary for command-line use."
  - question: "When will TypeScript 7.0 be stable, and when does the programmatic API arrive?"
    answer: "Microsoft's stated plan is to release the stable TypeScript 7.0 within the next month after the RC. A stable programmatic API is explicitly deferred to TypeScript 7.1, which is why the tsc6 side-by-side story exists. Until 7.1, tools that consume the TypeScript API programmatically should continue to pin 6.0."
  - question: "What are the new --checkers and --builders flags?"
    answer: "--checkers sets the number of type-checker workers (default 4). Type-checking has cross-file dependencies, so TypeScript creates a fixed pool of workers that divide files identically for deterministic results; raising the count speeds up large builds at the cost of memory. --builders controls parallel project-reference builders, useful for monorepos. The two are multiplicative (--checkers 4 --builders 4 can spawn up to 16 checkers), and --singleThreaded caps everything to one thread for debugging or constrained CI."
---

[TypeScript 7.0 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/) shipped on June 18, 2026, and it is the release candidate of the compiler Microsoft has been porting to Go for over a year. The headline is speed: 7.0 is often about **10x faster than TypeScript 6.0**, the result of native execution plus shared-memory parallelism rather than the single-threaded, JavaScript-bootstrapped compiler the ecosystem has used since the beginning. You can install it today with `npm install -D typescript@rc`, and `npx tsc --version` reports `7.0.1-rc`.

This is the payoff of [Project Corsa](/articles/2026-03-23-typescript-7-native-preview-go-compiler), the native port Microsoft announced in early 2025. [TypeScript 6.0](/articles/2026-04-17--typescript-6-0-bridge-to-go-native) was deliberately built as a "bridge release" to smooth the jump, and [the team described 7.0 as "extremely close to completion"](/articles/2026-04-06--typescript-6-last-release-before-go-rewrite) back in April. The RC is that completion, feature-frozen.

## Ported, not rewritten

The most important detail for anyone planning an upgrade is that 7.0 is a methodical port, not a ground-up rewrite. Microsoft moved the existing TypeScript codebase over to Go file by file, and the type-checking logic is structurally identical to 6.0. The compiler has been evaluated against the test suite built up over a decade and is already running in multiple multi-million-line-of-code codebases inside and outside Microsoft, with teams at Bloomberg, Canva, Figma, Google, Linear, Notion, Slack, Vercel, and VoidZero among the early adopters reporting major build-time reductions.

Practically: any code that compiles cleanly on 6.0, with `stableTypeOrdering` on and no `ignoreDeprecations` flag set, should compile identically on 7.0. The semantics did not move.

## A side-by-side migration story

Because the Go codebase does not yet expose a stable programmatic API (that is explicitly deferred to TypeScript 7.1, several months out), Microsoft made 7.0 runnable next to 6.0 without "which `tsc` is which?" conflicts. It published `@typescript/typescript6`, a compatibility package that re-exports the 6.0 API and ships a `tsc6` binary.

For tools like typescript-eslint that import from `typescript` through a peer dependency, the recommended path is npm aliases. Pin `typescript` to the 6.0 alias so those tools keep working, and add a second alias for 7.0:

```json
{
  "devDependencies": {
    "typescript": "npm:@typescript/typescript6@^6.0.0",
    "typescript-7": "npm:typescript@rc"
  }
}
```

Now `npx tsc` runs 7.0 while typescript-eslint keeps consuming 6.0 under the `typescript` name. Nightlies still publish under `@typescript/native-preview` (binary `tsgo`); once 7.0 moves to the `latest` tag, all releases converge on the `typescript` package.

## Parallelism you can tune

The speedup comes from parallelizing parsing, type-checking, and emitting, and 7.0 exposes the knobs. `--checkers` sets the number of type-checker workers, defaulting to 4. Type-checking has cross-file dependencies, so rather than scattering files across fully independent workers, 7.0 creates a fixed pool that always divides the same input files identically, keeping results deterministic at the cost of some duplicated work. Raising the count speeds up large builds on multicore machines but costs memory; lowering it helps constrained CI runners.

`--builders` controls parallel project-reference builders, which matters most for monorepos. The two flags are multiplicative: `--checkers 4 --builders 4` can spawn up to 16 checkers, which Microsoft notes may be excessive. `--singleThreaded` caps the whole compiler to one thread for debugging or comparing against 6.0.

The `--watch` mode was also rebuilt. Microsoft ported the Parcel bundler's file-watcher (`@parcel/watcher`) from C++ to Go, with minimal assembly shims, to avoid pulling in a C++ toolchain dependency. The result is what the team describes as significant resource improvements in watch mode across platforms, with thanks to Devon Govett for the original Parcel watcher work.

## 6.0's defaults are now the floor, and its deprecations are hard errors

7.0 adopts 6.0's new defaults and stops tolerating what 6.0 deprecated. The defaults that change: `strict` is `true`, `module` defaults to `esnext`, `target` defaults to the current stable ECMAScript version before `esnext`, `noUncheckedSideEffectImports` is `true`, `libReplacement` is `false`, and `stableTypeOrdering` is `true` and cannot be turned off.

The two Microsoft flags as "most surprising" are `rootDir` and `types`. `rootDir` now defaults to `./`, so projects whose `tsconfig.json` sits outside `src` need to set it explicitly to preserve directory structure. `types` now defaults to `[]`, so global declarations from `@types` packages must be listed explicitly (restore old behavior with `"types": ["*"]`).

The deprecated options that are now hard errors include `target: es5`, `downlevelIteration`, `moduleResolution: node`/`node10` (use `nodenext` or `bundler`), `module: amd`/`umd`/`systemjs`/`none`, `baseUrl`, `moduleResolution: classic`, and setting `esModuleInterop` or `allowSyntheticDefaultImports` to `false`. The `asserts` keyword on imports must become `with`, and `/// <reference no-default-lib />` is no longer respected under `skipDefaultLibCheck`. The full list lives in the [CHANGES.md](https://github.com/microsoft/typescript-go/blob/main/CHANGES.md) on the `microsoft/typescript-go` repo.

## Two real type-level breaks

Two changes affect type-level behavior rather than config. Template literal type inference now preserves Unicode code points: `HeadTail<"😀abc">` produces `["😀", "abc"]` instead of splitting the emoji into two UTF-16 surrogate halves. This aligns inference with `for...of` and spread semantics, but it breaks type-level string utilities that intentionally modeled UTF-16 code units, such as some `Length` helpers.

JavaScript (JSDoc) support was also reworked for consistency with `.ts` analysis. `@enum`, a standalone `?` type, `@class` as a constructor marker, postfix `!`, and Closure-style function syntax like `function(string): void` are no longer special-cased. Values used where types are expected now require `typeof`.

## The editor experience

The language service is built on the Language Server Protocol and uses multiple threads, so the editor gains the same parallelism as the command line. The [TypeScript Native Preview](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview) VS Code extension is the low-friction way to try it, and Microsoft has filled in the features missing from the beta: auto-imports, semantic highlighting, inlay hints, code lenses, go-to-source-definition, JSX linked editing, and sort/remove unused imports. The team's internal data claims over 20x fewer failing language server commands compared to 6.0.

## What to do now, and what to watch

The upgrade path for most teams: move to 6.0 first if you have not, clear its deprecations, then `npm install -D typescript@rc` and run it in CI. Pin `--checkers` if you want identical results across machines. Microsoft plans the stable 7.0 release within the next month, with 7.1 bringing the stable programmatic API that lets tooling migrate off 6.0 for good. File regressions on the [microsoft/typescript-go issue tracker](https://github.com/microsoft/typescript-go/issues), because the RC window is when that feedback matters most.
