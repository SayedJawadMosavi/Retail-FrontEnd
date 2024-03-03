const tabs = [
  { title: 'آمد', icon: 'mdi-cash-plus', count: 0, key: 'incoming' },
  { title: 'رفت', icon:'mdi-cash-minus',count:0, key: 'outgoing'},
  { title: 'حذف شده ها', icon:'mdi-trash',count:0, key: 'trash'},
]
  
const breadCrumbs=[
  {
    title: 'داشبورد',
    disabled: false,
    href: '/',
  },
          
  {
    title: 'رفت و آمد',
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
    name: 'تاریخ ثبت',
    id: 'created_at',
  },
   
      
  
]
  
  
const headers= [
  {
    title: '#آی دی',
    key: 'id',
  },
  {
    title: 'توضیحات',
    key: 'name',
  },
  {
    title: 'نوع',
    key: 'type',
    width:'160px',
  
               
  },
  {
    title: 'اسم کتگوری',
    key: 'category',
                 
  },
  {
    title: 'مقدار',
    key: 'amount',
    width: '140px',
      
  
  },
  {
    title: 'ثبت کننده',
    key: "created_by",
    width:'120px',
  },
  
  {
    title: 'تاریخ',
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
  