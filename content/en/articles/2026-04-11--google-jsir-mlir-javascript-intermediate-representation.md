---
title: "Google's JSIR: An MLIR-Based Intermediate Representation for JavaScript Analysis"
description: "Google has open sourced JSIR, a next-generation JavaScript analysis tool built on MLIR. It supports both high-level dataflow analysis and lossless source-to-source transformation — used internally for Hermes bytecode decompilation and AI-powered JavaScript deobfuscation."
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop"
date: "2026-04-11"
category: Open Source
author: lschvn
readingTime: 5
tags: ["Google", "JSIR", "MLIR", "JavaScript", "tooling", "analysis", "decompilation", "open source"]
tldr:
  - "JSIR is Google's new MLIR-based intermediate representation for JavaScript, designed to support both high-level dataflow analysis and lossless source-to-source transformation — a combination that existing IRs typically sacrifice."
  - "Google already uses JSIR internally for Hermes bytecode decompilation and AI-powered JavaScript deobfuscation, where it combines with Gemini LLM to reverse-engineer obfuscated code."
  - "The project targets tooling developers: better linters, smarter bundlers, more powerful refactoring tools — not end-user developers directly, but the ecosystem will feel the downstream impact."
faq:
  - q: "What makes JSIR different from other JavaScript IRs?"
    a: "Most IRs for JavaScript have to choose between being high-level (preserving enough structure to reconstruct source) or low-level (enabling deep dataflow analysis). JSIR uses MLIR regions to model JavaScript's control flow structures accurately enough to do both simultaneously — source-to-source transformation and taint analysis from the same representation."
  - q: "What is MLIR?"
    a: "MLIR (Multi-Level Intermediate Representation) is an LLVM project that provides a flexible intermediate representation framework. It's designed to unify different IRs across compiler infrastructure. By building JSIR on MLIR, Google gains compatibility with the broader LLVM ecosystem and tooling."
  - q: "What is Hermes bytecode?"
    a: "Hermes is Facebook's JavaScript engine optimized for React Native. It compiles JavaScript to Hermes bytecode for faster startup times. JSIR can decompile this bytecode back to JavaScript by leveraging its source-liftability — a capability that existing tools lack."
  - q: "How does JSIR enable AI deobfuscation?"
    a: "Google published research (CASCADE paper, arXiv:2507.17691) showing how they combine Gemini LLM with JSIR for JavaScript deobfuscation. JSIR's structured representation feeds the AI a clean, analyzable view of obfuscated code, and the AI can generate transformations that JSIR then applies back to source."
---

When a compiler intermediate representation (IR) makes the news, you know it matters. Google has published [JSIR](https://github.com/google/jsir), a next-generation JavaScript analysis tool built on [MLIR](https://mlir.llvm.org), and it's already used internally for tasks that reveal just how ambitious the project is: decompiling Hermes bytecode back to JavaScript, and powering AI-assisted deobfuscation pipelines that combine JSIR with Gemini.

## Why This Matters for Tooling

An intermediate representation is the data structure that a compiler or analysis tool uses to represent code between parsing and code generation. If an AST tells you what the code looks like structurally, an IR tells you what it *does*. The quality of your IR determines what kind of analysis and transformation you can perform.

JavaScript tooling has long suffered from fragmented IR approaches. Babel plugins work on ASTs. ESLint rules work on ASTs. Bundlers often work on their own internal representations with limited interoperability. A common, well-designed IR could let these tools share analysis work — and that's exactly what Google is proposing with JSIR.

## High-Level and Low-Level Simultaneously

The core technical challenge JSIR solves is a familiar one in compiler design: you typically have to choose between a high-level IR (preserves AST structure, can be lifted back to source) and a low-level IR (enables deep dataflow analysis like taint tracking and constant propagation). Most systems pick one.

JSIR uses MLIR regions to accurately model JavaScript's control flow structures — things like closures, try-catch-finally, async functions, and generator frames — in a way that supports both directions simultaneously. You can transform code and lift it back to source, or run taint analysis across the same representation.

This unlocks use cases that were previously impractical:

**Decompilation**: JSIR is used at Google to decompile Hermes bytecode all the way back to JavaScript. Hermes compiles React Native apps to a compact bytecode for faster startup; JSIR's source-liftability is what makes this decompilation possible when other tools would hit a dead end.

**Deobfuscation**: Google published research ([CASCADE](https://arxiv.org/abs/2507.17691)) on combining Gemini LLM with JSIR for JavaScript deobfuscation. The AI operates on JSIR's structured representation rather than raw obfuscated source, producing transformations that JSIR applies back to reconstruct clean code.

## The MLIR Foundation

JSIR isn't a standalone project — it's built on MLIR, the LLVM project's flexible IR framework. This is significant for ecosystem compatibility: MLIR already has a broad set of existing dialects, transformations, and tooling. By expressing JavaScript analysis in MLIR terms, JSIR can plug into that ecosystem rather than reinventing infrastructure.

## Getting Started

JSIR is available on GitHub at [github.com/google/jsir](https://github.com/google/google/tree/main/jsir). The project recommends using Docker for local experimentation:

```bash
docker build -t jsir:latest .
docker run --rm -v $(pwd):/workspace jsir:latest jsir_gen --input_file=/workspace/yourfile.js
```

Building from source requires clang, Bazel, and significant build time — the project notes that LLVM fetch and build takes a while. The Docker path is the practical entry point for most developers.

## What This Means for the Ecosystem

Most developers won't interact with JSIR directly in the near term — it's a foundation for tooling developers to build on. But the long-term implications are significant. A shared, well-designed IR could enable:

- Linters with deeper semantic understanding (not just pattern matching on AST nodes)
- Bundlers with better dead code elimination using dataflow analysis
- Refactoring tools that can safely transform code across complex control flow
- Cross-framework analysis that works consistently regardless of which framework or build tool is used

Google has open sourced it, which means the community can build on this foundation. Whether it gains traction depends on whether tooling maintainers see enough benefit to integrate JSIR-based analysis into their pipelines — but the technical foundation is solid.
