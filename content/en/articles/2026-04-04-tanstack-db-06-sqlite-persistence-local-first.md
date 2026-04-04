---
title: "TanStack DB 0.6 Turns Your Client Into a Local-First Database"
description: "SQLite persistence across every runtime, hierarchical data projections, and reactive agent workflows — v0.6 is the release that makes TanStack DB feel like a complete application data layer."
date: "2026-04-04"
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop"
author: lschvn
tags: ["typescript", "database", "local-first", "sqlite", "tanstack"]
---

TanStack DB, the client-side transactional database from the team behind React Query and Router, shipped version 0.6 last week. The headline features — SQLite-backed persistence, hierarchical data projections, and reactive agent workflows — aren't incremental additions. They're the missing pieces that make the whole system practical for real applications.

## The missing piece: persistence

TanStack DB has always had a sophisticated query engine, fine-grained reactivity, optimistic updates, and an offline transaction API. What it lacked was durability — the ability to keep data around after the app closed.

That changes in 0.6. The persistence layer is SQLite-backed and works across a wide range of runtimes: browser (via SQLite WASM), React Native, Expo, Node, Electron, Tauri, Capacitor, and Cloudflare Durable Objects.

The key design decision is pragmatic: instead of inventing a new storage abstraction, SQLite acts as the persistence backend. This means TanStack DB gets large dataset handling, multi-tab support, schema evolution, and cross-runtime compatibility for free. Once local state is durable, the full stack — query engine, optimistic updates, offline transactions — can function as a fully local-first system rather than something that only feels local while the app is open.

PowerSync and Trailbase already support incremental sync with this new persistence layer, building on the Query Collections sync model introduced in v0.5.

## Includes: hierarchical data without GraphQL

The `includes` feature solves a problem that comes up constantly in UI development: your data is normalized in the database, but your UI components expect a nested shape.

The classic solution is GraphQL, which handles this with resolvers and a separate infrastructure layer. TanStack DB's `includes` projects normalized data into the hierarchical structure your UI needs — same result, no new backend required.

## createEffect: reactive side effects for agents

A new `createEffect` function lets you trigger reactive side effects directly from live queries. This is aimed squarely at agent-style automation and reactive workflows where you need to respond to data changes programmatically, not just render them.

Virtual props (`$synced`, `$origin`) complement this by tracking row-level metadata — outbox views, sync status, and data provenance become first-class query concerns.

## queryOnce and other ergonomics

`queryOnce` provides one-shot queries using the same query language as live queries. Previously, the two models diverged; now they're unified.

Indexes are now opt-in, and mutation handlers no longer rely on implicit return behavior. Both are breaking changes if you're upgrading, but they make the API more predictable.

## Toward v1

The team is calling for SSR (server-side rendering) design partners as they work toward v1. If you've been watching TanStack DB and waiting for it to feel production-ready, this release is the strongest signal yet that the pieces are coming together.

tldr[]
- TanStack DB 0.6 adds SQLite-backed persistence across browser, React Native, Node, Electron, Tauri, and more — making local-first apps actually durable
- New `includes` API projects normalized data into hierarchical UI shapes without requiring a GraphQL layer
- `createEffect` and virtual props (`$synced`, `$origin`) enable reactive agent workflows and outbox-style sync UI patterns

faq[]
- **Is this production-ready?** It's still pre-v1, but the feature set and the backing by TanStack (React Query's maintainers) make it worth evaluating for non-critical apps now.
- **How does it compare to Dexie.js or WatermelonDB?** TanStack DB is query-engine-first with fine-grained reactivity and a sync model built in; Dexie is more oriented toward IndexedDB ergonomics and WatermelonDB is more ORM-flavored.
- **Does this work with SSR?** The team is actively working on SSR support and is looking for design partners.
