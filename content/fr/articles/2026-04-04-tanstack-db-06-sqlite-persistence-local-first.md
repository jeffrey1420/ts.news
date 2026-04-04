---
title: "TanStack DB 0.6 Transforme le Client en Base de Données Locale"
description: "Persistance SQLite sur tous les runtimes, projections de données hiérarchiques et workflows réactifs pour agents — v0.6 est la release qui fait de TanStack DB une couche de données applicative complète."
date: "2026-04-04"
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop"
author: lschvn
tags: ["typescript", "database", "local-first", "sqlite", "tanstack"]
---

TanStack DB, la base de données transactionnelle côté client créée par l'équipe derrière React Query et Router, a publié la version 0.6 la semaine dernière. Les fonctionnalités principales — persistance SQLite, projections de données hiérarchiques et workflows réactifs pour agents — ne sont pas des ajouts incrementaux. Ce sont les pièces manquantes qui rendent l'ensemble du système pratique pour de vraies applications.

## La pièce manquante : la persistance

TanStack DB avait déjà un moteur de requêtes sophistiqué, une réactivité granulaire, des mises à jour optimistes et une API de transactions hors ligne. Ce qui lui manquait, c'était la durabilité — la capacité de conserver les données après la fermeture de l'application.

Cela change avec la 0.6. La couche de persistance repose sur SQLite et fonctionne sur un large éventail de runtimes : navigateur (via SQLite WASM), React Native, Expo, Node, Electron, Tauri, Capacitor et Cloudflare Durable Objects.

La décision de conception clé est pragmatique : plutôt que d'inventer une nouvelle abstraction de stockage, SQLite sert de backend de persistance. Cela signifie que TanStack DB gère gratuitement les gros volumes de données, le support multi-onglets, l'évolution du schéma et la compatibilité cross-runtime. Une fois l'état local rendu durable, l'ensemble de la pile — moteur de requêtes, mises à jour optimistes, transactions hors ligne — peut fonctionner comme un système véritablement local-first.

PowerSync et Trailbase supportent déjà la synchronisation incrémentale avec cette nouvelle couche de persistance, en s'appuyant sur le modèle de sync des Query Collections introduit en v0.5.

## Includes : des données hiérarchiques sans GraphQL

La fonctionnalité `includes` résout un problème récurrent en développement UI : vos données sont normalisées en base, mais vos composants UI attendent une forme emboîtée.

La solution classique est GraphQL, avec ses resolvers et sa couche d'infrastructure séparée. Les `includes` de TanStack DB projettent les données normalisées dans la structure hiérarchique dont votre UI a besoin — même résultat, sans backend supplémentaire.

## createEffect : effets secondaires réactifs pour les agents

Une nouvelle fonction `createEffect` permet de déclencher des effets secondaires réactifs directement depuis des requêtes live. C'est destiné aux workflows d'automatisation de type agent où vous devez répondre aux changements de données programmatiquement, pas seulement les afficher.

Les virtual props (`$synced`, `$origin`) complètent cela en suivant les métadonnées au niveau des lignes — les vues de type outbox, le statut de sync et la provenance des données deviennent des préoccupations de première classe des requêtes.

## queryOnce et autres améliorations d'ergonomie

`queryOnce` fournit des requêtes ponctuelles en utilisant le même langage de requête que les requêtes live. Auparavant, les deux modèles divergeaient ; maintenant ils sont unifiés.

Les index sont désormais optionnels, et les gestionnaires de mutations ne reposent plus sur un comportement de retour implicite. Ce sont des changements cassants pour les mises à jour, mais ils rendent l'API plus prévisible.

## Vers la v1

L'équipe fait appel à des partenaires pour le design SSR (server-side rendering) alors qu'ils travaillent vers la v1. Si vous suiviez TanStack DB en attendant qu'il soit prêt pour la production, cette release est le signal le plus fort que les pièces s'assemblent.

tldr[]
- TanStack DB 0.6 ajoute la persistance SQLite across navigateur, React Native, Node, Electron, Tauri et plus — rendant les apps local-first véritablement durables
- La nouvelle API `includes` projette les données normalisées dans des formes UI hiérarchiques sans nécessiter une couche GraphQL
- `createEffect` et les virtual props (`$synced`, `$origin`) activent les workflows réactifs d'agents et les patterns UI de sync de type outbox

faq[]
- **Est-ce prêt pour la production ?** C'est encore pré-v1, mais l'ensemble des fonctionnalités et le soutien de TanStack (mainteneurs de React Query) rendent l'évaluation intéressante pour des apps non critiques.
- **Comment ça se compare à Dexie.js ou WatermelonDB ?** TanStack DB est centré sur le moteur de requêtes avec réactivité granulaire et un modèle de sync intégré ; Dexie est plus orienté ergonomie IndexedDB et WatermelonDB plus ORM.
- **Est-ce que ça fonctionne avec le SSR ?** L'équipe travaille activement sur le support SSR et cherche des partenaires de design.
