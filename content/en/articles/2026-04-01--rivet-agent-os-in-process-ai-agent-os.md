---
title: "Rivet Agent OS: The In-Process OS That Runs AI Agents 500x Cheaper Than Sandboxes"
description: "YC and a16z-backed Rivet built an agent runtime on V8 isolates and WebAssembly that cold-starts in 4.8ms — 92x faster than E2B, at 1/17th the cost. We deeply researched the architecture, the benchmarks, and what it means for every agent framework."
date: 2026-04-01
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop"
author: lschvn
tags: ["AI agents", "Rivet", "WebAssembly", "V8", "sandbox", "infrastructure", "open source"]
readingTime: 9
tldr:
  - "Rivet Agent OS runs AI agents in 4.8ms cold start — 92x faster than E2B sandboxes at 1/17th the cost, powered by V8 isolates and WebAssembly."
  - "Built by YC W23 + a16z backed founders on game-infrastructure DNA, agentOS is literally an in-process OS kernel: virtual filesystem, process table, pipes, PTYs, and network stack."
  - "Apache 2.0 open source + $20/mo cloud tier. Primary buyer: backend engineers at startups building AI agent features — not solo devs."
faq:
  - question: "How does agentOS achieve 92x faster cold starts than E2B?"
    answer: "agentOS uses V8 isolates — the same sandboxing technology in Chrome — running inside the host process. E2B boots a full Linux VM. No VM to boot means p50 cold start of 4.8ms vs 440ms. Memory footprint drops to ~131MB vs ~1GB."
  - question: "Is agentOS a replacement for E2B or Daytona sandboxes?"
    answer: "No — and that's the point. agentOS explicitly offers a sandbox mounting extension so you can spin up E2B on demand when workloads need a real browser or native binaries. agentOS wins for the 80% of agent tasks that don't need a full OS."
  - question: "ACP vs MCP — which protocol wins?"
    answer: "MCP (Anthropic) has overwhelming mindshare and adoption. ACP (Agent Communication Protocol) is architecturally superior — it defines sessions, transcripts, reconnection, and universal agent formats. Think LSP (language servers) — it took 10 years to win despite being obviously right. ACP is early."
  - question: "Should startups adopt agentOS today?"
    answer: "For production agent features: yes if you're a backend/platform engineer building in Node.js. For general use: it's beta, only Pi agent is production-ready, and there's no third-party security audit yet. The architecture is sound; the ecosystem is nascent."
  - question: "What can't agentOS do?"
    answer: "No browser automation (needs a real OS for that), no GPU workloads, no native Linux binaries outside WASM targets, no macOS/Windows agents. The WASM POSIX layer is partial — git and make are planned but not yet shipped."
---

We were running full Linux virtual machines to run AI agents. Then someone realized we had been doing it wrong.

For the past two years, the standard answer to "how do you run a coding agent securely?" has been: spin up a cloud VM, boot Linux, start a shell session, run your agent. E2B. Daytona. Modal. Every agent framework defaulted to the same mental model as deploying a web server — a full operating system, a full filesystem, syscalls going to a real kernel, all for an agent that spends 95% of its time waiting for an LLM to respond.

Rivet's answer is different. Much different.

## What Is agentOS?

agentOS is an **in-process operating system kernel written in JavaScript**, running inside a Node.js host process. That's not marketing language — it's a precise description of the architecture.

The kernel manages:
- A **virtual filesystem** with mount drivers (S3, SQLite, host directories, in-memory)
- A **process table** tracking child processes, PIDs, exit codes
- **Pipes and PTYs** for inter-process communication
- A **virtual network stack** with programmable allow/deny/proxy rules

Into this kernel, three runtimes are mounted:

**1. V8 isolates for agent code.** The agent (Pi, Claude Code, Codex — coming soon) runs in a V8 JavaScript context. This is the same isolation technology Chrome uses to sandbox every browser tab. Each isolate has its own heap and stack, no shared state, deny-by-default permissions for filesystem, network, and process access. Cold start is ~4–6ms because you're not booting anything — you're just creating a new JavaScript context inside an already-running V8 engine.

**2. WebAssembly for POSIX utilities.** GNU coreutils, grep, sed, gawk, curl, jq, ripgrep, sqlite3, and 80+ other Unix commands compiled from C and Rust to WebAssembly. They run in a WASM runtime managed by the kernel — not in V8. The agent talks to them over a virtual PTY, just like a shell.

**3. Sandbox extension for heavy workloads.** When you genuinely need a real browser, native Linux binaries, or GPU access, agentOS can mount an E2B or Daytona sandbox on demand and expose it as part of the virtual filesystem tree. This is the hybrid model: lightweight fast agents for the 80% of tasks that don't need a full OS, full sandboxes when you do.

