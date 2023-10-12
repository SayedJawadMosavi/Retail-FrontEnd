<template>
    <VExpandTransition>
      <div v-show="expand">
        <VCard>
          <VForm ref="formRef">
            <VCardText>
              <p class="text-base font-weight-medium mt-2">
                معلومات شخصی
              </p>
              <VRow class="mb-3">
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.first_name"
                    label="اسم "
                    prepend-inner-icon="mdi-account"
                    :rules="validationRules(v$.first_name, 'اسم')"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.last_name"
                    label="تخلص "
                    prepend-inner-icon="mdi-account"
                    :rules="validationRules(v$.last_name, 'تخلص')"
                  />
                </VCol>
  
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.job_title"
                    label="عنوان وظیفه"
                    prepend-inner-icon="mdi-work"
                    :rules="validationRules(v$.job_title, 'عنوان وظیفه')"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.email"
                    label="ایمیل آدرس"
                    prepend-inner-icon="mdi-email"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.phone_number"
                    dir="ltr"
                    label="شماره تلفن"
                    prepend-inner-icon="mdi-phone"
                    :rules="validationRules(v$.phone_number, 'شماره تلفن')"
                    @input="convertToEnglishNumbers('phone_number')"
                    @keypress="useRules.preventNonNumeric"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.current_address"
                    label="آدرس فعلی"
                    prepend-inner-icon="mdi-home"
                    :rules="validationRules(v$.current_address, 'آدرس فعلی')"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.permenent_address"
                    label="آدرس دائمی"
                    prepend-inner-icon="mdi-home"
                    :rules="validationRules(v$.permenent_address, 'آدرس دايمی')"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.salary"
                    dir="ltr"
                    label="معاش"
                    prepend-inner-icon="mdi-money"
                    :rules="validationRules(v$.salary, 'معاش')"
                    @input="convertToEnglishNumbers('salary')"
                    @keypress="useRules.preventNonNumeric"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <p class="mb-1">
                    تاریخ شروع قرارداد
                  </p>
                  <span dir="ltr">
                    <VueDatePicker
                      v-model="formData.employment_start_date"
                      :offset="-250"
                      label="employment start date"
                      clearable
                      auto-apply
                      dark
                      formate="MM/dd/yyyy"
                      close-on-auto-apply
                    /></span>
  
                  <p
                    v-if="validationRules(v$.employment_start_date, 'Date').length > 0"
                    class="text-error"
                  >
                    {{ validationRules(v$.employment_start_date, ' تاریخ شروع')[0] }}
                  </p>
                </VCol>
  
                <VCol
                  cols="12"
                  md="6"
                >
                  <p class="mb-1">
                    تاریخ ختم قرارداد
                  </p>
                  <span dir="ltr">
                    <VueDatePicker
                      v-model="formData.employment_end_date"
                      :offset="-250"
                      clearable
                      auto-apply
                      dark
                      formate="MM/dd/yyyy"
                      close-on-auto-apply
                    /></span>
  
                  <p
                    v-if="validationRules(v$.employment_end_date, 'Date').length > 0"
                    class="text-error"
                  >
                    {{ validationRules(v$.employment_end_date, 'تاریخ ختم')[0] }}
                  </p>
                </VCol>
              </VRow>
              <VRow />
            </VCardText>
  
            <!-- 👉 Action Buttons -->
            <VCardText class="d-flex flex-wrap gap-4">
              <VBtn
                v-if="!isSubmited"
                :loading="apiLoading"
                @click="validateForm"
              >
                ذخیره
              </VBtn>
  
              <VBtn
                color="secondary"
                variant="tonal"
                @click="closeDialog"
              >
                لغو
              </VBtn>
            </VCardText>
          </VForm>
        </VCard>
      </div>
    </VExpandTransition>
  </template>
  
  <script setup>
  import { axios } from '@/plugins/axios-plugin'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import { useVuelidate } from '@vuelidate/core'
