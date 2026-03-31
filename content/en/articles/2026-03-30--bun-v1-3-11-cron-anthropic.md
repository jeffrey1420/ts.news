---
title: "Bun Ships v1.3.11 with Native OS-Level Cron and Joins Anthropic's AI Coding Stack"
description: "Bun v1.3.11 drops a 4MB smaller binary, ships Bun.cron for OS-level scheduled jobs, and marks a pivotal moment as the runtime joins Anthropic to power Claude Code and future AI coding tools."
image: "https://bun.com/og/blog.png"
date: "2026-03-30"
author: lschvn
tags: ["bun", "runtime", "javascript", "typescript", "ai", "anthropic", "news"]
tldr:
  - "Anthropic acquired Bun in December 2025 to power Claude Code; Bun stays MIT-licensed and open source with the core team intact."
  - "Bun v1.3.11 ships Bun.cron for cross-platform OS-level scheduled jobs (crontab/launchd/Task Scheduler), replacing node-cron."
  - "The Linux x64 binary is 4 MB smaller; Bun v1.3.10 added full TC39 standard ES decorators and a Zig-native REPL."
  - "Barrel import optimization in v1.3.10 cuts build times up to 2x for large libraries like antd and @mui/material."
---

The JavaScript ecosystem moves fast, but few releases in recent memory carry as much weight as what Jarred Sumner's Bun shipped this month. On March 18, 2026, Bun v1.3.11 landed with a mix of developer-experience improvements, performance wins, and a quiet acknowledgment of a major shift behind the scenes: **Bun has joined Anthropic**.

## The Elephant in the Room: Bun Joins Anthropic

First, the bigger story. In December 2025, Anthropic acquired Bun with a clear mandate: make Bun the infrastructure backbone of Claude Code, the Claude Agent SDK, and every future AI coding product the company builds. Claude Code already [ships as a Bun executable](/articles/claude-code-rise-ai-coding-tool-2026) to millions of users — and as Sumner put it in the acquisition post, "if Bun breaks, Claude Code breaks." Anthropic now has direct engineering incentive to keep Bun excellent.

The implications are significant. Bun stays MIT-licensed and open source, and the core team remains intact. But the roadmap now has a tighter focus: high-performance JavaScript tooling, Node.js compatibility, and becoming the default server-side runtime. The difference is that Anthropic's own tooling now depends on Bun surviving and thriving — a powerful alignment of interests.

## Bun v1.3.11: What's New

The March 18 release is packed. Here's what matters most for TypeScript and JavaScript developers:

### Bun.cron — OS-Level Scheduled Jobs, Natively

The headline feature of v1.3.11 is `Bun.cron`, a built-in API for registering OS-level cron jobs that works cross-platform (crontab on Linux, launchd on macOS, Task Scheduler on Windows).

```typescript
// Register a cron job
await Bun.cron("./worker.ts", "30 2 * * MON", "weekly-report");
```

```typescript
// worker.ts
export default {
  async scheduled(controller) {
    // controller.cron === "30 2 * * 1"
    await doWork();
  },
};
```

The API parses cron expressions natively — including named days (`MON–SUN`), nicknames (`@yearly`, `@daily`), and POSIX OR logic — and supports removing jobs programmatically. This replaces a whole category of `node-cron` and `cron` npm package usage, and it runs at the OS scheduler level rather than inside the Node.js event loop, making it far more reliable for production workloads.

### Bun.sliceAnsi — ANSI-Aware String Slicing

A new built-in replaces both the `slice-ansi` and `cli-truncate` npm packages. `Bun.sliceAnsi` slices strings by terminal column width while preserving ANSI escape codes (SGR colors, OSC 8 hyperlinks) and respecting grapheme cluster boundaries — emoji, combining marks, and flags are handled correctly.

```typescript
Bun.sliceAnsi("\x1b[31mhello\x1b[39m", 1, 4); // "\x1b[31mell\x1b[39m"
Bun.sliceAnsi("unicorn", 0, 4, "…"); // "uni…"
```

