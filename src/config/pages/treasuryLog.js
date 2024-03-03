const tabs = [
  { title: '  روزنامچه', icon: 'mdi-cash-plus', count: 0, key: 'treasuryLog' },
  { title: 'ړنګ شوی', icon:'mdi-trash',count:0, key: 'trash'},
]
  
const breadCrumbs=[
  {
    title: 'فهرست',
    disabled: false,
    href: '/',
  },
          
  {
    title: 'روزنامچه',
    disabled: true,
    href: '',
  },
]
const search=[
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name: ' آی دی ',
    id: 'id',
  },
   
      
  
]
  
  
const headers= [
  // {
  //   title: 'آی دی#',
  //   key: 'id',
  // },
  {
    title: 'نوم',
    key: 'name',
  },
    
  {
    title: 'ډول',
    key: 'type',
    width:'160px',
  
               
  },

  {
    title: 'اندازه',
    key: 'amount',
    width: '140px',
      
  
  },
  
  {
    title: 'ثبت شوی په واسطه ',
    key: "created_by",
    width:'120px',
  },
  
  {
    title: 'نیټه',
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
  