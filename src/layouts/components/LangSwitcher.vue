<script setup>
import { useI18n } from 'vue-i18n'

const {locale}= useI18n()


function toggleLanguage() {
  console.log('dfvdfvdf', locale.value);
  if (locale.value === 'en') {
    locale.value = 'fa';
    store.$rtl(true);
  } else if (locale.value === 'fa') {
    locale.value = 'ps';
    store.$rtl(true);
  } else if (locale.value === 'ps') {
    locale.value = 'en';
    store.$rtl(false);
  }
}

import { useStore } from '@/store'
const store = useStore()
</script>

<template>
  <VBtn
    icon
    variant="text"
    color="default"
    class="me-2"
    @click="toggleLanguage"
  >
    <VIcon>mdi-translate</VIcon>
  </VBtn>
</template>
