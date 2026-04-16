---
title: "SWC v1.15.26 : le compilateur JavaScript propulsé par Rust continue d'avancer"
description: "Le compilateur JavaScript/TypeScript écrit en Rust publié par swc-project sort la v1.15.26 avec des corrections de bugs, des améliorations de performance et une intégration toujours plus profonde dans l'écosystème Node.js."
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
date: "2026-04-16"
category: Outils
author: lschvn
readingTime: 4
tags: ["SWC", "Rust", "JavaScript", "TypeScript", "compilateur", "bundler", "Parcel", "Next.js"]
tldr:
  - "SWC v1.15.26 est sorti le 14 avril 2026, poursuivant le cycle de release rapide du compilateur JavaScript/TypeScript écrit en Rust avec des corrections de bugs et des améliorations de compatibilité."
  - "SWC (speedy web compiler) est utilisé en production par Next.js, Parcel et Deno, en concurrence avec Babel et esbuild dans l'espace de la compilation JavaScript."
  - "L'approche basée sur Rust offre à SWC des avantages de performance significatifs par rapport aux compilateurs JavaScript — typiquement 20 à 70 fois plus rapide que Babel — tout en maintenant la compatibilité avec TypeScript et JSX."
faq:
  - q: "Qu'est-ce que SWC ?"
    a: "SWC est une plateforme extensible basée sur Rust pour le web. Il a commencé comme un compilateur TypeScript/JavaScript haute vitesse écrit en Rust, conçu pour remplacer Babel. Il est utilisé par Next.js (en option), Parcel et Deno pour la transpilation interne. Il produit un output compatible avec les transforms Babel tout en étant significativement plus rapide."
  - q: "Comment SWC se compare-t-il à esbuild ou OXC ?"
    a: "SWC, esbuild et OXC sont tous des projets d'outillage JavaScript basés sur Rust qui竞争 dans l'espace de la compilation et du bundling. esbuild est le plus ancien et se concentre sur la vitesse brute. OXC est plus récent, soutenu par l'équipe Vercel/Nx, ciblant la parité de fonctionnalités avec le vérificateur de types TypeScript et le bundler Rollup. SWC se situe entre les deux — il a été renforcé en production plus longtemps qu'OXC et possède un écosystème de plugins plus large."
  - q: "SWC est-il utilisé dans Next.js ?"
    a: "Oui. Next.js a ajouté SWC comme compilateur optionnel à partir de la version 12, et il est devenu le compilateur par défaut dans Next.js 13. Les utilisateurs peuvent opter pour Babel à la place pour des besoins spécifiques de compatibilité de transforms."
---

swc-project/swc v1.15.26 est sorti le 14 avril 2026, marquant une nouvelle release de maintenance dans le cycle régulier du compilateur JavaScript et TypeScript basé sur Rust. Le projet, renforcé en production à travers son intégration dans Next.js, Parcel et Deno, continue de livrer des corrections de compatibilité et des optimisations sans nouvelles fonctionnalités majeures dans ce cycle.

## Qu'est-ce que SWC ?

SWC (speedy web compiler) a commencé comme un remplacement direct de Babel, écrit en Rust pour profiter des caractéristiques de performance du langage. Où Babel s'exécute en tant que processus JavaScript interprétant une chaîne de transforms, SWC compile ces mêmes transforms en code machine natif à l'avance. Le résultat est un compilateur qui traite le code JavaScript et TypeScript 20 à 70 fois plus rapidement que Babel, selon la charge de travail.

Le projet est organisé autour d'une crate compilateur core qui gère le parsing, la transformation et la sérialisation du code JavaScript et TypeScript. Un système de crates séparé expose ces transforms comme des opérations isolées, qui peuvent être composées — similaire aux plugins Babel — mais exécutées dans un runtime Rust.

## Changements dans v1.15.26

La release v1.15.26 inclut des correctifs à travers la surface API commune et les passes de transform de SWC. Bien que ce soit une release de niveau patch, elle reflète le travail de maintenance continu qui garde SWC compatible avec les dernières propositions ECMAScript et la syntaxe TypeScript. La release stable précédente, v1.15.24, est sortie le 4 avril, et v1.15.25 a suivi peu après — le projet maintient un rythme de patch roughly hebdomadaire.

Les domaines clés du travail en cours incluent :

- **Compatibilité du transform TypeScript** — assurer que le transform SWC pour TypeScript reste aligné avec le comportement du compilateur TypeScript pour les fonctionnalités de syntaxe TypeScript plus récentes
- **Support des proposals ES2026/ES2027** — SWC suit le processus de stage des proposals ECMAScript et met à jour son parser et ses transforms en conséquence
- **Corrections de bugs dans le minifier** — le minifier SWC compete avec Terser pour l'optimisation de la taille de l'output JavaScript

## L'écosystème d'outils basé sur Rust

SWC existe dans un espace partiel mais sain du paysage des outils JavaScript. Les trois projets majeurs d'outils JavaScript basés sur Rust occupent chacun une niche différente :

- **esbuild** (par Evan Wallace) — le plus ancien, concentré sur la vitesse brute de compilation
- **SWC** — le plus compatible avec Babel, l'intégration la plus profonde avec les frameworks existants
- **OXC** (Oxidation Compiler) — le plus récent, soutenu par l'équipe Vercel/Nx, ciblant la couverture complète du vérificateur de types TypeScript et le bundling compatible Rollup

L'avantage de SWC sur les nouveaux entrants est son bilan. Il fonctionne en production à grande échelle dans les applications Next.js depuis des années, ce qui signifie que les cas limites ont été trouvés et corrigés. OXC rattrape rapidement — ses dernières releases (v0.125 et v0.126) ont ajouté des transforms spécifiques TypeScript qui nécessitaient auparavant SWC ou le compilateur TypeScript lui-même.

La concurrence saine entre ces trois projets a relevé le niveau de tout l'écosystème d'outils JavaScript. Ce qui aurait nécessité une chaîne de plugins Babel s'exécutant dans un processus JavaScript lent il y a cinq ans est maintenant géré par du code natif en millisecondes.

## Utiliser SWC

Pour la plupart des développeurs, SWC est rencontré indirectement via Next.js ou Parcel. Cependant, la crate SWC peut être utilisée directement comme outil de build ou intégrée dans des outils personnalisés :

```rust
use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, TsSyntax};
use swc_ecma_ast::*;
use swc_ecma_codegen::Emitter;

fn main() {
    let cm: Lrc<SourceMap> = Default::default();
    let fm = cm.new_source_file(
        FileName::Custom("example.ts".into()).into(),
        "const x: number = 1;".into(),
    );
    let lexer = Lexer::new(
        TsSyntax::default(),
        Default::default(),
        StringInput::from(&*fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);
    let module = parser.parse_module().unwrap();
    // ... transforms et codegen
}
```

L'API Rust donne un contrôle fin sur le pipeline de compilation. Pour les outils basés sur JavaScript, les packages npm `@swc-node` et `@swc/core` exposent les mêmes transforms.

Le projet maintient un canal de release nightly qui suit les dernières proposals ECMAScript et les fonctionnalités TypeScript. Les releases stables sont découpées assez fréquemment pour que la plupart des utilisateurs puissent mettre à jour sans souci — les changements cassants dans swc sont rares en dehors des montées de version majeures.
