---
title: "pnpm 11.8 liefert `install --dry-run`, Node.js Package Maps und eine SBOM pro Paket"
description: "pnpm 11.8.0 (18. Juni 2026) fügt ein lang gefordertes `--dry-run` für `pnpm install` hinzu, experimentelle Node.js-Package-Maps unter `node_modules/.package-map.json`, den CycloneDX-Scope für devDependencies und die SBOM-Erzeugung pro Paket sowie einen macOS-Gatekeeper-Fix, der die Quarantäne von nativen Binaries entfernt. Außerdem wird eine Path-Traversal-Schwachstelle bei configDependencies (GHSA-qrv3-253h-g69c) geschlossen, drei Tage nach der Lockfile-Härtung in 11.7."
date: 2026-06-19
image: "/images/heroes/2026-06-19--pnpm-11-8-dry-run-install-node-package-map-sbom.png"
author: lschvn
tags: ["tooling", "security", "ecosystem"]
tldr:
  - "pnpm 11.8.0 (18. Juni 2026) fügt `pnpm install --dry-run` hinzu, das eine vollständige Abhängigkeitsauflösung durchführt und meldet, was eine Installation ändern würde, aber nichts auf die Festplatte schreibt: kein Lockfile, kein `node_modules`, und es beendet sich immer mit Code 0. Es entspricht `npm install --dry-run` und schließt [Issue #7340](https://github.com/pnpm/pnpm/issues/7340), das seit 2022 offen war."
  - "Zwei SBOM-Verbesserungen kommen für Supply-Chain-Compliance: `pnpm sbom` markiert Komponenten, die nur über devDependencies erreichbar sind, mit dem CycloneDX-Scope `scope: \"excluded\"` und der Eigenschaft `cdx:npm:package:development`, und `--out`/`--split` erzeugen ein CycloneDX-Dokument pro Workspace-Paket unter Auflösung der `workspace:`-Interabhängigkeiten. Eine neue `node_modules/.package-map.json` speist die experimentelle Package-Auflösung von Node hinter `node-experimental-package-map`."
  - "Das Release behebt außerdem eine Path-Traversal bei configDependencies (GHSA-qrv3-253h-g69c), bei der ein committetes Lockfile mit einem traversal-förmigen Namen oder einer Version Dateien außerhalb von `node_modules/.pnpm-config` schreiben konnte, und entfernt die macOS-Gatekeeper-Quarantäne von nativen Binaries nach dem Import aus dem Store."
faq:
  - question: "Was ist neu in pnpm 11.8?"
    answer: "pnpm 11.8.0 (18. Juni 2026) liefert `pnpm install --dry-run` zur Vorschau von Installationen ohne Schreibzugriff, experimentelle Node.js-Package-Maps unter `node_modules/.package-map.json`, den CycloneDX-Scope `scope: \"excluded\"` für devDependencies in `pnpm sbom`, die SBOM-Erzeugung pro Paket über `--out` und `--split`, einen macOS-Gatekeeper-Fix, der die Quarantäne von nativen Binaries entfernt, sowie einen Sicherheitsfix für eine Path-Traversal bei configDependencies (GHSA-qrv3-253h-g69c). Es benötigt Node.js 22.13 oder neuer."
  - question: "Wie funktioniert `pnpm install --dry-run`?"
    answer: "Es führt eine vollständige Abhängigkeitsauflösung durch und gibt aus, was eine Installation hinzufügen, entfernen oder ändern würde, schreibt aber nichts auf die Festplatte: kein `pnpm-lock.yaml`, kein `node_modules`. Es beendet sich immer mit Code 0, was der Semantik von `npm install --dry-run` entspricht. Es eignet sich, um eine Manifest-Änderung oder den Abhängigkeits-Diff eines Branches in der CI zu validieren, ohne das Arbeitsverzeichnis zu verändern."
  - question: "Was ist die Path-Traversal-Schwachstelle bei configDependencies in pnpm?"
    answer: "GHSA-qrv3-253h-g69c: Vor 11.8 konnte ein committetes Lockfile, dessen `configDependencies` einen traversal-förmigen Namen (etwa `../../PWNED`) oder eine Version enthielten, bewirken, dass `pnpm install` Symlinks oder Paketdateien außerhalb von `node_modules/.pnpm-config` und dem Store anlegt. Der Fix validiert, dass Namen gültige npm-Paketnamen und Versionen exakte Semver-Strings sind, bevor sie für Pfadkonstruktionen verwendet werden, und wendet dieselbe Prüfung auf optionale Subabhängigkeiten von configDependencies und das Legacy-Workspace-Manifest-Format an."
  - question: "Was sind die Node.js-Package-Maps in pnpm 11.8?"
    answer: "pnpm 11.8 kann während isolierter (Standard) und gehobener Installationen eine `node_modules/.package-map.json` erzeugen. Zwei Einstellungen steuern das Verhalten: `node-experimental-package-map` injiziert die erzeugte Map in die von pnpm verwalteten Node.js-Skriptumgebungen, und `node-package-map-type` wählt zwischen einem `standard`- und einem `loose`-Format. Die Map speist Nodes laufende Arbeiten an einer schnelleren, vorhersehbareren Package-Auflösung."
  - question: "Bricht pnpm 11.8 mein bestehendes Projekt?"
    answer: "Nein. Das Lockfile-Format ist unverändert. `--dry-run`, die Package-Map-Einstellungen und die SBOM-Flags sind opt-in. Die configDependencies-Validierung lehnt nur Namen und Versionen ab, die nie gültig gewesen sein sollten. Die einzige Verhaltensänderung, die den meisten Teams auffallen wird, ist, dass `pnpm run --no-bail` nun mit einem von Null verschiedenen Code beendet wird, wenn ein Skript fehlschlägt, was nicht-rekursive Läufe mit rekursiven konsistent macht, die sich bereits so verhielten."
  - question: "Was bewirkt der macOS-Gatekeeper-Fix?"
    answer: "Wenn pnpm native Binaries (`.node`, `.dylib`, `.so`) aus seinem inhaltsadressierbaren Store nach `node_modules` importiert, bewahrt macOS erweiterte Attribute, darunter `com.apple.quarantine`. War dieses xattr auf einem Store-Blob vorhanden, propagierte es nach `node_modules`, und Gatekeeper blockierte das Laden des nativen Binaries, obwohl pnpm die Dateiintegrität bereits gegen das Lockfile geprüft hatte. pnpm 11.8 entfernt nun `com.apple.quarantine` von nativen Binaries nach dem Import, entsprechend dem Verhalten von Homebrew, in einem gebündelten `xattr`-Aufruf pro Paket."
