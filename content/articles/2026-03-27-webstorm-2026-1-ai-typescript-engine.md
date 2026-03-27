---
title: "WebStorm 2026.1 Brings Native TypeScript Engine and Multi-Agent AI to JetBrains' Flagship IDE"
description: "JetBrains releases WebStorm 2026.1 with a service-powered TypeScript engine enabled by default, integration with Junie, Claude Agent, and Codex, and improved framework support across React, Angular, Vue, and Svelte."
image: "https://blog.jetbrains.com/publications/images/og/jetbrains-og-default.png"
date: "2026-03-27"
category: Release
author: tsw
readingTime: 4
---

WebStorm 2026.1 landed this week, and the headline features reflect where JavaScript development tooling is heading: a smarter TypeScript engine by default, and a unified AI chat that pulls in multiple agents including Claude Agent and Codex alongside JetBrains' own Junie.

## Service-Powered TypeScript Engine Now Default

The biggest under-the-hood change is the TypeScript engine. WebStorm now uses a service-powered implementation by default, which JetBrains says improves correctness while reducing CPU usage in large projects. The change is meant to keep navigation, inspections, and refactorings responsive when working with substantial TypeScript codebases.

The release also aligns WebStorm with TypeScript 6 changes, including updates to how the compiler handles the `types` value and `rootDir` defaults. For teams watching the TypeScript 7 roadmap — the Go-based rewrite arriving later this year — WebStorm has started adapting its config handling to match 7's planned changes to `baseUrl`.

## AI Chat Gets Serious

The AI story in this release is multi-agent by design. In addition to Junie and Claude Agent, WebStorm 2026.1 adds Codex to the IDE's built-in AI chat. The JetBrains AI chat now also supports Cursor, GitHub Copilot, and any other agents published to the ACP Registry.

The ACP Registry, introduced earlier this year, lets you browse and install agents without leaving the IDE. The idea is straightforward: different agents excel at different tasks, and being able to swap between them without breaking your workflow is the goal.

Also new: "next edit suggestions" now work without consuming AI quota on Pro, Ultimate, and Enterprise plans. Unlike traditional autocomplete that only updates what's at your cursor, these suggestions apply related changes across an entire file — JetBrains calls it a "Tab Tab experience" for keeping code consistent with minimal friction.

## Framework Updates

Framework support keeps pace with rapid releases across the ecosystem:

- **React**: Highlighting for the new `use memo` and `use no memo` directives alongside existing `use client` and `use server`
- **Angular 21**: Support for arrow functions, `instanceof` operator, regular expressions, and spread syntax in templates
- **Vue**: Updated to `@vue/typescript-plugin` 3.2.4 for compatibility with the latest TypeScript tooling in `.vue` files
- **Astro**: JSON configuration can now be passed directly to the Astro language server from IDE settings
- **Svelte**: Generics support in `<script>` tags with usage search, navigation, and rename refactoring for type parameters

## String-Literal Import/Export Support

WebStorm now parses and understands string-literal names in import and export specifiers — standards-compliant syntax that works with code like `export { a as "a-b" }` and `import { "a-b" as a } from "./file.js"`. Navigation, highlighting, and refactoring all work correctly with this syntax.

## CSS Color Spaces

Support for modern CSS color spaces means color pickers and previews now handle `oklch`, `oklab`, `hwl`, and other color formats defined in CSS Color Level 4 specifications.

WebStorm 2026.1 is available via the Toolbox App or direct download from [jetbrains.com/webstorm/download](https://www.jetbrains.com/webstorm/download).
