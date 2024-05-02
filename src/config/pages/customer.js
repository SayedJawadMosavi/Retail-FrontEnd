const tabs = [
  { title: 'پیرودنکی', icon: 'mdi-account-group-outline', count: 0 , key: 'customers'},
  { title: 'ړنګ شوی', icon:'mdi-trash',count:0, key: "trash"},
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
    title: 'فهرست',
    disabled: false,
    href: '/',
  },
        
  {
    title: 'پیرودنکی',
    disabled: true,
    href: 'customers',
  },
]
const headers= [ 
  {
    title: 'شمیره',
    key: 'id',
  },
  
  {
    title: 'تفصيلات وګورئ',
    key: 'view_profile',
  },
  {
    title: 'پرینت',
    key: 'print',
  },
  {
    title: 'نوم',
    key: 'first_name',
                 
  },

  // {
  //   title: 'تخلص',
  //   key: 'last_name',  
  // },


  // {
  //   title: 'بریښنالیک',
  //   key: 'email',
  // },
  // {
  //   title: 'آدرس',
  //   key: 'address',
  // },
  {
    title: 'د پیسو مجموعه',
    key: 'total_price',
  },
   
  {
    title: 'ټول وصول شوي',
    key: 'paid_amount',
  },
  
  {
    title: 'پاتې',
    key: 'reminder',
  },
  {
    title: 'تیلفون شمیره',
    key: 'phone_number',
  },
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
    