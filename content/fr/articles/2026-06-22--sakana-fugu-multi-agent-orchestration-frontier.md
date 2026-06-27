---
title: "Sakana Fugu Emballe un Orchestrateur Multi-Agents Derrière une API Unique, Revendique la Parité Avec Fable et Mythos"
description: "Sakana AI a lancé Fugu le 22 juin 2026, un système d'orchestration multi-agents livré sous la forme d'une seule API compatible OpenAI. Deux modèles, Fugu et Fugu Ultra, coordonnent un pool de LLMs closed-source grâce à un orchestration apprise issue de deux articles ICLR 2026 (TRINITY et Conductor). Fugu Ultra affiche des scores de benchmark compétitifs avec Fable 5 et Mythos Preview d'Anthropic, mais le lancement suscite des critiques vives sur la transparence des coûts, les dépendances closed-source et la méthodologie des benchmarks."
date: 2026-06-22
image: "/images/heroes/2026-06-22--sakana-fugu-multi-agent-orchestration-frontier.png"
author: lschvn
tags: ["ai", "ecosystem"]
tldr:
  - "Sakana AI a lancé Fugu, un système d'orchestration multi-agents livré comme une seule API modèle. Fugu sélectionne, délègue et coordonne dynamiquement un pool de LLMs (y compris lui-même récursivement) grâce à une orchestration apprise issue de deux articles ICLR 2026 : TRINITY (un coordinateur évolutionniste de ~0,6B paramètres) et Conductor (un coordinateur RL de 7B). Deux niveaux : Fugu (latence équilibrée) et Fugu Ultra (qualité maximale sur les tâches difficiles)."
  - "Fugu Ultra obtient 73,7 sur SWE-bench Pro, 82,1 sur TerminalBench 2,1 et 93,2 sur LiveCodeBench, le plaçant aux côtés d'Opus 4,8 (69,2 / 74,6 / 87,8) et devant GPT 5,5 (58,6 / 78,2 / 85,3). Le bémol : les scores de référence utilisent les valeurs rapportées par les fournisseurs, le contenu du pool d'agents n'est pas divulgué, et aucun nombre de tokens ou coût par benchmark n'est communiqué."
  - "Le lancement est présenté comme « souveraineté IA » : une protection contre la dépendance à un seul fournisseur après [les contrôles à l'exportation de Fable et Mythos par Anthropic](/articles/2026-06-13--fable-mythos-export-control-deep-dive). Les tarifs commencent à 20$/mois (Standard), 100$/mois (Pro), 200$/mois (Max), plus un paiement à l'usage à 5$/1M tokens en entrée. Non disponible en UE/EEE (RGPD en cours). Les critiques soulignent qu'il s'agit d'un orchestrateur closed-source sur des modèles closed-source, ce qui affaiblit le discours de souveraineté."
