---
title: "EmDash: Cloudflares TypeScript-basierter WordPress-Nachfolger mit Sandbox-Plugins"
description: "Cloudflare hat EmDash aufgebaut, ein neues Open-Source-CMS, das vollständig in TypeScript geschrieben und von Astro angetrieben wird. Plugins werden in isolierten Dynamic Workers ausgeführt und lösen das jahrzehntealte Sicherheitsproblem von WordPress."
date: "2026-04-07"
image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&h=630&fit=crop"
author: lschvn
tags: ["cloudflare", "typescript", "astro", "cms", "wordpress", "sicherheit", "javascript"]
---

Cloudflare hat diese Woche EmDash gestartet, ein Open-Source-Content-Management-System, das es als „den spirituellen Nachfolger von WordPress" bezeichnet. Das Projekt ist bemerkenswert, weil es vollständig in TypeScript geschrieben, von Astro angetrieben und mit einem fundamentally anderen Ansatz für Plugin-Sicherheit ausgestattet ist.

[tldr]
- EmDash ist ein neues Open-Source-CMS, gebaut auf Astro 6.0, vollständig in TypeScript geschrieben, MIT-lizenziert
- Plugins laufen in sandboxed Dynamic Workers statt direktem Dateisystem-/Datenbankzugriff — und löst damit das Kern-Sicherheitsproblem von WordPress
- 96 % der WordPress-Sicherheitslücken stammen von Plugins; EmDashs kapazitätsbasiertes Modell beseitigt diese Angriffsoberfläche
- Einsetzbar auf Cloudflare Workers oder jedem Node.js-Server; frühe Entwickler-Beta verfügbar
[/tldr]

## Warum WordPress einen Nachfolger Brauchte

WordPress betreibt über 40 % des Internets. Es wurde 2003 gestartet, bevor AWS EC2 existierte, und seine Plugin-Architektur hat sich seitdem grundlegend nicht verändert. Ein WordPress-Plugin ist ein PHP-Skript mit direktem Zugriff auf Ihre Datenbank und Ihr Dateisystem. Wenn Sie ein Plugin installieren, gewähren Sie ihm volles Vertrauen.

Die Zahlen sind erschreckend: 96 % der WordPress-Sicherheitslücken stammen von Plugins, und 2025 gab es mehr hochkritische WordPress-Plugin-Schwachstellen als in den beiden vorherigen Jahren zusammen. Das Modell ist das Problem, nicht einzelne Plugin-Entwickler.

EmDash wettet, dass man ein CMS für das Serverless-Zeitalter bauen kann — wo Plugins deklarieren, was sie über ein Manifest brauchen und nur diese Fähigkeiten erhalten — ohne die Zugänglichkeit zu opfern, die WordPress so dominant gemacht hat.

## Wie das Sandboxing Funktioniert

In EmDash läuft jedes Plugin in seinem eigenen [Dynamic Worker](https://developers.cloudflare.com/workers/runtime-apis/bindings/worker-loader/), Cloudflares leichtgewichtiger Isolate-Technologie. Statt Plugins direkten Datenzugriff zu geben, bietet EmDash Fähigkeiten über Bindings.

Bevor Sie ein Plugin installieren, können Sie sein Manifest lesen und genau wissen, welche Berechtigungen es anfordert — ähnlich wie bei einem OAuth-Berechtigungsbildschirm. Die Sicherheitsgarantie ist strukturell: Ein Plugin kann nur Aktionen durchführen, die explizit in seinem Manifest deklariert sind.

```typescript
// EmDash Plugin-Manifest-Beispiel
{
  "name": "email-on-publish",
  "capabilities": ["send-email", "read-content"],
  "runtime": "dynamic-worker"
}
```

Dies ist ein bedeutender Bruch mit dem PHP-Include-Modell, das WordPress aus einer anderen Ära des Webhostings geerbt hat.

## Auf Astro 6.0 gebaut, in TypeScript geschrieben

EmDash ist kein WordPress-Fork. Kein WordPress-Code wurde verwendet. Es basiert auf Astro 6.0 — Cloudflares eigenem Astro-Fork, der bekanntlich in einer Woche mit KI-Codieragenten wiederaufgebaut wurde.

Das Projekt ist MIT-lizensiert, vollständig Open Source und auf [GitHub](https://github.com/emdash-cms/emdash) verfügbar. Sie können eine Blog-Vorlage direkt auf Cloudflare Workers bereitstellen:

```
https://deploy.workers.cloudflare.com/?url=https://github.com/emdash-cms/templates/tree/main/blog-cloudflare
```

Es gibt auch einen [EmDash Playground](https://emdashcms.com/), wo Sie die Admin-Oberfläche ausprobieren können, ohne etwas bereitzustellen.

## Der Breitere Kontext

Cloudflare ist im Baurausch mit KI-Codieragenten. Das Unternehmen hat Next.js in einer Woche wiederaufgebaut (und Vinext produziert), dann dieselben Tools auf WordPress angesetzt. Ob das Ergebnis produktionsreif ist, ist eine andere Frage — EmDash startet als Beta, nicht als ausgereiftes Produkt.

Aber die These stimmt: Die Grenzkosten für den Bau von Software sind drastisch gesunken, wenn KI-Agenten Boilerplate erledigen, und das Ergebnis kann eine genuinely neuartige Architektur sein statt eines WordPress-Themes. Das Plugin-Sicherheitsmodell allein macht EmDash für jeden interessant, der eine WordPress-Site mit 30 installierten Plugins auditieren musste.

[faq]
- **Ist EmDash mit WordPress-Themes und -Plugins kompatibel?** Nicht direkt — EmDash ist eine Neuimplementierung. Das Team strebt Feature-Kompatibilität an, nicht Code-Kompatibilität. Kein WordPress-PHP wurde verwendet.
- **Wo kann ich EmDash bereitstellen?** Zunächst Cloudflare Workers und jeden Node.js-Server. Weitere Plattformen könnten folgen.
- **Ist das produktionsreif?** Nein — EmDash v0.1.0 ist eine frühe Entwickler-Beta. Brechende Änderungen sind zu erwarten.
- **Welche Lizenz?** MIT, explizit gewählt, um breite Adoption und Beitrag zu ermöglichen.
[/faq]
