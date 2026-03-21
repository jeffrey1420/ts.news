<script setup lang="ts">
useSeoMeta({
  title: 'About - ts.news',
  description: 'About ts.news - Clean, developer-focused TypeScript and web technology news. No fluff, no ads.',
  ogTitle: 'About ts.news',
  ogDescription: 'Clean, developer-focused TypeScript and web technology news.',
})
</script>

<template>
  <div class="max-w-2xl">
    <header class="mb-12">
      <h1 class="text-4xl font-bold tracking-tight mb-4">
        About ts.news
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300">
        The TypeScript and web technology news source developers actually read.
      </p>
    </header>
    
    <div class="prose prose-lg dark:prose-invert max-w-none space-y-8">
      <section>
        <h2 class="text-2xl font-semibold mb-4">What is ts.news?</h2>
        <p>
          <strong>ts.news</strong> is an independent editorial publication covering TypeScript and the modern web. 
          We write long-form articles, analysis, and in-depth coverage of the technologies that matter to 
          developers building the web today.
        </p>
        <p>
          No fluff. No ads. No paywalls. Just well-researched, well-written content that respects your time 
          and intelligence.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4">Who is ts.news for?</h2>
        <p>
          ts.news is built for developers who:
        </p>
        <ul>
          <li>Use TypeScript in their daily work and want to stay current</li>
          <li>Care about web platform developments and browser standards</li>
          <li>Follow frontend frameworks and want to understand trade-offs</li>
          <li>Value quality over quantity when it comes to tech content</li>
          <li>Appreciate clean, distraction-free reading experiences</li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4">What We Cover</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 class="font-semibold mb-2">TypeScript</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Language features, type system deep dives, best practices, and ecosystem news.
            </p>
          </div>
          <div class="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 class="font-semibold mb-2">Web Standards</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              TC39 proposals, browser APIs, HTML, CSS, and the evolving web platform.
            </p>
          </div>
          <div class="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 class="font-semibold mb-2">Frameworks</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Vue, React, Svelte, Nuxt, Next, Astro — tools and techniques that get the job done.
            </p>
          </div>
          <div class="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 class="font-semibold mb-2">Developer Experience</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Build tools, editors, workflows, and everything that makes coding better.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4">Our Philosophy</h2>
        <p>
          The web is flooded with content. Tutorial sites that haven't been updated in years, 
          news aggregators that prioritize clicks over quality, and endless listicles that 
          promise the world but deliver nothing.
        </p>
        <p>
          We believe in <strong>depth over breadth</strong>. We'd rather publish one carefully 
          researched article than ten shallow takes. Every piece we publish should provide 
          genuine value — something you can apply, learn from, or think about differently.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4">Tech Stack</h2>
        <p>
          This site is built with:
        </p>
        <ul>
          <li><strong>Nuxt 4</strong> — The Vue framework we trust for modern web apps</li>
          <li><strong>Nuxt UI</strong> — Beautiful, accessible components</li>
          <li><strong>Nuxt Content</strong> — Markdown-based content that keeps things simple</li>
          <li><strong>TypeScript</strong> — Because types matter</li>
        </ul>
      </section>

      <section class="border-t border-gray-200 dark:border-gray-800 pt-8">
        <h2 class="text-2xl font-semibold mb-4">Stay Updated</h2>
        <p class="mb-4">
          Subscribe to our RSS feed to get the latest articles delivered to your feed reader:
        </p>
        <NuxtLink
          to="/rss.xml"
          class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-mono text-sm"
        >
          <UIcon name="i-heroicons-rss" class="w-4 h-4" />
          /rss.xml
        </NuxtLink>
      </section>
    </div>
  </div>
</template>
