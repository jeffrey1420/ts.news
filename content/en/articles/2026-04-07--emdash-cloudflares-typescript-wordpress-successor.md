---
title: "EmDash: Cloudflare's TypeScript-Based WordPress Successor with Sandboxed Plugins"
description: "Cloudflare has built EmDash, a new open-source CMS written entirely in TypeScript and powered by Astro. Plugins run in isolated Dynamic Workers, solving WordPress's decades-old plugin security crisis where 96% of security issues originate."
date: "2026-04-07"
image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&h=630&fit=crop"
author: lschvn
tags: ["cloudflare", "typescript", "astro", "cms", "wordpress", "security", "javascript"]
---

Cloudflare launched EmDash this week, an open-source content management system it calls "the spiritual successor to WordPress." The project is notable for being built entirely in TypeScript, powered by Astro under the hood, and shipping with a fundamentally different approach to plugin security.

[tldr]
- EmDash is a new open-source CMS built on Astro 6.0, written entirely in TypeScript, MIT licensed
- Plugins run in sandboxed Dynamic Workers isolates instead of having direct filesystem/database access — fixing WordPress's core security problem
- 96% of WordPress security vulnerabilities come from plugins; EmDash's capability-based model eliminates this attack surface
- Deployable to Cloudflare Workers or any Node.js server; early beta available now
[/tldr]

## Why WordPress Needed a Successor

WordPress powers over 40% of the internet. It launched in 2003, before AWS EC2 existed, and its plugin architecture hasn't fundamentally changed since. A WordPress plugin is a PHP script with direct access to your database and filesystem. Installing a plugin means granting it full trust.

The numbers are stark: 96% of WordPress security vulnerabilities originate in plugins, and 2025 saw more high-severity WordPress plugin vulnerabilities than the previous two years combined. The model is the problem, not individual plugin developers.

EmDash's bet is that you can build a CMS for the serverless era — where plugins declare what they need via a manifest and receive only those capabilities — without sacrificing the accessibility that made WordPress dominant.

## How the Sandboxing Works

In EmDash, each plugin runs in its own [Dynamic Worker](https://developers.cloudflare.com/workers/runtime-apis/bindings/worker-loader/), Cloudflare's lightweight isolate technology. Rather than giving plugins direct access to data, EmDash provides capabilities via bindings.

Before installing a plugin, you can read its manifest and know exactly what permissions it requests — similar to an OAuth scopes screen. The security guarantee is structural: a plugin can only perform actions explicitly declared in its manifest.

```typescript
// EmDash plugin manifest example
{
  "name": "email-on-publish",
  "capabilities": ["send-email", "read-content"],
  "runtime": "dynamic-worker"
}
```

This is a meaningful departure from the PHP include model that WordPress inherited from a different era of web hosting.

## Built on Astro 6.0, Written in TypeScript

EmDash is not a WordPress fork. No WordPress code was used. It is built on Astro 6.0 — Cloudflare's own Astro fork, which notably was rebuilt in one week using AI coding agents last year.

The project is MIT licensed, fully open source, and available on [GitHub](https://github.com/emdash-cms/emdash). You can deploy a blog template directly to Cloudflare Workers:

```
https://deploy.workers.cloudflare.com/?url=https://github.com/emdash-cms/templates/tree/main/blog-cloudflare
```

There's also an [EmDash Playground](https://emdashcms.com/) where you can try the admin interface without deploying anything.

## The Broader Context

Cloudflare has been on a building spree with AI coding agents. The company rebuilt Next.js in a week (producing Vinext), then turned that same tooling at WordPress. Whether the output of that experiment is production-ready is a separate question — EmDash is launching in beta, not as a mature product.

But the thesis is coherent: the marginal cost of building software has dropped dramatically when AI agents handle boilerplate, and the result can be a genuinely novel architecture rather than a WordPress theme. The plugin security model alone makes EmDash interesting to anyone who has had to audit a WordPress site with 30 plugins installed.

[faq]
- **Is EmDash compatible with WordPress themes and plugins?** Not directly — EmDash is a from-scratch implementation. The team aims for feature compatibility, not code compatibility. No WordPress PHP was used.
- **Where can I deploy EmDash?** Initially Cloudflare Workers and any Node.js server. Other platforms may follow.
- **Is this production-ready?** No — EmDash v0.1.0 is an early developer beta. Expect breaking changes.
- **What license is it under?** MIT, which Cloudflare chose specifically to allow broad adoption and contribution without GPL constraints.
[/faq]
