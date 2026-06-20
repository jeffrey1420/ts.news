---
title: "Node.js 26.3.0: Buffer Pool Doubles, Permission API Gains drop(), Intel Macs at Risk"
description: "Node.js 26.3.0 lands with a doubled default Buffer.poolSize to 64 KiB, a new permission.drop() method for granular capability surrender, macOS universal binary warnings, and hardened WebCrypto. npm is bumped to 11.16.0."
date: 2026-06-03
image: "/images/heroes/2026-06-03--node-js-26-3-0-buffer-pool-permission-drop.png"
author: lschvn
tags: ["security", "runtimes", "typescript"]
tldr:
  - Buffer.poolSize default doubles from 32 KiB to 64 KiB, reducing allocator contention in high-throughput HTTP and I/O-heavy workloads
  - permission.drop() API lets running processes surrender granted permissions one at a time without exiting, enabling least-privilege patterns
  - macOS universal binary (Intel + Apple Silicon) may not be maintained for Node.js 26's full lifetime as Apple winds down x86 support
  - WebCrypto is hardened against prototype pollution and gains a CryptoJob mode; npm is updated to 11.16.0
faq:
  - question: "Why does Buffer.poolSize matter for application performance?"
    answer: "Buffer uses a slab allocator internally. A larger pool means fewer small allocations are served directly from the heap, reducing fragmentation and syscall overhead. Doubling the default from 32 KiB to 64 KiB helps most HTTP servers and streaming pipelines without requiring manual tuning."
  - question: "How does permission.drop() differ from the existing permission model?"
    answer: "Previously, Node.js permissions were all-or-nothing at startup. permission.drop() allows a running process to surrender specific permissions, such as file-system or environment access, while keeping others. This makes it possible to implement progressive privilege reduction, such as dropping fs access after an initialization phase."
  - question: "Will my Intel Mac still run Node.js 26?"
    answer: "Yes. Node.js 26 will ship universal binaries for now. The warning signals that if Apple continues deprecating x86 toolchain support, the Node.js project may drop Intel builds before Node.js 26 goes EOL. Apple Silicon (arm64) is now Tier 1; Intel is Tier 2."
---

[Node.js](/articles/2026-04-12--nodejs-25-stream-iter-async-streams) 26.3.0 landed June 1, 2026 on the Current release line. It is a substantial mid-cycle update: the Buffer allocator gets a meaningful tuning change, the experimental permission system gains its most-requested feature, Apple signals another step toward dropping Intel Macs, and the crypto team lands a multi-PR hardening of WebCrypto.

## Buffer.poolSize doubles to 64 KiB

The most impactful runtime change is the default `Buffer.poolSize` increase from 32 KiB to 64 KiB, contributed by Matteo Collina ([#63597](https://github.com/nodejs/node/pull/63597)). Node's internal slab allocator uses this pool for `Buffer.allocUnsafe()` and `Buffer.from()` calls that fall below the threshold. A larger slab reduces the rate at which the allocator must request new memory pages from the OS, cutting fragmentation and improving throughput for HTTP servers, streaming pipelines, and any code that allocates many small to medium buffers.

The change is not breaking, it only affects the default, and applications can still set `Buffer.poolSize` manually. But if you have been running benchmarks that benchmark the allocator itself, now is a good time to re-run them.

## permission.drop() for fine-grained privilege surrender

Rafael Gonzaga contributed `permission.drop()` ([#62672](https://github.com/nodejs/node/pull/62672)), the most-requested addition to Node.js's experimental permission system. The existing model granted capabilities at startup and held them for the process lifetime. `permission.drop()` lets running code surrender individual permission handles, file system, environment, child process, without exiting. This enables patterns such as:

```javascript
// After initialization, drop file-system access
permission.drop('fs');
// Only network access remains
```

The change brings Node.js closer to capability-based security models and reduces the blast radius of supply-chain or injection attacks where a compromised module loses its file-system grip after initialization completes.

## macOS universal binary warning

Antoine du Hamel's PR [#63055](https://github.com/nodejs/node/pull/63055) formally documents what the project has been signaling informally: the macOS universal binary, which packages both Intel (x64) and Apple Silicon (arm64) slices in a single binary, may not be maintainable for the full lifespan of Node.js 26. Apple has been progressively deprecating Intel toolchain support, and the Node.js build infrastructure is hitting friction keeping the x64 slice working. Intel-based Macs remain Tier 2; arm64 is Tier 1. This is a heads-up, not an immediate removal.

## WebCrypto hardening and npm 11.16.0

Filip Skokan led a multi-PR effort hardening WebCrypto ([#63363](https://github.com/nodejs/node/pull/63363)). Changes include:

- WebCrypto methods no longer use `async` wrappers internally, reducing overhead
- CryptoKey handles are now passed directly to KDF jobs instead of being serialized and deserialized
- A new CryptoJob mode aligns Node's WebCrypto implementation with the spec and improves performance
- The implementation is hardened against prototype pollution attacks targeting `CryptoKey` property definitions

npm is updated to 11.16.0 ([#63602](https://github.com/nodejs/node/pull/63602)), which includes dependency tree fixes and faster resolution. SQLite bundled with Node is updated with a cherry-pick addressing a memory corruption risk ([#63525](https://github.com/nodejs/node/pull/63525)).

The `http` module gains an `httpValidation` option ([#61597](https://github.com/nodejs/node/pull/61597)) that lets servers configure how strictly to validate incoming header values, defaulting to lenient behavior for backward compatibility. The inspector API also gains a `preciseCoverageStart` flag ([#63079](https://github.com/nodejs/node/pull/63079)) for more accurate code coverage instrumentation.

Node.js 26.3.0 is the Current (non-LTS) line. The LTS transition for Node.js 26 is expected with Node.js 26.9.0 in September 2026.
