const tabs = [
  { title: 'د محصول اخیستل', icon: 'mdi-shopping-outline', count: 0, key: 'purchases' },
  { title: 'ړنګ شوی', icon: 'mdi-trash', count: 0, key: 'trash' },
]
const breadCrumbs = [
  {
    title: 'فهرست',
    disabled: false,
    href: '/',
  },
  
  {
    title: 'د محصولاتو اخیستل لست',
    disabled: true,
    href: 'purchases',
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

  // {
  //   title: 'حالت',
  //   key: 'status',
  // },
  {
    title: 'پرینت',
    key: 'print',
  },
  
  {
    title: 'د کانټینر نوم',
    key: 'container_name',
  },
   
  {
    title: 'د سوداګر نوم',
    key: 'vendor_name',
  },

 
  
  {
    title: 'د نورو مصارفو مجموعه',
    key: 'extra_expense_sum_price',
    width: '140px',
  },
  {
    title: 'د قیمت مجموعه',
    key: 'total_price',
    width: '100px',
  },
  {
    title: 'وصول شوی مقدار',
    key: 'paid_amount',
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
    title: 'د نوم لیکنې نیټه',
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
  