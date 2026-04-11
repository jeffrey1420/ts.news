---
title: "QuickBEAM: Ein JavaScript-Runtime für die BEAM-VM — JavaScript trifft Erlangs OTP"
description: "QuickBEAM ist ein JavaScript-Runtime, der innerhalb der BEAM-VM läuft — derselben virtuellen Maschine, die Erlang und Elixir antreibt. Es integriert JavaScript in OTP-Supervision-Trees, ermöglicht JS den Aufruf von Elixir-Funktionen und OTP-Bibliotheken und wird mit einem eingebauten TypeScript-Toolkit ausgeliefert."
image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&h=630&fit=crop"
date: "2026-04-11"
category: Runtimes
author: lschvn
readingTime: 5
tags: ["QuickBEAM", "BEAM", "Erlang", "Elixir", "JavaScript", "Runtime", "OTP", "TypeScript"]
tldr:
  - "QuickBEAM bettet JavaScript-Runtimes als GenServer-Prozesse in BEAMs Supervision-Trees ein, was bedeutet, dass Crash-Wiederherstellung, Prozess-Verknüpfung und OTP-Supervisoren transparent mit JavaScript-Code funktionieren."
  - "JavaScript-Code, der auf QuickBEAM läuft, kann Elixir-Funktionen aufrufen und auf OTP-Bibliotheken direkt über Beam.call() zugreifen, Nachrichten an beliebige BEAM-Prozesse senden und neue JS-Runtimes als BEAM-Prozesse spawnen."
  - "QuickBEAM enthält ein eingebautes TypeScript-Toolkit, das auf Zig 0.15+ abzielt und über Hex als Elixir-Abhängigkeit verteilt wird — was es zum am stärksten integrierten Weg zwischen JavaScript und dem BEAM-Ökosystem macht."
faq:
  - q: "Was ist die BEAM-VM?"
    a: "BEAM ist die virtuelle Maschine, die Erlang- und Elixir-Code ausführt. Sie ist bekannt für ihre Fehlertoleranz, weiche Echtzeit-Scheduling und die Fähigkeit, Millionen gleichzeitiger Prozesse mit eingebauter Isolation zu betreiben. Sie ist das Rückgrat von WhatsApp, Discord, RabbitMQ und vielen anderen Systemen, bei denen Zuverlässigkeit unter Last kritisch ist."
  - q: "Welches Problem löst QuickBEAM?"
    a: "QuickBEAM ermöglicht es Entwicklern, JavaScript zu schreiben, das vom FEHLERTOLERANZ-MODELL VON BEAM profitiert — Supervision-Trees, Prozess-Verknüpfung, Hot-Code-Reloading — ohne das JavaScript-Ökosystem zu verlassen. Es ist eine Brücke für Teams, die BEAM-Zuverlässigkeit für bestimmte Komponenten wollen, aber bestehenden JavaScript-Code haben oder JavaScript für bestimmte Workloads bevorzugen."
  - q: "Wie ruft JavaScript Elixir-Code auf?"
    a: "QuickBEAM exponiert eine Beam.call()-API, die JavaScript aufrufen kann, um jeden registrierten Elixir-Handler zu erreichen. Handler werden beim Start des QuickBEAM-Runtimes registriert, und sie können beliebigen Elixir-Code ausführen — Datenbankabfragen, OTP-Bibliotheken aufrufen, Prozesse spawnen. Ergebnisse werden zurück nach JavaScript serialisiert."
  - q: "Was ist ein GenServer?"
    a: "Ein GenServer (Generic Server) ist ein Behaviour-Modul in OTP, das das Client-Server-Muster implementiert. QuickBEAM-Runtimes sind GenServers — sie leben in Supervision-Trees, können benannt werden, können Nachrichten empfangen und werden von OTP's Fehlertoleranz-Maschinerie verwaltet."
---

Es gibt einen langlaufenden Witz in der Erlang-Community: "Warum lachen Erlang-Entwickler über andere Sprachen? Weil ihre Prozesse Supervisoren haben, die auf sie aufpassen." Das Fehlertoleranz-Modell der BEAM-VM — wo abgestürzte Prozesse automatisch von Supervisoren neugestartet werden, wo Fehler in einem Prozess andere nicht zum Absturz bringen, wo Hot-Code-Reloading in den Runtime eingebaut ist — ist genuin anders als das, woran die meisten Entwickler gewöhnt sind.

