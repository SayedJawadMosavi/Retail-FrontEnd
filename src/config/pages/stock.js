const tabs = [
    { title: 'گدام ها', icon: 'mdi-account-group-outline', count: 0 , key: 'stocks'},
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
  
   
  ]
  const breadCrumbs=[
    {
      title: 'داشبورد',
      disabled: false,
      href: '/',
    },
      
    {
      title: 'گدام محصولات',
      disabled: true,
      href: '',
    },
  ]
  const headers= [ 
    {
      title: 'شماره',
      key: 'id',
    },
  
    {
      title: 'دیدن جزییات',
      key: 'view_detail',
    },
  
    {
      title: 'اسم گدام',
      key: 'name',
               
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
  