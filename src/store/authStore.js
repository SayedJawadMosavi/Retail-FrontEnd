import { defineStore } from 'pinia'



export const useStoreAuth = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)

  const user = ref(null)
  try {
    user.value= JSON.parse(localStorage.getItem('user') ?? {})
  } catch (error) {
    user.value={}
  }

  function $logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  
  function $login({tkn,usr}) {
    token.value = tkn
    user.value = usr
    localStorage.setItem('token', tkn)
    localStorage.setItem('user', JSON.stringify(usr))
  }

  function $updateUser({usr}) {
    user.value = usr
    localStorage.setItem('user', JSON.stringify(usr))
  }

  
  return { token, $login,$logout,user ,$updateUser}
})
