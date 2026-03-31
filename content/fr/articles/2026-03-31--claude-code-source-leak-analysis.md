---
title: "Fuite de Source Map Claude Code : L'agent OS caché, l'automatisation Chrome et les failles de vie privée"
description: "Les développeurs ont découvert que le package npm @anthropic-ai/claude-code@v2.1.88 incluait un fichier source map de production exposant le code source TypeScript complet — révélant une orchestration multi-agents non documentée, un serveur MCP Chrome caché, un moteur de requêtes interne, un système de permissions d'outils, et un système de télémétrie à trois niveaux."
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
  - "Claude Code v2.1.88 a été livré avec une source map de production (cli.js.map) exposant ~4 756 fichiers sources, dont une orchestration multi-agents non documentée."
  - "Un serveur MCP Chrome caché permet à Claude Code de contrôler un navigateur — une capacité jamais annoncée ni documentée par Anthropic."
  - "Un système de confidentialité à trois niveaux avec intégration Datadog et 506 fichiers de télémétrie révèle une collecte de données extensive."
  - "La résolution CLAUDE.md a quatre niveaux de précédence, incluant un fichier système non documenté `/etc/claude-code/CLAUDE.md`."
faq:
  - question: "Faut-il désinstaller Claude Code après la fuite de source map ?"
    answer: "La source map a exposé l'architecture interne de Claude Code, mais ce n'était pas une vulnérabilité ayant fui des données des machines utilisateurs. Aucune clé API, identifiant ou donnée utilisateur n'a été exposé. Mettre à jour vers la dernière version supprime le fichier source map. L'incident est un échec de configuration de build, pas une violation de sécurité de votre environnement."
  - question: "Quelles données Claude Code collecte-t-il réellement ?"
    answer: "Claude Code dispose de trois niveaux de télémétrie : 'default' (tout activé, incluant le rapport d'erreurs Datadog), 'no-telemetry' (analytiques désactivées), et 'essential-traffic' (tout le trafic non essentiel bloqué). Il collecte des métadonnées de plateforme, des informations d'exécution et la présence GitHub Actions. Les feature flags sont gérés via GrowthBook."
  - question: "L'automatisation Chrome cachée est-elle un risque de sécurité ?"
    answer: "Le serveur MCP Chrome nécessite une configuration explicite avec un ID d'extension spécifique et n'est pas actif par défaut. Le problème principal n'est pas l'exploitation active mais le fait qu'Anthropic a développé et expédié une capacité d'automatisation de navigateur sans la documenter."
---

Le 30 mars 2026, les développeurs installant le package npm `@anthropic-ai/claude-code@v2.1.88` ont remarqué quelque chose d'inhabituel : le bundle publié incluait `cli.js.map`, un fichier source map de production qui map le JavaScript minifié vers son code TypeScript original. En quelques heures, la découverte s'est répandue dans les communautés de développeurs, plusieurs développeurs confirmant indépendamment que la source map fournissait une vue quasi complète de l'architecture interne de Claude Code.

