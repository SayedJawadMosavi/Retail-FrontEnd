

<template>
  <div>
    <VCard>
      <VForm ref="formRef">
        <VCardText>
          <p class="text-base font-weight-medium mt-2">
            شخصی معلومات
          </p>
          <VRow class="mb-3">
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model.trim="payload.first_name"
                label="نوم "
                prepend-inner-icon="mdi-account"
                :rules="validationRules($v.first_name, 'نوم')"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model.trim="payload.last_name"
                label="تخلص "
                prepend-inner-icon="mdi-account"
              />
            </VCol>
  
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model.trim="payload.job_title"
                label="د وظیفي عنوان"
                prepend-inner-icon="mdi-work"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model.trim="payload.email"
                label="ایمیل "
                prepend-inner-icon="mdi-email"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model.trim="payload.phone_number"
                dir="ltr"
                label="تیلفون شمیره"
                prepend-inner-icon="mdi-phone"
        
                @input="convertToEnglishNumbers('phone_number')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model.trim="payload.current_address"
                label="اوسنۍ پته"
                prepend-inner-icon="mdi-home"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model.trim="payload.permenent_address"
                label="دایمی پته  "
                prepend-inner-icon="mdi-home"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model.trim="payload.salary"
                dir="ltr"
                label="معاش"
                prepend-inner-icon="mdi-money"
                :rules="validationRules($v.salary, 'معاش')"
                @input="convertToEnglishNumbers('salary')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
  
            <VCol
              cols="12"
              md="6"
            >
              <p class="mb-1">
                د قرارداد د پیل نیټه
              </p>
  
              <span dir="ltr">
                <VueDatePicker
                  v-model.trim="payload.employment_start_date"
                  label="employment start date"
                  :offset="-250"
  
                  clearable
                  auto-apply
                  dark
                  formate="MM/dd/yyyy"
                  close-on-auto-apply
                /></span>
              <p
                v-if="validationRules($v.employment_start_date, 'Date').length > 0"
                class="text-error"
              >
                {{ validationRules($v.employment_start_date, ' تاریخ شروع')[0] }}
              </p>
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <p class="mb-1">
                د قرارداد د ختم نیټه
              </p>
  
              <span dir="ltr">
                <VueDatePicker
                  v-model.trim="payload.employment_end_date"
                  clearable
                  :offset="-250"
  
                  auto-apply
                  dark
                  formate="MM/dd/yyyy"
                  close-on-auto-apply
                />
              </span>
              <p
                v-if="validationRules($v.employment_end_date, 'Date').length > 0"
                class="text-error"
              >
                {{ validationRules($v.employment_end_date, 'د ختم نیټه')[0] }}
              </p>
            </VCol>
          </VRow>
          <VRow />
        </VCardText>
  
        <VCardText class="d-flex flex-wrap gap-4">
          <VBtn
            v-if="!isSubmited"
            :loading="apiLoading"
            @click="validateForm"
          >
            ایدیت
          </VBtn>
  
          <VBtn
            color="secondary"
            variant="tonal"
            @click="resetForm"
          >
            بیا تنظیمول
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </div>
</template>
  
<script setup>
import { required, numeric, minLength, email } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import useVuelidate from '@vuelidate/core'
import { ref, toRef } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import { toast } from 'vue3-toastify'
  
const props = defineProps({
  employeeInfo: {
    type: Object,
    default: () => {},
  },
  resetData: {
    type: Object,
    default: () => {},
  },
  updateChanges: {
    type: Function,
    default: () => {},
  },
})
const formRef = ref()
const apiLoading = ref(false)
  
const payload = toRef(props, 'employeeInfo')
  
// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate
  
const rules = {
  first_name: { required, minLength: minLength(3) },
 
  employment_start_date: { required },
  employment_end_date: { required },
 
  salary: { required, numeric },
}
  
const $v = useVuelidate(rules, payload)
  
const validateForm = async () => {
  formRef.value.validate()
  $v.value.$touch()
  if ($v.value.$invalid) {
    toast.error('مهربانی وکړې فورم صحیح ډک کړئ!')
  
    return false
  }
  submit()
}
  
async function submit() {
  try {
    apiLoading.value = true
  
    const data = JSON.parse(JSON.stringify(payload.value))
  
    await axios.put(`employees/${payload.value.id}`, data)
    props.updateChanges()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}
  
const resetForm = () => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    current_address,
    permenent_address,
    employment_start_date,
    employment_end_date,
    job_title,
    salary,
  } = props.resetData
  payload.value.first_name = first_name
  payload.value.last_name = last_name
  payload.value.email = email
  payload.value.phone_number = phone_number
  payload.value.current_address = current_address
  payload.value.permenent_address = permenent_address
  payload.value.employment_start_date = employment_start_date
  payload.value.employment_end_date = employment_end_date
  payload.value.job_title = job_title
  payload.value.salary = salary
  
  $v.value.$reset()
}
  
function convertToEnglishNumbers(model) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    payload.value[model] = payload.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
  }
}
</script>
  
  
  
    <style>
    .dp__input{
    padding: 12px 4px 12px 40px !important;
    }
  
    .dp__theme_dark ,.dp__theme_light  {
    --dp-background-color:  rgb(var(--v-theme-surface));
    --dp-text-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    --dp-hover-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
    --dp-hover-text-color: gba(var(--v-theme-on-surface),1);
    --dp-hover-icon-color: var(--v-theme-on-surface);
    --dp-primary-color: #40A579;
    --dp-primary-text-color:#fff;
    --dp-secondary-color: #8A8D93;
    --dp-border-color:rgba(var(--v-border-color), var(--v-border-opacity));
    --dp-menu-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
    --dp-border-color-hover:rgba(var(--v-border-color),var(--v-medium-emphasis-opacity) )
    --dp-border-radius:10px  !important;
    --dp-disabled-color:var(--v-disabled-opacity);
    --dp-scroll-bar-background: var(--v-theme-on-surface);
    --dp-scroll-bar-color: #484848;
    --dp-success-color: #00701a;
    --dp-success-color-disabled: #428f59;
    --dp-icon-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    --dp-danger-color: #e53935;
    --dp-highlight-color: rgba(0, 92, 178, 0.2);
    }
    </style>  
  
  