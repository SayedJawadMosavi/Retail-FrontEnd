const tabs = [
  { title: 'خرید محصولات', icon: 'mdi-shopping-outline', count: 0, key: 'purchases' },
  { title: 'حذف شده ها', icon: 'mdi-trash', count: 0, key: 'trash' },
]
const breadCrumbs = [
  {
    title: 'داشبورد',
    disabled: false,
    href: '/',
  },
  
  {
    title: 'لیست خرید محصولات',
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
    title: '#آی دی',
    key: 'id',
  },
  {
    title: 'دیدن بیشتر',
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
    title: 'اسم کانتینر',
    key: 'container_name',
  },
   
  {
    title: 'اسم معامله دار',
    key: 'vendor_name',
  },

 
  
  {
    title: 'مجموع مصارف دیگر',
    key: 'extra_expense_sum_price',
    width: '140px',
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
  