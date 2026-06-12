---
title: "Deux modèles de code open-source en une semaine : Kimi K2.7-Code et Xiaomi MiMo Code"
description: "Moonshot AI a livré Kimi K2.7-Code, un modèle de code MoE à 1T de paramètres avec 32B activés et une baisse de 30% des thinking tokens vs K2.6. Xiaomi a suivi avec MiMo Code, un autre modèle de code open-weights. Voici ce qui figure sur la model card."
date: 2026-06-12
image: "/images/heroes/2026-06-12--kimi-k2-7-code-mimo-code.png"
author: lschvn
tags: ["ai", "ecosystem", "performance"]
tldr:
  - "Moonshot AI a livré Kimi K2.7-Code, un modèle de code MoE à 1T de paramètres avec 32B activés, 256K de contexte, et une baisse d'environ 30% des thinking tokens vs K2.6, open-source sur Hugging Face."
  - "Xiaomi a livré MiMo Code en open-weights la même semaine, ce qui en fait le deuxième modèle de code open-source dans une fenêtre serrée."
  - "Pour les outils de dev auto-hébergés (Continue, Aider, OpenCode, Cline avec backend local), cela élargit le menu pratique de modèles que vous pouvez faire tourner sans passer par Anthropic, OpenAI ou Google."
faq:
  - question: "Qu'est-ce que Kimi K2.7-Code ?"
    answer: "Un modèle agentique dédié au code, signé Moonshot AI, construit sur la base K2.6. C'est un modèle Mixture-of-Experts à 1T de paramètres avec 32B activés par token, 256K de contexte, attention MLA, activation SwiGLU, et un vocabulaire de 160K. Moonshot rapporte environ 30% de thinking tokens en moins par rapport à K2.6 sur les mêmes tâches, avec une meilleure complétion end-to-end sur des charges de génie logiciel long terme. Open-source sur Hugging Face sous les conditions de release de Moonshot."
  - question: "Qu'est-ce que MiMo Code ?"
    answer: "MiMo Code est le modèle de code open-weights de Xiaomi, livré la même semaine que Kimi K2.7-Code. Xiaomi n'a pas encore publié de model card avec le même niveau de détail architectural que Moonshot ; le matériel public positionne MiMo Code comme un drop dédié au code, avec poids ouverts et le même cadrage général de workload agentique."
  - question: "Comment ces modèles se comparent-ils à Claude Fable 5 ou aux modèles de code GPT-class ?"
    answer: "Les modèles closed-weight de pointe mènent toujours sur la plupart des benchmarks de génie logiciel ; la question pertinente pour l'outillage auto-hébergé est de savoir si les alternatives open-weights comblent suffisamment l'écart pour être utiles sur votre charge. Les chiffres d'architecture suggèrent que Kimi K2.7-Code a la marge (1T params, 256K contexte) ; la question ouverte est le coût d'inférence et la manière dont l'écosystème open-weights rattrape le retard sur le scaffolding agentique, l'usage d'outils et la planification long terme."
  - question: "Dans quels outils de dev puis-je les exécuter dès aujourd'hui ?"
    answer: "Tout outil disposant d'un backend de modèle local capable de charger un checkpoint Hugging Face : Continue, Aider, OpenCode, Cline avec backend local, Cursor avec modèles custom, plus les scaffolds LangChain et LlamaIndex. Kimi K2.7-Code à 1T de paramètres n'est pas un modèle single-GPU ; il faut s'attendre à du multi-GPU ou à un partenaire d'inférence hébergé pour un usage production. MiMo Code est le plus accessible des deux sur du hardware grand public."
---

