const tabs = [
    { title: 'معامله داران', icon: 'mdi-account-group-outline', count: 0 , key: 'vendors'},
    { title: 'حذف شده ها', icon:'mdi-trash',count:0, key: "trash"},
  ]
  
  const search=[
    {
      name: 'عمموی',
      id: 'all',
    },
    {
      name: 'شماره ',
      id: 'id',
    },
  
   
  ]
  const breadCrumbs=[
    {
      title: 'داشبورد',
      disabled: false,
      href: '/',
    },
      
    {
      title: 'معامله دار',
      disabled: true,
      href: 'vendors',
    },
  ]
  const headers= [ 
    {
      title: 'شماره',
      key: 'id',
    },
    {
      title: 'دیدن جزییات',
      key: 'view_expense',
    },
    {
      title: 'پرنت',
      key: 'print',
    },
    {
      title: 'اسم',
      key: 'name',
   
               
    },
  
    {
      title: 'اسم کمپنی',
      key: 'organization_name',
               
    },
    {
      title: 'شماره تماس',
      key: 'phone_number',
   
               
    },
    {
      title: 'آدرس',
      key: 'address',
   
               
    },
    {
      title: 'ایمیل آدرس',
      key: 'email',
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
  