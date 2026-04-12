---
title: "Node.js 25.9: The stream/iter API Finally Lands as Experimental"
description: "Node.js 25.9 adds an experimental stream/iter module for async iteration over streams, a --max-heap-size CLI flag, AsyncLocalStorage with using scopes, TurboSHAKE crypto, and an upgraded npm 11.12.1. Here's what each change means for your code."
image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=630&fit=crop"
date: "2026-04-12"
category: Runtimes
author: lschvn
readingTime: 5
tags: ["Node.js", "JavaScript", "streams", "async-iteration", "performance", "CLI", "crypto", "npm"]
tldr:
  - "stream/iter is the new experimental module enabling for-await-of loops over any readable stream — replacing Readable.from() hacks and giving streams a native async iteration interface."
  - "--max-heap-size lets you set a hard ceiling on V8's heap per process via CLI flag, solving a longstanding gap for containerized Node.js workloads that need predictable memory bounds."
  - "AsyncLocalStorage now supports 'using' scopes — a pattern borrowed from C#'s IDisposable, ensuring resources are deterministically cleaned up when a scope exits, even on error."
faq:
  - q: "How does stream/iter differ from the existing Readable.from() approach?"
    a: "Readable.from(iterable) wraps an iterable into a Readable stream, but it's designed for creating streams, not consuming them. stream/iter provides stream.iter(readable) and stream.consume(readable) — functions for reading from and iterating over an existing stream using standard async iteration syntax. It's the missing primitive that makes stream programming composable with JavaScript's native iteration protocols."
  - q: "What is the 'using' scope syntax in AsyncLocalStorage?"
    a: "The using keyword (from ECMAScript Explicit Resource Management stage 3 proposal) calls a [Symbol.dispose]() method when a block exits — whether normally or via throw. Node.js 25.9 adds using scopes to AsyncLocalStorage, meaning you can bind an AsyncLocalStorage instance to a scope so it is automatically cleared when the scope exits, without explicit try/finally cleanup. This pattern eliminates a class ofAsyncLocalStorage memory leaks in long-running servers."
  - q: "What is --max-heap-size and when would I use it?"
    a: "--max-heap-size sets a maximum V8 heap size in megabytes. It's a CLI flag passed at process start: node --max-heap-size=512 server.js. In containerized environments (Docker, Kubernetes), setting a hard memory ceiling helps the orchestrator kill OOM processes cleanly rather than letting the OS's OOM killer act unpredictably. It also prevents runaway memory growth from causing cascading failures in production."
  - q: "What are TurboSHAKE and KangarooTwelve?"
    a: "Both are cryptographic hash functions. TurboSHAKE is a high-speed variable-length hash function from the Keccak team (authors of SHA-3), designed for applications that need fast hashing at high rates — streaming data, tree hashing, proof-of-work. KangarooTwelve is a faster variant of SHA-3 (SHA-3/128) with a 128-bit output, designed as a replacement for common-use SHA-256 calls where 256 bits is overkill. Node.js now exposes both via the WebCrypto API."
---

Node.js 25.9.0 dropped on April 1st with a batch of quality-of-life additions, several of which have been in the making for over a year. The headline features are the new experimental `stream/iter` module and the `--max-heap-size` CLI flag, but there's more worth knowing about.

## stream/iter: Async Iteration for Streams

The new `experimental/streams/iter` module (to be promoted to stable in a future release) adds two functions:

- `stream.iter(readable)` — returns an async iterator that yields chunks from a Readable stream
- `stream.consume(readable)` — creates a writable stream that drains a readable, useful for piping patterns

The practical effect is that you can now use `for await...of` directly over any Node.js Readable stream:

```javascript
import { iter } from 'node:experimental/streams/iter';
import { createReadStream } from 'node:fs';

for await (const chunk of iter(createReadStream('file.txt'))) {
  process(chunk);
}
```

This replaces the `Readable.from()` workaround that many developers used to bridge streams and async iterables. `Readable.from()` was designed to create a stream from an iterable — using it as a stream consumer was always a hack. The new API makes the intent explicit and avoids the double-buffering overhead of the old pattern.

The `consume()` function is oriented toward transforming streams:

```javascript
import { consume } from 'node:experimental/streams/iter';
import { createReadStream, createWriteStream } from 'node:fs';

const writable = createWriteStream('output.txt');
await consume(createReadStream('input.txt')).pipe(writable);
```

James M Snell, who implemented the feature, also added benchmarks in the same PR — the API is designed to have minimal overhead compared to manual stream consumption.

## --max-heap-size: Hard Memory Bounds

Node.js processes have always been subject to V8's heap limits, but setting them required either environment variables (`--max-old-space-size`) or programmatic APIs. `--max-heap-size` is a straightforward CLI flag:

```bash
node --max-heap-size=512 server.js
```

Unlike `--max-old-space-size`, which controls only the old generation, `--max-heap-size` applies to V8's total heap including code generation and new generation. This makes it more predictable for containerized workloads where you want a hard memory ceiling that the orchestrator can rely on.

The flag was contributed by tannal and had been in discussion for several years before landing.

## AsyncLocalStorage Gets Using Scopes

AsyncLocalStorage has been a staple for request-scoped context in web frameworks since Node.js 16. The new addition is support for `using` scopes — based on ECMAScript's Explicit Resource Management stage 3 proposal (the `Symbol.dispose` pattern).

The `using` keyword calls a [Symbol.dispose]() method when a block exits, whether normally or via an error. With the new API, you can bind an AsyncLocalStorage instance to a scope:

```javascript
import { AsyncLocalStorage } from 'node:async_hooks';

const storage = new AsyncLocalStorage();

{
  using scope = storage.enable();
  storage.run({ requestId: 'abc123' }, () => {
    // storage.get() returns { requestId: 'abc123' }
  });
}
// storage is automatically cleared when scope exits
```

This eliminates the need for explicit try/finally cleanup in many patterns. In high-throughput servers that create many short-lived storage instances, using scopes prevent the AsyncLocalStorage store from growing unboundedly.

## Crypto: TurboSHAKE and KangarooTwelve

The `crypto` module gains two new hash functions via WebCrypto integration:

- **TurboSHAKE** — variable-length output, suitable for streaming and tree hashing applications
- **KangarooTwelve** — fast 128-bit hash, a SHA-3 derivative designed as a faster alternative to SHA-256 for everyday use cases

These are available through the standard WebCrypto `SubtleCrypto.digest()` interface under their respective algorithm names.

## Other Notable Changes

- **Test runner mocking consolidated**: `MockModuleOptions.defaultExport` and `MockModuleOptions.namedExports` merged into a single `MockModuleOptions.exports` option, with an automated codemod available
- **npm upgraded to 11.12.1**: includes the latest npm features and security fixes
- **SEA code cache for ESM**: Single Executable Applications now support code caching for ESM entry points, improving startup time for bundled Node.js applications
- **module.register() deprecated**: the legacy module registration API is now formally deprecated (DEP0205)

Node.js 25 is the current unstable version line; Node.js 24 will become the next LTS candidate later this year. Most of these features will backport to LTS lines as they stabilize.
