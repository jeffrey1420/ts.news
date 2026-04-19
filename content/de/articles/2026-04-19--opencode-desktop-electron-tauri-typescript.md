---
title: "OpenCode Desktop wechselt von Tauri zu Electron: Eine pragmatische Entscheidung für einen TypeScript-first KI-Coding-Agenten"
description: "OpenCode, der Open-Source-KI-Coding-Agent mit 145.000 GitHub-Sternen, hat seine Desktop-App auf Electron umgestellt, nachdem Performance-Probleme mit WebKit und Startverzögerungen durch den gebündelten CLI die Entscheidung gegen Tauri reiften."
date: 2026-04-19
image: "https://repository-images.githubusercontent.com/975734319/2c2c3389-c647-405c-a499-f80e4d521277"
author: lschvn
tags: ["TypeScript", "AI", "Electron", "Tauri", "OpenCode"]
tldr:
  - "OpenCode Desktop steigt von Tauri auf Electron um —主要原因是因为 WebKit auf macOS und Linux konsistente Rendering-Probleme und schlechtere Performance als Chromium bot"
  - "Der Umstieg beseitigte auch einen gebündelten CLI, der Startverzögerungen und gelegentliche Abstürze verursachte; der Server läuft nun direkt in Electron Node"
  - "Plugins mit Bun-spezifischen API-Aufrufen funktionieren in den neuen Electron-Builds nicht mehr — mehr Details verspricht OpenCode 2.0"
faq:
  - "Q: Warum hat OpenCode Tauri aufgegeben?
A: Tauri nutzt WebKit statt Chromium, was Render-Inkonsistenzen und langsamere Leistung verursachte. OpenCode's reinrassige TypeScript-Architektur machte auch Rusts Performancevorteile in Tauri zunichte."
  - "Q: Bedeutet das, dass Tauri schlechter ist als Electron?
A: Nein. OpenCode betont ausdrücklich, dass Tauri für Apps mit simpler UI und原生-Systemzugriff immer noch hervorragend geeignet ist."
  - "Q: Was ändert sich für Bun-Nutzer?
A: Die Electron-Version unterstützt keine Bun-spezifischen APIs mehr. Plugins, die davon abhängen, werden nicht funktionieren."
---

## TypeScript durch und durch

OpenCode ist ein Open-Source-KI-Coding-Agent, der vollständig in TypeScript gebaut wurde. Seine Architektur folgt einem Client-Server-Modell: TUI, Web-UI und Desktop-Clients kommunizieren alle mit einem zentralen Server, der LLM-Interaktionen, Agent-Schleifen und eine SQLite-Datenbank verwaltet. Das bedeutet: Ein laufender Serverprozess ist immer erforderlich — und darum drehte sich die Desktop-App von Anfang an.

Der erste Desktop-Build nutzte Tauri, gewählt wegen seines schlanken Profils als dünner Webview-Container. Beim Start wurde der gebündelte CLI über `opencode serve` gestartet, wodurch die Web-UI einen lokalen Server zum Verbinden erhielt. Es funktionierte — aber im Laufe der Zeit häuften sich zwei Probleme.

## Das WebKit-Problem

Tauri nutzt die System-WebView auf macOS und Linux — WebKit auf diesen Plattformen, WebView2 unter Windows. Das OpenCode-Team stellte fest, dass WebKit nicht nur eine schlechtere Rendering-Performance als Chromium bot, sondern auch minor visuell Inkonsistenzen zwischen den Plattformen erzeugte. Für eine Anwendung, die täglich von Entwicklern genutzt wird, die zwischen Betriebssystemen wechseln, ist Konsistenz wichtig.

Tauri hat eine laufende Anstrengung, Chromium via CEF statt der System-WebView zu unterstützen, aber ein fester Stabilisierungszeitpunkt ist ungewiss. OpenCode konnte nicht warten.

## Die Steuer des gebündelten CLI

Das zweite Problem war der gebündelte CLI selbst. OpenCodes Servercode nutzte ursprünglich Bun-spezifische APIs, was das Bündeln des Bun-CLI in Tauri erforderte. Das hatte zwei Konsequenzen: Langsamere Startzeiten und gelegentliche Abstürze unter Windows, die das Team mit erheblichem Aufwand umging.

Als OpenCode sich ohnehin entschied, von Bun-APIs abzuweichen (zugunsten von Node-Kompatibilität), verschwand der Reiz, einen gesamten CLI zu bündeln. Electrons eingebauter Node-Prozess konnte den Server direkt ausführen — kein Subprozess, keine externe Binärdatei, keine Startsteuer.

## Was sich ändert und was nicht

OpenCode Desktop wird Electron bald als Standard für Direktdownloads und Beta-Kanal-Updates ausliefern, mit schrittweiser Migration der allgemeinen Releases. Der zugrundeliegende Server läuft weiterhin in TypeScript — er wird jetzt nur in Electrons Node-Prozess statt in einer gebündelten externen Binärdatei ausgeführt.

Das Team ist direkt beim Kompromiss: Plugins, die von Bun-spezifischen APIs abhängen, werden in den Electron-Builds nicht funktionieren. Eine vollständige Erklärung verspricht OpenCode 2.0.

## Kein Urteil über Rust oder Tauri

Das OpenCode-Team war bemüht, dies als anwendungsfallgetriebene Entscheidung darzustellen, nicht als Werturteil über Tauri oder Rust. Tauri glänzt, wenn eine Anwendung ihren Kernlogik in Rust hat und die Webview wirklich leichtgewichtig ist. OpenCode's Logik ist jedoch durchgehend TypeScript — bedeutet, dass Rusts Vorteile im leistungskritischen Teil des Stacks nie griffen.

Wenn du eine App mit einfacherer UI baust, die native Performance oder leichten Zugriff auf System-APIs fordert, ist Tauri immer noch großartig.

Die Electron-Beta ist jetzt über das opencode-beta GitHub-Repository verfügbar.
