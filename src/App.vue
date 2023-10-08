
<template>
  <VApp>
    <VLocaleProvider :rtl="rtl">
      <VLayout class="layout-wrapper layout-nav-type-vertical">
        <RouterView />
      </VLayout>
    </VLocaleProvider>
  </VApp>
</template>

<script setup>
import { useStore } from '@/store'
import { computed } from 'vue'
const store = useStore()

const rtl = computed(() => {
  return store.rtl
})
</script>
