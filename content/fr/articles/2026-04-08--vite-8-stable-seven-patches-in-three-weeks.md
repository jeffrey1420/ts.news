---
title: "Vite 8 stable : 7 correctifs en trois semaines"
description: "Vite 8.0.0 stable est sorti le 12 mars, et les correctifs n'ont pas cessé — v8.0.7 est disponible le 7 avril avec des corrections CSS, SSR, WASM et serveur de dev. Un contraste net avec le long cycle bêta."
image: "https://opengraph.githubassets.com/80d818d1ffc6c3698c6a86f9be7dc3212b3713a3d3403d7bdb434efaba84e7fa/vitejs/vite"
date: "2026-04-08"
category: Tooling
author: lschvn
readingTime: 4
tags: ["vite", "javascript", "build-tools", "tooling", "release", "rolldown"]
tldr:
  - "Vite 8.0.0 stable est sorti le 12 mars 2026, avec Rolldown comme bundler unifié remplaçant ESBuild et Rollup."
  - "Sept correctifs (v8.0.1 à v8.0.7) ont suivi en trois semaines, couvrant CSS, WASM SSR, redémarrages du serveur de dev et gestion des sourcemaps."
  - "Le forwarding des consoles navigateur vers le terminal du dev server était une amélioration UX très demandée ajoutée pendant le cycle bêta."
  - "Ce rythme de correctifs reflète les défis d'un swap majeur de bundler — les auteurs de plugins et grands projets doivent surveiller le changelog."
faq:
  - q: "Vite 8 stable est-il sûr en production ?"
    a: "Avec sept correctifs en trois semaines, l'équipe Vite corrige activement les régressions. Pour les nouveaux projets, v8 est raisonnable. Pour les grands projets existants avec config complexe, testez avant de mettre à jour."
  - q: "Quelle est la différence avec l'article Vite 8 bêta du 26 mars ?"
    a: "L'article du 26 mars couvrait les fonctionnalités bêta et la migration Rolldown en profondeur. Cet article se concentre sur la release stable et le rythme inhabituellement rapide de correctifs qui a suivi."
  - q: "Faut-il passer à v8 ou rester sur v7 ?"
    a: "Pour un nouveau projet, utilisez v8. Pour un projet v7 stable avec une config de build complexe, consultez le guide de migration v7 vers v8 avant de mettre à jour."
---

Vite 8.0.0 est passé en stable le 12 mars 2026. Trois semaines et sept correctifs plus tard, l'équipe Vite est sur v8.0.7 au 7 avril. C'est un rythme de réponse plus rapide que la plupart des releases majeures dans l'écosystème JavaScript, et cela reflète la complexité inhérente au remplacement simultané d'ESBuild et Rollup par Rolldown comme bundler unifié.

## Ce qu'a apporté la stable

Le changement principal est Rolldown. Vite 8 est construit autour de `rolldown 1.0.0-rc.9`, remplaçant ESBuild (pré-bundling des dépendances) et Rollup (builds de production) par un seul bundler Rust. Les bénéfices en performance et mémoire sont réels, particulièrement pour les grands projets, mais les cas limites le sont aussi quand des centaines de plugins communautaires sont bâtis sur l'interface exacte des hooks Rollup.

Nouveauté également : la sortie console du navigateur est maintenant transmise au terminal du dev server. C'était une amélioration UX fréquemment demandée — les erreurs et logs apparaissent désormais là où vous regardez déjà.

## Le décompte des correctifs

Le changelog de v8.0.1 à v8.0.7 montre des corrections sur une large surface :

- **v8.0.1** (19 mars) : Premier correctif stable
- **v8.0.2** (23 mars) : Corrections comportement watch
- **v8.0.3** (26 mars) : Affinements watcheurs
- **v8.0.4** (6 avril) : Corrections CSS et SSR
- **v8.0.5** (6 avril) : Corrections SSR et module-runner
- **v8.0.6** (7 avril) : Correctifs continus
- **v8.0.7** (7 avril) : Dernier correctif en date

Les releases en rafale du 6-7 avril suggèrent qu'un lot spécifique de régressions a été trouvé et corrigé rapidement.

## Le forwarding console : petit détail, grand impact UX

L'ajout du forwarding console navigateur vers le terminal (mergé en beta.17) mérite une mention spéciale. Auparavant déconnecté de l'endroit où vous lancez `vite`, le output console apparait maintenant où vous observez déjà. C'est une amélioration de DX qui aligne Vite avec ce que des outils comme Turbopack offrent.

## Vite 7 toujours supporté

Pour les projets pas prêts à migrer, Vite 7 reste supporté. Le guide de migration v7 vers v8 est sur vite.dev. La plupart des projets straightforward migrent sans problème, mais les projets avec plugins personnalisés ou config inhabituelle doivent prévoir du temps de test.

```bash
npm install vite@latest
```
