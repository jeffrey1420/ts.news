---
title: "OpenCode Desktop abandonne Tauri pour Electron : un choix pragmatique pour un agent de coding IA en TypeScript"
description: "OpenCode, l'agent de coding IA open source fort de 145 000 étoiles GitHub, a reconstruit son application Desktop sur Electron après avoir conclu que les performances WebKit et les problèmes de démarrage du CLI bundled ne justifiaient plus Tauri."
date: 2026-04-19
image: "https://repository-images.githubusercontent.com/975734319/2c2c3389-c647-405c-a499-f80e4d521277"
author: lschvn
tags: ["TypeScript", "AI", "Electron", "Tauri", "OpenCode"]
tldr:
  - "OpenCode Desktop passe de Tauri à Electron, citant les incohérences de rendu WebKit et les écarts de performance avec Chromium sur macOS et Linux"
  - "Le changement élimine aussi un CLI bundlé qui ajoutait de la latence au démarrage et des plantages occasionnels, permettant au serveur de tourner directement dans le processus Node d'Electron"
  - "Les plugins utilisant des API Bun spécifiques ne fonctionneront plus dans les nouvelles versions Electron ; plus de détails promis avec OpenCode 2.0"
faq:
  - "Q: Pourquoi OpenCode a-t-il abandonné Tauri ?
A: Tauri repose sur WebKit (plutôt que Chromium), ce qui causait des incohérences de rendu et de performances. L'architecture 100 % TypeScript d'OpenCode annulait aussi les avantages de performance du Rust de Tauri."
  - "Q: Est-ce que ça veut dire que Tauri est moins bien qu'Electron ?
A: Non. L'équipe d'OpenCode précise que Tauri reste excellent pour les apps avec une UI simple nécessitant des performances natives ou un accès facile aux API système."
  - "Q: Qu'est-ce que ça change pour les utilisateurs de Bun ?
A: La version Electron abandonne le support des API Bun. Les plugins qui dépendent de ces API ne fonctionneront plus."
---

## TypeScript du sol au plafond

OpenCode est un agent de coding IA open source construit intégralement en TypeScript. Son architecture repose sur un modèle client-serveur : le TUI, l'interface web et les clients desktop communiquent tous avec un serveur central qui gère les interactions LLM, les boucles d'agent et une base SQLite. Cela signifie qu'un processus serveur en fonctionnement est toujours nécessaire — c'est autour de ce serveur que l'application Desktop a toujours été construite.

La première version Desktop utilisait Tauri, choisi pour son profil léger comme simple conteneur de webview. Au démarrage, le CLI bundlé lançait `opencode serve`, donnant à l'interface web un serveur local auquel se connecter. Ça fonctionnait, mais deux problèmes se sont accumulés avec le temps.

## Le problème WebKit

Tauri utilise la WebView système sur macOS et Linux — WebKit sur ces plateformes, WebView2 sur Windows. L'équipe d'OpenCode a constaté que WebKit ne se contentait pas de rendre leur UI avec de moins bonnes performances que Chromium : il produisait aussi des incohérences visuelles mineures entre plateformes. Pour une application utilisée quotidiennement par des développeurs qui changent de système d'exploitation, la cohérence compte.

Tauri a un effort en cours pour supporter Chromium via CEF plutôt que la webview système, mais aucune date ferme de stabilisation n'existe. OpenCode ne pouvait pas attendre.

## La Taxe du CLI Bundlé

Le second problème était le CLI lui-même. Le code serveur d'OpenCode utilisait à l'origine des API spécifiques à Bun, ce qui nécessitait de bundler le CLI Bun dans Tauri. Cela avait deux conséquences : des temps de démarrage plus lents, et des plantages occasionnels sur Windows que l'équipe a consacrés beaucoup d'efforts à contourner.

Quand OpenCode a décidé de toute façon de s'éloigner des API Bun (en faveur de la compatibilité Node), l'attrait de bundler un CLI entier a disparu. Le processus Node intégré à Electron pouvait simplement exécuter le serveur directement — pas de sous-processus, pas de binaire externe, pas de taxe au démarrage.

## Ce qui change et ce qui ne change pas

OpenCode Desktop va bientôt diffuser la build Electron par défaut pour les téléchargements directs et les mises à jour du canal bêta, avant de migrer progressivement les versions générales. Le serveur sous-jacent tourne toujours en TypeScript — il s'exécute juste maintenant dans le processus Node d'Electron plutôt que dans un binaire externe bundlé.

L'équipe est directe sur le compromis : les plugins qui dépendent d'API spécifiques à Bun ne fonctionneront plus dans les builds Electron. Une explication complète est promise avec OpenCode 2.0.

## Pas un jugement sur Rust ou Tauri

L'équipe d'OpenCode a pris soin de présenter cela comme une décision guidée par le cas d'usage, pas un jugement de valeur sur Tauri ou Rust. Tauri excelle quand la logique centrale d'une application réside en Rust et que la webview est réellement légère. L'architecture d'OpenCode, tout en TypeScript, annulait les avantages du Rust sur la partie calcul intensive.

Si vous construisez une app avec une UI plus simple qui demande des performances natives ou un accès facile aux API système, Tauri reste un excellent choix.

La bêta Electron est disponible sur le dépôt GitHub opencode-beta.
