---
title: "Astro 7.0.0-beta.4 fait de Sätteri le processeur Markdown par défaut et promeut le routage avancé, le logger personnalisé et le rendu en flux en stable"
description: "Astro 7.0.0-beta.4 (15 juin 2026) active par défaut le pipeline Markdown Rust Sätteri, retire le drapeau expérimental du routage avancé, du logger personnalisé et du nouveau moteur de rendu, supprime les commandes CLI obsolètes astro db/login/logout/link/init, et intègre en standard le mode serveur de développement en arrière-plan ajouté en alpha.2."
date: 2026-06-16
image: "/images/heroes/2026-06-16--astro-7-0-0-beta-4-satteri-default-advanced-routing.png"
author: lschvn
tags: ["frameworks", "tooling", "performance"]
tldr:
  - "Astro 7.0.0-beta.4 est sorti le 15 juin 2026, quatrième bêta de la ligne 7.0, et la première où le [pipeline Markdown Rust Sätteri](/articles/2026-06-01--astro-6-4-rust-satteri-markdown-optimizer), jusqu'ici opt-in, devient le processeur `.md` par défaut. `@astrojs/markdown-remark` n'est plus installé par défaut ; les projets qui ont besoin de la pile unified/remark/rehype doivent désormais l'ajouter explicitement."
  - "La ligne 7.0 stabilise aussi trois fonctionnalités restées derrière des drapeaux expérimentaux en 6.x : le routage avancé (avec support de première classe de Hono et un nouveau point d'entrée par défaut `src/fetch.ts`), le logger personnalisé (avec gestionnaires intégrés `json`, `node` et `console`), et le moteur de rendu en flux qui remplace `experimental.queuedRendering`. `fetchFile` devient une option de configuration de premier niveau."
  - "Autres changements 7.0 qui affectent le travail quotidien : les commandes CLI `astro db`, `astro login`, `astro logout`, `astro link` et `astro init` sont supprimées, les constantes d'événements `astro:transitions` dépréciées et l'assistant `createAnimationScope` disparaissent, et le mode `astro dev` en arrière-plan ajouté en alpha.2 devient le défaut dans les contextes d'agents IA. La ligne 7.0 est aussi la première à supporter officiellement Vite 8 (voir les [notes de la bêta Vite 8.1](/articles/2026-06-15--vite-8-1-beta-wasm-esm-chunk-importmap))."
faq:
  - question: "Quoi de neuf dans Astro 7.0.0-beta.4 ?"
    answer: "Astro 7.0.0-beta.4 (15 juin 2026) est la quatrième bêta de la ligne 7.0. Le changement phare est que Sätteri, le processeur Markdown natif en Rust qui était opt-in en 6.4, devient désormais le processeur `.md` par défaut. La ligne 7.0 stabilise aussi le routage avancé, le logger personnalisé et le nouveau moteur de rendu en flux, supprime plusieurs commandes CLI obsolètes et constantes d'événements de transition, et fait du mode `astro dev --background` ajouté en 7.0.0-alpha.2 le mode par défaut dans les contextes d'agents IA."
  - question: "Qu'est-ce que Sätteri et pourquoi devient-il le défaut dans Astro 7 ?"
    answer: "Sätteri est le processeur Markdown natif en Rust d'Astro, distribué sous le nom `@astrojs/markdown-satteri`. Il a été introduit en [Astro 6.4](/articles/2026-06-01--astro-6-4-rust-satteri-markdown-optimizer) comme remplaçant opt-in du pipeline unified/remark/rehype, avec des gains mesurés de l'ordre de 50 à 80 % sur les temps de build des sites riches en contenu. En 7.0.0-beta.4, il devient le défaut pour tout nouveau projet et pour toute mise à jour de projet Astro existant. Le pipeline historique reste disponible en installant `@astrojs/markdown-remark` et en définissant `markdown.processor: unified()` dans `astro.config.mjs`."
  - question: "Qu'est-ce qui change si j'utilisais le drapeau experimental advanced routing dans Astro 6 ?"
    answer: "La fonctionnalité de routage avancé introduite derrière `experimental.advancedRouting` en 6.3 devient stable en 7.0 et activée par défaut. Le point d'entrée par défaut est désormais `src/fetch.ts` au lieu de `src/app.ts`, et l'option `fetchFile` est une clé de configuration de premier niveau, et non plus imbriquée sous `experimental`. La migration consiste à : retirer le drapeau `experimental.advancedRouting` de votre configuration, puis soit renommer votre point d'entrée personnalisé en `src/fetch.ts`, soit définir `fetchFile: 'app.ts'` pour conserver l'ancien chemin. L'intégration avec Hono (via `astro/hono`) est elle aussi stabilisée, et `getFetchState()` est désormais exposé comme API publique pour les middlewares Hono."
  - question: "Les commandes `astro db`, `astro login` et `astro init` sont-elles supprimées ?"
    answer: "Oui. Les commandes CLI `astro db`, `astro login`, `astro logout`, `astro link` et `astro init` sont supprimées en 7.0. Le paquet `@astrojs/db` est déprécié, et l'équipe recommande d'utiliser directement un client de base de données (Drizzle, Kysely, etc.). La commande `astro init` avait déjà été largement remplacée par `npm create astro@latest` ; les quatre autres sont des produits dans lesquels Astro n'investit plus."
  - question: "Astro 7 supporte-t-il Vite 8 ?"
    answer: "Oui. Astro 7.0 est la première ligne majeure à supporter officiellement Vite 8. Le patch 7.0.0-alpha.1 supprime explicitement l'avertissement indiquant qu'Astro ne supporte pas Vite v8, et le reste des bêtas 7.0 sont compilées et testées contre la branche stable de Vite 8. La [bêta Vite 8.1](/articles/2026-06-15--vite-8-1-beta-wasm-esm-chunk-importmap) récente couvre ce que la nouvelle ligne Vite apporte comme fonctionnalités."
  - question: "Astro 7.0.0-beta.4 est-il utilisable en production ?"
    answer: "Non. Il s'agit d'une bêta de la ligne 7.0, avec les réserves habituelles : les API peuvent encore changer avant la 7.0.0 stable, plusieurs fonctionnalités expérimentales sont en cours de stabilisation, et Sätteri en valeur par défaut est un changement de comportement pour tout projet qui s'appuyait sur le pipeline unified implicite. Utilisez 7.0.0-beta.4 pour valider que votre pipeline Markdown fonctionne toujours, que votre configuration `experimental.advancedRouting` a bien été migrée vers la nouvelle option de premier niveau `fetchFile`, et que vous ne dépendez pas des commandes CLI supprimées. Ne l'épinglez pas en production."
