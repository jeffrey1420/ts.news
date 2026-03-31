<script setup lang="ts">
aimport { en, fr, de } from '@nuxt/ui/locale'
import { getLocalizedPath } from '~~/shared/utils/locale'

const route = useRoute()
const switchLocalePath = useSwitchLocalePath()
const { locale, setLocale, setLocaleCookie } = useI18n()

async function onLocaleChange(nextLocale: string) {
  if (!nextLocale || nextLocale === locale.value) {
    return
  }

  const target = switchLocalePath(nextLocale) || getLocalizedPath(route.path, nextLocale)

  setLocaleCookie(nextLocale)
  await setLocale(nextLocale)
  await navigateTo(target)
}
</script>

<template>
  <ULocaleSelect
    :model-value="locale"
    :locales="[en, fr, de]"
    @update:model-value="onLocaleChange"
  />
</template>
