---
title: "Turborepo v2.9.16 Lands Heap Allocation Profiling and pnpm Fixes"
description: "Turborepo's latest stable releases add heap allocation profiling via OpenTelemetry traces, fix pnpm injected peer package handling, harden OTEL endpoint validation, and address PTY shutdown hangs and npm tlog publish retries."
date: 2026-06-02
image: "/images/heroes/2026-06-02--turborepo-v2-9-16-heap-allocation-profiling-pnpm-fixes.png"
author: lschvn
tags: ["tooling", "typescript", "javascript"]
tldr:
  - Turborepo v2.9.16 ships heap allocation profiling via OpenTelemetry traces, giving monorepo maintainers visibility into memory usage per task and package
  - pnpm workspaces with injected peer dependencies now work correctly — Turborepo no longer drops those entries during task execution
  - OTEL endpoint validation is hardened against misconfigured collectors, PTY shutdown hangs are fixed, and npm tlog publish failures now retry automatically
---

## Heap Allocation Profiling

The most significant user-facing addition in v2.9.16 is **heap allocation profiling support** via OpenTelemetry (OTEL) traces. This release adds heap allocation data to Turborepo's existing OTEL trace output, letting you see per-task and per-package memory consumption in your CI or local tracing setup.

To use it, point `TURBO_TRACE_ENDPOINT` at your OTEL collector as before — heap data now appears alongside the existing duration and span information. The implementation adds a new `heap.allocated` event to task spans with category breakdowns (V8 heap, native allocations, etc.).

This is particularly useful for monorepos where a single slow or memory-hungry package can drag down the whole CI pipeline.

## pnpm Injected Peer Fix

The v2.9.15 release introduced a regression in how Turborepo handles **pnpm injected peer packages**. When a package uses pnpm's `injected: true` workspace protocol for peer dependencies, Turborepo was incorrectly omitting or mishandling those entries during the task graph resolution.

v2.9.16 fixes this. If your monorepo uses pnpm with injected peers — a pattern sometimes used to ensure a single physical copy of a peer package across the workspace — Turborepo now correctly preserves those entries.

## OTEL Endpoint Validation Hardened

Turborepo v2.9.16 also hardens the **OTEL endpoint URL validation**. Previously, a malformed endpoint URL (e.g., missing scheme or wrong port) could cause Turborepo to crash silently or produce garbled trace output. The new validation is stricter and fails fast with a clear error message if the endpoint is misconfigured.

## PTY Shutdown and npm tlog Fixes

Two smaller but impactful fixes:

- **PTY shutdown hang** — on certain Linux distributions, the pseudo-terminal (PTY) used to run tasks in watch mode would hang on shutdown, leaving `turbo` processes orphaned. This is now fixed.
- **npm tlog publish retries** — npm package publishing with `turbo run build --dry-run=json` (or the CI pipeline's tlog output) would fail unrecoverably on transient network errors. v2.9.16 adds automatic retries for tlog publish failures.

## Other Changes

- **`--gitignore` root handling in prune** — `turbo prune` now correctly respects the root `.gitignore` when determining what to include in the artifact for a given scope, fixing edge cases where extra files were included.
- **Profile tracing coverage improved** — task spans that were missing parent attribution in previous releases are now correctly linked in the trace output.

## Updating

```bash
npm install -g turbo@latest
# or
brew install turbo
# or
cargo install turbo
```

Turborepo v2.9.16 is the current stable release. Canary builds (v2.9.17-canary.x) are available for testing the next batch of changes.
