const tabs = [
  { title: 'کتگوری ها', icon: 'mdi-account-group-outline', count: 0 , key: 'categories'},
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
    title: 'برگشت  ',
    disabled: false,
    to: 'incomings',
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
    title: 'اسم کتگوری',
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
    