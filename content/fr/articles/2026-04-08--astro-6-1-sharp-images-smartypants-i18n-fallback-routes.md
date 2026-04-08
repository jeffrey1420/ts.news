---
title: "Astro 6.1 : contrôle fin des images et routage i18n amélioré"
description: "Astro 6.1 permet de configurer les encodeurs Sharp au niveau du pipeline, ajoute des options avancées pour SmartyPants et expose les routes de repli i18n aux intégrations. L'acquisition par Cloudflare continue de façonner la roadmap."
image: "https://opengraph.githubassets.com/1/withastro/astro"
date: "2026-04-08"
category: Frameworks
author: lschvn
readingTime: 4
tags: ["astro", "javascript", "frameworks", "images", "i18n", "markdown", "release"]
tldr:
  - "Astro 6.1 expose les options d'encodage de Sharp au niveau du pipeline — MozJPEG, effort WebP, sous-échantillonnage chroma AVIF et compression PNG peuvent désormais être définis par défaut."
  - "Le plugin SmartyPants accepte maintenant un objet d'options complet pour affiner les tirets, guillemets, apostrophes et ellipses — utile pour la localisation et les standards typographiques."
  - "Les intégrations peuvent désormais accéder aux routes de repli i18n via `fallbackRoutes` sur le type `IntegrationResolvedRoute`, corrigeant les intégrations sitemap et routage."
  - "Astro a rejoint Cloudflare en janvier 2026 ; l'acquisition se reflète dans les priorités : sites riches en contenu, optimisés pour le edge."
faq:
  - q: "Quelles sont les nouveautés d'Astro 6.1 par rapport à la 6.0 ?"
    a: "Les fonctionnalités principales sont la configuration de l'encodeur Sharp au niveau du pipeline, le support de l'objet options pour SmartyPants, et l'exposition de `fallbackRoutes` sur le hook d'intégration. Ce sont des ajouts ciblés par rapport à la 6.0."
  - q: "Dois-je changer quelque chose en passant de Astro 6.0 ?"
    a: "Astro 6.1 est une version mineure — aucune rupture attendue. Les paramètres par défaut de Sharp sont additifs, et le comportement de SmartyPants est préservé sauf configuration explicite."
  - q: "Que signifie 'les routes de repli i18n pour les intégrations' ?"
    a: "Les sites utilisant `fallbackType: 'rewrite'` génèrent des routes supplémentaires qui n'étaient pas visibles par les intégrations. Astro 6.1 les expose via le hook `astro:routes:resolved`."
---

Astro 6.1 est sorti le 31 mars, et même si ce n'est pas une release aussi spectaculaire que la 6.0 (compilateur Rust expérimental), elle apporte trois améliorations ciblées qui répondent à de véritables points de friction pour les sites riches en contenu déployés au edge.

## Sharp : contrôles au niveau de l'encodeur

Le changement le plus utile en pratique : vous pouvez désormais définir les valeurs par défaut spécifiques au codec pour le pipeline d'images intégré à Astro. Avant la 6.1, vous pouviez contrôler la `quality` par image, mais les options sous-jacentes de l'encodeur — niveau MozJPEG, effort WebP, sous-échantillonnage AVIF, compression PNG — étaient fixes.

En 6.1, avec `astro/assets/services/sharp` :

```js
// astro.config.mjs
export default defineConfig({
  image: {
    service: {
      config: {
        jpeg: { mozjpeg: true },
        webp: { effort: 4 },
        avif: { effort: 3, chromaSubsampling: '4:2:0' },
        png: { compressionLevel: 9 }
      }
    }
  }
});
```

Ces valeurs deviennent les défaut pour la génération d'images à la compilation. La `quality` par image définie sur `<Image />`, `<Picture />` ou `getImage()` prime toujours.

Pour les sites générant des centaines de variants d'images au build, les paramètres WebP effort et AVIF peuvent significativement modifier le compromis taille/qualité.

## SmartyPants : un objet d'options

Astro supporte SmartyPants depuis longtemps. La 6.1 expose l'objet d'options complet de `retext-smartypants` :

```js
export default defineConfig({
  markdown: {
    smartypants: {
      backticks: 'all',
      dashes: 'oldschool',
      ellipses: 'unspaced',
      openingQuotes: { double: '«', single: '‹' },
      closingQuotes: { double: '»', single: '›' },
      quotes: false
    }
  }
});
```

Les conventions typographiques françaises, allemandes ou nordiques qui nécessitent des guillemets spécifiques sont désormais exprimables. Le mode `oldschool` pour les tirets (`--` pour le tiret demi-cadratin) était une demande récurrente.

## Routes de repli i18n accessibles aux intégrations

Les intégrations peuvent désormais voir les routes de repli générées pour les configurations i18n avec `fallbackType: 'rewrite'`. Auparavant, ces routes existaient mais n'étaient pas exposées via le hook `astro:routes:resolved`. Les intégrations qui construisent des index de routes — notamment le sitemap — pouvaient générer des sitemaps incomplets.

La 6.1 ajoute `fallbackRoutes` au type `IntegrationResolvedRoute`, permettant aux intégrations sitemap et de routage de fonctionner correctement.

## L'effet Cloudflare

Astro a rejoint Cloudflare en janvier 2026, et la release 6.1 est cohérente avec cette direction : sites riches en contenu déployés sur Workers/Pages, optimisation d'images au edge, polish typographique. Astro reste sous licence MIT et agnostique en termes de plateforme, mais la roadmap reflète de plus en plus ce que l'infrastructure Cloudflare facilite.

```bash
npm install astro@latest
```
