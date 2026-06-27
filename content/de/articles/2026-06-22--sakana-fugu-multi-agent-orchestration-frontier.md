---
title: "Sakana Fugu Verpackt Einen Multi-Agent-Orchestrator Hinter Einer Einzelnen API und Behauptet Frontier-Parität Mit Fable und Mythos"
description: "Sakana AI lancierte Fugu am 22. Juni 2026, ein Multi-Agent-Orchestrierungssystem, das als einzelne OpenAI-kompatible API bereitgestellt wird. Zwei Modelle, Fugu und Fugu Ultra, koordinieren einen Pool geschlossener LLMs mittels gelernter Orchestrierung aus zwei ICLR-2026-Papers (TRINITY und Conductor). Fugu Ultra erzielt Benchmark-Werte, die mit Anthropics Fable 5 und Mythos Preview konkurrieren, doch der Launch scharfe Kritik an Kostentransparenz, Closed-Source-Abhängigkeiten und Benchmark-Methodik."
date: 2026-06-22
image: "/images/heroes/2026-06-22--sakana-fugu-multi-agent-orchestration-frontier.png"
author: lschvn
tags: ["ai", "ecosystem"]
tldr:
  - "Sakana AI lancierte Fugu, ein Multi-Agent-Orchestrierungssystem, das als einzelne Modell-API bereitgestellt wird. Fugu wählt dynamisch LLMs aus, delegiert an sie und koordiniert einen Pool (einschließlich rekursiver Selbstaufrufe) mittels gelernter Orchestrierung aus zwei ICLR-2026-Papers: TRINITY (ein ~0,6B evolutionärer Koordinator) und Conductor (ein 7B RL-trainierter Koordinator). Zwei Stufen: Fugu (ausgewogene Latenz) und Fugu Ultra (maximale Qualität bei schwierigen Aufgaben)."
  - "Fugu Ultra erreicht 73,7 auf SWE-bench Pro, 82,1 auf TerminalBench 2,1 und 93,2 auf LiveCodeBench und reiht sich damit neben Opus 4,8 (69,2 / 74,6 / 87,8) und vor GPT 5,5 (58,6 / 78,2 / 85,3) ein. Der Haken: Die Referenzwerte stammen von den Anbietern selbst, der Inhalt des Agent-Pools wird nicht offengelegt, und es werden weder Token-Anzahlen noch Kosten pro Benchmark veröffentlicht."
  - "Der Launch wird als „KI-Souveränität“ gerahmt: eine Absicherung gegen Einzelanbieter-Abhängigkeit nach [den Exportkontrollen von Anthropics Fable und Mythos](/articles/2026-06-13--fable-mythos-export-control-deep-dive). Preise beginnen bei 20$/Monat (Standard), 100$/Monat (Pro), 200$/Monat (Max), zzgl. nutzungsbasiertem Tarif bei 5$/1M Input-Tokens. Nicht in der EU/dem EWR verfügbar (DSGVO ausstehend). Kritiker merken an, dass es sich um einen Closed-Source-Orchestrator auf Closed-Source-Modellen handelt, was das Souveränitätsnarrativ untergräbt."
