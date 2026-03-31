---
title: "Cursor Composer 2, Kimi K2.5 et la controverse qui a exposé le bilan de l'open-source en IA"
description: "Comment un développeur a découvert un ID de modèle caché, déclenché un débat mondial sur l'attribution, et révélé à quel point l'industrie de l'IA dépend des modèles open-source chinois."
date: "2026-03-22"
category: "deep-dive"
author: lschvn
tags: ["cursor", "kimi", "moonshot", "ai", "open-source", "licensing", "coding-tools"]
readingTime: 12
image: "https://cursor.com/public/opengraph-image.png"
tldr:
  - "Cursor Composer 2 a atteint 61,7% sur Terminal-Bench 2.0 mais s'est révélé basé sur Kimi K2.5, pas un modèle entièrement maison."
  - "Un développeur a découvert l'ID de modèle 'kimi-k2p5' dans les réponses API ; l'analyse du tokenizer a confirmé l'identité octet par octet avec Kimi."
  - "La licence Modified MIT de Kimi K2.5 exige l'attribution 'Powered by Kimi K2.5' pour les produits dépassant 20M$ de revenus mensuels — Cursor est à ~2B$ ARR."
  - "Moonshot AI a confirmé que l'arrangement avec Fireworks AI était conforme ; Cursor a reconnu l'échec d'attribution comme une erreur."
faq:
  - question: "Cursor a-t-il volé le modèle Kimi K2.5 ?"
    answer: "Non. Cursor a utilisé Kimi K2.5 comme modèle de base via Fireworks AI, un arrangement commercial qui était entièrement conforme selon Moonshot AI. Le problème était l'absence d'attribution dans le billet de blog et l'UI de Cursor, pas le vol du modèle lui-même."
  - question: "Qu'est-ce que Kimi K2.5 apporte exactement ?"
    answer: "Kimi K2.5 est un modèle open-weight avec une fenêtre de contexte de 256K tokens, une architecture multimodale native, et le mode Agent Swarm permettant jusqu'à 100 agents autonomes travaillant simultanément. Son prix API est de 0,60$ par million de tokens en entrée, contre 3-15$ pour des modèles propriétaires comparables."
  - question: "Que doivent faire les développeurs qui utilisent Cursor ?"
    answer: "L'outil reste aussi performant qu'avant la controverse. La qualité du modèle est réelle. L'échec d'attribution est un problème de gouvernance, pas de capacités. Les développeurs doivent comprendre ce qui fonctionne réellement sous le capot de leurs outils plutôt que d'accepter le marketing tel quel."
---

Le 19 mars 2026, Cursor a publié un billet de blog annonçant Composer 2. Les benchmarks étaient réels : **61,7% sur Terminal-Bench 2.0**, battant Claude Opus 4.6 (58,0%) pour un dixième du prix. Le lancement a été présenté comme une percée d'une équipe de 50 personnes qui avait passé des mois à entraîner et affiner un modèle de codage maison.

Quarante-huit heures plus tard, la communauté des développeurs avait une toute autre conversation.

## La découverte

Tout a commencé par un développeur qui déboguait un point de terminaison API. En inspectant les réponses API compatibles OpenAI de Cursor, il a trouvé un ID de modèle qui n'aurait pas dû s'y trouver :

```
accounts/anysphere/models/kimi-k2p5-rl-0317-s515-fast
```

La chaîne n'est pas subtile. `kimi-k2p5` fait référence à **Kimi K2.5**, un modèle open-weight du laboratoire d'IA chinois Moonshot AI publié deux mois plus tôt.

## Ce que Cursor a réellement expédié

Le propre billet de blog de Cursor, lu attentivement, était techniquement exact mais trompeur sur le ton. L'entreprise décrivait un "pré-entraînement continu d'un modèle de base combiné à un apprentissage par renforcement" sans spécifier quel modèle de base.

La composition réelle, clarifiée par Aman Sanger (co-fondateur de Cursor) :
- **Modèle de base** : Kimi K2.5 (choisi après évaluation de plusieurs options)
- **Travail ajouté** : Pré-entraînement continu + apprentissage par renforcement 4×mis à l'échelle
- **Répartition du calcul** : Environ 25% du base de Kimi, 75% de l'entraînement supplémentaire de Cursor

## Le problème de licence

Kimi K2.5 est open-source sous une **licence MIT modifiée** avec des conditions commerciales spécifiques :

> Les produits ou services commerciaux dépassant **20 millions de dollars de revenus mensuels** doivent afficher de manière prominente "Powered by Kimi K2.5" dans l'interface utilisateur.

Les revenus de Cursor, largement rapportés en 2026, situent l'entreprise à environ **2 milliards de dollars de ARR annualisé** — soit **8× au-dessus du seuil mensuel** qui déclenche l'exigence d'attribution.

## La résolution Fireworks

Cursor a accédé à Kimi K2.5 via **Fireworks AI**, une plateforme d'inférence hébergée qui fournit un accès commercial aux modèles open-weight sous des accords de licence. Moonshot AI a confirmé que l'arrangement avec Fireworks était entièrement conforme.

Lee Robinson, VP Developer Experience de Cursor, a reconnu directement l'échec de divulgation : *"Ne pas mentionner Kimi comme base dans le billet de blog était une erreur."*

## Kimi K2.5 : le modèle à connaître

Kimi K2.5 est un modèle open-weight avec des capacités qui expliquent pourquoi Cursor l'a choisi comme base :

- **Fenêtre de contexte de 256K tokens** — quatre fois ce que la plupart des concurrents offrent
- **Architecture multimodale native** — traite texte, vision et spécifications visuelles dans un cadre unifié
- **Agent Swarm** — jusqu'à 100 agents autonomes travaillant simultanément sur des sous-tâches
- **Prix** — 0,60$ par million de tokens en entrée via API

## Le pattern plus profond : l'open-source chinois comme infrastructure mondiale

La vérité inconfortable est que **les modèles d'IA open-source chinois sont devenus silencieusement une infrastructure fondamentale pour l'industrie mondiale de l'IA**. Kimi K2.5, Qwen (Alibaba), DeepSeek et GLM ne sont pas des outsiders régionaux — ils sont compétitifs ou supérieurs aux offres open-weight occidentales à une fraction du coût.

## Ce que cela signifie pour les développeurs

1. **Inspectez ce que vous achetez.** L'attribution des modèles est de plus en plus peu fiable en surface. Les marqueurs techniques — signatures de tokenizers, ID de modèles dans les réponses API — sont vérifiables.

2. **Les licences open-source en IA rattraper leur retard.** La licence MIT modifiée de Kimi K2.5 est plus sophistiquée que la plupart. "Open-source" ne signifie pas "gratuit pour usage commercial inconditionnel."

3. **Le vrai fossé est l'intégration, pas les modèles de base.** La position concurrentielle de Cursor repose sur son intégration profonde dans le flux de travail des développeurs — pas sur la possession du modèle de base.

4. **Kimi K2.5 mérite d'être connu.** Que ce soit comme base pour votre propre affinage ou comme point de terminaison API pour le développement, c'est un modèle capable avec un ratio prix-performances que les alternatives propriétaires ne peuvent égaler.
