---
title: "Astro 6.4 : Processeur Markdown Rust Sätteri et Temps de Build Réduits"
description: "Astro 6.4 introduit un processeur markdown optionnel basé sur Rust, une nouvelle option de configuration markdown.processor, et une préservation indépendante du répertoire serveur."
date: 2026-06-01
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200"
author: lschvn
tags:
  - astro
  - javascript
  - typescript
  - sites-statiques
  - web
---

Astro 6.4 est arrivé le 28 mai avec une fonctionnalité majeure qui compte pour tout site à fort contenu : un processeur markdown optionnel basé sur Rust appelé Sätteri, conçu pour remplacer l'écosystème unified sur les sites contenant des centaines ou des milliers de fichiers Markdown.

<!-- more -->

## TLDR

- La nouvelle option de configuration `markdown.processor` permet de remplacer le pipeline markdown d'Astro
- `@astrojs/markdown-satteri` est un processeur basé sur Rust qui accélère drastiquement les builds pour les sites à fort contenu markdown
- La structure du répertoire serveur est désormais préservée indépendamment via `preserveBuildServerDir`
- Les routes SSR on-demand passent maintenant correctement au handler suivant quand une route pré-rendue correspond mais ne peut servir la requête

---

## Le Problème : Unified Est Lent à Grande Échelle

Le pipeline markdown d'Astro a toujours utilisé l'écosystème unified — plugins remark et rehype — qui est puissant mais notoirement lent à grande échelle. Les sites avec de nombreux fichiers Markdown ou MDX finissent avec des temps de build de plusieurs minutes car le processeur unified analyse et transforme le contenu séquentiellement.

Astro 6.4 introduit `markdown.processor` comme nouvelle option de configuration de haut niveau qui remplace les champs existants `remarkPlugins` et `rehypePlugins` :

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkToc from 'remark-toc';

export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkToc],
    }),
  },
});
```

Les configurations existantes utilisant `remarkPlugins`, `rehypePlugins`, `gfm` et `smartypants` fonctionnent toujours — elles sont désormais dépréciées et seront supprimées dans une future version majeure.

---

## Sätteri : L'Alternative Rust

En parallèle de la nouvelle option de configuration, Astro livre `@astrojs/markdown-satteri`, un processeur alimenté par la bibliothèque Rust Sätteri :

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  markdown: {
    processor: satteri({
      features: { directive: true },
    }),
  },
});
```

Sätteri est écrit en Rust et exclut délibérément l'écosystème de plugins remark/rehype. À la place, il supporte nativement les plugins MDAST et HAST — les plugins existants doivent être réécrits pour fonctionner avec le nouveau processeur, mais le gain en rapidité d'analyse est significatif à grande échelle.

Les sites avec des milliers de fichiers markdown devraient voir les améliorations les plus spectaculaires. L'équipe Astro cite le projet Sätteri directement sur [satteri.bruits.org](https://satteri.bruits.org/).

---

## Préservation Indépendante du Répertoire Serveur

Astro 6.4 ajoute `preserveBuildServerDir` aux features de l'adapter API. Cela reflète l'option existante `preserveBuildClientDir` mais pour le répertoire de sortie serveur :

```ts
setAdapter({
  name: 'my-adapter',
  adapterFeatures: {
    buildOutput,
    preserveBuildClientDir: true,
    preserveBuildServerDir: true,
  },
});
```

Auparavant, préserver le répertoire client affectait automatiquement la structure du répertoire serveur. Maintenant les adapters peuvent conserver une disposition cohérente `dist/client/` et `dist/server/` indépendamment.

---

## Correctif de Fallthrough SSR

Un cas limite de longue date dans le rendu on-demand d'Astro est désormais corrigé. Quand une route dynamique pré-rendue et une route dynamique SSR partageaient le même pattern d'URL, les requêtes vers des chemins non pré-rendus retournaient 404 au lieu de passer au handler SSR. La correction ajoute une logique de fallthrough : quand une route dynamique pré-rendue correspond mais ne peut servir la requête, Astro essaie maintenant les routes suivantes.

---

## FAQ

**Dois-je passer à Sätteri immédiatement ?**
Si votre site est suffisamment rapide avec l'écosystème unified, restez dessus. Si vous avez des centaines de fichiers markdown et des temps de build douloureux, Sätteri mérite un test. Attention : les plugins remark/rehype ne fonctionnent pas avec Sätteri.

**Sätteri supporte-t-il toutes les fonctionnalités markdown d'Astro ?**
Il supporte les directives. Le GFM complet (tableaux, listes de tâches, barré) et smartypants sont configurables via les options propres à Sätteri.

**Qu'en est-il des configs `remarkPlugins` existantes ?**
Elles fonctionnent encore en 6.4 mais sont dépréciées. Astro recommande de migrer proactivement vers la nouvelle API `processor`.
