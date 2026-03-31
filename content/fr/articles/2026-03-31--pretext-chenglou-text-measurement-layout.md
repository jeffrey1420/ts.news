---
title: "Pretext : La Bibliothèque de Mesure de Texte Sans DOM Que les Agents de Codage IA Utilisent Déjà"
description: "Cheng Lou vient de publier Pretext, une bibliothèque JavaScript pure qui mesure et met en page du texte multi-lignes sans toucher au DOM. Voici pourquoi cela compte pour la virtualisation, le contrôle de layout, et les agents IA qui génèrent du code UI."
date: "2026-03-31"
image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop"
author: lschvn
tags: ["javascript", "typescript", "layout", "performance", "DOM", "library"]
readingTime: 7
category: "release"
tldr:
  - "Pretext (@chenglou/pretext) mesure et met en page du texte multi-lignes sans toucher au DOM, utilisant measureText du canvas comme vérité terrain."
  - "Le hot-path layout() s'exécute en ~0.09ms pour 500 textes — 10–50x plus rapide que les appels simples getBoundingClientRect() avec zéro reflow."
  - "Support Unicode complet, emoji et texte bidirectionnel ; la séparation prepare()/layout() permet un setup one-time cached avec des hot paths en arithmétique pure."
  - "Cas d'usage clés : virtualisation sans estimations de hauteur, prévention CLS, layout côté serveur, et agents IA prédisant le débordement de texte."
---

Une nouvelle bibliothèque est apparue sur npm le 29 mars avec zéro annonce et déjà des centaines de téléchargements : **Pretext** (`@chenglou/pretext`), une bibliothèque JavaScript et TypeScript pure pour la mesure et le layout de texte multi-lignes — sans jamais toucher au DOM.

L'auteur est Cheng Lou, précédemment connu pour son travail sur React et ReasonML. Le concept est élégant : mesurer le texte comme le font les navigateurs, en utilisant le propre moteur de police du navigateur comme vérité terrain, mais entièrement via canvas — pas de `getBoundingClientRect`, pas de `offsetHeight`, pas de reflow de layout.

## Pourquoi Cela Compte : Le Problème du Reflow

Chaque développeur front-end a rencontré ce mur : vous avez besoin de savoir quelle hauteur aura un bloc de texte avant de le rendre. La réponse traditionnelle est de le rendre, le mesurer, puis ajuster. Cela déclenche un **reflow de layout** — l'une des opérations les plus coûteuses dans le navigateur. Pour un simple label, c'est acceptable. Pour une liste de 10 000 messages, un scroll virtualisé, ou un agent IA générant de l'UI dynamiquement, c'est un désastre.

Pretext contourne complètement cela. Il mesure le texte en utilisant un canvas caché et la propre API `measureText()` du navigateur, qui utilise le même moteur de police que le DOM. La mesure est précise parce qu'elle utilise la vraie typographie du navigateur — mais elle se produit hors écran, sans déclencher aucun layout.

```typescript
import { prepare, layout } from '@chenglou/pretext'

// Préparation one-time (fait une fois par combinaison texte+police)
const prepared = prepare('AGI 春天到了. 시작했다 🚀', '16px Inter')

// Hot path : arithmétique pure, pas de DOM impliqué
const { height, lineCount } = layout(prepared, textWidth, 20)
```

`prepare()` fait le travail one-time : normalisation des espaces, segmentation du texte, application des règles de glue, mesure des segments avec canvas. `layout()` après cela est approximativement **0.09ms** pour 500 textes sur le benchmark actuel. C'est sub-milliseconde.

## Deux Cas d'Usage, Une Bibliothèque

### 1. Mesurer Sans Toucher au DOM

Le cas d'usage principal : connaître la hauteur de votre texte avant de le rendre. Cela déverrouille :

- **Virtualisation sans estimations** : Rendre seulement ce qui rentre dans le viewport, mesurer le reste à l'avance
- **Prévention du CLS (Cumulative Layout Shift)** : Pré-mesurer le texte avant qu'il se charge pour pouvoir réserver l'espace approprié et garder la position de scroll stable
- **Détection de débordement au moment du développement** : Les agents de codage IA peuvent vérifier qu'un label de bouton ne passera pas à deux lignes avant même que le code s'exécute
- **Layouts utilisateur élaborés** : Masonry, implémentations flexbox personnalisées, layouts qui ajustent les valeurs sans hacks CSS

```typescript
// Détecter le débordement avant qu'il ne se produise
const { height } = layout(prepared, buttonWidth, buttonLineHeight)
if (height > buttonMaxHeight) {
  // Tronquer, tooltip, ou reflow
}
```

### 2. Layout de Ligne Manuel

Si vous avez besoin du contenu réel des lignes — pour le rendu canvas/SVG, pour le text wrapping autour des floats, ou pour construire des renderers personnalisés — Pretext fournit des APIs de plus bas niveau :

```typescript
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

const prepared = prepareWithSegments('AGI 春天到了. 시작했다 🚀', '18px "Helvetica Neue"')
const { lines } = layoutWithLines(prepared, 320, 26) // 320px max width, 26px line height

for (let i = 0; i < lines.length; i++) {
  ctx.fillText(lines[i].text, 0, i * 26)
}
```

La variante `walkLineRanges()` ne construit même jamais de chaînes de lignes — elle appelle un callback pour chaque ligne avec sa largeur et les positions du curseur. Cela permet des recherches binaires sur les dimensions du layout, des containers shrink-wrap, et du texte équilibré sans allocation de chaîne.

