---
title: "Prettier 3.9 Overhauls Five Parsers: micromark for Markdown, yaml v2, GraphQL.js v17, a Rust-Based Flow Parser, and Angular"
description: "Prettier 3.9.0, released June 27, 2026 (prettier/prettier, blog post by Fisker Cheung), is a parser-heavy release that upgrades Markdown from remark-parse v8 to micromark v4 (better CommonMark and GFM compliance and a stack of long-standing bug fixes), YAML to yaml v2, GraphQL to GraphQL.js v17 (fragment arguments and directives on directive definitions), Flow to the Flow team's new Rust-based oxidized parser (roughly 37% faster on Prettier's valid Flow fixtures and 43% faster on flow_parser.js in local parser-only benchmarks), and Angular. The JavaScript and TypeScript printer is reworked too, particularly in --no-semi mode where comments around break and continue are now stable across repeated formats (an idempotency fix), plus redundant parenthesis removal in return statements, embedded-template interpolation alignment, and logical-not inlining. The release drops the legacy import ... assert {} syntax (Babel 8 removed the parser plugin; migrate to with), fixes a silently broken --cache-strategy content option, and stops EditorConfig files above Git worktrees from leaking in. The team reiterates pinning the exact version in package.json because the formatting changes will produce diffs."
date: 2026-06-28
image: "/images/heroes/2026-06-28--prettier-3-9-micromark-yaml-graphql-rust-flow-parser.png"
author: lschvn
tags: ["tooling", "javascript", "ecosystem"]
tldr:
  - "Prettier 3.9.0 ([blog post](https://prettier.io/blog/2026/06/27/3.9.0), released June 27, 2026 by Fisker Cheung) is a parser-upgrade release. Markdown moves from the outdated remark-parse v8 to [micromark v4](https://github.com/micromark/micromark) for much better CommonMark and GFM compliance and a batch of long-standing bug fixes; YAML moves to yaml v2; GraphQL moves to GraphQL.js v17, adding fragment arguments and directives on directive definitions; Angular's parser is updated; and Flow switches to the Flow team's new Rust-based (oxidized) parser."
  - "The Flow parser switch is the performance headline. In Prettier's local parser-only benchmarks, the new Rust parser formatted Prettier's valid Flow fixtures in a 266.4ms median versus 422.6ms for the old parser, and parsed flow_parser.js in 1298.0ms versus 2269.6ms. That is roughly 37% and 43% faster respectively, and it continues the Rust-native-frontend trend Prettier started with its [OXC and Hermes plugins](/articles/2026-06-23--oxlint-v1-71-oxfmt-v0-56)."
  - "Two things will touch your codebase. First, the JavaScript and TypeScript printer changed (notably in `--no-semi` mode, where comments around `break` and `continue` are now idempotent across formats), so a reformat will produce a diff. Second, the legacy `import ... assert { type: \"json\" }` syntax is dropped because Babel 8 removed the parser plugin; migrate to `import ... with { type: \"json\" }`. The release reiterates pinning the exact version (`\"prettier\": \"3.9.0\"`, not `^3.9.0`) in package.json."
