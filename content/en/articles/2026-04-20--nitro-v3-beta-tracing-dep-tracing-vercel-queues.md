---
title: "Nitro v3 Beta Update: Built-in Tracing, Smarter Dep Tracing, and Vercel Queues"
description: "The April 2026 Nitro v3 beta update brings experimental tracing channels, full-trace dependency detection with native package awareness, Vercel queue support, and Tencent EdgeOne Pages deployment — alongside H3 v2 security and cookie improvements."
date: 2026-04-20
image: "https://ts.news/images/nitro-og.png"
author: lschvn
tags: ["TypeScript", "Nitro", "Server", "Framework", "Vue", "Nuxt", "Vercel"]
tldr:
  - Nitro v3 gains built-in tracing channel support for observability, and smarter dependency tracing that detects optional dependencies and native packages without manual configuration
  - Vercel preset now supports queues for async job processing and per-route function config overrides (memory, timeout, maxDuration)
  - Tencent EdgeOne Pages joins the deployment preset list, and H3 v2 brings stricter streaming body checks, RFC 6265bis cookie compliance, and path traversal protection
faq:
  - q: "How is Nitro v3's built-in tracing different from existing OpenTelemetry integrations?"
    a: "Nitro's tracing channels provide a lower-level, framework-native observability layer. Rather than wiring up a separate OpenTelemetry SDK, you get request-span tracing directly from Nitro's internals — spans for route handling, database queries, and cache operations are emitted automatically with no extra configuration."
  - q: "What native packages does traceDeps now detect automatically?"
    a: "traceDeps' full-trace mode uses an expanding native-packages database to identify optional dependencies that have pre-built binaries (like node-sqlite3, canvas, or sharp). If Nitro detects these in your dependency tree, it avoids bundling them incorrectly and ensures the correct binary gets deployed."
  - q: "How do Vercel queues work in Nitro?"
    a: "You define queue handlers using nitro.tasks in your Nitrose route file, deploy to Vercel, and use the Vercel SDK from your route handlers to enqueue work. The Vercel preset now handles the configuration and routing automatically, so you get durable async execution without a separate queue infrastructure."
---

Nitro v3's public beta continues to evolve rapidly. The April 15 update (v3.0.260415-beta) ships a set of developer-experience and production-readiness features that bring the v3 release closer to general availability.

## Built-in Tracing Channels

The headline addition is experimental tracing channel support ([PR #4001](https://github.com/nitrojs/nitro/pull/4001)). Nitro now emits structured trace spans for request lifecycle events — covering route matching, handler execution, cache hits and misses, and database query timing — directly from the framework's core. No OpenTelemetry SDK wiring required; tracing is a first-class Nitro feature.

This matters for teams running Nitro in production who want lightweight observability without instrumenting every route by hand. The trace output plugs into any OpenTelemetry-compatible collector.

## Smarter Dependency Tracing with Full-trace Mode

Nitro's `traceDeps` tool gets a meaningful upgrade ([PR #4175](https://github.com/nitrojs/nitro/pull/4175)). The new full-trace mode and custom trace options give developers control over how Nitro analyzes your dependency graph during the build.

The key practical improvement: the upstream `nf3` tracer now includes a growing native-packages database and automatic detection of optional dependencies. If your project uses packages with native binaries — `sharp` for image processing, `canvas`, `better-sqlite3`, or similar — Nitro can now detect these automatically and avoid incorrect bundling, which has been a common source of "works locally, breaks in production" errors.

This is particularly relevant for serverless deployments where the runtime environment differs from your local machine. Nitro can now reason about which dependencies need to stay out of the bundle and rely on the platform's installed packages instead.

## Vercel Queues and Per-route Function Config

The Vercel deployment preset gains two production features.

**Vercel Queues**: Nitro route handlers can now enqueue async work using Vercel's queue infrastructure. You define background task handlers with `nitro.tasks`, deploy to Vercel, and use the Vercel SDK from your route handlers. The preset handles configuration automatically. This brings durable async execution to Nitro without needing a separate queue infrastructure like BullMQ or SQS.

**Per-route function config override**: Individual routes can now override the default Vercel function configuration — memory limit, timeout, and `maxDuration`. This is useful when one specific route needs more resources than the rest of your application. Previously, you had to set function config globally or use workarounds.

## Tencent EdgeOne Pages Deployment

Nitro's deploy-anywhere promise adds another target: Tencent EdgeOne Pages. The new `edgeone-pages` preset uses the EdgeOne Pages Build Output API v3 and is documented at `nitro.build/deploy/providers/edgeone`. For teams targeting Chinese edge infrastructure, this is a direct deployment path without wrapping Nitro output manually.

## H3 v2 Security and Compatibility Fixes

The underlying H3 HTTP framework updates from rc.16 to rc.20 in this release, bringing several important fixes:

- **Path traversal protection**: Double-encoded dot segments in URLs are now rejected before they reach your route handlers, closing a potential traversal vector in static file serving
- **Open redirect protection**: `redirectBack()` now validates that the redirect target doesn't use a protocol-relative path, preventing `//attacker.com` redirects
- **Stricter streaming body size checks**: Enforces stream-based content-length limits regardless of the `Content-Length` header, making streaming responses more predictable
- **Cookie RFC 6265bis compliance**: Cookie parsing and serialization now conform to the updated RFC, fixing edge cases with cookie limits and parsing behavior that differed across browsers
- **Unbounded chunked cookie count fix**: Prevents a DoS vector where an attacker could set an arbitrary number of cookies to overflow server-side storage

## ocache and unstorage Improvements

On the caching side, `ocache` gains cache invalidation via `handler.invalidate()` and multi-tier cache support — useful for implementing cache-aside patterns where you want to explicitly evict entries on demand. `unstorage` now proactively flushes expired memory entries rather than waiting for the next access, which reduces memory pressure for long-running Nitro processes.

## Documentation Additions

Nitro.build gains new guides for [OpenAPI](https://nitro.build/docs/openapi) and [WebSocket](https://nitro.build/docs/websocket) — both areas where Nitro has had support but lacked formal documentation. The OpenAPI guide covers automatic route documentation generation from Nitro's route metadata; the WebSocket guide shows how to set up WebSocket endpoints using Nitro's built-in support.

## The Bottom Line

The April beta update shows Nitro v3 maturing toward GA with production infrastructure features rather than just developer-facing ergonomics. The tracing channels, native dependency detection, and Vercel queue support are all targeted at teams running Nitro at scale. If you're deploying Nitro to Vercel, the queue support alone is worth evaluating.
