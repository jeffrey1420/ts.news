---
title: "OpenCode Desktop Drops Tauri for Electron: A Pragmatic Choice for a TypeScript-First AI Coding Agent"
description: "OpenCode, the open source AI coding agent with 145K GitHub stars, has rebuilt its Desktop app on Electron after concluding that WebKit performance and bundled CLI startup issues made Tauri a poor fit for its all-TypeScript architecture."
date: 2026-04-19
image: "https://repository-images.githubusercontent.com/975734319/2c2c3389-c647-405c-a499-f80e4d521277"
author: lschvn
tags: ["TypeScript", "AI", "Electron", "Tauri", "OpenCode"]
tldr:
  - "OpenCode Desktop is switching from Tauri to Electron, citing WebKit rendering inconsistencies and performance gaps compared to Chromium across macOS and Linux"
  - "The move also eliminated a bundled CLI that added startup latency and occasional failures, allowing the server to run directly in Electron's Node process"
  - "Plugins relying on Bun-specific APIs will break in the new Electron builds; the team promises more details with OpenCode 2.0"
faq:
  - "Q: Why did OpenCode drop Tauri?
A: Tauri's reliance on WebKit (rather than Chromium) caused rendering inconsistencies and slower performance. OpenCode's TypeScript-first architecture also meant the bundled CLI negated many of Tauri's Rust-based performance benefits."
  - "Q: Does this mean Tauri is worse than Electron?
A: No. The OpenCode team explicitly states that Tauri is still excellent for apps where native performance matters or that can fully leverage Rust. Electron simply fit OpenCode's use case better."
  - "Q: What happens to Bun users?
A: The Electron version drops Bun-specific API support. Plugins using Bun-only APIs will not work in the new Desktop versions."
---

## TypeScript All the Way Down

OpenCode is an open source AI coding agent built entirely in TypeScript. Its architecture follows a client-server model where the TUI, web UI, and desktop clients all communicate with a central server that handles LLM interactions, agent loops, and an SQLite database. This means a running server process is always required — which is what the Desktop app has always been wrapper around.

The initial Desktop build used Tauri, chosen for its lightweight profile as a thin webview container. On startup, it would launch the bundled CLI via `opencode serve`, giving the web UI a local server to connect to. It worked, but over time two problems compounded.

## The WebKit Problem

Tauri uses the system WebView on macOS and Linux — WebKit on those platforms, and WebView2 on Windows. The OpenCode team found that WebKit not only renders their UI with worse performance than Chromium, but also produces minor visual inconsistencies between platforms. For an application used daily by developers who switch between operating systems, consistency matters.

> "Tauri has an ongoing effort to support Chromium via CEF instead of the system webview, but when that will be stable remains uncertain."

There is an active Chromium Embedded Framework (CEF) effort inside Tauri, but no firm timeline for stabilization. OpenCode couldn't wait.

## The Bundled CLI Tax

The second issue was the bundled CLI itself. The OpenCode server code originally relied on Bun-specific APIs, which meant bundling the Bun CLI inside Tauri. This had two consequences: slower startup times, and occasional failures on Windows that the team spent significant effort working around.

When OpenCode decided to move away from Bun-specific APIs anyway (in favor of Node compatibility), the appeal of bundling an entire CLI disappeared. Electron's built-in Node process could simply run the server directly — no subprocess, no extra binary, no startup tax.

## What Changes and What Doesn't

OpenCode Desktop will soon ship the Electron build as the default for direct downloads and beta-channel updates, eventually moving general releases over as well. The underlying server still runs TypeScript — it just now executes inside Electron's Node process rather than a bundled external binary.

The team is straightforward about the tradeoff: plugins that depend on Bun-specific APIs will not work in the Electron builds. A full explanation is promised with OpenCode 2.0.

## Not a Judgment on Rust or Tauri

The OpenCode team took care to frame this as a use-case-driven decision, not a value judgment on Tauri or Rust. Tauri excels when an application's core logic lives in Rust and the webview is genuinely lightweight — as was the case with a previous video encoding project the author worked on. OpenCode's logic, however, is all TypeScript, meaning Rust's advantages never applied to the compute-heavy part of the stack.

> "If you're building an app with a simpler UI that demands native performance or easy access to system APIs, I think Tauri is still a great fit."

The Electron beta is available now via the [opencode-beta GitHub repo](https://github.com/anomalyco/opencode-beta).