Le problème a été formellement signalé via [GitHub issue #41329](https://github.com/anthropics/claude-code/issues/41329) — titré "[BUG] Il semble que le code source de Claude Code ait fuité, avec cli.js.map uploadé sur npm" — et fermé comme complété le même jour. Des développeurs sur Twitter, dont @iamsupersocks, @Fried_rai et @chelaslua, ont partagé des captures d'écran et des analyses de leurs découvertes.

## Ce qui a fui

La source map (`cli.js.map`) est un artefact de build JavaScript standard qui permet aux outils de débogage de mapper le code minifié vers les fichiers sources originaux. Lorsqu'elle est incluse dans un package npm de production, elle expose effectively l'intégralité de l'arborescence source TypeScript à toute personne téléchargeant le package. Dans ce cas, la source map contenait des références à **4 756 fichiers sources**, dont environ **25 fichiers spécifiques à Claude** que les développeurs disent révéler des décisions architecturales qu'Anthropic n'avait pas documentées publiquement.

## Ce qu'ils ont découvert

### L'Agent OS : Un système d'orchestration multi-agents que personne ne connaissait

La découverte la plus frappante était un système complet d'orchestration d'agents. La source map révèle des types d'agents avec des noms qui n'ont jamais apparu dans aucune documentation publique :

- `AgentTool`, `ExploreAgent`, `PlanAgent`, `VerificationAgent`, `GeneralPurposeAgent`, `StatuslineSetupAgent`

Le système utilise `TeamCreateTool` et `TeamDeleteTool`, suggérant que Claude Code peut créer et détruire des équipes d'agents. Les agents communiquent via un système de boîte de réception basée sur des fichiers dans `.claude/teams/{team_name}/inboxes/{agent_name}.json`. L'isolation d'exécution est maintenue via `AsyncLocalStorage`.

**Les permissions d'outils** sont appliquées via une méthode `checkPermissions` avec trois modes : `allow` (exécution immédiate), `ask` (pause avec dialogue de confirmation) et `deny` (rejeté). Le mode `bypassPermissions` ignore toutes les vérifications — une capacité significative qui fonctionne avec le flag `--dangerously-skip-permissions`.

### L'intégration Chrome cachée : le serveur MCP claude-in-chrome

Les développeurs ont trouvé un serveur MCP complet pour l'automatisation du navigateur Chrome :

- Une extension Chrome avec l'ID `fcoeoabgfenejglbffodgkkbkcdhcgfn`
- Des outils incluant `javascript_tool`, `read_page`, `find`, `form_input`, `computer` et `navigate`
- Une capacité d'enregistrement GIF exposée via `mcp__claude-in-chrome__gif_creator`
- Lecture des logs console via `mcp__claude-in-chrome__read_console_messages`

Ce serveur MCP permet apparemment à Claude Code de contrôler un navigateur Chrome directement depuis le CLI — une capacité qui n'a pas été annoncée ni documentée par Anthropic.

### L'écart de vie privée : ce que Claude Code envoie réellement

La source map révèle un système de confidentialité à trois niveaux :

| Mode | Télémétrie | Datadog | Événements internes | Feedback |
|------|-----------|---------|---------------------|----------|
| `default` | Tout activé | ✓ | ✓ | ✓ |
| `no-telemetry` | Analytiques désactivées | ✗ | ✗ | ✗ |
| `essential-traffic` | Trafic non essentiel bloqué | — | — | — |

L'intégration analytique envoie des données à **Datadog** et enregistre des événements internes. Les feature flags sont gérés via **GrowthBook**. La source map contient **506 fichiers** liés à l'analytique et à la télémétrie. Les métadonnées collectées incluent la plateforme, le runtime et la présence GitHub Actions.

### La hiérarchie CLAUDE.md : Quatre niveaux de précédence

Claude Code résout les fichiers `CLAUDE.md` dans un ordre spécifique avec **priorité inversée** :

1. `/etc/claude-code/CLAUDE.md` — Global système pour tous les utilisateurs
2. `~/.claude/CLAUDE.md` — Privé utilisateur-global
3. `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*.md` — Niveau projet
4. `CLAUDE.local.md` — Privé projet-spécifique (**priorité la plus haute**)

### La commande cachée "good-claude"

Dans `src/commands/good-claude/index.js`, les développeurs ont trouvé une commande stub complètement cachée :

```javascript
export default { isEnabled: () => false, isHidden: true, name: "stub" };
```

La commande existe, est masquée, est désactivée et n'a aucune implémentation réelle.

### Analytics partout

Avec 506 fichiers liés à la télémétrie, l'étendue de la collecte de données dans Claude Code est substantielle. Le codebase utilise Datadog pour le rapport d'erreurs, l'enregistrement d'événements internes, `logEvent` et `logForDebugging` de manière omniprésente, et la collecte de métadonnées d'environnement (plateforme, runtime, présence GitHub Actions).

## Ce que cela signifie

La fuite représente un **échec de configuration de build** — les source maps ne devraient jamais être publiées dans les packages npm de production. Plus substantiellement, la source map révèle un **écart substantiel entre ce que Claude Code prétend être et ce qu'il est réellement**. Le système d'orchestration multi-agents non documenté, l'automatisation Chrome cachée et la télémétrie omniprésente suggèrent un produit avec des capacités et une collecte de données auxquelles les utilisateurs n'ont pas consenti.

## Le silence d'Anthropic

À la publication, Anthropic n'a pas émis de déclaration publique sur l'exposition de la source map. L'issue GitHub a été fermée comme complétée, suggérant que la société est au courant de la fuite, mais aucun changelog, avis de sécurité ou communication client n'a été publié.
