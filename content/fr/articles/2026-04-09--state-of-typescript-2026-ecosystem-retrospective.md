---
title: "État de TypeScript 2026 : langage #1 sur GitHub, Project Corsa et la facture de la supply chain"
description: "Un regard rétrospectif sur les événements majeurs qui ont redéfini la position de TypeScript dans l'écosystème JavaScript — du dépassement de JavaScript sur GitHub à la réécriture du compilateur en Go pour des builds 10x plus rapides."
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
date: "2026-04-09"
category: Ecosystem
author: lschvn
readingTime: 6
tags: ["TypeScript", "GitHub", "Project Corsa", "npm", "sécurité", "écosystème", "Go", "Node.js"]
tldr:
  - "TypeScript est devenu le langage #1 sur GitHub en août 2025, avec 2,6 millions de contributeurs mensuels — une hausse de 66% en glissement annuel — qualifiée par GitHub de changement de langage le plus significatif en plus d'une décennie."
  - "Project Corsa de Microsoft, un port natif du compilateur TypeScript en Go, a montré des accélérations de builds de 10x dans les benchmarks initiaux et cible TypeScript 7.0 comme première version basée sur Go."
  - "L'écosystème npm a fait face à des attaques coordonnées de sa supply chain (s1ngularity, debug/chalk, Shai-Hulud) et à la vulnérabilité React2Shell CVSS 10.0, forçant une remise à niveau de la sécurité dans le monde JS."
  - "Node.js 22.18 a stabilisé l'exécution native TypeScript via le type stripping, permettant l'exécution directe de fichiers .ts sans transpilation — un jalon qui divise fondamentalement TypeScript en syntaxe effaçable et syntaxe runtime."
faq:
  - q: "Qu'est-ce que Project Corsa ?"
    a: "Project Corsa est le port natif par Microsoft du compilateur TypeScript et du service linguistique du JavaScript vers Go. Les benchmarks initiaux ont montré la compilation du codebase VS Code en 7,5 secondes contre 77,8 secondes. TypeScript 6.0 est la dernière version sur l'ancien codebase ; TypeScript 7.0 (mi-2026 prévu) devrait être la première版本 basée sur Go."
  - q: "Quels ont été les incidents de supply chain npm en 2025 ?"
    a: "Trois incidents majeurs : s1ngularity, la compromission de debug et chalk, et l'attaque Shai-Hulud. La CISA a publié une alerte sur Shai-Hulud en septembre 2025. Le fil conducteur était l'exploitation automatisée des failles d'authentification des mainteneurs et des vulnérabilités des workflows CI."
  - q: "Que signifie 'type stripping' pour Node.js ?"
    a: "Le type stripping est une fonctionnalité Node.js permettant d'exécuter des fichiers TypeScript directement sans transpilation. Node.js ignore la syntaxe de type au runtime mais exécute la syntaxe runtime comme les enums et les namespaces. Node.js 22.18 a stabilisé cela fin 2025, le rendant pleinement stable dans v25.2.0."
  - q: "Qu'est-ce que React2Shell (CVE-2025-55182) ?"
    a: "Une vulnérabilité d'exécution de code à distance critique dans les React Server Components avec un score CVSS de 10.0 — la sévérité maximale. Elle a été trouvée dans les applications Next.js utilisant RSC et a forcé une réévaluation sécurité du modèle de sérialisation JavaScript full-stack."
---

2025 fut l'année où TypeScript a cessé d'être une alternative populaire pour devenir le langage par défaut de l'écosystème JavaScript. Cette dominance apporte de nouvelles pressions : goulots d'étranglement des performances du compilateur, examen de la supply chain, et vulnérabilités de sécurité qui vivent à l'intersection des types et du runtime.

## TypeScript devient le langage #1 sur GitHub

