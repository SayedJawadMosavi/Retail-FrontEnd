<script setup>
import { useI18n } from 'vue-i18n'

const {locale}= useI18n()

function toggleLanguage() {
  console.log('dfvdfvdf',locale.value);
  locale.value = locale.value == 'en' ? 'fa' : 'en'
  store.$rtl(locale.value=='fa')
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
