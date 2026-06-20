---
title: "QuickBEAM: A JavaScript Runtime for the BEAM VM, JavaScript Meets Erlang's OTP"
description: "QuickBEAM is a JavaScript runtime that runs inside the BEAM VM, the same virtual machine powering Erlang and Elixir. It integrates JavaScript into OTP supervision trees, lets JS call Elixir functions and OTP libraries, and ships with a built-in TypeScript toolchain."
image: "/images/heroes/2026-04-11--quickbeam-javascript-runtime-beam-vm-elixir-otp.png"
date: "2026-04-11"
category: Runtimes
author: lschvn
readingTime: 5
tags: ["runtimes", "typescript", "javascript"]
tldr:
  - "QuickBEAM embeds JavaScript runtimes as GenServer processes within BEAM's supervision trees, meaning crash recovery, process linking, and OTP supervisors work transparently with JavaScript code."
  - "JavaScript code running on QuickBEAM can call Elixir functions and access OTP libraries directly via Beam.call(), send messages to any BEAM process, and spawn new JS runtimes as BEAM processes."
  - "QuickBEAM includes a built-in TypeScript toolchain, targeting Zig 0.15+ and distributing via Hex as an Elixir dependency, making it the most integrated path between JavaScript and the BEAM ecosystem."
faq:
  - question: "What is the BEAM VM?"
    answer: "BEAM is the virtual machine that executes Erlang and Elixir code. It's renowned for its fault tolerance, soft real-time scheduling, and ability to run millions of concurrent processes with built-in isolation. It's the engine behind WhatsApp, Discord, RabbitMQ, and many other systems where reliability under load is critical."
  - question: "What problem does QuickBEAM solve?"
    answer: "QuickBEAM lets developers write JavaScript that benefits from BEAM's fault tolerance model, supervision trees, process linking, hot code reloading, without leaving the JavaScript ecosystem. It's a bridge for teams that want BEAM reliability for specific components but have existing JavaScript code or prefer JavaScript for certain workloads."
  - question: "How does JavaScript call Elixir code?"
    answer: "QuickBEAM exposes a Beam.call() API that JavaScript can invoke to reach any registered Elixir handler. Handlers are registered when starting the QuickBEAM runtime, and they can execute arbitrary Elixir code, querying databases, calling OTP libraries, spawning processes. Results are serialized back to JavaScript."
  - question: "What is a GenServer?"
    answer: "A GenServer (Generic Server) is a behaviours module in OTP that implements the client-server pattern. QuickBEAM runtimes are GenServers, they live in supervision trees, can be named, can receive messages, and are managed by OTP's fault tolerance machinery."
---

There's a long-running joke in the Erlang community: "Why do Erlang developers laugh at other languages? Because their processes have supervisors watching them." The BEAM VM's fault-tolerance model, where crashed processes are automatically restarted by supervisors, where errors in one process don't bring down others, where hot code reloading is built into the runtime, is genuinely different from what most developers are used to.

QuickBEAM (at [github.com/elixir-volt/quickbeam](https://github.com/elixir-volt/quickbeam)) puts JavaScript inside that model. It runs JavaScript runtimes as BEAM GenServer processes, integrates them into OTP supervision trees, and lets JavaScript code call Elixir functions and OTP libraries directly.

## What QuickBEAM Actually Is

At its core, QuickBEAM is a BEAM GenServer that wraps a JavaScript runtime (QuickJS-NG, embedded as an Erlang NIF). Each JS runtime is a process in the BEAM VM's scheduler, with all the guarantees that entails. You start a runtime:

```elixir
{:ok, rt} = QuickBEAM.start()
{:ok, 3} = QuickBEAM.eval(rt, "1 + 2")
{:ok, "HELLO"} = QuickBEAM.eval(rt, "'hello'.toUpperCase()")
```

State persists across calls within the same runtime, and you can call named JavaScript functions:

```elixir
QuickBEAM.eval(rt, "function greet(name) { return 'hi ' + name }")
{:ok, "hi world"} = QuickBEAM.call(rt, "greet", ["world"])
```

## JavaScript Meets OTP

The interesting part is the bridge between JavaScript and the surrounding BEAM ecosystem. You register Elixir handlers when starting the runtime:

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

JavaScript can also send messages to any BEAM process, monitor processes for exit, and be linked bidirectionally, so a JavaScript crash can trigger a supervisor restart just like any other OTP process.

## Built-In TypeScript Toolchain

QuickBEAM ships with a built-in TypeScript toolchain, which is notable because it makes TypeScript a first-class citizen in the BEAM ecosystem rather than an afterthought. The project targets Zig 0.15+ and distributes via Hex:

```elixir
def deps do
  [{:quickbeam, "~> 0.7.1"}]
end
```

## Supervision Trees for JavaScript

The practical benefit of all this is supervision trees that include JavaScript components. If a JavaScript runtime crashes, OTP's supervision strategy handles recovery, restart the process, potentially on a different BEAM node in a distributed setup. For applications that need the reliability of BEAM but have components written in JavaScript, this is a direct answer.

You can also use `QuickBEAM.ContextPool` to create a pool of JS runtime contexts for high-concurrency scenarios, multiple runtimes shareable across requests.

## The Niche

QuickBEAM isn't trying to replace [Node.js](/articles/2026-04-12--nodejs-25-stream-iter-async-streams) or [Deno](/articles/2026-04-07--deno-2-7-stabilizes-temporal-api-windows-arm-npm-overrides). It's a specialized runtime for Elixir/Erlang teams that want to write some components in JavaScript without abandoning the BEAM reliability model. The integration surface, `Beam.call()`, process messaging, supervision, is the point, not the runtime itself.

For the broader JavaScript ecosystem, it's an existence proof that BEAM's concurrency model is accessible from JavaScript. Whether it finds a real user base depends on whether teams building high-reliability systems in Elixir see enough value in writing specific components in JavaScript rather than Elixir itself.

The project is at version 0.7.1 and actively developing. If you're running Elixir in production and have JavaScript code you wish you could trust more, it's worth a look.
