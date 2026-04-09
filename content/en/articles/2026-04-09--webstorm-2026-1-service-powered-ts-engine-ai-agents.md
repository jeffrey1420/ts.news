---
title: "WebStorm 2026.1 Ships Service-Powered TypeScript Engine and a Full AI Agent Roster"
description: "JetBrains' March release turns on a service-based TypeScript engine by default, puts Junie, Claude Agent, Codex, and Cursor in the AI chat sidebar, sunsets Code With Me, and adds native Wayland support on Linux."
image: "https://blog.jetbrains.com/wp-content/uploads/2026/03/WS-releases-BlogSocialShare-1280x720-1.png"
date: "2026-04-09"
category: IDE
author: lschvn
readingTime: 5
tags: ["webstorm", "jetbrains", "TypeScript", "IDE", "AI", "AI-agents", "release"]
tldr:
  - "WebStorm 2026.1 enables the service-powered TypeScript engine by default, reducing CPU usage and improving responsiveness in large projects without changing how you work."
  - "The AI chat now surfaces Junie, Claude Agent, Codex, Cursor, and GitHub Copilot via the new ACP Registry — install any agent in one click without leaving the IDE."
  - "Next edit suggestions are available without consuming your AI quota, extending traditional code completion to intelligently propagate related changes across an entire file."
  - "Code With Me is being sunset in 2026.1 — JetBrains calls out declining demand and is directing users toward more modern collaborative workflows."
faq:
  - q: "What does 'service-powered TypeScript engine' mean?"
    a: "WebStorm now delegates TypeScript parsing, type checking, and language services to an external process rather than running them in the main IDE thread. The result is lower CPU usage and faster responsiveness in large monorepos. It was opt-in before; it's on by default in 2026.1."
  - q: "Is Cursor actually available inside WebStorm now?"
    a: "Cursor joined the ACP Registry in March 2026, which means its agent capabilities can be accessed directly from WebStorm's AI chat panel via the Agent Client Protocol. This is different from running Cursor as your primary IDE — it's more like adding Cursor's reasoning model as a backend to WebStorm's chat."
  - q: "What happened to Code With Me?"
    a: "JetBrains is sunsetting Code With Me, its pair programming and collaborative coding service, starting with 2026.1. It will be unbundled from all JetBrains IDEs and moved to JetBrains Marketplace as a separate plugin. 2026.1 is the last IDE version to officially support it."
  - q: "Does this release support TypeScript 6?"
    a: "Yes. WebStorm 2026.1 aligns with TypeScript 6's changed defaults for the `types` value and `rootDir`, and已经开始 preparing for TypeScript 7's changes to `baseUrl` handling."
---

WebStorm 2026.1 landed in March with a release that tightens the bond between the IDE and the tools developers actually use every day. The headline is a more efficient TypeScript engine by default, but the more visible change for many will be what's in the AI chat sidebar.

## Service-Powered TypeScript Engine, On by Default

The most technically significant change in 2026.1 is the service-powered TypeScript engine flipping from opt-in to default. Large TypeScript codebases put constant pressure on editors — type checking, navigation, and refactoring all compete for CPU in the main IDE thread. The service-based engine offloads that work to a separate process, keeping the UI snappier without changing how code is written or how errors are displayed.

WebStorm also now shows inlay hints from the TypeScript Go-based language server directly in the editor, if you're running it. And with TypeScript 6 shipping around the same time, the team aligned the editor's defaults with TS6's changed `types` value and `rootDir` behavior, and started preparing for TypeScript 7's `baseUrl` changes.

String-literal import and export specifiers are now fully understood by the parser and navigator:

```typescript
export { a as "a-b" };
import { "a-b" as a } from "./file.js";
```

Highlighting, go-to-definition, and rename refactoring all work correctly on the aliased names.

## AI Chat Gets a Full Agent Roster

JetBrains introduced an AI chat panel several releases ago. In 2026.1 it's now an agent hub. The ACP Registry — a marketplace within the IDE — lets you install agents in one click. The list already includes Junie (JetBrains' own agent), Claude Agent, Codex (OpenAI's coding model), Cursor, and GitHub Copilot, with more to come.

The practical benefit: you can switch between different agents depending on the task — Codex for certain code generation tasks, Claude for reasoning-heavy work, Cursor's model for others — without leaving the editor. JetBrains calls this the Agent Client Protocol (ACP), and it's designed to be open, so the roster should grow through the year.

## Next Edit Suggestions, Without AI Quota

Code completion in 2026.1 gets a meaningful upgrade. Next edit suggestions go beyond single-token completion: they intelligently apply related changes across the entire file when you press Tab. The example JetBrains gives is updating a function signature — instead of only changing the declaration, it propagates the change to all call sites in the same file.

Crucially, these suggestions don't consume your AI quota on JetBrains AI Pro, Ultimate, or Enterprise subscriptions. They're a Tab Tab experience that stays local.

## Framework Updates

WebStorm 2026.1 brings support for new React directives (`use memo`, `use no memo` alongside the existing `use client` and `use server`), Angular 21's full template syntax (arrow functions, `instanceof`, regex literals, spread), and updated Vue TypeScript integration via `@vue/typescript-plugin 3.2.4`.

Svelte generics in `<script>` tags now work with usage search, declaration navigation, and rename refactoring. The Astro language server accepts JSON configuration directly from the IDE settings. And CSS color swatches now preview the `color()` function and extended CSS color spaces.

## Code With Me Is Done

JetBrains is sunsetting Code With Me, its in-IDE pair programming service. The company cites declining demand and a shift toward "modern workflows tailored to professional software development." Starting with 2026.1, Code With Me is unbundled from all JetBrains IDEs and moves to the Marketplace as a standalone plugin. 2026.1 is the last IDE version to officially ship it.

## Wayland by Default on Linux

WebStorm now runs natively on Wayland by default on Linux, replacing X11 as the default display server. The benefit is sharper HiDPI rendering and better input handling. The IDE falls back to X11 automatically in environments where Wayland isn't available.

PowerShell users also get in-terminal completion for subcommands and parameters, joining Bash and Zsh where this feature already existed.

WebStorm 2026.1 is available via the Toolbox App or direct download from jetbrains.com/webstorm.