---

[pnpm 11.8.0](https://github.com/pnpm/pnpm/releases/tag/v11.8.0) erschien am 18. Juni 2026, drei Tage nach [11.7.0](https://github.com/pnpm/pnpm/releases/tag/v11.7.0), dem Release, das `--frozen-store`, die Auflösungsdelegation an pacquet und [einen Path-Traversal-Fix im Lockfile](/articles/2026-06-17-pnpm-11-7-frozen-store-publish-batch) hinzufügte. Wo 11.7 sich um reproduzierbare und schreibgeschützte Installationen drehte, zielt 11.8 auf Observability und Supply-Chain-Reporting ab: ein Dry-Run-Modus, der npm endlich entspricht, ein Node.js-Package-Map-Format, das die Auflösungsexperimente des Runtimes speist, und zwei CycloneDX-SBOM-Verbesserungen, die `pnpm sbom` für echte Compliance-Workflows brauchbar machen. Dazu kommt ein zweiter Path-Traversal-Advisory, diesmal in `configDependencies`, und ein macOS-Gatekeeper-Fix, der Nutzer nativer Module schon länger nervte.

## `pnpm install --dry-run`: die Funktion, die npm hatte und pnpm nicht

Der wichtigste Neuzugang ist `--dry-run` für `pnpm install`. Es führt eine vollständige Abhängigkeitsauflösung gegen die aktuellen Manifeste durch und gibt aus, was eine Installation hinzufügen, entfernen oder ändern würde, schreibt dann aber nichts: kein `pnpm-lock.yaml`, kein `node_modules`, keine Store-Mutation. Es beendet sich immer mit Code 0, was der Semantik von [`npm install --dry-run`](https://docs.npmjs.com/cli/v10/commands/npm-install#dry-run) entspricht und [Issue #7340](https://github.com/pnpm/pnpm/issues/7340) schließt, das seit 2022 offen war.

Der praktische Anwendungsfall ist CI und Code-Review: ein PR, der eine Abhängigkeit anhebt oder einen Katalog-Eintrag wechselt, kann `pnpm install --dry-run` ausführen, um den vollständigen transitiven Diff offenzulegen, einschließlich Peer-Warnungen und Build-Script-Freigaben, ohne das Arbeitsverzeichnis anzutasten. Da pnpm die Auflösung ohnehin schnell durchführt, kostet es einen Auflösungsdurchlauf ohne Dateisystem-Schreibzugriff. Der Exit-Code ist bewusst immer 0, damit das Flag innerhalb eines bestehenden Installationsschritts liegen kann, ohne eine Pipeline bei einem harmlosen Diff auf Rot zu schalten.

## Node.js-Package-Maps unter `node_modules/.package-map.json`

11.8 kann nun eine `node_modules/.package-map.json` während isolierter (Standard) und gehobener Installationen erzeugen. Zwei Einstellungen steuern das Verhalten:

- `node-experimental-package-map`: Wenn aktiviert, injiziert pnpm die erzeugte Map in die Node.js-Skriptumgebungen, die es verwaltet, sodass der Runtime eine vorberechnete Paket-Layout-Beschreibung konsultieren kann, statt `node_modules` beim Start zu durchlaufen.
- `node-package-map-type`: wählt zwischen einer `standard`- und einer `loose`-Map und tauscht dabei Strenge gegen Kompatibilität ein.

Das ist frühe Infrastruktur für die [Package-Auflösungsreform von Node](https://github.com/nodejs/node/pulls?q=package+map), bei der eine deklarative Map-Datei die implizite, dateisystemgetriebene Auflösung ersetzen könnte, die jeder Paketmanager derzeit umgehen muss. Dass pnpm die Map erzeugt, bedeutet, dass Projekte, die sie aktivieren, eine konsistente Layout-Beschreibung erhalten, unabhängig davon, ob sie den isolierten oder den gehobenen Linker verwenden. Der Name der Einstellung (`node-experimental-package-map`) signalisiert, dass das Format noch nicht stabil ist.

## SBOM: devDependencies-Scope und Erzeugung pro Paket

Die beiden SBOM-Änderungen in 11.8 zielen auf die Lücke zwischen einem Abhängigkeitsbaum und dem, was ein CycloneDX-Konsument tatsächlich erschließen kann.

Erstens markiert `pnpm sbom` nun Komponenten, die nur über `devDependencies` erreichbar sind, mit dem CycloneDX-Scope `scope: "excluded"` und der Eigenschaft `cdx:npm:package:development`. Der Scope `excluded` ist die CycloneDX-Art, „Komponentennutzung für Test- und andere Non-Runtime-Zwecke“ zu dokumentieren, was genau einer devDependency entspricht. Die Eigenschaft spiegelt den Marker, den [`@cyclonedx/cyclonedx-npm`](https://www.npmjs.com/package/@cyclonedx/cyclonedx-npm) ausgibt, sodass sowohl moderne (scope-basierte) als auch bestehende (eigenschaftsbasierte) Konsumenten ihn erfassen. Komponenten, die zur Laufzeit erreichbar sind, einschließlich installierter `optionalDependencies`, lassen den `scope` weg und standardisieren auf `required`.

Zweitens kommt die SBOM-Erzeugung pro Paket über zwei Flags:

- `--out out/%s.cdx.json` schreibt ein CycloneDX-Dokument pro Workspace-Paket in einzelne Dateien.
- `--split` gibt NDJSON auf stdout aus, ein Paket pro Zeile.

Wenn `--filter` ein einzelnes Paket auswählt, verwendet die SBOM-Wurzelkomponente nun die Metadaten dieses Pakets. Workspace-Interabhängigkeiten, die über das `workspace:`-Protokoll deklariert sind, sowie deren transitive Abhängigkeiten werden einbezogen, sodass eine pro-Paket-SBOM in sich geschlossen ist. Autor, Repository und Lizenz fallen auf das Wurzel-Manifest zurück, wenn das Paket sie nicht definiert. Für ein Monorepo, das pro veröffentlichter Bibliothek eine SBOM ausliefern muss, ist das der Unterschied zwischen dem Nachbearbeiten eines riesigen Dokuments und dem Erhalt pro-Paket-Artefakte direkt vom Installationstool.

## Path-Traversal bei configDependencies (GHSA-qrv3-253h-g69c)

11.8 schließt einen zweiten Path-Traversal-Advisory, unterschieden vom [Lockfile-Alias-Fix in 11.7](/articles/2026-06-17-pnpm-11-7-frozen-store-publish-batch) und der [esbuild-0.28.1-Windows-Traversal](/articles/2026-06-14-esbuild-0-28-1-deno-rce-windows-path-traversal), die in einem anderen Werkzeug aufgetaucht war. Vor 11.8 konnte ein committetes Lockfile, dessen `configDependencies` einen traversal-förmigen Namen (etwa `../../PWNED`) oder eine Version (etwa `../../../PWNED`) enthielten, bewirken, dass `pnpm install` Symlinks oder Paketdateien außerhalb von `node_modules/.pnpm-config` und dem Store anlegt.

Der Fix validiert die Namen und Versionen der `configDependencies`, bevor sie für Pfadkonstruktionen verwendet werden. Namen müssen nun gültige npm-Paketnamen und Versionen exakte Semver-Strings sein. Dieselbe Validierung läuft auf optionale Subabhängigkeiten von configDependencies und auf das Legacy-Workspace-Manifest-Format, bevor ein Lockfile geschrieben wird. Wie das Lockfile-Gate in 11.7 ist das Defense in Depth: ein Projekt, das seiner Lockfile-Quelle bereits vertraut, profitiert dennoch, weil die Prüfung vor teilweiser Korruption und vor Bugs im Lockfile-Generator selbst schützt. Siehe [GHSA-qrv3-253h-g69c](https://github.com/pnpm/pnpm/security/advisories/GHSA-qrv3-253h-g69c).

## macOS Gatekeeper blockiert native Binaries nicht mehr

Ein leiserer, aber weit verbreitet spürbarer Fix: Wenn pnpm Dateien aus seinem inhaltsadressierbaren Store nach `node_modules` importiert, bewahrt macOS erweiterte Attribute, darunter `com.apple.quarantine`. War dieses xattr auf einem Store-Blob vorhanden (es wurde beispielsweise zuerst unter einer Gatekeeper-aktivierten App wie einem Git-Client geschrieben), propagierte es nach `node_modules`, und Gatekeeper blockierte das Laden des nativen Binaries, obwohl pnpm die Dateiintegrität bereits gegen das Lockfile geprüft hatte.

Nach dem Import eines Pakets entfernt 11.8 nun `com.apple.quarantine` von nativen Binaries (`.node`, `.dylib`, `.so`), entsprechend dem [Verhalten von Homebrew](https://docs.brew.sh/FAQ#why-cant-i-open-a-mac-app-from-an-unidentified-developer), das Quarantäne von geprüften Downloads entfernt. Die Bereinigung ist nur für macOS, läuft in einem gebündelten `xattr`-Aufruf pro Paket, ist auf native Binaries beschränkt, sodass andere Dateien unangetastet bleiben, und ist nicht fatal. Er behebt [#11056](https://github.com/pnpm/pnpm/issues/11056).

## Weitere erwähnenswerte Fixes

`pnpm run --no-bail` beendet sich nun mit einem von Null verschiedenen Code, wenn ein ausgeführtes Skript fehlschlägt, während es dennoch alle passenden Skripte bis zum Ende ausführt. Das schließt [Issue #8013](https://github.com/pnpm/pnpm/issues/8013): nicht-rekursive `--no-bail`-Läufe beendeten sich bisher immer mit 0 selbst bei Fehlschlag, was inkonsistent mit rekursiven Läufen war, die bereits am Ende fehlschlugen.

`pnpm view` ohne Paketnamen sucht nun aufwärts nach dem nächsten Projekt-Manifest (`package.json`, `package.yaml` oder `package.json5`) und verwendet dessen `name`-Feld und ersetzt die `find-up`-Abhängigkeit durch das schnellere Modul [`empathic`](https://www.npmjs.com/package/empathic). Mehrere Lockfile-Korrektheits-Bugs kommen ebenfalls dazu: inkrementelle Installationen behalten keine duplizierten transitiven Abhängigkeiten mehr, die eine frische Installation nicht erzeugt hätte ([#5108](https://github.com/pnpm/pnpm/issues/5108)), `optimisticRepeatInstall` meldet nicht mehr „Already up to date“, wenn nur das Lockfile geändert wurde ([#12100](https://github.com/pnpm/pnpm/issues/12100)), und Katalog-Overrides, die über einen Katalog aufgelöst werden, bleiben während `pnpm update` mit dem Katalog synchron. `pnpm version --recursive` respektiert nun den Workspace-Filter statt jedes Paket anzuheben ([#11348](https://github.com/pnpm/pnpm/issues/11348)). Die Reporter-Ausgabe für `pnpm store` und `pnpm config` geht nun auf stderr, sodass Skripte wie `PNPM_STORE=$(pnpm store path)` keine Warnungen mehr im Ergebnis erfassen.

## Upgrade

pnpm 11.8.0 benötigt Node.js 22.13 oder neuer, dieselbe Basis wie 11.7. Das Lockfile-Format ist unverändert, sodass ein `npm install -g pnpm@latest` (oder `corepack prepare pnpm@latest --activate`) gefolgt von einem `pnpm install` den vollständigen Upgrade-Pfad darstellt. Die neuen Flags sind alle opt-in, und die configDependencies-Validierung lehnt nur Eingaben ab, die nie gültige Paketnamen waren.
