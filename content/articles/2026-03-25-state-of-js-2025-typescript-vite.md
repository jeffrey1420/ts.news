---
title: "State of JavaScript 2025: TypeScript Dominates, Vite Overtakes Webpack"
description: "The State of JavaScript 2025 survey reveals TypeScript usage at an all-time high, Vite crushing Webpack in satisfaction, and growing concerns about Next.js complexity."
image: "https://assets.devographics.com/surveys/js2025-og.png"
date: 2026-03-25
category: Ecosystem
author: tsw
readingTime: 5 min
---

The [State of JavaScript 2025](https://2025.stateofjs.com/en-US) survey, published in February 2026 after collecting responses through November 2025, paints a picture of a maturing ecosystem. TypeScript has firmly won the language war, Vite has won the build tool war — at least in sentiment — and developers are increasingly vocal about framework complexity.

## TypeScript: The Unambiguous Winner

TypeScript usage continues to climb. **40% of respondents now write exclusively in TypeScript**, up from 34% in 2024 and 28% in 2022. Only 6% use plain JavaScript exclusively. When asked what they'd change about JavaScript, "lack of static typing" remains the number one pain point.

The numbers are damning in the best way. Daniel Roe, Nuxt core team leader, put it bluntly in the survey's conclusion:

> TypeScript has won. Not as a bundler, but as a language.

With type stripping now available in stable Node.js, the last technical barriers are crumbling. The question is no longer whether to use TypeScript — it's how fast you can migrate.

## Build Tools: Vite Devastates Webpack

The build tool narrative is equally decisive. Vite sits at **84% usage with a 98% satisfaction score**. Webpack maintains slightly higher overall usage at 87%, but its satisfaction rating has collapsed to **26%**, down from 36% in 2024.

One respondent described the current state: "trying to understand legacy code that uses Webpack can be painful." That sentiment resonates.

Turbopack, Vercel's Rust-based successor to Webpack, sits at just 28% usage. Despite significant marketing push, it hasn't gained the traction many expected. The Rust-based future of the build pipeline might instead be [Rolldown](https://rolldown.rs) — the Rollup-compatible toolchain that jumped from 1% to 10% usage in a single year.

## Frontend Frameworks: React Dominates, but Next.js Draws Fire

React remains the most-used framework at **83.6%**, but the survey exposed growing dissatisfaction. Next.js, used by 59% of respondents, posted a 21% positive sentiment against a concerning 17% negative sentiment — generating more comment activity than any other project.

The complaints cluster around complexity:

> "I've written Next.js in production for going on 6 years... the Next complexity has gotten absurd"

Others expressed concern about Vercel's business incentives shaping the framework's direction. One respondent put it: "I'm worried because Vercel is trying to use it to make money."

Solid.js maintained the highest satisfaction rating among major frameworks, though its usage remains well below React, Vue, and Svelte.

## What This Means for TypeScript Projects

The survey confirms what many TypeScript developers already experience: the ecosystem has coalesced around a set of stable preferences. TypeScript, Vite, and either Next.js or a meta-framework alternative are the default choices for new projects.

The friction is shifting. It's no longer about whether to use TypeScript — it's about managing framework complexity as the ecosystem matures past its rapid-innovation phase.

The full survey results are available at [2025.stateofjs.com](https://2025.stateofjs.com/en-US).
