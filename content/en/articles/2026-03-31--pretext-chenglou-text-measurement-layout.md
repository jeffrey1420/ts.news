---
title: "Pretext: The DOM-Free Text Measurement Library That AI Coding Agents Are Already Using"
description: "Cheng Lou just released Pretext, a pure JavaScript library that measures and lays out multiline text without touching the DOM. Here's why that matters for virtualization, layout control, and AI agents that write UI code."
date: "2026-03-31"
image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop"
author: lschvn
tags: ["javascript", "typescript", "layout", "performance", "DOM", "library"]
readingTime: 7
category: "release"
tldr:
  - "Pretext (@chenglou/pretext) measures and lays out multiline text without touching the DOM, using canvas measureText as ground truth."
  - "Hot-path layout() runs at ~0.09ms for 500 texts — 10–50x faster than single getBoundingClientRect() calls with zero reflow."
  - "Full Unicode, emoji, and bidirectional text support; the prepare()/layout() split enables cached one-time setup with pure-arithmetic hot paths."
  - "Key use cases: virtualization without height guesstimates, CLS prevention, server-side layout, and AI agents predicting text overflow."
---

A new library showed up on npm on March 29 with zero announcement and already hundreds of downloads: **Pretext** (`@chenglou/pretext`), a pure JavaScript and TypeScript library for multiline text measurement and layout — without ever touching the DOM.

The author is Cheng Lou, previously known for work on React and ReasonML. The concept is clean: measure text the way browsers do, using the browser's own font engine as ground truth, but entirely through canvas — no `getBoundingClientRect`, no `offsetHeight`, no layout reflow.

## Why This Matters: The Reflow Problem

Every front-end developer has hit this wall: you need to know how tall a block of text will be before rendering it. The traditional answer is to render it, measure it, then adjust. That triggers **layout reflow** — one of the most expensive operations in the browser. For a single label it's fine. For a list of 10,000 messages, a virtualized scroll, or an AI agent generating UI dynamically, it's a disaster.

Pretext sidesteps this entirely. It measures text using a hidden canvas and the browser's own `measureText()` API, which uses the same font engine that the DOM uses. The measurement is accurate because it's using real browser typography — but it's happening off-screen, without triggering layout at all.

```typescript
import { prepare, layout } from '@chenglou/pretext'

// One-time preparation (done once per text+font combination)
const prepared = prepare('AGI spring is here. 시작했다 🚀', '16px Inter')

// Hot path: pure arithmetic, no DOM involved
const { height, lineCount } = layout(prepared, textWidth, 20)
```

`prepare()` does the one-time work: normalizing whitespace, segmenting text, applying glue rules, measuring segments with canvas. `layout()` after that is roughly **0.09ms** for 500 texts on the current benchmark. That's sub-millisecond.

## Two Use Cases, One Library

### 1. Measure Without Touching DOM

The primary use case: know your text height before rendering. This unlocks:

- **Virtualization without guesstimates**: Render only what fits in the viewport, measure the rest ahead of time
- **CLS (Cumulative Layout Shift) prevention**: Pre-measure text before it loads so you can reserve the right space and keep scroll position stable
- **Development-time overflow detection**: AI coding agents can verify that a button label won't wrap to two lines before the code even runs
- **Fancy userland layouts**: Masonry, custom flexbox implementations, layouts that nudge values without CSS hacks

```typescript
// Detect overflow before it happens
const { height } = layout(prepared, buttonWidth, buttonLineHeight)
if (height > buttonMaxHeight) {
  // Truncate, tooltip, or reflow
}
```

### 2. Manual Line Layout

If you need the actual line contents — for canvas/SVG rendering, for text wrapping around floats, or for building custom renderers — Pretext provides lower-level APIs:

```typescript
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

const prepared = prepareWithSegments('AGI spring is here. 시작했다 🚀', '18px "Helvetica Neue"')
const { lines } = layoutWithLines(prepared, 320, 26) // 320px max width, 26px line height

for (let i = 0; i < lines.length; i++) {
  ctx.fillText(lines[i].text, 0, i * 26)
}
```

The `walkLineRanges()` variant never even builds line strings — it calls a callback for each line with its width and cursor positions. This enables binary searches over layout dimensions, shrink-wrap containers, and balanced text without string allocation.

