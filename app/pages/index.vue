<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { absoluteSiteUrl, siteConfig } from '~~/shared/utils/site'
import { getCollectionName } from '~~/shared/utils/locale'
import { featuredTopicSlugs, resolveTopicLabel, topicDefinitions } from '~~/shared/utils/topics'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const articlesCollection = computed(() => getCollectionName('articles', locale.value))

const { data: allArticles } = await useAsyncData(() => `home:${route.path}`, () =>
  queryCollection(articlesCollection.value).order('date', 'DESC').all()
)

const title = 'TypeScript & Web Dev News'
const description = computed(() => t('home.hero_description'))
const canonicalUrl = computed(() => absoluteSiteUrl(route.path))
const ogImage = absoluteSiteUrl(siteConfig.defaultOgImage)

useSeoMeta({
  title,
  description,
  ogTitle: `${title} | ${siteConfig.name}`,
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogImage,
  ogImageAlt: siteConfig.name,
  twitterTitle: `${title} | ${siteConfig.name}`,
  twitterDescription: description,
  twitterImage: ogImage,
})

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [
    {
      key: 'home-schema',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${title} | ${siteConfig.name}`,
        url: canonicalUrl.value,
        description: description.value,
        isPartOf: {
          '@type': 'WebSite',
          name: siteConfig.name,
          url: siteConfig.url,
        },
        hasPart: {
          '@type': 'ItemList',
          itemListElement: (allArticles.value ?? []).map((article, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteSiteUrl(localePath(article.path)),
            name: article.title,
          })),
        },
      }),
    },
  ],
}))

const featuredArticle = computed(() => allArticles.value?.[0] ?? null)
const marqueeItems = computed(() =>
  (allArticles.value ?? []).slice(0, 10).map(a => ({ title: a.title, path: a.path }))
)

const recentArticles = computed(() => (allArticles.value ?? []).slice(1, 7))

const topicRails = computed(() =>
  featuredTopicSlugs
    .map(slug => topicDefinitions.find(topic => topic.slug === slug)!)
    .filter(Boolean)
    .map(topic => ({
      ...topic,
      label: resolveTopicLabel(topic, t),
      articles: (allArticles.value ?? []).filter(a => a.tags?.some(tag => topic.tags.includes(tag))).slice(0, 3),
    }))
    .filter(rail => rail.articles.length)
)

const stats = computed(() => [
  { value: allArticles.value?.length ?? 0, label: t('home.stat_articles'), numeric: true },
  { value: topicDefinitions.length, label: t('home.stat_topics'), numeric: true },
  { value: 3, label: t('home.stat_languages'), numeric: true },
  { value: t('home.daily'), label: t('home.stat_rhythm'), numeric: false },
])

const heroLine1 = computed(() => t('home.hero_title_1').split(' '))
const heroLine2 = computed(() => t('home.hero_title_2').split(' '))

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value === 'en' ? 'en-US' : locale.value === 'fr' ? 'fr-FR' : 'de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const root = ref<HTMLElement | null>(null)
let gsapCtx: gsap.Context | null = null

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  gsapCtx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Hero: staggered word reveal
      gsap.from('.hero-word', {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.15,
      })
      gsap.from('.hero-fade', {
        y: 18,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.12,
        delay: 0.55,
      })

      // Sections: slide in on scroll
      for (const section of gsap.utils.toArray<HTMLElement>('.reveal-section')) {
        gsap.from(section.querySelectorAll('.reveal-item'), {
          y: 36,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.08,
          clearProps: 'transform',
          scrollTrigger: { trigger: section, start: 'top 78%', once: true },
        })
      }

      // Stats: count up
      for (const el of gsap.utils.toArray<HTMLElement>('.stat-number[data-target]')) {
        const target = Number(el.dataset.target)
        const counter = { value: 0 }
        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: 'power1.out',
          snap: { value: 1 },
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => { el.textContent = String(Math.round(counter.value)) },
        })
      }

      // Featured image: gentle parallax
      const featuredImage = document.querySelector('.featured-image img')
      if (featuredImage) {
        gsap.to(featuredImage, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: '.featured-image', start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }
    })
  }, root.value ?? undefined)
})

onBeforeUnmount(() => {
  gsapCtx?.revert()
})
</script>

<template>
  <div ref="root">
    <!-- ============ HERO ============ -->
    <section class="relative min-h-[calc(100svh-var(--ui-header-height,64px))] flex flex-col overflow-hidden">
      <LandingHeroCanvas />

      <UContainer class="relative flex-1 flex flex-col justify-center py-10 sm:py-14 lg:py-16">
        <p class="hero-fade font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-primary mb-8">
          {{ t('home.hero_kicker') }}
        </p>

        <h1 class="text-[clamp(2.6rem,7vw,5.6rem)] leading-[1.05] tracking-[-0.03em] font-normal text-highlighted max-w-6xl">
          <span class="block overflow-hidden pb-1">
            <span
              v-for="(word, i) in heroLine1"
              :key="`l1-${i}`"
              class="hero-word inline-block mr-[0.28em]"
            >{{ word }}</span>
          </span>
          <span class="block overflow-hidden pb-2">
            <span
              v-for="(word, i) in heroLine2"
              :key="`l2-${i}`"
              class="hero-word inline-block mr-[0.28em] text-primary"
            >{{ word }}</span>
          </span>
        </h1>

        <p class="hero-fade mt-8 text-lg sm:text-xl text-muted max-w-2xl leading-relaxed">
          {{ t('home.hero_description') }}
        </p>

        <div class="hero-fade mt-10 flex flex-wrap items-center gap-4">
          <UButton
            :label="t('home.read_articles')"
            :to="localePath('/articles')"
            icon="i-lucide-newspaper"
            size="xl"
          />
          <UButton
            :label="t('home.subscribe_rss')"
            href="/rss.xml"
            external
            icon="i-lucide-rss"
            color="neutral"
            variant="outline"
            size="xl"
          />
        </div>
      </UContainer>

      <div class="hero-fade relative shrink-0">
        <div class="hidden sm:flex items-center gap-2 absolute -top-12 left-1/2 -translate-x-1/2 text-dimmed text-xs font-mono uppercase tracking-widest">
          <UIcon name="i-lucide-arrow-down" class="size-3.5 animate-bounce" />
          {{ t('home.scroll') }}
        </div>
        <LandingHeadlineMarquee v-if="marqueeItems.length" :items="marqueeItems" />
      </div>
    </section>

    <!-- ============ FEATURED ============ -->
    <section v-if="featuredArticle" class="reveal-section py-20 sm:py-28 border-b border-default">
      <UContainer>
        <div class="reveal-item flex items-baseline justify-between mb-10">
          <h2 class="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {{ t('home.featured') }}
          </h2>
          <time class="text-sm text-dimmed font-mono">{{ formatDate(featuredArticle.date) }}</time>
        </div>

        <NuxtLink :to="localePath(featuredArticle.path)" class="group grid lg:grid-cols-2 gap-10 items-center">
          <div v-if="featuredArticle.image" class="featured-image reveal-item overflow-hidden rounded-lg border border-default">
            <NuxtImg
              :src="featuredArticle.image"
              :alt="featuredArticle.title"
              width="1200"
              height="630"
              class="w-full scale-105 object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div>
            <div v-if="featuredArticle.tags?.length" class="reveal-item flex gap-2 mb-5">
              <UBadge
                v-for="tag in featuredArticle.tags.slice(0, 2)"
                :key="tag"
                :label="tag"
                variant="subtle"
                size="sm"
              />
            </div>
            <h3 class="reveal-item text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight tracking-tight font-normal text-highlighted group-hover:text-primary transition-colors">
              {{ featuredArticle.title }}
            </h3>
            <p class="reveal-item mt-5 text-lg text-muted leading-relaxed line-clamp-3">
              {{ featuredArticle.description }}
            </p>
            <span class="reveal-item mt-7 inline-flex items-center gap-2 text-primary font-medium">
              {{ t('home.read_articles') }}
              <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </NuxtLink>
      </UContainer>
    </section>

    <!-- ============ THIS WEEK / RECENT ============ -->
    <section v-if="recentArticles.length" class="reveal-section py-20 sm:py-28 border-b border-default bg-muted">
      <UContainer>
        <div class="reveal-item flex items-baseline justify-between mb-10">
          <h2 class="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {{ t('home.latest_headlines') }}
          </h2>
          <UButton
            :label="t('home.view_all')"
            :to="localePath('/articles')"
            variant="link"
            color="neutral"
            trailing-icon="i-lucide-arrow-right"
            size="sm"
          />
        </div>

        <UBlogPosts>
          <UBlogPost
            v-for="article in recentArticles"
            :key="article.path"
            :title="article.title"
            :description="article.description"
            :date="formatDate(article.date)"
            :image="article.image"
            :badge="article.tags?.[0] ? { label: article.tags[0], color: 'primary' as const, variant: 'subtle' as const } : undefined"
            :to="localePath(article.path)"
            class="reveal-item"
          />
        </UBlogPosts>
      </UContainer>
    </section>

    <!-- ============ TOPIC RAILS ============ -->
    <section class="reveal-section py-20 sm:py-28 border-b border-default">
      <UContainer>
        <h2 class="reveal-item font-mono text-xs uppercase tracking-[0.2em] text-primary mb-12">
          {{ t('home.browse_topics') }}
        </h2>

        <div class="space-y-12">
          <div
            v-for="rail in topicRails"
            :key="rail.slug"
            class="reveal-item grid md:grid-cols-[220px_1fr] gap-5 md:gap-10 pb-10 border-b border-muted last:border-0 last:pb-0"
          >
            <NuxtLink :to="localePath(`/tags/${rail.slug}`)" class="group flex items-start gap-3">
              <UIcon :name="rail.icon" class="size-5 text-primary mt-0.5" />
              <span class="text-xl tracking-tight text-highlighted group-hover:text-primary transition-colors">
                {{ rail.label }}
              </span>
            </NuxtLink>

            <ul class="space-y-4">
              <li v-for="article in rail.articles" :key="article.path">
                <NuxtLink
                  :to="localePath(article.path)"
                  class="group flex items-baseline justify-between gap-6"
                >
                  <span class="text-default group-hover:text-primary transition-colors leading-snug">
                    {{ article.title }}
                  </span>
                  <time class="hidden sm:block shrink-0 text-xs text-dimmed font-mono">
                    {{ formatDate(article.date) }}
                  </time>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ============ STATS BAND ============ -->
    <section class="reveal-section py-20 sm:py-24 border-b border-default bg-inverted text-inverted">
      <UContainer>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-10">
          <div v-for="stat in stats" :key="stat.label" class="reveal-item">
            <div class="text-5xl sm:text-6xl tracking-tight font-normal">
              <span v-if="stat.numeric" class="stat-number" :data-target="stat.value">0</span>
              <span v-else class="text-primary">{{ stat.value }}</span>
            </div>
            <p class="mt-3 text-sm font-mono uppercase tracking-widest opacity-60">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- ============ CTA ============ -->
    <section class="reveal-section py-24 sm:py-32">
      <UContainer class="text-center">
        <h2 class="reveal-item text-3xl sm:text-5xl tracking-tight font-normal text-highlighted max-w-3xl mx-auto">
          {{ t('home.stay_in_loop') }}
        </h2>
        <p class="reveal-item mt-5 text-lg text-muted max-w-xl mx-auto">
          {{ t('home.rss_description') }}
        </p>
        <div class="reveal-item mt-9">
          <UButton
            :label="t('home.subscribe_rss')"
            href="/rss.xml"
            external
            icon="i-lucide-rss"
            size="xl"
          />
        </div>
      </UContainer>
    </section>
  </div>
</template>
