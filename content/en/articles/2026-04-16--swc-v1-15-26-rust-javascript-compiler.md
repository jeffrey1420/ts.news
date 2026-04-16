---
title: "SWC v1.15.26: Rust-Powered JavaScript Compiler Keeps Shipping"
description: "The swc-project Rust compiler released v1.15.26 with bug fixes, performance improvements, and continued integration across the Node.js and bundler ecosystem."
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
date: "2026-04-16"
category: Tooling
author: lschvn
readingTime: 4
tags: ["SWC", "Rust", "JavaScript", "TypeScript", "compiler", "bundler", "Parcel", "Next.js"]
tldr:
  - "SWC v1.15.26 was released on April 14, 2026, continuing the Rust-based JavaScript/TypeScript compiler's rapid release cycle with bug fixes and compatibility improvements."
  - "SWC (speedy web compiler) is used in production by Next.js, Parcel, and Deno, competing with Babel and esbuild in the JavaScript compilation space."
  - "The Rust-based approach gives SWC significant performance advantages over JavaScript-based compilers — typically 20-70x faster than Babel — while maintaining compatibility with TypeScript and JSX."
faq:
  - q: "What is SWC?"
    a: "SWC is an extensible Rust-based platform for the web. It started as a high-speed TypeScript/JavaScript compiler written in Rust, designed to replace Babel. It is used by Next.js (as an optional compiler), Parcel, and Deno's internal transpilation. It produces output compatible with Babel transforms while running significantly faster."
  - q: "How does SWC compare to esbuild or OXC?"
    a: "SWC, esbuild, and OXC are all Rust-based JavaScript tooling projects that compete in the compilation and bundling space. esbuild is the oldest and focuses on speed above all else. OXC (Oxidation Compiler) is a more recent project backed by the Vercel/Nx team, targeting feature parity with TypeScript's type checker and Rollup's bundler. SWC sits between them — it's been production-hardened for longer than OXC and has a larger plugin ecosystem."
  - q: "Is SWC used in Next.js?"
    a: "Yes. Next.js added SWC as an optional compiler starting with version 12, and it became the default compiler in Next.js 13. Users can opt into using Babel instead for specific transform compatibility needs. The SWC transform is what enables Next.js's fast refresh and compilation speeds at scale."
---

swc-project/swc v1.15.26 landed on April 14, 2026, marking another point release in the Rust-based JavaScript and TypeScript compiler's steady release cadence. The project, which has been production-hardened through its integration in Next.js, Parcel, and Deno, continues to ship compatibility fixes and performance refinements without major new features in this cycle.

## What Is SWC?

SWC (speedy web compiler) started as a drop-in replacement for Babel, written in Rust to take advantage of the language's performance characteristics. Where Babel runs as a JavaScript process interpreting a chain of transforms, SWC compiles those same transforms to native machine code ahead of time. The result is a compiler that processes JavaScript and TypeScript code 20 to 70 times faster than Babel, depending on the workload.

The project is organized around a core compiler crate that handles parsing, transforming, and serializing JavaScript and TypeScript code. A separate crate system exposes these transforms as isolated operations, which can be composed — similar to how Babel plugins work — but executed in a Rust runtime.

## v1.15.26 Changes

The v1.15.26 release includes patches across SWC's core, common API surface, and transform passes. While this is a patch-level release, it reflects the ongoing maintenance work that keeps SWC compatible with the latest ECMAScript proposals and TypeScript syntax. The previous stable release, v1.15.24, shipped on April 4, and v1.15.25 followed shortly after — the project has been maintaining a roughly weekly patch cadence.

Key areas of ongoing work include:

- **TypeScript transform compatibility** — ensuring that the SWC transform for TypeScript remains aligned with the TypeScript compiler's behavior for newer TypeScript syntax features
- **ES2026/ES2027 proposal support** — SWC tracks the ECMAScript proposal stage process and updates its parser and transforms accordingly
- **Bug fixes in the minifier** — the SWC minifier competes with Terser for JavaScript output size optimization

## The Rust Tooling Ecosystem

SWC exists in a crowded but healthy part of the JavaScript tooling landscape. The three major Rust-based JavaScript tool projects each occupy a different niche:

- **esbuild** (by Evan Wallace) — the oldest, focused on raw compilation speed
- **SWC** — the most Babel-compatible, deepest integration with existing frameworks
- **OXC** (Oxidation Compiler) — the newest, backed by the Vercel/Nx team, targeting full TypeScript type-checker coverage and Rollup-compatible bundling

SWC's advantage over the newer entrants is its track record. It has been running in production at scale inside Next.js applications for years, which means edge cases have been found and fixed. OXC is catching up fast — its latest releases (v0.125 and v0.126) have been adding TypeScript-specific transforms that previously required SWC or the TypeScript compiler itself.

The healthy competition between these three projects has raised the bar for the entire JavaScript tooling ecosystem. What would have required a Babel plugin chain running in a slow JavaScript process five years ago is now handled by native code in milliseconds.

## Using SWC

For most developers, SWC is encountered indirectly through Next.js or Parcel. However, the SWC crate can be used directly as a build tool or integrated into custom tooling:

```rust
use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, TsSyntax};
use swc_ecma_ast::*;
use swc_ecma_codegen::Emitter;

fn main() {
    let cm: Lrc<SourceMap> = Default::default();
    let fm = cm.new_source_file(
        FileName::Custom("example.ts".into()).into(),
        "const x: number = 1;".into(),
    );
    let lexer = Lexer::new(
        TsSyntax::default(),
        Default::default(),
        StringInput::from(&*fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);
    let module = parser.parse_module().unwrap();
    // ... transforms and codegen
}
```

The Rust API gives fine-grained control over the compilation pipeline. For JavaScript-based tooling, the `@swc-node` and `@swc/core` npm packages expose the same transforms.

The project maintains a nightly release channel that tracks the latest ECMAScript proposals and TypeScript features. Stable releases are cut frequently enough that most users can update without concern — breaking changes in swc are rare outside of major version bumps.