Deux modèles de code open-weights ont atterri la même semaine. [Moonshot AI a livré Kimi K2.7-Code](https://huggingface.co/moonshotai/Kimi-K2.7-Code) sur Hugging Face comme build agentique dédié au code de la base Kimi K2.6, et Xiaomi a livré MiMo Code comme drop open-weights distinct. Pour les développeurs TypeScript et JavaScript qui auto-hébergent leurs outils de dev, cela élargit le menu pratique de modèles qui peuvent se brancher derrière Continue, Aider, OpenCode, ou tout autre outil avec backend de modèle local.

## Kimi K2.7-Code

Kimi K2.7-Code est un modèle Mixture-of-Experts à 1T de paramètres avec 32B activés par token, 61 couches (une dense), un état caché d'attention de 7168 dim, un état caché MoE de 2048 dim par expert, 64 têtes d'attention, 384 experts avec 8 sélectionnés par token, et un expert partagé. Le vocabulaire est de 160K et la longueur de contexte est 256K. L'attention est Multi-head Latent Attention (MLA), l'activation est SwiGLU, et le modèle est livré avec un encodeur vision MoonViT à 400M de paramètres, bien que la variante code soit text-only à l'inférence.

La métrique en avant de Moonshot est une baisse d'environ 30% de l'usage de thinking tokens par rapport à K2.6 sur les mêmes tâches de code long terme, associée à une meilleure complétion end-to-end sur le travail de génie logiciel multi-étapes. Les 256K de contexte sont l'histoire pratique pour les tâches qui couvrent une grande codebase TypeScript : le modèle peut tenir une part significative d'un vrai dépôt plus l'issue, le plan de test, et la conversation préalable.

L'architecture implique quelques choses pour l'auto-hébergement. À 1T de paramètres, K2.7-Code n'est pas un modèle single-GPU. Le multi-GPU est le plancher, et un partenaire d'inférence hébergé est l'histoire production réaliste. Le scaffolding agentique (usage d'outils, planification, recovery d'erreur) est le goulot d'étranglement, pas les poids eux-mêmes. Attendez-vous à ce que l'écart entre le modèle brut et un agent de classe Claude Fable 5 soit beaucoup plus faible sur les benchmarks de code bruts que sur les évaluations agentiques long terme.

## Xiaomi MiMo Code

[MiMo Code de Xiaomi](https://mimo.xiaomi.com/mimocode) est le deuxième drop open-weights de la semaine, et le plus accessible des deux sur du hardware grand public. Xiaomi n'a pas encore publié de model card avec le même niveau de détail architectural que Moonshot ; le matériel public positionne MiMo Code comme un drop dédié au code, avec poids ouverts et le même cadrage général de workload agentique.

La pertinence est à la fois symbolique et pratique. Deux modèles de code open-weights en une seule semaine, provenant de deux vendors chinois distincts, est un signal fort que la frontière open-weights n'est plus une histoire à un seul vendor. Pour les outils de dev auto-hébergés, le menu est désormais assez large pour comparer des architectures, pas seulement des comptages de paramètres.

## Ce que cela signifie pour les outils de dev auto-hébergés

La question pratique pour une équipe TypeScript qui fait tourner un agent de code local est de savoir si l'alternative open-weights est suffisante pour votre charge. La réponse dépend de ce que l'agent doit faire.

Pour la complétion de code, les éditions single-file et les refactors bien cadrés, l'écosystème open-weights a des options viables depuis plus d'un an. Pour les tâches agentiques qui demandent du raisonnement multi-fichiers, de la rétention long-contexte, et un usage d'outils fiable sur de nombreux tours, l'écart avec la frontière closed-weight (Claude Fable 5, classe GPT, classe Gemini) reste réel, mais il est plus étroit qu'il y a six mois. [L'ascension de Claude Code en 2026](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026) et le [classement des outils de dev de mars 2026](/articles/2026-03-25-ai-dev-tool-rankings-march-2026) ont été écrits quand le menu open-weights tenait sur une ligne. Après cette semaine, c'est au moins une courte liste, et les vendors closed-weight devront continuer à livrer des sauts de capacité pour rester en tête.

Côté outillage : Continue, Aider, OpenCode et Cline avec backend local peuvent tous charger un checkpoint Hugging Face dès aujourd'hui. Kimi K2.7-Code à 1T paramètres demande du multi-GPU ; MiMo Code est le candidat pour l'inférence sur laptop. Les chiffres d'architecture suggèrent que K2.7-Code a la marge pour du travail sérieux, mais le test pratique est de savoir si votre scaffold agentique peut en tirer parti. La même évaluation s'appliquera au [moteur TS service-powered de WebStorm 2026.1](/articles/2026-04-09--webstorm-2026-1-service-powered-ts-engine-ai-agents) et à tout autre éditeur qui expose un picker de modèle local.
