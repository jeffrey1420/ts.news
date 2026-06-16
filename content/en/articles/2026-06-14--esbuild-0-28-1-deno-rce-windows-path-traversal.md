---
title: "esbuild 0.28.1: First Release in Two Months Ships a High-Severity Deno RCE, a Windows Path Traversal, and a `using` Disposal Bug"
description: "esbuild v0.28.1 (June 11, 2026) is the first release since April. It fixes a CVSS 8.1 remote code execution in the Deno API via NPM_CONFIG_REGISTRY, a Windows-only dev-server path traversal, and a minifier bug that silently broke `using` and `await using` resource disposal."
date: 2026-06-14
image: "/images/heroes/2026-06-14--esbuild-0-28-1-deno-rce-windows-path-traversal.png"
author: lschvn
tags: ["security", "tooling", "javascript"]
tldr:
  - "esbuild v0.28.1, shipped June 11, 2026, is the first esbuild release in two months and fixes a CVSS 8.1 (High) remote code execution in the Deno API: the Deno installer wrote a downloaded binary to disk with 0o755 permissions and no SHA-256 check, so anyone controlling NPM_CONFIG_REGISTRY could swap the executable."
  - "A second advisory (GHSA-g7r4-m6w7-qqqr, Low) fixes a Windows-only path traversal in esbuild's dev server: Go's path.Clean() only normalizes forward slashes, so backslash-bearing requests could escape the serve directory and read arbitrary files."
  - "The release also fixes a real minifier correctness bug: `using` and `await using` declarations were being inlined into later uses, which silently dropped the disposal call and leaked resources in minified output."
faq:
  - question: "Is the esbuild Deno vulnerability exploitable from a normal project?"
    answer: "Only if you use esbuild from Deno and the NPM_CONFIG_REGISTRY environment variable is set to an attacker-controlled registry, which is most realistic in CI pipelines, shared dev machines, and corporate networks that proxy npm through a custom registry. The Node installer already ran a SHA-256 integrity check (binaryIntegrityCheck) against expected hashes in package.json; the Deno path skipped it entirely. 0.28.1 adds the same check to the Deno installer, so a tampered binary now fails instead of running."
  - question: "Does the Windows path traversal affect production builds?"
    answer: "No. GHSA-g7r4-m6w7-qqqr only affects esbuild's local development server (esbuild.context().serve() / the --serve flag) running on Windows, and only when an attacker can reach that server over HTTP. A malicious request using a backslash could escape the configured serve directory and read files outside it. Plain bundling and one-shot builds are not affected, and the issue does not apply on macOS or Linux."
  - question: "How do I know if the `using` minifier bug affected my code?"
    answer: "If you targeted esbuild minification on a version before 0.28.1 and used the explicit resource management syntax (`using x = ...` or `await using y = ...`), check whether the declaration was inlined into a later use. The classic failure was `{ using x = new Resource(); x.activate() }` being minified to `new Resource().activate()`, which drops the `using` binding so Symbol.dispose never runs and the resource leaks. Upgrade to 0.28.1 and the declaration is preserved."
  - question: "What changed for `import()` and `require()` of a module that throws?"
    answer: "Issue #4461. Before 0.28.1, if a module threw during evaluation, esbuild only preserved the thrown error for the first import() or require() of that module; later calls got a stale module state instead of re-throwing. The spec requires the same error on every call, and 0.28.1 now does that, which matters for retry and dynamic-import error handling."
---

