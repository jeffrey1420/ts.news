---
title: "WebStorm 2026.1 : Moteur TypeScript natif et IA multi-agents pour l'EDI phare de JetBrains"
description: "JetBrains sort WebStorm 2026.1 avec un moteur TypeScript alimenté par un service activé par défaut, une intégration avec Junie, Claude Agent et Codex, et un support amélioré des frameworks React, Angular, Vue et Svelte."
image: "https://blog.jetbrains.com/wp-content/uploads/2026/03/WS-releases-BlogSocialShare-1280x720-1.png"
date: "2026-03-27"
category: Release
author: lschvn
readingTime: 4
tags: ["webstorm", "jetbrains", "typescript", "ai", "ide", "release"]
tldr:
  - "WebStorm 2026.1 active un moteur TypeScript basé sur un service par défaut, améliorant la justesse et réduisant l'utilisation CPU sur les gros projets."
  - "Le chat IA supporte maintenant plusieurs agents : Junie, Claude Agent, Codex, Cursor et GitHub Copilot via l'ACP Registry."
  - "Les 'suggestions de prochaine modification' fonctionnent sans consommer de quota IA sur les plans Pro/Ultimate/Enterprise."
  - "Mises à jour des frameworks : directives React use memo/use no memo, syntaxe Angular 21, plugin TypeScript Vue 3.2.4."
---

WebStorm 2026.1 est arrivé cette semaine, et les fonctionnalités principales reflètent où l'outillage de développement JavaScript va : un moteur TypeScript plus intelligent par défaut, et un chat IA unifié qui intègre plusieurs agents dont Claude Agent et Codex aux côtés du propre Junie de JetBrains.

## Le moteur TypeScript basé sur un service est maintenant par défaut

Le plus grand changement sous le capot est le moteur TypeScript. WebStorm utilise maintenant une implémentation basée sur un service par défaut, ce que JetBrains dit améliorer la justesse tout en réduisant l'utilisation CPU sur les gros projets. Ce changement vise à garder la navigation, les inspections et les refactorisations réactives lorsqu'on travaille avec des bases de code TypeScript substantielles.

La release s'aligne aussi avec les changements TypeScript 6, incluant les mises à jour de comment le compilateur gère la valeur `types` et les valeurs par défaut de `rootDir`. Pour les équipes qui surveillent la roadmap TypeScript 7 — la réécriture Go prévue plus tard cette année — WebStorm a commencé à adapter sa gestion de config pour correspondre aux changements planifiés de `baseUrl`.

## Le chat IA devient sérieux

L'histoire de l'IA dans cette release est multi-agents par conception. En plus de Junie et [Claude Agent](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026), WebStorm 2026.1 ajoute [Codex](/articles/2026-03-25-ai-dev-tool-rankings-march-2026) au chat IA intégré de l'EDI. Le chat IA JetBrains supporte maintenant aussi Cursor, GitHub Copilot, et tout autre agent publié sur l'ACP Registry.

L'ACP Registry, introduit plus tôt cette année, vous permet de parcourir et installer des agents sans quitter l'EDI. L'idée est simple : différents agents excellent à différentes tâches, et pouvoir basculer entre eux sans casser votre flux de travail est l'objectif.

Autre nouveauté : les "suggestions de prochaine modification" fonctionnent maintenant sans consommer de quota IA sur les plans Pro, Ultimate et Enterprise. Contrairement à l'autocomplete traditionnel qui ne met à jour que ce qui est à votre curseur, ces suggestions appliquent des changements liés à travers un fichier entier — JetBrains appelle ça une "expérience Tab Tab" pour garder le code cohérent avec un minimum de friction.

## Mises à jour des frameworks

Le support des frameworks garde le rythme avec les releases rapides à travers l'écosystème :

- **React** : Mise en surbrillance des nouvelles directives `use memo` et `use no memo` aux côtés des existantes `use client` et `use server`
- **Angular 21** : Support des fonctions fléchées, opérateur `instanceof`, expressions régulières et syntaxe spread dans les templates
- **Vue** : Mise à jour vers `@vue/typescript-plugin` 3.2.4 pour la compatibilité avec le dernier outillage TypeScript dans les fichiers `.vue`
- **Astro** : La configuration JSON peut maintenant être passée directement au serveur de langage Astro depuis les paramètres de l'EDI
- **Svelte** : Support des génériques dans les balises `<script>` avec recherche d'utilisation, navigation et refactorisation de renommage pour les paramètres de type

## Support des importations/exportations en chaînes littérales

WebStorm parse et comprend maintenant les noms littéraux de chaînes dans les spécificateurs d'importation et d'exportation — syntaxe standard conforme qui fonctionne avec du code comme `export { a as "a-b" }` et `import { "a-b" as a } from "./file.js"`. La navigation, la mise en surbrillance et la refactorisation fonctionnent correctement avec cette syntaxe.

## Espaces de couleur CSS

Le support des espaces de couleur CSS modernes signifie que les sélecteurs de couleur et aperçus gèrent maintenant `oklch`, `oklab`, `hwl` et d'autres formats de couleur définis dans les spécifications CSS Color Level 4.

WebStorm 2026.1 est disponible via la Toolbox App ou en téléchargement direct sur [jetbrains.com/webstorm/download](https://www.jetbrains.com/webstorm/download).
