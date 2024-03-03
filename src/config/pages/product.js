const tabs = [
  { title: 'محصولات', icon: 'mdi-account-group-outline', count: 0 , key: 'products'},
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
    title: 'محصولات',
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

  // {
  //   title: 'پرنت',
  //   key: 'print',
  // },
  {
    title: 'د محصول نوم',
    key: 'product_name',
   
               
  },
  
  {
    title: 'د کتګورۍ نوم',
    key: 'category',
               
  },
  {
    title: 'کمپنی',
    key: 'company_name',
   
               
  },
  {
    title: 'کود',
    key: 'code',
   
               
  },
  {
    title: 'اندازه',
    key: 'quantity',
   
               
  },
  {
    title: ' د کارتن تعداد',
    key: 'carton_amount',
   
               
  },
  {
    title: ' د واحد نوم',
    key: 'unit_name',
   
               
  },
  {
    title: ' د کارتن اندازه',
    key: 'carton_quantity',
   
               
  },
  {
    title: 'رنگ',
    key: 'color',
   
               
  },
  {
    title: 'سایز',
    key: 'size',
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
  