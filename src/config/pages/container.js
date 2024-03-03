const tabs = [
  { title: ' د کانټینر لست', icon: 'mdi-account-group-outline', count: 0 , key: 'containers'},
  { title: '  ړنګ شوی', icon:'mdi-trash',count:0, key: "trash"},
]
  
const search=[
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name: 'شمیره ',
    id: 'id',
  },
  
]
const breadCrumbs=[
  {
    title: 'فهرست',
    disabled: false,
    href: '/',
  },
      
  {
    title: 'بیرته اخیستل ته',
    disabled: false,
    to: 'purchase',
  },
]
const headers= [ 
  {
    title: 'شمیره',
    key: 'id',
  },

  // {
  //   title: 'دیدن جزییات',
  //   key: 'view_expense',
  // },
  
  
  {
    title: 'د کانټینر نوم',
    key: 'name',
               
  },
  {
    title: ' مصرف',
    key: 'expense',
               
  },
  
    
  {
    title: 'حالت',
    key: 'status',
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
  