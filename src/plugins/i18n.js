import en from '@/translations/en'
import fa from '@/translations/fa'
import ps from '@/translations/ps'
import { createI18n } from 'vue-i18n'

const messages = {
  fa,
  ps,
  en
}

const i18n = createI18n({
  legacy:false,
  locale: 'fa',
  messages,
})

export default i18n
