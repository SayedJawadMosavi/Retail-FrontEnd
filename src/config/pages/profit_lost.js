const tabs = [
  { title: ' مفاد او ضرر', icon: 'mdi-cash-plus', count: 0, key: 'profit_lost' },
   
]
    
const breadCrumbs=[
  {
    title: 'فهرست',
    disabled: false,
    href: '/',
  },
            
  {
    title: 'مفاد او ضرر',
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
    
    
const headers = [
  {
    title: 'آی دی#',
    key: 'ids',
  },
  {
    title: 'د محصول نوم',
    key: 'product_name',
  },
  {
    title: 'د پیردونکی نوم',
    key: 'customer_name',
  },
  {
    title: 'دکارتن تعداد',
    key: 'carton_quantity',
    width: '160px',
  },
  
  {
    title: 'قیمت',
    key: 'cost',
    width: '160px',
  },
  
  {
    title: ' د تمام شد قیمت',
    key: 'income_price',
    width: '160px',
  },
    
  
  {
    title: 'مجموعه',
    key: 'total',
    width: '160px',
  },
  {
    title: ' مجموعه مفاد  ',
    key: 'Total_benifit',
    width: '160px',
  },
  {
    title: 'نیټه',
    key: 'created_at',
    width: '160px',
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
    