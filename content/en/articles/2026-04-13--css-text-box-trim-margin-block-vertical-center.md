---
title: "The CSS vertical-align Problem Is Finally Solved: text-box-trim and margin-block"
description: "For decades, centering text vertically in buttons, badges, and layouts felt slightly off. The culprit: leading space — invisible padding built into every font's metrics. Two CSS properties now solve this at different levels: text-box-trim for inline text and margin-block with cap/lh units for block layouts."
date: 2026-04-13
image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=1200&h=630&fit=crop"
author: lschvn
tags: ["CSS", "frontend", "typography", "web development", "layout"]
readingTime: 7
tldr:
  - "Text never truly centers in CSS because browsers align to the line-height box, not the visual letters. Leading space (invisible padding above and below cap height) throws off every button, badge, and heading."
  - "text-box-trim (experimental) removes leading space directly for inline text, paired with text-box-edge to specify which font metric to use as boundaries."
  - "margin-block: calc(0.5cap - 0.5lh) achieves the same effect with superior browser support, using font-relative units that work in production today."
faq:
  - question: "Why does text appear vertically off-center even when CSS says otherwise?"
    answer: "Because browsers align text to the line-height box, not to the visual letters. Fonts include invisible 'leading space' above cap height and below the baseline. A 16px font with line-height 1.5 allocates 24px of vertical space — but the actual letters only occupy ~11px. That 6-7px difference per line is what makes text look misaligned in buttons and badges."
  - question: "What is text-box-trim?"
    answer: "An experimental CSS property that removes leading space from inline text. Use text-box-trim: trim-both to remove space above and below visual letters, combined with text-box-edge: cap alphabetic to specify trimming from cap height down to the alphabetic baseline. Browser support is limited to cutting-edge versions."
  - question: "How does margin-block achieve the same result?"
    answer: "margin-block: calc(0.5cap - 0.5lh) offsets the line-height box against the cap height. The formula subtracts half the line-height from half the cap height, producing a negative margin that pulls visual text up into the center of its allocated space. It works with excellent browser support today."
  - question: "Can I use both techniques together?"
    answer: "No — they stack and create double the adjustment. Always use @supports (text-box-trim: trim-both) to detect text-box-trim support and cancel margin-block inside that block. The correct pattern: start with margin-block as baseline, apply text-box-trim as enhancement, cancel margin-block when text-box-trim is available."
  - question: "What are cap and lh units?"
    answer: "cap is the height of capital letters relative to the font's em-box. lh is the computed line-height value. Both are font-relative units that scale with the font, making the margin-block formula work correctly regardless of font size or family."
---

Open a button in your browser inspector. Add padding. The text looks centered. Now add more padding, or switch the font. Suddenly it's 4 pixels off. This is not a bug in your CSS. It's a fundamental mismatch between how browsers measure text and how humans perceive it.

## The Problem — Leading Space

To understand why text never quite centers, you need to understand what browsers actually measure. Every font ships with a set of metrics: the **cap height** (how tall capital letters stand), the **baseline** (where letters rest), the **ascent** (distance from baseline to top of tall letters), and the **descent** (distance below baseline to the bottom). These metrics define the em-square, the invisible box that contains every glyph.

But there's a catch. When you set `line-height: 1.5` on 16px text, the browser allocates 24px of vertical space. The actual visual text — the letters themselves — occupy only about 11px in the vertical center of that 24px box. The remaining space is called **leading space**: invisible padding distributed above the cap height and below the baseline.

Browsers align text to this line-height box, not to the visual letters. This is why text in a button always appears to sit in the lower half of its container, even with `display: flex; align-items: center`. The line-height box extends further above the cap height than below the baseline, so the visual center of the letters sits well below the geometric center of the allocated space.

This mismatch affects every tight text container: buttons, badges, navigation items, input fields. You can add all the padding you want — until you address the leading space, the text will never look truly centered.

## Solution 1 — text-box-trim

The CSS Text Level 4 specification introduces `text-box-trim`, a property that lets you remove leading space directly from inline text. The property accepts three values: `trim-start` removes space above the text, `trim-end` removes space below, and `trim-both` removes both.

To control exactly which part of the font metric gets trimmed, pair it with `text-box-edge`. This property accepts values like `cap`, `alphabetic`, `ex`, and `text` — each representing a different measurement in the font's em-square.

For the tightest vertical fit, use `text-box-edge: cap alphabetic` combined with `text-box-trim: trim-both`. This tells the browser to trim from the cap height down to the alphabetic baseline, removing all the leading space above and below the visible letters.

```css
.button-text {
  text-box-edge: cap alphabetic;
  text-box-trim: trim-both;
}
```

Browser support is currently limited to the most cutting-edge versions. This makes `text-box-trim` ideal as a progressive enhancement: you apply it for browsers that support it while maintaining a fallback for everyone else.

## Solution 2 — margin-block

If you need working code today, `margin-block` with font-relative units delivers the same result with excellent browser support. The technique uses two lesser-known CSS units: `cap`, which equals the cap height of the current font, and `lh`, which equals the computed line-height value.

The formula is elegant:

```css
.button-text {
  margin-block: calc(0.5cap - 0.5lh);
}
```

This produces a negative margin that offsets the line-height box against the cap height. Half the cap height minus half the line-height gives you the exact distance needed to pull the visual text up into the center of its allocated space. Because both `cap` and `lh` scale with the font, this works correctly regardless of font size or family.

For a 16px font with `line-height: 1.5` (24px), the calculation yields approximately -4px. This negative margin lifts the visual text into geometric center. The result is the same tight, accurate alignment that `text-box-trim` provides — but available in every modern browser today.

## Progressive Enhancement Pattern

The smart approach combines both techniques: start with `margin-block` as your baseline, then enhance with `text-box-trim` where supported. The key is using `@supports` to detect `text-box-trim` support and cancel the margin-block inside that block.

```css
.button-text {
  /* Baseline: works everywhere */
  margin-block: calc(0.5cap - 0.5lh);
}

/* Enhancement: use text-box-trim when available */
@supports (text-box-trim: trim-both) {
  .button-text {
    text-box-edge: cap alphabetic;
    text-box-trim: trim-both;
    margin-block: 0;
  }
}
```

This pattern ensures every browser gets correct text alignment. Older browsers get the `margin-block` solution. Cutting-edge browsers get the native `text-box-trim` approach. No browser gets double adjustment or broken layouts.

## Real-World Use Cases

**Button text**: Apply `margin-block: calc(0.5cap - 0.5lh)` to the button's text element while the button itself uses `display: inline-flex; align-items: center`. This gives you perfectly centered button text that holds up when you switch fonts or adjust padding.

**Badges and pills**: Tight padding containers reveal misalignment instantly. Add `margin-block` to the badge text and watch the label snap into geometric center, even with asymmetrical padding.

**Hero headings**: Large display text makes even tiny misalignments obvious. `margin-block` on a 72px heading with `line-height: 1.1` delivers the pixel-precise alignment that premium designs demand.

**Icon + text**: When pairing an icon with text using `display: flex; align-items: center`, adding `margin-block` to the text element ensures the icon and letters share the same visual baseline, even when their internal metrics differ.

Text has always been slightly off-center in CSS — not because of bugs, but because of how browsers measure space. With `margin-block` available today and `text-box-trim` arriving soon, that era is finally over.
