
import i18n from '@/plugins/i18n'
const $t = i18n.global.t

const tabs = [
  { title: 'کارونکی', icon: 'mdi-accounts', count: 0 ,key:'users'},
  { title: 'ړنګ شوی', icon:'mdi-trash',count:0,key:'trash'},
]
const breadCrumbs=[
  {
    title: 'فهرست',
    disabled: false,
    href: '/',
  },
    
  {
    title: 'د کارونکی لست',
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
    title: 'نوم',
    key: 'name',
  },
 
  {
    title: 'ایمیل',
    key: 'email',
  },
  {
    title:'رول',
    key: 'role',
  },
 
  {
    title: 'د ثبت نیټه',
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