faq:
  - question: "Qu'est-ce que Sakana Fugu ?"
    answer: "Sakana Fugu est un système d'orchestration multi-agents de Sakana AI (Tokyo) qui se comporte comme un seul modèle. Vous appelez un seul endpoint API compatible OpenAI, et Fugu décide en interne s'il doit répondre directement ou coordonner une équipe de LLMs experts. Fugu est lui-même un modèle de langage entraîné à appeler d'autres LLMs, y compris des appels récursifs à lui-même. Deux niveaux : Fugu (latence équilibrée pour un usage quotidien) et Fugu Ultra (pool d'agents plus profond pour les problèmes difficiles multi-étapes)."
  - question: "Comment Fugu se compare-t-il à Opus 4,8, GPT 5,5 et Gemini 3,1 Pro ?"
    answer: "Sur les benchmarks publiés par Sakana, Fugu Ultra obtient 73,7 sur SWE-bench Pro (contre 69,2 pour Opus 4,8, 58,6 pour GPT 5,5, 54,2 pour Gemini 3,1 Pro), 82,1 sur TerminalBench 2,1 (contre 74,6, 78,2, 70,3) et 93,2 sur LiveCodeBench (contre 87,8, 85,3, 88,5). L'important caveat : tous les scores de référence proviennent des fournisseurs eux-mêmes, et les scores de Fugu Ultra incluent le coût de l'orchestration de multiples appels de modèles, que Sakana ne divulgue pas."
  - question: "Que sont TRINITY et Conductor ?"
    answer: "TRINITY (ICLR 2026, arxiv 2512.04695) est un coordinateur de ~0,6B de paramètres entraîné avec une stratégie évolutionniste (CMA-ES) pour attribuer des rôles de Thinker, Worker ou Verifier aux LLMs sur plusieurs tours. Conductor (ICLR 2026, arxiv 2512.04388) est un modèle de 7B entraîné par apprentissage par renforcement pour découvrir des stratégies de coordination en langage naturel, concevant des topologies de communication entre agents et des prompts ciblés. Les deux articles montrent que l'orchestration apprise surpasse les workflows multi-agents conçus manuellement sur les benchmarks de raisonnement."
  - question: "Fugu est-il open source ?"
    answer: "Non. Fugu est un produit API closed-source. Le modèle d'orchestration, la composition du pool d'agents et la logique de coordination sont propriétaires. Les deux articles ICLR (TRINITY et Conductor) décrivent les fondements de recherche, mais le système de production n'est pas en open-weights. Le pool d'agents se compose de modèles API closed-source ; Sakana ne divulgue pas lesquels."
  - question: "Qu'est-ce que le discours de « souveraineté IA » ?"
    answer: "Sakana positionne Fugu comme une protection contre la dépendance à un seul fournisseur, citant les récents contrôles à l'exportation d'Anthropic sur Fable et Mythos. L'argument : si un fournisseur restreint l'accès, Fugu contourne dynamiquement la perturbation en échangeant des agents dans son pool. Les critiques soulignent que Fugu est lui-même un système closed-source qui route vers des modèles closed-source, donc la revendication de souveraineté s'applique à la flexibilité d'orchestration, pas à l'indépendance vis-à-vis de l'IA closed-source."
  - question: "Combien coûte Fugu ?"
    answer: "Abonnements : Standard (20$/mois), Pro (100$/mois), Max (200$/mois). Tous les niveaux incluent Fugu et Fugu Ultra. Paiement à l'usage : 5$/1M tokens en entrée, 30$/1M tokens en sortie, 0,50$/1M tokens en cache. Au-delà de 272K tokens de contexte, les tarifs doublent (10$/1M entrée, 45$/1M sortie, 1,00$/1M cache). Sakana rapporte l'utilisation de tokens par requête pour le suivi des coûts. Le chiffre manquant : combien de tokens une tâche de benchmark consomme réellement à travers la couche d'orchestration."
  - question: "Quelles sont les principales critiques du lancement de Fugu ?"
    answer: "L'ingénieur ML Elie Bakouch (@eliebakouch) en identifie plusieurs : (1) Fugu est un orchestrateur closed-source sur des modèles closed-source, ce qui contredit le discours de « souveraineté ». (2) Fugu (non Ultra) est essentiellement un routeur qui sélectionne le meilleur modèle à chaque tour, avec 10 points en dessous d'Opus sur SWE-bench Pro. (3) Fugu Ultra pré-planifie les workflows à t=0 plutôt que de s'adapter à chaque étape, le limitant à des plans de 5 étapes. (4) Sakana ne rapporte jamais le nombre de tokens en sortie ou le coût par benchmark. (5) La comparaison AutoResearch utilise des modèles de référence anonymisés « Modèle A/B/C » sans les nommer."
  - question: "Fugu est-il disponible dans l'UE ?"
    answer: "Pas encore. La page produit indique : « Pas encore disponible dans l'UE/EEE pendant que nous travaillons vers la conformité avec le RGPD et les réglementations spécifiques à l'UE. » Aucune date n'est communiquée."
---

