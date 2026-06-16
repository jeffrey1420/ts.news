---
title: "Zwei Open-Source-Coding-Modelle in einer Woche: Kimi K2.7-Code und Xiaomi MiMo Code"
description: "Moonshot AI hat Kimi K2.7-Code veröffentlicht, ein 1T-Parameter-MoE-Coding-Modell mit 32B aktivierten Parametern und 30% weniger Thinking-Tokens gegenüber K2.6. Xiaomi folgte mit MiMo Code, einem weiteren Open-Weights-Coding-Modell. Das steht tatsächlich auf der Model Card."
date: 2026-06-12
image: "/images/heroes/2026-06-12--kimi-k2-7-code-mimo-code.png"
author: lschvn
tags: ["ai", "performance", "ecosystem"]
tldr:
  - "Moonshot AI hat Kimi K2.7-Code veröffentlicht, ein 1T-Parameter-MoE-Coding-Modell mit 32B aktivierten Parametern, 256K Kontext und etwa 30% weniger Thinking-Tokens gegenüber K2.6, Open Source auf Hugging Face."
  - "Xiaomi lieferte MiMo Code in derselben Woche als Open-Weights-Release, das damit das zweite Open-Source-Coding-Modell in einem engen Zeitfenster ist."
  - "Für selbstgehostete Dev-Tools (Continue, Aider, OpenCode, Cline mit lokalem Backend) erweitert das die praxisnahe Auswahl an Modellen, die ohne Anthropic, OpenAI oder Google betrieben werden können."
faq:
  - question: "Was ist Kimi K2.7-Code?"
    answer: "Ein coding-fokussiertes agentisches Modell von Moonshot AI, gebaut auf der K2.6-Basis. Es ist ein 1T-Parameter-Mixture-of-Experts-Modell mit 32B pro Token aktivierten Parametern, 256K Kontextlänge, MLA-Attention, SwiGLU-Aktivierung und einem 160K-Vokabular. Moonshot berichtet von etwa 30% weniger Thinking-Tokens gegenüber K2.6 bei denselben Aufgaben, mit stärkerer End-to-End-Vollständigkeit bei langlaufenden Software-Engineering-Workloads. Open Source auf Hugging Face unter Moonshots Release-Bedingungen."
  - question: "Was ist MiMo Code?"
    answer: "MiMo Code ist Xiaomis Open-Weights-Coding-Modell, veröffentlicht in derselben Woche wie Kimi K2.7-Code. Xiaomi hat noch keine Model Card mit dem gleichen architektonischen Detaillierungsgrad wie Moonshot veröffentlicht; das öffentliche Material positioniert MiMo Code als coding-fokussierten Drop, mit offenen Gewichten und dem gleichen Framing für agentische Workloads."
  - question: "Wie schlagen sich diese im Vergleich zu Claude Fable 5 oder GPT-Class-Coding-Modellen?"
    answer: "Closed-Weight-Frontier-Modelle führen weiterhin in den meisten Software-Engineering-Benchmarks; die relevante Frage für selbstgehostetes Tooling ist, ob die Open-Weights-Alternativen die Lücke genug schließen, um für die jeweilige Workload nützlich zu sein. Die Architekturzahlen legen nahe, dass Kimi K2.7-Code die Reserven hat (1T Parameter, 256K Kontext); die offene Frage sind Inferenzkosten und wie das Open-Weights-Ökosystem bei agentischem Scaffolding, Tool-Use und langfristiger Planung aufholt."
  - question: "In welchen Dev-Tools kann ich diese heute laufen lassen?"
    answer: "Jedes Tool mit lokalem Modell-Backend, das einen Hugging-Face-Checkpoint laden kann: Continue, Aider, OpenCode, Cline mit lokalem Backend, Cursor mit Custom-Modellen, plus LangChain- und LlamaIndex-Scaffolds. Kimi K2.7-Code mit 1T Parametern ist kein Single-GPU-Modell; für Produktionseinsatz ist Multi-GPU oder ein gehosteter Inferenz-Partner realistisch. MiMo Code ist auf Consumer-Hardware das zugänglichere der beiden."
---

