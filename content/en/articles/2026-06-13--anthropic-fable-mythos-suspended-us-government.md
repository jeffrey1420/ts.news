---
title: "US Government Orders Anthropic to Suspend Fable 5 and Mythos 5 Worldwide; Anthropic Pushes Back"
description: "On June 12, 2026 at 5:21pm ET, Anthropic received an export control directive from the US government requiring it to disable Fable 5 and Mythos 5 for every user, including foreign nationals inside the United States. Anthropic is complying while publicly disputing the technical basis of the order."
date: 2026-06-13
image: "/images/heroes/2026-06-13--anthropic-fable-mythos-suspended-us-government.png"
author: lschvn
tags: ["security", "ai", "ecosystem"]
tldr:
  - "Anthropic received a US government export control directive on June 12 at 5:21pm ET to suspend Fable 5 and Mythos 5 for every user, including foreign nationals inside the United States and Anthropic's own foreign national employees."
  - "Anthropic says the cited concern is a 'narrow, non-universal jailbreak' that asks the model to read a codebase and flag flaws, a capability the company says GPT-5.5 and other public models already have and that defenders use every day."
  - "Anthropic is complying and removing access for all users, but is publicly disputing the order and asking for a 'statutory process that is transparent, fair, clear, and grounded in technical facts' before the standard is applied industry-wide."
faq:
  - question: "What exactly did the US government tell Anthropic to do?"
    answer: "Citing national security authorities, the US government issued an export control directive that requires Anthropic to suspend all access to Fable 5 and Mythos 5 by any foreign national, whether inside or outside the United States, including foreign national Anthropic employees. Because Fable 5 and Mythos 5 are deployed as a single, centrally served model, the only way to comply is to disable them for every user, not just the affected subset. Access to all other Anthropic models is not affected."
  - question: "Why does Anthropic disagree with the order?"
    answer: "Anthropic says the government provided verbal evidence of a narrow, non-universal jailbreak: asking the model to read a specific codebase and identify software flaws. Anthropic reviewed the underlying report and concluded the capability shown is widely available from other public models, including OpenAI's GPT-5.5, and is the same capability defenders use every day. Anthropic's view is that pulling a commercial model for this class of finding would, in practice, halt all new frontier model deployments across the industry."
  - question: "Which Claude models are still available?"
    answer: "Fable 5, Mythos 5, and any product or API surface that ran on them (Claude Code's top-tier mode, Cursor's frontier routing, enterprise Claude deployments that opted in) are affected. Claude Opus 4.8, Claude Sonnet, Claude Haiku, and the Mythos Preview access pathway used by Project Glasswing continue to work."
  - question: "How does this affect TypeScript and JavaScript developers today?"
    answer: "If your dev tool silently routed to Fable 5, expect prompts that previously returned the strongest results to fall back to Opus 4.8 with lower latency and lower cost, and to lose some long-horizon planning capability. The 30-day data retention policy that ships with Fable also stops applying once Fable is removed from your tool's surface. Anthropic says it is working to restore access."
  - question: "Is this the same as the Fable 5 distillation reversal from earlier in the week?"
    answer: "No. The June 11 reversal was about how Anthropic handled queries suspected of being model distillation attempts: invisible throttling was replaced with a visible fallback to Opus 4.8. This is a different and much larger action. The export control directive disables Fable 5 and Mythos 5 entirely for the affected population, on the basis of a cybersecurity concern, not a distillation concern."
---

