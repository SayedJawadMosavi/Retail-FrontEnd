
import useAuth from '@/plugins/authServices'
import main_axios from 'axios'
import { toast } from 'vue3-toastify'
import router from '../router'



const { logout } = useAuth()
const token = localStorage.getItem('token')

const axios = main_axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
})


axios.interceptors.response.use(
  response => {
    const status =response.status
    if (status == 201) {
      toast.success('معلومات په بریالیتوب سره اضافه شول!')
    }
    else if (status == 202) {
      toast.success('معلومات په بریالیتوب سره ایدیت شول!')
    }
    else if (status == 203) {
      toast.success('معلومات په بریالیتوب سره ترلاسه شول!')
    }
    else if (status == 206) {
      toast.success('معلومات په بریالیتوب سره حذف شول!')
    }


    return response
  },
  error => {
    
    const status=error?.response?.status
    if (status === 401) {
      logout()
      router.push('/login') // replace '/login' with the actual login page route
    }
    if (status === 402) {
      toast.error('تاسو د سیسټم دې برخې ته اجازه نه لرئ!')

    }
    if (error?.code == 'ERR_NETWORK') {
      router.push('/network-error') 
    } 
    if (status == 500) {
      toast.error(error?.response?.data??'تيروتنه رامینځ ته شوه')
    }
    if (status == 406) {
      toast.error(error?.response?.data??'دنوم موجود ده')
    }
    if (status == 422) {
      const message = error?.response?.data?.message
      toast.error(message??' مقدار نشي کولی د هغه څه څخه ډیر وي چې شتون لري')
    }
    
    return Promise.reject(error)
  },
)
function updateToken(token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}


export { axios, updateToken }

