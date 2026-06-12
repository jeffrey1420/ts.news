---
title: "Two Open-Source Coding Models in a Week: Kimi K2.7-Code and Xiaomi MiMo Code"
description: "Moonshot AI released Kimi K2.7-Code, a 1T-parameter MoE coding model with 32B activated and a 30% drop in thinking tokens versus K2.6. Xiaomi followed with MiMo Code, another open-weights coding model. Here is what is actually on the model card."
date: 2026-06-12
image: "/images/heroes/2026-06-12--kimi-k2-7-code-mimo-code.png"
author: lschvn
tags: ["ai", "ecosystem", "performance"]
tldr:
  - "Moonshot AI released Kimi K2.7-Code, a 1T-parameter MoE coding model with 32B activated parameters, 256K context, and a roughly 30% drop in thinking tokens versus K2.6, open-source on Hugging Face."
  - "Xiaomi shipped MiMo Code as an open-weights coding model in the same week, making it the second open-source coding model release in a tight window."
  - "For self-hosted dev tools (Continue, Aider, OpenCode, Cline with a local backend), this widens the practical menu of models you can run without going through Anthropic, OpenAI, or Google."
faq:
  - question: "What is Kimi K2.7-Code?"
    answer: "A coding-focused agentic model from Moonshot AI, built on the K2.6 base. It is a 1T-parameter Mixture-of-Experts model with 32B parameters activated per token, 256K context length, MLA attention, SwiGLU activation, and a 160K vocabulary. Moonshot reports roughly 30% fewer thinking tokens than K2.6 on the same tasks, with stronger end-to-end completion on long-horizon software engineering workloads. It is open-source on Hugging Face under Moonshot's release terms."
  - question: "What is MiMo Code?"
    answer: "MiMo Code is Xiaomi's open-weights coding model, released the same week as Kimi K2.7-Code. Xiaomi has not published a model card with the same level of architectural detail as Moonshot; the headline is that it ships as open weights and is positioned for the same coding-agent workloads."
  - question: "How do these compare to Claude Fable 5 or GPT-class coding models?"
    answer: "Closed-weight frontier models still lead on most software engineering benchmarks; the relevant question for self-hosted tooling is whether the open-weights alternatives close the gap enough to be useful for your workload. The architecture numbers suggest Kimi K2.7-Code has the headroom (1T params, 256K context); the open question is inference cost and how the open-weights ecosystem catches up on agentic scaffolding, tool use, and long-horizon planning."
  - question: "Which dev tools can I run these in today?"
    answer: "Any tool with a local-model backend that can load a Hugging Face checkpoint: Continue, Aider, OpenCode, Cline with a local backend, Cursor with custom models, plus LangChain and LlamaIndex scaffolds. Kimi K2.7-Code at 1T parameters is not a single-GPU model; expect multi-GPU or a hosted inference partner for production use. MiMo Code is the more accessible of the two on consumer hardware."
---

Two open-weights coding models landed in the same week. [Moonshot AI released Kimi K2.7-Code](https://huggingface.co/moonshotai/Kimi-K2.7-Code) on Hugging Face as the coding-focused agentic build of the Kimi K2.6 base, and Xiaomi shipped MiMo Code as a separate open-weights drop. For TypeScript and JavaScript developers who self-host their dev tools, this widens the practical menu of models that can sit behind Continue, Aider, OpenCode, or any other tool with a local-model backend.

## Kimi K2.7-Code

Kimi K2.7-Code is a 1T-parameter Mixture-of-Experts model with 32B parameters activated per token, 61 layers (one dense), 7168-dim attention hidden state, 2048-dim MoE hidden state per expert, 64 attention heads, 384 experts with 8 selected per token, and one shared expert. The vocabulary is 160K and the context length is 256K. Attention is Multi-head Latent Attention (MLA), activation is SwiGLU, and the model ships with a 400M-parameter MoonViT vision encoder, although the coding variant is text-only at inference time.

The headline metric from Moonshot is a roughly 30% drop in thinking-token usage versus K2.6 on the same long-horizon coding tasks, paired with stronger end-to-end completion on multi-step software engineering work. The 256K context is the practical story for tasks that span a large TypeScript codebase: the model can hold a meaningful slice of a real repo plus the issue, the test plan, and the prior conversation.

The architecture implies a few things for self-hosting. At 1T parameters, K2.7-Code is not a single-GPU model. Multi-GPU is the floor, and a hosted inference partner is the realistic production story. The agentic scaffolding (tool use, planning, error recovery) is the bottleneck, not the weights themselves. Expect the gap between the raw model and a Claude Fable 5-class agent to be much smaller on raw coding benchmarks than on long-horizon agentic evaluations.

## Xiaomi MiMo Code

[Xiaomi's MiMo Code](https://mimo.xiaomi.com/mimocode) is the second open-weights coding model release of the week, and the more accessible of the two on consumer hardware. Xiaomi has not yet published a model card with the same level of architectural detail as Moonshot; the public material positions MiMo Code as a coding-focused drop, with open weights and the same general agentic workload framing.

The relevance is symbolic and practical at the same time. Two open-weights coding models in a single week from two separate Chinese vendors is a strong signal that the open-weights frontier is no longer a single-vendor story. For self-hosted dev tools, the menu is now wide enough to compare architectures, not just parameter counts.

## What this means for self-hosted dev tools

The practical question for a TypeScript team running a local coding agent is whether the open-weights alternative is good enough for your workload. The answer depends on what the agent has to do.

For code completion, single-file edits, and tightly-scoped refactors, the open-weights ecosystem has had workable options for over a year. For agentic tasks that require multi-file reasoning, long-context retention, and reliable tool use across many turns, the gap to the closed-weight frontier (Claude Fable 5, GPT-class, Gemini-class) is still real, but it is narrower than it was six months ago. The [Claude Code rise in 2026](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026) and the [March 2026 dev-tool rankings](/articles/2026-03-25-ai-dev-tool-rankings-march-2026) were written when the open-weights menu was a single line item. After this week, it is at least a short list, and the closed-weight vendors will need to keep shipping capability lifts to stay ahead.

For tooling: Continue, Aider, OpenCode, and Cline with a local backend can all load a Hugging Face checkpoint today. Kimi K2.7-Code at 1T parameters wants multi-GPU; MiMo Code is the candidate for laptop inference. The architectural numbers suggest K2.7-Code has the headroom for serious work, but the practical test is whether your agentic scaffold can make use of it. The same evaluation will apply to the [WebStorm 2026.1 service-powered TS engine](/articles/2026-04-09--webstorm-2026-1-service-powered-ts-engine-ai-agents) and any other editor that surfaces a local model picker.
