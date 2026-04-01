---
title: "numpy-ts 1.2 Hits 50% Native NumPy Performance With Float16 Support"
description: "The pure TypeScript NumPy implementation hits a new performance milestone and adds Float16 support, bringing scientific computing in the browser closer to reality."
date: 2026-04-01
image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop"
author: lschvn
tags: ["typescript", "javascript", "numpy", "scientific-computing", "webassembly", "browser"]
faq:
  - question: "What is numpy-ts?"
    answer: "numpy-ts is a pure TypeScript implementation of the NumPy API, built to run in browsers and Node.js without native dependencies. It covers roughly 94% of NumPy's API surface and is validated against the real NumPy test suite."
  - question: "How fast is it compared to actual NumPy?"
    answer: "Version 1.2 achieves approximately 50% of native NumPy performance — a significant jump from earlier versions. For many web-based use cases, this is more than sufficient, especially considering it runs entirely in the browser."
  - question: "What is Float16 and why does it matter?"
    answer: "Float16 (half-precision floating point) uses 16 bits per number instead of 32 (Float32) or 64 (Float64). It's commonly used in machine learning inference where memory bandwidth is a bottleneck and full precision isn't necessary. numpy-ts 1.2 now supports Float16 alongside all standard NumPy dtypes."
  - question: "Can I use numpy-ts to train machine learning models?"
    answer: "numpy-ts is designed for inference and general numerical computing, not training. For browser-based ML training, look at WebGPU-backed solutions like JAX.js (ekzhang/jax-js). But for data preprocessing, visualization pipelines, and statistical operations, numpy-ts is well-suited."
tldr:
  - "numpy-ts 1.2 achieves ~50% of native NumPy's performance in pure TypeScript/JavaScript, with no native binaries or WebAssembly required."
  - "The release adds Float16 dtype support, enabling lower-memory workflows common in ML inference pipelines and signal processing."
  - "With 94% API coverage, numpy-ts is the most complete NumPy port for the JavaScript ecosystem, and the API is intentionally close to Python for easy migration."
  - "Installation is a single npm command: `npm install numpy-ts`, and it works in both Node.js and modern browsers."
---

[numpy-ts](https://numpyts.dev), the most comprehensive NumPy implementation built entirely in TypeScript, has released version 1.2 — and it marks the project's most significant performance milestone yet. The library now runs at approximately **50% of native NumPy performance**, while adding first-class **Float16 support** for memory-efficient numerical workflows.

The project fills a gap the JavaScript ecosystem has long struggled with: running numerical and scientific computing code in the browser without falling back to native binaries or WebAssembly compilation steps.

## What numpy-ts is trying to solve

Python's NumPy is the de facto standard for array-based computing — from linear algebra and signal processing to data preprocessing for machine learning. Bringing that API to JavaScript and TypeScript has obvious appeal for web-based tools, notebooks, and browser-native data science applications.

The challenge is that NumPy achieves its speed through highly optimized C and Fortran code under the hood (via BLAS and LAPACK). Pure JavaScript or TypeScript implementations have to work around the lack of low-level array primitives, which is why most previous attempts were either incomplete, slow, or required WebAssembly compilation pipelines.

numpy-ts takes a different approach: it implements the NumPy API as faithfully as possible in TypeScript, validating its output against the actual NumPy test suite to catch correctness bugs early. Version 1.2 pushes the performance envelope further by optimizing hot paths and adding SIMD-friendly data structures where the JavaScript engine allows.

## Float16: the new dtype in town

Float16 (also called `half-precision` or `float16`) uses 16 bits per number instead of the standard 32 or 64. It's been a fixture of GPU computing for years — NVIDIA's Tensor Cores, for instance, operate natively on Float16 — because it dramatically reduces memory usage and memory bandwidth requirements during inference.

Until now, numpy-ts didn't support Float16, limiting its usefulness for ML-adjacent workflows. Version 1.2 adds it alongside full support for Float32, Float64, Int8/16/32, Uint8/16/32, and complex number types.

## API compatibility with NumPy

The project's stated goal is API compatibility with NumPy, not just the concepts. The v1.2 documentation includes a [NumPy Migration Guide](https://numpyts.dev/migration) that shows side-by-side Python and TypeScript examples. Most code translates directly:

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

This close mapping makes it practical to port NumPy-based preprocessing pipelines to TypeScript with minimal rewrite.

## Where it fits in the JS/ML ecosystem

numpy-ts isn't competing with WebGPU-based ML libraries like [JAX.js](https://github.com/ekzhang/jax-js) for training workloads. Instead, it targets the large set of numerical tasks that don't need GPU acceleration: data cleaning, statistical summaries, matrix operations for non-ML applications, and anywhere you want NumPy's API without a Python runtime.

At 94% API coverage, numpy-ts is also the most complete NumPy port in the JavaScript ecosystem. Other ports exist but trail significantly in breadth.

## Getting started

```bash
npm install numpy-ts
# or
yarn add numpy-ts
# or
pnpm add numpy-ts
```

The library has no runtime dependencies and works in both Node.js (CommonJS and ESM) and modern browsers. Full documentation, the migration guide, and API reference are at [numpyts.dev](https://numpyts.dev).