En août 2025, GitHub a rapporté que TypeScript était devenu le langage le plus utilisé sur la plateforme avec 2 636 006 contributeurs mensuels — une hausse de 66% en glissement annuel. GitHub l'a qualifié du changement de langage le plus significatif en plus d'une décennie. JavaScript domine encore en nombre de dépôts, mais la trajectoire est claire : les nouveaux projets utilisent de plus en plus TypeScript par défaut, et l'écosystème d'outils a suivi.

## Project Corsa : la réécriture en Go arrive

Microsoft a annoncé Project Corsa début 2025 : un port natif du compilateur TypeScript et du service linguistique vers Go. L'objectif est approximativement 10x plus rapide en compilation et une compilation incrémentielle quasi instantanée. Les benchmarks initiaux étaient frappants — le codebase VS Code est passé de 77,8 secondes à 7,5 secondes ; Playwright de 11,1 secondes à 1,1 seconde.

TypeScript 6.0, sorti au Q1 2026, est prévu comme dernière version majeure sur l'actuel codebase compilé en JavaScript. TypeScript 7.0 (cible mi-2026) devrait être la première版本 construite sur le compilateur Go. Les auteurs de plugins utilisant l'API Compilateur devront vérifier la compatibilité avec la nouvelle implémentation.

## Exécution TypeScript native dans Node.js

Node.js 22.18 a stabilisé l'exécution TypeScript native via le type stripping. Au lieu de transpiler `.ts` en `.js` avant l'exécution, Node.js comprend maintenant quelle syntaxe TypeScript est effaçable (types, interfaces) et laquelle est runtime (enums, namespaces) et gère ces derniers directement. Le flag `--erasableSyntaxOnly` formalise la contrainte.

Pour beaucoup de projets, cela élimine `ts-node` et `tsx` comme dépendances de dev. Pour les bibliothèques aware des types, cela signifie repenser les patterns comme l'utilisation des enums au profit d'objets `as const` et de modules ES.

## La Facture de la Supply Chain

Trois incidents ont marqué 2025 :

**s1ngularity** : une campagne automatisée qui a compromis plusieurs paquets largement utilisés en exploitant les failles d'authentification des mainteneurs.

**debug/chalk** : deux paquets fondamentaux — utilisés dans pratiquement chaque projet JavaScript — ont été compromis par des prises de contrôle de comptes de mainteneurs. Le rayon de destruction était énorme.

**Shai-Hulud** : une campagne documentée par la CISA ciblant l'écosystème npm en septembre 2025, utilisant les vulnérabilités des workflows CI pour publier des versions malveillantes sous des noms de paquets légitimes.

La réponse a été systémique : npm applique désormais l'authentification à deux facteurs au moment de la publication de manière plus large, la communauté pousse pour des jetons granulaires à courte durée de vie, et les organisations revoient leurs arbres de dépendances avec une nouvelle urgence.

## React2Shell : le réveil CVSS 10.0

Les applications Next.js utilisant les React Server Components se sont avérées vulnérables à la CVE-2025-55182, une vulnérabilité d'exécution de code à distance avec un score CVSS de 10.0. La faille résidait dans le traitement de la sérialisation des données côté serveur dans RSC — une classe de vulnérabilité théoriquement comprise mais jamais weaponizée à ce niveau de sévérité.

Le correctif a atterri en décembre 2025, mais l'incident a remodelé la façon dont la communauté pense la frontière entre serveur et client dans le modèle de composants de React. Les frameworks JavaScript full-stack sont désormais sous une surveillance plus étroite des chercheurs en sécurité.

## Perspective : TypeScript 7 et le futur strict

Le rapport State of TypeScript 2026 décrit une feuille de route 2026 dominée par la migration. TypeScript 7 n'est pas qu'une mise à niveau de performance — c'est une version avec des changements cassants. Le mode `strict` sera activé par défaut, le ciblage ES5 sera abandonné (ES2015+ uniquement), `baseUrl` sera supprimé, et la résolution de module Node classique sera retirée.

L'année 2025 a montré que la dominance de TypeScript ne fait plus de doute. Ce qui reste à voir, c'est comment l'écosystème gère la complexité qui l'accompagne.
