const tabs = [
  { title: 'عاید', icon: 'mdi-cash-plus', count: 0, key: 'incoming' },
  { title: 'مصرف', icon:'mdi-cash-minus',count:0, key: 'outgoing'},
  { title: 'ړنګ شوی', icon:'mdi-trash',count:0, key: 'trash'},
]
  
const breadCrumbs=[
  {
    title: 'فهرست',
    disabled: false,
    href: '/',
  },
          
  {
    title: 'عاید او مصرف',
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
    name: 'د ثبت نیته',
    id: 'created_at',
  },
   
      
  
]
  
  
const headers= [
  {
    title: '#آی دی',
    key: 'id',
  },
  {
    title: 'تفصیل',
    key: 'name',
  },
  {
    title: 'ډول',
    key: 'type',
    width:'160px',
  
               
  },
  {
    title: 'د کتګورۍ نوم',
    key: 'category',
                   
  },
  {
    title: 'اندازه',
    key: 'amount',
    width: '140px',
      
  
  },
  {
    title: 'ثبت کوونکی',
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
  