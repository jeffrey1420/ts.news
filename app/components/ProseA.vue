<script setup lang="ts">
const props = defineProps<{
  href?: string
}>()

const attrs = useAttrs()

function shouldLocalizeHref(href: string) {
  return href === '/' || /^\/(articles|authors|tags|login)(\/|$)/.test(href)
}
</script>

<template>
  <NuxtLinkLocale v-if="href && shouldLocalizeHref(href)" :to="href" v-bind="attrs">
    <slot />
  </NuxtLinkLocale>
  <a v-else :href="href" v-bind="attrs">
    <slot />
  </a>
</template>
