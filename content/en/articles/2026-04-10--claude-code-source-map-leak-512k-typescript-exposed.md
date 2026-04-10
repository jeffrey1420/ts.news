---
title: "Claude Code's March 31 Slip: 512,000 Lines of TypeScript in an npm Package"
description: "On March 31, 2026, Anthropic accidentally shipped the complete TypeScript source code of Claude Code inside a public npm package. The 59.8 MB source map exposed the entire client-side agent harness — including an 'Undercover Mode,' 44 unreleased features, and a critical permission bypass vulnerability. Then came the DMCA takedowns."
date: 2026-04-10
image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["TypeScript", "AI", "security", "Anthropic", "Claude Code", "npm", "supply chain", "DMCA"]
readingTime: 7
tldr:
  - "Anthropic accidentally shipped a 59.8 MB source map in the @anthropic-ai/claude-code npm package on March 31, exposing 512,000 lines of unobfuscated TypeScript across 1,906 files."
  - "The leak revealed a permission bypass vulnerability (CC-643) that skipped deny-rule enforcement on command chains over 50 subcommands — Anthropic had a fix but hadn't shipped it to users."
  - "Anthropic's cleanup backfired: a DMCA takedown hit 8,100 GitHub repos, including legitimate forks of their own Claude Code repository."
faq:
  - question: "How did the Claude Code source leak happen?"
    answer: "Anthropic pushed v2.1.88 of @anthropic-ai/claude-code to npm on March 31, 2026. The package included a 59.8 MB JavaScript source map file — meant for development debugging — that shipped to production. The source map pointed to an unprotected archive on Anthropic's own Cloudflare R2 bucket, allowing anyone to download the complete unobfuscated TypeScript source."
  - question: "What was exposed besides source code?"
    answer: "Researchers found references to 44 unreleased features, including 'KAIROS' (a persistent background agent) and a 'Buddy System' Tamagotchi feature. An 'Undercover Mode' file instructed Claude Code to hide its AI identity when contributing to public open-source repositories. The three-layer self-healing memory architecture — which solves context entropy via autoDream consolidation — was also fully documented."
  - question: "What was the security vulnerability?"
    answer: "The leak exposed a known permission bypass flaw (ticket CC-643): when Claude Code encounters a compound command with more than 50 subcommands chained with && or ||, it stops checking each one against deny rules and just asks the user to approve. Anthropic had already built a tree-sitter parser fix internally but hadn't enabled it in public builds. A prompt injection attack via a malicious CLAUDE.md file could exploit this to run unrestricted commands. The flaw was patched silently in v2.1.90."
  - question: "Was customer data or API access compromised?"
    answer: "Anthropic confirmed no customer data, model weights, or API credentials were exposed. The leak was purely the client-side agent harness source code. However, a separate malicious axios package (v1.14.1 and v0.30.4) was published to npm in the same three-hour window, so users who installed Claude Code via npm during that period should audit their lockfiles."
  - question: "Why did the DMCA takedown cause more controversy?"
    answer: "Anthropic filed copyright takedown notices against approximately 8,100 GitHub repositories containing the leaked code — including legitimate forks of their own publicly released Claude Code repo. Developers whose projects were suddenly inaccessible pointed out the irony of an AI company trained on internet data enforcing copyright on its own accidentally-leaked code. Anthropic retracted the bulk of notices within hours, limiting action to one repo and 96 forks, and GitHub restored access."
---

On March 31, 2026, Anthropic pushed version 2.1.88 of `@anthropic-ai/claude-code` to npm. Within hours, 512,000 lines of TypeScript were mirrored across GitHub. Here's what actually happened — and what it means for the TypeScript ecosystem.

## The Chain of Events

The root cause appears to be a bug in Bun, the JavaScript runtime Claude Code is built on, that serves source maps in production mode even when they should be excluded from release builds. Anthropic included a 59.8 MB source map in the published npm package — a file meant strictly for development debugging.

Security researcher Chaofan Shou spotted it at 4:23 AM ET and posted a direct download link on X. The source map pointed to an unprotected Cloudflare R2 archive containing the complete, unobfuscated, fully-commented TypeScript source. Within two hours, GitHub repositories mirroring the code hit 50,000 stars — the fastest in the platform's history at that point.

Anthropic confirmed the leak to multiple outlets, attributing it to "a release packaging issue caused by human error, not a security breach."

## What the Code Revealed

Developers spent the following days poring over the exposed source. The most notable findings:

**44 Unreleased Features.** The code contained references to upcoming capabilities including KAIROS (a persistent background agent that runs indefinitely without human input), a "Buddy System" Tamagotchi feature with 18 species and rarity variants, and confirmation of the Capybara/Mythos model that had leaked separately days earlier.

**Undercover Mode.** A file named `undercover.ts` instructs Claude Code to hide its AI identity when operating in public open-source repositories. The code explicitly states: "Do not blow your cover." Users can force Undercover Mode on but cannot force it off — drawing immediate criticism from open-source communities with policies against undisclosed AI-generated contributions.

**Self-Healing Memory Architecture.** The leaked source revealed a three-layer memory system built around `MEMORY.md` as a lightweight pointer index. A background process called `autoDream` consolidates memory across sessions when four conditions are met: 24+ hours since last consolidation, at least 5 new sessions, no consolidation currently running, and 10+ minutes since the last scan. For developers building their own AI agents, this architecture is essentially a free masterclass in context management.

## The Vulnerability Anthropic Already Knew About

Days after the leak, security firm Adversa AI identified a critical flaw in Claude Code's permission system that had been documented internally as ticket CC-643.

The issue: when Claude Code encounters a compound command with more than 50 subcommands (chained via `&&` or `||`), it stops checking each subcommand against configured deny rules. Instead, it shows a generic approval prompt without indicating that security checks were bypassed.

The original reasoning was performance — analyzing every subcommand in a very long chain caused interface freezes. But this doesn't account for AI-generated commands from prompt injection, where a malicious `CLAUDE.md` file instructs Claude Code to generate a 50+ subcommand pipeline that looks like a legitimate build process.

The frustrating detail: Anthropic had already built a tree-sitter parser fix internally. It simply wasn't enabled in public builds. As of Claude Code v2.1.90, the vulnerability appears to have been patched — but the gap between having a fix and shipping it is what most alarmed security researchers.

## The DMCA Takedown Backfire

Anthropic's response compounded the damage. The company filed DMCA takedown notices with GitHub targeting approximately 8,100 repositories containing the leaked code — including legitimate forks of their own publicly released Claude Code repository.

Developers whose projects were suddenly inaccessible responded quickly on social media. The irony was not lost: a company whose AI models are trained on vast amounts of internet data was aggressively enforcing copyright on its own accidentally-leaked code.

Boris Cherny, Anthropic's head of Claude Code, acknowledged the overbroad takedowns were accidental and retracted the majority within hours, limiting action to one repository and 96 forks. GitHub restored access to affected projects.

## Action Items for Claude Code Users

If you installed Claude Code via npm on March 31 between 00:21 and 03:29 UTC:

1. Check your lockfiles (`package-lock.json`, `yarn.lock`, or `bun.lockb`) for malicious axios versions 1.14.1 or 0.30.4
2. Update to Claude Code v2.1.88 or later via the native installer (not npm)
3. Rotate your API keys as a precaution
4. Review `CLAUDE.md` files in any unfamiliar repositories before running Claude Code in them

For everyone: do not rely on Claude Code's deny rules as your sole security layer. The permission bypass vulnerability (now patched) demonstrates that "ask" fallback behavior without visible indication of skipped checks is insufficient against prompt injection attacks.