[Sakana AI](https://sakana.ai/) a lancé [Sakana Fugu](https://sakana.ai/fugu) le 22 juin 2026, un système d'orchestration multi-agents livré comme une seule API modèle compatible OpenAI. Le produit propose deux niveaux : Fugu, équilibré pour la latence et l'usage quotidien, et Fugu Ultra, optimisé pour la qualité maximale sur les tâches difficiles multi-étapes. La revendication phare : Fugu Ultra atteint les performances de Fable 5 et Mythos Preview d'Anthropic sur les benchmarks de codage, raisonnement et sciences, sans le risque de contrôles à l'exportation.

Le tweet de lancement de [hardmaru (David Ha)](https://x.com/hardmaru/status/2068884466056225025), cofondateur de Sakana AI, présente le produit comme un pari philosophique : « L'intelligence humaine est fondamentalement une intelligence collective. Nous résolvons des problèmes complexes en participant à un vaste réseau culturel qui s'appuie sur les idées à travers les générations. Je crois que les systèmes d'IA les plus puissants deviendront eux aussi une intelligence collective. » Le post compte 1 056 likes et 131 retweets au moment de la rédaction. Le [tweet d'annonce](https://x.com/SakanaAILabs/status/2068861630327443966) du compte officiel dépasse 9 000 likes et 3,7M de vues.

## Le cadrage : « Les modèles d'orchestration sont la prochaine frontière »

Le pitch de Sakana n'est pas « nous avons construit un modèle plus gros ». C'est « nous avons construit un modèle qui commande d'autres modèles ». Le blog de lancement appelle cela un « Modèle d'Orchestration », le positionnant au-delà du paradigme de mise à l'échelle par la force brute. Fugu est lui-même un modèle de langage, entraîné à décider quand déléguer, quels agents assembler, comment ils doivent communiquer, et comment synthétiser leurs sorties en une seule réponse.

L'angle géopolitique est délibéré. Le blog cite les récents [contrôles à l'exportation sur Fable et Mythos](https://sakana.ai/fugu-release) d'Anthropic comme l'événement déclencheur : « l'accès aux meilleurs modèles peut disparaître du jour au lendemain. » Le pitch de Fugu : si un fournisseur restreint l'accès, le système contourne la perturbation en échangeant des agents dans son pool. hardmaru appelle cela « le plan résilient requis pour la souveraineté IA ».

La correction du cadrage : il s'agit d'une souveraineté sur l'orchestration, pas sur les modèles eux-mêmes. Le pool d'agents de Fugu se compose de modèles API closed-source que Sakana ne nomme pas. Si les fournisseurs sous-jacents restreignent l'accès, Fugu peut échanger, mais il dépend toujours de modèles closed-source externes étant disponibles. La revendication de souveraineté est réelle au niveau du routage mais ne s'étend pas à l'indépendance vis-à-vis des modèles.

## L'architecture : TRINITY et Conductor

L'orchestration de Fugu repose sur deux articles ICLR 2026 :

**TRINITY** ([arxiv 2512.04695](https://arxiv.org/abs/2512.04695)) introduit un coordinateur léger (~0,6B de paramètres plus une tête de ~10K paramètres) optimisé avec une stratégie évolutionniste (CMA-ES, Covariance Matrix Adaptation Evolution Strategy). Le coordinateur traite les requêtes sur plusieurs tours, attribuant l'un des trois rôles à chaque tour : Thinker (raisonnement), Worker (exécution) ou Vérificateur (vérification). L'idée clé : sous haute dimensionnalité et des contraintes de budget strictes, CMA-ES surpasse l'apprentissage par renforcement, l'apprentissage par imitation et la recherche aléatoire en exploitant la séparabilité bloc-epsilon dans l'espace des paramètres. L'article rapporte 86,2% sur LiveCodeBench, surpassant les modèles frontière individuels.

**Conductor** ([arxiv 2512.04388](https://arxiv.org/abs/2512.04388)) est un modèle de 7B entraîné par apprentissage par renforcement pour découvrir des stratégies de coordination en langage naturel. Là où TRINITY attribue des rôles fixes, Conductor apprend à concevoir des topologies de communication entre agents et des prompts ciblés. Le modèle est entraîné avec des pools d'agents randomisés, ce qui le généralise à des ensembles arbitraires d'agents open- et closed-source au moment de l'inférence. Permettre au Conductor de se sélectionner lui-même comme worker crée des topologies récursives, une forme de mise à l'échelle dynamique au temps de test par adaptation itérative en ligne.

Ensemble, ces deux articles fournissent la fondation de recherche. Fugu le produit les enveloppe dans un système où l'utilisateur appelle un seul endpoint et l'orchestration se produit en interne.

## Deux modèles, une API

Fugu se décline en deux modèles, tous deux accessibles via une seule API compatible OpenAI :

**Fugu** (le modèle de base) équilibre performance et latence. Il est conçu pour le travail quotidien : assistance au codage, revue de code, services de chatbot. Sakana le positionne comme un remplacement direct des endpoints à modèle unique dans des outils comme Codex. Les équipes avec des exigences de conformité peuvent exclure des agents spécifiques de son pool.

**Fugu Ultra** coordonne un pool plus profond d'agents experts pour une qualité de réponse maximale. Les premiers utilisateurs rapportent l'avoir déployé pour des compétitions Kaggle, la reproduction d'articles, l'analyse de cybersécurité et les investigations de brevets. La différence clé : Fugu Ultra peut assembler des workflows multi-étapes où différents modèles spécialisés gèrent la planification, l'exécution et la vérification.

L'intégration est simple. Pas de configuration de framework multi-agents, pas de définitions d'agents, pas de configuration de workflow. Vous envoyez une requête à un seul endpoint et le système gère le reste.

## Le tableau des benchmarks

Voici les chiffres publiés par Sakana, reproduits intégralement :

| Benchmark | Fugu | Fugu Ultra | Opus 4,8 † | Gemini 3,1 Pro † | GPT 5,5 † |
|---|---|---|---|---|---|
| SWE-bench Pro * | 59,0 | **73,7** | 69,2 | 54,2 | 58,6 |
| TerminalBench 2,1 | 80,2 | **82,1** | 74,6 | 70,3 | 78,2 |
| LiveCodeBench | 92,9 | **93,2** | 87,8 | 88,5 | 85,3 |
| LiveCodeBench Pro | 87,8 | **90,8** | 84,8 | 82,9 | 88,4 |
| Humanity's Last Exam | 47,2 | **50,0** | 49,8 | 44,4 | 41,4 |
| CharXiv Reasoning | 85,1 | **86,6** | 84,2 | 83,3 | 84,1 |
| GPQA-D | 95,5 | 95,5 | 92,0 | 94,3 | 93,6 |
| SciCode | 60,1 | 58,7 | 53,5 | 58,9 | 56,1 |
| τ³ Banking | 21,7 | 20,6 | 20,6 | 8,4 | 20,6 |
| Long Context Reasoning | 74,7 | 73,3 | 67,7 | 72,7 | 74,3 |
| MRCRv2 | 86,6 | **93,6** | 87,9 | 84,9 | 94,8 |

*\* Utilise mini-swe-agent comme scaffolding.*
*† Scores rapportés par les fournisseurs.*

Les notes de bas de page comptent. Tous les scores de référence proviennent des fournisseurs de modèles eux-mêmes, pas d'une reproduction indépendante. Les scores de Fugu sont les mesures de Sakana. La comparaison est asymétrique : Fugu Ultra passe par une couche d'orchestration qui génère plusieurs appels de modèles par tâche, tandis que les références sont des évaluations à modèle unique. Sakana ne rapporte pas combien de tokens Fugu Ultra consomme par tâche de benchmark, quel est le coût par tâche, ou combien de tours d'agent chaque problème nécessite.

Sur SWE-bench Pro, les 73,7 de Fugu Ultra dépassent les 69,2 d'Opus 4,8 de 4,5 points. Sur TerminalBench 2,1, l'écart est de 7,5 points (82,1 contre 74,6). Sur LiveCodeBench, il est de 5,4 points (93,2 contre 87,8). Ce sont des écarts réels, mais la comparaison coût-efficacité est manquante. Comme le note l'ingénieur ML [Elie Bakouch](https://x.com/eliebakouch/status/2068939729811468503) : « ils introduisent une méthode de « mise à l'échelle au temps de test » avec « best of N » sur des modèles, et ils ne rapportent LITTÉRALEMENT JAMAIS le nombre de tokens en sortie ou le coût pour atteindre un benchmark/tâche. »

## Les démos qualitatives

Au-delà des benchmarks, Sakana présente six scénarios de démonstration où Fugu Ultra surpasse les modèles frontière de référence :

1. **AutoResearch** (cadre Karpathy et al.) : un agent IA a amélioré de manière autonome la recette d'entraînement d'un petit GPT sur 123 expériences sur un seul GPU H100 en ~14 heures. Fugu Ultra a atteint un BPB moyen de 0,9774 ± 0,0019, devant trois références frontière anonymisées (« Modèle A/B/C »). Sakana ne nomme pas quels modèles sont A, B et C.

2. **Ordre de lecture des lettres kana** : analyse de manuscrits japonais classiques sur une lettre de 1610. Fugu Ultra a obtenu 0,80 NED (distance d'édition normalisée) contre 0,24 pour le Modèle A.

3. **Génération de solveur Rubik's Cube** : génération de code pour un casse-tête physique.

4. **Iris mécanique CAD** : génération de conception mécanique.

5. **Échecs en aveugle** : génération de partie d'échecs en one-shot.

6. **Trading de séries temporelles** : prédiction financière.

Les démos sont visuellement convaincantes (des walkthroughs vidéo sont intégrés sur la page produit), mais les références anonymisées rendent la vérification indépendante impossible. L'expérience AutoResearch est particulièrement intéressante car elle teste un travail agentic multi-étapes soutenu, qui est le point fort conçu de Fugu Ultra.

## Tarification et déploiement

Sakana propose des tarifs par abonnement et à l'usage :

**Niveaux d'abonnement** (tous incluent Fugu et Fugu Ultra) :
- Standard : 20$/mois
- Pro : 100$/mois
- Max : 200$/mois

**Paiement à l'usage** (par 1M de tokens) :
- Entrée : 5$
- Sortie : 30$
- Entrée en cache : 0,50$
- Au-delà de 272K tokens de contexte : 10$ entrée, 45$ sortie, 1,00$ cache

Sakana rapporte l'utilisation de tokens par requête pour que les utilisateurs puissent suivre les dépenses en temps réel. L'API est compatible OpenAI, donc l'intégration nécessite de changer une URL d'endpoint et un nom de modèle.

**Non disponible en UE/EEE.** La page produit indique que la conformité avec le RGPD et les réglementations spécifiques à l'UE est en cours. Aucune date.

Le chiffre de coût manquant : combien de tokens une tâche typique de Fugu Ultra consomme. Si Fugu Ultra génère 5 appels d'agents par problème (la limite identifiée par Bakouch), et que chaque appel utilise un modèle frontière, le coût effectif par tâche est 5x le tarif par token. Pour SWE-bench Pro, où Fugu Ultra passe par le scaffolding mini-swe-agent, le nombre total de tokens par problème est inconnu.

## La critique

La critique publique la plus détaillée vient d'[Elie Bakouch](https://x.com/eliebakouch/status/2068939729811468503), un ingénieur ML qui a lu le rapport technique. Son analyse :

1. **Fugu (non Ultra) est un routeur.** Il sélectionne le modèle le plus susceptible de répondre correctement à chaque tour. C'est un classifieur, pas un orchestrateur. Il obtient 10 points en dessous d'Opus sur SWE-bench Pro (59,0 contre 69,2).

2. **Fugu Ultra est un « mode plan avancé ».** Il sort un plan avec plusieurs workflows à t=0, avant que les agents ne commencent à travailler. Bakouch argue que c'est la mauvaise architecture : « il faut prédire ce qu'on lance à t+1 avec l'information qu'on obtient à t, pas avec l'information qu'on obtient à t=0. » Le système est limité à 5 étapes.

3. **Closed source sur closed source.** « Si avant vous ne contrôliez pas les modèles, maintenant vous ne contrôlez même pas lesquels sont utilisés ni combien. »

4. **Pas de transparence des coûts.** Le plus gros problème : introduire une méthode de mise à l'échelle au temps de test avec best-of-N sur des modèles sans jamais rapporter le nombre de tokens en sortie ou le coût par benchmark.

5. **Références anonymisées.** La comparaison AutoResearch utilise des références « Modèle A, B et C » sans les nommer. « C'est vraiment fou de ne pas être transparent sur les modèles avec lesquels on se compare. »

6. **Mauvais cadre de comparaison.** La comparaison juste n'est pas Fugu Ultra vs. Opus brut, mais Fugu Ultra vs. Opus avec ultracode/workflows activés. De même, la comparaison devrait être contre Kimi Swarm, pas Kimi brut.

La critique est substantielle. Le discours de souveraineté est convaincant au niveau géopolitique mais mince au niveau technique : Fugu dépend des mêmes fournisseurs closed-source contre lesquels il prétend se protéger. Les chiffres de benchmark sont réels mais incomparables sans données de coût. L'architecture est novatrice (l'orchestration apprise bat les workflows conçus manuellement) mais les contraintes du système de production (pool fermé, limite de 5 étapes, pas d'adaptation pendant l'exécution) réduisent son avantage.

## Ce qu'il faut surveiller

1. **Reproduction indépendante des benchmarks.** Le signal le plus important. Des tiers peuvent-ils reproduire les scores SWE-bench Pro et TerminalBench de Fugu Ultra avec l'API publique ? Le scaffolding mini-swe-agent est open-source ; n'importe qui peut lancer l'évaluation.

2. **Divulgation du nombre de tokens.** Sakana publiera-t-il les nombres de tokens par tâche pour les problèmes de benchmark ? Sans cela, les revendications d'efficacité sont invérifiables.

3. **Transparence du pool d'agents.** Quels modèles sont dans le pool ? Sakana dit « modèles API closed-source » mais ne les nomme pas. Si le pool est GPT 5,5 + Opus 4,8 + Gemini 3,1 Pro, l'histoire d'orchestration concerne le routage, pas la construction de capacité frontière.

4. **Disponibilité UE/EEE.** La conformité RGPD est le blocage. Surveiller le DPA (Data Processing Agreement) de Sakana et les engagements de résidence des données dans l'UE.

5. **Modèles open-weights dans le pool.** Sakana prévoit d'ajouter des modèles open et ses propres modèles. Si le pool de Fugu inclut Llama 4, Qwen 3,7 ou les modèles entraînés par Sakana, l'histoire de souveraineté se renforce matériellement.

6. **Profondeur d'auto-orchestration récursive.** L'article Conductor montre des topologies récursives (l'orchestrateur s'appelle lui-même). À quelle profondeur cela va-t-il en production ? L'orchestration récursive est la revendication technique la plus novatrice et la plus difficile à vérifier de l'extérieur.

7. **Adoption par la communauté.** 500 utilisateurs bêta est un signal significatif. Surveiller les résultats de compétitions Kaggle, les rapports d'audit de cybersécurité et les comparaisons de qualité de revue de code avec l'API publique.

## Le mot de la fin

Sakana Fugu est le premier système de production qui emballe l'orchestration multi-agents apprise comme un seul endpoint API. La fondation de recherche (TRINITY + Conductor, tous deux ICLR 2026) est solide, et les chiffres de benchmark sont compétitifs avec la frontière actuelle. Le cadrage « Modèle d'Orchestration » est le bon pari à long terme : à mesure que les modèles prolifèrent, la couche de coordination devient le différenciateur.

La faiblesse du lancement est la transparence. Pas de coût par benchmark, pas de divulgation du pool d'agents, pas de reproduction indépendante, des références anonymisées dans les démos. Le discours de souveraineté est émotionnellement résonnant mais techniquement incomplet : Fugu contourne les restrictions des fournisseurs au niveau de l'orchestration tout en dépendant des mêmes fournisseurs au niveau des modèles. Pour les développeurs qui évaluent Fugu, la question pratique n'est pas « bat-il Opus ? » mais « bat-il Opus au même coût ou moins ? ». Cette question reste sans réponse.
