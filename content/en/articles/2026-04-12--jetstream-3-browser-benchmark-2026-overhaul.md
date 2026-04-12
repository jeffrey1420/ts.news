---
title: "JetStream 3: The Benchmark That Actually Reflects How Modern Web Apps Run"
description: "WebKit, Google, and Mozilla just released JetStream 3 — the first major overhaul of the benchmark suite since 2019. It drops microbenchmarks in favor of realistic workloads, rewrites WebAssembly scoring, and introduces Dart, Kotlin, and Rust compiled to Wasm."
image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&h=630&fit=crop"
date: "2026-04-12"
category: Standards
author: lschvn
readingTime: 6
tags: ["JetStream", "benchmark", "WebAssembly", "JavaScript", "WebKit", "browser", "performance", "Wasm"]
tldr:
  - "JetStream 3 replaces the old startup/runtime Wasm scoring with a unified lifecycle model, matching how JavaScript benchmarks have always worked — engines now optimize for the full execution, not just instantiation speed."
  - "The benchmark now includes 12 WebAssembly workloads using C++, C#, Dart, Java, Kotlin, and Rust, covering WasmGC, SIMD, and Exception Handling — reflecting real-world usage far better than the asm.js leftovers from 2019."
  - "WebKit's JavaScriptCore team documented a 40% WasmGC improvement from inlining GC allocations directly into generated machine code and restructuring object layouts to eliminate double-allocation overhead."
faq:
  - q: "What's the difference between JetStream 2 and JetStream 3?"
    a: "JetStream 2 was released in 2019. Its WebAssembly scoring used a separate startup and runtime phase that became obsolete as engines got faster — some workloads reached sub-millisecond instantiation, making the startup score effectively infinite. JetStream 3 treats Wasm like JavaScript: running the full lifecycle across multiple iterations and capturing first compilation, worst-case jank, and sustained throughput in one geometric average."
  - q: "Why did the three browser engines collaborate on this?"
    a: "Benchmarks only drive real optimization if they're credible. A single engine publishing its own benchmark would be self-serving. By pooling expertise from WebKit (Safari), V8 (Chrome), and SpiderMonkey (Firefox), JetStream 3 has the legitimacy to actually influence how all three engines optimize — which benefits developers across every browser."
  - q: "What are WasmGC, SIMD, and Exception Handling in Wasm?"
    a: "WasmGC adds garbage-collected memory (structs and arrays) to WebAssembly, enabling languages like Dart, Kotlin, and Java to compile to Wasm with idiomatic allocation patterns. SIMD (Single Instruction Multiple Data) lets one instruction operate on multiple data values in parallel — critical for codecs, image processing, and ML inference. Exception Handling lets Wasm throw and catch exceptions, matching how languages like C++ and Java manage control flow."
  - q: "What is Cohen's type display algorithm?"
    a: "It's a technique for fast subtype checking: each type stores a fixed-size array (the 'display') of pointers to all ancestor types. To check if type A is a subtype of type B, the engine looks up one entry in A's display at B's inheritance depth and compares pointers — O(1) rather than walking a parent chain. WebKit embedded the first six entries directly in each type's runtime record to keep the common case within a single cache line."
---

Benchmarks are only useful if they drive real improvements. And a benchmark that rewards engines for optimizing specifically for itself — rather than for actual applications — becomes counterproductive over time.

That's the core problem JetStream 3 solves. Released last week by engineers from WebKit, Google, and Mozilla, it's the first major revision of the JetStream suite since 2019. The web has changed dramatically in seven years, and the old benchmark had started showing its age in ways that actually hurt performance progress.

## The Microbenchmark Trap

The original JetStream 2 scored WebAssembly in two phases: a single-iteration Startup measurement and a longer Runtime measurement. The idea was reasonable when the benchmark was designed — early Wasm adopters were compiling large C and C++ applications (games, codecs) where users would tolerate a one-time startup cost for sustained throughput.

