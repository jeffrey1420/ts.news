---
title: "numpy-ts 1.2: Bit-for-Bit NumPy RNG Parity and Float16 Support in Pure TypeScript"
description: "The pure TypeScript NumPy implementation reaches a correctness milestone: random number generation now matches NumPy bit for bit, Float16 lands as a first-class dtype, and the package no longer needs per-runtime entry points."
date: 2026-04-01
image: "/images/heroes/2026-04-01-numpy-ts-1-2-half-native-performance.png"
author: lschvn
tags: ["javascript", "typescript", "performance"]
faq:
  - question: "What is numpy-ts?"
    answer: "numpy-ts is a pure TypeScript implementation of the NumPy API by Nico Dupont, built to run in browsers, Node.js, Bun, and Deno without native dependencies. It covers roughly 94% of NumPy's API surface (476 of 507 functions) and validates its output against NumPy itself with over 6,000 tests."
  - question: "How fast is it compared to actual NumPy?"
    answer: "Slower, the author measures roughly 15x slower than native NumPy on average, which is expected for pure JavaScript against C/BLAS. The optimization roadmap includes algorithmic improvements and selective WebAssembly. For preprocessing, statistics, and interactive browser tools, it is generally fast enough; for heavy number crunching, native NumPy still wins comfortably."
  - question: "What does bit-for-bit RNG parity mean and why does it matter?"
    answer: "Given the same seed, numpy-ts 1.2 produces exactly the same random number sequence as NumPy, not statistically similar, identical. That matters for reproducing experiments, porting test fixtures, and validating a TypeScript port of Python code against its reference output."
  - question: "Can I use numpy-ts to train machine learning models?"
    answer: "numpy-ts is designed for inference-adjacent work and general numerical computing, not training. For browser-based ML training, look at WebGPU-backed projects like JAX.js. But for data preprocessing, visualization pipelines, and statistical operations, numpy-ts is well suited."
tldr:
  - "numpy-ts 1.2 generates bit-for-bit identical random number sequences to NumPy from the same seed, previous versions diverged after the first few values."
  - "Float16 (half-precision) lands as a first-class dtype, despite JavaScript having no native float16, useful for ML-adjacent and signal processing workflows."
  - "One entry point now works across Node.js, Bun, Deno, and browsers; the per-runtime imports are gone."
  - "With ~94% API coverage validated against NumPy itself, numpy-ts is the most complete NumPy port in the JavaScript ecosystem. It is not fast (~15x slower than native NumPy), it is compatible, which is the point."
---

[numpy-ts](https://numpyts.dev), the most comprehensive NumPy implementation written entirely in TypeScript, has released version 1.2, and the headline is not speed. It is something stricter: **given the same seed, numpy-ts now produces exactly the same random numbers as NumPy, bit for bit.** Alongside that, the release adds first-class **Float16 support** and collapses the per-runtime entry points into one package that works everywhere.

## What numpy-ts is trying to solve

Python's NumPy is the de facto standard for array computing, linear algebra, signal processing, data preprocessing for machine learning. Bringing that API to TypeScript has obvious appeal for web-based tools, notebooks, and browser-native data apps.

The hard part has never been the API surface; it is matching NumPy's *behavior*. numpy-ts approaches this by validating against NumPy directly: over 6,000 tests compare its output with the real thing, across arithmetic, FFT, linear algebra, and random distributions. Coverage sits at roughly **94% of the NumPy API**, 476 of 507 functions, which makes it the most complete port in the JavaScript ecosystem by a wide margin.

## The RNG story: identical, not similar

Before 1.2, numpy-ts used approximations of NumPy's random number generation, close enough for casual use, but sequences diverged from NumPy after the first few values. For scientific work, that is disqualifying: you cannot reproduce a paper's experiment, port a test fixture, or verify a migration if `seed(42)` gives you different numbers.

Version 1.2 reimplements the generators to match NumPy **bit for bit**:

```typescript
import { random } from 'numpy-ts';

const rng = random.default_rng(42);
rng.random(3);
// [0.7739560485559633, 0.4388784397520523, 0.8585979199113825]
//, the exact same three numbers NumPy prints for default_rng(42)
```

If you are porting a NumPy pipeline and your tests assert on seeded random data, those fixtures now transfer unchanged.

## Float16, without native support

Float16 (half-precision) uses 16 bits per number and has been a fixture of GPU inference for years, memory bandwidth is usually the bottleneck, and half precision is often plenty. JavaScript has no native float16 type, so numpy-ts implements the conversion and storage itself, slotting it in alongside Float32, Float64, the integer dtypes, and complex numbers.

## One package, every runtime

Until now, different runtimes needed different entry points, one import for Node, another for browsers. Version 1.2 unifies them: one package that behaves identically on Node.js, Bun, Deno, and in browsers, at about 93 kB minified and gzipped with zero dependencies.

## So how fast is it, honestly?

Here is the part worth being precise about: numpy-ts is **not** close to native NumPy performance, and its author does not claim otherwise. NumPy gets its speed from decades-old C, BLAS, and LAPACK; a pure TypeScript implementation runs on average about **15x slower**. The roadmap targets algorithmic optimizations and selective WebAssembly for hot paths.

![Honest performance picture: native NumPy vs numpy-ts](/images/charts/numpy-ts-performance.png)

In practice the gap matters less than it sounds for the library's actual use cases, cleaning a dataset in a browser tool, computing summary statistics, running a small matrix operation in a visualization. It matters a lot if you try to do real numerical computing on large arrays. Know which case you are in.

## API compatibility with NumPy

The project's goal is API compatibility, not just the concepts, and the [migration guide](https://numpyts.dev) shows side-by-side translations. Most code maps directly:

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.linalg.inv(a)
c = np.dot(a, b)
d = np.sum(a, axis=0)
```

```typescript
import { array, linalg, dot, sum } from 'numpy-ts';

const a = array([[1, 2], [3, 4]]);
const b = linalg.inv(a);
const c = dot(a, b);
const d = sum(a, { axis: 0 });
```

## Getting started

```bash
npm install numpy-ts
```

No runtime dependencies, works in Node.js (CommonJS and ESM) and modern browsers. Full documentation, the migration guide, and the API reference live at [numpyts.dev](https://numpyts.dev), with the source at [github.com/dupontcyborg/numpy-ts](https://github.com/dupontcyborg/numpy-ts).
