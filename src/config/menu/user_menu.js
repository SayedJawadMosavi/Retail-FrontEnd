import i18n from '@/plugins/i18n'
const $t = i18n.global.t
const user_menu= [
  // { heading: $t('user_menu_title') },
  {
    title: 'ثبت ولست کاربران',
    to: 'users',
    icon: { icon: 'mdi-people' },
  },

  // {
  //   title: 'تنظیمات حساب',
  //   to: 'account-settings',
  //   icon: { icon: 'mdi-account-cog-outline' },
  // },
 
]
export default  user_menu

