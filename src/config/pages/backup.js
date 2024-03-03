const tabs = [
  { title: 'پشتیبان گیری', icon: 'mdi-export', count: 0 , key: 'backups'},

  // { title: 'ړنګ شوی', icon:'mdi-trash',count:0, key: "trash"},
]
  
const search=[
  {
    name: 'عمومي',
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
    title: 'پشتیبان گیری',
    disabled: true,
    href: 'vendors',
  },
]
const headers= [ 
  {
    title: 'شمیره',
    key: 'id',
  },

  {
    title: 'د فایل نوم',
    key: 'name',
   
               
  },
  
  {
    title: 'سایز',
    key: 'size',
               
  },
  {
    title: 'نیټه',
    key: 'created_at',
   
               
  },
  {
    title: 'عملیه',
    key: 'action',
   
               
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
  