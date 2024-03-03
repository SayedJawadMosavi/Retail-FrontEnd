const tabs = [
  { title: 'کټګورۍ', icon: 'mdi-account-group-outline', count: 0 , key: 'products'},
  { title: 'ړنګ شوی', icon:'mdi-trash',count:0, key: "trash"},
]
  
const search=[
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name: 'شمیره',
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
    title: 'بېرته محصولاتو ته',
    disabled: false,
    to: 'product',
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
    title: 'د کتګوری نوم',
    key: 'name',
               
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
  