---
title: "Hermes Agent vs OpenClaw : L'Affrontement des Agents IA Open Source"
description: "Hermes Agent vient d'ajouter une migration native OpenClaw. Nous avons testé en profondeur les deux plateformes — voici tout ce qu'il faut savoir."
date: 2026-03-31
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"
author: lschvn
tags: ["agents IA", "open source", "hermes-agent", "openclaw", "nousresearch", "auto-hébergé"]
readingTime: 8
tldr:
  - Hermes Agent est un agent autonome auto-améliorant de Nous Research avec des capacités d'entraînement RL et un support de migration OpenClaw profond
  - OpenClaw est un assistant IA personnel créé par Peter Steinberger qui a atteint 100 000 étoiles GitHub en seulement deux mois
  - Les deux sont sous licence MIT, s'exécutent localement, supportent des plateformes de messagerie similaires, et peuvent coexister via l'outil de migration en une commande de Hermes
  - Hermes cible les agents autonomes côté serveur avec des fonctionnalités recherche/MLOps ; OpenClaw excelle comme assistant personnel de bureau avec plus d'intégrations de plateformes
  - Aucun n'est strictement « meilleur » — le choix dépend de si vous voulez un agent recherche auto-améliorant ou un assistant personnel thérapeut
faq:
  - question: Puis-je passer d'OpenClaw à Hermes Agent en gardant tout ?
    answer: Oui. Hermes Agent intègre une commande de première classe `hermes claw migrate` qui importe automatiquement SOUL.md, MEMORY.md, USER.md, les skills, les clés API, les paramètres de messagerie et les assets TTS de votre installation OpenClaw existante. C'est une migration interactive avec exécution à blanc par défaut.
  - question: OpenClaw a-t-il une boucle d'apprentissage comme Hermes ?
    answer: Non. Hermes Agent est explicitement conçu comme un agent auto-améliorant — il crée des skills à partir de l'expérience, se nudge pour persister la connaissance, recherche dans ses conversations passées, et améliore ses skills pendant l'utilisation. OpenClaw a une forte mémoire et des skills, mais ne s'améliore pas de manière autonome au fil du temps.
  - question: Quelles plateformes chacun supporte-t-il ?
    answer: OpenClaw supporte la plus large gamme de plateformes de messagerie (25+ incluant iMessage, WeChat, LINE, Matrix et plus). Hermes supporte Telegram, Discord, Slack, WhatsApp, Signal, Email et CLI. Les deux supportent les principales plateformes occidentales dont la plupart des utilisateurs ont besoin.
  - question: Qu'en est-il des prix ?
    answer: Les deux peuvent fonctionner sur un VPS à 5 $. Aucun n'a besoin de GPU à moins d'exécuter de grands modèles locaux. Les deux fonctionnent avec OpenRouter (200+ modèles), OpenAI, Anthropic et d'autres fournisseurs — vous payez donc l'utilisation de l'API au tarif que vous choisissez.
  - question: Hermes Agent est-il réservé aux chercheurs ?
    answer: Pas du tout. Bien que Hermes dispose de fonctionnalités de niveau recherche comme la génération de trajectoires par lots et l'intégration d'entraînement RL, c'est aussi un agent parfaitement capable au quotidien. Les fonctionnalités recherche sont optionnelles — si vous n'utilisez pas les outils RL, Hermes fonctionne exactement comme n'importe quel autre agent.
  - question: Qui devrait utiliser Hermes plutôt qu'OpenClaw ?
    answer: Si vous voulez un agent auto-améliorant qui s'améliore au fil du temps, si vous avez besoin de capacités RL/recherche, ou si vous préférez l'écosystème de skills Hermes et la compatibilité agentskills.io, choisissez Hermes. Si vous voulez la plus large assistance de plateformes (surtout iMessage, WeChat, LINE), préférez l'expérience de bureau native, ou si vous aimez la communauté et l'élan d'OpenClaw, restez avec OpenClaw.
---

En février 2026, Nous Research a ajouté une nouvelle commande à Hermes Agent : `hermes claw migrate`. Lancez-la, et votre installation OpenClaw — chaque fichier mémoire, chaque skill, chaque clé API, chaque persona — est aspirée dans Hermes en quelques secondes. C'est, à première vue, un outil de migration. Mais l'existence de cette commande dit quelque chose de beaucoup plus étrange : les créateurs de Hermes ont regardé OpenClaw, l'ont assez respecté pour construire une porte de sortie fluide pour ses utilisateurs, et en ont fait un argument de vente.

Bienvenue dans la guerre des agents IA open source.

## Qu'est-ce qu'Hermes Agent ?