```typescript
// Trouver la largeur la plus serrée qui ajuste tout le texte
let maxW = 0
walkLineRanges(prepared, 320, line => {
  if (line.width > maxW) maxW = line.width
})
// maxW = la largeur minimum du container qui ne débordera pas
```

Et `layoutNextLine()` gère les colonnes à largeur variable — le cas canonique de texte qui s'écoule autour d'une image flottée :

```typescript
let cursor = { segmentIndex: 0, graphemeIndex: 0 }
let y = 0

while (true) {
  const width = y < image.bottom ? columnWidth - image.width : columnWidth
  const line = layoutNextLine(prepared, cursor, width)
  if (line === null) break
  ctx.fillText(line.text, 0, y)
  cursor = line.end
  y += 26
}
```

## Ce Qui Rend Pretext Différent

### Benchmarks

Des propres benchmarks vérifiés du projet sur un batch partagé de 500 textes :
- **`prepare()`** : ~19ms (one-time, cached)
- **`layout()`** : ~0.09ms (hot path, arithmétique pure)

Pour rappel, un simple appel `getBoundingClientRect()` sur un sous-arbre DOM modérément complexe peut prendre 1-5ms sur un appareil de milieu de gamme. Le hot path de Pretext est 10-50x plus rapide que la mesure DOM, avec zéro effet secondaire.

### Support Unicode Complet + Emoji + Bidirectionnel

Pretext gère correctement le text shaping across all languages. Le README souligne spécifiquement le support pour les emojis et le texte bidirectionnel (bidi) mixte — Arabe mélangé avec Anglais, Hébreu mélangé avec des chiffres. La bibliothèque utilise le propre moteur de police du navigateur comme source de vérité, donc elle shape le texte exactement de la manière dont le DOM le fera.

```typescript
// Scripts mixtes, emojis, bidirectionnel — tout géré correctement
prepare('AGI 春天到了. بدأت الرحلة 🚀', '16px Inter')
```

### Architecture de Cache en Deux Étapes

La séparation `prepare()` / `layout()` est l'insight de performance clé. `prepare()` est coûteux (mesure canvas, segmentation du texte, réordonnancement bidi) mais cached. `layout()` est de l'arithmétique sur des données pré-calculées. Vous payez le coût de setup une fois ; le hot path reste froid.

Resize ? Seulement `layout()` rerun. Changement de police ? Seulement `prepare()` rerun pour le texte affecté. C'est le genre de design d'API qui rend la génération de code AI traitable — l'agent peut appeler `layout()` dans une boucle serrée sans anxiété.

## Les Mises en Garde

Pretext est explicite sur ce qu'il ne fait pas (encore) :

- Il cible `white-space: normal`, `word-break: normal`, `overflow-wrap: break-word`, `line-break: auto` — le cas commun, pas chaque modèle de texte CSS
- `system-ui` n'est pas sûr pour la précision de mesure sur macOS — vous avez besoin d'une police nommée
- Ce n'est pas un moteur de rendu de police complet — il ne gère pas certaines fonctionnalités OpenType avancées, mais pour les 95% des cas de mesure de où le texte va se casser, il couvre tout

Le mode `white-space: pre-wrap` est également supporté pour les cas similaires aux textarea où les espaces, tabulations et retours à la ligne sont préservés.

## Pour Qui Est-ce Vraiment

La réponse évidente est les auteurs de bibliothèques UI et les mainteneurs de couches de virtualisation. Mais le README de Pretext fait une observation intéressante sur les **agents de codage IA** :

> "Vérification au moment du développement (surtout maintenant avec l'IA) que les labels sur ex. les boutons ne débordent pas à la ligne suivante, sans navigateur"

Quand une IA génère du code UI, elle n'a actuellement aucun moyen de savoir si un label débordera sans exécuter le code dans un navigateur. Pretext donne aux agents IA la capacité de prédire le layout du texte au moment de la génération — avant même que le code s'exécute. C'est une capacité significative pour le développement d'UI assisté par IA. Pour un regard plus large sur comment les outils de codage IA comme [Claude Code](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026) et Cursor évoluent l'expérience développeur, voyez nos [classements d'outils dev IA](/articles/2026-03-25-ai-dev-tool-rankings-march-2026).

La bibliothèque compte également pour :
- **Rendu canvas/SVG** où vous n'avez pas de DOM du tout
- **Calcul de layout côté serveur** (server-side rendering sans DOM)
- **UIs de jeux** construits sur canvas
- **Toolkits d'apps natives** qui embarquent un moteur JS mais n'exposent pas le système de layout du navigateur

[Bun](/articles/2026-03-30--bun-v1-3-11-cron-anthropic) est un tel environnement où l'approche de Pretext brille — avec son moteur JavaScript embarqué et support TypeScript natif, Pretext peut calculer des layouts côté serveur sans DOM du tout.

## Installation

```bash
npm install @chenglou/pretext
```

Les démos sont sur [chenglou.me/pretext](https://chenglou.me/pretext/). Le source est sur [GitHub](https://github.com/chenglou/pretext).

---

*Pretext est le second acte de Cheng Lou dans l'espace du rendu de texte — s'appuyant sur son travail antérieur sur [text-layout](https://github.com/chenglou/text-layout) d'il y a une décennie. Le design original de text-layout de Sebastian Markbage (measureText canvas pour le shaping, bidi de pdf.js, line breaking streaming) a informé l'architecture que Pretext porte maintenant forward.*
