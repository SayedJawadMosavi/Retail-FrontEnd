const tabs = [
  { title: 'سرمایه', icon: 'mdi-cash-check', count: 0 , key: 'capitals'},
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
    title: 'د  مقدار',
    key: 'amount',
                 
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
    