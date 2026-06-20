---
title: "pnpm 11.8 Ships `install --dry-run`, Node.js Package Maps, and Per-Package SBOM"
description: "pnpm 11.8.0 (June 18, 2026) adds a long-requested `--dry-run` for `pnpm install`, experimental Node.js package maps at `node_modules/.package-map.json`, CycloneDX devDependencies scope and per-package SBOM generation, and a macOS Gatekeeper fix that strips quarantine from native binaries. It also closes a configDependencies path-traversal advisory (GHSA-qrv3-253h-g69c) three days after the 11.7 lockfile hardening."
date: 2026-06-19
image: "/images/heroes/2026-06-19--pnpm-11-8-dry-run-install-node-package-map-sbom.png"
author: lschvn
tags: ["tooling", "security", "ecosystem"]
tldr:
  - "pnpm 11.8.0 (June 18, 2026) adds `pnpm install --dry-run`, which runs a full dependency resolution and reports what an install would change but writes nothing to disk, no lockfile, no `node_modules`, and always exits 0. It mirrors `npm install --dry-run` and closes [issue #7340](https://github.com/pnpm/pnpm/issues/7340), open since 2022."
  - "Two SBOM improvements land for supply-chain compliance: `pnpm sbom` now marks devDependencies-only components with CycloneDX `scope: \"excluded\"` plus the `cdx:npm:package:development` property, and `--out`/`--split` emit one CycloneDX document per workspace package with `workspace:` inter-dependencies resolved. A new `node_modules/.package-map.json` feeds Node's experimental package-resolution work behind `node-experimental-package-map`."
  - "The release also fixes a configDependencies path-traversal (GHSA-qrv3-253h-g69c) where a committed lockfile with a traversal-shaped name or version could write files outside `node_modules/.pnpm-config`, and strips macOS Gatekeeper quarantine from native binaries after store import."
faq:
  - question: "What is new in pnpm 11.8?"
    answer: "pnpm 11.8.0 (June 18, 2026) ships `pnpm install --dry-run` for previewing installs without writing to disk, experimental Node.js package maps at `node_modules/.package-map.json`, CycloneDX `scope: \"excluded\"` for devDependencies in `pnpm sbom`, per-package SBOM generation via `--out` and `--split`, a macOS Gatekeeper fix that strips quarantine from native binaries, and a security fix for configDependencies path traversal (GHSA-qrv3-253h-g69c). It requires Node.js 22.13 or later."
  - question: "How does `pnpm install --dry-run` work?"
    answer: "It runs a full dependency resolution and prints what an install would add, remove, or change, but writes nothing to disk: no `pnpm-lock.yaml`, no `node_modules`. It always exits with code 0, matching the preview semantics of `npm install --dry-run`. It is useful for validating a manifest change or a branch's dependency diff in CI without mutating the working tree."
  - question: "What is the pnpm configDependencies path-traversal vulnerability?"
    answer: "GHSA-qrv3-253h-g69c: before 11.8, a committed lockfile whose `configDependencies` carried a traversal-shaped name (such as `../../PWNED`) or version could cause `pnpm install` to create symlinks or write package files outside `node_modules/.pnpm-config` and the store. The fix validates that names are valid npm package names and versions are exact semver before they are used to build filesystem paths, and applies the same check to optional subdependencies of config dependencies and to the legacy workspace-manifest format."
  - question: "What are Node.js package maps in pnpm 11.8?"
    answer: "pnpm 11.8 can generate a `node_modules/.package-map.json` file during isolated and hoisted installs. Two settings control it: `node-experimental-package-map` injects the generated map into pnpm-managed Node.js script environments, and `node-package-map-type` chooses between `standard` and `loose` map formats. The map feeds Node's ongoing work on faster, more predictable package resolution."
  - question: "Does pnpm 11.8 break my existing project?"
    answer: "No. The lockfile format is unchanged. `--dry-run`, the package-map settings, and the SBOM flags are opt-in. The configDependencies validation only rejects names and versions that should never have been valid. The one behavior change most teams will notice is that `pnpm run --no-bail` now exits non-zero when any script fails, which makes non-recursive runs consistent with recursive runs that already behaved that way."
  - question: "What does the macOS Gatekeeper fix do?"
    answer: "When pnpm imports native binaries (`.node`, `.dylib`, `.so`) from its content-addressable store into `node_modules`, macOS preserves extended attributes including `com.apple.quarantine`. If the xattr was present on a store blob, it propagated to `node_modules` and Gatekeeper blocked the binary from loading. pnpm 11.8 now strips `com.apple.quarantine` from native binaries after import, matching Homebrew's behavior, in a single batched `xattr` call per package."
