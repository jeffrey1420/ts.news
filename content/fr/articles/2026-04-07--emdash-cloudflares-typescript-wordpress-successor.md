---
title: "EmDash : Le Successeur de WordPress signs par Cloudflare, Bass sur TypeScript avec des Plugins en Sandbox"
description: "Cloudflare a construit EmDash, un nouveau CMS open source écrit entièrement en TypeScript et propulsé par Astro. Les plugins s'exécutent dans des Dynamic Workers isolés, résolvant le problème de sécurité vieux de décennies dans WordPress."
date: "2026-04-07"
image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&h=630&fit=crop"
author: lschvn
tags: ["cloudflare", "typescript", "astro", "cms", "wordpress", "sécurité", "javascript"]
---

Cloudflare a lancé EmDash cette semaine, un système de gestion de contenu open source qu'il qualifie de « success spirituelle de WordPress ». Le projet se distingue par le fait d'être construit entièrement en TypeScript, propulsé par Astro, et par une approche fondamentalement différente de la sécurité des plugins.

[tldr]
- EmDash est un nouveau CMS open source construit sur Astro 6.0, écrit entièrement en TypeScript, sous licence MIT
- Les plugins s'exécutent dans des Dynamic Workers isolés plutôt que d'avoir un accès direct au système de fichiers et à la base de données — corrigeant le problème de sécurité central de WordPress
- 96 % des vulnérabilités de sécurité WordPress proviennent des plugins ; le modèle basé sur les capacités d'EmDash élimine cette surface d'attaque
- Déployable sur Cloudflare Workers ou tout serveur Node.js ; bêta développeur précoce disponible
[/tldr]

## Pourquoi WordPress Avait Besoin d'un Successeur

WordPress alimente plus de 40 % d'Internet. Il a été lancé en 2003, avant qu'AWS EC2 n'existe, et son architecture de plugins n'a fondamentalement pas changé depuis. Un plugin WordPress est un script PHP avec un accès direct à votre base de données et à votre système de fichiers. Installer un plugin signifie lui accorder une confiance totale.

Les chiffres sont éloquents : 96 % des vulnérabilités de sécurité WordPress proviennent des plugins, et 2025 a vu plus de vulnérabilités de plugins WordPress de haute sévérité que les deux années précédentes combinées. Le modèle est le problème, pas les développeurs de plugins individuels.

Le pari d'EmDash est qu'il est possible de construire un CMS pour l'ère serverless — où les plugins déclarent leurs besoins via un manifest et ne reçoivent que ces capacités — sans sacrifier l'accessibilité qui a rendu WordPress dominant.

## Comment Fonctionne le Sandboxing

Dans EmDash, chaque plugin s'exécute dans son propre [Dynamic Worker](https://developers.cloudflare.com/workers/runtime-apis/bindings/worker-loader/), la technologie d'isolate légère de Cloudflare. Au lieu de donner aux plugins un accès direct aux données, EmDash fournit des capacités via des bindings.

Avant d'installer un plugin, vous pouvez lire son manifest et savoir exactement les permissions qu'il demande — similaire à un écran de portées OAuth. La garantie de sécurité est structurelle : un plugin ne peut effectuer que les actions explicitement déclarées dans son manifest.

```typescript
// Exemple de manifest de plugin EmDash
{
  "name": "email-on-publish",
  "capabilities": ["send-email", "read-content"],
  "runtime": "dynamic-worker"
}
```

C'est un départ significatif du modèle d'inclusion PHP que WordPress a hérité d'une autre ère de l'hébergement web.

## Construis sur Astro 6.0, Écrit en TypeScript

EmDash n'est pas un fork de WordPress. Aucun code WordPress n'a été utilisé. Il est construit sur Astro 6.0 — le fork Astro de Cloudflare lui-même, qui a été reconstruit en une semaine grâce aux agents de codage IA l'année dernière.

Le projet est sous licence MIT, entièrement open source, et disponible sur [GitHub](https://github.com/emdash-cms/emdash). Vous pouvez déployer un modèle de blog directement sur Cloudflare Workers :

```
https://deploy.workers.cloudflare.com/?url=https://github.com/emdash-cms/templates/tree/main/blog-cloudflare
```

Il y a aussi un [EmDash Playground](https://emdashcms.com/) où vous pouvez essayer l'interface d'administration sans déployer quoi que ce soit.

## Le Contexte Plus Large

Cloudflare est en pleine phase de construction avec les agents de codage IA. L'entreprise a reconstruit Next.js en une semaine (produisant Vinext), puis a appliqué le même outillage à WordPress. Que le résultat de cette expérience soit prêt pour la production est une question séparée — EmDash démarre en bêta, pas en produit mature.

Mais la thèse est cohérente : le coût marginal de la construction de logiciels a considérablement diminué lorsque les agents IA gèrent le code répétitif, et le résultat peut être une architecture véritablement novelle plutôt qu'un thème WordPress. Le modèle de sécurité des plugins seul rend EmDash intéressant pour quiconque a dû auditer un site WordPress avec 30 plugins installés.

[faq]
- **EmDash est-il compatible avec les thèmes et plugins WordPress ?** Pas directement — EmDash est une implémentation de zéro. L'équipe vise la compatibilité des fonctionnalités, pas du code. Aucun PHP WordPress n'a été utilisé.
- **Où puis-je déployer EmDash ?** Initialement Cloudflare Workers et tout serveur Node.js. D'autres plateformes peuvent suivre.
- **Est-ce prêt pour la production ?** Non — EmDash v0.1.0 est une bêta développeur précoce. Des changements cassants sont à prévoir.
- **Quelle licence ?** MIT, choisie spécifiquement pour permettre une adoption et une contribution larges.
[/faq]
