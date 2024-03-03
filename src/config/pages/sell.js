const tabs = [
  { title: 'فروش محصولات', icon: 'mdi-shopping-outline', count: 0, key: 'sells' },
  { title: 'حذف شده ها', icon: 'mdi-trash', count: 0, key: 'trash' },
]
const breadCrumbs = [
  {
    title: 'داشبورد',
    disabled: false,
    href: '/',
  },
  
  {
    title: 'لیست فروش محصولات',
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
    title: '#آی دی',
    key: 'id',
  },
   
  {
    title: 'دیدن بیشتر',
    key: 'view_profile',
  },
  {
    title: 'پرینت',
    key: 'print',
  },
  
  {
    title: 'اسم مشتری',
    key: 'customer_name',
  },
   
  
  {
    title: 'مجموع قیمت',
    key: 'total_price',
    width: '100px',
  },
  {
    title: 'مقدار پرداخت شده',
    key: 'paid_amount',
    width: '130px',
  },
  {
    title: 'باقیمانده',
    key: 'remainder',
    width: '180px',
  },
   
  {
    title: 'توضیحات',
    key: 'description',
  },
  {
    title: 'تاریخ ثبت',
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
  