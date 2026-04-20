---
title: "Svelte März 2026: Programmatischer Context, HTML-Kommentare und Server-Seitige Error Boundaries"
description: "Sveltes März-Update bringt createContext für programmatische Komponenteninstanziierung, HTML-Kommentare in Tags und SSR-Error-Boundaries."
date: 2026-04-17
image: "https://svelte.dev/blog/whats-new-in-svelte-march-2026/card.png"
author: lschvn
tags: ["Svelte", "SvelteKit", "JavaScript", "Framework", "State of JS"]
tldr:
  - createContext kann jetzt bei der programmatischen Instanziierung von Svelte-Komponenten via new Component({ target }) verwendet werden, was eine seit langem bestehende Einschränkung behebt
  - HTML-Kommentare sind jetzt innerhalb von HTML-Tags in Templates gültig, und Error Boundaries funktionieren serverseitig für SSR-Fehlerbehandlung
  - Svelte bleibt das am besten bewertete reaktive Framework im State of JS 2025 und hält seine Position zum zweiten Mal in Folge
faq:
  - q: "Wie verwende ich createContext programmatisch in Svelte 5?"
    a: "Übergeben Sie eine Context-Map als zweites Argument an den Konstruktor: new Component({ target: element, props: {...}, context: new Map([[key, value]]) })"
  - q: "Was bedeutet TrustedHTML-Support in der Praxis?"
    a: "{@html}-Ausdrücke akzeptieren jetzt TrustedHTML (Secure Types API), was dem Type-Checker mitteilt, dass der HTML-String bereits sanitized und sicher einzufügen ist."
  - q: "Wie funktionieren serverseitige Error Boundaries?"
    a: "Verwenden Sie die svelte:boundary-Komponente mit transformError, um Server-seitige Fehler abzufangen und zu transformieren, ähnlich wie bei clientseitigen Error Boundaries."
---

Sveltes März-2026-Release bringt eine Reihe von Verbesserungen, die langjährige Lücken schließen — vor allem rund um programmatische Komponenteninstanziierung und Server-seitige Fehlerbehandlung — und setzt die Verfeinerung von SvelteKits Navigations-APIs fort.

## `createContext` geht programmatisch

In Svelte 5 ermöglichen `createContext` und `getContext` das Teilen von State über einen Komponentenbaum ohne Prop-Drilling. Die Einschränkung war, dass Context nur mit Komponenten funktionierte, die über Sveltes normales Slot/Transition-System gerendert wurden. `new Component({ target })` aufrufen, um einen Komponenten programmatisch zu instanziieren, erlaubte keinen Zugriff auf die Context-Map.

Svelte 5.50.0 behebt das. Sie können jetzt eine `context`-Map als drittes Argument an den Komponentenkonstruktor übergeben:

```js
import { mount, setContext } from 'svelte';
import { MyContextKey } from './keys.js';

const ctx = new Map([[MyContextKey, { value: 42 }]]);
const component = new MyComponent({ target: document.body, props: {}, context: ctx });
```

Das macht es praktisch, Svelte-Komponenten als einfache JavaScript-Klassen in Bibliotheken und Test-Utilities zu verwenden, ohne die Art und Weise zu ändern, wie Context bereitgestellt wird.

## HTML-Kommentare in Tags und TrustedHTML

Zwei Änderungen auf Compiler-Ebene landen im selben Release-Zug. HTML-Kommentare sind jetzt innerhalb von HTML-Tag-Attributen erlaubt:

```svelte
<button 
  -- Ein Kommentar in der Attributliste ist jetzt gültig --
  class="primary"
  onclick={handler}>
  Klick mich
</button>
```

Gleichzeitig akzeptieren `{@html}`-Ausdrücke jetzt `TrustedHTML` — Teil der Web Secure Types API. Das erlaubt Ihnen, dem Type-System mitzuteilen, dass ein String bereits sanitized wurde und nicht den üblichen `any`-Escape-Hook auslösen soll, wenn er `{@html}` zugewiesen wird.

## Error Boundaries erreichen den Server

Error Boundaries (`svelte:boundary`) funktionierten zuvor nur auf dem Client. Svelte 5.53.0 erweitert sie auf serverseitiges Rendering, sodass Sie Fehler, die während des SSR auftreten, abfangen und transformieren können, ohne die gesamte Seite zum Absturz zu bringen. Das ist wichtig für SvelteKit-Apps, die Daten zur Request-Zeit holen — eine fehlschlagende Komponente bringt nicht mehr die gesamte Response zum Absturz.

## SvelteKit: Navigation Callbacks erhalten Scroll-Daten

Navigation Callbacks (`beforeNavigate`, `onNavigate`, `afterNavigate`) enthalten jetzt Scroll-Positionsinformationen auf den `from`- und `to`-Navigation-Zielen. Das ermöglicht scroll-bewusste Übergangsanimationen — Sie können prüfen, ob der Benutzer zurück- oder vorwärts navigiert und entsprechend animieren, alles ohne zusätzlichen Verwaltungsaufwand.

Das Update stabilisiert auch Vite-8-Support (kit@2.53.0) und fügt ein offizielles `better-auth`-Addon zum Svelte CLI hinzu (`sv@0.12.0`).

## State of JS 2025: Svelte hält den ersten Platz

Eine schnelle Bestätigung: Die Ergebnisse des [State of JS 2025](https://2025.stateofjs.com/en-US) sind raus, und Svelte behält seine Position als top-bewertetes reaktives Framework beim positiven Sentiment zum zweiten Mal in Folge. Die Kategorie umfasst Solid, Vue, React, Angular und andere — Sveltes Entwickler-Zufriedenheitswert sticht weiterhin heraus.

## Community-Höhepunkte

Die übliche Runde bemerkenswerter Projekte, die diesen Monat mit Svelte gebaut wurden:

- **[Cherit](https://keshav.is-a.dev/Cherit/)** — Open-Source Markdown-Wissensdatenbank, gebaut mit Tauri
- **[Mistral AIs worldwide Hackathon-Seite](https://worldwide-hackathon.mistral.ai/)** — mit Svelte gebaut, wie auf Reddit geteilt
- **[Fretwise](https://fretwise.ai/)** — KI-gesteuerte Gitarren-Lernplattform, die Tabs und isolierte Stems generiert
- **[SoundTime](https://github.com/CICCADA-CORP/SoundTime)** — Self-hosted Music-Streaming mit P2P-Sharing, gebaut mit Rust + Svelte
- **[warpkit](https://github.com/upstat-io/warpkit)**** — eigenständiges Svelte-5-SPA-Framework mit zustandsbasiertem Routing und Datenfetching
- **[svelte-grab](https://github.com/HeiCg/svelte-grab)** — Dev-Tool, das Komponentenkontext für LLM-Coding-Agents erfasst, Alt+Click auf beliebiges Element, um State zu inspizieren und Fehler zu tracen

Sveltes Ökosystem wächst weiter in Richtungen, die weit über die traditionelle Web-App hinausgehen — von Musik-Tools bis zu Hardware-Simulatoren und KI-Integrationen.
