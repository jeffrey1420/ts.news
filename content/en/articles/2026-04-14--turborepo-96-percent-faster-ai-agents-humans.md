---
title: "Turborepo Is Now 96% Faster — Vercel's AI Agent Experiment"
description: "Vercel engineers used AI coding agents to optimize Turborepo's Rust codebase, achieving 81–96% faster task graph computation. Here's the process, the wins, and the sharp limits they ran into."
date: "2026-04-14"
image: "https://opengraph.githubassets.com/vercel/turborepo"
category: Tooling
author: lschvn
readingTime: 5
tags: ["turborepo", "vercel", "monorepo", "build-tools", "rust", "ai-agents"]
tldr:
  - "Turborepo's task graph computation is now 81–96% faster depending on repository size, after a week of AI-assisted Rust optimization."
  - "Vercel's team combined AI agents with LLM-friendly Markdown profiling formats — plain-text stack traces dramatically improved the quality of agent suggestions."
  - "The biggest gains came from parallelization (concurrent git, glob, and lockfile operations), allocation elimination, and batching syscall-heavy operations."
faq:
  - q: "Can AI agents replace human engineers for performance work?"
    a: "No — Vercel's engineers found that agents hyperfixated on microbenchmarks, produced misleading speedups, and never wrote regression tests. Human judgment remained essential for validation and prioritization."
  - q: "What made the profiling approach work better for agents?"
    a: "Standard Chrome Trace JSON format was hard for agents to parse. Switching to a Markdown profile format — sorted by self-time, greppable, single-line entries — produced dramatically better optimization suggestions from the same model."
  - q: "What exactly got faster in Turborepo?"
    a: "The Rust implementation was optimized across three areas: parallelizing sequential operations (git indexing, glob walks, lockfile parsing), eliminating redundant allocations and clones, and batching syscall-heavy git operations using faster libraries like gix-index."
---

Vercel engineers spent a week in March 2026 using AI coding agents to optimize Turborepo's Rust task scheduler. The result: task graph computation is now **81 to 96% faster**, depending on repository size. On a 1,000-package monorepo, `turbo run` went from 10 seconds of overhead to feeling near-instant. The write-up is值得 reading for anyone working on high-performance JavaScript tooling.

## Starting With Unsupervised Agents

The experiment began with eight background coding agents, each targeting a different area of the Rust codebase. Each agent was given a loosely defined goal — find performance issues — without step-by-step guidance. By morning, three had produced usable results: a 25% wall-clock reduction by switching to reference-based hashing, a 6% win from replacing the `twox-hash` crate with `xxhash-rust`, and a cleanup of an unnecessary Floyd-Warshall algorithm.

But the engineers quickly identified a pattern: **agents produced impressive microbenchmarks that didn't translate to real-world gains**. One agent cranked out a "97% improvement" on a microbenchmark that amounted to 0.02% in practice. Agents never wrote regression tests. They never used the `--profile` flag. And critically, they benchmarked against synthetic targets rather than the actual Turborepo codebase.

## The Profiling Problem

When the team tried using standard Chrome Trace JSON profiles with the agents, the results were poor. Function names split across lines, irrelevant metadata mixed with timing data, not grep-friendly. The agents fumbled through these files the same way a human would — badly.

The breakthrough came from noticing that Bun had shipped a `--cpu-prof-md` flag that generates profiles as Markdown. The Vercel team created a `turborepo-profile-md` crate that outputs companion `.md` files alongside every trace: hot functions sorted by self-time, call trees by total-time, caller/callee relationships — all greppable, all on single lines.

The difference was immediate. Same model, same codebase, same harness. Just a different format. The agents suddenly produced dramatically better optimization suggestions.

## What Actually Got Faster

The human-guided iteration loop — profile, identify hotspots, propose, implement, validate with hyperfine — ran for four days and produced over 20 PRs. The wins fell into three categories:

**Parallelization.** Building the git index, walking the filesystem for glob matches, parsing lockfiles, and loading `package.json` files were all sequential. These are now concurrent. The gains were largest for repositories with many packages.

**Allocation elimination.** The pipeline was cloning entire HashMaps when references would do. Glob exclusion filters were recompiled on every invocation instead of being pre-compiled. Each HTTP client was constructed per request instead of being reused. These small copies added up.

**Syscall reduction.** Per-package git subprocess calls were batched into a single repo-wide index. Then git subprocesses were replaced with `libgit2`, and `libgit2` was in turn replaced with `gix-index` — a faster, pure-Rust implementation.

## The Limit: 85% Was the Ceiling

At 85% faster, progress stalled. The remaining gains were within measurement noise on the engineers' MacBooks. The team suspects the issue was benchmarking methodology rather than the code itself — as operations get faster, variance from system noise (disk I/O, CPU scheduling) overwhelms the signal.

The lesson: **your source code is the best feedback loop**. Agents that had previously written poor code would, in later sessions, produce better output — not because the model changed, but because the merged improvements were now visible in the codebase and the agents followed them. Context, it turns out, is still the key ingredient.

## What This Means for the JavaScript Tooling Ecosystem

Turborepo is foundational infrastructure for a large share of the JavaScript monorepo world. Speed improvements here compound across every `turbo run build`, `turbo run test`, and `turbo run lint` in every repo that depends on it. The fact that the optimization was driven by AI agents — but validated by humans — is a realistic picture of where AI-assisted engineering is in 2026: a powerful accelerator for finding wins, still dependent on human judgment to separate signal from noise.

The Markdown profiling format is already being discussed as a potential standard for LLM-readable performance output across Rust tooling projects.
