const tabs = [
  { title: 'کارمندان', icon: 'mdi-account-group-outline', count: 0 , key: 'employees'},
  { title: 'حذف شده ها', icon:'mdi-trash',count:0, key: "trash"},
]
  
const search=[
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name: 'کارمند شماره ',
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
    title: 'کارمندان',
    disabled: true,
    href: 'employess',
  },
]
const headers= [ 
  {
    title: 'شماره',
    key: 'id',
  },
  {
    title: 'دیدن بیشتر',
    key: 'profile',
  },
  {
    title: 'اسم',
    key: 'first_name',
               
  },
  {
    title: 'تخلص',
    key: 'last_name',
   
               
  },
  {
    title: 'ایمیل',
    key: 'email',
  },
  {
    title: 'عنوان وظیفه',
    key: 'job_title',
    width: '100px',
  },
  
  {
    title: 'شماره تلفن',
    key: 'phone_number',
  },
  {
    title: 'آدرس فعلی',
    key: 'current_address',
    width: '180px',
  },
  {
    title: 'آدرس دائمی',
    key: 'permenent_address',
    width: '180px',
  },
  {
    title: 'تاریخ شروع ',
    key: 'employment_start_date',
    width: "130px",
  },
  {
    title: 'تاریخ ختم ',
    key: 'employment_end_date',
    width: "130px",
   
  },
  {
    title: 'معاش',
    key: 'salary',
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
  