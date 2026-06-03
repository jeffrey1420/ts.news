---
title: "Nitro v3.0.260522-beta: Build-Time Tracing Wrappers, VFS Performance Boost, Vercel Queues in Dev"
description: "The May 22 Nitro v3 beta ships build-time route handler tracing, a VFS-backed dynamic code cache for faster dev-server restarts, and Vercel queue support accessible in local development — alongside the security patches from the prior beta."
date: 2026-06-03
image: "https://ts.news/images/nitro-og.png"
author: lschvn
tags: ["TypeScript", "Nitro", "Server", "Framework", "Vue", "Nuxt", "Vercel", "Performance"]
tldr:
  - Nitro now wraps every route handler with tracing spans at build time, giving request-span observability without an OpenTelemetry SDK setup
  - VFS caching of nitro app dynamic code cuts dev-server restart time significantly by avoiding full re-evaluation of the internal module graph
  - The Vercel preset now exposes queues locally via `vercel dev`, letting developers iterate on queue handlers without deploying
  - Two security patches from v3.0.260429-beta close a proxy request-smuggling and an open-redirect vulnerability (GHSA-5w89-w975-hf9q, GHSA-9phm-9p8f-hw5m)
faq:
  - q: "How does build-time tracing differ from runtime OpenTelemetry integration?"
    a: "Nitro's tracing channels are emitted at the framework layer — spans for route handling, cache operations, and database queries are generated directly in Nitro's internal code during the build phase. This means spans carry framework-level context (route name, handler duration, cache hit/miss) that a generic OpenTelemetry SDK would not produce without custom instrumentation. You still wire OpenTelemetry to receive the spans, but Nitro generates them automatically."
  - q: "What is the VFS dynamic code cache and who does it help?"
    a: "The VFS (virtual file system) cache stores the serialized state of Nitro's internal router and module registry. On subsequent dev-server restarts, Nitro loads this snapshot instead of re-evaluating every route handler and module import from scratch. For large applications with many routes and heavy dynamic imports, this shaves seconds off restart cycles during active development."
  - q: "How do Vercel queues work locally?"
    a: "The `vercel dev` command in Nitro's Vercel preset now detects queue handler definitions (`nitro.tasks`) and spins up a local Vercel Runtime emulator that processes queue jobs. You can enqueue work from a route handler using `@vercel/functions` and debug the full async flow — retries, dead-letter handling — before deploying."
---

Nitro v3.0.260522-beta dropped May 22, 2026, extending the v3 beta track that began in April. The release adds three features that together significantly improve the development experience for production-oriented server-side TypeScript applications: build-time tracing instrumentation, a VFS-backed dynamic code cache, and local Vercel queue emulation.

## Build-time route handler tracing

PR [#4240](https://github.com/nitrojs/nitro/pull/4240) introduces automatic tracing span wrapping around every Nitro route handler at build time. When a request hits a Nitro server, spans are emitted for each handler invocation with metadata including the route path, HTTP method, duration, and cache status. These spans integrate with OpenTelemetry-compatible receivers — you point your `OTEL_EXPORTER_OTLP_ENDPOINT` at a collector and get full request traces without writing a single line of instrumentation code.

This is distinct from the OpenTelemetry SDK approach: Nitro is emitting spans from within its own router, so the data includes Nitro-specific context (route name, storage cache hits, event timings) that generic HTTP middleware cannot provide.

## VFS caching for dynamic code

PR [#4251](https://github.com/nitrojs/nitro/pull/4251) introduces a VFS layer for Nitro's dynamic app code. Previously, a dev-server restart forced Nitro to re-evaluate the entire module graph — every route handler, every `useStorage()` call, every event hook. For applications with hundreds of routes or expensive initialization logic, this added seconds to every restart.

The new VFS cache serializes the resolved state of Nitro's internal registry after the first request is handled. Subsequent starts load from this cache, skipping the evaluation step. The cache is invalidated automatically when source files change. The improvement is most visible in large monorepos and Nuxt 3 applications using Nitro as the server layer.

## Vercel queues in local dev

The Vercel preset gains queue support in local development via `vercel dev` ([#4264](https://github.com/nitrojs/nitro/pull/4264)). Queue handlers defined with `nitro.tasks` are now recognized and executed by a local Vercel Runtime stub during development. This means you can write a queue consumer, call it from a route handler using `@vercel/functions`, and debug the full async flow — including retries and dead-letter queue behavior — entirely locally.

```typescript
// tasks/send-email.ts
export defineTask(async ({ id, to, subject }) => {
  await sendEmail(to, subject);
  return { result: 'sent' };
});
```

```typescript
// routes/api/signup.ts
import { queue } from '@vercel/functions';

export default defineEventHandler(async (event) => {
  await db.createUser(await readBody(event));
  await queue('tasks/send-email', { to: 'user@example.com', subject: 'Welcome' });
  return { ok: true };
});
```

## Security patches from v3.0.260429-beta

Two vulnerabilities patched in the prior beta (v3.0.260429-beta) are also present in earlier releases and users are strongly encouraged to upgrade:

- **GHSA-5w89-w975-hf9q**: Proxy route rules could be bypassed via malformed request paths, allowing requests to reach back-end services that should have been excluded by route rules.
- **GHSA-9phm-9p8f-hw5m**: Open redirect via protocol-relative URL in redirect route rules. An attacker could craft a redirect target that navigates off-domain.

## AWS Amplify supports Node.js 24

The AWS Amplify preset now ships with Node.js 24 runtime support ([#4245](https://github.com/nitrojs/nitro/pull/4245)). The preset was updated to use the new Amplify Node.js 24 handler interface, so existing Amplify deployments can bump their Nitro runtime to Node 24 without configuration changes.

Nitro v3.0.260522-beta is available on npm as `nitro@3.0.0-260522-beta`. The v3 beta track is considered stable for most workloads; the team is targeting a stable v3.0 release in the coming weeks.