---

[pnpm 11.8.0](https://github.com/pnpm/pnpm/releases/tag/v11.8.0) shipped on June 18, 2026, three days after [11.7.0](https://github.com/pnpm/pnpm/releases/tag/v11.7.0), the release that added `--frozen-store`, pacquet resolution delegation, and a [lockfile path-traversal fix](/articles/2026-06-17--pnpm-11-7-frozen-store-publish-batch). Where 11.7 was about reproducible and read-only installs, 11.8 is about observability and supply-chain reporting: a dry-run mode that finally mirrors npm, a Node.js package-map format that feeds the runtime's resolution experiments, and two CycloneDX SBOM improvements that make `pnpm sbom` usable for real compliance workflows. There is also a second path-traversal advisory, this time in `configDependencies`, and a macOS Gatekeeper fix that has been annoying native-module users for a while.

## `pnpm install --dry-run`: the feature npm had and pnpm did not

The headline addition is `--dry-run` for `pnpm install`. It runs a full dependency resolution against the current manifests and prints what an install would add, remove, or change, then writes nothing: no `pnpm-lock.yaml`, no `node_modules`, no store mutation. It always exits with code 0, which matches the preview semantics of [`npm install --dry-run`](https://docs.npmjs.com/cli/v10/commands/npm-install#dry-run) and closes [issue #7340](https://github.com/pnpm/pnpm/issues/7340), which had been open since 2022.

The practical use is CI and code review: a PR that bumps a dependency or switches a catalog entry can run `pnpm install --dry-run` to surface the full transitive diff, including peer warnings and build-script approvals, without touching the working tree. Because pnpm's resolution is already fast, the cost is one resolution pass with no filesystem write. The exit code is deliberately always 0 so the flag can sit inside an existing install step without flipping a pipeline red on a benign diff.

## Node.js package maps at `node_modules/.package-map.json`

11.8 can now generate a `node_modules/.package-map.json` during isolated (the default) and hoisted installs. Two settings control the behavior:

- `node-experimental-package-map`: when enabled, pnpm injects the generated map into the Node.js script environments it manages, so the runtime can consult a precomputed package layout instead of walking `node_modules` at startup.
- `node-package-map-type`: selects between a `standard` map and a `loose` map, trading strictness for compatibility.

This is early-stage plumbing for Node's broader [package-resolution reform](https://github.com/nodejs/node/pulls?q=package+map), where a declarative map file can replace the implicit, filesystem-driven resolution that every package manager currently has to work around. pnpm generating the map means projects that opt in get a consistent layout description whether they use the isolated or hoisted linker. The setting name (`node-experimental-package-map`) signals that the format is not stable yet.

## SBOM: devDependencies scope and per-package generation

The two SBOM changes in 11.8 target the gap between a dependency tree and what a CycloneDX consumer can actually reason about.

First, `pnpm sbom` now marks components reachable only through `devDependencies` with CycloneDX `scope: "excluded"` plus the `cdx:npm:package:development` property. The `excluded` scope is the CycloneDX way of documenting "component usage for test and other non-runtime purposes", which is exactly what a devDependency is. The property mirrors the marker that [`@cyclonedx/cyclonedx-npm`](https://www.npmjs.com/package/@cyclonedx/cyclonedx-npm) emits, so both modern (scope-based) and existing (property-based) consumers pick it up. Components reachable at runtime, including installed `optionalDependencies`, omit `scope` and default to `required`.

Second, per-package SBOM generation lands via two flags:

- `--out out/%s.cdx.json` writes one CycloneDX document per workspace package to individual files.
- `--split` emits NDJSON to stdout, one package per line.

When `--filter` selects a single package, the SBOM root component now uses that package's metadata. Workspace inter-dependencies declared through the `workspace:` protocol, along with their transitive dependencies, are included so a per-package SBOM is self-contained. Author, repository, and license fall back to the root manifest when the package does not define them. For a monorepo that needs to ship an SBOM per published library, this is the difference between post-processing one giant document and getting per-package artifacts directly from the install tool.

## configDependencies path traversal (GHSA-qrv3-253h-g69c)

11.8 closes a second path-traversal advisory, distinct from the [lockfile alias fix in 11.7](/articles/2026-06-17--pnpm-11-7-frozen-store-publish-batch) and the [esbuild 0.28.1 Windows traversal](/articles/2026-06-14--esbuild-0-28-1-deno-rce-windows-path-traversal) that surfaced in a different tool. Before 11.8, a committed lockfile whose `configDependencies` carried a traversal-shaped name (such as `../../PWNED`) or version (such as `../../../PWNED`) could cause `pnpm install` to create symlinks or write package files outside `node_modules/.pnpm-config` and the store.

The fix validates `configDependencies` names and versions before they are used to build filesystem paths. Names must now be valid npm package names and versions must be exact semver strings. The same validation runs on optional subdependencies of config dependencies and on the legacy workspace-manifest format, before any lockfile is written. Like the 11.7 lockfile gate, this is defense in depth: a project that already trusts its lockfile source still benefits, because the check protects against partial corruption and against bugs in the lockfile generator itself. See [GHSA-qrv3-253h-g69c](https://github.com/pnpm/pnpm/security/advisories/GHSA-qrv3-253h-g69c).

## macOS Gatekeeper stops blocking native binaries

A quieter but widely felt fix: when pnpm imports files from its content-addressable store into `node_modules`, macOS preserves extended attributes, including `com.apple.quarantine`. If that xattr was present on a store blob (for example, it was first written under a Gatekeeper-enabled app such as a Git client), it propagated to `node_modules`, and Gatekeeper blocked the native binary from loading even though pnpm had already verified the file's integrity against the lockfile.

After importing a package, 11.8 now strips `com.apple.quarantine` from native binaries (`.node`, `.dylib`, `.so`), matching [Homebrew's behaviour](https://docs.brew.sh/FAQ#why-cant-i-open-a-mac-app-from-an-unidentified-developer) of dropping quarantine from verified downloads. The cleanup is macOS-only, runs in a single batched `xattr` call per package, is restricted to native binaries so other files are untouched, and is non-fatal. It fixes [#11056](https://github.com/pnpm/pnpm/issues/11056).

## Other fixes worth knowing

`pnpm run --no-bail` now exits with a non-zero code when any executed script fails, while still running every matched script to completion. This closes [issue #8013](https://github.com/pnpm/pnpm/issues/8013): non-recursive `--no-bail` runs previously always exited 0 even on failure, which was inconsistent with recursive runs that already failed at the end.

`pnpm view` without a package name now searches upward for the nearest project manifest (`package.json`, `package.yaml`, or `package.json5`) and uses its `name` field, replacing the `find-up` dependency with the faster [`empathic`](https://www.npmjs.com/package/empathic) module. Several lockfile-correctness bugs land too: incremental installs no longer keep duplicate transitive dependencies that a fresh install would not produce ([#5108](https://github.com/pnpm/pnpm/issues/5108)), `optimisticRepeatInstall` no longer reports "Already up to date" when only the lockfile changed ([#12100](https://github.com/pnpm/pnpm/issues/12100)), and catalog overrides that resolve through a catalog stay in sync with the catalog during `pnpm update`. `pnpm version --recursive` now honors the workspace filter instead of bumping every package ([#11348](https://github.com/pnpm/pnpm/issues/11348)). Reporter output for `pnpm store` and `pnpm config` now goes to stderr, so scripts like `PNPM_STORE=$(pnpm store path)` stop capturing warnings in their result.

## Upgrade

pnpm 11.8.0 requires Node.js 22.13 or later, the same baseline as 11.7. The lockfile format is unchanged, so an `npm install -g pnpm@latest` (or `corepack prepare pnpm@latest --activate`) and a `pnpm install` is the full upgrade path. The new flags are all opt-in, and the configDependencies validation only rejects inputs that were never valid package names.
