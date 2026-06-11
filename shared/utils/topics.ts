export interface TopicDefinition {
  slug: string
  icon: string
  tags: string[]
  label?: string
  labelKey?: string
}

const defaultTopicIcon = 'i-lucide-tag'

/**
 * Canonical tag set. Every article tag is one of these slugs
 * (see scripts/consolidate-tags.ts). Slugs are shared across locales;
 * labels are localized via labelKey.
 */
export const topicDefinitions: TopicDefinition[] = [
  {
    slug: 'typescript',
    label: 'TypeScript',
    icon: 'i-lucide-file-code',
    tags: ['typescript'],
  },
  {
    slug: 'javascript',
    label: 'JavaScript',
    icon: 'i-lucide-braces',
    tags: ['javascript'],
  },
  {
    slug: 'runtimes',
    labelKey: 'tags.runtimes',
    icon: 'i-lucide-cpu',
    tags: ['runtimes'],
  },
  {
    slug: 'tooling',
    labelKey: 'tags.tooling',
    icon: 'i-lucide-wrench',
    tags: ['tooling'],
  },
  {
    slug: 'frameworks',
    labelKey: 'tags.frameworks',
    icon: 'i-lucide-boxes',
    tags: ['frameworks'],
  },
  {
    slug: 'css',
    label: 'CSS',
    icon: 'i-lucide-palette',
    tags: ['css'],
  },
  {
    slug: 'ai',
    labelKey: 'tags.ai',
    icon: 'i-lucide-bot',
    tags: ['ai'],
  },
  {
    slug: 'security',
    labelKey: 'tags.security',
    icon: 'i-lucide-shield',
    tags: ['security'],
  },
  {
    slug: 'performance',
    labelKey: 'tags.performance',
    icon: 'i-lucide-gauge',
    tags: ['performance'],
  },
  {
    slug: 'ecosystem',
    labelKey: 'tags.ecosystem',
    icon: 'i-lucide-globe',
    tags: ['ecosystem'],
  },
]

/** Topics shown as rails on the landing page. */
export const featuredTopicSlugs = ['typescript', 'tooling', 'frameworks', 'runtimes', 'ai', 'security']

export function resolveTopicLabel(topic: TopicDefinition, t: (key: string) => string) {
  return topic.labelKey ? t(topic.labelKey) : (topic.label ?? topic.slug)
}

export function getTopicMeta(tag: string, t?: (key: string) => string) {
  const normalizedTag = tag.toLowerCase()
  const topic = topicDefinitions.find(topic => topic.tags.includes(normalizedTag))

  return {
    icon: topic?.icon ?? defaultTopicIcon,
    label: topic ? resolveTopicLabel(topic, t ?? (key => key)) : tag,
  }
}