faq:
  - question: "Was ist Sakana Fugu?"
    answer: "Sakana Fugu ist ein Multi-Agent-Orchestrierungssystem von Sakana AI (Tokio), das sich wie ein einzelnes Modell verhält. Sie rufen einen einzelnen OpenAI-kompatiblen API-Endpunkt auf, und Fugu entscheidet intern, ob es direkt antwortet oder ein Team von Experten-LLMs koordiniert. Fugu ist selbst ein Sprachmodell, das darauf trainiert ist, andere LLMs aufzurufen, einschließlich rekursiver Selbstaufrufe. Zwei Stufen: Fugu (ausgewogene Latenz für den Alltag) und Fugu Ultra (tieferer Agent-Pool für schwierige, mehrstufige Probleme)."
  - question: "Wie schneidet Fugu im Vergleich zu Opus 4,8, GPT 5,5 und Gemini 3,1 Pro ab?"
    answer: "Auf den von Sakana veröffentlichten Benchmarks erreicht Fugu Ultra 73,7 auf SWE-bench Pro (vs. Opus 4,8: 69,2, GPT 5,5: 58,6, Gemini 3,1 Pro: 54,2), 82,1 auf TerminalBench 2,1 (vs. 74,6, 78,2, 70,3) und 93,2 auf LiveCodeBench (vs. 87,8, 85,3, 88,5). Der wichtige Vorbehalt: Alle Referenzwerte stammen von den Modellanbietern selbst, und die Werte von Fugu Ultra beinhalten die Kosten der Orchestrierung mehrerer Modellaufrufe, die Sakana nicht offengelegt."
  - question: "Was sind TRINITY und Conductor?"
    answer: "TRINITY (ICLR 2026, arxiv 2512.04695) ist ein ~0,6B-Parameter-Koordinator, der mit einer evolutionären Strategie (CMA-ES) trainiert wurde, um Thinker-, Worker- oder Verifier-Rollen an LLMs über mehrere Runden zu verteilen. Conductor (ICLR 2026, arxiv 2512.04388) ist ein 7B-Modell, das mit Reinforcement Learning trainiert wurde, um natürlichsprachliche Koordinierungsstrategien zu entdecken und Agent-Kommunikationstopologien sowie fokussierte Prompts zu entwerfen. Beide Papers zeigen, dass gelernte Orchestrierung handentworfene Multi-Agent-Workflows auf Reasoning-Benchmarks übertrifft."
  - question: "Ist Fugu Open Source?"
    answer: "Nein. Fugu ist ein Closed-Source-API-Produkt. Das Orchestrator-Modell, die Zusammensetzung des Agent-Pools und die Koordinierungslogik sind proprietär. Die beiden ICLR-Papers (TRINITY und Conductor) beschreiben die Forschungsgrundlagen, doch das Produktionssystem ist nicht Open-Weights. Der Agent-Pool besteht aus Closed-Source-API-Modellen; Sakana gibt nicht an, welche."
  - question: "Was ist das „KI-Souveränitäts“-Narrativ?"
    answer: "Sakana positioniert Fugu als Absicherung gegen Einzelanbieter-Abhängigkeit und verweist auf die jüngsten Exportkontrollen von Anthropic für Fable und Mythos. Das Argument: Wenn ein Anbieter den Zugang einschränkt, leitet Fugu die Störung dynamisch um, indem es Agenten in seinem Pool austauscht. Kritiker merken an, dass Fugu selbst ein Closed-Source-System ist, das zu Closed-Source-Modellen routet, sodass sich die Souveränitätsbehauptung auf Orchestrierungsflexibilität erstreckt, nicht auf Unabhängigkeit von Closed-Source-KI."
  - question: "Wie viel kostet Fugu?"
    answer: "Abonnement-Stufen: Standard (20$/Monat), Pro (100$/Monat), Max (200$/Monat). Alle Stufen enthalten sowohl Fugu als auch Fugu Ultra. Nutzungsbasiert: 5$/1M Input-Tokens, 30$/1M Output-Tokens, 0,50$/1M gecachte Eingabe. Bei Kontexten über 272K Tokens verdoppeln sich die Sätze (10$/1M Input, 45$/1M Output, 1,00$/1M Cache). Sakana meldet die Token-Nutzung pro Anfrage zur Kostenverfolgung. Die fehlende Zahl: Wie viele Tokens eine Benchmark-Aufgabe tatsächlich über die Orchestrierungsschicht verbraucht."
  - question: "Was sind die Hauptkritikpunkte am Fugu-Launch?"
    answer: "ML-Ingenieur Elie Bakouch (@eliebakouch) identifiziert mehrere: (1) Fugu ist ein Closed-Source-Orchestrator auf Closed-Source-Modellen, was dem „Souveränitäts“-Narrativ widerspricht. (2) Fugu (nicht Ultra) ist im Wesentlichen ein Router, der das beste Modell pro Runde auswählt und 10 Punkte unter Opus auf SWE-bench Pro liegt. (3) Fugu Ultra plant Workflows im Voraus bei t=0, anstatt sich an jedem Schritt anzupassen, was es auf 5-Schritt-Pläne beschränkt. (4) Sakana meldet nie Output-Token-Anzahlen oder Kosten pro Benchmark. (5) Der AutoResearch-Vergleich verwendet anonymisierte „Modell A/B/C“-Referenzen, ohne die Modelle zu nennen."
  - question: "Ist Fugu in der EU verfügbar?"
    answer: "Noch nicht. Die Produktseite besagt: „Noch nicht in der EU/im EWR verfügbar, während wir an der Einhaltung der DSGVO und EU-spezifischer Vorschriften arbeiten.“ Kein Zeitplan wird genannt."
