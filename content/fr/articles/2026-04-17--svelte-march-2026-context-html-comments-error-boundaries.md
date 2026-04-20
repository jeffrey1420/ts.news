---
title: "Svelte mars 2026 : Context programmatique, commentaires HTML et Error Boundaries côté serveur"
description: "La mise à jour Svelte de mars apporte createContext pour l'instanciation programmatique de composants, les commentaires HTML dans les balises, et les error boundaries en SSR."
date: 2026-04-17
image: "https://svelte.dev/blog/whats-new-in-svelte-march-2026/card.png"
author: lschvn
tags: ["Svelte", "SvelteKit", "JavaScript", "Framework", "State of JS"]
tldr:
  - createContext peut désormais être utilisé lors de l'instanciation programmatique de composants Svelte via new Component({ target }), corrigeant une limitation de longue date
  - Les commentaires HTML sont désormais valides à l'intérieur des balises dans les templates, et les error boundaries fonctionnent côté serveur pour le rendu SSR
  - Svelte reste le framework réactif le mieux classé dans le State of JS 2025, conservant sa position pour la deuxième année consécutive
faq:
  - q: "Comment utiliser createContext programmatiquement dans Svelte 5 ?"
    a: "Passez une Map de context comme deuxième argument du constructeur : new Component({ target: element, props: {...}, context: new Map([[key, value]]) })"
  - q: "Que signifie le support TrustedHTML en pratique ?"
    a: "{@html} accepte désormais TrustedHTML (Secure Types API), ce qui indique au vérificateur de types que la chaîne HTML est déjà sanitized et sûre à insérer."
  - q: "Comment fonctionnent les error boundaries côté serveur ?"
    a: "Utilisez le composant svelte:boundary avec transformError pour intercepter et transformer les erreurs server-side, similaire aux error boundaries côté client."
---

La version Svelte de mars 2026 apporte un ensemble d'amélioration qui comblent des lacunes de longue date — notamment autour de l'instanciation programmatique de composants et de la gestion d'erreurs côté serveur — tout en continuant à affiner les API de navigation de SvelteKit.

## `createContext` en mode programmatique

Dans Svelte 5, `createContext` et `getContext` permettent de partager un état dans un arbre de composants sans avoir à le passer en props. La limitation était que le context ne fonctionnait qu'avec les composants rendus via le système normal de slots/transitions de Svelte. Appeler `new Component({ target })` pour instancier un composant programmatiquement ne permettait pas d'accéder à la map de context.

Svelte 5.50.0 corrige cela. Vous pouvez désormais passer une Map `context` comme troisième argument du constructeur de composant :

```js
import { mount, setContext } from 'svelte';
import { MyContextKey } from './keys.js';

const ctx = new Map([[MyContextKey, { value: 42 }]]);
const component = new MyComponent({ target: document.body, props: {}, context: ctx });
```

Cela rend pratique l'utilisation de composants Svelte comme de simples classes JavaScript dans des bibliothèques et des utilitaires de test, sans restructurer la façon dont le context est fourni.

## Commentaires HTML dans les balises, et TrustedHTML

Deux changements au niveau du compilateur atterrissent dans la même release. Les commentaires HTML sont désormais autorisés à l'intérieur des attributs de balises HTML :

```svelte
<button 
  -- Un commentaire dans la liste d'attributs est désormais valide --
  class="primary"
  onclick={handler}>
  Cliquez-moi
</button>
```

Parallèlement, les expressions `{@html}` acceptent désormais `TrustedHTML` — issu de la Web Secure Types API. Cela vous permet d'indiquer au système de types qu'une chaîne a déjà été sanitized et ne doit pas déclencher le crochet `any` habituel lors de l'assignation à `{@html}`.

## Les Error Boundaries atteignent le serveur

Les error boundaries (`svelte:boundary`) ne fonctionnaient auparavant que côté client. Svelte 5.53.0 les étend au rendu côté serveur, vous pouvez désormais intercepter et transformer les erreurs survenant pendant le SSR sans faire tomber toute la page. Cela compte pour les apps SvelteKit qui récupèrent des données au moment de la requête — un composant qui échoue ne fait plus planter l'ensemble de la réponse.

## SvelteKit : les callbacks de navigation obtiennent des données de scroll

Les callbacks de navigation (`beforeNavigate`, `onNavigate`, `afterNavigate`) incluent désormais des informations de position de scroll sur les cibles `from` et `to`. Cela permet des animations de transition conscientes du scroll — vous pouvez vérifier si l'utilisateur navigue en arrière ou en avant et animer en conséquence, sans gestion supplémentaire.

La mise à jour stabilise également le support de Vite 8 (kit@2.53.0) et ajoute un addon officiel `better-auth` au CLI Svelte (`sv@0.12.0`).

## State of JS 2025 : Svelte garde la première place

Une rapide satisfaction : les résultats du [State of JS 2025](https://2025.stateofjs.com/en-US) sont publiés, et Svelte conserve sa position de framework réactif le mieux classé en termes de sentiment positif pour la deuxième année consécutive. La catégorie inclut Solid, Vue, React, Angular et d'autres — le score de satisfaction développeur de Svelte continue de se démarquer.

## Temps forts communautaires

Le habituel florilège de projets notables construits avec Svelte ce mois-ci :

- **[Cherit](https://keshav.is-a.dev/Cherit/)** — base de connaissances open-source Markdown construite avec Tauri
- **[Le site du hackathon mondial Mistral AI](https://worldwide-hackathon.mistral.ai/)** — construit avec Svelte, comme noté sur Reddit
- **[Fretwise](https://fretwise.ai/)** — plateforme de pratique de guitare alimentée par l'IA, générant des tablatures et des stems isolés
- **[SoundTime](https://github.com/CICCADA-CORP/SoundTime)** — streaming de musique auto-hébergé avec partage P2P, construit avec Rust + Svelte
- **[warpkit](https://github.com/upstat-io/warpkit)** — framework SPA Svelte 5 autonome avec routage state-based et récupération de données
- **[svelte-grab](https://github.com/HeiCg/svelte-grab)** — outil dev qui capture le contexte des composants pour les agents de coding IA, Alt+Click sur n'importe quel élément pour inspecter l'état et tracer les erreurs

L'écosystème Svelte continue de croître dans des directions qui dépassent largement l'application web traditionnelle — des outils musicaux aux simulateurs de hardware en passant par les intégrations IA.
