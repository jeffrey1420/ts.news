---
title: "Claude Code Source Map Leak Exposes Hidden Agent OS, Chrome Automation, and Privacy Gaps"
description: "On March 30–31 2026, developers discovered that the npm package @anthropic-ai/claude-code@v2.1.88 included a production source map file that exposed the full TypeScript source code — revealing undocumented multi-agent orchestration, a hidden Chrome MCP server, an internal query engine, a tool permission system, and a three-tier telemetry system."
date: 2026-03-31
image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop"
author: "lschvn"
tags:
  [
    "security",
    "anthropic",
    "claude-code",
    "npm",
    "typescript",
    "agents",
    "privacy",
  ]
readingTime: 5
tldr:
  - "Claude Code v2.1.88 shipped with a production source map (cli.js.map) exposing ~4,756 source files including undocumented multi-agent orchestration."
  - "Hidden Chrome MCP server allows Claude Code to control a browser — a capability never announced or documented by Anthropic."
  - "A three-tier privacy system (default, no-telemetry, essential-traffic) with Datadog integration and 506 telemetry files reveals extensive data collection."
  - "CLAUDE.md resolution has four precedence levels, including an undocumented system-wide `/etc/claude-code/CLAUDE.md` that could pose configuration risks."
faq:
  - question: "Should I uninstall Claude Code after the source map leak?"
    answer: "The source map exposed Claude Code's internal architecture, but it was not a vulnerability that leaked data from user machines. No credentials, API keys, or user data were exposed. Updating to the latest version removes the source map file. The incident is a build configuration failure, not a security breach of your environment."
  - question: "What data does Claude Code actually collect?"
    answer: "Claude Code has three telemetry tiers: 'default' (everything enabled, including Datadog crash reporting and first-party event logging), 'no-telemetry' (analytics disabled), and 'essential-traffic' (blocks all nonessential outbound traffic). It collects platform metadata, runtime info, and GitHub Actions presence. Feature flags are managed via GrowthBook, suggesting A/B testing is built in."
  - question: "Is the hidden Chrome automation a security risk?"
    answer: "The Chrome MCP server requires explicit setup with a specific browser extension ID and is not active by default. The primary concern is not active exploitation but the fact that Anthropic built and shipped a browser automation capability without documenting it — raising questions about what other undocumented features exist in tools with deep codebase access."
---

On March 30, 2026, developers installing the npm package `@anthropic-ai/claude-code@v2.1.88` noticed something unusual: the published bundle included `cli.js.map`, a production source map file that maps the minified JavaScript back to its original TypeScript source. Within hours, the discovery spread across developer communities, with multiple developers independently confirming that the source map provided a near-complete view of Claude Code's internal architecture.

