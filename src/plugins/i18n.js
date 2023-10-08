import en from '@/translations/en'
import fa from '@/translations/fa'
import { createI18n } from 'vue-i18n'

const messages = {
  en
  ,fa,
}

const i18n = createI18n({
  legacy:false,
  locale: 'en',
  messages,
})

export default i18n
