import i18n from '@/plugins/i18n'
const $t = i18n.global.t
export default {
  validate(variable, field) {
   
    if (variable.required && variable.required.$invalid)
      return [`${field} ضروری میباشد!`]
    
    if (variable.minLength && variable.minLength.$invalid)
      return [`${field} حد اقل ${variable.minLength?.$params?.min} حرف باشد!`]
    
    if (variable.maxLength && variable.maxLength.$invalid)
      return [`${field} حد اکثر ${variable.maxLength?.$params?.max} حرف باشد!`]
    
    if (variable.numeric && variable.numeric.$invalid)
      return [`${field} باید عدد باشد!`]

    if (variable.minValue && variable.minValue.$invalid)
      return [`${field} حد اقل ${variable.minValue.$params.min} باشد`]
      
    if (variable.maxValue && variable.maxValue.$invalid)
      return [`${field} بزرگتر از ${variable.maxValue.$params.max} شده نمیتواند`]
      
    if (variable.email && variable.email.$invalid)
      return ['ایمل نادرست است']
    
    if (variable.sameAsPassword && variable.sameAsPassword.$invalid) { 
      
      return ['تاییدی پسورد باهم شباهت ندارد!']

    }
    
    if (variable.sameAsRef && variable.sameAsRef.$invalid)
      return ['تاییدی پسورد باهم شباهت ندارد!']
    
    return []
  },

  validateCollection(variable, field) {
  
    for (let index = 0; index < variable.length; index++) {

      if(variable[index].$params.type=='required')
        return [`${field} ضروری میباشد!`]
      
      if(variable[index].$params.type=='numeric')
        return [`${field} باید عدد باشد!`]

      if(variable[index].$params.type=='minValue')
        return [`${field} حد اقل ${variable[index].$params.min} باشد`]
      
      if(variable[index].$params.type=='maxValue')
        return [`نمیتواند بزرگتر  از ${variable[index].$params.max} ${field}`]
      
      if(variable[index].$params.type=='minLength')
        return [`${field} حد اقل ${variable[index].$params.min} حرف باشد!`]
      
      if(variable[index].$params.type=='maxLength')
        return [`${field} حد اکثر ${variable[index].$params.min} حرف باشد!`]
        
     
      
    }
    
    return []
  },
  preventNonNumeric(event) {
    var allowed = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '.',
      '۱',
      '۲',
      '۳',
      '۴',
      '۵',
      '۶',
      '۷',
      '۸',
      '۹',
      '۰',
      '.',
    ]
  
    if (!allowed.includes(event.key)) {
      event.preventDefault()
    }
  },
}
