<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { getLocalizedPath, isLocalizableRoutePath } from '~~/shared/utils/locale'

const props = defineProps<{
  href?: string
}>()

const attrs = useAttrs()
const { locale } = useI18n()

const isInternalRouteLink = computed(() =>
  Boolean(props.href) && isLocalizableRoutePath(props.href!)
)

const localizedHref = computed(() => {
  if (!props.href) {
    return props.href
  }

  return isInternalRouteLink.value
    ? getLocalizedPath(props.href, locale.value)
    : props.href
})
</script>

<template>
  <NuxtLink v-if="isInternalRouteLink" :to="localizedHref" v-bind="attrs">
    <slot />
  </NuxtLink>
  <a v-else :href="href" v-bind="attrs">
    <slot />
  </a>
</template>
