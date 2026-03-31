export interface TopicDefinition {
  slug: string
  icon: string
  tags: string[]
  label?: string
  labelKey?: string
}

const defaultTopicIcon = 'i-lucide-tag'

export const topicDefinitions: TopicDefinition[] = [
  {
    slug: 'typescript',
    label: 'TypeScript',
    icon: 'i-lucide-file-code',
    tags: ['typescript'],
  },
  {
    slug: 'tooling',
    labelKey: 'tags.tooling',
    icon: 'i-lucide-wrench',
    tags: ['tooling', 'vite'],
  },
  {
    slug: 'framework',
    labelKey: 'tags.frameworks',
    icon: 'i-lucide-boxes',
    tags: ['framework', 'astro'],
  },
  {
    slug: 'security',
    labelKey: 'tags.security',
    icon: 'i-lucide-shield',
    tags: ['security'],
  },
  {
    slug: 'ai',
    label: 'AI Devtools',
    icon: 'i-lucide-bot',
    tags: ['ai'],
  },
]

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
