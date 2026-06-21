---
title: "Bun Integrates the React Compiler Directly Into Its Bundler, Roughly 20x Faster Than the Babel Plugin"
description: "PR #32504, merged into oven-sh/bun on June 20, 2026, turns the upstream React Compiler Rust port into a built-in `bun build` transform behind `--react-compiler` and `Bun.build({ reactCompiler: true })`. Bun ports the upstream `facebook/react` `compiler/crates/` workspace directly into a single `src/react_compiler/` crate (~62k LOC) instead of going through Babel, SWC, or Oxc, and on a large React codebase (around 860 components, 1400 memo slots) the compiler pass runs in 465 ms versus 9.15 s for the Babel plugin. The feature is experimental, off by default, and ships with `reactCompilerOutputMode` (client or ssr) and a `scripts/sync-react-compiler.sh` re-sync helper."
date: 2026-06-21
image: "/images/heroes/2026-06-21--bun-react-compiler-bundler-integration-20x.png"
author: lschvn
tags: ["tooling", "performance", "runtimes"]
tldr:
  - "Bun PR #32504, merged June 20, 2026, integrates the upstream React Compiler Rust port as a built-in `bun build` transform, exposing it as the `--react-compiler` CLI flag and the `reactCompiler: true` option on `Bun.build`. Output mode is derived from `--target` (`browser` -> `client`, `bun` or `node` -> `ssr`) and can be overridden with `reactCompilerOutputMode`. The feature is off by default and marked experimental."
  - "Bun ports the upstream `facebook/react` `compiler/crates/` Rust workspace directly into a single `src/react_compiler/` crate (~62k LOC), instead of going through Babel, SWC, or Oxc as a separate AST adapter. On a large React codebase (around 860 components, 1400 memo slots) the compiler pass runs in 465 ms versus 9.15 s for `babel-plugin-react-compiler`, about a 20x speedup; the full `--compile` standalone build runs in 3.62 s versus 13.04 s with the Babel plugin (3.6x)."
  - "This is the first bundler to ship React Compiler as a native transform. Vite, webpack, Next.js with Turbopack, and Rsbuild all run the compiler through a Babel/SWC/Oxc plugin today; Bun's path goes straight from its own parser AST to the compiler's HIR, then back into Bun's AST for codegen, skipping the intermediate AST layer. The release also adds `scripts/sync-react-compiler.sh` to re-sync the port against `facebook/react` tip."
faq:
  - question: "What does the new `--react-compiler` flag do?"
    answer: "It runs the React Compiler over `.jsx` and `.tsx` files during `bun build`, automatically memoizing components and hooks. The output is the same shape `babel-plugin-react-compiler` produces, including the `react/compiler-runtime` import that ships with React 19 or later. The flag is off by default and is marked experimental in the type definitions and in the docs at bun.com/docs/bundler."
  - question: "How much faster is Bun's React Compiler integration than the Babel plugin?"
    answer: "On a large React codebase (around 860 compiled components, 1400 memo slots), the upstream Babel plugin took about 9.15 s end-to-end, Bun with React Compiler disabled took 394 ms (baseline), and Bun with React Compiler enabled took 465 ms (1.18x the baseline, roughly 20x faster than the Babel plugin). The full `--compile` standalone executable build, which bundles everything plus the React Compiler pass, runs in 3.62 s with the Rust port versus 13.04 s with the Babel plugin, a 3.6x speedup. These numbers come from Bun's own benchmark in PR #32504 and are on a single development machine, so individual results will vary."
  - question: "Why didn't Bun just use the React Compiler crate from Oxc?"
    answer: "The PR description explains the call directly. Bun's parser already produces a fully resolved AST, so going through an Oxc adapter would mean converting Bun's AST to Oxc's AST, handing it to the compiler, then converting back. Bun instead ports the compiler's `hir/`, `ssa/`, `inference/`, `typeinference/`, `optimization/`, `validation/`, `reactive_scopes/`, `diagnostics/`, and `utils/` crates into `src/react_compiler/` byte-for-byte from upstream, only rewriting import paths and stripping `serde`/`serde_json` derives that Bun does not need. The lowering and codegen layers are reimplemented against `bun_ast`, with a type-mapping table in `src/react_compiler/DESIGN.md`. The result is no intermediate AST allocation and no second dependency surface."
  - question: "Does this replace the Babel React Compiler plugin in Vite or Next.js?"
    answer: "No, it only applies to `bun build` and `Bun.build`. If you use Vite, Next.js with Turbopack, webpack, or Rsbuild, you still go through the Babel or SWC plugin. The path the Rust port enables for those bundlers is the `react_compiler_oxc` adapter crate that Meta published alongside the port; Bun chose the direct port instead because its own AST is already in place. As Oxc ships the adapter and bundlers adopt it, expect to see the same perf numbers elsewhere in the second half of 2026."
  - question: "What is the difference between `reactCompiler` and `reactCompilerOutputMode`?"
    answer: "`reactCompiler` is the on/off switch; set it to `true` to run the compiler pass. `reactCompilerOutputMode` picks between `\"client\"` (default for `--target browser`, full memoization) and `\"ssr\"` (default for `--target bun` or `--target node`, skips the `useMemoCache` runtime so server output stays cache-friendly). The output mode only applies when the compiler is on, and Bun derives the default from `--target` if you don't set it explicitly."
  - question: "Will this slow down my `bun build`?"
    answer: "Only if you turn it on. With `reactCompiler: false` the build runs the existing transform pipeline and there is no measurable overhead from this PR. With `reactCompiler: true`, Bun reports a 1.18x wall-time cost on the large-codebase benchmark (394 ms baseline, 465 ms with the compiler), which is still well below the Babel-plugin path. For small projects the absolute overhead is in single-digit milliseconds."
