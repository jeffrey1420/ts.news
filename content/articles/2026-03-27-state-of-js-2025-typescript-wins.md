---
title: "State of JavaScript 2025: TypeScript Hits 40% Exclusive Usage as Ecosystem Settles"
description: "The State of JavaScript 2025 survey shows TypeScript exclusive usage at 40%, Vite satisfaction at 98% versus Webpack's 26%, and Claude doubling its developer share. The ecosystem is maturing rather than churning."
image: "https://assets.devographics.com/surveys/js2025-og.png"
date: "2026-03-27"
category: Survey
author: lschvn
readingTime: 4
tags: ["typescript", "javascript", "state-of-js", "survey", "vite", "ecosystem"]
tldr:
  - "TypeScript exclusive usage reached 40% (up from 34% in 2024, 28% in 2022); only 6% use plain JS exclusively."
  - "Vite satisfaction is 98% vs Webpack's 26%; React usage at 83.6% but Next.js negative sentiment hits 17%."
  - "Claude usage doubled from 22% to 44%; Cursor more than doubled from 11% to 26%; ChatGPT declined from 68% to 60%."
  - "Node.js remains dominant at 90% runtime usage; Bun grew 4 points to 21%, well ahead of Deno at 11%."
---

The [State of JavaScript 2025](https://2025.stateofjs.com/en-US) survey results are in, and they paint an ecosystem finding its footing. Conducted in November 2025 and published in February 2026, the annual survey — run by Devographics and sponsored by Google Chrome and JetBrains — shows clear winners in tooling, frameworks, and language preferences, with developer happiness holding steady at 3.8 out of 5 for the fifth consecutive year.

## TypeScript Has Won — Now What?

The headline number: 40 percent of respondents now write exclusively in TypeScript — a trend that underscores why [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release), the last JS-based release before the native Go rewrite, is such a pivotal transition point for the ecosystem. That figure is up from 34 percent in 2024 and 28 percent in 2022. Only 6 percent use plain JavaScript exclusively. Daniel Roe, Nuxt core team leader, [put it plainly](https://2025.stateofjs.com/en-US/conclusion/) in the survey's conclusion: "TypeScript has won. Not as a bundler, but as a language."

The interesting tension is that "lack of static typing" remains the number one language pain point reported — among developers who haven't adopted TypeScript. When asked how types should work natively in JavaScript, TypeScript-like annotations led with 5,380 votes, ahead of runtime types at 3,524.

## Build Tools: Vite's Satisfaction Dominance

Vite has effectively overtaken Webpack in developer sentiment. While Webpack retains slightly higher overall usage (87% versus 84%), the satisfaction gap is stark: [Vite](/articles/2026-03-26-vite-8-rolldown-era) scores 98 percent, Webpack scores 26 percent — down from 36 percent in 2024.

One respondent's comment captures the mood: "Trying to understand legacy code that uses Webpack can be painful."

Turbopack, Vercel's Rust-based successor to Webpack, sits at just 28 percent usage, suggesting Vite's head start and developer experience advantage will be difficult to overcome. Rolldown — the Rust-based Rollup replacement being integrated into Vite's future — jumped from 1 percent to 10 percent, hinting at a JavaScript build pipeline increasingly powered by Rust.

## React Frustration, Solid Satisfaction

React remains the most used framework at 83.6 percent, but the survey reveals notable dissatisfaction. Next.js, used by 59 percent of respondents, posted a 21 percent positive sentiment score against a 17 percent negative sentiment — generating the most comments of any project.

Representative responses from the survey:
- "I've written Next.js in production for going on 6 years... the Next complexity has gotten absurd"
- "While I did have a positive experience with Next, I'm worried because Vercel is trying to use it to make money"

Solid.js maintained the highest satisfaction rating for the fifth consecutive year. In the meta-framework space, Astro continued gaining ground as a content-first alternative.

## AI Tool Usage Shifts

AI-assisted development patterns are shifting. Claude usage doubled from 22 to 44 percent, while Cursor more than doubled from 11 to 26 percent. ChatGPT usage declined from 68 to 60 percent — still dominant in absolute terms, but trending down.

## Backend: Node Holds, Bun Grows

On the runtime side, Node.js remains dominant at 90 percent. [Bun](/articles/2026-03-30--bun-v1-3-11-cron-anthropic) sits in third place at 21 percent — a 4 percent gain over the prior year — well ahead of Deno at 11 percent. For a deeper look at how the three runtimes compare across throughput, cold starts, and async performance, see our [2026 runtime benchmark analysis](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark).

The Temporal API, the long-standing proposal to replace JavaScript's problematic `Date` object, saw excitement decline 22 percent year-over-year as it transitions from proposal to browser implementation. The API remains the most anticipated proposal in the survey.

Full results are available at [2025.stateofjs.com](https://2025.stateofjs.com/en-US).