Zwei Open-Weights-Coding-Modelle sind in derselben Woche erschienen. [Moonshot AI hat Kimi K2.7-Code](https://huggingface.co/moonshotai/Kimi-K2.7-Code) auf Hugging Face als coding-fokussierten agentischen Build der Kimi-K2.6-Basis veröffentlicht, und Xiaomi hat MiMo Code als separaten Open-Weights-Drop geliefert. Für TypeScript- und JavaScript-Entwickler:innen, die ihre Dev-Tools selbst hosten, erweitert das die praxisnahe Auswahl an Modellen, die hinter Continue, Aider, OpenCode oder jedem anderen Tool mit lokalem Modell-Backend sitzen können.

## Kimi K2.7-Code

Kimi K2.7-Code ist ein 1T-Parameter-Mixture-of-Experts-Modell mit 32B pro Token aktivierten Parametern, 61 Schichten (eine dense), 7168-dim Attention-Hidden-State, 2048-dim MoE-Hidden-State pro Experte, 64 Attention-Heads, 384 Experten mit 8 pro Token ausgewählten, und einem Shared Expert. Das Vokabular umfasst 160K, die Kontextlänge liegt bei 256K. Die Attention ist Multi-head Latent Attention (MLA), die Aktivierung SwiGLU, und das Modell wird mit einem 400M-Parameter-MoonViT-Vision-Encoder ausgeliefert, wobei die Coding-Variante zur Inferenzzeit text-only ist.

Die Schlagzeilen-Metrik von Moonshot ist ein Rückgang der Thinking-Token-Nutzung um etwa 30% gegenüber K2.6 bei denselben langlaufenden Coding-Aufgaben, gepaart mit stärkerer End-to-End-Vollständigkeit bei mehrstufiger Software-Engineering-Arbeit. Die 256K Kontext sind die praktische Geschichte für Aufgaben, die eine große TypeScript-Codebase umspannen: das Modell kann einen aussagekräftigen Ausschnitt eines echten Repos plus das Issue, den Testplan und die vorherige Konversation halten.

Die Architektur impliziert ein paar Dinge fürs Self-Hosting. Bei 1T Parametern ist K2.7-Code kein Single-GPU-Modell. Multi-GPU ist das Minimum, und ein gehosteter Inferenz-Partner ist die realistische Produktionsgeschichte. Das agentische Scaffolding (Tool-Use, Planung, Fehler-Recovery) ist der Engpass, nicht die Gewichte selbst. Erwartet, dass die Lücke zwischen dem rohen Modell und einem Agent der Claude-Fable-5-Klasse bei rohen Coding-Benchmarks viel kleiner ist als bei langlaufenden agentischen Evaluierungen.

## Xiaomi MiMo Code

[Xiaomis MiMo Code](https://mimo.xiaomi.com/mimocode) ist der zweite Open-Weights-Drop der Woche, und auf Consumer-Hardware das zugänglichere der beiden. Xiaomi hat noch keine Model Card mit dem gleichen architektonischen Detaillierungsgrad wie Moonshot veröffentlicht; das öffentliche Material positioniert MiMo Code als coding-fokussierten Drop mit offenen Gewichten und dem gleichen Framing für agentische Workloads.

Die Relevanz ist gleichzeitig symbolisch und praktisch. Zwei Open-Weights-Coding-Modelle in einer einzigen Woche, von zwei verschiedenen chinesischen Anbietern, ist ein starkes Signal, dass die Open-Weights-Frontier keine Single-Vendor-Geschichte mehr ist. Für selbstgehostete Dev-Tools ist das Menü nun breit genug, um Architekturen zu vergleichen, nicht nur Parameterzählungen.

## Was das für selbstgehostete Dev-Tools bedeutet

Die praktische Frage für ein TypeScript-Team, das einen lokalen Coding-Agent betreibt, ist, ob die Open-Weights-Alternative gut genug für die jeweilige Workload ist. Die Antwort hängt davon ab, was der Agent tun muss.

Für Code-Vervollständigung, Single-File-Edits und eng umrissene Refactorings hat das Open-Weights-Ökosystem seit über einem Jahr brauchbare Optionen. Für agentische Aufgaben, die Multi-File-Reasoning, langfristige Kontextbeibehaltung und verlässlichen Tool-Use über viele Turns hinweg erfordern, ist die Lücke zur Closed-Weight-Frontier (Claude Fable 5, GPT-Klasse, Gemini-Klasse) weiterhin real, aber enger als vor sechs Monaten. Der [Aufstieg von Claude Code 2026](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026) und das [Dev-Tool-Ranking vom März 2026](/articles/2026-03-25-ai-dev-tool-rankings-march-2026) wurden geschrieben, als das Open-Weights-Menü eine Ein-Punkt-Liste war. Nach dieser Woche ist es mindestens eine kurze Liste, und die Closed-Weight-Anbieter müssen weiterhin Kapazitätssprünge liefern, um vorn zu bleiben.

Tooling-seitig: Continue, Aider, OpenCode und Cline mit lokalem Backend können alle heute einen Hugging-Face-Checkpoint laden. Kimi K2.7-Code mit 1T Parametern braucht Multi-GPU; MiMo Code ist der Kandidat für Laptop-Inferenz. Die Architekturzahlen legen nahe, dass K2.7-Code die Reserven für ernsthafte Arbeit hat, aber der Praxistest ist, ob das agentische Scaffold sie nutzen kann. Dieselbe Evaluierung wird auf [die Service-powered TS Engine in WebStorm 2026.1](/articles/2026-04-09-webstorm-2026-1-service-powered-ts-engine-ai-agents) und jeden anderen Editor zutreffen, der einen lokalen Modell-Picker anbietet.
