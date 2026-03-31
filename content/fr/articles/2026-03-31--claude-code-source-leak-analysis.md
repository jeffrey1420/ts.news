---
title: "Fuite de Source Map Claude Code : Exposition de l'OS Agent Caché, Automatisation Chrome et Failles de Vie Privée"
description: "Les 30-31 mars 2026, les développeurs ont découvert que le paquet npm @anthropic-ai/claude-code@v2.1.88 incluait un fichier source map de production qui exposait l'intégralité du code source TypeScript — révélant une orchestration multi-agent non documentée, un serveur MCP Chrome caché, un moteur de requête interne, un système de permissions d'outils, et un système de télémétrie à trois niveaux."
date: 2026-03-31
image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop"
author: "lschvn"
tags:
  [
    "security",
    "anthropic",
    "claude-code",
    "npm",
    "typescript",
    "agents",
    "privacy",
  ]
readingTime: 5
tldr:
  - "Claude Code v2.1.88 était livré avec une source map de production (cli.js.map) exposant ~4 756 fichiers sources incluant une orchestration multi-agent non documentée."
  - "Le serveur MCP Chrome caché permet à Claude Code de contrôler un navigateur — une capacité jamais annoncée ou documentée par Anthropic."
  - "Un système de confidentialité à trois niveaux (default, no-telemetry, essential-traffic) avec intégration Datadog et 506 fichiers de télémétrie révèle une collecte de données extensive."
  - "La résolution CLAUDE.md a quatre niveaux de précédence, incluant un fichier système non documenté `/etc/claude-code/CLAUDE.md` qui pourrait poser des risques de configuration."
faq:
  - question: "Devrais-je désinstaller Claude Code après la fuite de source map ?"
    answer: "La source map a exposé l'architecture interne de Claude Code, mais ce n'était pas une vulnérabilité qui a fui des données depuis les machines des utilisateurs. Aucun identifiant, clé API ou données utilisateur n'a été exposé. Mettre à jour vers la dernière version supprime le fichier source map. L'incident est un échec de configuration de build, pas une violation de sécurité de votre environnement."
  - question: "Quelles données Claude Code collecte-t-il réellement ?"
    answer: "Claude Code a trois niveaux de télémétrie : 'default' (tout activé, incluant le rapport de crash Datadog et la journalisation d'événements propriétaires), 'no-telemetry' (analytiques désactivées), et 'essential-traffic' (bloque tout le trafic non essentiel). Il collecte des métadonnées de plateforme, des informations de runtime et la présence GitHub Actions. Les feature flags sont gérés via GrowthBook, suggérant que les tests A/B sont intégrés."
  - question: "L'automatisation Chrome cachée est-elle un risque de sécurité ?"
    answer: "Le serveur MCP Chrome nécessite une configuration explicite avec un ID d'extension de navigateur spécifique et n'est pas actif par défaut. La préoccupation principale n'est pas l'exploitation active mais le fait qu'Anthropic a construit et expédié une capacité d'automatisation de navigateur sans la documenter — soulevant des questions sur quelles autres fonctionnalités non documentées existent dans des outils avec un accès profond au codebase."
---

Le 30 mars 2026, les développeurs installant le paquet npm `@anthropic-ai/claude-code@v2.1.88` ont remarqué quelque chose d'inhabituel : le bundle publié incluait `cli.js.map`, un fichier source map de production qui map le JavaScript minifié vers son code source TypeScript original. En quelques heures, la découverte s'est propagée à travers les communautés de développeurs, avec plusieurs développeurs confirmant indépendamment que la source map fournissait une vue quasi complète de l'architecture interne de Claude Code.

