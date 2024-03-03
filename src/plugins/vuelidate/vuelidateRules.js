import i18n from '@/plugins/i18n'
const $t = i18n.global.t
export default {
  validate(variable, field) {
   
    if (variable.required && variable.required.$invalid)
      return [`${field} دا ضروري ده!`]
    
    if (variable.minLength && variable.minLength.$invalid)
      return [`${field} حد اقل ${variable.minLength?.$params?.min} حرف وی!`]
    
    if (variable.maxLength && variable.maxLength.$invalid)
      return [`${field} حد اکثر ${variable.maxLength?.$params?.max} حرف وی!`]
    
    if (variable.numeric && variable.numeric.$invalid)
      return [`${field} باید عدد وی!`]

    if (variable.minValue && variable.minValue.$invalid)
      return [`${field} حد اقل ${variable.minValue.$params.min} وی`]
      
    if (variable.maxValue && variable.maxValue.$invalid)
      return [`${field} لوی د ${variable.maxValue.$params.max} نشی کیدلای`]
      
    if (variable.email && variable.email.$invalid)
      return ['ایمیل صحیح نده']
    
    if (variable.sameAsPassword && variable.sameAsPassword.$invalid) { 
      
      return ['تایید شوی پاسورد سره فرق لری!']

    }
    
    if (variable.sameAsRef && variable.sameAsRef.$invalid)
      return ['تایید شوی پاسورد سره فرق لری!']
    
    return []
  },

  validateCollection(variable, field) {
  
    for (let index = 0; index < variable.length; index++) {

      if(variable[index].$params.type=='required')
        return [`${field} ضروری وی!`]
      
      if(variable[index].$params.type=='numeric')
        return [`${field} باید عدد وی!`]

      if(variable[index].$params.type=='minValue')
        return [`${field} حد اقل ${variable[index].$params.min} وی`]
      
      if(variable[index].$params.type=='maxValue')
        return [`نشی کیدلای لوی د ${variable[index].$params.max} ${field}`]
      
      if(variable[index].$params.type=='minLength')
        return [`${field} حد اقل ${variable[index].$params.min} حرف وی!`]
      
      if(variable[index].$params.type=='maxLength')
        return [`${field} حد اکثر ${variable[index].$params.min} حرف وی!`]
        
     
      
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
