---
title: "Fresh 2.3 : Zero JS par Défaut, View Transitions et Support WebSocket"
description: "Fresh 2.3 tient enfin sa promesse de 'zéro JavaScript par défaut', ajoute le support natif des View Transitions, des handlers WebSocket intégrés, l'injection de nonce CSP et le support de l'API Temporal dans les islands."
date: 2026-06-07
image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Deno", "Fresh", "TypeScript", "JavaScript", "view-transitions", "websocket"]
tldr:
  - "Fresh 2.3 élimine réellement le JavaScript pour les pages sans islands ni partials, supprimant le bundle client-entry de ~14–22 KB qui existait même sur les pages entièrement statiques."
  - "L'API View Transitions est désormais connectée au système de partials de Fresh — ajoutez f-view-transition à votre body et les navigations s'animent nativement en CSS."
  - "Le support WebSocket intégré arrive via app.ws() et ctx.upgrade(), avec un mode bare qui retourne l'objet WebSocket brut pour les structures partagées comme les salons de chat."
faq:
  - q: "Comment Fresh 2.3 atteint-il zéro JavaScript par défaut ?"
    a: "Fresh 2.3 vérifie si une page utilise réellement des islands ou des partials avant d'injecter du code côté client. Si une page n'a ni l'un ni l'autre, elle est livrée sans balises script, sans headers de préchargement de module, et sans bundle client — contre ~14–22 KB compressés en 2.2."
  - q: "Comment fonctionnent les View Transitions dans Fresh 2.3 ?"
    a: "Ajoutez l'attribut f-view-transition à la balise body en même temps que f-client-nav : <body f-client-nav f-view-transition>. Fresh enveloppe alors les navigations partielles dans document.startTransition(), et vous personnalisez les animations avec les règles CSS ::view-transition-old et ::view-transition-new. Les navigateurs sans support des View Transitions retrouvent le comportement normal."
  - q: "Qu'est-ce que la nouvelle API WebSocket dans Fresh 2.3 ?"
    a: "L'approche la plus simple est app.ws('/ws', { open, message, close }) sur l'instance App principale. Pour les routes basées sur des fichiers, utilisez ctx.upgrade() dans un handler GET. Le mode bare — ctx.upgrade() sans arguments — retourne l'objet WebSocket brut pour le gérer dans une structure partagée comme un Set pour les salons de chat."
---
