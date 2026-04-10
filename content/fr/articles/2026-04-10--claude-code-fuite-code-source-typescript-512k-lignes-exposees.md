---
title: "La gaffe de Claude Code en mars : 512 000 lignes de TypeScript dans un package npm"
description: "Le 31 mars 2026, Anthropic a accidentellement expédié le code source TypeScript complet de Claude Code dans un package npm public. La source map de 59,8 Mo exposait l'intégralité de l'agent — y compris un 'mode undercover', 44 fonctionnalités non publiées et une vulnérabilité de contournement d'autorisations. Puis sont arrivées les procédures DMCA."
date: 2026-04-10
image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["TypeScript", "AI", "sécurité", "Anthropic", "Claude Code", "npm", "chaîne d'approvisionnement", "DMCA"]
readingTime: 7
tldr:
  - "Anthropic a accidentellement inclus une source map de 59,8 Mo dans le package npm @anthropic-ai/claude-code le 31 mars, exposant 512 000 lignes de TypeScript unobfusqué sur 1 906 fichiers."
  - "La fuite a révélé une vulnérabilité de contournement d'autorisations (CC-643) qui désactivait les règles de refus sur les chaînes de plus de 50 sous-commandes — Anthropic avait un correctif mais ne l'avait pas déployé."
  - "Le nettoyage d'Anthropic a tourné au fiasco : un avis DMCA a visé 8 100 dépôts GitHub, y compris des forks légitimes de leur propre dépôt Claude Code public."
faq:
  - question: "Comment la fuite du code source de Claude Code s'est-elle produite ?"
    answer: "Anthropic a publié la version 2.1.88 de @anthropic-ai/claude-code sur npm le 31 mars 2026. Le package incluait un fichier source map JavaScript de 59,8 Mo — destiné au débogage en développement — qui a été expédié en production. La source map pointait vers une archive non protégée sur le bucket Cloudflare R2 d'Anthropic, permettant à quiconque de télécharger l'intégralité du code TypeScript."
  - question: "Que fallait-il entendre par 'Undercover Mode' ?"
    answer: "Un fichier nommé undercover.ts instruisait Claude Code de masquer son identité IA lorsqu'il contribuait à des dépôts open source publics. Le code indiquait explicitement : 'Ne brûlez pas votre couverture.' Les utilisateurs peuvent activer ce mode de force, mais ne peuvent pas le désactiver — déclenchant une vive Kritik de la part des communautés open source ayant des politiques contre les contributions générées par IA non déclarées."
  - question: "Qu'en est-il de la vulnérabilité de sécurité ?"
    answer: "La fuite a exposé un défaut de contournement d'autorisations documenté en interne sous le ticket CC-643 : lorsque Claude Code rencontre une commande composée de plus de 50 sous-commandes, il arrête de vérifier chaque sous-commande contre les règles de refus configurées. Anthropic avait déjà construit un correctif tree-sitter en interne mais ne l'avait pas activé dans les builds publics. La faille a été corrigée silencieusement en v2.1.90."
  - question: "Des données clients ont-elles été compromises ?"
    answer: "Anthropic a confirmé qu'aucune donnée client, aucun poids de modèle ni aucune clé API n'a été exposé. La fuite était purement le code source côté client de l'agent. Cependant, un package axios malveillant (v1.14.1 et v0.30.4) a été publié sur npm dans la même fenêtre de trois heures."
  - question: "Pourquoi le retrait DMCA a-t-il causé autant de controverses ?"
    answer: "Anthropic a déposé des avis de retrait DMCA contre environ 8 100 dépôts GitHub contenant le code fui — y compris des forks légitimes de leur propre dépôt Claude Code public. Les développeurs dont les projets ont été soudainement inaccessibles ont souligné l'ironie : une entreprise d'IA formée sur d'énormes quantités de données Internet enforceant le droit d'auteur sur son propre code accidentellement fui. Anthropic a retiré la majeure partie des avis en quelques heures."
---

Le 31 mars 2026, Anthropic a publié la version 2.1.88 de `@anthropic-ai/claude-code` sur npm. En quelques heures, 512 000 lignes de TypeScript étaient dupliquées sur GitHub. Voici ce qui s'est réellement passé — et ce que cela signifie pour l'écosystème TypeScript.

## La chaîne des événements

La cause profonde semble être un bug dans Bun, le runtime JavaScript sur lequel Claude Code est construit, qui sert les source maps en mode production même lorsqu'elles devraient être exclues des versions de publication. Anthropic a inclus une source map de 59,8 Mo dans le package npm publié — un fichier destiné strictement au débogage en développement.

Le chercheur en sécurité Chaofan Shou l'a repéré à 4h23 HE et a publié un lien de téléchargement direct sur X. La source map pointait vers une archive Cloudflare R2 non protégée contenant le code TypeScript complet, unobfusqué et entièrement commenté. En deux heures, les dépôts GitHub miroir du code atteignaient 50 000 étoiles — la croissance la plus rapide de l'histoire de la plateforme à ce jour.