faq:
  - question: "What is new in Prettier 3.9?"
    answer: "Prettier 3.9.0, released June 27, 2026, is a parser-upgrade release. It upgrades the Markdown parser from remark-parse v8 to micromark v4 (better CommonMark and GFM compliance), the YAML parser to yaml v2, the GraphQL parser to GraphQL.js v17 (fragment arguments and directives on directive definitions), the Angular parser, and the Flow parser to the Flow team's new Rust-based oxidized parser. It also reworks the JavaScript and TypeScript printer (especially in --no-semi mode) and drops the legacy import ... assert {} syntax."
  - question: "Why does Prettier now use a Rust-based Flow parser?"
    answer: "Prettier 3.9 adopts the oxidized (Rust-based) Flow parser released by the Flow team. In Prettier's local parser-only benchmarks, the new parser formatted Prettier's valid Flow fixtures in a 266.4ms median versus 422.6ms for the old parser, and parsed flow_parser.js in 1298.0ms versus 2269.6ms, roughly 37% and 43% faster. It is the same Rust-native-frontend direction Prettier has explored through its OXC and Hermes plugins, applied here to Flow-typed code."
  - question: "Does Prettier 3.9 change my formatting output?"
    answer: "Yes, expect a diff. The JavaScript and TypeScript printer changed in several ways: comments around break and continue in --no-semi mode are now stable across repeated formats (an idempotency fix), redundant parentheses in return statements are removed, embedded-template interpolations are aligned and line-breaks avoided, logical-not expressions are inlined into if/while conditions, and JSDoc trailing double spaces are preserved. Markdown, YAML, and GraphQL output can also shift because their parsers changed. The team recommends pinning the exact version (\"prettier\": \"3.9.0\") so formatting stays stable across installs."
  - question: "Is the removal of import assertions a breaking change?"
    answer: "Yes for code that still uses the old assert keyword. The legacy `import foo from \"./foo.json\" assert { type: \"json\" }` syntax is removed because Babel 8 dropped the parser plugin Prettier relied on. Prettier can no longer reliably parse or format that syntax. The fix is to migrate to the current standard: `import foo from \"./foo.json\" with { type: \"json\" }`."
  - question: "Should I pin the exact Prettier version?"
    answer: "Yes, and the 3.9 release notes repeat the standing advice. Use `\"prettier\": \"3.9.0\"` in package.json rather than `^3.9.0`. Because Prettier is a formatter, any change to its output becomes a code diff, and a caret range can pull a new minor or patch that reformats your whole project on a fresh install. Pinning keeps formatting deterministic. If you use @prettier/plugin-oxc or @prettier/plugin-hermes, upgrade them alongside Prettier so the new formatting rules apply."
  - question: "What happens to MDX after the Markdown parser upgrade?"
    answer: "The core Markdown parser is upgraded to micromark v4, but the MDX parser migration is not finished yet. The release notes explicitly ask for help from contributors familiar with the unified ecosystem, micromark, or MDX to complete the migration. If you format MDX, test your output on 3.9 and report issues; the remaining MDX work is still open."
---

