---
title: "Deno 2.7 Stabilizes the Temporal API, Adds Windows ARM Support and npm Overrides"
description: "Deno 2.7 is a substantial mid-cycle release: the Temporal API is now production-ready, native Windows on ARM builds land, npm overrides work like in Node, and dozens of Node.js compatibility improvements land across worker_threads, child_process, zlib, and sqlite."
date: "2026-04-07"
image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop"
author: lschvn
tags: ["deno", "javascript", "typescript", "runtime", "temporal-api", "nodejs"]
---

Deno 2.7 dropped on February 25th, and it is one of the most feature-rich releases in the 2.x line. The headline items are Temporal API stabilization, official Windows on ARM builds, and npm `overrides` support — but the release also ships a significant batch of Node.js compatibility work that makes migrating existing projects easier.

[tldr]
- The TC39 Temporal API is now stable in Deno without the `--unstable-temporal` flag — Chrome 144 shipped it in January 2026, Deno follows
- Native Windows on ARM (aarch64-pc-windows-msvc) builds are now official: Surface Pro X, Snapdragon laptops, no emulation overhead
- npm `overrides` field in package.json now works, letting you pin transitive dependencies deep in the tree
- Dozens of Node.js compatibility fixes: worker_threads, child_process, zlib, sqlite all improved
- Deno Deploy reached general availability in the same cycle
[/tldr]

## Temporal API: Finally Stable

The [Temporal API](https://tc39.es/proposal-temporal/docs/) is TC39's long-awaited replacement for JavaScript's broken `Date` object. Deno 2.7 stabilizes it, making Deno one of the first runtimes to ship a production-ready implementation alongside Chrome 144 (January 2026).

```typescript
const today = Temporal.Now.plainDateISO();
const nextMonth = today.add({ months: 1 });

const meeting = Temporal.ZonedDateTime.from(
  "2026-03-15T14:30[America/New_York]",
);
const inTokyo = meeting.withTimeZone("Asia/Tokyo");
```

If you've been using the `--unstable-temporal` flag, remove it. This is now part of the stable API surface.

## Windows on ARM: The Last Platform Gap Closes

This has been a [long-requested feature](https://github.com/denoland/deno/issues/8422). Deno now ships official aarch64-pc-windows-msvc builds. Native performance on Surface Pro X, Lenovo ThinkPad X13s, and Snapdragon-powered laptops means no x86 emulation overhead for TypeScript compilation or any other Deno workload.

## npm Overrides: Pinning Transitive Dependencies

npm's `overrides` field lets you pin or replace packages deep in your dependency tree — useful for security patches on transitive deps or forcing compatibility. Deno's first-class package.json support now handles this:

```json
{
  "dependencies": {
    "express": "^4.18.0"
  },
  "overrides": {
    "cookie": "0.7.0",
    "express": {
      "qs": "6.13.0"
    }
  }
}
```

`cookie` is pinned to 0.7.0 everywhere; `qs` is only overridden when required by express. This pattern is common in npm-land for applying security patches without waiting for upstream releases.

## Node.js Compatibility: worker_threads and child_process

The Node.js compatibility layer continues to close gaps. Highlights from the worker_threads work:

- stdout is now forwarded to the parent process
- stdin support added
- `worker.terminate()` returns the correct exit code
- `process.exit()` in a worker immediately halts execution
- `ref()`/`unref()` is now idempotent like Node
- `worker.cpuUsage()` implemented

For `child_process`: stdio streams are now proper Socket instances, shell redirections work in exec, `fork()` accepts URL as modulePath, and `NODE_OPTIONS` is respected for `--require` and `--inspect-publish-uid`.

## Broader Deno Ecosystem News

This release cycle also saw Deno Deploy reach general availability (February 3rd) and the introduction of [Deno Sandbox](https://deno.com/blog/introducing-deno-sandbox) — instant Linux microVMs for running untrusted code with defense-in-depth security.

The Deno team also disclosed that Deno Deploy users were protected against two high-severity React Server Components / Next.js vulnerabilities in late 2025 (CVE-2025-55184 and the RCE in React Server Functions), with automatic mitigations deployed at the edge.

[faq]
- **Do I need to change my code for the Temporal API?** If you were using `--unstable-temporal`, remove that flag. The API is unchanged.
- **Can I run npm packages with Deno?** Yes — Deno has first-class package.json support and can run most npm packages directly.
- **What about Bun vs Deno?** Bun has historically had faster startup times. Deno's strength is its TypeScript-first approach, security model, and the Deno Deploy edge network.
- **Is Deno Deploy production-ready?** Yes — it reached general availability on February 3rd, 2026.
[/faq]