But engines got fast. Really fast. WebKit optimized the Wasm instantiation path so aggressively that for smaller workloads, startup time effectively hit zero milliseconds. And because JetStream 2 used `Date.now()` for timing — which rounds down — sub-millisecond times registered as 0ms. The scoring formula `Score = 5000 / Time` then produced infinity.

The team patched this by clamping the score to 5000, but it was a clear signal: the benchmark methodology had outgrown its subject matter. An "infinite" score tells you nothing useful about how an engine handles real workloads. More importantly, a zero startup time in a microbenchmark ignores what happens *after* instantiation — the actual work your application does.

## Unified Scoring for Wasm

JetStream 3 retires the split startup/runtime model and adopts the same methodology used for JavaScript benchmarks. Every Wasm workload now runs across multiple iterations, capturing:

- **First Iteration** — compilation and initial setup
- **Worst Case Iterations** — jank, GC pauses, and tiering spikes
- **Average Case Iterations** — sustained throughput

These are geometrically averaged into a single subtest score, which feeds into the geometric mean of the full benchmark. Engines are now incentivized to optimize the *entire* lifecycle of a Wasm instance, not just instantiation.

## Real Languages, Real Toolchains

JetStream 3's Wasm workloads are compiled from five source languages: C++, C#, Dart, Java, and Kotlin. This reflects how Wasm is actually used in production — not just C++ game engines, but Dart and Kotlin via WasmGC (used by modern web frameworks like Flutter), and Rust for performance-critical modules.

The new workloads exercise Wasm features that JetStream 2 barely touched:

- **WasmGC** — garbage-collected heap allocations (structs, arrays) enabling idiomatic patterns from high-level languages
- **SIMD** — single instruction, multiple data for parallel data processing
- **Exception Handling** — structured exception throwing and catching

JavaScript coverage was updated too: Promises and async functions, modern RegExp features, and public/private class fields. Several asm.js workloads were removed — the technology has been superseded by WebAssembly and was distorting the scoring.

## The Engineering Behind WebKit's Gains

The WebKit team published a detailed breakdown of their JavaScriptCore optimizations targeting JetStream 3. The results are substantial:

**GC allocation inlining**: WasmGC programs create millions of small objects. The original JSC implementation called a C++ function for every allocation. Two changes delivered ~40% improvement on WasmGC subtests:

1. Changed object layout so structs and arrays store field data *inline* after the header in a single allocation, eliminating the second allocation and pointer indirection
2. Inlined the allocation fast path directly into generated machine code — a short instruction sequence that bumps a pointer, writes the header, and returns without leaving generated code

**Type display inlining**: WasmGC languages rely heavily on runtime type checks (casts, instanceof tests, indirect function calls). WebKit implemented Cohen's type display algorithm and inlined it into both their baseline (BBQ) and optimizing (OMG) compilers. They also embedded the first six display entries directly in each type record so shallow hierarchies require no pointer indirection and stay within a single cache line.

**Eliminating GC destructor overhead**: Previously, every WasmGC object held a reference to its type definition and ran a destructor on destruction — which had to decrement the reference count under a global lock. Restructuring type information to use the garbage collector's existing Structure mechanism eliminated destructors entirely, delivering another ~40% on the Dart-flute-wasm subtest.

## Why This Matters for JavaScript Developers

Browser benchmarks sound like browser-engineer trivia, but they have direct practical consequences. When engines optimize for benchmarks, all web applications benefit — the optimizations are real, the workloads are just a proxy.

JetStream 3's shift away from microbenchmarks toward larger, longer-running workloads means the optimizations engines pursue will be the ones that matter in production applications. A 40% improvement on a WasmGC subtest means Flutter web apps, Kotlin-to-Wasm tools, and any application using Wasm for computation-intensive tasks will run faster in Safari.

The collaboration between the three major engines is also notable. JetStream 3 uses an open governance model, with contributions pooled in a shared GitHub repository. The goal is a benchmark that all engines have incentive to optimize for honestly — which is ultimately what makes it useful to developers.

JetStream 3 is available now at [browserbench.org](https://browserbench.org/JetStream3.0/).
