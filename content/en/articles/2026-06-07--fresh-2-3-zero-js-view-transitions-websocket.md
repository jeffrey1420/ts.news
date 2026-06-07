---
title: "Fresh 2.3: Zero JS by Default, View Transitions, and WebSocket Support"
description: "Fresh 2.3 makes the 'zero JavaScript by default' promise a hard reality, adds native View Transitions, introduces built-in WebSocket handlers, CSP nonce injection, and Temporal API support for islands."
date: 2026-06-07
image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Deno", "Fresh", "TypeScript", "JavaScript", "view-transitions", "websocket"]
tldr:
  - "Fresh 2.3 actually ships zero JavaScript for pages without islands or partials, eliminating the ~14–22 KB client-entry bundle that existed even on fully static pages."
  - "View Transitions API is now wired into Fresh's partials system — add f-view-transition to your body tag and navigations animate natively with CSS."
  - "Built-in WebSocket support ships via app.ws() and ctx.upgrade(), with a bare mode that returns the raw WebSocket object for shared structures like chat rooms."
faq:
  - q: "How does Fresh 2.3 achieve zero JavaScript by default?"
    a: "Fresh 2.3 checks whether a page actually uses islands or partials before injecting any client-side code. If a page has neither, it ships with no script tags, no module preload headers, and no client bundle at all — compared to ~14–22 KB gzipped in 2.2."
  - q: "How do View Transitions work in Fresh 2.3?"
    a: "Add the f-view-transition attribute to the body tag alongside f-client-nav: <body f-client-nav f-view-transition>. Fresh then wraps partial navigations in document.startViewTransition(), and you customize animations with standard CSS ::view-transition-old and ::view-transition-new rules. Browsers without View Transitions support fall back to normal partial updates."
  - q: "What is the new WebSocket API in Fresh 2.3?"
    a: "The quickest approach is app.ws('/ws', { open, message, close }) on the main App instance. For file-based routes, use ctx.upgrade() inside a GET handler. Bare mode — ctx.upgrade() with no arguments — returns the raw WebSocket object so you can manage it in a shared structure like a Set for chat rooms."
---