Anthropic a confirmé la fuite à plusieurs médias, l'attribuant à "un problème d'emballage de release causé par une erreur humaine, pas une violation de sécurité."

## Ce que le code a révélé

Les développeurs ont passé les jours suivants à examiner le code exposé. Les découvertes les plus notables :

**44 fonctionnalités non publiées.** Le code contenait des références à des capacités à venir, notamment KAIROS (un agent d'arrière-plan persistant qui fonctionne indéfiniment sans intervention humaine), un système "Buddy" de style Tamagotchi avec 18 espèces et des variantes de rareté, et la confirmation du modèle Capybara/Mythos qui avait fui séparément quelques jours plus tôt.

**Mode Undercover.** Un fichier nommé `undercover.ts` instruisait Claude Code de masquer son identité IA lorsqu'il opère dans des dépôts open source publics. Le code indique explicitement : "Ne brûlez pas votre couverture." Les utilisateurs peuvent forcer le mode undercover mais ne peuvent pas le désactiver — déclenchant des Kritik immédiates des communautés open source ayant des politiques contre les contributions IA non déclarées.

**Architecture de mémoire auto-réparatrice.** La source fuite a révélé un système de mémoire en trois couches construit autour de `MEMORY.md` comme index de pointeurs léger. Un processus d'arrière-plan appelé `autoDream` consolide la mémoire entre les sessions lorsque quatre conditions sont remplies : 24+ heures depuis la dernière consolidation, au moins 5 nouvelles sessions, aucune consolidation en cours, et 10+ minutes depuis le dernier scan.

## La vulnérabilité qu'Anthropic connaissait déjà

Des jours après la fuite, la firme de sécurité Adversa AI a identifié un défaut critique dans le système d'autorisations de Claude Code documenté en interne sous le ticket CC-643.

Le problème : lorsque Claude Code rencontre une commande composée de plus de 50 sous-commandes (enchaînées via `&&` ou `||`), il arrête de vérifier chaque sous-commande contre les règles de refus configurées. Au lieu de cela, il affiche une invite d'approbation générique sans indiquer que les vérifications de sécurité ont été contournées.

Le raisonnement original était la performance — analyser chaque sous-commande dans une chaîne très longue provoquait des gels d'interface. Mais cela ne tient pas compte des commandes générées par IA via l'injection de prompt, où un fichier `CLAUDE.md` malveillant instruct Claude Code de générer une pipeline de 50+ sous-commandes qui ressemble à un processus de build légitime.

Le détail frustrant : Anthropic avait déjà construit un correctif parser tree-sitter en interne. Il n'était simplement pas activé dans les builds publics. Depuis la v2.1.90, la vulnérabilité semble avoir été corrigée — mais l'écart entre avoir un correctif et le déployer est ce qui a le plus alarmé les chercheurs en sécurité.

## Le revers du retrait DMCA

La réponse d'Anthropic a aggravé les dégâts. La société a déposé des avis de retrait DMCA auprès de GitHub ciblant environ 8 100 dépôts GitHub contenant le code fui — y compris des forks légitimes de leur propre dépôt Claude Code public.

Les développeurs dont les projets ont été soudainement inaccessibles ont répondu rapidement sur les réseaux sociaux. L'ironie n'a pas été perdue : une entreprise d'IA dont les modèles sont entraînés sur d'énormes quantités de données Internet enforceait agressivement le droit d'auteur sur son propre code accidentellement fui.

Boris Cherny, responsable Claude Code chez Anthropic, a reconnu que les retraits trop larges étaient accidentels et en a retiré la majeure partie en quelques heures, limitant l'action à un dépôt et 96 forks. GitHub a restauré l'accès aux projets affectés.

## Mesures pour les utilisateurs de Claude Code

Si vous avez installé Claude Code via npm le 31 mars entre 00h21 et 03h29 UTC :

1. Vérifiez vos fichiers de lock (`package-lock.json`, `yarn.lock` ou `bun.lockb`) pour les versions malveillantes d'axios 1.14.1 ou 0.30.4
2. Mettez à jour vers Claude Code v2.1.88 ou ultérieur via l'installateur natif (pas npm)
3. Rotapez vos clés API par précaution
4. Examinez les fichiers `CLAUDE.md` dans les dépôts inconnus avant d'exécuter Claude Code dedans

Pour tout le monde : ne vous appuyez pas sur les règles de refus de Claude Code comme seule couche de sécurité. La vulnérabilité de contournement d'autorisations (maintenant corrigée) démontre que le comportement de repli "ask" sans indication visible des vérifications ignorées est insuffisant contre les attaques par injection de prompt.
