---
title: "WebStorm 2026.1 : TypeScript Engine basé sur un service et une liste complète d'agents IA"
description: "La version de mars de JetBrains active par défaut un moteur TypeScript basé sur un service, intègre Junie, Claude Agent, Codex et Cursor dans le panneau de chat IA, enterre Code With Me, et ajoute le support natif de Wayland sur Linux."
image: "https://blog.jetbrains.com/wp-content/uploads/2026/03/WS-releases-BlogSocialShare-1280x720-1.png"
date: "2026-04-09"
category: IDE
author: lschvn
readingTime: 5
tags: ["webstorm", "jetbrains", "TypeScript", "IDE", "IA", "agents-IA", "release"]
tldr:
  - "WebStorm 2026.1 active par défaut le moteur TypeScript basé sur un service externe, réduisant l'utilisation CPU et améliorant la réactivité dans les grands projets."
  - "Le chat IA intègre désormais Junie, Claude Agent, Codex, Cursor et GitHub Copilot via le nouveau registre ACP — installez n'importe quel agent en un clic."
  - "Les suggestions de prochaine édition sont disponibles sans consommer votre quota IA, propageant intelligemment les modifications apparentées dans tout un fichier."
  - "Code With Me est abandonné dans la 2026.1 — JetBrains invoque une baisse de la demande et oriente les utilisateurs vers des workflows collaboratifs plus modernes."
faq:
  - q: "Que signifie 'moteur TypeScript alimenté par un service' ?"
    a: "WebStorm délègue désormais l'analyse TypeScript, la vérification de types et les services linguistiques à un processus externe au lieu de les exécuter dans le thread principal de l'IDE. Le résultat : une utilisation CPU réduite et une meilleure réactivité dans les grands monorepos."
  - q: "Cursor est-il vraiment disponible dans WebStorm maintenant ?"
    a: "Cursor a rejoint le registre ACP en mars 2026, ce qui signifie que ses capacités d'agent sont accessibles depuis le panneau de chat IA de WebStorm via le protocole Agent Client. C'est différent de faire de Cursor votre IDE principal."
  - q: "Qu'est-il arrivé à Code With Me ?"
    a: "JetBrains enterre Code With Me, son service de programmation en binôme intégré à l'IDE, à partir de la 2026.1. Il sera désolidarisé de tous les IDEs JetBrains et déplacé sur le Marketplace comme plugin distinct. La 2026.1 est la dernière version à le supporter officiellement."
  - q: "Cette version supporte-t-elle TypeScript 6 ?"
    a: "Oui. WebStorm 2026.1 s'aligne sur les valeurs par défaut modifiées de TypeScript 6 pour `types` et `rootDir`, et prépare déjà le terrain pour les changements de `baseUrl` de TypeScript 7."
---

WebStorm 2026.1 est sorti en mars avec une version qui resserre le lien entre l'EDI et les outils que les développeurs utilisent au quotidien. L'événement principal est un moteur TypeScript plus efficace par défaut, mais le changement le plus visible pour beaucoup sera ce qui se trouve dans la barre latérale du chat IA.

## Moteur TypeScript basé sur un service, activé par défaut

Le changement le plus significatif techniquement de la 2026.1 est le passage du moteur TypeScript basé sur un service de optionnel à par défaut. Les grandes bases de code TypeScript exercent une pression constante sur les éditeurs — vérification de types, navigation et refactoring compete tous pour le CPU dans le thread principal de l'EDI. Le moteur basé sur un service externalise ce travail vers un processus séparé, gardant l'interface plus réactive sans changer la façon dont le code est écrit.

WebStorm affiche également désormais les indices inlay du serveur de langage TypeScript basé sur Go directement dans l'éditeur, si vous l'exécutez. Et comme TypeScript 6 sortait environ au même moment, l'équipe a aligné les valeurs par défaut de l'éditeur sur le comportement modifié de TS6 pour `types` et `rootDir`, et a commencé à préparer les changements de `baseUrl` de TypeScript 7.

Les spécificateurs d'importation et d'exportation à littéraux de chaîne sont désormais entièrement compris par l'analyseur et le navigateur :

```typescript
export { a as "a-b" };
import { "a-b" as a } from "./file.js";
```

La coloration syntaxique, la navigation vers la définition et le renommage fonctionnent tous correctement sur les noms aliasés.

## Le chat IA reçoit une liste complète d'agents

JetBrains a introduit un panneau de chat IA il y a plusieurs versions. Dans la 2026.1, c'est maintenant un hub d'agents. Le registre ACP — une marketplace au sein de l'EDI — vous permet d'installer des agents en un clic. La liste inclut déjà Junie (l'agent propre à JetBrains), Claude Agent, Codex (le modèle de codage d'OpenAI), Cursor et GitHub Copilot, avec d'autres à venir.

Le bénéfice pratique : vous pouvez basculer entre différents agents selon la tâche — Codex pour certaines tâches de génération de code, Claude pour le travail lourd en raisonnement — sans quitter l'éditeur. JetBrains appelle cela le protocole Agent Client (ACP), et c'est conçu pour être ouvert.

## Suggestions de prochaine édition, sans quota IA

L'autocomplétion dans la 2026.1 reçoit une amélioration significative. Les suggestions de prochaine édition vont au-delà de l'achèvement token par token : elles appliquent intelligemment des modifications apparentées dans tout le fichier quand vous appuyez sur Tab.

Crucialement, ces suggestions ne consomment pas votre quota IA sur les abonnements JetBrains AI Pro, Ultimate et Enterprise. C'est une expérience Tab Tab qui reste locale.

## Mises à jour des frameworks

WebStorm 2026.1 apporte le support des nouvelles directives React (`use memo`, `use no memo` aux côtés de `use client` et `use server` existants), de la syntaxe de template Angular 21 complète (fonctions fléchées, `instanceof`, littéraux regex, spread), et une intégration TypeScript Vue mise à jour via `@vue/typescript-plugin 3.2.4`.

Les génériques Svelte dans les balises `<script>` fonctionnent désormais avec la recherche d'utilisation, la navigation vers les déclarations et le renommage. Le serveur de langage Astro accepte la configuration JSON directement depuis les paramètres de l'EDI. Et les aperçus de couleur CSS affiche désormais la fonction `color()` et les espaces colorimétriques CSS étendus.

## Code With Me est enterré

JetBrains enterre Code With Me, son service de programmation en binôme. L'entreprise invoque une baisse de la demande et un virage vers des « workflows modernes adaptés au développement logiciel professionnel ». À partir de la 2026.1, Code With Me est désolidarisé de tous les IDEs JetBrains et migrera sur le Marketplace comme plugin autonome.

## Wayland par défaut sur Linux

WebStorm fonctionne désormais nativement sur Wayland par défaut sur Linux, remplaçant X11 comme serveur d'affichage par défaut. Les bénéfices sont un rendu HiDPI plus net et une meilleure gestion des entrées. L'EDI revient automatiquement à X11 dans les environnements où Wayland n'est pas disponible.

Les utilisateurs PowerShell obtiennent également la complétion en terminal pour les sous-commandes et les paramètres, rejoignant Bash et Zsh où cette fonctionnalité existait déjà.

WebStorm 2026.1 est disponible via la Toolbox App ou en téléchargement direct sur jetbrains.com/webstorm.
