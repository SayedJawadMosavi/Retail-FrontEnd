


const tabs = [
  { title: 'معاشونه', icon: 'mdi-cash-multiple', count: 0 ,key:'salaries'},
  { title: 'ړنګ شوی', icon:'mdi-trash',count:0,key:'trash'},
]
const breadCrumbs=[
  {
    title: 'فهرست',
    disabled: false,
    href: '/',
  },
      
  {
    title: 'د معاشاتو لست',
    disabled: true,
    href: 'salaries',
  },
  
  
]
  
const search=[
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name:'د کارکوونکی آی دی',
    id: 'employee_id',
  },
  {
    name:'د تاریخ بر اساس',
    id: 'created_at',
  },
]
  
  
const headers= [
  {
    title: '#آی دی',
    key: 'id',
    width:'80px',
  },
  {
    title: 'د کارکوونکی نوم',
    key: 'employee',
  },
  {
    title:'وظیفه',
    key: 'position',
  },
  {
    title:'د معاش اندازه',
    key: 'salary',
  },
  {
    title:'د ورکړې وړ',
    key: 'payable_amount',
  },
  {
    title:'وصول شوی اندازه',
    key: 'paid',
  },
  {
    title:'د حاضرو تعداد',
    key: 'present',
  },
  {
    title:'د غیرحاضرو تعداد',
    key: 'absent',
  },
  {
    title:'پاتي معاش',
    key: 'remainder',
  },
  {
    title: 'د تادیې نیټه',
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
  