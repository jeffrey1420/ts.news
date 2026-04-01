---
title: "Rivet Agent OS : le système d'exploitation in-process qui exécute les agents IA à 500x moins cher que les sandboxes"
description: "Soutenu par YC et a16z, Rivet a construit un runtime d'agents sur des isolats V8 et WebAssembly qui cold-starte en 4,8 ms — 92x plus rapide que E2B, pour un coût 17x inférieur. Nous avons profondément recherché l'architecture, les benchmarks et les implications."
date: 2026-04-01
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop"
author: lschvn
tags: ["AI agents", "Rivet", "WebAssembly", "V8", "sandbox", "infrastructure", "open source"]
readingTime: 9
tldr:
  - "Rivet Agent OS exécute les agents IA en 4,8 ms de cold start — 92x plus rapide que les sandboxes E2B, à 1/17e du coût, propulsé par les isolats V8 et WebAssembly."
  - "Construit par des fondateurs soutenus par YC W23 et a16z sur l'infrastructure de jeu, agentOS est littéralement un noyau de système d'exploitation in-process : système de fichiers virtuel, table de processus, pipes, PTY et pile réseau."
  - "Apache 2.0 open source + tier cloud à 20$/mois. Acheteur principal : ingénieurs backend/startups construisant des fonctionnalités d'agents IA — pas des devs solo."
faq:
  - question: "Comment agentOS obtient-il des cold starts 92x plus rapides que E2B ?"
    answer: "agentOS utilise des isolats V8 — la même technologie de sandboxing que dans Chrome — s'exécutant dans le processus hôte. E2B boot une VM Linux complète. Pas de VM à booter signifie un cold start p50 de 4,8 ms contre 440 ms. L'empreinte mémoire passe à ~131 Mo contre ~1 Go."
  - question: "agentOS remplace-t-il les sandboxes E2B ou Daytona ?"
    answer: "Non — et c'est bien le propos. agentOS propose explicitement une extension de montage de sandbox pour pouvoir spin up E2B à la demande quand les workloads nécessitent un vrai navigateur ou des binaires natifs. agentOS l'emporte pour les 80 % des tâches d'agent qui n'ont pas besoin d'un OS complet."
  - question: "ACP vs MCP — quel protocole l'emportera ?"
    answer: "MCP (Anthropic) a une mindshare et une adoption écrasantes. ACP (Agent Communication Protocol) est architecturalement supérieur — il définit les sessions, les transcriptions, la logique de reconnexion et les formats universels d'agents. Pensez à LSP (language servers) — il a fallu 10 ans pour qu'il s'impose malgré le fait que la solution était évidemment bonne. ACP est au début."
  - question: "Les startups devraient-elles adopter agentOS aujourd'hui ?"
    answer: "Pour les fonctionnalités d'agents en production : oui si vous êtes un ingénieur backend/plateforme développant en Node.js. Pour un usage général : c'est en beta, seul l'agent Pi est prêt pour la production, et il n'y a pas encore d'audit de sécurité tiers. L'architecture est solide ; l'écosystème est naissant."
  - question: "Qu'est-ce qu'agentOS ne peut pas faire ?"
    answer: "Pas d'automatisation de navigateur (besoin d'un vrai OS pour ça), pas de workloads GPU, pas de binaires Linux natifs en dehors des cibles WASM, pas d'agents macOS/Windows. La couche POSIX WASM est partielle — git et make sont planifiés mais pas encore livrés."
---

Nous faisions tourner des machines virtuelles Linux complètes pour exécuter des agents IA. Puis quelqu'un s'est rendu compte que nous avions tout faux.

Pendant deux ans, la réponse standard à « comment exécuter un agent de coding de façon sécurisée ? » a été : spin up une VM cloud, booter Linux, démarrer une session shell, lancer votre agent. E2B. Daytona. Modal. Chaque framework d'agents adoptait le même modèle mental que pour déployer un serveur web — un système d'exploitation complet, un système de fichiers complet, des syscalls vers un vrai noyau, le tout pour un agent qui passe 95 % de son temps à attendre qu'un LLM réponde.