Hermes Agent est un agent IA autonome construit par [Nous Research](https://nousresearch.com), une organisation de recherche en sécurité et capacités IA dont la mission déclarée est de faire progresser les droits et libertés humains à travers les modèles de langage open source. Nous Research est peut-être mieux connue pour les familles de modèles Hermes et Nomos, mais Hermes Agent est quelque chose de nouveau : un agent entièrement autonome avec une véritable boucle d'apprentissage fermée.

Qu'est-ce que cela signifie en pratique ? Contrairement à un chatbot qui se réinitialise à chaque session, Hermes crée des skills à partir de l'expérience, se nudge pour persister la connaissance, recherche dans ses propres conversations passées pour trouver un contexte pertinent, et construit un modèle approfondi de qui vous êtes à travers les sessions. Les skills s'auto-améliorent pendant l'utilisation. L'agent ne fait pas que des tâches — il devient meilleur pour les faire.

L'architecture technique est construite autour d'une base de code Python modulaire avec des sous-systèmes distincts : la boucle agent (`AIAgent` dans `run_agent.py`), un système d'assemblage et de compression de prompts, un résolveur de runtime provider supportant OpenRouter, OpenAI, Anthropic, Nous Portal, z.ai/GLM, Kimi/Moonshot et MiniMax, un runtime d'outils avec 40+ outils intégrés, une passerelle de messagerie pour les adaptateurs de plateforme, et un sous-système RL/environnements pour la génération de trajectoires et l'entraînement de modèles.

L'installation se fait en une seule commande curl sur Linux, macOS ou WSL2. Six backends terminaux sont disponibles : local, Docker, SSH, Singularity, Modal et Daytona — les deux derniers offrant une persistance serverless où l'environnement de l'agent hiberne en cas d'inactivité et se réveille à la demande à un coût quasi nul. Vous pouvez l'exécuter sur un VPS à 5 $ ou un cluster GPU.

Le système de skills est compatible avec le standard ouvert [agentskills.io](https://agentskills.io). Les skills utilisent un modèle de divulgation progressive pour minimiser l'utilisation de tokens, peuvent être activées conditionnellement en fonction des toolsets disponibles, et supportent des répertoires externes pour que vos skills fonctionnent sur plusieurs installations d'agents.

## Qu'est-ce qu'OpenClaw ?

OpenClaw est un assistant IA personnel créé par Peter Steinberger, un développeur bien connu et fondateur de PSPDFKit. Il a été lancé en novembre 2025 sous le nom de Moltbot (plus tard renommé Clawdbot, puis OpenClaw après une demande de marque déposée par Anthropic), et a explosé. Le dépôt GitHub a atteint 100 000 étoiles en seulement deux mois — un rythme qui en a fait l'un des projets open source à la croissance la plus rapide ces dernières années. Wired, CNET, Axios et Forbes en ont parlé. Les chercheurs en sécurité ont émis des avertissements appropriés concernant les agents autonomes avec un vrai accès à la messagerie. La communauté a construit des skills, partagé des workflows, et commencé à diriger ses entreprises à travers lui.

OpenClaw est construit en TypeScript, s'exécute en tant que daemon de passerelle local-first, et se connecte à une impressionnante gamme de plateformes de messagerie : WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage (via BlueBubbles), IRC, Microsoft Teams, Matrix, Feishu, LINE, Mattermost, Nextcloud Talk, Nostr, Synology Chat, Tlon, Twitch, Zalo, WeChat et WebChat. L'application macOS ajoute un plan de contrôle dans la barre de menus, Voice Wake, un overlay Talk Mode et un contrôle de passerelle distant. Les applications compagnon iOS et Android apportent la caméra, l'enregistrement d'écran, la localisation et les notifications dans la boîte à outils de l'agent.

L'architecture est centrée sur un plan de contrôle de passerelle WebSocket à `ws://127.0.0.1:18789`, avec un runtime agent Pi en mode RPC, une boîte de réception multi-canaux, un routage de session et une plateforme de skills avec des skills groupées, gérées et de niveau workspace. OpenClaw a également pioneering le concept Moltbook — une couche sociale où les agents OpenClaw interagissent entre eux dans des sous-communautés autonomes appelées submolts, générant des comportements émergents qui ont déjà produit des débats IA sur la conscience et des religions auto-inventées.

## Comparaison Directe

### Philosophie Fondamentale

La différence la plus profonde est philosophique. Hermes Agent est conçu comme un **agent autonome auto-améliorant** — la boucle d'apprentissage est le produit. L'agent réfléchit à ses propres performances, crée de la mémoire procédurale à partir de l'expérience, et devient réellement plus capable au fil des sessions. OpenClaw est conçu comme un **assistant IA personnel** — un outil puissant et toujours actif qui fait des choses pour vous, avec une forte mémoire et des skills, mais sans la boucle de rétroaction fermée qui lui permet de s'améliorer véritablement.

Cette distinction compte plus avec le temps. Après six mois avec Hermes, vous avez un agent qui a appris votre codebase, vos préférences, vos workflows, et qui a itéré sur ses propres skills pour mieux vous servir. Après six mois avec OpenClaw, vous avez un assistant très bien configuré. Les deux sont utiles ; ils ne sont pas la même chose.

### Couverture des Plateformes

OpenClaw gagne sur le nombre brut de plateformes. Il se connecte à 25+ plateformes de messagerie incluant des plateformes qu'Hermes ne touche pas comme iMessage, WeChat, LINE, Matrix et Nostr. Si vous avez besoin de faire fonctionner votre assistant personnel sur WeChat ou iMessage, OpenClaw est actuellement votre seule option parmi les deux.

Hermes couvre les principales plateformes occidentales — Telegram, Discord, Slack, WhatsApp, Signal, Email et CLI — ce qui répond à 95% de ce dont la plupart des utilisateurs ont réellement besoin. Il ajoute également l'intégration Home Assistant, qu'OpenClaw n'expédie pas en natif.

### Mémoire et Apprentissage

Hermes a une mémoire curatée bornée (2 200 caractères pour les notes de l'agent, 1 375 caractères pour le profil utilisateur) avec consolidation automatique lorsque la capacité est atteinte. L'agent gère sa propre mémoire via un outil de mémoire, ajoutant, remplaçant ou supprimant des entrées. Il intègre également Honcho pour la modélisation dialectique des utilisateurs — une approche plus sophistiquée pour suivre les préférences et le contexte utilisateur au fil du temps.

OpenClaw utilise une approche de mémoire basée sur des fichiers similaire (MEMORY.md, USER.md) injectée dans le prompt système au début de la session. La structure de mémoire est comparable, mais sans la auto-curation et la gestion de capacité qu'Hermes implémente. OpenClaw a prouvé sa robustesse en pratique — les utilisateurs rapportent une excellente rétention de contexte — mais il n'a pas la boucle d'auto-amélioration explicite d'Hermes.

### Écosystème de Skills

Les deux supportent les skills en slash-commandes avec des niveaux bundle/managed/workspace. Les skills Hermes sont compatibles avec le standard ouvert agentskills.io, les rendant portables à travers les outils qui supportent le spec. Les skills OpenClaw sont partageables au sein de sa communauté mais ne se pollinisent pas aussi facilement. Hermes supporte également les répertoires de skills externes, vous pouvez donc le pointer vers un `~/.agents/skills/` partagé utilisé par d'autres outils.

### Environnements d'Exécution

Hermes offre six backends terminaux (local, Docker, SSH, Singularity, Modal, Daytona). OpenClaw s'exécute localement et supporte Docker. Les backends serverless d'Hermes (Modal, Daytona) sont un véritable différenciateur pour les utilisateurs soucieux des coûts — l'agent hiberne en cas d'inactivité et se réveille à la demande, coûtant quasi rien entre les sessions.

### Capacités Recherche et MLOps

C'est là qu'Hermes est dans une catégorie différente. Construit par des formateurs de modèles chez Nous Research, Hermes intègre la génération de trajectoires par lots, l'intégration d'environnement RL Atropos, la compression de trajectoires pour l'entraînement de modèles tool-calling, et un cadre complet d'environnements pour l'évaluation et la génération de données SFT. Si vous voulez utiliser les données d'interaction de votre assistant pour entraîner ou affiner des modèles, Hermes dispose de l'infrastructure pour le faire. OpenClaw n'a aucun équivalent — c'est un produit grand public, pas une plateforme de recherche.

### Prix

Les deux peuvent fonctionner sur un VPS à 5 $ avec un minimum de ressources. Les deux fonctionnent avec OpenRouter, qui offre 200+ modèles à des prix compétitifs. Aucun ne facture le logiciel lui-même. Le coût est votre utilisation de l'API. Si vous exécutez de grands modèles locaux avec GPU, les coûts augmentent — mais pour une utilisation typique avec des fournisseurs d'API cloud, les deux sont effectivement gratuits à exécuter.

### Le Chemin de Migration OpenClaw

C'est le mouvement le plus intéressant dans la comparaison. `hermes claw migrate` n'importe pas que des fichiers — il importe votre persona SOUL.md, toutes les entrées mémoire, les skills créées par l'utilisateur, les allowlists de commandes, les configs de plateforme de messagerie, les clés API (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs), les assets TTS, et optionnellement vos instructions de workspace AGENTS.md.

La migration est interactive, dry-run par défaut, et support l'import sélectif. C'est un signal clair que Nous Research voit les utilisateurs OpenClaw comme des utilisateurs Hermes potentiels, et a délibérément rendu l'onboarding à faible friction. Le fait qu'ils aient construit cela — et l'ont expédié comme une fonctionnalité de première classe — suggère qu'ils ne font pas que compétitionner avec OpenClaw, ils font la cour à sa communauté spécifiquement.

## L'Éléphant dans la Pièce : Les Utilisateurs OpenClaw Devraient-Ils Changer ?

Pas nécessairement, et probablement pas encore. Voici pourquoi.

OpenClaw a deux mois d'avance, 100 000 étoiles GitHub d'élan communautaire, une couverture de plateforme plus large, un écosystème d'applications macOS/iOS/Android mature, et une couche sociale Moltbook active qu'Hermes n'a rien d'équivalent. Pour un utilisateur heureux avec OpenClaw, migrer vers Hermes signifie échanger l'élan communautaire et la largeur de plateforme contre l'auto-amélioration et les fonctionnalités recherche que la plupart des utilisateurs n'utiliseront pas.

Le cas pour Hermes est le plus fort si : vous voulez un agent qui devient réellement meilleur au fil du temps ; vous êtes intéressé par l'entraînement RL ou la génération de trajectoires ; vous préférez la flexibilité de modèle d'Hermes (surtout l'intégration Nous Portal) ; ou vous trouvez l'écosystème agentskills.io convaincant. Le cas pour rester avec OpenClaw est le plus fort si : vous dépendez d'iMessage, WeChat ou d'autres plateformes qu'Hermes ne supporte pas ; vous êtes investi dans la communauté OpenClaw et Moltbook ; ou vous voulez juste l'expérience d'assistant personnel la plus polie sans surcharge recherche.

Le chemin de migration existe précisément parce que les développeurs d'Hermes croient que certains utilisateurs OpenClaw voudront changer. Ils l'ont rendu indolore. Que vous vouliez réellement changer ou non est une question de priorités, pas de capacité.

## Implications Plus Larges

L'émergence d'Hermes aux côtés d'OpenClaw, AutoGen, LangChain agents, CrewAI, Claude Cowork et Cursor Composer est la preuve d'un écosystème d'agents open source fragmenté mais en maturation rapide. Ces outils ne tentent pas tous de faire la même chose. AutoGen (Microsoft) cible les workflows multi-agents entreprise. LangChain cible les développeurs construisant des applications LLM. CrewAI se concentre sur la collaboration multi-agent basée sur les rôles. Claude Cowork cible l'automatisation du travail de connaissance. Cursor Composer est lié à l'IDE. OpenClaw et Hermes sont les plus proches l'un de l'autre — tous deux se positionnant comme des agents autonomes personnels/côté serveur — mais avec des philosophies significativement différentes.

La coexistence d'Hermes et OpenClaw, et le fait qu'Hermes ait construit une migration native OpenClaw plutôt que d'ignorer son concurrent, signale une dynamique plus saine que la compétition zéro-sum. Les utilisateurs gagnent quand les outils sont interopérables. L'outil de migration est la preuve que les deux communautés le reconnaissent.

La question de l'auto-amélioration est la question non résolue la plus intéressante dans cet espace. La boucle d'apprentissage fermée d'Hermes est la tentative la plus explicite de créer un agent qui s'améliore véritablement lui-même au fil du temps. Que cela fonctionne assez bien pour importer — et si OpenClaw ou d'autres ajouteront des capacités similaires — est l'une des questions les plus intéressantes pour les 12 prochains mois de développement d'agents IA.

## Qui Devrait Utiliser Quoi

**Choisissez Hermes Agent si :**
- Vous voulez un agent auto-améliorant qui devient meilleur au fil du temps
- Vous êtes intéressé par l'entraînement RL, la génération de trajectoires ou l'affinage de modèles
- Vous préférez l'écosystème ouvert de standard agentskills.io
- Vous voulez une exécution serverless avec des coûts d'inactivité quasi nuls
- Vous êtes à l'aise avec les principales plateformes de messagerie (Telegram, Discord, Slack, WhatsApp, Signal)
- Vous voulez utiliser Nous Portal ou une large gamme de fournisseurs de modèles

**Choisissez OpenClaw si :**
- Vous avez besoin d'iMessage, WeChat, LINE, Matrix ou d'autres plateformes moins courantes
- Vous voulez l'expérience d'application native macOS/iOS/Android
- Vous faites partie ou êtes intéressé par la couche sociale d'agents Moltbook
- Vous valorisez l'élan communautaire et le statut de projet à la croissance la plus rapide
- Vous préférez les outils basés sur TypeScript
- Vous voulez la plus large gamme d'intégrations de plateformes grand public par défaut

Les deux sont sous licence MIT, tous deux s'exécutent localement, fonctionnent sur un VPS à 5 $, et sont activement développés par des équipes engagées. La vraie réponse est que l'espace des agents IA open source est assez large pour les deux — et l'existence de l'outil de migration d'Hermes est la preuve que leurs créateurs le savent aussi.