Under the hood, it uses a three-tier dispatch strategy: SIMD ASCII fast path, single-pass streaming for common cases, and a two-pass algorithm for negative indices.

### 4 MB Smaller on Linux x64

The Linux x64 binary is now 4 MB smaller. That's a meaningful improvement for CI/CD environments where every millisecond and megabyte counts.

## Bun v1.3.10: The Decorator and REPL Breakthrough

Landing just under the v1.3.11 release, the February 26 update brought two features that TypeScript developers in particular have been waiting years for.

### Full TC39 Standard ES Decorators

Bun's transpiler now fully supports **stage-3 TC39 standard ES decorators** — the non-legacy variant that activates when `experimentalDecorators` is *not* set in your `tsconfig.json`. This means code using modern decorator syntax — including the `accessor` keyword, decorator metadata via `Symbol.metadata`, and the `ClassMethodDecoratorContext` / `ClassFieldDecoratorContext` APIs — now works correctly out of the box.

```typescript
function logged(originalMethod: any, context: ClassMethodDecoratorContext) {
  const name = String(context.name);
  return function (this: any, ...args: any[]) {
    console.log(`Entering ${name}`);
    const result = originalMethod.call(this, ...args);
    console.log(`Exiting ${name}`);
    return result;
  };
}

class Example {
  @logged
  greet(name: string) {
    console.log(`Hello, ${name}!`);
  }
}
```

Auto-accessors with the `accessor` keyword — including on private fields — are supported, as are `addInitializer`, decorator metadata, and correct evaluation ordering. Legacy TypeScript decorators (`experimentalDecorators: true`) continue to work unchanged.

This has been one of the most requested features since 2023. Until now, Bun only supported the legacy decorator syntax, which meant that libraries targeting the TC39 spec — including `signal-polyfill` and Angular's upcoming rendering pipeline — either failed to parse or produced incorrect results.

### Native REPL Written in Zig

Bun's REPL was previously backed by a third-party npm package. v1.3.10 replaced it entirely with a Zig-native implementation that starts instantly with no package downloads. The new REPL ships with syntax highlighting, Emacs keybindings, persistent history, tab completion, multi-line input, and top-level `await` — all with proper `const`/`let` semantics that persist across lines.

### Barrel Import Optimization

When you `import { Button } from 'antd'`, the bundler traditionally has to parse every file that `antd/index.js` re-exports — potentially thousands of modules. Bun v1.3.10 detects pure barrel files and only parses the submodules you actually use. For large component libraries like `antd`, `@mui/material`, or `lodash-es`, this cuts build times up to 2x. It works automatically for packages with `"sideEffects": false`, or can be enabled explicitly via `optimizeImports` in `Bun.build()`.

### Other Notable Additions

- **`--compile --target=browser`** — produces self-contained HTML files with all JS, CSS, and assets inlined as data URIs
- **Windows ARM64 native support** — run Bun natively on Snapdragon Windows machines and cross-compile executables targeting `bun-windows-arm64`
- **Up to 25x faster `structuredClone`** for arrays via JSC upgrade
- **`Bun.JSON5` and `Bun.JSONL`** parsers built in

## What This Means for the Ecosystem

The Bun-and-Anthropic pairing is more than an acquisition — it's a statement of intent about where AI-assisted development is heading. The tools that write, test, and deploy code at scale are increasingly the same tools developers use to run their servers locally. Bun positioning itself as the "all-in-one" runtime (bundler, test runner, package manager, server runtime) makes it a natural fit for AI agents that need to execute code reliably across environments. For context on how Bun's performance compares to Node.js and Deno in independent benchmarks, see our [runtime showdown](/articles/bun-vs-node-vs-deno-2026-runtime-benchmark).

For TypeScript developers specifically, the full TC39 decorator support in v1.3.10 is a quiet but important unlock. The decorator proposal has been in stage 3 for over two years and is widely expected to reach stage 4 — and eventually land in the ECMAScript spec — in the near future. Bun's early support means you can start writing future-proof decorator-based code today.

Install or upgrade with:

```bash
bun upgrade
```

Or install from scratch at [bun.sh](https://bun.sh).
