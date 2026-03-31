---
title: "vinext de Cloudflare : Le Projet Controversé Qui a Recréé Next.js en Une Semaine"
description: "Comment Cloudflare a utilisé l'IA pour recréer le framework phare de Vercel et ce que cela signifie pour l'avenir du développement web"
date: "2026-03-21"
category: "deep-dive"
author: lschvn
tags: ["cloudflare", "vercel", "controversy", "vinext"]
readingTime: 12
image: "https://cf-assets.www.cloudflare.com/zkvhlag99gkb/64oL10LCSz30EiEHWVdJPG/aeaed48a681ec3d5bc9d8cb6e5e30a96/BLOG-3194_1.png"
tldr:
  - "vinext de Cloudflare réimplémente la surface API de Next.js comme un plugin Vite, construit principalement par l'IA (Claude Code) pour ~1 100$ de tokens API en une semaine."
  - "Sur une app de 33 routes, vinext build 4.4x plus vite (1.67s vs 7.38s) avec des bundles client 57% plus petits (72.9KB vs 168.9KB)."
  - "Le projet inclut 1 700+ tests Vitest et 380 tests E2E Playwright ; CIO.gov utilise déjà vinext en production."
  - "vinext se déploie nativement sur Cloudflare Workers avec les bindings D1/R2/KV et supporte également Vercel, Netlify et AWS via Nitro."
---

Le 24 février 2026, Cloudflare a publié un billet de blog qui a envoyé des ondes de choc à travers la communauté de développement web. Le titre : *"Comment nous avons reconstruit Next.js avec l'IA en une semaine."* Le projet, appelé **vinext** (prononcé "vee-next"), a été présenté comme un plugin Vite expérimental qui réimplémente la surface API de Next.js — permettant aux développeurs d'exécuter leurs applications Next.js sur Cloudflare Workers au lieu de Vercel.

L'annonce n'était pas qu'une démo technique. C'était un défi direct à l'une des entreprises les plus réussies de l'écosystème web moderne. Et la communauté des développeurs l'a remarqué.

---

## Qu'est-ce que vinext ?

En son cœur, vinext est un plugin Vite qui réimplémente l'API publique Next.js — routage, rendu serveur, React Server Components, server actions, caching, middleware, et plus — sur l'infrastructure de build de Vite au lieu du compilateur propriétaire de Next.js.

Le différenciateur clé est la flexibilité de déploiement. Là où Next.js nécessite traditionnellement Vercel (ou des contournements complexes pour déployer ailleurs), vinext expédie vers Cloudflare Workers nativement avec une seule commande :

```bash
npm install vinext
# Remplacer "next" par "vinext" dans vos scripts
vinext deploy # Build et déploie vers Cloudflare Workers
```

### Les Chiffres Qui Ont Attiré l'Attention

Les benchmarks de Cloudflare, effectués sur une application App Router de 33 routes, ont montré des résultats frappants :

| Métrique | Next.js 16.1.6 | vinext (Vite 8/Rolldown) |
|----------|---------------|---------------------------|
| Temps de build | 7.38s | 1.67s (**4.4x plus rapide**) |
| Bundle client | 168.9 KB | 72.9 KB (**57% plus petit**) |

Ce ne sont pas des améliorations marginales — elles représentent un changement fondamental dans la performance de build, obtenu en exploitant le [bundler Rolldown moderne de Vite](/articles/2026-03-26-vite-8-rolldown-era) au lieu de Turbopack de Next.js.

### Code Généré par IA à l'Échelle

Peut-être la réclamation la plus étonnante : une réimplémentation entière de la surface API de Next.js a été écrite en une semaine par un seul ingénieur (un engineering manager, techniquement) dirigeant un modèle IA. Le coût : approximativement **1 100$ en tokens API**.

Du blog Cloudflare :

> *"Presque chaque ligne de code dans vinext a été écrite par l'IA. Mais voici ce qui compte plus : chaque ligne passe les mêmes quality gates que vous attendriez de code écrit par des humains."*

