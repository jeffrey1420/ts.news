---
title: "Astro 6.1.8 corrige un bug critique de nom de fichier sur Netlify et une faille de sécurité sur /_image"
description: "Astro 6.1.8 corrige une régression où les noms de fichiers de build contenant des caractères spéciaux cassaient les déploiements Netlify et Vercel, et colmate une faille de confusion content-type dans l'endpoint image intégré qui pouvait servir du non-SVG comme SVG."
date: 2026-04-20
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop"
author: lschvn
tags: ["TypeScript", "Astro", "Framework", "JavaScript", "Netlify", "Security"]
tldr:
  - Astro 6.1.8 corrige un bug où les fichiers de build avec des caractères spéciaux (!, ~, {, }) cassaient les déploiements Netlify et Vercel à cause de la protection anti-skew qui strip ces caractères
  - L'endpoint /_image avait une faille de content-type : passer f=svg pouvait retourner du contenu non-SVG en image/svg+xml ; la correction valide désormais que la source est bien du SVG
  - Le serveur de dev gagne un cache pour le crawling des dépendances, réduisant le travail redondant entre les rechargements
faq:
  - q: "Qu'est-ce qui causait les échecs de déploiement Netlify dans Astro 6.1.7 et antérieur ?"
    a: "Le naming des fichiers de build Astro pouvait inclure des caractères comme !, ~, {, ou } dans les noms de chunks. La protection anti-skew de Netlify supprime ou rejette ces caractères, causant des références HTML pointant vers des fichiers introuvables sur le CDN."
  - q: "Quelle gravité pour la faille de sécurité de /_image ?"
    a: "Modérée. Un attaquant pouvait construire une requête vers /_image?url=<endpoint-interne>&f=svg retournant du JSON ou HTML interne avec un header Content-Type image/svg+xml. L'impact est limité par le fait que l'endpoint nécessite allowedDomains explicite."
  - q: "Faut-il升级 immédiatement ?"
    a: "Oui, particulièrement si vous déployez sur Netlify ou Vercel. Le bug de nom de fichier peut produire des déploiements cassés sans message d'erreur de build."
---

Astro 6.1.8 est sorti le 18 avril avec deux correctifs que les développeurs déployant sur Netlify ou Vercel devraient appliquer immédiatement.

## Le Bug de Nom de Fichier qui Casse les Déploiements Netlify

La correction la plus impactante adresse une régression des versions 6.x : les noms de fichiers de build pouvaient contenir des caractères spéciaux (`!`, `~`, `{`, `}`) invalidés ou supprimés sur certaines plateformes de déploiement.

Le problème se manifeste sur Netlify. La protection anti-skew — qui garantit que les assets déployés correspondent à la sortie du build — supprime les caractères jugés unsafe des noms de fichiers. Si votre HTML buildé référence `chunk.abc123!~{x}.js` et que Netlify le sert comme `chunk.abc123.js`, la référence casse et la page ne charge pas.

La équipe Astro confirme que cela affectait les builds où des imports dynamiques ou certains patterns de code-splitting produisaient des chunks avec des segments hash contenant ces caractères. La version 6.1.8 normalise les noms de fichiers en sortie pour éviter ces caractères.

## Faille Content-Type de /_image

Le second correctif notable ferme une faille de sécurité dans l'endpoint d'optimisation d'image intégré d'Astro (`/_image`). L'endpoint acceptait un paramètre de requête `f=svg` arbitraire et servait le contenu retourné par l'URL upstream en `image/svg+xml` — sans vérifier que le contenu était réellement du SVG.

Un attaquant pouvait potentiellement utiliser cela pour des attaques de confusion content-type ou de cache poisoning si il arrivait à convaincre une victime de charger une URL image craftée pointant vers un endpoint interne. L'équipe Astro note que l'endpoint nécessite `allowedDomains` explicite, ce qui limite la surface d'attaque.

## Performance : Cache de Crawling des Dépendances

Le serveur de dev gagne une amélioration measurable : le crawling interne des dépendances du projet est désormais mis en cache entre les requêtes. Dans les projets avec beaucoup de routes et un graphe de dépendances profond, cela réduit le parcours redondant du système de fichiers à chaque rafraîchissement.

## Autres Correctifs en 6.1.8

- Correction des chunks d'import dynamique recevant des hash frais à chaque build
- `allowedDomains` correctement propagés au serveur de dev
- Styles scoped Vue corrects pendant la navigation router côte client en dev
- L'endpoint /_image valide désormais que la source est réellement du SVG avant de servir en image/svg+xml
- Correction des erreurs de build sur Vercel et Netlify pour les chunks inter-modules utilisant des imports dynamiques

## Mise à jour

Exécutez `px @astrojs/upgrade` ou `npm install astro@latest` pour mettre à jour. Si vous êtes sur Netlify ou Vercel, vérifiez que votre dernier déploiement charge correctement tous les assets.