QuickBEAM (auf [github.com/elixir-volt/quickbeam](https://github.com/elixir-volt/quickbeam)) bringt JavaScript in dieses Modell. Es führt JavaScript-Runtimes als BEAM-GenServer-Prozesse aus, integriert sie in OTP-Supervision-Trees und ermöglicht JavaScript-Code, direkt Elixir-Funktionen und OTP-Bibliotheken aufzurufen.

## Was QuickBEAM tatsächlich ist

Im Kern ist QuickBEAM ein BEAM-GenServer, der einen JavaScript-Runtime umschließt. Jeder JS-Runtime ist ein Prozess im BEAM-VM-Scheduler, mit allen Garantien, die das mit sich bringt. Man startet einen Runtime:

```elixir
{:ok, rt} = QuickBEAM.start()
{:ok, 3} = QuickBEAM.eval(rt, "1 + 2")
{:ok, "HELLO"} = QuickBEAM.eval(rt, "'hello'.toUpperCase()")
```

Zustand bleibt über Aufrufe innerhalb desselben Runtime bestehen, und man kann benannte JavaScript-Funktionen aufrufen:

```elixir
QuickBEAM.eval(rt, "function greet(name) { return 'hi ' + name }")
{:ok, "hi world"} = QuickBEAM.call(rt, "greet", ["world"])
```

## JavaScript trifft OTP

Der interessante Teil ist die Brücke zwischen JavaScript und dem umgebenden BEAM-Ökosystem. Man registriert Elixir-Handler beim Start des Runtime:

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

JavaScript kann auch Nachrichten an beliebige BEAM-Prozesse senden, Prozesse auf Beendigung überwachen und bidirektional verknüpft werden — sodass ein JavaScript-Absturz genau wie jeder andere OTP-Prozess einen Supervisor-Neustart auslösen kann.

## Eingebautes TypeScript-Toolkit

QuickBEAM wird mit einem eingebauten TypeScript-Toolkit ausgeliefert, was bemerkenswert ist, weil es TypeScript zu einem erstklassigen Bürger im BEAM-Ökosystem macht, anstatt es nachzurüsten. Das Projekt zielt auf Zig 0.15+ ab und verteilt über Hex:

```elixir
def deps do
  [{:quickbeam, "~> 0.7.1"}]
end
```

## Supervision-Trees für JavaScript

Der praktische Vorteil davon ist Supervision-Trees, die JavaScript-Komponenten enthalten. Wenn ein JavaScript-Runtime abstürzt, übernimmt OTP's Supervision-Strategie die Wiederherstellung — Prozess neustarten, möglicherweise auf einem anderen BEAM-Knoten in einem verteilten Setup. Für Anwendungen, die BEAM-Zuverlässigkeit brauchen, aber in JavaScript geschriebene Komponenten haben, ist das eine direkte Antwort.

Man kann auch `QuickBEAM.ContextPool` verwenden, um einen Pool von JS-Runtime-Kontexten für hochkonkurrierende Szenarien zu erstellen — mehrere Runtime, die über Anfragen hinweg geteilt werden können.

## Die Nische

QuickBEAM versucht nicht, Node.js oder Deno zu ersetzen. Es ist ein spezialisierter Runtime für Elixir/Erlang-Teams, die bestimmte Komponenten in JavaScript schreiben wollen, ohne das BEAM-Zuverlässigkeitsmodell aufzugeben. Die Integrationsfläche — `Beam.call()`, Prozess-Messaging, Supervision — ist der Punkt, nicht der Runtime selbst.

Für das breitere JavaScript-Ökosystem ist es ein Existenzbeweis, dass BEAMs Nebenläufigkeitsmodell von JavaScript aus zugänglich ist. Ob es eine echte Nutzerbasis findet, hängt davon ab, ob Teams, die hochzuverlässige Systeme in Elixir bauen, genügend Wert darin sehen, bestimmte Komponenten in JavaScript statt in Elixir selbst zu schreiben.

Das Projekt ist in Version 0.7.1 und aktiv in Entwicklung. Wenn Sie Elixir in Produktion betreiben und JavaScript-Code haben, dem Sie mehr vertrauen möchten, lohnt sich ein Blick.