Le projet inclut plus de **1 700 tests Vitest** et **380 tests E2E Playwright**, avec CI s'exécutant sur chaque pull request. Les tests ont été portés directement depuis la suite de tests Next.js et la suite de conformité Cloudflare d'OpenNext.

### Fonctionnalités Clés

- **Compatibilité drop-in** : Les `app/`, `pages/`, et `next.config.js` existants fonctionnent sans modification
- **Traffic-aware Pre-Rendering (TPR)** : Une fonctionnalité expérimentale qui interroge les analytiques Cloudflare au moment du déploiement pour pré-rendre seulement les pages recevant réellement du trafic (couvrant 90% des visites en secondes, pas en minutes)
- **Bindings Cloudflare natifs** : Accès à D1, R2, KV, Durable Objects, AI, et plus via `import { env } from "cloudflare:workers"`
- **Multi-plateforme via Nitro** : Peut déployer vers Vercel, Netlify, AWS, Deno Deploy, et plus

---

## La Controverse : Pourquoi Ça Ressemblait à une Déclaration de Guerre

Pour comprendre pourquoi la communauté a réagir si fortement, vous devez comprendre la relation entre Next.js et Vercel.

Next.js a été acquis par Vercel en 2019. Depuis, Vercel a bâti son modèle commercial entier autour du fait d'être la plateforme d'hébergement premium pour les applications Next.js. Le framework est étroitement intégré à l'infrastructure de Vercel — les aperçus de déploiement, les edge functions, l'optimisation d'images, et plus fonctionnent parfaitement sur Vercel mais nécessitent des contournements ailleurs.

Quand Cloudflare a publié vinext, le message pour les développeurs était clair : **vous pouvez maintenant utiliser Next.js sans Vercel**. Pas comme un hack, pas comme un après-pensée — mais comme un citoyen de première classe sur la plateforme de Cloudflare.

Le timing était provocateur. Cloudflare n'a pas simplement annoncé un concurrent de Vercel — ils en ont annoncé un une semaine après qu'un de leurs propres ingénieurs ait reconstruit Next.js en utilisant l'IA. Le sous-texte était presque agressif :

> *"Si un ingénieur et une IA peuvent construire cela en une semaine, imaginez ce qui se passe quand l'écosystème se rallie autour."*

### Le Problème OpenNext

Cloudflare a reconnu dans leur annonce qu'ils étaient au courant de solutions existantes comme OpenNext, qui adapte la sortie de build Next.js pour diverses plateformes :

> *"Construire sur la sortie de Next.js comme fondement s'est avéré être une approche difficile et fragile. Parce qu'OpenNext doit reverse-engineer la sortie de build de Next.js, cela résulte en des changements imprévisibles entre versions qui prennent beaucoup de travail à corriger."*

En réimplémentant from scratch plutôt qu'en adaptant la sortie, vinext promet une compatibilité plus stable et des builds plus propres. Mais ce framing critiquait implicitement des années de travail de l'équipe OpenNext — et par extension, positionnait Cloudflare comme l'entreprise prête à faire ce que les autres ne pouvaient pas.

---

## La Réponse de Vercel

*Note : Je n'ai pas pu vérifier les déclarations officielles spécifiques de Vercel concernant vinext. Ce qui suit reflète les réactions rapportées par la communauté et le comportement observable.*

À la rédaction, je n'ai pas pu localiser de réponse officielle vérifiée de Vercel ou de son PDG Guillermo Rauch. L'accès Twitter/X était bloqué pendant ma recherche, limitant ma capacité à capturer les réactions en temps réel des figures clés.

Ce que la communauté a observé inclus :

- **Silence initialement** : Vercel n'a pas publié de billet de blog ou communiqué de presse immédiat répondant à vinext
- **Activité GitHub** : Le dépôt Next.js a vu une discussion accrue sur vinext, avec certains contributeurs questionnant les implications à long terme pour le framework
- **Spéculation des développeurs** : De nombreux développeurs ont interprété le manque de réponse soit comme une confiance dans le moat de Vercel, soit comme un signe qu'ils ont été pris au dépourvu

