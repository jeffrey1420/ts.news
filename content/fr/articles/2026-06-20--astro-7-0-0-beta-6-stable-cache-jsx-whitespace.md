---
title: "Astro 7.0.0-beta.6 stabilise le cache des routes et fait de la compression d'espaces JSX la valeur par défaut"
description: "Astro 7.0.0-beta.6 (19 juin 2026) promeut l'API expérimentale de cache des routes au niveau stable racine, supprimant les drapeaux experimental.cache et experimental.routeRules au profit d'une configuration cache de premier niveau et d'un assistant cache. La beta.5 (18 juin) a fait de « jsx » la valeur par défaut de compressHTML, changeant le HTML rendu de tout site qui s'appuyait sur la préservation d'espaces. La beta.6 embarque aussi @astrojs/markdown-satteri 0.3.1-beta.2."
date: 2026-06-20
image: "/images/heroes/2026-06-20--astro-7-0-0-beta-6-stable-cache-jsx-whitespace.png"
author: lschvn
tags: ["frameworks", "tooling", "performance"]
tldr:
  - "Astro 7.0.0-beta.6 (19 juin 2026) promeut le cache des routes, introduit expérimentalement en 6.0, en API stable de premier niveau. Les clés de configuration experimental.cache et experimental.routeRules disparaissent, remplacées par une configuration cache racine et une configuration routeRules qui se traduisent en sémantique HTTP standard quel que soit le fournisseur."
  - "La beta.5 (18 juin) a fait de « jsx » la valeur par défaut de compressHTML. Les espaces autour des éléments sont désormais supprimés à la manière de React et des frameworks JSX similaires. Les sites qui s'appuyaient sur la préservation des espaces entre éléments inline verront un HTML rendu différent, sauf à revenir à compressHTML: true (compression HTML-aware) ou false (tout préserver)."
  - "La beta.6 embarque aussi @astrojs/markdown-satteri 0.3.1-beta.2 et corrige un lot de petits problèmes : nettoyage des avertissements de build Vite et Rolldown, et la page 500.astro personnalisée ne reçoit plus une prop error vide quand l'erreur provient d'un middleware (un correctif de la beta.5 livré avec la beta.6)."
faq:
  - question: "Qu'est-ce qui change dans Astro 7.0.0-beta.6 ?"
    answer: "Le changement principal de la beta.6 est la stabilisation du cache des routes, expérimental depuis 6.0. Les clés experimental.cache et experimental.routeRules sont retirées ; la configuration se fait désormais au premier niveau de astro.config.mjs, et les règles par route se déclarent dans un bloc routeRules racine. Astro traduit ces règles en en-têtes spécifiques au fournisseur (memoryCache, Cloudflare KV, Vercel ISR, etc.) ou en comportement d'exécution. La beta.6 embarque aussi @astrojs/markdown-satteri 0.3.1-beta.2 et nettoie les avertissements de build Vite et Rolldown."
  - question: "Qu'est-ce qui change dans Astro 7.0.0-beta.5 ?"
    answer: "La beta.5 fait de « jsx » la nouvelle valeur par défaut de l'option compressHTML. Les espaces autour des éléments sont supprimés, à la manière de React, Solid, et des autres frameworks basés sur JSX. Les espaces significatifs sur une même ligne, comme un espace simple entre deux éléments inline, sont préservés à moins de les écrire explicitement avec {' '}. Pour retrouver le comportement antérieur d'Astro, réglez compressHTML: true (compression HTML-aware) ou compressHTML: false (tout préserver)."
  - question: "Comment migrer depuis experimental.cache et experimental.routeRules en Astro 6 ?"
    answer: "Sortez cache et routeRules du bloc experimental. Utilisez memoryCache, cloudflareKV, vercelISR, ou un autre fournisseur d'astro/config comme valeur de cache.provider, et placez vos règles par route dans routeRules au premier niveau de la configuration. Dans les routes, utilisez Astro.cache dans les pages .astro ou context.cache dans les routes API et le middleware pour définir les directives qu'Astro traduit en en-têtes ou en comportement d'exécution adaptés au fournisseur configuré."
  - question: "La nouvelle valeur par défaut de compressHTML peut-elle casser mon site ?"
    answer: "Oui, si vos templates s'appuyaient sur la préservation des espaces entre éléments inline dans le HTML rendu. Les espaces inline sont la victime la plus fréquente : un retour à la ligne littéral entre deux balises inline est désormais supprimé comme le ferait React. Si vous avez besoin d'un espace que le mode JSX supprimerait, écrivez-le explicitement avec {' '}. Pour conserver l'ancien comportement d'Astro le temps d'auditer, réglez compressHTML: true (compression HTML-aware qui élimine encore certains espaces) ou compressHTML: false (tout préserver)."
  - question: "Les routeRules fonctionnent-elles sur les pages pré-rendues ?"
    answer: "Les routeRules s'appliquent aux pages et endpoints rendus à la demande. Pour les pages pré-rendues, les directives de cache sont encodées au build dans les en-têtes Cache-Control du HTML statique via la configuration routeRules, ce qui signifie que la règle contrôle combien de temps un CDN met en cache la sortie pré-rendue. La matrice complète des fournisseurs (memoryCache, fsCache, cloudflareKV, vercelISR, etc.) est documentée dans le guide de cache des routes qui accompagne la 7.0."
  - question: "Astro 7.0.0-beta.6 est-il utilisable en production ?"
    answer: "Non. La beta.6 est figée en termes de fonctionnalités pour la branche 7.0, mais reste une beta, avec les réserves habituelles. Les API peuvent encore changer d'ici la 7.0 stable, deux changements de valeurs par défaut (la compression d'espaces JSX en beta.5 et la promotion du cache en beta.6) modifient le HTML rendu ou la forme de la configuration pour les projets existants, et la version de @astrojs/markdown-satteri épinglée en beta.6 est elle-même une pré-version. Utilisez la beta.6 pour valider votre migration de configuration de cache, votre pipeline Markdown et vos hypothèses d'espaces, mais gardez la production sur la branche 6.x actuelle."
