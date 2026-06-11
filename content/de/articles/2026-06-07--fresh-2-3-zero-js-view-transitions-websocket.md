---
title: "Fresh 2.3: Zero JS Standard, View Transitions und WebSocket-Support"
description: "Fresh 2.3 hält endlich sein Versprechen von 'standardmäßig Null JavaScript', fügt native View-Transitions-Unterstützung hinzu, bringt integrierte WebSocket-Handler, CSP-Nonce-Injection und Temporal-API-Support für Islands."
date: 2026-06-07
image: "/images/heroes/2026-06-07--fresh-2-3-zero-js-view-transitions-websocket.png"
author: lschvn
tags: ["css", "runtimes", "frameworks"]
tldr:
  - "Fresh 2.3 liefert Seiten ohne Islands oder Partials tatsächlich ohne JavaScript aus und eliminiert das ~14–22 KB große Client-Entry-Bundle, das selbst auf rein statischen Seiten existierte."
  - "Die View-Transitions-API ist nun mit Freshs Partials-System verbunden — fügen Sie f-view-transition zu Ihrem Body-Tag hinzu und Navigationen werden nativ per CSS animiert."
  - "Integrierter WebSocket-Support über app.ws() und ctx.upgrade(), mit einem Bare-Modus, der das rohe WebSocket-Objekt für gemeinsame Strukturen wie Chaträume zurückgibt."
faq:
  - question: "Wie erreicht Fresh 2.3 standardmäßig Null JavaScript?"
    answer: "Fresh 2.3 prüft, ob eine Seite tatsächlich Islands oder Partials verwendet, bevor clientseitiger Code injiziert wird. Wenn eine Seite keines von beiden nutzt, wird sie ohne Script-Tags, ohne Module-Preload-Header und ohne Client-Bundle ausgeliefert — gegenüber ~14–22 KB komprimiert in 2.2."
  - question: "Wie funktionieren View Transitions in Fresh 2.3?"
    answer: "Fügen Sie das Attribut f-view-transition zum Body-Tag zusammen mit f-client-nav hinzu: <body f-client-nav f-view-transition>. Fresh wickelt dann partielle Navigationen in document.startViewTransition() ein, und Sie passen Animationen mit den CSS-Regeln ::view-transition-old und ::view-transition-new an. Browser ohne View-Transitions-Support fallen auf normale Partials-Updates zurück."
  - question: "Was ist die neue WebSocket-API in Fresh 2.3?"
    answer: "Der schnellste Ansatz ist app.ws('/ws', { open, message, close }) auf der Haupt-App-Instanz. Für dateibasierte Routes verwenden Sie ctx.upgrade() in einem GET-Handler. Der Bare-Modus — ctx.upgrade() ohne Argumente — gibt das rohe WebSocket-Objekt zurück, damit Sie es in einer gemeinsamen Struktur wie einem Set für Chaträume verwalten können."
---

„Zero JavaScript by default" ist seit dem ersten Tag das Versprechen von Fresh. Das ehrliche Kleingedruckte: Selbst eine Seite ohne Islands und ohne Partials lieferte einen kleinen Client-Entry aus — je nach Projekt zwischen 14 und 22 KB gzipped. Kein Skandal, aber eben auch nicht null. Fresh 2.3, [angekündigt im Deno-Blog](https://deno.com/blog/fresh-2.3), schließt diese Lücke endgültig.

## Diesmal wirklich null

Es gibt nichts zu konfigurieren. Nach dem Upgrade prüft Fresh beim Rendern, ob eine Seite tatsächlich Islands oder Partials verwendet. Nutzt sie keines von beidem, enthält die Antwort keine Script-Tags, keine Module-Preload-Header und kein Client-Bundle. Eine Marketing-Seite, ein Blogpost, eine Docs-Seite: reines HTML über die Leitung.

Wer es selbst sehen will: Upgrade einspielen und auf einer statischen Route den Netzwerk-Tab öffnen. Der Unterschied lässt sich leicht messen — wo 2.2 auf jeder Seite den Client-Entry lud, lädt 2.3 nichts, bis die erste Island auftaucht.

## View Transitions mit einem Attribut

Client-seitige Navigation gab es in Fresh schon über das Partials-System (`f-client-nav`). Version 2.3 verdrahtet damit die View-Transitions-API des Browsers. Aktiviert wird per Attribut, direkt neben dem, das man ohnehin schon hat:

```html
<body f-client-nav f-view-transition>
```

Partielle Navigationen werden jetzt in `document.startViewTransition()` verpackt, die Animation steuert man in purem CSS:

```css
::view-transition-old(root) {
  animation: fade-out 150ms ease-out;
}
::view-transition-new(root) {
  animation: fade-in 150ms ease-in;
}
```

Chrome 111+, Edge 111+ und Safari 18+ animieren nativ. Firefox noch nicht — dort fällt Fresh einfach auf ein normales Partial-Update zurück. Früh einzusteigen kostet also nichts.

## WebSockets ohne Beiboot-Server

Bisher bedeutete Echtzeit in einer Fresh-App entweder handverdrahtetes `Deno.upgradeWebSocket` oder einen separaten Server. Fresh 2.3 macht WebSockets zum festen Bestandteil. Die schnellste Variante lebt auf der `App`-Instanz:

```ts
app.ws("/ws", {
  open(ctx) {
    console.log("Client verbunden");
  },
  message(ctx, event) {
    ctx.send(`Echo: ${event.data}`);
  },
  close(ctx) {
    console.log("Client weg");
  },
});
```

Dateibasierte Routen bekommen dieselbe Fähigkeit über `ctx.upgrade()` in einem GET-Handler. Und wer Verbindungen selbst verwalten will — etwa ein Chatraum, der ein `Set` von Sockets hält — ruft `ctx.upgrade()` ohne Handler-Objekt auf und bekommt das rohe `WebSocket`-Objekt samt Lebenszyklus in die eigene Hand.

## Der Rest des Releases

Drei kleinere Neuerungen sind wissenswert:

- **CSP-Nonces.** Fresh kann jetzt pro Request einen Nonce in die ausgelieferten Scripts und Styles injizieren — damit wird eine strikte `Content-Security-Policy` praktikabel, ohne Hashes von Hand zu pflegen.
- **Temporal in Islands.** Alle acht Temporal-Typen lassen sich als Island-Props übergeben und korrekt über die Server/Client-Grenze serialisieren — nützlich, jetzt wo [Temporal sich über die Runtimes hinweg stabilisiert](/articles/2026-04-07--deno-2-7-stabilizes-temporal-api-windows-arm-npm-overrides).
- **Prerendering.** Eine Route mit `prerender: true` markieren, und Fresh rendert sie beim Build zu statischem HTML; dynamische Routen können ihre Pfade aufzählen. Zusammen mit Zero-JS-Seiten wird Fresh nebenbei ein fähiger Static-Site-Generator.

Fresh 2.3 ist ein `deno update` entfernt, neue Projekte entstehen mit Deno 2.7+ über `deno create`. Für ein Framework, dessen ganze Identität Zurückhaltung ist, ist das der Release, in dem die Zurückhaltung aufhört, ungefähr zu sein.