---

[Astro 7.0.0-beta.4](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.4) est sorti le 15 juin 2026, quatrième bêta de la ligne 7.0 et la première où le pipeline Markdown Rust [Sätteri](https://github.com/withastro/astro/pull/16966), jusqu'ici opt-in, devient le défaut. La release s'appuie aussi sur deux bêtas précédentes (7.0.0-beta.3 le 9 juin et 7.0.0-beta.2 plus tôt dans le mois) qui ont fait l'essentiel du travail pour stabiliser le routage avancé, le logger personnalisé et le nouveau moteur de rendu en flux, ainsi que sur deux alphas (7.0.0-alpha.2 et 7.0.0-alpha.0) qui ont apporté la mise à niveau Vite 8 et le mode `astro dev --background` pour les agents de code IA. La ligne 7.0 fait suite au [lancement d'Astro 6 en mars](/articles/2026-03-30-astro-6-rust-compiler-cloudflare) et à [l'opt-in Sätteri d'Astro 6.4](/articles/2026-06-01--astro-6-4-rust-satteri-markdown-optimizer) ; le fil rouge de 7.0 est que presque toutes les fonctionnalités expérimentales que la 6.x livrait derrière un drapeau ont été promues, que le processeur Markdown par défaut est désormais en Rust, et qu'un certain nombre d'API longtemps dépréciées sont enfin supprimées.

## Sätteri devient le processeur Markdown par défaut

L'événement phare de 7.0.0-beta.4 est la [PR #16966](https://github.com/withastro/astro/pull/16966), qui fait passer le processeur `.md` par défaut du pipeline historique unified/remark/rehype à Sätteri, le processeur Markdown natif en Rust qu'Astro 6.4 avait livré en opt-in. La motivation est la performance de build : le [post de lancement d'Astro 6.4](https://astro.build/blog/astro-6-4/) mesurait des gains de l'ordre de 50 à 80 % sur les temps de build des sites riches en contenu, et l'équipe considère Sätteri comme le futur du Markdown Astro depuis l'arrivée de l'optimiseur Markdown Rust. La bêta.4 fait de ce futur le défaut pour tout nouveau projet et pour toute mise à jour de projet Astro existant.

Le changement est mécanique pour les projets qui ne touchent pas à `markdown.remarkPlugins` ou `markdown.rehypePlugins`. Les avertissements de dépréciation sur ces clés de config, introduits en Astro 6.4, sont désormais déclenchés par défaut ; les clés continuent à fonctionner à condition que `@astrojs/markdown-remark` soit installé et que `markdown.processor` soit défini sur `unified()` :

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  markdown: {
    processor: unified(),
  },
});
```

Si le projet n'utilisait Markdown qu'à travers les défauts (pas de plugins remark/rehype, pas de GFM, pas de coloration syntaxique via unified), la mise à jour est un no-op. Sätteri est compatible API avec l'ensemble des fonctionnalités Markdown standard qu'utilisent les fichiers `.md` d'Astro par défaut, et Astro 6.4 a déjà ajouté dans Sätteri le support de la coloration syntaxique via Shiki ainsi que des tables GFM. Le principal coût de migration concerne les projets qui s'appuyaient sur `remark-mermaid`, `rehype-slug` ou d'autres plugins personnalisés : il faut soit les porter sur l'API d'extension de Sätteri, soit rester sur le pipeline historique.

L'autre effet pratique est la taille du bundle : `@astrojs/markdown-remark` et son écosystème transitive unified ne sont plus installés par défaut, ce qui se traduit par un `node_modules` plus petit et un cold install plus rapide pour les projets qui n'en ont pas besoin. L'avertissement de dépréciation devient une exigence dure : si une config définit `markdown.remarkPlugins` ou `markdown.rehypePlugins`, Astro 7.0 refusera de démarrer sans `@astrojs/markdown-remark` comme dépendance directe.

## Le routage avancé devient stable, `fetchFile` passe au premier niveau

La plus grande fonctionnalité que la 7.0 promeut depuis le statut expérimental est le [routage avancé](https://github.com/withastro/astro/pull/16877), introduit derrière `experimental.advancedRouting` en Astro 6.3. La fonctionnalité donne un contrôle total sur la façon dont les requêtes traversent une application Astro, avec un support de première classe pour des routeurs non-Astro comme Hono. La promotion en 7.0 en fait le comportement par défaut, retire le drapeau expérimental et déplace la configuration du point d'entrée vers une nouvelle option de premier niveau `fetchFile`.

Le point d'entrée par défaut est désormais `src/fetch.ts` au lieu de `src/app.ts`. Les projets qui ne personnalisent pas le point d'entrée n'ont rien à faire ; le nouveau fichier est créé automatiquement au premier lancement. Les projets qui ont écrit un `src/app.ts` personnalisé et s'appuyaient sur le drapeau expérimental ont deux options :

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  fetchFile: 'app.ts', // conserver l'ancien chemin de point d'entrée
});
```

