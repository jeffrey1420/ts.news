---
title: "Node.js 25.9 : L'API stream/iter Arrive Enfin en Expérimental"
description: "Node.js 25.9 ajoute un module stream/iter expérimental pour l'itération asynchrone sur les streams, un flag CLI --max-heap-size, AsyncLocalStorage avec using scopes, la crypto TurboSHAKE, et npm 11.12.1."
image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=630&fit=crop"
date: "2026-04-12"
category: Runtimes
author: lschvn
readingTime: 5
tags: ["Node.js", "JavaScript", "streams", "async-iteration", "performance", "CLI", "crypto", "npm"]
tldr:
  - "stream/iter est le nouveau module expérimental permettant des boucles for-await-of sur tout Readable stream — remplaçant les bidouillages Readable.from() et donnant aux streams une interface d'itération asynchrone native."
  - "--max-heap-size permet de fixer un plafond mémoire V8 par processus via flag CLI, comblant un manque longtemps ressenti pour les workloads Node.js conteneurisés nécessitant des bounds mémoire prévisibles."
  - "AsyncLocalStorage supporte désormais les 'using' scopes — un pattern emprunté à IDisposable de C#, garantissant un nettoyage déterministe des ressources à la sortie du scope, même en cas d'erreur."
faq:
  - q: "En quoi stream/iter diffère-t-il de l'approche Readable.from() existante ?"
    a: "Readable.from(iterable) enveloppe un itérable en Readable stream, mais est conçu pour créer des streams, pas les consommer. stream/iter fournit stream.iter(readable) et stream.consume(readable) — des fonctions pour lire et itérer sur un stream existant en utilisant la syntaxe standard d'itération asynchrone. C'est la primitive manquante qui rend la programmation par streams composable avec les protocoles d'itération natifs de JavaScript."
  - q: "Qu'est-ce que la syntaxe 'using' scope dans AsyncLocalStorage ?"
    a: "Le mot-clé using (proposal ECMAScript Explicit Resource Management stage 3) appelle une méthode [Symbol.dispose]() à la sortie d'un bloc — normalement ou via throw. Node.js 25.9 ajoute les using scopes à AsyncLocalStorage, permettant de lier une instance AsyncLocalStorage à un scope pour qu'elle soit automatiquement nettoyée à la sortie du scope, sans nettoyage try/finally explicite. Ce pattern élimine une classe de fuites mémoire AsyncLocalStorage dans les serveurs longue durée."
  - q: "Qu'est-ce que --max-heap-size et quand l'utiliser ?"
    a: "--max-heap-size fixe une taille maximale du tas V8 en mégaoctets. C'est un flag CLI passé au démarrage du processus : node --max-heap-size=512 server.js. Dans les environnements conteneurisés (Docker, Kubernetes), fixer un plafond mémoire dur aide l'orchestrateur à tuer proprement les processus OOM plutôt que de laisser le tueur OOM de l'OS agir de façon imprévisible."
  - q: "Que sont TurboSHAKE et KangarooTwelve ?"
    a: "Ce sont des fonctions de hachage cryptographiques. TurboSHAKE est une fonction de hachage à longueur variable haute vitesse, conçue pour les applications nécessitant un hachage rapide à haut débit — données en streaming, tree hashing, proof-of-work. KangarooTwelve est un variant rapide de SHA-3 (SHA-3/128) avec une sortie 128 bits, conçu comme alternative plus rapide à SHA-256 pour les usages quotidiens. Node.js les expose désormais via l'API WebCrypto."
---

Node.js 25.9.0 est sorti le 1er avril avec un ensemble d'ajouts qualité-de-vie, plusieurs en préparation depuis plus d'un an. Les fonctionnalités principales sont le nouveau module expérimental `stream/iter` et le flag CLI `--max-heap-size`, mais il y a plus à connaître.

## stream/iter : Itération Asynchrone pour les Streams

Le nouveau module `experimental/streams/iter` (à promouvoir en stable dans une future version) ajoute deux fonctions :

- `stream.iter(readable)` — retourne un itérateur asynchrone qui produit des chunks depuis un Readable stream
- `stream.consume(readable)` — crée un writable stream qui draine un readable, utile pour les motifs de piping

L'effet pratique est que vous pouvez maintenant utiliser `for await...of` directement sur tout Readable stream Node.js :

