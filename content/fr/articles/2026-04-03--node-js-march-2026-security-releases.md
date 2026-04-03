---
title: "Node.js Mars 2026 : Six Correctifs de Sécurité Sur Toutes les Branches Actives"
description: "Node.js a publié des correctifs de sécurité d'urgence pour v25, v24, v22 et v20 le 24 mars 2026, corrigeant deux CVE à haute sévérité dont un crash TLS SNICallback et un risque de pollution prototype HTTP. Détails."
date: 2026-04-03
image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Node.js", "sécurité", "CVE", "TLS", "HTTP", "TypeScript"]
readingTime: 5
tldr:
  - "Node.js a publié des correctifs de sécurité pour v25.8.2, v24.14.1, v22.22.2 et v20.20.2 le 24 mars 2026, fermant six CVE sur toutes les branches actives."
  - "Les corrections les plus critiques concernent CVE-2026-21637 (crash TLS SNICallback, High) et CVE-2026-21710 (pollution prototype HTTP via headersDistinct/trailersDistinct, High)."
  - "Également corrigés : comparaison HMAC timing-safe, erreurs de contrôle de flux NGHTTP2, collision hash d'indices tableau, et deux failles du système de permissions."
faq:
  - question: "Quelles versions de Node.js sont affectées ?"
    answer: "Toutes les lignes de release Node.js actives ont reçu des mises à jour : v25.8.2 (Current), v24.14.1 (LTS), v22.22.2 (LTS) et v20.20.2 (LTS)."
  - question: "Qu'est-ce que CVE-2026-21637 ?"
    answer: "Cette vulnérabilité permettait à une exception non gérée dans le TLS SNICallback de faire planter un processus Node.js. wrapping le callback dans un try/catch corrige le problème."
  - question: "Qu'est-ce que CVE-2026-21710 ?"
    answer: "Les objets headersDistinct et trailersDistinct utilisaient un prototype Object standard, les rendant vulnérables à des attaques de pollution prototype. La correction utilise Object.create(null)."
---

Node.js a publié un ensemble coordonné de correctifs de sécurité le 24 mars 2026, couvrant six CVE sur chaque ligne de release active. Si vous utilisez Node en production, c'est la mise à jour que vous attendiez.

## Les Deux Correctifs à Haute Sévérité

**CVE-2026-21637 — Crash TLS SNICallback (High)**

TLS SNICallback permet à un serveur de sélectionner le bon certificat selon le hostname du client. La vulnérabilité : si votre implémentation SNICallback levait une exception, Node.js ne la capturait pas, faisant planter le processus entier durant le handshake TLS. Matteo Collina a corrigé cela en wrappant l'invocation SNICallback dans un try/catch.

**CVE-2026-21710 — Pollution Prototype HTTP (High)**

Les objets `headersDistinct` et `trailersDistinct` dans les réponses HTTP Node.js utilisaient des prototypes JavaScript standards. Cela ouvre une vecteur d'attaque par pollution prototype : si un attaquant pouvait influencer les clés définies sur ces objets, il pouvait injecter des propriétés comme `__proto__` ou `constructor`. La correction : utiliser un prototype null (`Object.create(null)`).

## Quatre Correctifs de Sévérité Moyenne et Basse

**CVE-2026-21713 — Comparaison HMAC Timing-Safe (Medium)**
Filip Skokan a corrigé l'implémentation HMAC Web Cryptography pour utiliser une comparaison timing-safe, empêchant les attaques par canal auxiliaire.

**CVE-2026-21714 — Contrôle de Flux NGHTTP2 (Medium)**
RafaelGSS a corrigé un problème où les erreurs `NGHTTP2_ERR_FLOW_CONTROL` non gérées pouvaient causer des blocages dans les connexions HTTP/2.

**CVE-2026-21717 — Test de Collision Hash (Medium)**
Joyee Cheung a mis à jour la suite de tests V8 pour détecter correctement les attaques par collision hash sur les indices de tableau.

**CVE-2026-21715 et CVE-2026-21716 — Failles du Système de Permissions (Low)**
Deux vérifications de permissions manquaient dans `realpath.native` et les APIs `fs/promises`, permettant un accès filesystem hors des chemins permis.

## Autres Changements

- **undici mis à jour vers v6.24.1**
- **npm amélioré vers 10.9.7** sur les branches v22 et v25
- V8 mis à jour sur toutes les branches avec les correctifs de sécurité upstream

## Ce Qu'il Faut Faire

Si vous utilisez l'une des versions affectées, mettez à jour immédiatement. Pour les utilisateurs LTS, v22.22.2 est la ligne LTS recommandée actuelle.

---

*Couverture quotidienne de l'écosystème TypeScript et JavaScript sur [ts.news](https://ts.news).*
