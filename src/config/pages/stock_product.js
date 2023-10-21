const tabs = [
    { title: 'لست گدام محصولات', icon: 'mdi-cash-plus', count: 0, key: 'product_stocks' },

    { title: 'حذف شده ها', icon:'mdi-trash',count:0, key: 'trash'},
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
  const search=[
    {
      name: 'عمومی',
      id: 'all',
    },
  
   
      
  
  ]
  
  
  const headers= [
    {
      title: '#آی دی',
      key: 'id',
    },
    {
      title: 'اسم محصول',
      key: 'products_name',
    },
    {
      title: 'اسم گدام',
      key: 'stocks_name',
    },
 
    {
      title: 'مقدار',
      key: 'quantity',
      width: '140px',
    
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
  