---

[Sakana AI](https://sakana.ai/) lancierte [Sakana Fugu](https://sakana.ai/fugu) am 22. Juni 2026, ein Multi-Agent-Orchestrierungssystem, das als einzelne OpenAI-kompatible Modell-API bereitgestellt wird. Das Produkt bietet zwei Stufen: Fugu, ausgewogen für Latenz und Alltagsgebrauch, und Fugu Ultra, optimiert für maximale Qualität bei schwierigen mehrstufigen Aufgaben. Die Kernbehauptung: Fugu Ultra erreicht die Leistung von Anthropics Fable 5 und Mythos Preview in Coding-, Reasoning- und Wissenschafts-Benchmarks, ohne das Exportkontroll-Risiko.

Der Launch-Tweet von [hardmaru (David Ha)](https://x.com/hardmaru/status/2068884466056225025), Sakana AIs Mitbegründer, rahmt das Produkt als philosophische Wette: „Menschliche Intelligenz ist grundlegend eine kollektive Intelligenz. Wir lösen komplexe Probleme, indem wir an einem riesigen kulturellen Netzwerk teilnehmen, das auf Ideen über Generationen hinweg aufbaut. Ich glaube, dass die stärksten KI-Systeme ebenfalls eine kollektive Intelligenz werden." Der Post hat 1.056 Likes und 131 Retweets zum Zeitpunkt der Erstellung. Der [Ankündigungs-Tweet](https://x.com/SakanaAILabs/status/2068861630327443966) des offiziellen Kontos hat über 9.000 Likes und 3,7M Aufrufe.

## Das Framing: „Orchestrierungsmodelle sind die nächste Grenze"

Sakanas Pitch ist nicht „wir haben ein größeres Modell gebaut". Es ist „wir haben ein Modell gebaut, das andere Modelle kommandiert." Der Release-Blog nennt dies ein „Orchestrierungsmodell" und positioniert es jenseits des Paradigmas der Brute-Force-Skalierung. Fugu ist selbst ein Sprachmodell, trainiert zu entscheiden, wann delegiert werden soll, welche Agenten zusammenzustellen sind, wie sie kommunizieren sollen und wie ihre Ausgaben zu einer einzigen Antwort synthetisiert werden sollen.

Der geopolitische Winkel ist bewusst gewählt. Der Blog zitiert [Anthropics jüngste Exportkontrollen für Fable und Mythos](https://sakana.ai/fugu-release) als auslösendes Ereignis: „Der Zugang zu Spitzenmodellen kann über Nacht verschwinden." Fugus Pitch: Wenn ein Anbieter den Zugang einschränkt, leitet das System die Störung um, indem es Agenten in seinem Pool austauscht. hardmaru nennt dies „die belastbare Blaupause, die für KI-Souveränität erforderlich ist."

Die Framing-Korrektur: Es handelt sich um Souveränität über die Orchestrierung, nicht um Souveränität über die Modelle selbst. Fugus Agent-Pool besteht aus Closed-Source-API-Modellen, die Sakana nicht benennt. Wenn die zugrunde liegenden Anbieter den Zugang einschränken, kann Fugu austauschen, es hängt jedoch weiterhin davon ab, dass externe Closed-Source-Modelle verfügbar sind. Die Souveränitätsbehauptung ist auf Routing-Ebene real, erstreckt sich aber nicht auf Modell-Unabhängigkeit.

## Die Architektur: TRINITY und Conductor

Fugus Orchestrierung basiert auf zwei ICLR-2026-Papers:

**TRINITY** ([arxiv 2512.04695](https://arxiv.org/abs/2512.04695)) führt einen leichtgewichtigen Koordinator (~0,6B Parameter plus einen ~10K-Parameter-Kopf) ein, der mit einer evolutionären Strategie (CMA-ES, Covariance Matrix Adaptation Evolution Strategy) optimiert wird. Der Koordinator verarbeitet Anfragen über mehrere Runden und weist in jeder Runde eine von drei Rollen zu: Thinker (Reasoning), Worker (Ausführung) oder Verifier (Überprüfung). Die Kernidee: Unter hoher Dimensionalität und strikten Budgetbeschränkungen übertrifft CMA-ES Reinforcement Learning, Imitationslernen und Zufallssuche durch Ausnutzung von Block-Epsilon-Separabilität im Parameterraum. Das Paper berichtet 86,2% auf LiveCodeBench und übertrifft damit individuelle Frontier-Modelle.

**Conductor** ([arxiv 2512.04388](https://arxiv.org/abs/2512.04388)) ist ein 7B-Modell, das mit Reinforcement Learning trainiert wurde, um natürlichsprachliche Koordinierungsstrategien zu entdecken. Wo TRINITY feste Rollen zuweist, lernt Conductor, Agent-Kommunikationstopologien und fokussierte Prompts zu entwerfen. Das Modell wird mit randomisierten Agent-Pools trainiert und generalisiert daher zur Inferenzzeit auf beliebige Sets von Open- und Closed-Source-Agenten. Dem Conductor zu erlauben, sich selbst als Worker auszuwählen, erzeugt rekursive Topologien, eine Form dynamischer Testzeit-Skalierung durch online-iterative Anpassung.

Zusammen bilden diese beiden Papers die Forschungsgrundlage. Fugu das Produkt verpackt sie in ein System, in dem der Benutzer einen einzelnen Endpunkt aufruft und die Orchestrierung intern stattfindet.

## Zwei Modelle, eine API

Fugu wird als zwei Modelle ausgeliefert, beide über eine einzelne OpenAI-kompatible API erreichbar:

**Fugu** (das Basismodell) balanciert Leistung und Latenz. Es ist für die tägliche Arbeit konzipiert: Coding-Unterstützung, Code-Review, Chatbot-Dienste. Sakana positioniert es als Drop-in-Ersatz für Einzelmodell-Endpunkte in Tools wie Codex. Teams mit Compliance-Anforderungen können bestimmte Agenten aus dem Pool ausschließen.

**Fugu Ultra** koordiniert einen tieferen Pool von Expertenagenten für maximale Antwortqualität. Frühe Nutzer berichten über den Einsatz bei Kaggle-Wettbewerben, Paper-Reproduktion, Cybersicherheitsanalyse und Patent-Untersuchungen. Der Hauptunterschied: Fugu Ultra kann mehrstufige Workflows zusammenstellen, in denen verschiedene spezialisierte Modelle Planung, Ausführung und Überprüfung übernehmen.

Die Integration ist unkompliziert. Kein Multi-Agent-Framework-Setup, keine Agent-Definitionen, keine Workflow-Konfiguration. Sie senden eine Anfrage an einen einzelnen Endpunkt und das System erledigt den Rest.

## Die Benchmark-Tabelle

Hier sind die von Sakana veröffentlichten Zahlen, originalgetreu wiedergegeben:

| Benchmark | Fugu | Fugu Ultra | Opus 4,8 † | Gemini 3,1 Pro † | GPT 5,5 † |
|---|---|---|---|---|---|
| SWE-bench Pro * | 59,0 | **73,7** | 69,2 | 54,2 | 58,6 |
| TerminalBench 2,1 | 80,2 | **82,1** | 74,6 | 70,3 | 78,2 |
| LiveCodeBench | 92,9 | **93,2** | 87,8 | 88,5 | 85,3 |
| LiveCodeBench Pro | 87,8 | **90,8** | 84,8 | 82,9 | 88,4 |
| Humanity's Last Exam | 47,2 | **50,0** | 49,8 | 44,4 | 41,4 |
| CharXiv Reasoning | 85,1 | **86,6** | 84,2 | 83,3 | 84,1 |
| GPQA-D | 95,5 | 95,5 | 92,0 | 94,3 | 93,6 |
| SciCode | 60,1 | 58,7 | 53,5 | 58,9 | 56,1 |
| τ³ Banking | 21,7 | 20,6 | 20,6 | 8,4 | 20,6 |
| Long Context Reasoning | 74,7 | 73,3 | 67,7 | 72,7 | 74,3 |
| MRCRv2 | 86,6 | **93,6** | 87,9 | 84,9 | 94,8 |

*\* Verwendet mini-swe-agent als Scaffolding.*
*† Von den Anbietern gemeldete Werte.*

Die Fußnoten sind entscheidend. Alle Referenzwerte stammen von den Modellanbietern selbst, nicht von unabhängiger Reproduktion. Fugus Werte sind Sakanas eigene Messungen. Der Vergleich ist asymmetrisch: Fugu Ultra läuft über eine Orchestrierungsschicht, die mehrere Modellaufrufe pro Aufgabe erzeugt, während die Referenzen Einzelmodell-Bewertungen sind. Sakana meldet nicht, wie viele Tokens Fugu Ultra pro Benchmark-Aufgabe verbraucht, wie die Kosten pro Aufgabe sind oder wie viele Agentenrunden jedes Problem benötigt.

Auf SWE-bench Pro schlagen Fugu Ultras 73,7 Opus 4,8s 69,2 um 4,5 Punkte. Auf TerminalBench 2,1 beträgt die Lücke 7,5 Punkte (82,1 vs. 74,6). Auf LiveCodeBench sind es 5,4 Punkte (93,2 vs. 87,8). Dies sind reale Abstände, doch der Kosten-Vergleich fehlt. Wie ML-Ingenieur [Elie Bakouch](https://x.com/eliebakouch/status/2068939729811468503) anmerkt: „Sie führen eine „Testzeit-Skalierungs"-Methode mit „Best of N" über Modelle ein, und sie melden LITERAL NIE die Anzahl der Output-Tokens oder die Kosten, um einen Benchmark/eine Aufgabe zu erreichen."

## Die qualitativen Demos

Jenseits der Benchmarks präsentiert Sakana sechs Demoszenarien, in denen Fugu Ultra Frontier-Referenzmodelle übertrifft:

1. **AutoResearch** (Karpathy et al. Framework): Ein KI-Agent verbesserte autonom das Training-Rezept eines kleinen GPT über 123 Experimente auf einem einzelnen H100-GPU in ~14 Stunden. Fugu Ultra erreichte einen mittleren BPB von 0,9774 ± 0,0019, vor drei anonymisierten Frontier-Referenzen („Modell A/B/C"). Sakana benennt nicht, welche Modelle A, B und C sind.

2. **Kana-Leseordnung**: Klassische japanische Handschriftenanalyse auf einem Brief von 1610. Fugu Ultra erreichte 0,80 NED (Normalisierte Editierdistanz) vs. Modell A mit 0,24.

3. **Rubik's Cube Solver-Generierung**: Code-Generierung für ein physisches Puzzles.

4. **CAD mechanische Iris**: Mechanisches Design.

5. **Blindschach**: One-Shot-Schachpartie-Generierung.

6. **Zeitreihen-Trading**: Finanzprognose.

Die Demos sind visuell überzeugend (Video-Walkthroughs sind auf der Produktseite eingebettet), doch die anonymisierten Referenzen machen unabhängige Überprüfung unmöglich. Das AutoResearch-Experiment ist besonders interessant, weil es nachhaltige mehrstufige agentische Arbeit testet, was Fugus Ultra entworfener Sweet Spot ist.

## Preise und Bereitstellung

Sakana bietet sowohl Abonnement- als auch nutzungsbasierte Preise:

**Abonnement-Stufen** (alle enthalten Fugu und Fugu Ultra):
- Standard: 20$/Monat
- Pro: 100$/Monat
- Max: 200$/Monat

**Nutzungsbasiert** (pro 1M Tokens):
- Input: 5$
- Output: 30$
- Gecachter Input: 0,50$
- Über 272K Kontext-Tokens: 10$ Input, 45$ Output, 1,00$ Cache

Sakana meldet die Token-Nutzung pro Anfrage, damit Nutzer Ausgaben in Echtzeit verfolgen können. Die API ist OpenAI-kompatibel, sodass die Integration nur eine Änderung einer Endpoint-URL und eines Modellnamens erfordert.

**Nicht in der EU/dem EWR verfügbar.** Die Produktseite besagt, dass die DSGVO- und EU-Vorschriften-Konformität in Arbeit ist. Kein Zeitplan.

Die fehlende Kostenzahl: Wie viele Tokens eine typische Fugu-Ultra-Aufgabe verbraucht. Wenn Fugu Ultra 5 Agentenaufrufe pro Problem erzeugt (die von Bakouch identifizierte Grenze) und jeder Aufruf ein Frontier-Modell nutzt, sind die effektiven Kosten pro Aufgabe 5x der Token-Tarif. Für SWE-bench Pro, wo Fugu Ultra über mini-swe-agent-Scaffolding läuft, ist die Gesamt-Token-Anzahl pro Problem unbekannt.

## Die kritische Perspektive

Die detaillierteste öffentliche Kritik kommt von [Elie Bakouch](https://x.com/eliebakouch/status/2068939729811468503), einem ML-Ingenieur, der den Technischen Bericht gelesen hat. Seine Analyse:

1. **Fugu (nicht Ultra) ist ein Router.** Er wählt das Modell aus, das am wahrscheinlichsten korrekt antwortet. Dies ist ein Klassifikator, kein Orchestrator. Er liegt 10 Punkte unter Opus auf SWE-bench Pro (59,0 vs. 69,2).

2. **Fugu Ultra ist „erweiterter Planmodus".** Er gibt bei t=0 einen Plan mit mehreren Workflows aus, bevor die Agenten zu arbeiten beginnen. Bakouch argumentiert, dies sei die falsche Architektur: „Man muss vorhersagen, was man bei t+1 spawnen soll, mit den Informationen, die man bei t erhält, nicht mit den Informationen von t=0." Das System ist auf 5-Schritt-Pläne beschränkt.

3. **Closed Source auf Closed Source.** „Wenn man vorher die Modelle nicht kontrolliert hat, kontrolliert man jetzt nicht einmal, welche verwendet werden oder wie viele."

4. **Keine Kostentransparenz.** Das größte Problem: eine Testzeit-Skalierungsmethode mit Best-of-N über Modelle einführen, dabei nie Output-Token-Anzahlen oder Kosten pro Benchmark melden.

5. **Anonymisierte Referenzen.** Der AutoResearch-Vergleich verwendet „Modell A, B und C" ohne Namensnennung. „Es ist wirklich verrückt, nicht transparent darüber zu sein, mit welchen Modellen man sich vergleicht."

6. **Falscher Vergleichsrahmen.** Der faire Vergleich ist nicht Fugu Ultra vs. rohes Opus, sondern Fugu Ultra vs. Opus mit ultracode/workflows aktiviert. Ebenso sollte der Vergleich gegen Kimi Swarm sein, nicht gegen rohes Kimi.

Die Kritik ist substanziell. Das Souveränitätsnarrativ ist auf geopolitischer Ebene überzeugend, auf technischer Ebene jedoch dünn: Fugu hängt von denselben Closed-Source-Anbietern ab, gegen die es sich angeblich absichert. Die Benchmark-Zahlen sind real, aber ohne Kostendaten nicht vergleichbar. Die Architektur ist neuartig (gelernte Orchestrierung schlägt handentworfene Workflows), doch die Einschränkungen des Produktionssystems (geschlossener Pool, 5-Schritt-Grenze, keine Anpassung während der Ausführung) verengen seinen Vorteil.

## Was zu beobachten ist

1. **Unabhängige Benchmark-Reproduktion.** Das wichtigste Signal. Können Dritte Fugu Ultras SWE-bench Pro- und TerminalBench-Werte mit der öffentlichen API reproduzieren? Das mini-swe-agent-Scaffolding ist Open Source; jeder kann die Evaluation durchführen.

2. **Token-Anzahl-Offenlegung.** Wird Sakana die Token-Anzahlen pro Aufgabe für Benchmark-Probleme veröffentlichen? Ohne dies sind Effizienzbehauptungen nicht überprüfbar.

3. **Agent-Pool-Transparenz.** Welche Modelle sind im Pool? Sakana sagt „Closed-Source-API-Modelle", benennt sie aber nicht. Wenn der Pool GPT 5,5 + Opus 4,8 + Gemini 3,1 Pro ist, handelt die Orchestrierungsgeschichte vom Routing, nicht vom Aufbau von Frontier-Fähigkeiten.

4. **EU/EWR-Verfügbarkeit.** DSGVO-Konformität ist der Blocker. Auf Sakanas DPA (Data Processing Agreement) und EU-Datenspeicher-Verpflichtungen achten.

5. **Open-Weights-Modelle im Pool.** Sakana plant, Open-Modelle und eigene Modelle hinzuzufügen. Wenn Fugus Pool Llama 4, Qwen 3,7 oder Sakanas eigene trainierte Modelle enthält, stärkt sich die Souveränitätsgeschichte materiell.

6. **Rekursive Selbst-Orchestrierungstiefe.** Das Conductor-Paper zeigt rekursive Topologien (der Orchestrator ruft sich selbst auf). Wie tief geht dies in der Produktion? Rekursive Orchestrierung ist die neuartigste technische Behauptung und die schwerste von außen zu verifizierende.

7. **Community-Adoption.** 500 Beta-Nutzer sind ein signifikantes Signal. Auf Kaggle-Wettbewerbsergebnisse, Cybersicherheits-Audit-Berichte und Code-Review-Qualitätsvergleiche mit der öffentlichen API achten.

## Das Fazit

Sakana Fugu ist das erste Produktionssystem, das gelernte Multi-Agent-Orchestrierung als einzelnen API-Endpunkt verpackt. Die Forschungsgrundlage (TRINITY + Conductor, beide ICLR 2026) ist solide, und die Benchmark-Zahlen sind wettbewerbsfähig mit der aktuellen Frontier. Das „Orchestrierungsmodell"-Framing ist die richtige Langzeit-Wette: Während Modelle proliferieren, wird die Koordinationsschicht zum Differenzierer.

Die Schwäche des Launches ist Transparenz. Keine Kosten pro Benchmark, keine Agent-Pool-Offenlegung, keine unabhängige Reproduktion, anonymisierte Referenzen in Demos. Das Souveränitätsnarrativ ist emotional resonant, aber technisch unvollständig: Fugu umgeht Anbieterbeschränkungen auf der Orchestrierungsebene und hängt dabei von denselben Anbietern auf der Modellebene ab. Für Entwickler, die Fugu evaluieren, ist die praktische Frage nicht „Schlägt es Opus?", sondern „Schlägt es Opus zu denselben oder niedrigeren Kosten?" Diese Frage bleibt unbeantwortet.