*Cette section contient des observations non vérifiées. Si vous avez des liens vers des réponses officielles de Vercel, merci de me contacter.*

---

## Préoccupations de Sécurité et de Qualité

Le projet vinext ne fait pas de mystère sur sa nature expérimentale. Le README GitHub inclut cela en évidence :

> 🚧 **Expérimental — sous développement intensif.** Ce projet est une expérience dans le développement logiciel piloté par l'IA. La grande majorité du code, des tests et de la documentation ont été écrits par l'IA (Claude Code). Les humains n'ont pas relu la plupart du code ligne par ligne.

### Limitations Connues

Le projet liste explicitement ce qui n'est PAS supporté :

- Pré-rendu statique au moment du build (sur la roadmap)
- Certains cas limites dans le streaming RSC
- APIs internes Next.js non documentées

### Le Débat sur la Qualité du Code Généré par IA

L'approche du projet a soulevé des questions importantes :

1. **Le code généré par IA à cette échelle peut-il être fiable ?** Avec 94% de couverture API, qu'en est-il des 6% restants ?
2. **Qui révise le travail de l'IA ?** Le projet s'appuie sur des suites de tests plutôt que sur une revue de code humaine
3. **Que se passe-t-il quand Next.js publie de nouvelles fonctionnalités ?** vinext suit la surface API publique, mais les fonctionnalités expérimentales peuvent prendre du retard

L'ingénieur de Cloudflare a reconnu cela dans le billet de blog :

> *"Il y avait des PRs qui étaient simplement fausses. L'IA implémenterait avec confiance quelque chose qui semblait juste mais ne correspondait pas au comportement réel de Next.js. J'ai dû corriger le cours régulièrement."*

### Utilisation dans le Monde Réel

Malgré l'étiquette expérimentale, de vrais clients utilisent déjà vinext en production :

- **CIO.gov** (National Design Studio) : Utilise vinext en production avec "des améliorations significatives dans les temps de build et les tailles de bundles"

---

## Réaction de la Communauté et Embeds de Tweets

*Note : En raison des restrictions de l'API Twitter/X, je n'ai pas pu récupérer le contenu spécifique des tweets. Ce qui suit représente les réactions documentées de sources accessibles.*

Le fil Hacker News sur l'annonce vinext de Cloudflare a attiré un débat significatif. Les développeurs ont pesé sur plusieurs préoccupations clés :

### La Critique "Juste un Wrapper"

Certains développeurs ont argumenté que vinext, malgré ses chiffres impressionnants, ne change pas fondamentalement la dynamique de pouvoir :

> *"La valeur de Vercel n'est pas juste le runtime — c'est l'expérience développeur, l'écosystème, les intégrations. Le temps de build est une petite partie de ce qui rend Next.js sur Vercel précieux."*

### Les Implications pour le Développement par IA

Le succès du projet a déclenché une discussion sur l'avenir du développement de frameworks :

> *"Si un ingénieur peut reconstruire Next.js en une semaine avec l'IA, qu'est-ce que cela signifie pour les moats compétitifs de n'importe quelle entreprise de logiciel ?"*

### Questions sur la Durabilité

D'autres ont soulevé des préoccupations concernant la maintenance à long terme :

> *"Qui maintient ceci quand le code généré par l'IA doit évoluer avec Next.js ? Construisons-nous des logiciels ou créons-nous de la dette technique à l'échelle ?"*

---

## L'Après-Midi

Depuis l'annonce du 24 février, plusieurs développements se sont produits :

### Activité GitHub