---

[Astro 7.0.0-beta.6](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.6) est sortie le 19 juin 2026, un jour après la [beta.5](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.5) du 18 juin, et poursuit la série de promotions de fonctionnalités expérimentales longues à stables de la branche 7.0. La principale nouvelle de la beta.6 est que le [cache des routes](https://github.com/withastro/astro/pull/17116), caché derrière `experimental.cache` et `experimental.routeRules` depuis la sortie de 6.0, devient une API stable de premier niveau. La beta.5, la version juste avant, a fait de `compressHTML` la valeur `'jsx'` par défaut, ce qui modifie le HTML rendu de tout projet qui s'appuyait sur la préservation des espaces entre éléments inline. Ces deux changements s'ajoutent à la [stabilisation en beta.4 de Sätteri comme pipeline Markdown par défaut](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.4), couverte dans les [notes de sortie d'Astro 7.0.0-beta.4](/articles/2026-06-16--astro-7-0-0-beta-4-satteri-default-advanced-routing) plus tôt dans le cycle.

La branche 7.0 avance rapidement vers la [stable](/articles/2026-06-22--astro-7-stable-vite8-rust-compiler-ai-agents). La beta.4 (15 juin), la beta.5 (18 juin), la beta.6 (19 juin), et deux alphas avant elles ont promu presque toutes les API expérimentales que 6.x livrait derrière un drapeau, basculé sur un Markdown natif Rust, basculé la gestion d'espaces par défaut sur le style JSX, et stabilisé maintenant le cache des routes. Le coût de migration pour tout projet en 6.x est réel mais mécanique : un renommage de configuration, un audit des espaces, et une vérification que votre fournisseur de cache personnalisé fait partie des options de premier niveau prises en charge.

## Le cache des routes devient stable

Le cache des routes était le dernier grand bloc `experimental` restant de 6.0. La beta.6 le promeut en configuration de premier niveau. La migration tient en un renommage plus un choix de fournisseur :

```js
// astro.config.mjs
import { defineConfig, memoryCache } from 'astro/config';

export default defineConfig({
  cache: {
    provider: memoryCache(),
  },
  routeRules: {
    '/blog/[...path]': { maxAge: 300, swr: 60 },
  },
});
```

Dans les pages `.astro`, vous définissez les directives avec `Astro.cache`, et dans les routes API et le middleware vous utilisez `context.cache`. Astro traduit ces directives en en-têtes adaptés au fournisseur configuré ou en comportement d'exécution, de sorte que la même configuration fonctionne avec memoryCache, fsCache, cloudflareKV, vercelISR, et les autres fournisseurs livrés avec la branche 7.0. La matrice complète des fournisseurs est documentée dans le [guide du cache des routes](https://docs.astro.build/en/guides/caching/) qui accompagne la sortie.

Pour les pages pré-rendues, les règles s'appliquent toujours au build : les directives sont encodées dans les en-têtes `Cache-Control` du HTML statique, ce qui signifie qu'un CDN devant votre site respectera le même `maxAge` et `swr` que vous auriez utilisé pour une page rendue à la demande. C'est la partie la plus subtile du changement pour les projets qui avaient déjà un CDN devant une sortie pré-rendue : la même configuration `routeRules` contrôle désormais à la fois le cache d'exécution à la demande et les en-têtes de cache des assets statiques.

## « jsx » devient la valeur par défaut de compressHTML

La [beta.5](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.5) a fait de `'jsx'` la nouvelle valeur par défaut de l'option `compressHTML`. C'est le même mode de suppression d'espaces qu'utilisent React, Solid, Preact et les autres frameworks basés sur JSX : les espaces autour des éléments sont supprimés, et une ligne significative d'espace entre deux éléments inline est préservée.

La différence compte en pratique. Dans l'ancien mode de compression HTML-aware (l'ancien défaut `compressHTML: true`), Astro conservait un espace unique entre deux éléments inline quand il y avait un retour à la ligne littéral dans la source. Dans le nouveau défaut `'jsx'`, ce retour à la ligne est supprimé, ce qui signifie qu'un template comme :

