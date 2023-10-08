import { defineStore } from 'pinia'

import { ref } from 'vue'
const isRtl =localStorage.getItem('rtl')

export const useStore = defineStore('main', () => {
  const rtl = ref(isRtl)

  function $rtl(data) {
    rtl.value = data
    localStorage.setItem('rtl',rtl.value)
  }
  
  return {rtl,$rtl }
})
