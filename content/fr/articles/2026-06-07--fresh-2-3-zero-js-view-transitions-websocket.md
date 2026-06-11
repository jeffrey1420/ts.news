---
title: "Fresh 2.3 : Zero JS par Défaut, View Transitions et Support WebSocket"
description: "Fresh 2.3 tient enfin sa promesse de 'zéro JavaScript par défaut', ajoute le support natif des View Transitions, des handlers WebSocket intégrés, l'injection de nonce CSP et le support de l'API Temporal dans les islands."
date: 2026-06-07
image: "/images/heroes/2026-06-07--fresh-2-3-zero-js-view-transitions-websocket.png"
author: lschvn
tags: ["css", "runtimes", "frameworks"]
tldr:
  - "Fresh 2.3 élimine réellement le JavaScript pour les pages sans islands ni partials, supprimant le bundle client-entry de ~14–22 KB qui existait même sur les pages entièrement statiques."
  - "L'API View Transitions est désormais connectée au système de partials de Fresh — ajoutez f-view-transition à votre body et les navigations s'animent nativement en CSS."
  - "Le support WebSocket intégré arrive via app.ws() et ctx.upgrade(), avec un mode bare qui retourne l'objet WebSocket brut pour les structures partagées comme les salons de chat."
faq:
  - question: "Comment Fresh 2.3 atteint-il zéro JavaScript par défaut ?"
    answer: "Fresh 2.3 vérifie si une page utilise réellement des islands ou des partials avant d'injecter du code côté client. Si une page n'a ni l'un ni l'autre, elle est livrée sans balises script, sans headers de préchargement de module, et sans bundle client — contre ~14–22 KB compressés en 2.2."
  - question: "Comment fonctionnent les View Transitions dans Fresh 2.3 ?"
    answer: "Ajoutez l'attribut f-view-transition à la balise body en même temps que f-client-nav : <body f-client-nav f-view-transition>. Fresh enveloppe alors les navigations partielles dans document.startViewTransition(), et vous personnalisez les animations avec les règles CSS ::view-transition-old et ::view-transition-new. Les navigateurs sans support des View Transitions retrouvent le comportement normal."
  - question: "Qu'est-ce que la nouvelle API WebSocket dans Fresh 2.3 ?"
    answer: "L'approche la plus simple est app.ws('/ws', { open, message, close }) sur l'instance App principale. Pour les routes basées sur des fichiers, utilisez ctx.upgrade() dans un handler GET. Le mode bare — ctx.upgrade() sans arguments — retourne l'objet WebSocket brut pour le gérer dans une structure partagée comme un Set pour les salons de chat."
---

« Zéro JavaScript par défaut », c'est l'argument de Fresh depuis le premier jour. La vraie petite ligne en bas du contrat : même une page sans island ni partial embarquait un petit entry client — entre 14 et 22 KB gzippés selon le projet. Pas un scandale, mais pas zéro non plus. Fresh 2.3, [annoncé sur le blog Deno](https://deno.com/blog/fresh-2.3), comble cet écart pour de bon.

## Vraiment zéro, cette fois

Rien à configurer. Après la mise à jour, Fresh vérifie au rendu si une page utilise réellement des islands ou des partials. Si ce n'est pas le cas, la réponse ne contient aucune balise script, aucun header de préchargement de module, aucun bundle client. Une page marketing, un article de blog, une page de docs : du HTML brut sur le réseau.

Pour le constater vous-même, mettez à jour et ouvrez l'onglet réseau sur une route statique. La différence se mesure facilement : là où la 2.2 chargeait l'entry client sur chaque page, la 2.3 ne charge rien tant qu'aucune island n'apparaît.

## View Transitions en un attribut

Fresh proposait déjà la navigation côté client via son système de partials (`f-client-nav`). La version 2.3 y branche l'API View Transitions du navigateur. On active avec un attribut, juste à côté de celui qu'on a déjà :

```html
<body f-client-nav f-view-transition>
```

Les navigations partielles sont désormais enveloppées dans `document.startViewTransition()`, et l'animation se règle en CSS pur :

```css
::view-transition-old(root) {
  animation: fade-out 150ms ease-out;
}
::view-transition-new(root) {
  animation: fade-in 150ms ease-in;
}
```

Chrome 111+, Edge 111+ et Safari 18+ animent nativement. Firefox pas encore — il retombe simplement sur une mise à jour partielle classique, donc activer l'option ne coûte rien.

## WebSockets sans serveur d'appoint

Jusqu'ici, le temps réel dans une app Fresh passait soit par `Deno.upgradeWebSocket` câblé à la main, soit par un serveur séparé. Fresh 2.3 fait des WebSockets un citoyen de première classe. La version la plus rapide vit sur l'instance `App` :

```ts
app.ws("/ws", {
  open(ctx) {
    console.log("client connecté");
  },
  message(ctx, event) {
    ctx.send(`echo : ${event.data}`);
  },
  close(ctx) {
    console.log("client parti");
  },
});
```

Les routes basées sur des fichiers obtiennent la même capacité via `ctx.upgrade()` dans un handler GET. Et si vous devez gérer les connexions vous-même — un salon de chat qui garde un `Set` de sockets, par exemple — appeler `ctx.upgrade()` sans objet de handlers retourne le `WebSocket` brut et vous laisse piloter le cycle de vie.

## Le reste de la release

Trois ajouts plus discrets méritent l'attention :

- **Nonces CSP.** Fresh peut injecter un nonce par requête dans les scripts et styles qu'il émet, ce qui rend une `Content-Security-Policy` stricte praticable sans maintenir des hashes à la main.
- **Temporal dans les islands.** Les huit types Temporal passent comme props d'island et se sérialisent correctement entre serveur et client — utile maintenant que [Temporal se stabilise dans les runtimes](/articles/2026-04-07--deno-2-7-stabilizes-temporal-api-windows-arm-npm-overrides).
- **Prerendering.** Marquez une route avec `prerender: true` et Fresh la rend en HTML statique au build ; les routes dynamiques peuvent énumérer leurs chemins. Combiné aux pages zéro-JS, Fresh devient discrètement un très bon générateur de sites statiques.

Fresh 2.3 s'installe avec un simple `deno update`, et avec Deno 2.7+ les nouveaux projets se créent via `deno create`. Pour un framework dont l'identité entière est la retenue, c'est la release où la retenue cesse d'être approximative.