La réponse de Rivet est différente. Très différente.

## Qu'est-ce qu'agentOS ?

agentOS est un **noyau de système d'exploitation in-process écrit en JavaScript**, s'exécutant à l'intérieur d'un processus hôte Node.js. Ce n'est pas du langage marketing — c'est une description précise de l'architecture.

Le noyau gère :
- Un **système de fichiers virtuel** avec des pilotes de montage (S3, SQLite, répertoires hôtes, en mémoire)
- Une **table de processus** assurant le suivi des processus enfants, des PID, des codes de sortie
- **Des pipes et PTY** pour la communication inter-processus
- Une **pile réseau virtuelle** avec des règles programmables d'autorisation/refus/proxy

Trois runtimes sont montés dans ce noyau :

**1. Isolats V8 pour le code agent.** L'agent (Pi, Claude Code, Codex — bientôt) s'exécute dans un contexte JavaScript V8. C'est la même technologie d'isolation que Chrome utilise pour sandboxer chaque onglet du navigateur. Chaque isolat a son propre heap et stack, aucun état partagé, des permissions refusées par défaut pour l'accès au système de fichiers, au réseau et aux processus. Le cold start est d'environ 4 à 6 ms parce que vous ne booter rien — vous créez simplement un nouveau contexte JavaScript à l'intérieur d'un moteur V8 déjà en cours d'exécution.

**2. WebAssembly pour les utilitaires POSIX.** GNU coreutils, grep, sed, gawk, curl, jq, ripgrep, sqlite3 et plus de 80 autres commandes Unix compilées de C et Rust vers WebAssembly. Ils s'exécutent dans un runtime WASM géré par le noyau — pas dans V8. L'agent communique avec eux via un PTY virtuel, comme dans un shell.

**3. Extension sandbox pour les workloads lourds.** Lorsque vous avez réellement besoin d'un vrai navigateur, de binaires Linux natifs ou d'un accès GPU, agentOS peut monter un sandbox E2B ou Daytona à la demande et l'exposer dans l'arborescence du système de fichiers virtuel. C'est le modèle hybride : des agents légers et rapides pour les 80 % de tâches qui n'ont pas besoin d'un OS complet, des sandboxes complets quand c'est nécessaire.

### Host Tools : le pattern d'intégration qui compte

Le modèle « host tools » est la fonctionnalité la plus sous-estimée d'agentOS. Votre backend expose des fonctions JavaScript à l'agent comme s'il s'agissait de commandes CLI :

```typescript
const weatherToolkit = toolKit({
  name: "weather",
  tools: {
    get: hostTool({
      description: "Obtenir la météo d'une ville.",
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ temperature: 18, conditions: "partiellement nuageux" }),
    }),
  },
});
```

L'agent appelle `agentos-weather get --city Lyon`. Pas de HTTP. Pas d'headers d'authentification. Pas de bond réseau. Le noyau fait le pont directement vers votre fonction Node.js. C'est le bon modèle pour l'intégration backend.

### ACP : LSP pour agents

L'Agent Communication Protocol (ACP) est un protocole standardisé pour la communication éditeur-agent — explicitement modélisé sur le protocole Language Server Protocol (LSP) qui a découplé les serveurs de langage des IDE. ACP définit les sessions, les transcriptions, la logique de reconnexion et les formats universels d'agents. S'il s'impose, les agents deviennent portables entre éditeurs (Cursor, VS Code, etc.) et les éditeurs accedent à tout l'écosystème d'agents ACP. Le parallèle avec LSP est juste : il a fallu une décennie pour que LSP s'impose malgré le fait que la solution était évidemment bonne. ACP en est aux débuts.

## Les chiffres

Tous les benchmarks ci-dessous proviennent des propres материалов de Rivet. Les benchmarks de la bibliothèque secure-exec (la couche la plus granulaire) sont indépendamment reproductibles — Rivet publie les scripts. Tout le reste est auto-déclaré.

| Percentile | agentOS | E2B (sandboxes les plus rapides) | Accélération |
|---|---|---|---|
| Cold start p50 | 4,8 ms | 440 ms | **92x** |
| Cold start p95 | 5,6 ms | 950 ms | **170x** |
| Cold start p99 | 6,1 ms | 3 150 ms | **516x** |