```javascript
import { iter } from 'node:experimental/streams/iter';
import { createReadStream } from 'node:fs';

for await (const chunk of iter(createReadStream('file.txt'))) {
  process(chunk);
}
```

Cela remplace le contournement `Readable.from()` que beaucoup de développeurs utilisaient pour faire le pont entre streams et itérables asynchrones. `Readable.from()` était conçu pour créer un stream depuis un itérable — l'utiliser comme consommateur de stream était toujours un bidouillage. La nouvelle API rend l'intention explicite et évite le double buffering de l'ancien pattern.

La fonction `consume()` est orientée vers la transformation de streams :

```javascript
import { consume } from 'node:experimental/streams/iter';
import { createReadStream, createWriteStream } from 'node:fs';

const writable = createWriteStream('output.txt');
await consume(createReadStream('input.txt')).pipe(writable);
```

James M Snell, qui a implémenté la fonctionnalité, a aussi ajouté des benchmarks dans le même PR — l'API est conçue pour avoir un overhead minimal comparé à la consommation manuelle de streams.

## --max-heap-size : Limites Mémoire Dures

Les processus Node.js ont toujours été soumis aux limites du tas V8, mais les fixer nécessitait des variables d'environnement (`--max-old-space-size`) ou des API programmatiques. `--max-heap-size` est un flag CLI simple :

```bash
node --max-heap-size=512 server.js
```

Contrairement à `--max-old-space-size`, qui ne contrôle que l'ancienne génération, `--max-heap-size` s'applique au tas total de V8 incluant la génération de code et la nouvelle génération. Cela le rend plus prévisible pour les workloads conteneurisés où vous voulez un plafond mémoire dur sur lequel l'orchestrateur peut s'appuyer.

Le flag a été proposé par tannal après plusieurs années de discussion avant d'atterrir.

## AsyncLocalStorage Gagne les Using Scopes

AsyncLocalStorage est un pilier pour le contexte scoped par requête dans les frameworks web depuis Node.js 16. Le nouvel ajout est le support des `using` scopes — basé sur le proposal ECMAScript Explicit Resource Management stage 3 (le pattern `Symbol.dispose`).

Le mot-clé `using` appelle une méthode [Symbol.dispose]() à la sortie d'un bloc, que ce soit normalement ou via une erreur. Avec la nouvelle API, vous pouvez lier une instance AsyncLocalStorage à un scope :

```javascript
import { AsyncLocalStorage } from 'node:async_hooks';

const storage = new AsyncLocalStorage();

{
  using scope = storage.enable();
  storage.run({ requestId: 'abc123' }, () => {
    // storage.get() returns { requestId: 'abc123' }
  });
}
// storage is automatically cleared when scope exits
```

Cela élimine le besoin de nettoyage try/finally explicite dans de nombreux patterns. Dans les serveurs à haut débit qui créent de nombreuses instances de stockage éphémères, les using scopes préviennent la croissance illimitée du store AsyncLocalStorage.

## Crypto : TurboSHAKE et KangarooTwelve

Le module `crypto` gagne deux nouvelles fonctions de hachage via l'intégration WebCrypto :

- **TurboSHAKE** — sortie à longueur variable, adapté au hachage en streaming et aux applications de tree hashing
- **KangarooTwelve** — hash 128 bits rapide, dérivé de SHA-3 conçu comme alternative plus rapide à SHA-256 pour les usages quotidiens

Ces fonctions sont disponibles via l'interface standard `SubtleCrypto.digest()` sous leurs noms d'algorithme respectifs.

## Autres Changements Notables

- **Refonte du mocking du test runner** : `MockModuleOptions.defaultExport` et `MockModuleOptions.namedExports` fusionnés en `MockModuleOptions.exports` unique, avec un codemod automatisé disponible
- **npm mis à jour en 11.12.1** : inclut les dernières fonctionnalités et correctifs de sécurité npm
- **SEA code cache pour ESM** : les Applications Single Executable supportent maintenant le code caching pour les points d'entrée ESM, améliorant le temps de démarrage des applications Node.js packagées
- **module.register() deprecated** : l'API legacy de registration de module est maintenant formellement dépréciée (DEP0205)

Node.js 25 est la ligne de version instable actuelle ; Node.js 24 deviendra le prochain candidat LTS plus tard cette année. La plupart de ces fonctionnalités seront backportées vers les lignes LTS à mesure qu'elles se stabilisent.
