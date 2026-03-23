---
title: "TypeScript 7 Native Preview: Project Corsa Rewrites the Compiler in Go — and It Changes Everything"
description: "Microsoft's decision to port the TypeScript compiler and language service to Go isn't just a tech demo — early benchmarks show the VS Code codebase compiling in 7.5 seconds versus 77.8 seconds. Here's what the native era means for your build pipeline and editor performance."
date: "2026-03-23"
author: "ts.news team"
tags: ["typescript", "compiler", "performance", "go", "tooling", "project-corsa", "nodejs"]
readingTime: 12
image: "https://github.blog/assets/images/blog/posts/2303/og-typescript-card.png"
---

For years, the TypeScript compiler has been a showcase for JavaScript eating the world — a language written in itself, bootstrapped, and used to build increasingly complex systems. It worked. It still works. But as TypeScript grew from a niche tool to the most-used language on GitHub by monthly contributors, the limits of a JavaScript-based compiler started to bite.

TypeScript 7 changes that. Or rather, it will — but the preview is already here, and the numbers are hard to argue with.

## Project Corsa: The Native Port

In early 2025, Microsoft announced [Project Corsa](https://devblogs.microsoft.com/typescript/typescript-native-port/), a full native port of the TypeScript compiler and language service to Go. The goal was ambitious: ~10x faster build times and significantly improved editor responsiveness.

The initial benchmarks were striking. On the VS Code codebase itself — a large, real-world TypeScript project — compilation dropped from **77.8 seconds to 7.5 seconds**. On the Playwright test suite, it went from 11.1 seconds to 1.1 seconds. These aren't synthetic micro-benchmarks. They're the same codebase Microsoft uses to build VS Code, running on the same hardware.

The port isn't complete yet. TypeScript 6.0.x remains the JavaScript-based release that the ecosystem transitions through. Microsoft has indicated that TypeScript 6.0 will be the last major version built on the JS-based toolchain. TypeScript 7 is where the native era begins in earnest.

## What "Native" Actually Means in Practice

There are two dimensions to what TypeScript 7 changes, and it's worth separating them.

**The compiler (`tsc`)** — The command-line TypeScript compiler. A Go-based `tsc` means faster compiles, lower memory usage during builds, and better integration with non-JavaScript toolchains. For projects that run `tsc` as part of CI pipelines, this translates directly into faster feedback cycles.

**The language service** — This is what powers VS Code's IntelliSense, error underlining, jump-to-definition, and refactoring. Editor performance is bottlenecked on the language service, not the compiler. Microsoft reports that project load times have decreased roughly **8x** in early testing. For anyone who has waited 30+ seconds for a large TypeScript project to become responsive in VS Code, that number matters.

## Node.js Type Stripping: Running TypeScript Without Transpiling

In parallel with the native compiler work, Node.js has been shipping native TypeScript support through a feature called **type stripping**. This is a fundamentally different approach to running TypeScript — instead of compiling `.ts` files to `.js`, Node.js can now execute TypeScript directly by stripping type annotations before execution.

The timeline moved fast:
- Node.js 22.18.0 (July 2025) enabled type stripping by default
- Warnings were removed in v24.3.0/22.18.0
- The feature stabilized in v25.2.0

The key distinction is between **erasable syntax** (types, interfaces — anything that disappears at runtime) and **runtime syntax** (enums, namespaces — things that produce actual JavaScript). Type stripping works cleanly for the former. For the latter, the Node.js team has introduced a `--erasableSyntaxOnly` flag that enforces this separation explicitly.

This means you can now write a TypeScript file and run it with `node file.ts` — no build step, no transpilation. For scripts, CLIs, and quick prototyping, this is a meaningful workflow improvement. For production builds, you'll still want `tsc` for cross-targeting and full type checking, but the gap between "I want to try something" and "running code" shrinks considerably.

## What Developers Need to Do Now

The transition isn't automatic, and there are concrete steps worth taking ahead of the shift:

**Audit enum and namespace usage.** These are the TypeScript features that don't have a clean erasable equivalent. Enums can be replaced with `as const` objects; namespaces can migrate to ES modules. If your codebase uses either heavily, start the migration now.

**Enable `--erasableSyntaxOnly` in CI.** This flags any non-erasable TypeScript syntax in your codebase, giving you a clear migration roadmap before type-stripping becomes the default behavior.

**Add TypeScript 7 preview to CI pipelines.** The `@typescript/native-preview` npm tag lets you test the Go-based compiler against your codebase today. It won't replace your production build yet, but it surfaces any issues before the migration lands.

**Watch for strict-by-default changes.** TypeScript 6.0 is considering making `strict` mode the default for new projects. If you've been putting off enabling strict checks, now is the time — it won't be optional much longer.

## The Bigger Picture

Two forces are converging. The first is compiler performance: a native TypeScript compiler solves the biggest pain point in the day-to-day developer experience — slow editor startup and sluggish type-checking in large codebases. The second is runtime support: Node.js running TypeScript natively removes the last friction point between writing a type-annotated file and executing it.

Together, they move TypeScript from "a language that compiles to JavaScript" toward something closer to a first-class systems language for the JavaScript ecosystem. Whether that's a good thing depends on your perspective — but the direction is clear, and the performance gains are real.

The JavaScript-based TypeScript era isn't over yet. But TypeScript 7, with its Go-based compiler and the Node.js type-stripping feature it enables, is the beginning of a different chapter.
