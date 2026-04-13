---
title: "Bun v1.3.12 Ships Headless Browser Automation and Native Explicit Resource Management"
description: "Bun's latest release adds WebView for headless browser automation, lands TC39's using/await using in JavaScriptCore, and delivers a 2.3x speedup to URLPattern."
date: 2026-04-13
image: "https://bun.com/og/blog.png"
author: lschvn
tags: ["bun", "javascript", "typescript", "runtime", "browser-automation"]
---

Bun v1.3.12 landed April 10 with one of the most ambitious feature sets in recent releases. Two standouts reshape what a JavaScript runtime can do out of the box: native headless browser automation and native support for the TC39 Explicit Resource Management proposal. Here's what changed.

## Bun.WebView — Headless Browser Automation Built In

The headline feature is `Bun.WebView`, a headless browser automation API shipped directly in the runtime. No Puppeteer, no Playwright dependency — just a first-party API with two backends:

- **WebKit** (default on macOS) — zero external dependencies, uses the system `WKWebView`
- **Chrome** (cross-platform) — drives Chromium via the DevTools Protocol, auto-detects installed browsers or accepts a custom path

Selector-based actions auto-wait for actionability (Playwright-style), meaning an element must be attached, visible, stable, and unobscured before a click fires. All input is dispatched as OS-level events with `isTrusted: true`.

```javascript
await using view = new Bun.WebView({ width: 800, height: 600 });

await view.navigate("https://example.com");
await view.click("a[href='/docs']");   // waits for actionability, native click
await view.scroll(0, 400);             // native wheel event, isTrusted: true

const title = await view.evaluate("document.title");
const png = await view.screenshot({ format: "jpeg", quality: 90 });
await Bun.write("page.jpg", png);
```

One browser subprocess is shared per Bun process; additional `Bun.WebView()` calls open tabs in the same instance. Raw Chrome DevTools Protocol calls are available via `view.cdp(method, params)` for advanced use cases.

## Native `using` and `await using` in JavaScriptCore

The TC39 Explicit Resource Management proposal — already available in TypeScript via downleveling — now works natively in Bun's JavaScriptCore engine. Over 1,650 upstream WebKit commits landed in this release, bringing the `using` and `await using` declarations as a first-class language feature.

```javascript
function readFile(path) {
  using file = openFile(path);   // file[Symbol.dispose]() called at end of block
  return file.read();
}

async function fetchData(url) {
  await using connection = await connect(url);  // [Symbol.asyncDispose]() awaited
  return connection.getData();
}
```

No transpilation step required. This aligns Bun with the native module graph and makes resource cleanup ergonomic without a utility wrapper.

## URLPattern — Up to 2.3x Faster

`URLPattern.test()` and `URLPattern.exec()` received a significant performance overhaul. The internal regex matching now calls the compiled regex engine directly instead of allocating temporary JavaScript objects per call, eliminating up to 24 GC allocations per invocation.

| Benchmark | Before | After | Speedup |
|---|---|---|---|
| `test()` match, named groups | 1.05 µs | 487 ns | **2.16x** |
| `test()` no-match | 579 ns | 337 ns | **1.72x** |
| `test()` match, simple | 971 ns | 426 ns | **2.28x** |
| `exec()` match, named groups | 1.97 µs | 1.38 µs | **1.43x** |

As a side effect, `URLPattern` internals no longer pollute `RegExp.lastMatch` or `RegExp.$N` — previously a subtle source of bugs in mixed codebases.

## In-Process Bun.cron() Scheduler

Bun.cron now has an in-process callback overload that runs a function on a cron schedule, complementing the existing OS-level variant that registers crontab/launchd/Task Scheduler entries. The in-process version is lighter, works identically across platforms, and shares state with the rest of the application directly.

Key guarantees: no overlap (the next fire is scheduled only after the handler settles), UTC scheduling, `--hot` safe (jobs clear before module graph re-evaluation), and disposable via `using`.

## Other Improvements

- **UDP socket fixes**: ICMP errors (port unreachable, host unreachable) are now surfaced through the error handler instead of silently closing the socket. Truncated datagrams are detectable via a new `flags.truncated` argument.
- **Unix domain socket lifecycle**: now matches Node.js — binding to an existing socket correctly returns `EADDRINUSE`, and `stop()` automatically cleans up the socket file.
- **Standalone executables on Linux**: `bun build --compile` now embeds the module graph via an ELF `.bun` section instead of reading from `/proc/self/exe`, fixing binaries with execute-only permissions.
- **SIMD optimizations**: `Bun.stripANSI`, `Bun.stringWidth`, and shared ANSI helpers received SIMD acceleration (4×-unrolled prologue, bulk CSI/OSC skips), with up to ~4× improvement on plain ASCII input.
- **JIT improvements**: faster tier-up for stable functions, `Array.isArray` as a JIT intrinsic, optimized `String#includes`, and improved BigInt arithmetic.

Upgrade with `bun upgrade` or install from [bun.sh](https://bun.sh).

{tldr}
- Bun.WebView brings headless browser automation with WebKit and Chrome backends, no external dependencies — native clicks, scrolls, screenshots, and CDP access in a single API
- TC39's `using`/`await using` (Explicit Resource Management) is now natively supported in JavaScriptCore, eliminating the need for TypeScript downleveling for resource cleanup
- URLPattern operations are up to 2.3× faster thanks to direct regex engine calls and elimination of 24 GC allocations per call
{/tldr}
