---
title: "Sakana Fugu Wraps a Multi-Agent Orchestrator Behind a Single API, Claims Frontier Parity With Fable and Mythos"
description: "Sakana AI launched Fugu on June 22, 2026, a multi-agent orchestration system delivered as a single OpenAI-compatible API. Two models, Fugu and Fugu Ultra, coordinate a pool of closed-source LLMs using learned orchestration from two ICLR 2026 papers (TRINITY and Conductor). Fugu Ultra posts benchmark scores competitive with Anthropic's Fable 5 and Mythos Preview, but the release draws sharp criticism over cost transparency, closed-source dependencies, and benchmark methodology."
date: 2026-06-22
image: "/images/heroes/2026-06-22--sakana-fugu-multi-agent-orchestration-frontier.png"
author: lschvn
tags: ["ai", "ecosystem"]
tldr:
  - "Sakana AI launched Fugu, a multi-agent orchestration system delivered as one model API. Fugu dynamically selects, delegates to, and coordinates a pool of LLMs (including itself recursively) using learned orchestration from two ICLR 2026 papers: TRINITY (a ~0.6B evolutionary coordinator) and Conductor (a 7B RL-trained coordinator). Two tiers: Fugu (balanced latency) and Fugu Ultra (maximum quality on hard tasks)."
  - "Fugu Ultra scores 73.7 on SWE-bench Pro, 82.1 on TerminalBench 2.1, and 93.2 on LiveCodeBench, placing it alongside Opus 4.8 (69.2 / 74.6 / 87.8) and ahead of GPT 5.5 (58.6 / 78.2 / 85.3). The catch: the baselines use provider-reported scores, the agent pool contents are undisclosed, and no token count or cost-per-benchmark is reported."
  - "The launch is framed as 'AI sovereignty': a hedge against single-vendor dependency after Anthropic's Fable and Mythos export controls. Pricing starts at $20/month (Standard), $100/month (Pro), $200/month (Max), plus pay-as-you-go at $5/1M input tokens. Not available in the EU/EEA (GDPR pending). Critics note the system is a closed-source orchestrator on top of closed-source models, which undermines the sovereignty narrative."
faq:
  - question: "What is Sakana Fugu?"
    answer: "Sakana Fugu is a multi-agent orchestration system from Sakana AI (Tokyo) that behaves like a single model. You call one OpenAI-compatible API endpoint, and Fugu internally decides whether to answer directly or coordinate a team of expert LLMs. Fugu itself is a language model trained to call other LLMs, including recursive self-calls. Two tiers: Fugu (balanced latency for everyday use) and Fugu Ultra (deeper agent pool for hard, multi-step problems)."
  - question: "How does Fugu compare to Opus 4.8, GPT 5.5, and Gemini 3.1 Pro?"
    answer: "On the benchmarks Sakana publishes, Fugu Ultra scores 73.7 on SWE-bench Pro (vs. Opus 4.8 at 69.2, GPT 5.5 at 58.6, Gemini 3.1 Pro at 54.2), 82.1 on TerminalBench 2.1 (vs. 74.6, 78.2, 70.3), and 93.2 on LiveCodeBench (vs. 87.8, 85.3, 88.5). The important caveat: all baseline scores are provider-reported, and Fugu Ultra's scores include the cost of orchestrating multiple model calls, which Sakana does not disclose. The base Fugu model scores lower: 59.0 on SWE-bench Pro, 80.2 on TerminalBench."
  - question: "What are TRINITY and Conductor?"
    answer: "TRINITY (ICLR 2026, arxiv 2512.04695) is a ~0.6B-parameter coordinator trained with an evolutionary strategy (CMA-ES) to assign Thinker, Worker, or Verifier roles to LLMs across multiple turns. Conductor (ICLR 2026, arxiv 2512.04388) is a 7B model trained with reinforcement learning to discover natural-language coordination strategies, designing agent communication topologies and focused prompts. Both papers show that learned orchestration outperforms hand-designed multi-agent workflows on reasoning benchmarks."
  - question: "Is Fugu open source?"
    answer: "No. Fugu is a closed-source API product. The orchestrator model, the agent pool composition, and the coordination logic are proprietary. The two ICLR papers (TRINITY and Conductor) describe the research foundations, but the production system is not open-weights. The agent pool consists of closed-source API models; Sakana does not disclose which ones."
  - question: "What is the 'AI sovereignty' framing?"
    answer: "Sakana positions Fugu as a hedge against single-vendor dependency, citing Anthropic's recent export controls on Fable and Mythos. The argument: if one provider restricts access, Fugu dynamically routes around the disruption by swapping agents in its pool. Critics note that Fugu itself is a closed-source system routing to closed-source models, so the sovereignty claim applies to orchestration flexibility, not to independence from closed-source AI."
  - question: "How much does Fugu cost?"
    answer: "Subscription tiers: Standard ($20/month), Pro ($100/month), Max ($200/month). All tiers include both Fugu and Fugu Ultra. Pay-as-you-go: $5/1M input tokens, $30/1M output tokens, $0.50/1M cached input. For contexts above 272K tokens, rates double ($10/1M input, $45/1M output, $1.00/1M cached). Sakana reports per-request token usage for cost tracking. The missing number: how many tokens a benchmark task actually consumed through the orchestration layer."
  - question: "What are the main criticisms of the Fugu launch?"
    answer: "ML engineer Elie Bakouch (@eliebakouch) identifies several: (1) Fugu is a closed-source orchestrator on closed-source models, which contradicts the 'sovereignty' framing. (2) Fugu (non-Ultra) is essentially a router that selects the best model per turn, scoring 10 points below Opus on SWE-bench Pro. (3) Fugu Ultra pre-plans workflows at t=0 rather than adapting at each step, limiting it to 5-step plans. (4) Sakana never reports output token counts or cost per benchmark, making it impossible to compare cost-efficiency. (5) The AutoResearch comparison uses anonymized 'Model A/B/C' baselines without naming the models."
  - question: "Is Fugu available in the EU?"
    answer: "Not yet. The product page states: 'Not yet available in the EU/EEA while we work toward compliance with GDPR and EU-specific regulations.' No timeline is given."
