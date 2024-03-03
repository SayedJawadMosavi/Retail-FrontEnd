
<template>
  <VApp>
    <VLocaleProvider rtl> 
      <VLayout class="layout-wrapper layout-nav-type-vertical">
        <RouterView />
      </VLayout>
    </VLocaleProvider>
  </VApp>
</template>

<script setup>
import { useStore } from '@/store'
import { computed, onMounted, watch } from 'vue'
const store = useStore()
import { createStore } from 'vuex'
onMounted(() => {
  const direction = localStorage.getItem('direction')
  const language = localStorage.getItem('language')
  console.log("lang",language)
  if (direction) {
    store.rtl = direction === 'rtl'
  }
  if (language) {
    store.language = language
  }
})

const rtl = computed(() => {
  return store.rtl
})

const language = computed(() => {
  console.log('tessss',store.language)
  
  return store.language

})

// Watch for changes in the direction and language and update local storage
watch([rtl, language], ([newRtl, newLanguage]) => {
  localStorage.setItem('direction', newRtl ? 'rtl' : 'ltr')
  localStorage.setItem('language', newLanguage)
})
</script>

<style lang="scss">
.nav-item-title{
  font-size: 13px;
}
</style>