[Prettier 3.9.0](https://prettier.io/blog/2026/06/27/3.9.0), released June 27, 2026 in a 37-minute blog post by Fisker Cheung, is unusual for a Prettier release: the headline is not a new config option or a speedier CLI, it is five parser upgrades landing at once. Markdown, YAML, GraphQL, Flow, and Angular all move to newer upstream parsers, and the JavaScript and TypeScript printer gets a rework that will show up as a diff in most repos. If you treat Prettier output as stable, 3.9 is a release to land deliberately and pin the exact version.

## Five parsers, one release

The Markdown change is the one most users will feel. Prettier's Markdown parser moves from the outdated `remark-parse` v8 to [micromark v4](https://github.com/micromark/micromark), the modern CommonMark parser. The release notes frame this as "significantly enhanced CommonMark and GFM compliance" plus "numerous long-standing parsing bugs" resolved, and it lays a cleaner foundation for future work. There is one caveat: the MDX parser migration is not yet complete, and the team is asking for contributors familiar with the unified and micromark ecosystem to finish it.

YAML moves to `yaml` v2, which fixes many long-standing parse issues, with thanks to ota-meshi's work on `yaml-unist-parser`. GraphQL moves to [GraphQL.js](https://github.com/graphql/graphql-js) v17, which adds support for newer syntax: fragment arguments (`...dynamicProfilePic(size: $size)`) and directives on directive definitions and `extend directive`, both of which errored or misparsed on 3.8.

The Flow upgrade is the performance story. Prettier now uses the new Rust-based (oxidized) Flow parser released by the Flow team. In Prettier's local parser-only benchmarks, the new parser formatted Prettier's valid Flow fixtures in a **266.4ms median versus 422.6ms** for the old parser, and parsed `flow_parser.js` in **1298.0ms versus 2269.6ms**. That is roughly 37% and 43% faster, and it is the same Rust-native-frontend direction the project has explored through its [OXC and Hermes plugins](/articles/2026-06-23--oxlint-v1-71-oxfmt-v0-56) and that the wider ecosystem has been taking with [Oxc](/articles/2026-06-22--oxc-v0-137-react-compiler-treeshake-perf) and [SWC](/articles/2026-06-23--swc-v1-15-43-react-compiler-template-literal-bug).

## The JavaScript and TypeScript printer changed

The parser upgrades are half the release; the other half is a batch of printer changes that will produce a diff. The most notable is a long-standing `--no-semi` idempotency bug. On 3.8, a `break` or `continue` followed by a line comment produced different output on the first and second format, so running Prettier twice could keep changing the file. On 3.9, the comment handling around `break` and `continue` is stable across formats.

A short list of the other printer changes:

- **Redundant parentheses removed** in `return` statements, so `return (a, b)` is no longer rewritten to `return ((a, b))`.
- **Embedded-template interpolations realigned** in tagged templates, avoiding unexpected line breaks and fixing alignment in CSS-in-template-literal blocks.
- **Logical-not inlining**: `!(...)` in `if`/`while`/`do..while` conditions is inlined to reduce diff when a condition flips to its negated form, fixing a real-world double-paren case inside the Prettier codebase itself.
- **JSDoc trailing double spaces preserved**, because some tooling treats them as meaningful.
- **Comment placement** around empty call argument lists and parenthesized callees is corrected.

None of this is a config change, but together they mean a `prettier --write .` after upgrading will reformat files.

## The one real breaking change: import assertions

The release drops support for the legacy `import ... assert {}` syntax:

```diff
- import foo from "./foo.json" assert { type: "json" };
+ import foo from "./foo.json" with { type: "json" };
```

The reason is upstream: Babel 8 completely removed support for the legacy `assert` keyword (the old parser plugin is gone), and without Babel parser support Prettier can no longer reliably parse or format that syntax. The current standard is the `with` keyword from the import attributes proposal. If your codebase still uses `assert`, migrate before upgrading; Prettier links to its disclaimer about non-standard syntax for context.

## CLI fixes worth knowing

A few CLI fixes round out the release. `--cache-strategy content` was silently broken: `file-entry-cache` v11 renamed the `useChecksum` option to `useCheckSum` (capital S), and Prettier was still passing the old casing, so content-based cache comparison was disabled and only file size was compared. That is now fixed, so content-based caching actually works again.

Prettier also stops searching for EditorConfig files above Git worktrees: a `.git` file (used in worktrees and submodules) is now treated as a project root marker alongside a `.git` directory, so an EditorConfig from a parent directory no longer leaks into worktree formatting. Two crash fixes handle directory and file names with special characters (bracketed names like `username[repo-name]`, and leading quotes), and the experimental CLI sees updates.

## What to watch

The practical advice is straightforward: pin the exact version. The release notes repeat the standing recommendation to use `"prettier": "3.9.0"` rather than `^3.9.0`, because the Markdown, YAML, GraphQL, and JS/TS changes all produce output diffs, and a caret range can pull a new minor that reformats a whole project on a fresh install. If you use `@prettier/plugin-oxc` or `@prettier/plugin-hermes`, upgrade them at the same time so the new formatting rules apply.

Two things to test before committing the upgrade: any Markdown or MDX documentation (the micromark switch is the broadest change), and any Flow-typed or GraphQL-heavy code. The MDX migration is still open, so MDX output in particular is worth a careful diff. The full changelog is on the [compare view](https://github.com/prettier/prettier/compare/3.8.5...3.9.0), and 3.9.1 followed on the same day with follow-up fixes.
