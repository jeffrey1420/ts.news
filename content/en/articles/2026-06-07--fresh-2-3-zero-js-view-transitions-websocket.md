---
title: "Fresh 2.3: Zero JS by Default, View Transitions, and WebSocket Support"
description: "Fresh 2.3 makes the 'zero JavaScript by default' promise a hard reality, adds native View Transitions, introduces built-in WebSocket handlers, CSP nonce injection, and Temporal API support for islands."
date: 2026-06-07
image: "/images/heroes/2026-06-07--fresh-2-3-zero-js-view-transitions-websocket.png"
author: lschvn
tags: ["css", "runtimes", "frameworks"]
tldr:
  - "Fresh 2.3 actually ships zero JavaScript for pages without islands or partials, eliminating the ~14–22 KB client-entry bundle that existed even on fully static pages."
  - "View Transitions API is now wired into Fresh's partials system. Add f-view-transition to your body tag and navigations animate natively with CSS."
  - "Built-in WebSocket support ships via app.ws() and ctx.upgrade(), with a bare mode that returns the raw WebSocket object for shared structures like chat rooms."
faq:
  - question: "How does Fresh 2.3 achieve zero JavaScript by default?"
    answer: "Fresh 2.3 checks whether a page actually uses islands or partials before injecting any client-side code. If a page has neither, it ships with no script tags, no module preload headers, and no client bundle at all, compared to ~14–22 KB gzipped in 2.2."
  - question: "How do View Transitions work in Fresh 2.3?"
    answer: "Add the f-view-transition attribute to the body tag alongside f-client-nav: <body f-client-nav f-view-transition>. Fresh then wraps partial navigations in document.startViewTransition(), and you customize animations with standard CSS ::view-transition-old and ::view-transition-new rules. Browsers without View Transitions support fall back to normal partial updates."
  - question: "What is the new WebSocket API in Fresh 2.3?"
    answer: "The quickest approach is app.ws('/ws', { open, message, close }) on the main App instance. For file-based routes, use ctx.upgrade() inside a GET handler. Bare mode, ctx.upgrade() with no arguments, returns the raw WebSocket object so you can manage it in a shared structure like a Set for chat rooms."
---

"Zero JavaScript by default" has been Fresh's pitch since day one. The honest fine print: even a page with no islands and no partials still shipped a small client entry, somewhere between 14 and 22 KB gzipped depending on the project. Not a scandal, but not zero either. Fresh 2.3, [announced on the Deno blog](https://deno.com/blog/fresh-2.3), closes that gap for real.

## Actually zero this time

There is nothing to configure. After upgrading, Fresh checks at render time whether a page actually uses islands or partials. If it uses neither, the response contains no script tags, no module preload headers, and no client bundle. A marketing page, a blog post, a docs page, plain HTML over the wire, the way it renders it.

If you want to see it yourself, upgrade and open the network tab on a static route. The difference is easy to measure: where 2.2 loaded the client entry on every page, 2.3 loads nothing until the first island shows up.

## View Transitions with one attribute

Fresh already had client-side navigation through its partials system (`f-client-nav`). Version 2.3 wires the browser's View Transitions API into it. Opt in by adding one attribute next to the one you already have:

```html
<body f-client-nav f-view-transition>
```

Partial navigations are now wrapped in `document.startViewTransition()`, and you style the animation in plain CSS:

```css
::view-transition-old(root) {
  animation: fade-out 150ms ease-out;
}
::view-transition-new(root) {
  animation: fade-in 150ms ease-in;
}
```

Chrome 111+, Edge 111+, and Safari 18+ run the animations natively. Firefox doesn't yet, it simply falls back to a normal partial update, so there is no penalty for opting in early.

## WebSockets without a sidecar

Until now, real-time features in a Fresh app meant either wiring `Deno.upgradeWebSocket` by hand or running a separate server. Fresh 2.3 makes WebSockets first-class. The quickest version lives on the `App` instance:

```ts
app.ws("/ws", {
  open(ctx) {
    console.log("client connected");
  },
  message(ctx, event) {
    ctx.send(`echo: ${event.data}`);
  },
  close(ctx) {
    console.log("client gone");
  },
});
```

File-based routes get the same capability through `ctx.upgrade()` inside a GET handler. And if you need to manage connections yourself, a chat room keeping a `Set` of sockets, say, calling `ctx.upgrade()` with no handler object returns the raw `WebSocket` so you own the lifecycle.

## The rest of the release

Three smaller additions are worth knowing about:

- **CSP nonces.** Fresh can now inject a per-request nonce into the scripts and styles it emits, which makes a strict `Content-Security-Policy` practical without hand-maintaining hashes.
- **Temporal in islands.** All eight Temporal types can be passed as island props and serialize correctly across the server/client boundary, useful now that [Temporal is stabilizing across runtimes](/articles/2026-04-07-deno-2-7-stabilizes-temporal-api-windows-arm-npm-overrides).
- **Prerendering.** Mark a route with `prerender: true` and Fresh renders it to static HTML at build time; dynamic routes can enumerate their paths. Combined with zero-JS pages, Fresh quietly becomes a capable static site generator.

Fresh 2.3 is a `deno update` away, and with Deno 2.7+ new projects scaffold via `deno create`. For a framework whose whole identity is restraint, this is the release where the restraint stops being approximate.
