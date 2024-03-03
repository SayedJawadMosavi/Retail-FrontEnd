const tabs = [
  { title: 'ګدامونه', icon: 'mdi-account-group-outline', count: 0 , key: 'stocks'},
  { title: 'ړنګ شوی', icon:'mdi-trash',count:0, key: "trash"},
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
    title: 'د محصولاتو ګدام',
    disabled: false,
    to: '/stock_product_transfer',
  },
]
const headers= [ 
  {
    title: 'شمیره',
    key: 'id',
  },
  
  {
    title: 'تفصيلات وګورئ',
    key: 'view_detail',
  },
  
  {
    title: 'د ګدام نوم',
    key: 'name',
               
  },
  {
    title: 'دآدرس',
    key: 'address',
               
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
  