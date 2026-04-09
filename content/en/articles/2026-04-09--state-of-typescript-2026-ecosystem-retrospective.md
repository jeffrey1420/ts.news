---
title: "State of TypeScript 2026: GitHub's #1 Language, Project Corsa, and the Supply Chain Reckoning"
description: "A look back at the major events that reshaped TypeScript's position in the JavaScript ecosystem — from surpassing JavaScript on GitHub to npm supply chain compromises and the Go-based compiler rewrite targeting 10x faster builds."
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
date: "2026-04-09"
category: Ecosystem
author: lschvn
readingTime: 6
tags: ["TypeScript", "GitHub", "Project Corsa", "npm", "security", "ecosystem", "Go", "Node.js"]
tldr:
  - "TypeScript became GitHub's #1 language by contributor count in August 2025, reaching 2.6 million monthly contributors — a 66% year-over-year increase — in what GitHub called the most significant language shift in over a decade."
  - "Microsoft's Project Corsa, a native Go port of the TypeScript compiler, showed 10x build speedups in early benchmarks and is targeting TypeScript 7.0 as the first Go-based release."
  - "The npm ecosystem faced coordinated supply chain attacks (s1ngularity, debug/chalk, Shai-Hulud) and the React2Shell CVSS 10.0 vulnerability, forcing a security reckoning across the JS world."
  - "Node.js 22.18 stabilized native TypeScript execution via type stripping, enabling direct .ts file running without transpilation — a milestone that fundamentally bifurcates TypeScript into erasable syntax and runtime syntax."
faq:
  - q: "What is Project Corsa?"
    a: "Project Corsa is Microsoft's native port of the TypeScript compiler and language service from JavaScript to Go. Initial benchmarks showed the VS Code codebase compiling in 7.5 seconds versus 77.8 seconds with the current TypeScript compiler. TypeScript 6.0 is the last release on the old codebase; TypeScript 7.0 (expected mid-2026) is planned as the first Go-based release."
  - q: "What were the npm supply chain incidents in 2025?"
    a: "Three major incidents: s1ngularity, the compromise of the debug and chalk packages, and the Shai-Hulud attack. CISA issued an alert on the Shai-Hulud campaign in September 2025. The common thread was automated exploitation of maintainer authentication gaps and CI workflow vulnerabilities, leading to malicious code published under trusted package names."
  - q: "What does 'type stripping' mean for Node.js?"
    a: "Type stripping is a Node.js feature that enables running TypeScript files directly without transpilation. Node.js skips type syntax at runtime (types are erasable) but executes the runtime syntax like enums and namespaces. Node.js 22.18 stabilized this in late 2025, and it became fully stable in v25.2.0. It removes the need for ts-node or tsx in many workflows."
  - q: "What is React2Shell (CVE-2025-55182)?"
    a: "A critical remote code execution vulnerability in React Server Components (RSC) with a CVSS score of 10.0 — the maximum severity. It was discovered in Next.js applications using RSC and forced a broad security re-evaluation of full-stack JavaScript serialization models. React patched it in December 2025."
---

2025 was the year TypeScript stopped being a popular alternative and became the default language of the JavaScript ecosystem. That dominance brought new pressures: compiler performance bottlenecks, supply chain scrutiny, and security vulnerabilities that live at the intersection of types and runtime.

## TypeScript Becomes GitHub's #1 Language

In August 2025, GitHub reported that TypeScript had become the most-used language on the platform by monthly contributor count, with 2,636,006 contributors — a 66% year-over-year increase. GitHub called it the most significant language shift in more than a decade. JavaScript still leads by repository count, but the trajectory is clear: new projects increasingly default to TypeScript, and the tooling ecosystem has followed.

This milestone matters because it signals where the ecosystem's attention is. Framework defaults, CI templates, and scaffolding tools increasingly ship TypeScript configurations out of the box, which reinforces the cycle.

## Project Corsa: The Go Rewrite Arrives

Microsoft announced Project Corsa in early 2025: a native port of the TypeScript compiler and language service to Go. The goal is approximately 10x faster builds and near-instant incremental compilation. Initial benchmarks were stark — the VS Code codebase dropped from 77.8 seconds to 7.5 seconds to compile; Playwright dropped from 11.1 seconds to 1.1 seconds.

TypeScript 6.0, released in Q1 2026, is planned as the last major version on the current JavaScript-based compiler codebase. TypeScript 7.0 (targeted for mid-2026) is expected to be the first release built on the Go-based compiler. The transition won't be seamless — plugin authors using the Compiler API will need to audit compatibility with the new implementation — but the performance gains are significant enough that the ecosystem is expected to migrate quickly.

## Native TypeScript Execution in Node.js

Node.js 22.18 stabilized native TypeScript execution via type stripping. Instead of transpiling `.ts` to `.js` before running, Node.js now understands which TypeScript syntax is erasable (types, interfaces) and which is runtime (enums, namespaces) and handles the latter directly. The `--erasableSyntaxOnly` flag formalizes the constraint: code must not use runtime TypeScript constructs that can't be expressed in JavaScript.

For many projects, this eliminates `ts-node` and `tsx` as dev dependencies. For type-aware libraries, it means rethinking patterns like enum usage in favor of `as const` objects and ES modules.

## The Supply Chain Reckoning

2025 also exposed how fragile the npm ecosystem's trust model is. Three coordinated incidents stood out:

**s1ngularity**: An automated campaign that compromised several widely-used packages by exploiting maintainer authentication.

**debug/chalk**: Two foundational packages — used in virtually every JavaScript project — were compromised through maintainer account takeovers. The blast radius was enormous.

**Shai-Hulud**: A CISA-documented campaign targeting the npm ecosystem in September 2025, using CI workflow vulnerabilities to publish malicious versions under legitimate package names.

The response has been systemic: npm now enforces publish-time two-factor authentication more broadly, the community is pushing for granular short-lived tokens, and organizations are reviewing their dependency trees with new urgency.

## React2Shell: The CVSS 10.0 Wake-Up Call

Next.js applications using React Server Components were found to be vulnerable to CVE-2025-55182, a remote code execution vulnerability with a CVSS score of 10.0. The flaw was in how RSC handled serialization of server-side data — a class of vulnerability that had been theoretically understood but never weaponized at that severity level.

The patch landed in December 2025, but the incident reshaped how the community thinks about the boundary between server and client in React's component model. Full-stack JavaScript frameworks are now under heavier scrutiny from security researchers, and the release cadence for security patches in the framework layer has tightened considerably.

## Looking Ahead: TypeScript 7 and the Strict Future

The State of TypeScript 2026 report lays out a 2026 roadmap dominated by migration. TypeScript 7 is not just a performance upgrade — it brings breaking changes. `strict` mode will be on by default, ES5 targeting will be dropped (ES2015+ only), `baseUrl` will be removed, and classic Node module resolution will be gone. The `ts5to6` and `ts6to7` migration tools exist, but large codebases will need dedicated upgrade sprints.

On the standards side, the Temporal API is shipping in JavaScript engines even as TypeScript's standard library typings for it remain incomplete. The TC39 type-annotations proposal remains early-stage but represents the longer-term possibility of a JavaScript runtime that ignores type syntax natively — with TypeScript evolving as a superset that targets that runtime.

The JavaScript ecosystem's move toward type-aware tooling without the full TypeScript compiler is also accelerating. Biome v2 is positioning itself as a fast, type-aware linter that doesn't require the tsc dependency. Google ADK and Angular's AI hub are making TypeScript the default interface for AI agent code generation.

TypeScript's dominance is no longer in question. What remains to be seen is how the ecosystem handles the complexity that comes with it.
