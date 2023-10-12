
import i18n from '@/plugins/i18n'
const $t = i18n.global.t

const tabs = [
  { title: 'کاربران', icon: 'mdi-accounts', count: 0 ,key:'users'},
  { title: 'حذف شده ها', icon:'mdi-trash',count:0,key:'trash'},
]
const breadCrumbs=[
  {
    title: 'داشبورد',
    disabled: false,
    href: '/',
  },
    
  {
    title: 'لیست کاربران',
    disabled: true,
    href: 'users',
  },


]

const search=[
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name:'آی دی',
    id: 'id',
  },

]


const headers= [
 
  {
    title: $t('title_header'),
    key: 'id',
    width:'80px',
  },
 
 
  {
    title: 'ایمل',
    key: 'email',
  },
  {
    title:'نقش',
    key: 'role',
  },
 
  {
    title: 'تاریخ ثبت',
    key: 'created_at',
  },
    
]

export default function usePageConfig() {
  return {
    headers,
    tabs,
    breadCrumbs,
    search,
  }
}
