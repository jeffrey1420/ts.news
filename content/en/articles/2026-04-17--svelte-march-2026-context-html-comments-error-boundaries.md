---
title: "Svelte March 2026: Programmatic Context, HTML Comments, and Server Error Boundaries"
description: "Svelte's March update brings createContext for programmatic component instantiation, HTML comments inside tags, SSR error boundaries, and navigation callbacks with scroll position data."
date: 2026-04-17
image: "https://svelte.dev/blog/whats-new-in-svelte-march-2026/card.png"
author: lschvn
tags: ["Svelte", "SvelteKit", "JavaScript", "Framework", "State of JS"]
tldr:
  - createContext can now be used when instantiating Svelte components programmatically via new Component({ target }), fixing a long-standing limitation
  - HTML comments are now valid inside HTML tags in templates, and error boundaries work on the server for SSR error handling
  - Svelte remains the top-ranked reactive framework in the State of JS 2025 survey, holding its position from the previous year
faq:
  - q: "How do I use createContext programmatically in Svelte 5?"
    a: "Pass a context map as the second argument to the component constructor: new Component({ target: element, props: {...}, context: new Map([[key, value]]) })"
  - q: "What does TrustedHTML support mean in practice?"
    a: "{@html} expressions in Svelte templates now accept TrustedHTML (from the Secure Types API), which tells the type checker that the HTML string is already sanitized and safe to insert."
  - q: "How do server error boundaries work in SvelteKit?"
    a: "Use the svelte:boundary component with transformError to catch and transform server-side errors, similar to how client-side error boundaries already worked."
---

Svelte's March 2026 release lands a set of improvements that close longstanding gaps — most notably around programmatic component instantiation and server-side error handling — while continuing to refine SvelteKit's navigation APIs.

## `createContext` Goes Programmatic

In Svelte 5, `createContext` and `getContext` let you share state across a component tree without prop drilling. The limitation was that context only worked with components rendered through Svelte's normal slot/transitions system. Calling `new Component({ target })` to instantiate a component programmatically couldn't access the context map.

Svelte 5.50.0 fixes this. You can now pass a `context` Map as the third argument to the component constructor:

```js
import { mount, setContext } from 'svelte';
import { MyContextKey } from './keys.js';

const ctx = new Map([[MyContextKey, { value: 42 }]]);
const component = new MyComponent({ target: document.body, props: {}, context: ctx });
```

This makes it practical to use Svelte components as plain JavaScript classes in libraries and testing utilities, without restructuring how context is provided.

## HTML Comments Inside Tags, and TrustedHTML

Two compiler-level changes land in the same release train. HTML comments are now permitted inside HTML tag attributes:

```svelte
<button 
  -- A comment inside the attribute list is now valid --
  class="primary"
  onclick={handler}>
  Click me
</button>
```

Simultaneously, `{@html}` expressions now accept `TrustedHTML` — part of the Web Secure Types API. This lets you tell the type system that a string has already been sanitized and should not trigger the usual `any` escape hatch when assigning to `{@html}`.

## Error Boundaries Reach the Server

Error boundaries (`svelte:boundary`) previously only worked on the client. Svelte 5.53.0 extends them to server-side rendering, so you can catch and transform errors that occur during SSR without crashing the entire page. This matters for SvelteKit apps that fetch data at request time — a failing component no longer takes down the whole response.

## SvelteKit: Navigation Callbacks Get Scroll Data

Navigation callbacks (`beforeNavigate`, `onNavigate`, `afterNavigate`) now include scroll position information on the `from` and `to` navigation targets. This enables scroll-aware transition animations — you can check whether the user is navigating back or forward and animate accordingly, all without extra bookkeeping.

The update also stabilizes Vite 8 support (kit@2.53.0) and adds an official `better-auth` addon to the Svelte CLI (`sv@0.12.0`).

## State of JS 2025: Svelte Holds First Place

A quick vindication: the [State of JS 2025 survey](https://2025.stateofjs.com/en-US) results are out, and Svelte retains its position as the top-ranked reactive framework in positive sentiment for the second consecutive year. The category includes Solid, Vue, React, Angular, and others — Svelte's developer satisfaction score continues to stand out.

## Community Highlights

The usual round of notable projects built with Svelte this month:

- **[Cherit](https://keshav.is-a.dev/Cherit/)** — open-source markdown knowledge base built with Tauri
- **[Mistral AI's worldwide hackathon site](https://worldwide-hackathon.mistral.ai/)** — built with Svelte, as noted on Reddit
- **[Fretwise](https://fretwise.ai/)** — AI-powered guitar practice platform generating tabs and isolated stems
- **[SoundTime](https://github.com/CICCADA-CORP/SoundTime)** — self-hosted music streaming with P2P sharing, built with Rust + Svelte
- **[warpkit](https://github.com/upstat-io/warpkit)** — standalone Svelte 5 SPA framework with state-based routing and data fetching
- **[svelte-grab](https://github.com/HeiCg/svelte-grab)** — dev tool that captures component context for LLM coding agents, Alt+Click any element to inspect state and trace errors

Svelte's ecosystem continues to grow in directions that go well beyond the traditional web app — from music tools to hardware simulators to AI integrations.