esbuild [v0.28.1](https://github.com/evanw/esbuild/releases/tag/v0.28.1), shipped on June 11, 2026, is the bundler's first release since [v0.28.0 on April 2](https://github.com/evanw/esbuild/releases/tag/v0.28.0). The two-month gap is unusual for a project that normally cuts a release every few weeks, and 0.28.1 spends the budget on three things that each warrant an upgrade on their own: a high-severity remote code execution in the Deno API, a Windows-only dev-server path traversal, and a minifier correctness bug that silently broke the `using` and `await using` resource-disposal syntax.

Because esbuild sits underneath [Vite's dependency optimizer and TS/JSX pipeline](/articles/2026-04-15-vite-plus-alpha-unified-toolchain-open-source), a lot of projects inherit these fixes transitively. Here is what changed and who needs to act.

## A High-severity RCE in the Deno API

The most serious item is [GHSA-gv7w-rqvm-qjhr](https://github.com/evanw/esbuild/security/advisories/GHSA-gv7w-rqvm-qjhr), rated High with CVSS 8.1. The Deno distribution of esbuild (`lib/deno/mod.ts`) downloads the native esbuild binary from an npm registry and writes it to disk with executable permissions (`0o755`) without verifying its contents. The Node installer already had a `binaryIntegrityCheck()` that compares a SHA-256 hash of the downloaded executable against expected values baked into `package.json`; the Deno path never got the equivalent.

The exploit path is the `NPM_CONFIG_REGISTRY` environment variable. The Deno module builds its download URL from that variable, so anyone who can set it, in a CI pipeline, a shared development machine, or a corporate network that proxies npm through a custom registry, can serve a trojaned binary that esbuild will happily execute. That is the same class of supply-chain trust failure that produced the recent [npm `shai-hulud` account-takeover incident](/articles/2026-06-06-npm-supply-chain-attack-red-hat-mini-shai-hulud): the registry is trusted by default and the consumer has no second check.

0.28.1 ports the SHA-256 integrity check to the Deno installer. A binary whose hash does not match the expected value now fails with an error instead of running. Note that esbuild's Deno API still installs from `registry.npmjs.org` by default and still honors `NPM_CONFIG_REGISTRY`; the fix is the verification, not a change of source.

## A Windows path traversal in the dev server

The second advisory, [GHSA-g7r4-m6w7-qqqr](https://github.com/evanw/esbuild/security/advisories/GHSA-g7r4-m6w7-qqqr), is rated Low (CVSS 2.5) but is a clean illustration of a classic bug. esbuild's local development server sanitized incoming request paths with Go's `path.Clean()`. That function is POSIX-only: it understands forward slashes but treats a backslash as an ordinary character. On Windows, where `\` is a valid path separator, a crafted request could therefore escape the configured `serve` directory and read arbitrary files.

The root cause is one line of code:

```go
queryPath := path.Clean(req.URL.Path)[1:]
```

0.28.1 disallows backslashes in dev-server request paths entirely. The exposure is narrow: it requires the dev server (`esbuild.context().serve()` or the `--serve` flag) running on Windows and reachable by an attacker. Production bundling and one-shot builds are unaffected, as are macOS and Linux hosts.

## The `using` and `await using` minifier bug

The third fix is the one most application developers should actually audit their output for. [Issue #4482](https://github.com/evanw/esbuild/issues/4482): esbuild's minifier sometimes inlined a `using` or `await using` declaration into its later use, which drops the binding and means `Symbol.dispose` / `Symbol.asyncDispose` never runs. The failure looks like this:

```js
// Original code
{
  using x = new Resource()
  x.activate()
}

// Old esbuild output (with --minify)
new Resource().activate();

// Fixed output (0.28.1)
{using e=new Resource;e.activate()}
```

The old output leaks the resource every time, because there is no `using` left to trigger disposal at the end of the block. The bug exists because the minifier's inlining pass was written for `let` and `const`, then excluded `var`, and was never updated when the explicit resource management syntax added two more declaration kinds. If you ship minified production builds and use `using` for file handles, database connections, locks, or any `AsyncDisposable`, this is a silent correctness regression worth grepping your build output for.

## Smaller correctness fixes

The rest of 0.28.1 is a cluster of correctness fixes that mostly affect bundling edge cases:

- **Re-thrown module errors ([#4461](https://github.com/evanw/esbuild/issues/4461), [#4467](https://github.com/evanw/esbuild/pull/4467)).** If a module throws during evaluation, the spec requires every subsequent `import()` or `require()` of that module to throw the same error. esbuild previously only preserved the error for the first call. This matters for retry logic and dynamic-import error handling.
- **`new` operator wrapping ([#4477](https://github.com/evanw/esbuild/issues/4477)).** Complex targets of `new`, specifically tagged template literals and optional chains, were not always wrapped in parentheses. The old output was sometimes a syntax error and sometimes changed semantics, for example `new (foo()`bar`)()` and `new (foo()?.bar)()`.
- **Hoisted `var` renaming ([#4471](https://github.com/evanw/esbuild/issues/4471)).** A `var` declared in a nested scope and hoisted to module scope was not treated as a module-level symbol during the name-collision pass, which could collide names when minification was disabled.
- **ES5 `const` to `var` ([#4448](https://github.com/evanw/esbuild/issues/4448)).** For TypeScript-only `import x = require('y')` constructs targeting ES5, esbuild now emits `var` instead of `const`, which it could not downgrade correctly.

## Who needs to upgrade

The Deno RCE is the only item that justifies an immediate, everyone-do-it-now upgrade, and only for projects that consume esbuild through Deno in an environment where `NPM_CONFIG_REGISTRY` is set. Everyone else should still move to 0.28.1 on the next build-tooling bump: the Windows path traversal closes a real (if narrow) exposure, and the `using` disposal fix is a correctness bug you do not want in minified production output.

The release is also a useful reminder that esbuild is not just a Vite implementation detail. It is the transpilation and minification substrate under a large slice of the [Rust-backed JavaScript toolchain](/articles/2026-06-12-oxc-v0-135-react-compiler-ast-breaking), and its two-month release gap is worth noting against the weekly cadence of Oxc and Rolldown. For now, the fixes land cleanly and the upgrade is a `bun install esbuild@latest` or equivalent. If you run esbuild's dev server on Windows, or use esbuild from Deno behind a custom registry, do it today.