```typescript
// Find the tightest width that fits all text
let maxW = 0
walkLineRanges(prepared, 320, line => {
  if (line.width > maxW) maxW = line.width
})
// maxW = the minimum container width that won't overflow
```

And `layoutNextLine()` handles variable-width columns — the canonical case of text flowing around a floated image:

```typescript
let cursor = { segmentIndex: 0, graphemeIndex: 0 }
let y = 0

while (true) {
  const width = y < image.bottom ? columnWidth - image.width : columnWidth
  const line = layoutNextLine(prepared, cursor, width)
  if (line === null) break
  ctx.fillText(line.text, 0, y)
  cursor = line.end
  y += 26
}
```

## What Makes Pretext Different

### Benchmark Numbers

From the project's own checked-in benchmark on a shared 500-text batch:
- **`prepare()`**: ~19ms (one-time, cached)
- **`layout()`**: ~0.09ms (hot path, pure arithmetic)

For context, a single `getBoundingClientRect()` call on a moderately complex DOM subtree can take 1-5ms on a mid-tier device. Pretext's hot path is 10-50x faster than DOM measurement, with zero side effects.

### Full Unicode + Emoji + Bidirectional Support

Pretext handles text shaping correctly across all languages. The README specifically calls out support for emojis and mixed bidirectional (bidi) text — Arabic mixed with English, Hebrew mixed with numbers. The library uses the browser's own font engine as the source of truth, so it shapes text exactly the way the DOM will.

```typescript
// Mixed scripts, emojis, bidirectional — all handled correctly
prepare('AGI spring is here. بدأت الرحلة 🚀', '16px Inter')
```

### Two-Step Cache Architecture

The `prepare()` / `layout()` split is the key performance insight. `prepare()` is expensive (canvas measurement, text segmentation, bidi reordering) but cached. `layout()` is arithmetic on pre-computed data. You pay the setup cost once; the hot path stays cold.

Resize? Only `layout()` reruns. Font change? Only `prepare()` reruns for affected text. This is the kind of API design that makes AI code generation tractable — the agent can call `layout()` in a tight loop without anxiety.

## The Caveats

Pretext is explicit about what it doesn't do (yet):

- It targets `white-space: normal`, `word-break: normal`, `overflow-wrap: break-word`, `line-break: auto` — the common case, not every CSS text model
- `system-ui` is unsafe for measurement accuracy on macOS — you need a named font
- It's not a full font rendering engine — it doesn't handle some advanced OpenType features, but for the 95% case of measuring where text will break, it covers everything

The `white-space: pre-wrap` mode is also supported for textarea-like cases where spaces, tabs, and newlines are preserved.

## Who Is This Actually For

The obvious answer is UI library authors and virtualization layer maintainers. But Pretext's README makes an interesting observation about **AI coding agents**:

> "Development time verification (especially now with AI) that labels on e.g. buttons don't overflow to the next line, browser-free"

When an AI generates UI code, it currently has no way to know if a label will overflow without running the code in a browser. Pretext gives AI agents the ability to predict text layout at generation time — before the code runs. That's a meaningful capability for AI-assisted UI development. For a broader look at how AI coding tools like [Claude Code](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026) and Cursor are evolving the developer experience, see our [AI dev tool rankings](/articles/2026-03-25-ai-dev-tool-rankings-march-2026).

The library also matters for:
- **Canvas/SVG rendering** where you don't have a DOM at all
- **Server-side layout calculation** (server-side rendering without a DOM)
- **Game UIs** built on canvas
- **Native app toolkits** that embed a JS engine but don't expose the browser's layout system

[Bun](/articles/2026-03-30-bun-v1-3-11-cron-anthropic) is one such environment where Pretext's approach shines — with its embedded JavaScript engine and native TypeScript support, Pretext can calculate layouts server-side without a DOM at all.

## Installation

```bash
npm install @chenglou/pretext
```

Demos live at [chenglou.me/pretext](https://chenglou.me/pretext/). The source is on [GitHub](https://github.com/chenglou/pretext).

---

*Pretext is Cheng Lou's second act in the text rendering space — building on his earlier work on [text-layout](https://github.com/chenglou/text-layout) from a decade ago. Sebastian Markbage's original text-layout design (canvas measureText for shaping, bidi from pdf.js, streaming line breaking) informed the architecture that Pretext now carries forward.*