```astro
<p>
  Bonjour <span>monde</span>
</p>
```

est rendu comme avant, mais un template comme :

```astro
<p>
  Cliquez
  <a href="/x">ici</a>
  pour en savoir plus
</p>
```

est désormais rendu sans le saut de ligne entre « Cliquez », le lien, et « pour en savoir plus ». Partout où vous voulez réellement que cet espace soit visible, écrivez-le explicitement avec `{' '}`.

Pour les projets qui ont besoin de conserver l'ancien comportement le temps d'auditer, la migration tient en une ligne :

```js
// astro.config.mjs
export default defineConfig({
  compressHTML: true, // compression HTML-aware, le défaut 6.x
});
```

Réglez `compressHTML: false` pour désactiver complètement la compression, ou `compressHTML: 'jsx'` pour conserver explicitement la nouvelle valeur par défaut. La beta.5 corrige aussi un ensemble de bugs de routage avancé `astro/hono` et `astro/fetch` qui s'accumulaient dans le cycle 7.0, dont un où la page `500.astro` personnalisée recevait une prop `error` vide quand l'erreur provenait du middleware.

## La vue d'ensemble de la 7.0

Entre la beta.4 et la beta.6, la branche 7.0 a désormais stabilisé ou remplacé presque toutes les fonctionnalités expérimentales que 6.x livrait derrière un drapeau. Sätteri (Markdown natif Rust) est la valeur par défaut, le routage avancé avec Hono est stable, le logger personnalisé est stable, le moteur de rendu en streaming est stable, la compression d'espaces JSX est la valeur par défaut, et le cache des routes est désormais stable au premier niveau. Le travail restant sur la 7.0 avant la stable tient surtout dans le polissage de l'outillage de build, la graduation finale de `@astrojs/markdown-satteri`, et le [support de Vite 8](https://vite.dev/) arrivé au cours du cycle alpha et beta.

## Que faire maintenant

Pour les projets en 6.x : passez au dernier patch 6.x et commencez la migration de configuration tôt. Sortez `cache` et `routeRules` du bloc `experimental`, choisissez votre fournisseur, et exécutez la beta.6 contre une branche de staging. Auditez vos templates pour le changement d'espaces : partout où vous comptez sur un retour à la ligne entre deux éléments inline produisant un espace visible, basculez sur `{' '}` ou retombez sur `compressHTML: true` le temps de l'audit. La liste complète des ruptures de la branche 7.0 est dans le [CHANGELOG](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md) du dépôt `withastro/astro`. Gardez la production sur la branche 6.x et traitez la beta.6 comme la cible de validation.