Le [dépôt GitHub vinext](https://github.com/cloudflare/vinext) montre un développement actif avec :
- Plus de 600 issues ouvertes
- Commits réguliers des ingénieurs Cloudflare
- Contributions communautaires pour les adaptateurs de plateforme

### Support de Plateforme Croissant

Le projet s'est étendu au-delà de Cloudflare Workers :
- Déploiement Vercel démontré (via Nitro)
- Support Netlify en cours
- Adaptateurs AWS Amplify en développement

### Mouvement de l'Industrie

L'annonce a catalysé des conversations plus larges sur :
- **Le coût des frameworks propriétaires** : Si les frameworks peuvent être clonés, quelle est la valeur du lock-in ?
- **Développement piloté par l'IA** : Si l'IA peut maintenir des projets logiciels complexes à l'échelle
- **Concurrence edge computing** : Cloudflare, Vercel, Netlify, et d'autres course pour offrir le meilleur déploiement React serverless

---

## Analyse : Ce Que Cela Signifie pour l'Industrie

### Pour Vercel

Vercel fait face à une vérité inconfortable : leur moat peut être plus mince qu'ils ne l'espéraient. L'entreprise a bâti un excellent produit, mais vinext démontre que la compatibilité Next.js peut être atteinte ailleurs. Vercel devra concurrencer sur plus que juste "où Next.js s'exécute le mieux."

**Les réponses potentielles incluent :**
- Accélérer les intégrations spécifiques à Next.js qui ne peuvent pas être facilement clonées
- Réduire les prix pour concurrencer le réseau edge de Cloudflare
- Redoubler sur l'expérience développeur et les outils

### Pour Cloudflare

Cloudflare a signalé sa sérieuxneté concernant l'espace plateforme développeur. vinext n'est pas qu'une démo technique — c'est la preuve que Cloudflare peut attirer des développeurs qui voyaient précédemment Vercel comme la seule option. Cet investissement dans les outils développeurs reflète la stratégie plateforme plus large de Cloudflare, qui inclut également des partenariats avec des frameworks comme [Astro](/articles/2026-03-30-astro-6-rust-compiler-cloudflare).

**Le défi :** Maintenir la compatibilité avec un framework en évolution rapide (Next.js) tout en bâtissant un modèle commercial durable.

### Pour la Communauté Développeurs

Peut-être le plus grand gagnant est les développeurs eux-mêmes. vinext ajoute du choix à un écosystème qui se sentait de plus en plus comme un système à parti unique. Que cela mène à l'innovation ou à la fragmentation reste à voir.

### Le Tableau Plus Grand : Le Rôle de l'IA dans le Développement Logiciel

vinext représente une nouvelle catégorie de projet : **infrastructure réimplémentée par l'IA**. La question n'est pas si cela se reproduira — c'est à quelle fréquence, et si les résultats seront prêts pour la production.

Du blog Cloudflare :

> *"Il n'a pas besoin d'un framework intermédiaire pour rester organisé. Il a juste besoin d'une spec et d'un fondement sur lequel construire... Les couches que nous avons bâties au fil des années n'auront pas toutes survived."*

C'est peut-être l'implication la plus significative de vinext. Ce n'est pas qu'un concurrent de Next.js — c'est la preuve que les règles du développement logiciel changent.

---

## Conclusion

Le projet vinext de Cloudflare est soit un coup marketing brilliant, une expérience fascinante dans le développement piloté par l'IA, ou les deux. La controverse qu'il a déclenchée reflète des tensions plus profondes dans l'écosystème de développement web : propriétaire vs. open, intégré vs. composable, lock-in propriétaire vs. flexibilité de déploiement.

Que vinext devienne une alternative de production viable ou reste une curiosité expérimentale, il a déjà changé la conversation. Les développeurs savent maintenant que s'ils veulent exécuter Next.js sur Cloudflare, ils le peuvent. Et cette connaissance change tout.

La semaine où un ingénieur et une IA ont reconstruit Next.js peut bien être mémorisée comme un tournant — pas seulement pour Cloudflare et Vercel, mais pour comment nous pensons au développement de frameworks lui-même.

---

*Quels sont vos pensées sur vinext et l'avenir du déploiement Next.js ? Faites-le nous savoir dans les commentaires.*
