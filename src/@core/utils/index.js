import moment from "moment"

// 👉 IsEmpty
export const isEmpty = value => {
  if (value === null || value === undefined || value === '')
    return true
  
  return !!(Array.isArray(value) && value.length === 0)
}

// 👉 IsNullOrUndefined
export const isNullOrUndefined = value => {
  return value === null || value === undefined
}

// 👉 IsEmptyArray
export const isEmptyArray = arr => {
  return Array.isArray(arr) && arr.length === 0
}

export const formateDate = date => {
  const timestamp = moment(date)
  
  return timestamp.format('MMMM Do YYYY - h:mm A')
}
export const format = date => {
  const timestamp = moment(date)
  
  return timestamp.format('yyyy-mm-DD')
}

export const formateDateBill = date => {
  const timestamp = moment(date)
  
  return timestamp.format('MMMM Do YYYY')
}


import { useStoreAuth } from '@/store/authStore'

export const scope =  data => {
  const {user} = useStoreAuth()
  const permissions = user?.permissions ?? []
  let result = true
  data.forEach(row => {
    if (!permissions?.includes(row)) {
      result =false
    } 
  })
  
  return result
}

// 👉 IsObject
export const isObject = obj => obj !== null && !!obj && typeof obj === 'object' && !Array.isArray(obj)
