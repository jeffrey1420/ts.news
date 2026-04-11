---
title: "QuickBEAM : un runtime JavaScript pour la VM BEAM — JavaScript rencontre OTP d'Erlang"
description: "QuickBEAM est un runtime JavaScript qui s'exécute à l'intérieur de la VM BEAM — la même machine virtuelle qui alimente Erlang et Elixir. Il intègre JavaScript dans les arbres de supervision OTP, permet à JS d'appeler des fonctions Elixir et des bibliothèques OTP, et inclut un outil TypeScript intégré."
image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&h=630&fit=crop"
date: "2026-04-11"
category: Runtimes
author: lschvn
readingTime: 5
tags: ["QuickBEAM", "BEAM", "Erlang", "Elixir", "JavaScript", "runtime", "OTP", "TypeScript"]
tldr:
  - "QuickBEAM intègre des runtimes JavaScript comme processus GenServer dans les arbres de supervision BEAM, ce qui signifie que la récupération sur crash, le lien de processus et les superviseurs OTP fonctionnent transparentement avec le code JavaScript."
  - "Le code JavaScript tournant sur QuickBEAM peut appeler des fonctions Elixir et accéder aux bibliothèques OTP directement via Beam.call(), envoyer des messages à n'importe quel processus BEAM, et spawner de nouveaux runtimes JS comme processus BEAM."
  - "QuickBEAM inclut un outil TypeScript intégré, ciblant Zig 0.15+ et distribué via Hex comme dépendance Elixir — faisant de lui le chemin le plus intégré entre JavaScript et l'écosystème BEAM."
faq:
  - q: "Qu'est-ce que la VM BEAM ?"
    a: "BEAM est la machine virtuelle qui exécute le code Erlang et Elixir. Elle est reconnue pour sa tolérance aux pannes, son ordonnancement soft real-time, et sa capacité à exécuter des millions de processus concurrents avec isolation intégrée. C'est le moteur derrière WhatsApp, Discord, RabbitMQ, et beaucoup d'autres systèmes où la fiabilité sous charge est critique."
  - q: "Quel problème QuickBEAM résout-il ?"
    a: "QuickBEAM permet aux développeurs d'écrire du JavaScript qui bénéficie du modèle de tolérance aux pannes de BEAM — arbres de supervision, lien de processus, rechargement à chaud du code — sans quitter l'écosystème JavaScript. C'est un pont pour les équipes qui veulent la fiabilité BEAM pour certains composants mais ont du code JavaScript existant ou préfèrent JavaScript pour certaines charges de travail."
  - q: "Comment JavaScript appelle-t-il du code Elixir ?"
    a: "QuickBEAM expose une API Beam.call() que JavaScript peut invoquer pour atteindre n'importe quel handler Elixir enregistré. Les handlers sont enregistrés au démarrage du runtime QuickBEAM, et ils peuvent exécuter du code Elixir arbitraire — interroger des bases de données, appeler des bibliothèques OTP, spawner des processus. Les résultats sont sérialisés retour en JavaScript."
  - q: "Qu'est-ce qu'un GenServer ?"
    a: "Un GenServer (Generic Server) est un module behaviour dans OTP qui implémente le pattern client-serveur. Les runtimes QuickBEAM sont des GenServers — ils vivent dans les arbres de supervision, peuvent être nommés, peuvent recevoir des messages, et sont gérés par la machinery de tolérance aux pannes d'OTP."
---

Il y a une blague récurrente dans la communauté Erlang : "Pourquoi les développeurs Erlang rient des autres langages ? Parce que leurs processus ont des superviseurs qui les regardent." Le modèle de tolérance aux pannes de la VM BEAM — où les processus crashés sont automatiquement redémarrés par les superviseurs, où les erreurs dans un processus n'abattent pas les autres, où le rechargement à chaud du code est intégré au runtime — est véritablement différent de ce à quoi la plupart des développeurs sont habitués.

