
   
import { ref } from 'vue'

import { defineStore } from 'pinia'

   // store/index.js
   import { createStore } from 'vuex'

  
const isRtl =localStorage.getItem('rtl')

export const useStore = defineStore('main', () => {
  const rtl = ref(isRtl)

  function $rtl(data) {
    rtl.value = data
    localStorage.setItem('rtl',rtl.value)
  }
  
  return {rtl,$rtl }
})
export default createStore({
  state() {
    return {
      rtl: false,
      language: ''
    }
  },
  mutations: {
    setRtl(state, value) {
      state.rtl = value
    },
    setLanguage(state, value) {
      state.language = value
    }
  },
  actions: {
    loadFromLocalStorage({ commit }) {
      const direction = localStorage.getItem('direction')
      const language = localStorage.getItem('language')
      if (direction) {
        commit('setRtl', direction === 'rtl')
      }
      if (language) {
        commit('setLanguage', language)
      }
    },
    saveToLocalStorage({ state }) {
      localStorage.setItem('direction', state.rtl ? 'rtl' : 'ltr')
      localStorage.setItem('language', state.language)
    }
  }
})