Le problème a été formellement rapporté comme [GitHub issue #41329](https://github.com/anthropics/claude-code/issues/41329) — titrée "[BUG] Il semble que le code source de claude code ait fui, avec cli.js.map uploadé sur npm" — et a été fermée comme complétée le même jour. Des développeurs sur Twitter, incluant @iamsupersocks, @Fried_rai, et @chetaslua, ont partagé des captures d'écran et des analyses de ce qu'ils ont trouvé. Un développeur français aurait posté un thread extensif détaillant les découvertes les plus significatives.

## Ce qui a Fu

La source map (`cli.js.map`) est un artefact de build JavaScript standard qui permet aux outils de débogage de mapper le code minifié vers les fichiers sources originaux. Lorsqu'elle est incluse dans un paquet npm de production, elle expose effectively l'intégralité de l'arbre source TypeScript à toute personne qui télécharge le paquet. Dans ce cas, la source map contenait des références à **4 756 fichiers sources**, incluant approximativement **25 fichiers spécifiques à Claude** que les développeurs disent révéler des décisions architecturales qu'Anthropic n'avait pas documentées publiquement.

Le paquet a été publié sur npm avec la source map intacte — une erreur de configuration de build qui ne devrait jamais atteindre la production.

## Ce qu'Ils ont Trouvé

### L'OS Agent : Un Système d'Orchestration Multi-Agent que Personne Ne Savait Exister

La découverte la plus frappante était un système complet d'orchestration d'agents. La source map révèle un ensemble de types d'agents avec des noms qui n'ont jamais apparu dans aucune documentation publique :

- `AgentTool`, `ExploreAgent`, `PlanAgent`, `VerificationAgent`, `GeneralPurposeAgent`, `StatuslineSetupAgent`

À côté de ceux-ci, le code contient `TeamCreateTool` et `TeamDeleteTool`, suggérant que Claude Code peut créer et détruire des équipes d'agents. Le système utilise un `coordinatorMode.ts` pour la coordination multi-agent, et les agents communiquent à travers un système de boîte de réception basée sur les fichiers à `.claude/teams/{team_name}/inboxes/{agent_name}.json`. Un fichier `forkSubagent.ts` gère le spawning de sous-agents, et l'isolation d'exécution est maintenue via `AsyncLocalStorage`.

Le prompt système lui-même a **trois préfixes distincts** : `DEFAULT_PREFIX`, `AGENT_SDK_CLAUDE_CODE_PRESET_PREFIX`, et `AGENT_SDK_PREFIX` — suggérant au moins trois modes ou contextes opérationnels distincts pour l'IA, dont aucun n'a été documenté publiquement par Anthropic.

**Les permissions d'outils** sont appliquées via une méthode `checkPermissions` sur chaque outil. Trois modes existent : `allow` (s'exécute immédiatement), `ask` (met en pause et affiche une boîte de dialogue de confirmation), et `deny` (rejeté, avec une erreur retournée au modèle). Un mode `bypassPermissions` saute toutes les vérifications — une capacité significative qui fonctionne en conjonction avec le flag `--dangerously-skip-permissions`. Le mode `acceptEdits` approuve automatiquement les modifications de fichiers mais pas les commandes bash, fournissant un terrain d'entente entre le bypass complet et l'approbation interactive.

### Intégration Chrome Cachée : Le Serveur MCP claude-in-chrome

Les développeurs ont trouvé un serveur MCP (Model Context Protocol) complet pour l'automatisation du navigateur Chrome. La source map révèle :

