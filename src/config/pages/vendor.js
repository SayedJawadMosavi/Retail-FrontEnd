const tabs = [
  { title: 'سوداګر', icon: 'mdi-account-group-outline', count: 0 , key: 'vendors'},
  { title: 'ړنګ شوی', icon:'mdi-trash',count:0, key: "trash"},
]
  
const search=[
  {
    name: 'عمموی',
    id: 'all',
  },
  {
    name: 'شمیره ',
    id: 'id',
  },
  
   
]
const breadCrumbs=[
  {
    title: 'فهرست',
    disabled: false,
    href: '/',
  },
      
  {
    title: 'سوداګر',
    disabled: true,
    href: 'vendors',
  },
]
const headers= [ 
  {
    title: 'شمیره',
    key: 'id',
  },

  {
    title: 'تفصيلات وګورئ',
    key: 'view_expense',
  },
  {
    title: 'پرنت',
    key: 'print',
  },
  {
    title: 'نوم',
    key: 'name',
   
               
  },
  
  {
    title: 'د کمپني نوم',
    key: 'organization_name',
               
  },
  {
    title: 'تیلفون شمیره',
    key: 'phone_number',
   
               
  },
  {
    title: 'پته',
    key: 'address',
   
               
  },
  {
    title: 'ایمیل ',
    key: 'email',
  },
    
  {
    title: 'ټول لګښتونه ',
    key: 'extra_expense_sum_price',
  },
 
  {
    title: 'د پیسو مجموعه',
    key: 'total_prices',
  },
   
  {
    title: 'ټول وصول شوي',
    key: 'paid_amount',
  },
  
  {
    title: 'پاتې',
    key: 'reminder',
  },
 
    
  // {
  //   title: ' Start Date',
  //   key: 'start_date',
  // },
  // {
  //   title: ' End Date',
  //   key: 'end_date',
  // },
  {
    title: 'تفصیل',
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
  