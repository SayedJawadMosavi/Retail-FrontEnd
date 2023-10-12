<template>
    <VExpandTransition>
      <div v-show="expand">
        <VCard>
          <VForm ref="formRef">
            <VCardText>
              <p class="text-base font-weight-medium mt-2">معلومات</p>
              <VRow class="mb-3">
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.product_name"
                    label="اسم محصول "
                    prepend-inner-icon="mdi-shopping-outline"
                    :rules="validationRules(v$.product_name, 'اسم محصول')"
                  />
                </VCol>
  
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.company_name"
                    label="اسم کمپنی "
                    prepend-inner-icon="mdi-account"
                    :rules="validationRules(v$.company_name, 'اسم کمپنی')"
                  />
                </VCol>
               
                <VCol
                cols="12"
                md="6"
              >
                <v-autocomplete
                  v-model="formData.category_id"
                  label="کتگوری"
             
                  prepend-inner-icon="mdi-account"
                  :items="Categories"
                  :item-title="ca => `${ca.name}`"
                  return-object
                  :loading="loadingCategory"
                  :rules="validationRules(v$.category_id, 'کتگوری')"
                ></v-autocomplete>
              </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.code"
                    dir="ltr"
                    label="کود"
                    prepend-inner-icon="mdi-code-equal"
                    :rules="validationRules(v$.code, 'کود')"
                    @input="convertToEnglishNumbers('code')"
                    @keypress="useRules.preventNonNumeric"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.color"
                    label="رنگ"
                    prepend-inner-icon="mdi-eyedropper-variant"
                 
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="formData.size"
                    label="سایز"
                    prepend-inner-icon="mdi-size-s"
                 
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="12"
                >
                  <VTextarea
                    v-model="formData.description"
                    label=" توضیحات"
                    prepend-inner-icon="mdi-info"
                  />
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
                <v-icon
                  start
                  icon="mdi-checkbox-marked-circle"
                ></v-icon>
                ذخیره
              </VBtn>
  
              <VBtn
                color="red"
                variant="tonal"
                @click="closeDialog"
              >
                <v-icon
                  start
                  icon="mdi-cancel"
                ></v-icon>
                کنسل
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
import { minLength, required } from '@vuelidate/validators'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
  
  // =============================start props==============
  const props = defineProps({
    toggleExpand: { type: Function, default: () => {} },
    fetchRecord: { type: Function, default: () => {} },
  })
  
  // =======================> starts states <===============================
  
  const expand = ref(false)
const loadingCategory = ref(false)
  
  const apiLoading = ref(false)
  const isSubmited = ref(false)
  const Categories = ref([])
  const formRef = ref()
  const formData = ref({
    product_name: '',
    company_name: '',
    code: '',
    category_id: '',
    color: '',
    size: '',
    description: '',
  })
  
  ///   |=============================> start validation <==============================|
  const validationRules = useRules.validate
  
  const rules = {
    product_name: { required, minLength: minLength(3) },
    company_name: { required, minLength: minLength(3) },
    category_id: { required},
    code: { required },
  }
  
  const v$ = useVuelidate(rules, formData)
  
  // |===================================> start Methods   <==================
  const closeDialog = () => {
    isSubmited.value = false
    expand.value = false
    v$.value.$reset()
    resetForm()
  }
  async function getCategory() {
  try {
    loadingCategory.value = true
    const { data } = await axios.get('category-list')

    Categories.value = data
  } catch (error) {
    console.error('error', error)
  }
  loadingCategory.value = false
}
  async function submit() {
    try {
      apiLoading.value = true
      if (formData.value.id) await axios.put('product/id', formData.value)
      else await axios.post('product', formData.value)
  
     
      isSubmited.value = false
      expand.value = false
  
      props.fetchRecord()
    } catch (error) {
      console.error('error', error)
      toast.error(' مشکل در سرور وجود دارد !')
    }
    apiLoading.value = false
  }
  
  function toggleDialog(item = null) {
    getCategory();
    if (item) {
      formData.value = JSON.parse(JSON.stringify(item))
      formData.value.category_id = item.category.name
    }
    expand.value = true
  }
  
  const resetForm = () => {
    formData.value = {
        product_name: null,
      company_name: null,
      category_id: null,
      size: null,
      color: null,
      description: null,
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
      toast.error('لطفا فورم را دقیق خانه پری کنید!')
  
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
  