QuickBEAM (sur [github.com/elixir-volt/quickbeam](https://github.com/elixir-volt/quickbeam)) met JavaScript à l'intérieur de ce modèle. Il exécute des runtimes JavaScript comme processus GenServer BEAM, les intègre dans les arbres de supervision OTP, et permet au code JavaScript d'appeler des fonctions Elixir et des bibliothèques OTP directement.

## Ce Que QuickBEAM Est Réellement

En son cœur, QuickBEAM est un GenServer BEAM qui encapsule un runtime JavaScript. Chaque runtime JS est un processus dans l'ordonnanceur de la VM BEAM, avec toutes les garanties que cela implique. Vous démarrez un runtime :

```elixir
{:ok, rt} = QuickBEAM.start()
{:ok, 3} = QuickBEAM.eval(rt, "1 + 2")
{:ok, "HELLO"} = QuickBEAM.eval(rt, "'hello'.toUpperCase()")
```

L'état persiste à travers les appels au sein du même runtime, et vous pouvez appeler des fonctions JavaScript nommées :

```elixir
QuickBEAM.eval(rt, "function greet(name) { return 'hi ' + name }")
{:ok, "hi world"} = QuickBEAM.call(rt, "greet", ["world"])
```

## JavaScript Rencontre OTP

La partie intéressante est le pont entre JavaScript et l'écosystème BEAM environnant. Vous enregistrez des handlers Elixir au démarrage du runtime :

```elixir
{:ok, rt} = QuickBEAM.start(handlers: %{
  "db.query" => fn [sql] -> MyRepo.query!(sql).rows end,
  "cache.get" => fn [key] -> Cachex.get!(:app, key) end,
})

{:ok, rows} = QuickBEAM.eval(rt, """
  const rows = await Beam.call("db.query", "SELECT * FROM users LIMIT 5");
  rows.map(r => r.name);
""")
```

JavaScript peut également envoyer des messages à n'importe quel processus BEAM, surveiller les processus pour leur sortie, et être lié bidirectionnellement — donc un crash JavaScript peut déclencher un redémarrage par le superviseur comme n'importe quel autre processus OTP.

## Outil TypeScript Intégré

QuickBEAM inclut un outil TypeScript intégré, ce qui est notable car cela fait de TypeScript un citoyen de première classe dans l'écosystème BEAM plutôt qu'un après-gardé. Le projet cible Zig 0.15+ et distribue via Hex :

```elixir
def deps do
  [{:quickbeam, "~> 0.7.1"}]
end
```

## Arbres de Supervision pour JavaScript

Le bénéfice pratique de tout cela est les arbres de supervision qui incluent des composants JavaScript. Si un runtime JavaScript crash, la stratégie de supervision d'OTP gère la récupération — redémarrer le processus, potentiellement sur un autre nœud BEAM dans un setup distribué. Pour les applications qui ont besoin de la fiabilité de BEAM mais ont des composants écrits en JavaScript, c'est une réponse directe.

Vous pouvez également utiliser `QuickBEAM.ContextPool` pour créer un pool de contextes de runtimes JS pour les scénarios haute concurrence — plusieurs runtimes partageables à travers les requêtes.

## La Niche

QuickBEAM ne cherche pas à remplacer Node.js ou Deno. C'est un runtime spécialisé pour les équipes Elixir/Erlang qui veulent écrire certains composants en JavaScript sans abandonner le modèle de fiabilité BEAM. La surface d'intégration — `Beam.call()`, messagerie de processus, supervision — est le point, pas le runtime lui-même.

Pour l'écosystème JavaScript plus large, c'est une preuve d'existence que le modèle de concurrence de BEAM est accessible depuis JavaScript. Que ça trouve un vrai bassin d'utilisateurs dépend de si les équipes construisant des systèmes haute fiabilité en Elixir voient assez de valeur à écrire certains composants spécifiques en JavaScript plutôt qu'en Elixir lui-même.

Le projet est en version 0.7.1 et en développement actif. Si vous utilisez Elixir en production et avez du code JavaScript que vous aimeriez pouvoir confier davantage, ça vaut le coup d'y regarder.
