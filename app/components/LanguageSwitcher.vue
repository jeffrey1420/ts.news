<script setup lang="ts">
import { en, fr, de } from '@nuxt/ui/locale'

const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()

async function onLocaleChange(nextLocale: string) {
  if (!nextLocale || nextLocale === locale.value) {
    return
  }

  const target = switchLocalePath(nextLocale)

  if (target) {
    await navigateTo(target)
  }
}
</script>

<template>
  <ULocaleSelect
    :model-value="locale"
    :locales="[en, fr, de]"
    @update:model-value="onLocaleChange"
  />
</template>
