---
title: "Cursor Composer 2 and the Kimi K2.5 Controversy: What Developers Need to Know"
description: "When a developer found a hidden model ID in Cursor's API traffic, it sparked a debate about open-source licensing, attribution, and the quiet role Chinese AI labs play in Western AI products."
date: "2026-03-22"
author: "ts.news team"
tags: ["cursor", "ai", "kimi", "open-source", "licensing", "controversy"]
readingTime: 8
---

# Cursor Composer 2 and the Kimi K2.5 Controversy: What Developers Need to Know

On March 19, 2026, Cursor released Composer 2 — its next-generation AI coding model — to considerable fanfare. Benchmark scores beat Claude Opus 4.6. Social media lit up. Someone on Hacker News called it "a 50-person team beating Anthropic." Bold claims deserve scrutiny. Less than 24 hours later, a developer pulled back the curtain and found something Cursor hadn't mentioned: the foundation of Composer 2 is Kimi K2.5, an open-source model from Chinese AI lab Moonshot AI.

## The Discovery

Developer `@fynnso` was poking around Cursor's OpenAI-compatible API endpoint when they spotted an unusual model ID buried in the response:

```
accounts/anysphere/models/kimi-k2p5-rl-0317-s515-fast
```

The string is damning. `kimi-k2p5` is a direct reference to Kimi K2.5, Moonshot AI's open-source coding model released in January 2026. The `rl` suffix suggests reinforcement learning fine-tuning — exactly the technique Cursor described in their announcement as their own innovation.

What Cursor announced: *"We continued pre-training and applied RL to sharpen agentic coding performance."*

What they didn't mention: the base model was Kimi K2.5, a Moonshot creation they neither credited nor, according to the company, paid for.

## The Tokenizer Doesn't Lie

Yulun Du, Moonshot AI's head of pre-training, went public with technical evidence that was hard to rebut:

- **The tokenizer is identical** to Kimi K2.5's — a near-impossible coincidence if the models were truly independent
- **The model ID** in Cursor's API directly maps to a Kimi K2.5 derivative
- **Moonshot AI says** they received no payment and gave no permission for commercial use

This isn't Cursor's first rodeo with Chinese open-source models either. Community analysis has long suggested that Composer 1 was built on Qwen — another Chinese open-source model from Alibaba. The pattern is becoming a habit.

## The License Problem

Kimi K2.5 is open-source, but not free for every commercial use. Moonshot AI uses a modified MIT license with a commercial clause that matters:

> Commercial products with **monthly revenue exceeding $20 million** must prominently display "Powered by Kimi K2.5" in the user interface.

Cursor's ARR is reported well past that threshold. Yet on launch day, Composer 2 shipped with zero attribution to Kimi K2.5 anywhere — not in the UI, not in the docs, not in the changelog. Moonshot AI's licensing page now explicitly calls out the violation.

This isn't a PR problem. It's a potential breach of contract with real legal consequences.

## The 24-Hour Reversal

Here's the timeline that makes this story remarkable:

**March 19, morning** — Cursor launches Composer 2. The announcement is entirely about Cursor's innovations: RL training, agentic coding, long-horizon task handling. No mention of Kimi K2.5.

**March 19, evening** — The model ID surfaces on X and Hacker News. The developer community starts connecting dots.

**March 20** — Cursor publishes what amounts to an acknowledgment, saying they "partnered with Moonshot AI" but the framing reads more like damage control than disclosure.

**March 21-22** — Moonshot AI publicly states no formal partnership exists and no payment was received.

The reversal took about 24 hours. The credibility cost may take longer to recover.

## Why This Matters for Developers

If you're a Cursor user, the practical takeaway is nuanced:

**The model quality is real.** Kimi K2.5 with RL fine-tuning is genuinely good at coding tasks — that's why Cursor chose it as a foundation. The controversy isn't about whether the product works.

**The attribution problem is real too.** You deserve to know what model runs under the hood of a tool you're paying for. When a $2B ARR product built on open-source work refuses to acknowledge that foundation, it sets a bad precedent for the entire ecosystem.

**Open-source doesn't mean free.** The AI industry has been living off open-source work — often from Chinese labs — without contributing back or respecting licenses. That era may be ending.

## The Bigger Picture

This episode exposes a structural problem in how AI products are built and marketed. Open-source models from Chinese labs (Kimi, Qwen, DeepSeek) have quietly become the backbone of many Western AI products. The code is genuinely good. The licenses are frequently ignored. And the marketing spin usually erases the origin.

Moonshot AI built Kimi K2.5. They wrote a license. The license has conditions. Cursor appears to have violated those conditions.

The AI industry's relationship with open-source is complicated. It's also increasingly central to how powerful tools get built. Whether this episode forces better norms — or just forces better secrecy — is the question worth watching.

---

*What do you think? Is Cursor's handling of attribution a serious issue or just an unfortunate oversight?*
