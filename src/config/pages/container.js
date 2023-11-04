const tabs = [
  { title: 'کانتینر ها', icon: 'mdi-account-group-outline', count: 0 , key: 'containers'},
  { title: 'حذف شده ها', icon:'mdi-trash',count:0, key: "trash"},
]
  
const search=[
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name: 'شماره ',
    id: 'id',
  },
  
   
]
const breadCrumbs=[
  {
    title: 'داشبورد',
    disabled: false,
    href: '/',
  },
      
  {
    title: 'برگشت به خرید',
    disabled: false,
    to: 'purchase',
  },
]
const headers= [ 
  {
    title: 'شماره',
    key: 'id',
  },

  // {
  //   title: 'دیدن جزییات',
  //   key: 'view_expense',
  // },
  
  
  {
    title: 'اسم کانتیر',
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
  