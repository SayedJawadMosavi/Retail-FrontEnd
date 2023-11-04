const tabs = [
  { title: 'گزارش', icon: 'mdi-account-group-outline', count: 0 , key: 'reports'},
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
    
  // {
  //   name: 'Register Date',
  //   id: 'created_at',
  // },
       
]
const breadCrumbs=[
  {
    title: 'داشبورد',
    disabled: false,
    href: '/',
  },
          
 
]

      
      
export default function usePageConfig() {
  return {
 
    tabs,
    breadCrumbs,
    search,
  }
}
      