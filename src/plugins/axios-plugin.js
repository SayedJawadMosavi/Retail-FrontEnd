
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
      toast.success('معلومات موفقانه اضافه شد!')
    }
    else if (status == 202) {
      toast.success('معلومات موفقانه ویرایش شد!')
    }
    else if (status == 203) {
      toast.success('معلومات موفقانه بازیابی شد!')
    }
    else if (status == 206) {
      toast.success('معلومات موفقانه حذف شد!')
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
      toast.error('شما اجازه به این قسمت از سیستم را ندارید!')

    }
    if (error?.code == 'ERR_NETWORK') {
      router.push('/network-error') 
    } 
    if (status == 500) {
      toast.error(error?.response?.data??'خطا رخ داد')
    }
    if (status == 422) {
      const message = error?.response?.data?.message
      toast.error(message??'دیتا اشتباه است')
    }
    
    return Promise.reject(error)
  },
)
function updateToken(token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}


export { axios, updateToken }

