---
title: "GitHub Copilot's Quiet Policy Shift: Your Code Will Train Their Models Unless You Opt Out"
description: "Starting April 24, 2026, GitHub will use interaction data from Free, Pro, and Pro+ Copilot users to train AI models — unless they manually opt out. Business and Enterprise tiers are unaffected. Here's what changes and how to protect your code."
date: 2026-04-02
image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&h=630&fit=crop"
author: lschvn
tags: ["GitHub", "Copilot", "AI", "data privacy", "machine learning", "open source"]
readingTime: 5
tldr:
  - "From April 24, GitHub will use Free/Pro/Pro+ Copilot interaction data (inputs, outputs, code snippets, context) to train AI models by default — opt-out required."
  - "Copilot Business and Enterprise users, plus anyone who previously opted out, are not affected. The change targets individual subscribers on all paid tiers."
  - "The opt-out toggle sits in GitHub Settings under Copilot privacy options. If you don't touch it, your coding data helps improve Copilot for everyone."
---

On March 25, 2026, GitHub quietly updated how it handles Copilot interaction data. The short version: **unless you actively opt out, your coding activity on Free, Pro, and Pro+ plans will be used to train future AI models starting April 24**.

## What Data Is Collected

If you stay opted in, GitHub will collect:

- Code snippets you type and accept from Copilot suggestions
- Inputs sent to Copilot, including surrounding file context
- Repository structure, file names, and navigation patterns
- Feedback signals like thumbs up/down ratings
- Chat conversations and inline suggestion interactions

GitHub explicitly excludes data from Business, Enterprise, and enterprise-owned repositories. If you're on a team plan, your work is protected.

## Why Now

GitHub says it already saw "meaningful improvements" after incorporating Microsoft employee interaction data — higher acceptance rates across multiple languages. The company argues this is standard industry practice and frames it as a quality trade-off: contribute your patterns, get better suggestions.

The timing matters. Copilot faces real competition from Claude Code, Cursor, and JetBrains' AI tooling. Training on user data is one way to close the gap without charging more.

## How to Opt Out

If you'd rather not contribute:

1. Go to **GitHub Settings → Copilot** (or navigate directly to `github.com/settings/copilot`)
2. Find the **"Privacy"** section
3. Disable the toggle for model training

If you already had this setting disabled, your preference carries over automatically.

## The Bigger Picture

This is a familiar pattern in the AI era: free or cheap access in exchange for data. The difference here is that developers — who tend to be privacy-conscious — are the product. Code snippets can reveal proprietary logic, internal API designs, and business-specific implementations.

Several open source maintainers have already raised concerns. Code uploaded to public GitHub repos is already scraped for training data; this policy extends that dynamic to private repos used via Copilot.

The opt-out is available today. Whether you consider this a fair trade for smarter autocomplete is a judgment call — but it's worth knowing the clock started.

---

*If you found this useful, [subscribe to ts.news](/) for daily TypeScript and JavaScript ecosystem coverage.*