### Host Tools: The Integration Pattern That Matters

The "host tools" model is agentOS's most underrated feature. Your backend exposes JavaScript functions to the agent as if they were CLI commands:

```typescript
const weatherToolkit = toolKit({
  name: "weather",
  tools: {
    get: hostTool({
      description: "Get weather for a city.",
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ temperature: 18, conditions: "partly cloudy" }),
    }),
  },
});
```

The agent calls `agentos-weather get --city London`. No HTTP. No auth headers. No network hop. The kernel bridges directly to your Node.js function. This is the right model for backend integration.

### ACP: LSP for Agents

The Agent Communication Protocol (ACP) is a standardized protocol for editor-agent communication — modeled explicitly on how the Language Server Protocol (LSP) decoupled language servers from IDEs. ACP defines sessions, transcripts, reconnection logic, and universal agent formats. If it wins, agents become portable across editors (Cursor, VS Code, etc.) and editors gain access to the full ACP agent ecosystem. The parallel to LSP is apt: it took a decade for LSP to win despite being obviously right. ACP is early.

## The Numbers

All benchmarks below are from Rivet's own materials. The secure-exec library benchmarks (the most granular layer) are independently reproducible — Rivet publishes the scripts. Everything else is self-reported.

| Percentile | agentOS | E2B (fastest sandbox) | Speedup |
|---|---|---|---|
| Cold start p50 | 4.8 ms | 440 ms | **92x** |
| Cold start p95 | 5.6 ms | 950 ms | **170x** |
| Cold start p99 | 6.1 ms | 3,150 ms | **516x** |

Memory per instance: **~131MB** (full coding agent) vs **~1,024MB** (Daytona). Simple shell: **~22MB** vs ~1GB.

Self-hosted cost on Hetzner ARM: **$0.0000011/second**. Compare that to Daytona at $0.0504/vCPU-hour: **17x cheaper**. At full self-hosted utilization, the economics are in a different league.

These are the self-hosted numbers. Rivet Cloud starts at **$20/month** for the managed tier.

## Competitive Landscape

agentOS is not competing with Modal (serverless GPU, a different problem), and it's not really competing with E2B or Daytona — it's designed to complement them. The sandbox mounting extension makes the relationship explicit: you use agentOS for lightweight work, spin up a sandbox when you need one.

Real competition: Lambda (poor fit for agents — 100ms+ cold starts, no agent primitives, 15-minute execution limits), Cloudflare Workers AI (inference only, not an agent runtime).

**Primary buyer:** Backend and platform engineers at startups building AI agent features who need fast, cheap, embeddable agent infrastructure inside their Node.js backend. Not solo developers (though the free Apache 2.0 tier is real), and not enterprises needing HIPAA or SOC 2 — agentOS doesn't have those certifications yet.

## The Company

Rivet Gaming, Inc. — YC W23 + a16z Speedrun SR002 backed. Founders Nathan Flurry and Nicholas Kissel. Flurry previously built infrastructure for games serving 15M+ MAU and 20k concurrent players. The game-server DNA shows: this is infrastructure thinking applied to agents — cost at scale, fast execution, minimal overhead.

The foundational sandboxing library, **secure-exec**, is open source separately. **Rivet Cloud** offers managed hosting (free 100k actor-hours/month, paid from $20/month). YC and a16z Speedrun companies get 50% off for 12 months.

## Implications

If agentOS delivers on its numbers at scale, every sandbox provider faces pressure. The execution substrate for a simple agent task — file operations, API calls, scripting — can drop from roughly $0.05/vCPU-minute to $0.0000011/second. That's a 500x cost reduction for the runtime, not the LLM.

For OpenClaw, Hermes, and every agent framework: the V8 isolate + virtual FS architecture is the thing to watch. Even if you don't adopt agentOS directly, the "host tools" pattern (direct function calls, no HTTP auth), the actor-per-session model, and the hybrid sandbox approach are architectural ideas worth absorbing.

ACP vs MCP is a separate and longer-running battle. MCP has the mindshare. ACP is architecturally cleaner. The LSP parallel is worth remembering — the right answer doesn't always win on day one.

## Caveats

This is beta. Only the **Pi agent** is production-ready today; Claude Code, Codex, OpenCode, and Amp are listed as coming soon. No third-party security audit has been published. The WASM POSIX layer is partial — git and make are planned but not shipped. GitHub has 1,576 stars, which is modest. The architecture is sound; the ecosystem is nascent.

The image that opens this article is a circuit board. It felt appropriate: agentOS is infrastructure for people who care about what's under the hood.
