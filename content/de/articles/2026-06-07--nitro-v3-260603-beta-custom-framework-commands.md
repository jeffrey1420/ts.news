---
title: "Nitro v3.0.260603-beta: Custom Framework Commands und defaultPreset-Config"
description: "Der neueste Nitro-Beta fügt Support für benutzerdefinierte Framework-Preview- und Deploy-Befehle hinzu, führt die defaultPreset-Config-Option ein und behebt einen Edge-Case beim Type-Stripping."
date: 2026-06-07
image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Nitro", "Deno", "TypeScript", "JavaScript", "framework"]
tldr:
  - "Nitro 3 Beta erlaubt es Frameworks jetzt, eigene Preview- und Deploy-Befehle zu injizieren, was eine engere Integration mit plattformspezifischen Tools ermöglicht."
  - "Eine neue defaultPreset-Config-Option erlaubt die Anpassung des Fallback-Preset, wenn kein explizites Preset angegeben ist, und gibt mehr Kontrolle über das Deployment-Verhalten."
  - "Ein Type-Stripping-Fix stellt sicher, dass TypeScript-Erweiterungsversuche nur für die tatsächlich erneut versuchten Erweiterungen gelten — nicht für alle möglichen."
faq:
  - q: "Was bedeutet 'Custom Framework Preview/Deploy Commands' in Nitro 3?"
    a: "Framework-Plugins können jetzt ihre eigenen Preview- und Deploy-Befehle bereitstellen, die Nitro als Teil der Build-Pipeline aufruft. Dies erlaubt auf Nitro aufbauenden Frameworks, plattformspezifische Tools einzubinden, ohne separate CLI-Einstiegspunkte zu benötigen."
  - q: "Was ist die defaultPreset-Config-Option?"
    a: "Die defaultPreset-Option legt fest, auf welches Preset Nitro zurückfallen soll, wenn kein explizites Preset konfiguriert ist. Zuvor war der Fallback fest eingebaut; jetzt können Sie ihn anpassen — nützlich, wenn Ihr Setup einen anderen Standard als das Out-of-Box-Verhalten benötigt."
  - q: "Was war der Type-Stripping-Fix in diesem Release?"
    a: "Der Fix stellt sicher, dass wenn TypeScript die Auflösung eines Modulpfads mit hinzugefügten Erweiterungen (.ts, .tsx) erneut versucht, Nitro nur die Erweiterungen entfernt, die tatsächlich erneut versucht wurden — nicht alle möglichen Erweiterungen. Dies verhindert Edge-Cases, bei denen legitime Modulauflösungen incorrect übergangen werden könnten."
---
