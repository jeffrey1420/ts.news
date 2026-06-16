---
title: "Biome 2.5 Ships with `@biomejs/js-api` v6.0.0: A Major Bump for the JS API"
description: "Biome's CLI hits 2.5.0 and the JavaScript API moves to a major v6.0.0. The headline is a new spanInBytesToSpanInCodeUnits helper that fixes a real bug in non-ASCII text extraction, plus a long list of SCSS, JSON, linter, and CLI improvements."
date: 2026-06-12
image: "/images/heroes/2026-06-12--biome-v2-5-js-api-v6-major.png"
author: lschvn
tags: ["tooling", "javascript", "ecosystem"]
tldr:
  - "Biome's JavaScript API moves to a major v6.0.0 on June 12, 2026, headlined by spanInBytesToSpanInCodeUnits, a helper that fixes a real UTF-16 surrogate bug in non-ASCII diagnostic text extraction."
  - "The CLI bump to 2.5.0 is mostly a WASM-package sync, but ships a new concise reporter, an ANSI art Biome logo, and a long list of SCSS, JSON, linter, and HTML a11y features."
  - "biome_service gains support for applying GritQL plugin rewrites via --write, opening the door to custom refactors in the same pipeline as the built-in rules."
faq:
  - question: "What breaks when I upgrade from @biomejs/js-api 5.x to 6.0.0?"
    answer: "The public API surface is the same shape; the major bump is a heads-up about the new helper and the versioned dependencies on @biomejs/wasm-web, @biomejs/wasm-bundler, and @biomejs/wasm-nodejs, which all pin to 2.5.0. If you call into the WASM modules directly, you will need to bump them alongside. The CLI side is fully backward compatible."
  - question: "How do I fix the byte-vs-UTF-16 span issue in my own code?"
    answer: "If you were working around the bug by manually converting Biome's byte offsets before slicing into JavaScript string content, replace the workaround with the new helper: `const [start, end] = spanInBytesToSpanInCodeUnits(diagnostic.location.span, content); const text = content.slice(start, end);` The helper handles surrogate pairs and unpaired surrogates correctly, which is the case the manual conversions usually got wrong."
  - question: "Does Biome 2.5 add HTML linting?"
    answer: "Yes, in the sense that several a11y rules have been ported from the JS analyzer into biome_html_analyze. As of 2.5, the HTML analyzer includes noRedundantRoles, useKeyWithMouseEvents, and useAriaActivedescendantWithTabindex. A noRedundantRoles rule for HTML was ported, reverted, and re-landed after a follow-up fix."
  - question: "What is the GritQL plugin rewrite feature?"
    answer: "biome_service now supports applying GritQL plugin rewrites via the standard --write flag. GritQL is a pattern-matching language designed for source code refactors; the integration means you can ship a custom GritQL plugin and have Biome apply the rewrite across the same files the linter and formatter are touching, with the same project-aware configuration."
---

Biome shipped two coordinated releases on June 12, 2026: [Biome CLI v2.5.0](https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fbiome%402.5.0) and [@biomejs/js-api v6.0.0](https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fjs-api%406.0.0). The headline is the JavaScript API's first major version bump since the project split the WASM packages from the CLI. The CLI bump is mostly a WASM sync, with a long list of small features on top.

## The js-api v6.0.0 headline

The major bump is centered on a single new export: `spanInBytesToSpanInCodeUnits(diagnostic.location.span, content)`. Biome's diagnostics carry UTF-8 byte offsets because that is how the analyzer indexes source internally. JavaScript strings are UTF-16, so any code that took a Biome diagnostic and called `content.slice(spanStart, spanEnd)` on the original string would get the wrong text on any non-ASCII content: emoji, accented characters, CJK. The slice boundary would land in the middle of a code unit, return `undefined` for the trailing surrogate, and silently corrupt the extracted snippet.

The new helper converts byte-based spans to UTF-16 code unit spans, including the surrogate pair and unpaired surrogate edge cases. It is the kind of fix that warrants a major version bump on its own, and Biome used the opportunity to version-bump the WASM packages: `@biomejs/wasm-web`, `@biomejs/wasm-bundler`, and `@biomejs/wasm-nodejs` all pin to 2.5.0 to match the CLI.

## SCSS, JSON, linter, and CLI

The 2.5.0 release covers a long list of incremental features. On the parser side, SCSS support is meaningfully expanded: qualified names in values and function calls, unary expression parsing, nested declarations in declaration lists, declarations in `@page` blocks, and delimiters in bracketed value lists. JSON gets a new `useSortedPackageJson` rule. The linter picks up two new cross-language rules, a new `includes` option for plugin file scoping, an `ignore` option for `no-unused-variables`, and a `noUndeclaredClasses` change that now collects both local and global styles. `organizeImports` adds a `sortBareImports` option.

The CLI gets an ANSI art Biome logo on startup and a new concise reporter. `biome_service` gains support for applying [GritQL](https://docs.grit.io/) plugin rewrites through the standard `--write` flag, which is the missing piece for shipping a custom refactor rule that runs through the same pipeline as the linter and formatter.

The HTML analyzer continues to grow. As of 2.5, it includes `noRedundantRoles`, `useKeyWithMouseEvents`, and `useAriaActivedescendantWithTabindex` (the `noRedundantRoles` port was reverted and re-landed after a follow-up fix, which is why the changelog shows it twice).

## Why the major bump matters

For users consuming Biome as a CLI or through editor integrations, 2.5.0 is a routine upgrade. The interesting story is for projects that embed `@biomejs/js-api` directly: the helper is the first piece of a wider effort to make the API safe to use on non-ASCII source code, and the major version bump signals that the project is treating the public surface as a stable contract.

That positioning puts Biome closer to where [Oxc sits with the Rust toolchain](/articles/2026-06-02-oxc-v0-134-oxlint-1-68-oxfmt-0-53-vue-typescript-rules): a Rust-backed JavaScript toolchain with a programmatic API for embedding. The two projects take different positions on the spectrum (Biome bundles a linter, formatter, and import organizer in one binary, while [Oxc](/articles/2026-04-05-oxc-rust-javascript-toolchain-benchmarks) splits those into separate crates), but both are now mature enough that programmatic embedding is a first-class use case. For teams that ran the previous API through a UTF-8-to-UTF-16 conversion workaround, 6.0.0 is the upgrade that makes the workaround unnecessary.
