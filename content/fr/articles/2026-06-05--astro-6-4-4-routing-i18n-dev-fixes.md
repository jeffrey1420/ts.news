---
title: "Astro 6.4.4 Corrige Sept Bugs sur le Routage, l'i18n et l'Expérience Dev"
description: "Astro 6.4.4 est un patch corrigeant des problèmes de routes dynamiques, de routage i18n par domaine, d'édition de composants côté client et de la casse des patterns de route."
date: 2026-06-05
image: "/images/heroes/2026-06-05--astro-6-4-4-routing-i18n-dev-fixes.png"
author: lschvn
tags: ["frameworks", "javascript"]
tldr:
  - Correction de Astro.routePattern qui préserve désormais correctement la casse des paramètres depuis les noms de fichiers
  - Résolution des routes dynamiques renvoyant des erreurs 500 avec le routage i18n par domaine en mode SSR
  - Les modifications de composants côté client ne déclenchent plus de rechargement complet du backend en développement
---

Astro 6.4.4 est paru le 3 juin 2026, un patch centré sur sept bugs touchant le routage, l'internationalisation et l'expérience de développement.

## Correction de la Casse des Route Patterns

La correction la plus subtile mais importante concerne `Astro.routePattern`. Auparavant, un fichier `src/pages/blog/[postId].astro` retournait `/blog/[postid]` pour `Astro.routePattern` à cause d'un `.toLowerCase()` interne. La méthode préserve maintenant correctement la casse originale du nom de fichier, retournant `/blog/[postId]`.

Cela compte pour les projets qui génèrent des routes programmatiquement et comptent sur une casse cohérente pour le traitement en aval.

## Routage i18n par Domaine en SSR Corrigé

Les routes dynamiques en mode SSR renvoyaient une erreur 500 `"TypeError: Missing parameter"` avec le routage internationalisé par domaine. Le bug provenait de la façon dont Astro faisait correspondre les requêtes entrantes aux patterns de route dans les configurations i18n multi-domaines.

Par ailleurs, `Astro.currentLocale` retourne maintenant correctement la locale du domaine sur les routes dynamiques servies depuis un domaine mappé, au lieu de retourner incorrectement la locale par défaut.

## Expérience Dev : Plus de Rechargements Complets

Auparavant, éditer un composant côté client (avec `client:idle`, `client:load`, etc.) en développement déclenchait un rechargement complet inutile du backend. C'est corrigé — les edits de composants déclenchent maintenant le remplacement à chaud normal sans redémarrer le serveur.

## Autres Corrections

- `App.match()` ne lève plus d'exception sur les chemins de requête contenant une séquence de percent-encoding invalide
- Les endpoints de fichiers statiques utilisant `getStaticPaths` avec `.html` dans les valeurs des paramètres dynamiques ne plantent plus avec `NoMatchingStaticPathFound` — le suffixe `.html` n'est plus incorrectement supprimé
- Les problèmes de suppression de styles sur les systèmes de fichiers sensibles à la casse sont résolus
- Les routes dynamiques ne retournent plus la chaîne `[object Object]` au lieu du contenu attendu dans certains runtimes

L'intégration `@astrojs/mdx` a aussi été mise à jour en v6.0.2, intégrant le processeur Sätteri v0.8.0.

Astro 6.4.4 est disponible sur npm.
