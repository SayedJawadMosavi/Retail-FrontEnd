/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import i18n from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'

import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@/styles/styles.scss'
import '@core/scss/index.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import VueDatePicker from '@vuepic/vue-datepicker'

import '@vuepic/vue-datepicker/dist/main.css'
loadFonts()

import Vue3Toasity, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'




const app = createApp(App)
app.use(vuetify)
app.use(i18n)
app.use(router)
app.use(createPinia())
app.component('VueDatePicker', VueDatePicker)
app.use(Vue3Toasity, {
  autoClose: 3000,
  transition: toast.TRANSITIONS.ZOOM,
  rtl:true,
})

app.mount('#app')
