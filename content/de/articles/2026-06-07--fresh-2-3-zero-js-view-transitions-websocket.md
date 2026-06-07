---
title: "Fresh 2.3: Zero JS Standard, View Transitions und WebSocket-Support"
description: "Fresh 2.3 hält endlich sein Versprechen von 'standardmäßig Null JavaScript', fügt native View-Transitions-Unterstützung hinzu, bringt integrierte WebSocket-Handler, CSP-Nonce-Injection und Temporal-API-Support für Islands."
date: 2026-06-07
image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Deno", "Fresh", "TypeScript", "JavaScript", "view-transitions", "websocket"]
tldr:
  - "Fresh 2.3 liefert Seiten ohne Islands oder Partials tatsächlich ohne JavaScript aus und eliminiert das ~14–22 KB große Client-Entry-Bundle, das selbst auf rein statischen Seiten existierte."
  - "Die View-Transitions-API ist nun mit Freshs Partials-System verbunden — fügen Sie f-view-transition zu Ihrem Body-Tag hinzu und Navigationen werden nativ per CSS animiert."
  - "Integrierter WebSocket-Support über app.ws() und ctx.upgrade(), mit einem Bare-Modus, der das rohe WebSocket-Objekt für gemeinsame Strukturen wie Chaträume zurückgibt."
faq:
  - q: "Wie erreicht Fresh 2.3 standardmäßig Null JavaScript?"
    a: "Fresh 2.3 prüft, ob eine Seite tatsächlich Islands oder Partials verwendet, bevor clientseitiger Code injiziert wird. Wenn eine Seite keines von beiden nutzt, wird sie ohne Script-Tags, ohne Module-Preload-Header und ohne Client-Bundle ausgeliefert — gegenüber ~14–22 KB komprimiert in 2.2."
  - q: "Wie funktionieren View Transitions in Fresh 2.3?"
    a: "Fügen Sie das Attribut f-view-transition zum Body-Tag zusammen mit f-client-nav hinzu: <body f-client-nav f-view-transition>. Fresh wickelt dann partielle Navigationen in document.startViewTransition() ein, und Sie passen Animationen mit den CSS-Regeln ::view-transition-old und ::view-transition-new an. Browser ohne View-Transitions-Support fallen auf normale Partials-Updates zurück."
  - q: "Was ist die neue WebSocket-API in Fresh 2.3?"
    a: "Der schnellste Ansatz ist app.ws('/ws', { open, message, close }) auf der Haupt-App-Instanz. Für dateibasierte Routes verwenden Sie ctx.upgrade() in einem GET-Handler. Der Bare-Modus — ctx.upgrade() ohne Argumente — gibt das rohe WebSocket-Objekt zurück, damit Sie es in einer gemeinsamen Struktur wie einem Set für Chaträume verwalten können."
---
