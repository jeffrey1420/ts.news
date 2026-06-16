---
title: "Deno 2.8: Audit Fix, CI-Subcommand und Native Pack-Tool"
description: "Deno 2.8 bringt vier neue CLI-Subcommands, verbesserte Node.js-Kompatibilität und einen Rust-basierten Packager für npm-Registries."
date: 2026-06-01
image: "/images/heroes/2026-06-01--deno-2-8-audit-fix-ci-pack-subcommands.png"
author: lschvn
tags: ["runtimes", "typescript", "javascript"]
---

[Deno](/articles/2026-04-07-deno-2-7-stabilizes-temporal-api-windows-arm-npm-overrides) 2.8 ist da, und diesmal geht es nicht um ein einzelnes Killer-Feature, sondern um eine Sammlung von Quality-of-Life-Verbesserungen, die die Lücke zu [Node.js](/articles/2026-04-12-nodejs-25-stream-iter-async-streams) schließen und gleichzeitig wirklich neue Tools hinzufügen. Die Version wurde am 22. Mai veröffentlicht, mit einem Patch (v2.8.1) fünf Tage später.

<!-- more -->

## TLDR

- `deno audit fix` behebt automatisch verwundbare npm-Pakete mit einem Befehl
- `deno ci` bietet eine reproduzierbare Installations-Signatur für CI-Pipelines
- `deno pack` erstellt npm-bereite Tarballs direkt aus Deno-Projekten
- Node.js-Kompatibilität nähert sich den 75%, gemäß Deno's Roadmap-Zielen

---

## `deno audit fix`: Ein-Befehl-Schwachstellenbehebung

`deno audit` wurde in Deno 2.6 als Sicherheits-Audit-Tool für npm-Pakete eingeführt. Deno 2.8 geht mit `deno audit fix` weiter und aktualisiert verwundbare Pakete automatisch auf die nächste gepatchte Version, die noch den Versionsbeschränkungen entspricht.

```bash
$ deno audit fix
╭ body-parser vulnerable to denial of service when url encoding is enabled
│ Severity: high
│ Package: body-parser
│ Vulnerable: <1.20.3
╰ Info: https://github.com/advisories/GHSA-qwcr-r2fm-qrc7
```

Wenn ein Paket ein Major-Version-Upgrade benötigt, listet Deno es separat auf, damit Sie entscheiden können, ob Sie die Einschränkungen lockern. Alles innerhalb des semver-Bereichs wird stillschweigend behoben.

---

## `deno ci`: Reproduzierbare CI-Installationen

Deno 2.8 führt `deno ci` ein, einen dedizierten Subcommand für CI-Umgebungen und Dockerfiles. Bisher bedeutete eine reproduzierbare Installation, sich an die richtige Kombination von Flags für `deno install` zu erinnern. Jetzt:

```bash
$ deno ci
```

Es gibt einen Fehler aus, wenn `deno.lock` fehlt, entfernt jedes vorhandene `node_modules` und führt die Installation mit `--frozen` aus, sodass die Lockfile genau zur Konfiguration passen muss. Einfach in einen CI-Schritt oder ein Dockerfile einfügen.

---

## `deno pack`: npm-Tarballs ohne Deno-Verlassen Bauen

`deno pack` kombiniert das Verhalten von `tsc` und `npm pack` in einem einzigen Befehl. Ausgehend von einer `deno.json`:

```json
{
  "name": "@scope/my-lib",
  "version": "1.0.0",
  "exports": "./mod.ts"
}
```

Erzeugt `deno pack` ein `scope-my-lib-1.0.0.tgz`, bereit für `npm publish`. Das Tarball enthält:

- Eine generierte `package.json` mit `type: "module"`, bedingte Exports und extrahierte Runtime-Abhängigkeiten
- TypeScript nach JavaScript transpiliert
- `.d.ts`-Deklarationsdateien, extrahiert über dieselbe Fast-Check-Pipeline wie bei `deno publish`
- README- und LICENSE-Dateien

Specifiers werden umgeschrieben, damit Pakete im npm-Ökosystem funktionieren: `jsr:@std/path` wird zu `@jsr/std__path`, relative Imports erhalten `.js`-Erweiterungen, und `node:`-Builtins bleiben unberührt.

---

## `deno bump-version`: Semver-Management für Workspaces

`deno bump-version` aktualisiert das Versionsfeld in Ihrer `deno.json` oder `package.json` mit standardmäßigen semver-Incrementen:

```bash
$ deno bump-version patch
$ deno bump-version minor
$ deno bump-version major
$ deno bump-version prerelease
```

In einem Workspace wendet das Ausführen von der Wurzel das gleiche Increment auf jedes Member-Paket an, überschreibt übereinstimmende `jsr:`-Versionseinschränkungen und aktualisiert die Import-Map, damit plattformübergreifende Referenzen synchron bleiben.

---

## Node.js-Kompatibilität: Auf Dem Weg Zu 75%

Deno's erklärtes Ziel ist es, bis 2026 75% Node.js-Kompatibilität zu erreichen. Version 2.8 macht Fortschritte mit breiterer `node:`-Modulabdeckung, verbesserter TLS/SSL-Kontextbehandlung und besserer Kompatibilität mit npm-Paketen, die auf Node.js-Interna angewiesen sind. Das Changelog listet Dutzende von `ext/node`-Fixes auf.

---

## FAQ

**Wie aktualisiere ich?**
Führen Sie `deno upgrade` aus oder installieren Sie neu von `deno.land/install.sh`.

**Ersetzt `deno pack` `deno publish`?**
Nein. `deno publish` veröffentlicht in JSR; `deno pack` zielt auf npm-Registries. Sie bedienen unterschiedliche Ökosysteme.

**Ist diese Version rückwärtskompatibel?**
Ja. Deno 2.8 bleibt vollständig rückwärtskompatibel mit 2.x. Breaking Changes sind nicht vor einer zukünftigen Major-Version geplant.
