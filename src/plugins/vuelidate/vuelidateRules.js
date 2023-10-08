import i18n from '@/plugins/i18n'
const $t = i18n.global.t
export default {
  validate(variable, field) {
   
    if (variable.required && variable.required.$invalid)
      return [`${field}  Required!`]
    
    if (variable.minLength && variable.minLength.$invalid)
      return [`${field} at lest${variable.minLength?.$params?.min} be letter!`]
    
    if (variable.maxLength && variable.maxLength.$invalid)
      return [`${field} maximum${variable.maxLength?.$params?.max} be letter!`]
    
    if (variable.numeric && variable.numeric.$invalid)
      return [`${field} should be number !`]

    if (variable.minValue && variable.minValue.$invalid)
      return [`${field} at lest${variable.minValue.$params.min} be`]
      
    if (variable.maxValue && variable.maxValue.$invalid)
      return [`${field}  begger than ${variable.maxValue.$params.max} can not be`]
      
    if (variable.email && variable.email.$invalid)
      return ['Email is Incorrect']
    
    if (variable.sameAsPassword && variable.sameAsPassword.$invalid) { 
      
      return ['confirm password not matched!']

    }
    
    if (variable.sameAsRef && variable.sameAsRef.$invalid)
      return ['confirm password not matched!']
    
    return []
  },

  validateCollection(variable, field) {
  
    for (let index = 0; index < variable.length; index++) {

      if(variable[index].$params.type=='required')
        return [`${field} Required`]
      
      if(variable[index].$params.type=='numeric')
        return [`${field} must be number`]

      if(variable[index].$params.type=='minValue')
        return [`${field} at lest${variable[index].$params.min} be`]
      
      if(variable[index].$params.type=='maxValue')
        return [` cant not be bigger than ${variable[index].$params.max} ${field}`]
      
      if(variable[index].$params.type=='minLength')
        return [`${field} at lest${variable[index].$params.min} be letter!`]
      
      if(variable[index].$params.type=='maxLength')
        return [`${field} maximum${variable[index].$params.min} be letter!`]
        
     
      
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
