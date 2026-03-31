<script setup lang="ts">
import { en, fr, de } from '@nuxt/ui/locale'

const { locale, setLocale } = useI18n()
</script>

<template>
  <ULocaleSelect
    :model-value="locale"
    :locales="[en, fr, de]"
    @update:model-value="setLocale($event)"
  />
</template>
