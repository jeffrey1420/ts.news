---
title: "WebStorm 2026.1 apporte le moteur TypeScript natif et l'IA multi-agent au flagship IDE de JetBrains"
description: "JetBrains publie WebStorm 2026.1 avec un moteur TypeScript basé sur un service activé par défaut, une intégration avec Junie, Claude Agent et Codex, et un support framework amélioré pour React, Angular, Vue et Svelte."
image: "https://blog.jetbrains.com/wp-content/uploads/2026/03/WS-releases-BlogSocialShare-1280x720-1.png"
date: "2026-03-27"
category: Release
author: lschvn
readingTime: 4
tags: ["webstorm", "jetbrains", "typescript", "ai", "ide", "release"]
tldr:
  - "WebStorm 2026.1 active par défaut un moteur TypeScript basé sur un service, améliorant la correction et réduisant l'utilisation CPU dans les grands projets."
  - "Le chat IA supporte désormais plusieurs agents : Junie, Claude Agent, Codex, Cursor et GitHub Copilot via le registre ACP."
  - "Les « suggestions de prochaine édition » fonctionnent sans consommer de quota IA sur les plans Pro/Ultimate/Enterprise, appliquant des modifications connexes à travers les fichiers."
  - "Les mises à jour framework incluent les directives React `use memo`/`use no memo`, la syntaxe template Angular 21, et le plugin TypeScript Vue 3.2.4."
---

WebStorm 2026.1 est arrivé cette semaine, et les fonctionnalités phares reflètent l'orientation des outils de développement JavaScript : un moteur TypeScript plus intelligent par défaut, et un chat IA unifié qui intègre plusieurs agents dont Claude Agent et Codex aux côtés de Junie de JetBrains.

## Le moteur TypeScript basé sur un service est désormais par défaut

Le plus grand changement sous le capot est le moteur TypeScript. WebStorm utilise désormais une implémentation basée sur un service par défaut, que JetBrains dit améliorer la correction tout en réduisant l'utilisation CPU dans les grands projets. Le changement vise à maintenir la navigation, les inspections et les refactorings réactifs lors du travail avec des bases de code TypeScript substantielles.

La version aligne également WebStorm avec les changements de TypeScript 6, y compris les mises à jour de la façon dont le compilateur gère la valeur `types` et les valeurs par défaut de `rootDir`. Pour les équipes qui suivent la feuille de route de TypeScript 7 — la réécriture Go qui arrivera plus tard cette année — WebStorm a commencé à adapter sa gestion de configuration pour correspondre aux changements planifiés de 7 pour `baseUrl`.

## Le chat IA devient sérieux

L'histoire IA dans cette version est multi-agent par conception. En plus de Junie et [Claude Agent](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026), WebStorm 2026.1 ajoute [Codex](/articles/2026-03-25-ai-dev-tool-rankings-march-2026) au chat IA intégré de l'IDE. Le chat IA de JetBrains supporte désormais aussi Cursor, GitHub Copilot et tout autre agent publié sur le registre ACP.

Le registre ACP, introduit plus tôt cette année, vous permet de parcourir et installer des agents sans quitter l'IDE. L'idée est simple : différents agents excellent dans différentes tâches, et pouvoir basculer entre eux sans interrompre votre flux de travail est l'objectif.

Également nouveau : les « suggestions de prochaine édition » fonctionnent désormais sans consommer de quota IA sur les plans Pro, Ultimate et Enterprise. Contrairement à l'autocomplétion traditionnelle qui ne met à jour que ce qui se trouve à votre curseur, ces suggestions appliquent des modifications connexes à travers un fichier entier — JetBrains l'appelle une expérience « Tab Tab » pour maintenir le code cohérent avec un minimum de friction.

## Mises à jour des frameworks

Le support des frameworks suit le rythme des publications rapides à travers l'écosystème :

- **React** : Coloration pour les nouvelles directives `use memo` et `use no memo` aux côtés des `use client` et `use server` existantes
- **Angular 21** : Support des fonctions fléchées, de l'opérateur `instanceof`, des expressions régulières et de la syntaxe spread dans les templates
- **Vue** : Mis à jour vers `@vue/typescript-plugin` 3.2.4 pour la compatibilité avec les derniers outils TypeScript dans les fichiers `.vue`
- **Astro** : La configuration JSON peut désormais être passée directement au serveur de langage Astro depuis les paramètres de l'IDE
- **Svelte** : Support des génériques dans les balises `<script>` avec recherche d'utilisation, navigation et refactoring de renommage pour les paramètres de type

## Support des import/export en littéral string

WebStorm analyse désormais les noms en littéral string dans les spécificateurs d'import et d'export — une syntaxe conforme aux standards qui fonctionne avec du code comme `export { a as "a-b" }` et `import { "a-b" as a } from "./file.js"`. La navigation, la coloration et le refactoring fonctionnent tous correctement avec cette syntaxe.

## Espaces colorimétriques CSS

Le support des espaces colorimétriques CSS modernes signifie que les sélecteurs de couleur et les aperçus gèrent désormais `oklch`, `oklab`, `hwl` et d'autres formats de couleur définis dans les spécifications CSS Color Level 4.

WebStorm 2026.1 est disponible via l'application Toolbox ou en téléchargement direct sur [jetbrains.com/webstorm/download](https://www.jetbrains.com/webstorm/download).
