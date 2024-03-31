const tabs = [
  { title: 'د محصولاتو خرڅلاو', icon: 'mdi-shopping-outline', count: 0, key: 'sells' },
  { title: 'ړنګ شوی', icon: 'mdi-trash', count: 0, key: 'trash' },
]
const breadCrumbs = [
  {
    title: 'فهرست',
    disabled: false,
    href: '/',
  },
  
  {
    title: 'د محصولاتو خرڅ لست',
    disabled: true,
    href: 'sell',
  },
]
  
const search = [
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name: 'آی دی',
    id: 'id',
  },
 
    
]
  
const headers = [
  {
    title: '#بیل نمبر',
    key: 'id',
  },
   
  {
    title: 'نور کتل',
    key: 'view_profile',
  },
  {
    title: 'پرینت',
    key: 'print',
  },
  
  {
    title: 'پیریدونکي نوم',
    key: 'customer_name',
  },
   
  
  {
    title: 'د قیمت مجموعه',
    key: 'total_amount',
    width: '100px',
  },
  {
    title: 'وصول شوی مقدار',
    key: 'total_paid',
    width: '130px',
  },
  {
    title: 'پاتې',
    key: 'remainder',
    width: '180px',
  },
   
  {
    title: 'تفصیل',
    key: 'description',
  },
  {
    title: 'د ثبت نیټه',
    key: 'sell_date',
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
  