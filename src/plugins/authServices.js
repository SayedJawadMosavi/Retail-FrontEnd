// Import the necessary modules
import { axios, updateToken } from '@/plugins/axios-plugin'
import { useStoreAuth } from '@/store/authStore'
import { toast } from 'vue3-toastify'










// Define a function to log in a user
async function login(email, password) {
  try {
    const response = await axios.post('login', { email, password })
    const { token, user } = response.data
    toast.success('SuccessFully Logined.')
  
    const store = useStoreAuth()
    store.$login({ tkn: token, usr: user })
    updateToken(token)
    location.reload()

  } catch (error) {
    toast.error(error?.response?.data?.error)
    console.error(error)
  }
}

// Define a function to log out a user
function logout() {
  const store = useStoreAuth()
  store.$logout()

}

// Define a function to check if the user is authenticated
function isAuthenticated() {
  const store = useStoreAuth()
  
  return !!store.token
}

// Export the authentication functions and state as a composition API
export default function useAuth() {
  return {
    login,
    logout,
    isAuthenticated,
  }
}
