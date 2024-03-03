const tabs = [
  { title: 'ګدام ته د لیږد لست', icon: 'mdi-cash-plus', count: 0, key: 'product_stocks_transfer' },

  { title: 'ړنګ شوی', icon:'mdi-trash',count:0, key: 'trash'},
]
  
const breadCrumbs=[
  {
    title: 'فهرست',
    disabled: false,
    href: '/',
  },
          
  {
    title: 'ګودامونه',
    disabled: true,
    href: '',
  },
]
const search=[
  {
    name: 'عمومی',
    id: 'all',
  },
  
   
      
  
]
  
  
const headers= [
  {
    title: '#آی دی',
    key: 'id',
  },
  {
    title: 'د محصول نوم',
    key: 'products_name',
  },
  {
    title: 'د ګدام نوم',
    key: 'stocks_name',
  },
 
  {
    title: 'اندازه',
    key: 'quantity',
    width: '140px',
    
  },
  {
    title: ' د کارتن تعداد',
    key: 'carton_quantity',
     
                 
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
  