Mémoire par instance : **~131 Mo** (agent de coding complet) vs **~1 024 Mo** (Daytona). Shell simple : **~22 Mo** vs ~1 Go.

Coût en self-hosted sur Hetzner ARM : **0,0000011 $ par seconde**. Comparez avec Daytona à 0,0504 $/vCPU-heure : **17x moins cher**. À pleine utilisation en self-hosted, les économies sont dans une toute autre league.

Ce sont les chiffres en self-hosted. Rivet Cloud commence à **20 $/mois** pour l'offre managée.

## Paysage concurrentiel

agentOS ne compete pas avec Modal (GPU serverless, un problème différent), et ne compete pas vraiment avec E2B ou Daytona — il est conçu pour les compléter. L'extension de montage de sandbox rend la relation explicite : vous utilisez agentOS pour le travail léger, et spin up un sandbox quand vous en avez besoin.

Concurrence réelle : Lambda (mauvais choix pour les agents — cold starts de 100 ms+, aucune primitive agent, limites d'exécution de 15 minutes), Cloudflare Workers AI (inférence uniquement, pas un runtime agent).

**Acheteur principal :** Ingénieurs backend et plateforme dans des startups qui construisent des fonctionnalités d'agents IA et ont besoin d'une infrastructure d'agents rapide, peu coûteuse et intégrable dans leur backend Node.js. Pas les développeurs solo (bien que l'offre gratuite Apache 2.0 soit réelle), et pas les entreprises nécessitant HIPAA ou SOC 2 — agentOS n'a pas encore ces certifications.

## L'entreprise

Rivet Gaming, Inc. — soutenu par YC W23 + a16z Speedrun SR002. Fondateurs Nathan Flurry et Nicholas Kissel. Flurry a précédemment construit l'infrastructure de jeux servant 15M+ MAU et 20k joueurs simultanés. L'ADN jeu-serveur est visible : c'est de la pensée infrastructure à grande échelle appliquée aux agents — coût à l'échelle, exécution rapide, overhead minimal.

La bibliothèque fondamentale de sandboxing, **secure-exec**, est open source séparément. **Rivet Cloud** propose de l'hébergement managé (100k heures-acteur gratuites par mois, payant à partir de 20 $/mois). Les entreprises YC et a16z Speedrun bénéficient de 50 % de réduction pendant 12 mois.

## Implications

Si agentOS delivers sur ses chiffres à l'échelle, chaque provider de sandbox subit une pression. Le substrat d'exécution pour une tâche agent simple — opérations fichiers, appels API, scripting — peut passer de environ 0,05 $/vCPU-minute à 0,0000011 $/seconde. C'est une réduction de coût de 500x pour le runtime, pas pour le LLM.

Pour OpenClaw, Hermes et chaque framework d'agents : l'architecture isolat V8 + FS virtuel est la chose à surveiller. Même si vous n'adoptez pas agentOS directement, le pattern « host tools » (appels de fonction directs, pas d'auth HTTP), le modèle acteur-par-session et l'approche hybride sandbox sont des idées architecturales qui méritent d'être absorbées.

ACP vs MCP est une bataille distincte et plus longue. MCP a la minds share. ACP est architecturalement plus propre. Le parallèle avec LSP mérite d'être gardé en tête — la bonne réponse ne gagne pas toujours dès le premier jour.

## Avertissements

C'est du beta. Seul l'agent **Pi** est prêt pour la production aujourd'hui ; Claude Code, Codex, OpenCode et Amp sont listés comme « bientôt disponibles ». Aucun audit de sécurité tiers n'a été publié. La couche POSIX WASM est partielle — git et make sont planifiés mais pas encore livrées. GitHub compte 1 576 étoiles, ce qui est modeste. L'architecture est solide ; l'écosystème est naissant.

L'image qui ouvre cet article est une carte de circuit. Cela semblait approprié : agentOS est une infrastructure pour ceux qui se préoccupent de ce qui se cache sous le capot.
