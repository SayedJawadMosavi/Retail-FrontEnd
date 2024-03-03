<template>
  <VExpandTransition>
    <div v-show="expand">
      <VCard>
        <VForm ref="formRef">
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              معلومات
            </p>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="4"
              >
                <VAutocomplete
                  v-model="formData.product"
                  label="محصول"
                  prepend-inner-icon="mdi-account"
                  :items="products"
                  :item-title="ca => `${ca.product_name}`"
                  return-object
                  :loading="loadingProduct"
                  :rules="validationRules(v$.product, 'محصول')"
                  @update:modelValue="getProductsId"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  :model-value="formData?.product?.quantity"
                  dir="rtl"
                  prepend-inner-icon="mdi-counter"
                  :class="formData?.product?.quantity > 0 ? 'text-success' : 'text-error'"
                  readonly
                  label="  موجود"
                  @input="convertToEnglishNumbers('quantity_exist')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  :model-value="formData?.product?.carton_amount"
                  dir="rtl"
                  :class="formData?.product?.carton_amount > 0 ? 'text-success' : 'text-error'"
                  prepend-inner-icon="mdi-counter"
                  readonly
                  label="د کارتن موجود"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <VAutocomplete
                  v-model="formData.stock"
                  label="گدام"
                  prepend-inner-icon="mdi-account"
                  :items="stocks"
                  :item-title="ca => `${ca.name}`"
                  return-object
                  :loading="loadingStock"
                  :rules="validationRules(v$.stock, 'گدام')"
                  @update:modelValue="getAlarm"
                />
              </VCol>
              <VCol cols="4">
                <VTextField
                  v-model="formData.carton_quantity"
                  prepend-inner-icon="mdi-counter"
                  label="د کارتن تعداد"
                  :rules="validationRules(v$.product, 'د کارتن تعداد')"
                  dir="ltr"
                  @update:modelValue="CalculatQuantity"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol cols="4">
                <VTextField
                  v-model="formData.alarm_amount"
                  prepend-inner-icon="mdi-counter"
                  label="د گدام اندازه اخطاروی"
                  dir="ltr"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="12"
              >
                <VTextarea
                  v-model="formData.description"
                  label=" تفصیل"
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
              <VIcon
                start
                icon="mdi-checkbox-marked-circle"
              />
              ذخیره
            </VBtn>

            <VBtn
              color="red"
              variant="tonal"
              @click="closeDialog"
            >
              <VIcon
                start
                icon="mdi-cancel"
              />
              کینسل
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
import { required } from '@vuelidate/validators'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

// =============================start props==============
const props = defineProps({
  toggleExpand: { type: Function, default: () => {} },
  fetchRecord: { type: Function, default: () => {} },
})

// =======================> starts states <===============================

const expand = ref(false)
const loadingStock = ref(false)
const stocks = ref([])
const loadingProduct = ref(false)
const products = ref([])

const apiLoading = ref(false)
const isSubmited = ref(false)
const formRef = ref()
const formData = ref({
  product: '',

  quantity_exist: '',
  product_id: '',
  carton_amount: '',
  carton_quantity: '',
  stock: '',
  amount: '',
  alarm_amount: '',
  description: '',
})

///   |=============================> start validation <==============================|
const validationRules = useRules.validate

const rules = {
  product: { required },
  amount: { required },

  carton_quantity: { required },

  stock: { required },
}

const v$ = useVuelidate(rules, formData)

// |===================================> start Methods   <==================
const closeDialog = () => {
  isSubmited.value = false
  expand.value = false
  v$.value.$reset()
  resetForm()
}
async function getStocks() {
  try {
    loadingStock.value = true
    const { data } = await axios.get('stock-list')

    stocks.value = data
  } catch (error) {
    console.error('error', error)
  }
  loadingStock.value = false
}
async function getProducts() {
  try {
    loadingStock.value = true
    const { data } = await axios.get('product-list')

    products.value = data
  } catch (error) {
    console.error('error', error)
  }
  loadingStock.value = false
}
async function submit() {
  try {
    apiLoading.value = true
    if (formData.value.id) await axios.put('product_stocks_transfer/id', formData.value)
    else await axios.post('product_stocks_transfer', formData.value)

    isSubmited.value = false
    expand.value = false
    resetForm()
    props.fetchRecord()
  } catch (error) {
    console.error('error', error)
    toast.error(' مشکل په سرور کی موجود دي!')
  }
  apiLoading.value = false
}

function toggleDialog(item = null) {
  getStocks()
  getProducts()
  if (item) {
    formData.value = JSON.parse(JSON.stringify(item))
    formData.value.amount = item.quantity
  }
  expand.value = true
}

const resetForm = () => {
  formData.value = {
    product: null,
    stock: null,
    amount: null,
    alarm_amount: null,

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
const CalculatQuantity = value => {
  const total_price = parseFloat(value * formData.value.carton_amount)
  formData.value.amount = total_price.toFixed(2)
}
const getProductsId = value => {
  try {
    loadingProduct.value = true

    axios.get('get-product-alarm/' + value.id).then(function (response) {
      formData.value.product_id = value.id

      formData.value.alarm_amount = response.data.product.alarm_amount

      loadingProduct.value = false
    })
    axios.get('get-product-list/' + value.id).then(function (response) {
      formData.value.carton_amount = response.data.carton_quantity
   
    })
  } catch (error) {
    console.error('error', error)
  }
}

const getAlarm = value => {
  try {
    loadingProduct.value = true

    axios.get('get-product-alarm-amount/' + value.id + '/' + formData.value.product_id).then(function (response) {
      formData.value.alarm_amount = response.data.alarm_amount
      formData.value.product_id = response.data.product_id

      loadingProduct.value = false
    })
  } catch (error) {
    console.error('error', error)
  }
}
const validateForm = async () => {
  formRef.value.validate()
  v$.value.$touch()
  if (v$.value.$invalid) {
    toast.error('مهربانی وکړې فورم صحیح ډک کړئ!')

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
