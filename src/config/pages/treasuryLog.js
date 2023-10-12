const tabs = [
    { title: '  روزنامچه', icon: 'mdi-cash-plus', count: 0, key: 'treasuryLog' },
    { title: 'حذف شده ها', icon:'mdi-trash',count:0, key: 'trash'},
  ]
  
  const breadCrumbs=[
    {
      title: 'داشبورد',
      disabled: false,
      href: '/',
    },
          
    {
      title: 'روزنامچه',
      disabled: true,
      href: '',
    },
  ]
  const search=[
    {
      name: 'عمومی',
      id: 'all',
    },
    {
        name: ' آی دی ',
        id: 'id',
      },
   
      
  
  ]
  
  
  const headers= [
    {
      title: 'آی دی#',
      key: 'id',
    },
    {
      title: 'اسم',
      key: 'name',
    },
    
    {
      title: 'نوعیت',
      key: 'type',
      width:'160px',
  
               
    },

    {
      title: 'مقدار',
      key: 'amount',
      width: '140px',
      
  
    },
  
    {
      title: 'ثبت شده توسط',
      key: "created_by",
      width:'120px',
    },
  
    {
      title: 'تاریخ',
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
  