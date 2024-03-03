const tabs = [
  { title: 'کارکوونکی', icon: 'mdi-account-group-outline', count: 0 , key: 'employees'},
  { title: 'ړنګ شوی', icon:'mdi-trash',count:0, key: "trash"},
]
  
const search=[
  {
    name: 'عمومی',
    id: 'all',
  },
  {
    name: 'د کارکوونکی شمیره',
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
    title: 'کارکوونکی',
    disabled: true,
    href: 'employess',
  },
]
const headers= [ 
  {
    title: 'شمیره',
    key: 'id',
  },
  {
    title: 'نور کتل',
    key: 'profile',
  },
  {
    title: 'نوم',
    key: 'first_name',
               
  },
  {
    title: 'تخلص',
    key: 'last_name',
   
               
  },
  {
    title: 'بریښنالیک',
    key: 'email',
  },
  {
    title: 'د وظیفی اعلان',
    key: 'job_title',
    width: '100px',
  },
  
  {
    title: 'تیلفون شمیره',
    key: 'phone_number',
  },
  {
    title: 'اوسنۍ پته',
    key: 'current_address',
    width: '180px',
  },
  {
    title: 'دایمی پته',
    key: 'permenent_address',
    width: '180px',
  },
  {
    title: 'پیل نېټه ',
    key: 'employment_start_date',
    width: "130px",
  },
  {
    title: 'د پای نیټه ',
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
  