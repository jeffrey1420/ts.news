---
title: "Bun rejoint Anthropic : ce que l'acquisition signifie pour l'écosystème JavaScript"
description: "Le runtime, bundler et toolkit JavaScript construit par une équipe de 14 personnes et utilisé par des millions de développeurs a été acquis par Anthropic. Bun reste open source et sous licence MIT, mais la roadmap s'oriente désormais vers l'infrastructure de coding IA."
date: 2026-04-19
image: "https://opengraph.githubassets.com/0d28e9b3ac4dfd5536d7cc7636993191f76820b868588c2ae9731ee4bb06673c/oven-sh/bun"
author: lschvn
tags: ["TypeScript", "Bun", "Anthropic", "AI", "Runtime"]
tldr:
  - "Bun a été acquis par Anthropic et servira de couche infrastructure pour Claude Code, le Claude Agent SDK et les futurs produits de coding IA"
  - "Bun reste sous licence MIT et open source, avec la même équipe poursuivant le développement actif ; aucune pression de modèle économique"
  - "La distribution en exécutable mono-fichier s'est révélée être la fonctionnalité déterminante pour les outils de coding IA — démarrage rapide, sans dépendance runtime, facile à distribuer"
faq:
  - "Q: Est-ce que ça veut dire que Bun n'est plus open source ?
A: Non. Bun reste sous licence MIT et open source. Anthropic ne rachète pas le projet pour le fermer — il investit dans Bun comme composante d'infrastructure stratégique."
  - "Q: Qu'est-ce qu'Anthropic retire de cette acquisition ?
A: Un contrôle direct sur le runtime qui fait tourner Claude Code et les outils de coding IA. Si Bun tombe en panne, Claude Code tombe — alignant les incitations."
  - "Q: Comment ça affecte les utilisateurs existants de Bun ?
A: Pour l'instant, rien ne change au jour le jour. La roadmap de Bun priorise toujours la compatibilité Node.js et les performances, et l'équipe prévoit une accélération des livraisons."
---

## Du clone Minecraft à l'Infrastructure de Coding IA

Il y a cinq ans, Jarred Sumner construisait un jeu de voxels style Minecraft dans le navigateur. Le cycle de hot-reload prenait 45 secondes. Il s'est distraité en essayant de le corriger, a porté le transpileur JSX et TypeScript d'esbuild de Go vers Zig, et a accidentellement créé Bun.

Aujourd'hui, Bun dépasse les 7,2 millions de téléchargements npm mensuels, rivalise directement avec Node.js en débit HTTP brut (59K contre 19K req/s selon les benchmarks officiels), et propose un format d'exécutable mono-fichier devenu le mécanisme de distribution privilégié des outils de coding IA.

En octobre 2025, Anthropic a acquis Bun. L'annonce, publiée sur le blog Bun, ressemble davantage à une lettre de fondateur expliquant pourquoi le meilleur chemin disponible passe par Claude Code.

## Pourquoi Anthropic Vouait Bun

Les exécutables mono-fichiers se sont révélés être la fonctionnalité surprise déterminante pour l'ère du coding IA. Des outils comme Claude Code, FactoryAI et OpenCode s'expédiaient tous comme des binaires Bun autonomes. Les utilisateurs les téléchargent et les exécutent sans installer de runtime au préalable. Le démarrage est quasi instantané. Ça marche de manière identique sur macOS, Linux et Windows.

Pour les agents IA qui écrivent, testent et déploient du code de manière autonome, cette prévisibilité compte. L'environnement d'exécution doit être rapide et cohérent — le démarrage à froid de Bun en JavaScriptCore est environ 4 fois plus rapide que V8, selon les mesures de l'équipe Bun.

Le propre Claude Code d'Anthropic s'expédie comme un exécutable Bun à des millions d'utilisateurs. Chaque régression de Bun casse Claude Code. L'acquisition aligne les incitations : Anthropic dispose désormais d'un investissement d'ingénierie direct pour garder Bun rapide, compatible et fiable.

## Ce qui Reste Identique

Bun reste sous licence MIT et open source. La même équipe d'environ 14 personnes continue de travailler dessus, toujours basée à San Francisco. Le dépôt GitHub reste public. La roadmap continue de prioriser la compatibilité Node.js et les performances du runtime JavaScript général, aux côtés du travail spécifique à l'IA.

Le billet est remarquablement坦诚 (NdT: direct) sur la situation économique de Bun : au moment de l'acquisition, Bun générait 0 € de revenu avec plus de quatre ans de runway，来自 un total de 26 M$ levés (7 M$ seed, 19 M$ Series A). Ils n'avaient pas besoin de vendre. La décision portait sur le positionnement pour un monde où les outils de coding IA sont le moyen principal de construire logiciel.

## La Route à Venir

L'objectif affiché de l'équipe Bun est d'en faire le meilleur endroit pour construire, exécuter et tester des logiciels entraînés par l'IA — tout en restant un runtime, bundler, gestionnaire de paquets et runner de tests JavaScript de premier plan.

Cela signifie que les travaux futurs incluront probablement des points d'intégration plus étroits avec les workflows de coding IA : temps de démarrage d'agent réduits, meilleurs outils de débogage et de test pour le code écrit par des LLM, et améliorations du format d'exécutable mono-fichier.

Bun v1.3.12 a introduit Bun.WebView, une API native d'automatisation de navigateur headless intégrée directement au runtime, reposant sur WebKit sur macOS et Chrome via le DevTools Protocol sur les autres plateformes. Des fonctionnalités comme celle-ci — faire le pont entre les outils navigateur traditionnels et un runtime JS haute performance — sont le genre de paris qui prennent plus de sens avec un grand partenaire IA soutenant le développement à long terme.
