---
title: "Nitro v3.0.260603-beta: Custom Framework Commands and Default Preset Config"
description: "Nitro's latest beta adds support for custom framework preview and deploy commands, introduces a defaultPreset config option for customizing the fallback preset, and fixes a type-stripping edge case."
date: 2026-06-07
image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Nitro", "Deno", "TypeScript", "JavaScript", "framework"]
tldr:
  - "Nitro 3 beta now lets frameworks inject custom preview and deploy commands, enabling tighter integration with platform-specific tooling."
  - "A new defaultPreset config option allows you to customize the fallback preset when no explicit preset is specified, giving more control over deployment behavior."
  - "A type-stripping fix ensures TypeScript extension-only retries are handled correctly, preventing potential build issues with certain module resolutions."
faq:
  - q: "What does 'custom framework preview/deploy commands' mean in Nitro 3?"
    a: "Framework plugins can now provide their own preview and deploy commands that Nitro will invoke as part of the build pipeline. This allows frameworks built on top of Nitro to wire in platform-specific tooling without needing separate CLI entrypoints."
  - q: "What is the defaultPreset config option?"
    a: "The defaultPreset option lets you set which preset Nitro should fall back to when no explicit preset is configured. Previously the fallback was hardcoded; now you can customize it — useful when your setup needs a specific default that differs from the out-of-box behavior."
  - q: "What was the type-stripping fix in this release?"
    a: "The fix ensures that when TypeScript retries resolving a module path with added extensions (.ts, .tsx), Nitro only strips extensions it actually retried — not all possible extensions. This prevents edge cases where legitimate module resolution could be incorrectly skipped."
---