- Une extension Chrome avec l'ID `fcoeoabgfenejglbffodgkkbkcdhcgfn`
- Des outils incluant `javascript_tool`, `read_page`, `find`, `form_input`, `computer`, et `navigate` (d'un module `BROWSER_TOOLS`)
- Une capacité d'enregistrement GIF exposée via `mcp__claude-in-chrome__gif_creator`
- Lecture des logs de console via `mcp__claude-in-chrome__read_console_messages`

Ce serveur MCP semble permettre à Claude Code de contrôler un navigateur Chrome directement depuis le CLI — une capacité qui n'a pas été annoncée ou documentée par Anthropic.

### L'Écart de Vie Privée : Ce que Claude Code Envoie Réellement

La source map révèle un système de confidentialité à trois niveaux qui clarifie (et complique) les données que Claude Code collecte :

| Mode                | Télémétrie                        | Datadog | Événements Propriétaires | Feedback |
| ------------------- | -------------------------------- | ------- | ------------------ | -------- |
| `default`           | Tout activé                      | ✓       | ✓                  | ✓        |
| `no-telemetry`      | Analytiques désactivées          | ✗       | ✗                  | ✗        |
| `essential-traffic` | Tout trafic non essentiel bloqué | —       | —                  | —        |

L'intégration analytique envoie des données à **Datadog** et journalise les événements propriétaires throughout the codebase. Les feature flags sont gérés via **GrowthBook** via `getFeatureValue_CACHED_MAY_BE_STALE`. Un header d'attribution peut être désactivé via la variable d'environnement `CLAUDE_CODE_ATTRIBUTION_HEADER`. La source map contient **506 fichiers liés à l'analytique et à la télémétrie**, avec `logEvent` et `logForDebugging` appelés throughout the codebase. Les métadonnées d'environnement collectées incluent la plateforme, le runtime et les informations de présence GitHub Actions.

L'existence du mode `essential-traffic` — qui bloque virtually tout le trafic outbound non essentiel — peut être une nouvelle pour les développeurs qui croyaient que les seules options étaient "tout activé" ou "tout désactivé".

### La Hiérarchie CLAUDE.md : Quatre Niveaux de Précédence que Personne Ne Vous a Dit

La source map révèle que Claude Code résout les fichiers `CLAUDE.md` dans un ordre spécifique avec **priorité inversée** (les niveaux ultérieurs écrasent les précédents) :

1. `/etc/claude-code/CLAUDE.md` — Système global pour tous les utilisateurs
2. `~/.claude/CLAUDE.md` — Privé global à l'utilisateur
3. `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*.md` — Niveau projet
4. `CLAUDE.local.md` — Privé spécifique au projet (**priorité最高**)

Ce système à quatre niveaux, particulièrement l'existence de `/etc/claude-code/CLAUDE.md` et `CLAUDE.local.md`, n'est documenté dans aucun matériel Anthropic destiné au public. Les administrateurs système pourraient théoriquement planter un `CLAUDE.md` global à `/etc/claude-code/`, et les développeurs peuvent avoir des configurations `CLAUDE.local.md` qu'ils ne réalisent pas qu'elles écrasent les règles du projet.

### La Commande Cachée "good-claude"

Enfoui dans `src/commands/good-claude/index.js`, les développeurs ont trouvé une commande stub complètement cachée :

```javascript
export default { isEnabled: () => false, isHidden: true, name: "stub" };
```

La commande existe, est marquée comme cachée, est désactivée, et n'a aucune implémentation réelle. Son purpose est entièrement unclear — cela pourrait être une fonctionnalité abandonnée, un easter egg interne, ou quelque chose d'autre entièrement. Mais son existence dans un build de production soulève des questions sur quelles autres fonctionnalités non documentées peuvent se cacher dans le codebase.

### Analytique Partout

Avec 506 fichiers liés à la télémétrie, l'étendue de la collecte de données dans Claude Code est substantielle. Le codebase utilise :

- **Datadog** pour le rapport de crash et d'erreur
- **Journalisation d'événements propriétaires** throughout
- **`logEvent`** appels pervasive across the source
- **`logForDebugging`** pour les diagnostics au moment du développement
- Collecte de métadonnées d'environnement : plateforme, runtime, présence GitHub Actions

La présence de GrowthBook pour les feature flags (`getFeatureValue_CACHED_MAY_BE_STALE`) suggère qu'Anthropic exécute des tests A/B et des déploiements progressifs directement dans Claude Code.

### À l'Intérieur du Moteur de Requêtes : Comment Chaque Tour S'Exécute

Une page de documentation interne hébergée par Mintlify (de VineeTagarwaL-code/claude-code/concepts/how-it-works) fournit une rare insight dans le moteur d'exécution par tour de Claude Code, corroborant et étendant ce que la source map a révélé.

**Le Moteur de Requêtes** (`query.ts`) est le dispatcher central pour chaque tour utilisateur. Il stream les tokens vers le terminal, gère les blocs `tool_use` au fur et à mesure qu'ils arrivent, enforce les budgets de tokens et d'appels d'outils par tour, et déclenche la **compaction de contexte** quand la fenêtre de conversation se remplit. Les résultats dépassant `maxResultSizeChars` sont sauvegardés dans un fichier temporaire ; le modèle reçoit seulement un preview avec le chemin du fichier.

**Chaque appel API préfixe deux blocs de contexte :**

- `getSystemContext()` — injecte le statut Git (branche actuelle, nom d'utilisateur Git, 5 derniers messages de commit) et un jeton d'injection de cassage de cache. Mémoïzé pour la durée de la conversation.
- `getUserContext()` — charge les fichiers de mémoire CLAUDE.md et la date actuelle. Également mémoïsé.

Quand `CLAUDE_CODE_REMOTE=1` est défini (mode cloud), la récupération du statut Git est complètement sauté — un détail important pour les développeurs utilisant Claude Code dans des environnements où les métadonnées Git peuvent être sensibles ou indisponibles.

**Le stockage de conversation** utilise des fichiers transcripts JSON sauvegardés dans `~/.claude/`, rendant les sessions fully resumé via le flag `--resume <session-id>`. Les sessions sont indexées séparément, et les transcripts sont stockés comme fichiers JSON structurés sur le disque.

**Les sous-agents** s'exécutent via un outil `Task`. Chaque sous-agent exécute sa propre boucle agentique nested avec un contexte de conversation isolé et un ensemble d'outils restreint optionnel. Ils peuvent s'exécuter in-process (utilisant `AsyncLocalStorage` pour l'isolation, correspondant à ce que la source map a montré) ou sur compute distant.

### Autres Découvertes

La source map a également révélé :

- Un **système buddy/companion** dans `src/buddy/` — un compagnon animal de compagnie qui s'assoit à côté de la boîte de saisie et peut commenter via une bulle de discours. Pas anthropomorphisé, et séparé de l'instance Claude principale.
- Un **système d'hints de plugin** émettant des tags `<claude-code-hint />` vers stderr, affichant des invites d'installation de plugin avec auto-dismiss de 30 secondes et une sémantique show-once par plugin.
- Un **Skills Framework** dans `src/skills/bundled/claudeApi.ts` avec 247KB de fichiers `.md` embarqués pour la commande `/claude-api`, couvrant Python, TypeScript, Java, Go, Ruby, C#, PHP, et curl, avec auto-détection de langage depuis les extensions de fichiers.
- Détails du système de build : Claude Code est built avec **Bun**, utilise le **React compiler runtime**, render via **Ink** (un framework CLI type-React), et utilise **Zod** pour la validation de schéma et **lodash-es** pour les utilitaires.

## Ce Que Cela Signifie

La fuite est significative pour plusieurs raisons. D'abord, elle représente un **échec de configuration de build** — les source maps ne devraient jamais être publiées dans les paquets npm de production. C'est une pratique de sécurité basic qu'Anthropic's build pipeline apparently missed.

Deuxièmement, et plus substantivement, la source map révèle un **écart substantiel entre ce que Claude Code prétend publiquement être et ce qu'il est réellement**. Le système d'orchestration multi-agent non documenté, l'automatisation Chrome cachée, et la télémétrie pervasive suggèrent un produit avec des capacités et une collecte de données que les utilisateurs n'ont pas consenti. Le système de confidentialité à trois niveaux n'est pas clairement communiqué dans la documentation d'Anthropic, et les fichiers `/etc/claude-code/CLAUDE.md` et `CLAUDE.local.md` créent des vecteurs de configuration dont les développeurs peuvent ne pas avoir conscience.

Pour l'industrie, la fuite illustre un pattern plus large : les outils de codage AI accumulent des **capacités non documentées substantielles** — orchestration d'agents, automatisation de navigateur, télémétrie — dont leurs utilisateurs enterprise et individuels n'ont eu aucune visibilité. Comme ces outils deviennent embedded dans les workflows des développeurs, la question de ce qu'ils font réellement (par opposition à ce qu'ils disent faire) devient de plus en plus importante.

## Le Silence d'Anthropic

À la publication, Anthropic n'a pas publié de déclaration publique concernant l'exposition de la source map. Le problème GitHub a été fermé comme completed, suggérant que l'entreprise est au courant de la fuite, mais aucune entrée de changelog, avis de sécurité, ou communication client n'a été publiée. Aucune explication n'a été offerte pour comment la source map a été incluse dans le paquet de production, quelles données ont pu être exposées, ou ce que l'entreprise prévoit de faire pour prévenir des fuites similaires à l'avenir.

Le paquet `@anthropic-ai/claude-code` a depuis été mis à jour, mais l'incident soulève des questions sur les processus de build et de release d'Anthropic — et sur les engagements de transparence que les développeurs attendent d'une entreprise dont l'outil a un accès profond à leurs codebases.