Ou, si le projet démarre frais sur la 7.0, renommer le point d'entrée en `src/fetch.ts` et retirer entièrement le drapeau `experimental.advancedRouting`. `fetchFile: null` désactive le point d'entrée pour les projets qui veulent garder `src/fetch.ts` comme leur propre fichier.

La promotion stabilise aussi l'intégration `astro/hono`. `getFetchState()` est désormais une API publique d'`astro/hono`, récupérable depuis un objet de contexte Hono, ce qui permet à des paquets tiers de construire des middlewares Hono qui interagissent avec l'état par requête d'Astro. L'intégration donne à `astro/hono` la même extensibilité qu'`astro/fetch` a depuis la 6.0.

## Logger personnalisé et nouveau moteur de rendu en flux deviennent stables

Deux autres fonctionnalités expérimentales de la 6.x sont promues en 7.0. La [PR #16745](https://github.com/withastro/astro/pull/16745) stabilise le logger personnalisé, qui permet aux projets de remplacer la sortie console par défaut d'Astro par du JSON structuré, ou par un point d'entrée de logger personnalisé qui parle à un service d'agrégation de logs. Les nouveaux gestionnaires intégrés sont `logHandlers.json()`, `logHandlers.node()` et `logHandlers.console()` :

```js
import { defineConfig, logHandlers } from 'astro/config';

export default defineConfig({
  logger: logHandlers.json({
    pretty: true,
    level: 'warn',
  }),
});
```

`context.logger` est désormais toujours disponible dans les routes d'API et les middlewares, même sans logger personnalisé configuré, ce qui supprime un piège de longue date : un projet qui n'avait pas opté se retrouvait silencieusement avec un logger par défaut impossible à personnaliser.

La [PR #16981](https://github.com/withastro/astro/pull/16981) supprime entièrement `experimental.queuedRendering`, puisque le moteur de rendu en flux qui l'a remplacé est désormais stable. L'ancien moteur basé sur une file d'attente disparaît ; le nouveau moteur streame les composants au fur et à mesure qu'ils sont rencontrés, supprime le polling de nœud (qui n'apportait pas de gains concrets) et réduit le cache de contenu à un cache de noms de tags. La migration consiste à retirer le drapeau `experimental.queuedRendering: {}` de la configuration ; si un projet l'avait défini, la clé n'existe plus et Astro 7.0 émettra un avertissement avant de retomber sur le défaut.

## Serveur de développement en arrière-plan pour les agents de code IA

La 7.0.0-alpha.2 a ajouté une fonctionnalité qui est devenue discrètement populaire dans l'écosystème des agents de code IA : la [gestion du serveur de développement en arrière-plan](https://github.com/withastro/astro/pull/16610). Quand un agent de code IA est détecté, `astro dev` démarre désormais automatiquement le serveur de développement comme un processus détaché en arrière-plan, en écrivant un fichier de verrou (`.astro/dev.json`) contenant l'URL du serveur, son port et son PID. Les nouvelles sous-commandes sont `astro dev --background` (démarrer en arrière-plan), `astro dev stop` (l'arrêter), `astro dev status` (vérifier URL, PID, uptime) et `astro dev logs` (avec `--follow` / `-f` pour streamer les nouvelles sorties).

La motivation est simple : les agents de code IA (Claude Code, Codex CLI, Cursor) tournent dans des terminaux où un serveur de développement en avant-plan bloque la boucle principale de l'agent. Le mode arrière-plan garde le serveur en vie à travers les appels d'outils de l'agent et écrit la sortie structurée dans un fichier de log que l'agent peut suivre. L'opt-out est `ASTRO_DEV_BACKGROUND=0`. La fonctionnalité est désormais le défaut dans les contextes d'agents, ce qui représente l'essentiel du paysage des CLI d'agents de code IA à la mi-2026.

Le fichier de verrou est aussi le point d'appui d'une capacité plus large que l'équipe construit progressivement : les agents peuvent lire `.astro/dev.json` pour savoir quel serveur de développement est associé à un projet, le redémarrer à la demande et le nettoyer à la fin d'une session. Le même pattern de verrou est le fondement des hooks de cycle de vie `astro dev` que plusieurs intégrateurs réclamaient depuis la 6.4.

## Ce qui est supprimé dans Astro 7.0

La ligne 7.0 est aussi une release de nettoyage. La [PR #17010](https://github.com/withastro/astro/pull/17010) supprime les commandes CLI `astro db`, `astro login`, `astro logout`, `astro link` et `astro init`. `@astrojs/db` est déprécié ; la recommandation de l'équipe est d'utiliser directement un client de base de données (Drizzle, Kysely, etc.). `astro init` avait déjà été largement remplacée par `npm create astro@latest`. Les trois autres sont des produits dans lesquels Astro n'investit plus.

Les assistants dépréciés d'`astro:transitions` et `astro:transitions/client` (`TRANSITION_BEFORE_PREPARATION`, `TRANSITION_AFTER_PREPARATION`, `TRANSITION_BEFORE_SWAP`, `TRANSITION_AFTER_SWAP`, `TRANSITION_PAGE_LOAD`, les deux guards de type `isTransition*Event()` et `createAnimationScope()`) sont également supprimés. Le remplacement consiste à utiliser directement les noms d'événements du cycle de vie (`event.type === 'astro:before-preparation'`, `'astro:after-swap'`, etc.). Les points d'extension internes `state.provide()`, `state.resolve()`, `state.finalizeAll()` et `App.Providers` de l'API de routage avancé sont eux aussi retirés ; le remplacement public est `locals` pour l'état par requête.

La ligne 7.0 est aussi la première à supporter officiellement Vite 8 ; le [patch 7.0.0-alpha.1](https://github.com/withastro/astro/releases/tag/astro%407.0.0-alpha.1) supprime explicitement l'avertissement indiquant qu'Astro ne supporte pas Vite v8. Les bêtas 7.0 sont compilées et testées contre la branche stable de Vite 8, ce qui signifie que les [fonctionnalités de la bêta Vite 8.1](/articles/2026-06-15--vite-8-1-beta-wasm-esm-chunk-importmap) (imports `.wasm` directs, `build.chunkImportMap`, renommage `server.hmr` → `server.ws`) sont disponibles aux projets Astro 7 dès que l'utilisateur met Vite à niveau en 8.1.

## Qui est concerné

Le coût de migration pour le projet Astro moyen est faible : la plupart verront un pipeline Markdown plus rapide à la mise à niveau, et les nouveaux défauts fonctionnent tels quels. Les migrations les plus risquées sont celles qui touchaient `experimental.advancedRouting` (retirer le drapeau, choisir entre renommer en `src/fetch.ts` ou définir `fetchFile`), celles qui utilisaient les constantes d'événements `astro:transitions` (remplacer par les noms d'événements en chaîne), et celles qui dépendent des commandes CLI supprimées (`astro db`, `astro login`, `astro logout`, `astro link`, `astro init`).

La cut stable 7.0 est attendue une fois que les retours sur la bêta actuelle se stabilisent, avec les avertissements de dépréciation sur `markdown.remarkPlugins`, `markdown.rehypePlugins` et `markdown.remarkRehype` qui resteront bruyants pour un cycle de release supplémentaire avant de devenir des erreurs dures. D'ici là, 7.0.0-beta.4 est la bonne version sur laquelle valider, et le bon moment pour signaler toute remarque restante sur le défaut Sätteri ou sur la nouvelle convention de point d'entrée `src/fetch.ts`.
