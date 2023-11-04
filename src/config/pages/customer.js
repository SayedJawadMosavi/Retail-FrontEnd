const tabs = [
  { title: 'مشتری', icon: 'mdi-account-group-outline', count: 0 , key: 'customers'},
  { title: 'حذف شده ها', icon:'mdi-trash',count:0, key: "trash"},
]
    
const search=[
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name: 'شماره ',
    id: 'id',
  },
  
  // {
  //   name: 'Register Date',
  //   id: 'created_at',
  // },
     
]
const breadCrumbs=[
  {
    title: 'داشبورد',
    disabled: false,
    href: '/',
  },
        
  {
    title: 'مشتری',
    disabled: true,
    href: 'customers',
  },
]
const headers= [ 
  {
    title: 'شماره',
    key: 'id',
  },
  
  // {
  //   title: 'View More',
  //   key: 'profile',
  // },
   
  {
    title: 'اسم',
    key: 'first_name',
                 
  },

  {
    title: 'تخلص',
    key: 'last_name',
     
                 
  },
  {
    title: 'شماره تماس',
    key: 'phone_number',
  },
  {
    title: 'ایمیل',
    key: 'email',
  },
  {
    title: 'آدرس',
    key: 'address',
  },
  {
    title: 'مجموع پول',
    key: 'total_price',
  },
   
  {
    title: 'مجموع پرداخت شده',
    key: 'paid_amount',
  },
  
  {
    title: 'باقی مانده',
    key: 'reminder',
  },
  {
    title: 'توضیحات',
    key: 'description',
  },
  {
    title: 'حالت',
    key: 'status',
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
    