The US government, citing national security authorities, has issued an export control directive ordering Anthropic to suspend all access to Fable 5 and Mythos 5 for any foreign national, including foreign national Anthropic employees. Anthropic [announced the order on June 12, 2026 at 5:21pm ET](https://www.anthropic.com/news/fable-mythos-access) and is complying, while publicly disputing the technical basis of the order. The practical effect for any developer using Claude today: the strongest Claude models are gone, at least for now, and the entire industry is watching what the government does next.

## What the order says

The directive covers Fable 5, the generally available Mythos-class model [Anthropic launched three days earlier](/articles/2026-06-12--fable-5-distillation-guardrails), and Mythos 5, the restricted sibling that ships through [Project Glasswing](/articles/2026-04-07--anthropic-project-glasswing-ai-finds-zero-days-faster-than-humans). The order applies to "any foreign national, whether inside or outside the United States, including foreign national Anthropic employees." Because the model is served centrally and there is no per-user way to exclude the affected population, the only compliant path is to disable both models for every user, not just the foreign national subset.

Anthropic's statement says the government's concern is a "method of bypassing, or 'jailbreaking' Fable 5." Anthropic reviewed a demonstration of the technique and concluded that the finding is narrow and not specific to Fable. To quote the company directly: "We have reviewed a report that we believe is the basis of the government's directive and validated that the level of capability displayed there is widely available from other models (including OpenAI's GPT-5.5), and is used every day by the defenders who keep systems safe."

## What Anthropic's defense in depth actually looks like

The dispute is not over whether Fable 5 has safeguards. It is over what the right response is when a narrow, non-universal bypass is disclosed. Anthropic's [Fable launch post](https://www.anthropic.com/news/claude-fable-5-mythos-5) laid out the strategy as defense in depth: make jailbreaks narrow when they exist, make them expensive to reproduce, and pair that with active monitoring to catch abuse. The plan includes a 30-day retention of customer data on Fable traffic, a change Anthropic acknowledges "carries real costs for us with customers" but enables the company to research and mitigate future jailbreaks. The launch post also said explicitly that "perfect jailbreak resistance is not currently possible for any model provider" and that universal jailbreaks would eventually be found. The current order tests that posture on a single, narrow finding.

## Why Anthropic is pushing back

The dispute is mostly about precedent. Anthropic's position is that pulling a commercial model for a narrow, non-universal jailbreak sets a bar the entire industry cannot meet: "If this standard was applied across the industry, we believe it would essentially halt all new model deployments for all frontier model providers."

Anthropic has also asked for a process, not just a result. From the statement: "As we have stated publicly, we believe the government should have the ability to block unsafe deployments, as part of a statutory process that is transparent, fair, clear, and grounded in technical facts. This action does not adhere to those principles." The company said it will share more details in the next 24 hours and is working to restore access.

## What this means for coding tools

For a TypeScript or JavaScript team using Claude Code, Cursor, Aider, Continue, Cline, or any other surface that routed to Fable 5, the practical impact is uneven. The strongest long-horizon refactor capability is gone until Anthropic resolves the order. The mid-tier Claude surface (Opus 4.8, Sonnet, Haiku) is unaffected. Tools that exposed Fable 5 as a separate picker will fall back to Opus 4.8 with no user-visible reason, and teams that set up a [webhook or fallback against Fable specifically](/articles/2026-04-04-tanstack-db-06-sqlite-persistence-local-first) need to know the model identifier is no longer the right default.

There is a second-order effect on the broader [self-hosted coding-model menu](/articles/2026-06-12--kimi-k2-7-code-mimo-code). When the strongest closed-weight option is unavailable, teams that can route to GPT-5.5, Gemini 3, or a self-hosted Kimi K2.7-Code get a clearer runway. The 30-day data retention change that came with Fable also stops applying, which removes a privacy point some enterprise buyers had flagged.

## What to watch

Three threads will be worth tracking. First, whether Anthropic's promised 24-hour follow-up contains a path to restoration. Second, whether other US-based frontier model providers (OpenAI, Google, xAI) issue their own statements, since the same theoretical jailbreak would apply to their models. Third, whether the order triggers a Congressional or industry response, since the underlying question, "what is the standard for pulling a deployed commercial model?", is now in the open.

For the moment, Fable 5 and Mythos 5 are off, Claude Code and Cursor will surface a different model, and the rest of the [AI coding tool ecosystem](/articles/2026-03-25-ai-dev-tool-rankings-march-2026) is the place to watch for fallout.