import { minLength, numeric, required } from '@vuelidate/validators'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
  
    
  // =============================start props==============
  const props = defineProps({
    toggleExpand: { type: Function, default: () => {} },
    fetchRecord: { type: Function, default: () => {} },
  })
  
  // =======================> starts states <===============================
  
  const expand = ref(false)
  
  const apiLoading = ref(false)
  const isSubmited = ref(false)
  
  const formRef = ref()
  const formData = ref({
  
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    gender: 'male',
    current_address: '',
    permenent_address: '',
    employment_start_date: new Date(),
    employment_end_date: new Date(),
    job_title: ' ',
    salary: 0,
  })
  
  ///   |=============================> start validation <==============================|
  const validationRules = useRules.validate
  
  const rules = {
    first_name: { required, minLength: minLength(3) },
    last_name: { required, minLength: minLength(3) },
    phone_number: { required, minLength: minLength(10) },
    current_address: { required, minLength: minLength(3) },
    permenent_address: { required, minLength: minLength(3) },
    employment_start_date: { required },
    employment_end_date: { required },
    job_title: { required, minLength: minLength(3) },
    salary: { required, numeric },
  
  }
  
  const v$ = useVuelidate(rules, formData)
  
  // |===================================> start Methods   <==================
  const closeDialog = () => {
    isSubmited.value = false
    expand.value = false
    v$.value.$reset()
    resetForm()
  
  }
  
  async function submit() {
    try {
      apiLoading.value = true
      const res = await axios.post('employees', formData.value)
      
      toast.success('کارمند به موفقیت اضافه شد!')
      isSubmited.value = false
      expand.value = false
  
      props.fetchRecord()
    } catch (error) {
      console.error('error', error)
      toast.error('خطا ای رخ داد!')
    }
    apiLoading.value = false
  }
  
  function toggleDialog($param) {
    expand.value = !expand.value
  }
  
  const resetForm = () => {
    formData.value = {
      first_name: null,
      last_name: null,
      email: null,
      gender: null,
      current_address: null,
      permenent_address: null,
      employment_start_date: new Date(),
      employment_end_date: new Date(),
      job_title: null,
      salary: null,
    }
    v$.value.$reset()
    formRef.value.resetValidation()
    
  }
  
  function convertToEnglishNumbers(model, item = null, index = null) {
  
    var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
    var englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
    for (let i = 0; i < 10; i++) {
      if (item == null) {
        formData.value[model] = formData.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
      } else {
        formData.value[model][index][item] = formData.value[model][index][item]
          .replace(persianNumbers[i], i)
          .replace(englishNumbers[i], i)
      }
    }
  }
  
  const validateForm = async () => {
    formRef.value.validate()
    v$.value.$touch()
    if (v$.value.$invalid) {
      toast.error('لطفأ فورم را دقیق خانه پری کنید!')
      
      return false
    }
    submit()
    v$.value.$reset()
  }
  
  defineExpose({
    toggleDialog,
  })
  </script>
  
  <style>
  .dp__input {
    padding: 12px 4px 12px 40px !important;
  }
  
  .dp__theme_dark,
  .dp__theme_light {
    --dp-background-color: rgb(var(--v-theme-surface));
    --dp-text-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    --dp-hover-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
    --dp-hover-text-color: gba(var(--v-theme-on-surface), 1);
    --dp-hover-icon-color: var(--v-theme-on-surface);
    --dp-primary-color: #40A579;
    --dp-primary-text-color: #fff;
    --dp-secondary-color: #8A8D93;
    --dp-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
    --dp-menu-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
    --dp-border-color-hover: rgba(var(--v-border-color), var(--v-medium-emphasis-opacity)) --dp-border-radius:10px !important;
    --dp-disabled-color: var(--v-disabled-opacity);
    --dp-scroll-bar-background: var(--v-theme-on-surface);
    --dp-scroll-bar-color: #484848;
    --dp-success-color: #00701a;
    --dp-success-color-disabled: #428f59;
    --dp-icon-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    --dp-danger-color: #e53935;
    --dp-highlight-color: rgba(0, 92, 178, 0.2);
  }
  </style>
  