The issue was formally reported as [GitHub issue #41329](https://github.com/anthropics/claude-code/issues/41329) — titled "[BUG] It seems that the claude code source code has leaked, with cli.js.map uploaded to npm" — and was closed as completed the same day. Developers on Twitter, including @iamsupersocks, @Fried_rai, and @chetaslua, shared screenshots and analyses of what they found. A French developer is reported to have posted an extensive thread breaking down the most significant discoveries.

## What Leaked

The source map (`cli.js.map`) is a standard JavaScript build artifact that allows debugging tools to map minified code back to original source files. When included in a production npm package, it effectively exposes the entire TypeScript source tree to anyone who downloads the package. In this case, the source map contained references to **4,756 source files**, including approximately **25 Claude-specific files** that developers say reveal architectural decisions Anthropic had not publicly documented.

The package was published to npm with the source map intact — a build configuration error that should never reach production.

## What They Found

### The Agent OS: A Multi-Agent Orchestration System Nobody Knew Existed

The most striking discovery was a comprehensive agent orchestration system. The source map reveals a set of agent types with names that have never appeared in any public documentation:

- `AgentTool`, `ExploreAgent`, `PlanAgent`, `VerificationAgent`, `GeneralPurposeAgent`, `StatuslineSetupAgent`

Alongside these, the code contains `TeamCreateTool` and `TeamDeleteTool`, suggesting that Claude Code can create and destroy teams of agents. The system uses a `coordinatorMode.ts` for multi-agent coordination, and agents communicate through a file-based inbox system at `.claude/teams/{team_name}/inboxes/{agent_name}.json`. A `forkSubagent.ts` file handles spawning subagents, and execution isolation is maintained through `AsyncLocalStorage`.

The system prompt itself has **three distinct prefixes**: `DEFAULT_PREFIX`, `AGENT_SDK_CLAUDE_CODE_PRESET_PREFIX`, and `AGENT_SDK_PREFIX` — suggesting at least three distinct operational modes or contexts for the AI, none of which Anthropic has documented publicly.

**Tool permissions** are enforced via a `checkPermissions` method on each tool. Three modes exist: `allow` (runs immediately), `ask` (pauses and shows a confirmation dialog), and `deny` (rejected, with an error returned to the model). A `bypassPermissions` mode skips all checks entirely — a significant capability that works in conjunction with the `--dangerously-skip-permissions` flag. The `acceptEdits` mode auto-approves file edits but not bash commands, providing a middle ground between full bypass and interactive approval.

### Hidden Chrome Integration: The claude-in-chrome MCP Server

Developers found a complete MCP (Model Context Protocol) server for Chrome browser automation. The source map reveals:

- A Chrome extension with ID `fcoeoabgfenejglbffodgkkbkcdhcgfn`
- Tools including `javascript_tool`, `read_page`, `find`, `form_input`, `computer`, and `navigate` (from a `BROWSER_TOOLS` module)
- A GIF recording capability exposed via `mcp__claude-in-chrome__gif_creator`
- Console log reading via `mcp__claude-in-chrome__read_console_messages`

This MCP server appears to allow Claude Code to control a Chrome browser directly from within the CLI — a capability that has not been announced or documented by Anthropic.

### The Privacy Gap: What Claude Code Actually Sends

The source map reveals a three-tier privacy system that clarifies (and complicates) what data Claude Code collects:

| Mode                | Telemetry                        | Datadog | First-Party Events | Feedback |
| ------------------- | -------------------------------- | ------- | ------------------ | -------- |
| `default`           | Everything enabled               | ✓       | ✓                  | ✓        |
| `no-telemetry`      | Analytics disabled               | ✗       | ✗                  | ✗        |
| `essential-traffic` | All nonessential traffic blocked | —       | —                  | —        |

The analytics integration sends data to **Datadog** and logs first-party events throughout the codebase. Feature flags are managed through **GrowthBook** via `getFeatureValue_CACHED_MAY_BE_STALE`. An attribution header can be disabled via the `CLAUDE_CODE_ATTRIBUTION_HEADER` environment variable. The source map contains **506 analytics- and telemetry-related files**, with `logEvent` and `logForDebugging` called throughout the codebase. Environment metadata collected includes platform, runtime, and GitHub Actions information.

The existence of the `essential-traffic` mode — which blocks virtually all nonessential outbound traffic — may be news to developers who believed the only options were "all on" or "all off."

### The CLAUDE.md Hierarchy: Four Levels of Precedence Nobody Told You About

The source map reveals that Claude Code resolves `CLAUDE.md` files in a specific order with **reverse priority** (later levels override earlier ones):

1. `/etc/claude-code/CLAUDE.md` — System-wide global for all users
2. `~/.claude/CLAUDE.md` — Private user-global
3. `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*.md` — Project-level
4. `CLAUDE.local.md` — Private project-specific (**highest priority**)

This four-tier system, particularly the existence of `/etc/claude-code/CLAUDE.md` and `CLAUDE.local.md`, is not documented in any public-facing Anthropic material. System administrators could theoretically plant a global `CLAUDE.md` at `/etc/claude-code/`, and developers may have `CLAUDE.local.md` configurations they don't realize override project rules.

### The Hidden "good-claude" Command

Buried in `src/commands/good-claude/index.js`, developers found a completely hidden stub command:

```javascript
export default { isEnabled: () => false, isHidden: true, name: "stub" };
```

The command exists, is marked hidden, is disabled, and has no actual implementation. Its purpose is entirely unclear — it could be an abandoned feature, an internal easter egg, or something else entirely. But its existence in a production build raises questions about what other undocumented features may be lurking in the codebase.

### Analytics Everywhere

With 506 telemetry-related files, the extent of data collection in Claude Code is substantial. The codebase uses:

- **Datadog** for crash and error reporting
- **First-party event logging** throughout
- **`logEvent`** calls pervasive across the source
- **`logForDebugging`** for development-time diagnostics
- Environment metadata collection: platform, runtime, GitHub Actions presence

The presence of GrowthBook for feature flags (`getFeatureValue_CACHED_MAY_BE_STALE`) suggests that Anthropic runs A/B tests and gradual rollouts directly within Claude Code.

### Inside the Query Engine: How Each Turn Executes

A Mintlify-hosted internal documentation page (from VineeTagarwaL-code/claude-code/concepts/how-it-works) provides rare insight into Claude Code's per-turn execution engine, corroborating and extending what the source map revealed.

**The Query Engine** (`query.ts`) is the central dispatcher for every user turn. It streams tokens to the terminal, handles `tool_use` blocks as they arrive, enforces per-turn token and tool-call budgets, and triggers **context compaction** when the conversation window fills up. Results exceeding `maxResultSizeChars` are saved to a temporary file; the model receives only a preview with the file path.

**Every API call prepends two context blocks:**

- `getSystemContext()` — injects Git status (current branch, git username, last 5 commit messages) and a cache-breaking injection token. Memoized for the conversation duration.
- `getUserContext()` — loads CLAUDE.md memory files and the current date. Also memoized.

When `CLAUDE_CODE_REMOTE=1` is set (cloud mode), the Git status fetch is skipped entirely — an important detail for developers using Claude Code in environments where Git metadata may be sensitive or unavailable.

**Conversation storage** uses JSON transcript files saved to `~/.claude/`, making sessions fully resumable via the `--resume <session-id>` flag. Sessions are indexed separately, and the transcripts are stored as structured JSON files on disk.

**Sub-agents** run via a `Task` tool. Each sub-agent runs its own nested agentic loop with an isolated conversation context and an optional restricted toolset. They can execute in-process (using `AsyncLocalStorage` for isolation, matching what the source map showed) or on remote compute.

### Other Findings

The source map also revealed:

- A **buddy/companion system** in `src/buddy/` — a pet/animal companion that sits beside the input box and can comment via speech bubble. Not anthropomorphized, and separate from the main Claude instance.
- A **plugin hint system** emitting `<claude-code-hint />` tags to stderr, surfacing plugin install prompts with 30-second auto-dismiss and show-once semantics per plugin.
- A **Skills Framework** in `src/skills/bundled/claudeApi.ts` with 247KB of bundled `.md` files for the `/claude-api` command, covering Python, TypeScript, Java, Go, Ruby, C#, PHP, and curl, with language auto-detection from file extensions.
- Build system details: Claude Code is built with **Bun**, uses the **React compiler runtime**, renders via **Ink** (a React-like CLI framework), and uses **Zod** for schema validation and **lodash-es** for utilities.

## What It Means

The leak is significant for several reasons. First, it represents a **failure of build configuration** — source maps should never be published in production npm packages. This is a basic security practice that Anthropic's build pipeline apparently missed.

Second, and more substantively, the source map reveals a **substantial gap between what Claude Code publicly claims to be and what it actually is**. The undocumented multi-agent orchestration system, hidden Chrome automation, and pervasive telemetry suggest a product with capabilities and data collection that users have not consented to. The three-tier privacy system is not clearly communicated in Anthropic's documentation, and the `/etc/claude-code/CLAUDE.md` and `CLAUDE.local.md` files create configuration vectors that developers may be unaware of.

For the industry, the leak illustrates a broader pattern: AI coding tools are accumulating **substantial undocumented capabilities** — agent orchestration, browser automation, telemetry — that their enterprise and individual users have had no visibility into. As these tools become embedded in developer workflows, the question of what they actually do (versus what they say they do) becomes increasingly important.

## Anthropic's Silence

As of publication, Anthropic has not issued a public statement about the source map exposure. The GitHub issue was closed as completed, suggesting the company is aware of the leak, but no changelog entry, security advisory, or customer communication has been published. No explanation has been offered for how the source map was included in the production package, what data may have been exposed, or what the company plans to do to prevent similar leaks in the future.

The `@anthropic-ai/claude-code` package has since been updated, but the incident raises questions about Anthropic's build and release processes — and about the transparency commitments that developers expect from a company whose tool has deep access to their codebases.