---

[Bun PR #32504](https://github.com/oven-sh/bun/pull/32504), merged on June 20, 2026, turns the upstream React Compiler Rust port into a built-in `bun build` transform. Turn it on with `--react-compiler` from the CLI or `reactCompiler: true` on `Bun.build`, and Bun will memoize your `.jsx` and `.tsx` components and hooks during the build, with no Babel plugin, no config files, and nothing to install. The feature is off by default and marked experimental in both the [type definitions](https://github.com/oven-sh/bun/blob/main/packages/bun-types/bun.d.ts) and the [bundler docs](https://bun.com/docs/bundler).

This is the first bundler to ship the React Compiler as a native transform. Vite, Next.js with Turbopack, webpack, and Rsbuild all run it through a Babel or SWC plugin today. Bun's path skips that intermediate entirely.

## What landed

The integration closes [issue #24356](https://github.com/oven-sh/bun/issues/24356), the long-standing feature request for first-class React Compiler support in the bundler, and replaces an earlier [PR #31785](https://github.com/oven-sh/bun/pull/31785) that depended on an `oxc_react_compiler` crate that did not exist at the time. The new PR ports the compiler's Rust workspace directly from `facebook/react` rather than going through Oxc, which is why the upstream PR description in [facebook/react#36173](https://github.com/facebook/react/pull/36173) explicitly invited bundler integrations via the `react_compiler_oxc` adapter and Bun took a different path.

A [follow-up PR #32545](https://github.com/oven-sh/bun/pull/32545) shipped the same day fixes three review comments from the merged PR, including a subtle bug where `reactCompilerOutputMode: 'client'` would silently enable the compiler even when `reactCompiler: false` was set. The output mode is now stored separately and only applied when the compiler is on, matching the documented behavior in `bun.d.ts`.

## The architecture: Bun AST straight to HIR

The compiler lives in `src/react_compiler/`, a single ~62k LOC crate. The bulk of it is a byte-for-byte port of the upstream Rust workspace, with import paths rewritten and the `serde` and `serde_json` derives that Bun does not need stripped. The upstream workspace crates that are ported whole: `hir/`, `ssa/`, `inference/`, `typeinference/`, `optimization/`, `validation/`, `reactive_scopes/`, `diagnostics/`, and `utils/`. Hot-path data structures were densified: `HashMap<SmallId, _>` becomes `Vec<_>`, `HashSet<ValueReason>` becomes `EnumSet` (u16), and points-to sets become `SmallVec<[_; 4]>`. The `IndexMap` and `IndexSet` API is shimmed over arena-backed `bun_collections::ArrayHashMap`.

The four layers that touch the AST (lowering, codegen, pipeline, and the program/imports glue) are reimplemented against `bun_ast`, with the type-mapping table in `src/react_compiler/DESIGN.md` documenting how Bun's AST nodes correspond to the Babel-shaped AST the compiler expects.

The compile hook fires inside `visit_stmts(FnBody)`, between its visit phase and its inline-mangle phase. Candidate detection on `S::Function`, `S::Local`, `S::ExportDefault`, and `S::Expr` records the binding `Ref` and the `memo`/`forwardRef` wrapper bit; `visit_func` and arrow-visit copy the function's args, flags, and locations into a `Copy` `PendingCompile` struct; the hook calls `maybe_compile_pending`, which constructs a stack-local `G::Fn` and runs `maybe_compile_node`. The compiled body lands in the live `stmts` buffer so the existing mangle phase runs on it. New arguments and flags flow back through a single `CompileResult` field. No raw pointers, no extra pass; the non-RC path adds one `is_some()` check per top-level declaration.

The compiler also honors `// eslint-disable react-hooks/*` suppressions. The lexer runs one substring check per comment, gated on the feature flag, and propagates the suppression as a flag bit on `G::Fn` and `E::Arrow`; the compiler skips any function carrying it.

## The numbers

The PR ships a benchmark on a large React codebase (around 860 compiled components, 1400 memo slots). The same code, on the same machine:

| | Wall time | vs Babel plugin |
|---|---|---|
| Baseline (`reactCompiler: false`) | 394 ms | - |
| `reactCompiler: true` | 465 ms (1.18x baseline) | ~20x faster than Babel |
| Babel plugin (same input) | 9.15 s | 1x |

The full `--compile` standalone executable build, which bundles everything plus the React Compiler pass, runs in 3.62 s with the Rust port versus 13.04 s with the Babel plugin, a 3.6x end-to-end speedup.

These are not synthetic micro-benchmarks. The codebase is real, the components compile to real `_c(N)` memoization calls with `$[0] !== label` cache checks, and the `react/compiler-runtime` import Bun injects resolves against the React 19+ install that ships with the app. Bun notes that the baseline-with-RC overhead (394 ms to 465 ms, ~18%) is from HIR construction and SSA pass; the rest of the bundler (parser, mangle, minify) is unchanged.

## What the API looks like

CLI:

```sh
bun build ./app.tsx --react-compiler --target browser
```

`Bun.build`:

```ts
await Bun.build({
  entrypoints: ["./app.tsx"],
  reactCompiler: true,
  // reactCompilerOutputMode: "client", // default for browser target
  // reactCompilerOutputMode: "ssr",   // default for bun/node target
  target: "browser",
});
```

`reactCompilerOutputMode` defaults to `"client"` when `target` is `"browser"` and to `"ssr"` when `target` is `"bun"` or `"node"`. SSR mode skips the `useMemoCache` runtime so server-rendered output stays cache-friendly across requests. `compilationMode: "infer"` semantics carry over from the upstream compiler, so only components and hooks are compiled; `"use no memo"` directives are honored, and `node_modules` is skipped.

## What this means for the bundler race

This is the first time the Rust port of the React Compiler has shipped as a build-time transform rather than as a library other tools have to plug into. The [Oxc v0.135 integration](/articles/2026-06-12--oxc-v0-135-react-compiler-ast-breaking) in mid-June added the compiler as a Rust crate you could call into, but the only bundler to actually wire it up since is Bun. [Vite 8](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks) and [Vite 8.1](/articles/2026-06-15--vite-8-1-beta-wasm-esm-chunk-importmap) still go through `babel-plugin-react-compiler`; Next.js with Turbopack uses the SWC port; webpack uses Babel. Bun's choice to port upstream directly into its own AST layer is a deliberate trade: it skips the cross-AST conversion cost and the dependency surface, at the price of having to re-sync against `facebook/react` periodically.

The maintenance path is wired up. `scripts/sync-react-compiler.sh` sparse-fetches `facebook/react` and prints a per-file diff between `src/react_compiler/UPSTREAM_PORTED` and upstream tip, grouped into whole-crate ports that apply mechanically and AST-boundary ports that re-port via the type-mapping table. `--fixtures` re-syncs the test corpus. As long as the upstream API stays Babel-AST-shaped, the cost of tracking the port is roughly proportional to how often upstream touches the boundary layers.

## Where to watch

Three signals worth tracking over the next few weeks:

1. The [Bun v1.3.15 release notes](https://github.com/oven-sh/bun/releases) when they land, which should bundle PR #32504 plus the follow-up and promote the feature from `bun build` experimental to a stable flag.
2. The Oxc `react_compiler_oxc` adapter landing as a stable crate in an Oxc release, which is the path Vite and Rolldown will most likely take to get the same perf numbers without porting upstream.
3. Any change in the upstream React Compiler's "public API" from "Babel AST + scope info" to a more bundler-native shape, which would let Oxc (and through it Vite, Next.js, Rsbuild) skip their own adapter crates entirely.