---

[Sakana AI](https://sakana.ai/) launched [Sakana Fugu](https://sakana.ai/fugu) on June 22, 2026, a multi-agent orchestration system delivered as a single OpenAI-compatible model API. The product ships two tiers: Fugu, balanced for latency and everyday use, and Fugu Ultra, tuned for maximum quality on hard multi-step tasks. The headline claim: Fugu Ultra matches the performance of Anthropic's Fable 5 and Mythos Preview across coding, reasoning, and scientific benchmarks, without the export-control risk.

The launch tweet from [hardmaru (David Ha)](https://x.com/hardmaru/status/2068884466056225025), Sakana AI's co-founder, frames the product as a philosophical bet: "Human intelligence is fundamentally a collective intelligence. We solve complex problems by participating in a vast cultural network that builds upon ideas across generations. I believe the strongest AI systems will become a collective intelligence, too." The post has 1,056 likes and 131 retweets at time of writing. The [announcement tweet](https://x.com/SakanaAILabs/status/2068861630327443966) from the official account has over 9,000 likes and 3.7M views.

## The framing: "Orchestration Models are the Next Frontier"

Sakana's pitch is not "we built a bigger model." It is "we built a model that commands other models." The release blog calls this an "Orchestration Model," positioning it beyond the brute-force scaling paradigm. Fugu is itself a language model, trained to decide when to delegate, which agents to assemble, how they should communicate, and how to synthesize their outputs into a single answer.

The geopolitical angle is deliberate. The release blog cites Anthropic's recent [export controls on Fable and Mythos](https://sakana.ai/fugu-release) as the motivating event: "access to top models can disappear overnight." Fugu's pitch: if a provider restricts access, the system routes around the disruption by swapping agents in its pool. hardmaru calls this "the resilient blueprint required for AI sovereignty."

The framing correction: this is sovereignty over orchestration, not sovereignty over the models themselves. Fugu's agent pool consists of closed-source API models that Sakana does not name. If the underlying providers restrict access, Fugu can swap, but it still depends on external closed-source models being available. The sovereignty claim is real at the routing layer but does not extend to model independence.

## The architecture: TRINITY and Conductor

Fugu's orchestration rests on two ICLR 2026 papers:

**TRINITY** ([arxiv 2512.04695](https://arxiv.org/abs/2512.04695)) introduces a lightweight coordinator (~0.6B parameters plus a ~10K-parameter head) optimized with an evolutionary strategy (CMA-ES, Covariance Matrix Adaptation Evolution Strategy). The coordinator processes queries over multiple turns, assigning one of three roles at each turn: Thinker (reasoning), Worker (execution), or Verifier (checking). The key insight: under high dimensionality and strict budget constraints, CMA-ES outperforms reinforcement learning, imitation learning, and random search by exploiting block-epsilon-separability in the parameter space. The paper reports 86.2% on LiveCodeBench, outperforming individual frontier models.

**Conductor** ([arxiv 2512.04388](https://arxiv.org/abs/2512.04388)) is a 7B model trained with reinforcement learning to discover natural-language coordination strategies. Where TRINITY assigns fixed roles, Conductor learns to design agent communication topologies and focused prompts. The model is trained with randomized agent pools, so it generalizes to arbitrary sets of open- and closed-source agents at inference time. Allowing the Conductor to select itself as a worker creates recursive topologies, a form of dynamic test-time scaling through online iterative adaptation.

Together, these two papers provide the research foundation. Fugu the product wraps them into a system where the user calls one endpoint and the orchestration happens internally.

## Two models, one API

Fugu ships as two models, both accessible through a single OpenAI-compatible API:

**Fugu** (the base model) balances performance with latency. It is designed for everyday work: coding assistance, code review, chatbot services. Sakana positions it as a drop-in replacement for single-model endpoints in tools like Codex. Teams with compliance requirements can opt specific agents out of its pool.

**Fugu Ultra** coordinates a deeper pool of expert agents for maximum answer quality. Early users report deploying it for Kaggle competitions, paper reproduction, cybersecurity analysis, and patent investigations. The key difference: Fugu Ultra can assemble multi-step workflows where different specialized models handle planning, execution, and verification.

The integration is straightforward. No multi-agent framework setup, no agent definitions, no workflow configuration. You send a request to one endpoint and the system handles the rest.

## The benchmark table

Here are the numbers Sakana publishes, reproduced verbatim:

| Benchmark | Fugu | Fugu Ultra | Opus 4.8 † | Gemini 3.1 Pro † | GPT 5.5 † |
|---|---|---|---|---|---|
| SWE-bench Pro * | 59.0 | **73.7** | 69.2 | 54.2 | 58.6 |
| TerminalBench 2.1 | 80.2 | **82.1** | 74.6 | 70.3 | 78.2 |
| LiveCodeBench | 92.9 | **93.2** | 87.8 | 88.5 | 85.3 |
| LiveCodeBench Pro | 87.8 | **90.8** | 84.8 | 82.9 | 88.4 |
| Humanity's Last Exam | 47.2 | **50.0** | 49.8 | 44.4 | 41.4 |
| CharXiv Reasoning | 85.1 | **86.6** | 84.2 | 83.3 | 84.1 |
| GPQA-D | 95.5 | 95.5 | 92.0 | 94.3 | 93.6 |
| SciCode | 60.1 | 58.7 | 53.5 | 58.9 | 56.1 |
| τ³ Banking | 21.7 | 20.6 | 20.6 | 8.4 | 20.6 |
| Long Context Reasoning | 74.7 | 73.3 | 67.7 | 72.7 | 74.3 |
| MRCRv2 | 86.6 | **93.6** | 87.9 | 84.9 | 94.8 |

*\* Uses mini-swe-agent as scaffolding.*
*† Provider-reported scores.*

The footnotes matter. All baseline scores come from the model providers themselves, not from independent reproduction. Fugu's scores are Sakana's own measurements. The comparison is asymmetric: Fugu Ultra runs through an orchestration layer that spawns multiple model calls per task, while the baselines are single-model evaluations. Sakana does not report how many tokens Fugu Ultra consumes per benchmark task, what the per-task cost is, or how many agent turns each problem takes.

On SWE-bench Pro, Fugu Ultra's 73.7 beats Opus 4.8's 69.2 by 4.5 points. On TerminalBench 2.1, the gap is 7.5 points (82.1 vs. 74.6). On LiveCodeBench, it is 5.4 points (93.2 vs. 87.8). These are real gaps, but the cost-to-achieve comparison is missing. As ML engineer [Elie Bakouch](https://x.com/eliebakouch/status/2068939729811468503) notes: "they are introducing a 'test time scaling' method with 'best of N' over models, and they literally NEVER REPORT the number of output tokens or cost to achieve a benchmark/task."

## The qualitative demos

Beyond benchmarks, Sakana showcases six demo scenarios where Fugu Ultra outperforms frontier baselines:

1. **AutoResearch** (Karpathy et al. framework): An AI agent autonomously improved a small GPT's training recipe over 123 experiments on a single H100 GPU in ~14 hours. Fugu Ultra achieved a mean BPB of 0.9774 ± 0.0019, ahead of three anonymized frontier baselines ("Model A/B/C"). Sakana does not name which models A, B, and C are.

2. **Kana letter reading order**: Classical Japanese handwriting analysis on a 1610 letter. Fugu Ultra scored 0.80 NED (normalized edit distance) vs. Model A at 0.24.

3. **Rubik's Cube solver generation**: Code generation for a physical puzzle.

4. **CAD mechanical iris**: Mechanical design generation.

5. **Blindfold chess**: One-shot chess game generation.

6. **Time-series trading**: Financial prediction.

The demos are visually compelling (video walkthroughs are embedded on the product page), but the anonymized baselines make independent verification impossible. The AutoResearch experiment is particularly interesting because it tests sustained multi-step agentic work, which is Fugu Ultra's designed sweet spot.

## Pricing and deployment

Sakana offers both subscription and pay-as-you-go pricing:

**Subscription tiers** (all include both Fugu and Fugu Ultra):
- Standard: $20/month
- Pro: $100/month
- Max: $200/month

**Pay-as-you-go** (per 1M tokens):
- Input: $5
- Output: $30
- Cached input: $0.50
- Above 272K context: $10 input, $45 output, $1.00 cached

Sakana reports per-request token usage so users can track spend in real time. The API is OpenAI-compatible, so integration requires changing an endpoint URL and model name.

**Not available in the EU/EEA.** The product page states compliance with GDPR and EU-specific regulations is in progress. No timeline.

The missing cost data: how many tokens a typical Fugu Ultra task consumes. If Fugu Ultra spawns 5 agent calls per problem (the limit Bakouch identifies), and each call uses a frontier model, the effective cost per task is 5x the per-token rate. For SWE-bench Pro, where Fugu Ultra runs through mini-swe-agent scaffolding, the total token count per problem is unknown.

## The critical take

The most detailed public critique comes from [Elie Bakouch](https://x.com/eliebakouch/status/2068939729811468503), an ML engineer who read the technical report. His analysis:

1. **Fugu (non-Ultra) is a router.** It selects which model is most likely to answer correctly at each turn. This is a classifier, not an orchestrator. It scores 10 points below Opus on SWE-bench Pro (59.0 vs. 69.2).

2. **Fugu Ultra is "advanced plan mode."** It outputs a plan with multiple workflows at t=0, before agents start working. Bakouch argues this is the wrong architecture: "you need to predict what to spawn at t+1 with the information you get at t, not with the info you get at t=0." The system is limited to 5 steps.

3. **Closed source on closed source.** "If before you didn't control the models, now you don't even control which ones are used or how much."

4. **No cost transparency.** The biggest issue: introducing a test-time scaling method with best-of-N over models while never reporting output token counts or cost.

5. **Anonymized baselines.** The AutoResearch comparison uses "Model A, B, and C" without naming them. "This is really crazy to not be transparent about what models you compare against."

6. **Wrong comparison frame.** The fair comparison is not Fugu Ultra vs. raw Opus, but Fugu Ultra vs. Opus with ultracode/workflows enabled. Similarly, the comparison should be against Kimi Swarm, not raw Kimi.

The criticism is substantive. The sovereignty narrative is compelling at the geopolitical level but thin at the technical level: Fugu depends on the same closed-source providers it claims to hedge against. The benchmark numbers are real but incomparable without cost data. The architecture is novel (learned orchestration beats hand-designed workflows) but the production system's constraints (closed pool, 5-step limit, no adaptation during execution) narrow its advantage.

## What to watch

1. **Independent benchmark reproduction.** The most important signal. Can third parties reproduce Fugu Ultra's SWE-bench Pro and TerminalBench scores with the public API? The mini-swe-agent scaffolding is open-source; anyone can run the evaluation.

2. **Token count disclosure.** Will Sakana publish per-task token counts for benchmark problems? Without this, cost-efficiency claims are unverifiable.

3. **Agent pool transparency.** Which models are in the pool? Sakana says "closed-source API models" but does not name them. If the pool is GPT 5.5 + Opus 4.8 + Gemini 3.1 Pro, the orchestration story is about routing, not about building frontier capability.

4. **EU/EEA availability.** GDPR compliance is the blocker. Watch for Sakana's DPA (Data Processing Agreement) and EU data residency commitments.

5. **Open-weights models in the pool.** Sakana plans to add open models and its own models. If Fugu's pool includes Llama 4, Qwen 3.7, or Sakana's own trained models, the sovereignty story strengthens materially.

6. **Recursive self-orchestration depth.** The Conductor paper shows recursive topologies (the orchestrator calls itself). How deep does this go in production? Recursive orchestration is the most novel technical claim and the hardest to verify from the outside.

7. **Community adoption.** 500 beta users is a meaningful signal. Watch for Kaggle competition results, cybersecurity audit reports, and code review quality comparisons using the public API.

## The bottom line

Sakana Fugu is the first production system that packages learned multi-agent orchestration as a single API endpoint. The research foundation (TRINITY + Conductor, both ICLR 2026) is solid, and the benchmark numbers are competitive with the current frontier. The "Orchestration Model" framing is the right long-term bet: as models proliferate, the coordination layer becomes the differentiator.

The launch's weakness is transparency. No cost-per-benchmark, no agent pool disclosure, no independent reproduction, anonymized baselines in demos. The sovereignty narrative is emotionally resonant but technically incomplete: Fugu routes around vendor restrictions at the orchestration layer while depending on the same vendors at the model layer. For developers evaluating Fugu, the practical question is not "does it beat Opus?" but "does it beat Opus at the same or lower cost?" That question remains unanswered.
