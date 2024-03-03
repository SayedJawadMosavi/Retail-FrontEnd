const tabs = [
  { title: '  د واپسی لست', icon: 'mdi-cash-plus', count: 0, key: 'product_backs' },
  
  { title: 'ړنګ شوی', icon:'mdi-trash',count:0, key: 'trash'},
]
    
const breadCrumbs=[
  {
    title: 'فهرست',
    disabled: false,
    href: '/',
  },
            
  {
    title: 'واپسی',
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
    title: '# دبل نمبر',
    key: 'bill_id',
  },
  {
    title: 'د محصول نوم',
    key: 'products_name',
  },
  {
    title: 'د پیرودونکي نوم',
    key: 'customer_name',
  },
  {
    title: 'ګدام ',
    key: 'stocks',
  },

   
  {
    title: ' دکارتن اندازه',
    key: 'quantity',
    width: '140px',
      
  },

  {
    title: ' دپیسو مجموعه',
    key: 'price',
       
                   
  },
  {
    title: ' د تفصیلات',
    key: 'description',
       
                   
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
    