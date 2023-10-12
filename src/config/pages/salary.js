


const tabs = [
    { title: 'معاشات', icon: 'mdi-cash-multiple', count: 0 ,key:'salaries'},
    { title: 'حذف شده ها', icon:'mdi-trash',count:0,key:'trash'},
  ]
  const breadCrumbs=[
    {
      title: 'داشبورد',
      disabled: false,
      href: '/',
    },
      
    {
      title: 'لیست معاشات',
      disabled: true,
      href: 'salaries',
    },
  
  
  ]
  
  const search=[
    {
      name: 'عمومی',
      id: 'all',
    },
    {
      name:'ای دی کارمند',
      id: 'employee_id',
    },
    {
      name:'بر اساس تاریخ',
      id: 'created_at',
    },
  ]
  
  
  const headers= [
    {
      title: '#آی دی',
      key: 'id',
      width:'80px',
    },
    {
      title: 'نام کارمند',
      key: 'employee',
    },
    {
      title:'موقف',
      key: 'position',
    },
    {
      title:'مقدار معاش',
      key: 'salary',
    },
    {
      title:'قابل پرداختی',
      key: 'payable_amount',
    },
    {
      title:'مقدار پرداختی',
      key: 'paid',
    },
    {
      title:'تعداد حاضر',
      key: 'present',
    },
    {
      title:'تعداد غیرحاضر',
      key: 'absent',
    },
    {
      title:'باقیمانده معاش',
      key: 'remainder',
    },
    {
      title: 'تاریخ پرداخت',
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
  