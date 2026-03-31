---
title: "Pretext : La bibliothèque de mesure de texte sans DOM que les agents de codage IA utilisent déjà"
description: "Cheng Lou vient de publier Pretext, une bibliothèque JavaScript pure qui mesure et dispose du texte multiligne sans toucher au DOM. Voici pourquoi c'est important pour la virtualisation, le contrôle de layout et les agents IA qui génèrent du code UI."
date: "2026-03-31"
image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop"
author: lschvn
tags: ["javascript", "typescript", "layout", "performance", "DOM", "library"]
readingTime: 7
tldr:
  - "Pretext (@chenglou/pretext) mesure et dispose le texte multiligne sans toucher au DOM, en utilisant measureText du canvas comme vérité terrain."
  - "Le layout() à chaud s'exécute en ~0,09ms pour 500 textes — 10 à 50x plus rapide que les appels getBoundingClientRect() individuels avec zéro reflow."
  - "Support Unicode complet, emoji et texte bidirectionnel ; la séparation prepare()/layout() permet un setup en cache avec des chemins à arithmetic pure."
  - "Cas d'usage clés : virtualisation sans estimations de hauteur, prévention CLS, layout côté serveur et agents IA prédisant le débordement de texte."
faq:
  - question: "Comment Pretext mesure-t-il le texte sans accéder au DOM ?"
    answer: "Pretext utilise l'API measureText() du canvas du navigateur, qui utilise le même moteur de typographie que le DOM. La mesure est précise car elle utilise la vraie typographie du navigateur, mais elle se produit hors écran sans déclencher de layout du tout."
  - question: "Pretext peut-il être utilisé pour les agents IA de codage ?"
    answer: "Oui, c'est un cas d'usage majeur. Cuando un agente IA genera código UI, actualmente no tiene forma de saber si una etiqueta desbordará sin ejecutar el código en un navegador. Pretext da a los agentes IA la capacidad de predecir el layout del texto en tiempo de generación — antes de que el código se ejecute."
  - question: "Quelles sont les limitations de Pretext ?"
    answer: "Pretext cible white-space: normal, word-break: normal, overflow-wrap: break-word, line-break: auto — le cas courant, pas chaque modèle de texte CSS. system-ui n'est pas sûr pour la précision de mesure sur macOS — vous avez besoin d'une police nommée. Ce n'est pas un moteur de rendu de police complet."
---

Une nouvelle bibliothèque est apparue sur npm le 29 mars avec zéro annonce et déjà des centaines de téléchargements : **Pretext** (`@chenglou/pretext`), une bibliothèque JavaScript et TypeScript pure pour la mesure et la disposition de texte multiligne — sans jamais toucher au DOM.

L'auteur est Cheng Lou, auparavant connu pour son travail sur React et ReasonML. Le concept est simple : mesurer le texte comme le font les navigateurs, en utilisant le propre moteur de police du navigateur comme vérité terrain, mais entièrement via canvas — pas de `getBoundingClientRect`, pas de `offsetHeight`, pas de reflow de layout.

## Pourquoi c'est important : le problème du reflow

Chaque développeur front-end a rencontré ce mur : vous devez savoir combien de hauteur un bloc de texte occupera avant de le rendre. La réponse traditionnelle est de le rendre, le mesurer, puis ajuster. Cela déclenche un **reflow de layout** — l'une des opérations les plus coûteuses du navigateur. Pour une seule étiquette, c'est acceptable. Pour une liste de 10 000 messages, un scroll virtualisé ou un agent IA générant de l'UI dynamiquement, c'est une catastrophe.

Pretext contourne complètement cela. Il mesure le texte en utilisant un canvas caché et l'API `measureText()` du navigateur, qui utilise le même moteur de police que le DOM. La mesure est précise car elle utilise la vraie typographie du navigateur — mais cela se passe hors écran, sans déclencher de layout du tout.

```typescript
import { prepare, layout } from '@chenglou/pretext'

// Préparation unique (fait une fois par combinaison texte+police)
const prepared = prepare('AGI 春天到了. 시작했다 🚀', '16px Inter')

// Chemin à chaud : arithmétique pure, pas de DOM impliqué
const { height, lineCount } = layout(prepared, textWidth, 20)
```

`prepare()` fait le travail unique : normalisation des espaces, segmentation du texte, application des règles de colle, mesure des segments avec canvas. `layout()` après cela est environ **0,09 ms** pour 500 textes sur le benchmark actuel. C'est sous-milliseconde.

## Deux cas d'usage, une bibliothèque

### 1. Mesurer sans toucher au DOM

Le cas d'usage principal : connaître la hauteur de votre texte avant de le rendre. Cela débloque :

- **Virtualisation sans estimations** : rendre uniquement ce qui correspond à la fenêtre d'affichage, mesurer le reste à l'avance
- **Prévention CLS** : pré-mesurer le texte avant qu'il se charge pour réserver l'espace adecuado et garder la position de défilement stable
- **Détection de débordement au moment du développement** : les agents de codage IA peuvent vérifier qu'une étiquette de bouton ne passera pas à deux lignes avant même que le code s'exécute

### 2. Layout de ligne manuel

Si vous avez besoin du contenu réel des lignes — pour le rendu canvas/SVG, pour le texte qui circule autour des flottants, ou pour construire des renderers personnalisés — Pretext fournit des API de bas niveau :

```typescript
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

const prepared = prepareWithSegments('AGI 春天到了. 시작했다 🚀', '18px "Helvetica Neue"')
const { lines } = layoutWithLines(prepared, 320, 26)

for (let i = 0; i < lines.length; i++) {
  ctx.fillText(lines[i].text, 0, i * 26)
}
```

`walkLineRanges()` ne construit jamais de chaînes de lignes — il appelle un callback pour chaque ligne avec sa largeur et ses positions de curseur. Cela permet des recherches binaires sur les dimensions de layout.

## Benchmarks

Du propre benchmark du projet sur un lot partagé de 500 textes :
- **`prepare()`** : ~19 ms (unique, en cache)
- **`layout()`** : ~0,09 ms (chemin à chaud, arithmétique pure)

Pour contexte, un seul appel `getBoundingClientRect()` sur un sous-arbre DOM modérément complexe peut prendre 1-5 ms sur un appareil de milieu de gamme. Le chemin à chaud de Pretext est 10-50× plus rapide que la mesure DOM.

## Support Unicode complet + Emoji + Texte bidirectionnel

Pretext gère correctement le rendu de texte dans toutes les langues. Le README souligne spécifiquement le support des emojis et du texte bidirectionnel (bidi) mixte.

## Installation

```bash
npm install @chenglou/pretext
```

Les démos sont sur [chenglou.me/pretext](https://chenglou.me/pretext/). Le code source est sur [GitHub](https://github.com/chenglou/pretext).
