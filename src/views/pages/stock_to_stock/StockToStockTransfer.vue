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
                <v-autocomplete
                  v-model="formData.sender"
                  @update:modelValue="Calculate"
                  label="ازگدام"
                  prepend-inner-icon="mdi-account"
                  :items="stocks"
                  :item-title="ca => `${ca.name}`"
                  return-object
                  :loading="loadingStock"
                  :rules="validationRules(v$.sender, 'ازگدام')"
                ></v-autocomplete>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <v-autocomplete
                  v-model="formData.product"
                  label="محصول"
                  prepend-inner-icon="mdi-account"
                  :items="products"
                  :item-title="ca => `${ca.product.product_name}  ${ca.quantity}`"
                  return-object
                  :loading="loadingProduct"
                  :rules="validationRules(v$.product, 'محصول')"
                ></v-autocomplete>
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <v-autocomplete
                  v-model="formData.receiver"
                  label="به گدام"
                  prepend-inner-icon="mdi-account"
                  :items="Tostocks"
                  :item-title="ca => `${ca.name}`"
                  return-object
                  :loading="loadingStock2"
                  :rules="validationRules(v$.receiver, 'به گدام')"
                ></v-autocomplete>
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.amount"
                  dir="rtl"
                  label="مقدار"
                  prepend-inner-icon="mdi-code-equal"
                  :rules="validationRules(v$.amount, 'مقدار')"
                  @input="convertToEnglishNumbers('amount')"
                  @keypress="useRules.preventNonNumeric"
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
const loadingStock2 = ref(false)
const stocks = ref([])
const Tostocks = ref([])
const loadingProduct = ref(false)
const products = ref([])

const apiLoading = ref(false)
const isSubmited = ref(false)
const formRef = ref()
const formData = ref({
  product: '',

  quantity_exist: '',
  sender: '',
  receiver: '',
  amount: '',
  description: '',
})

///   |=============================> start validation <==============================|
const validationRules = useRules.validate

const rules = {
  product: { required },
  amount: { required },

  sender: { required },
  receiver: { required },
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

const Calculate = value => {
  try {
    loadingStock.value = true

    axios.get('product-list/' + value.id).then(function (response) {
      products.value = response.data

      loadingStock.value = false
    })
    axios.get('stock-list/' + value.id).then(function (response) {
      Tostocks.value = response.data

      loadingStock2.value = false
    })
  } catch (error) {
    console.error('error', error)
  }
}
async function submit() {
  try {
    apiLoading.value = true
    if (formData.value.id) await axios.put('stock_to_stocks_transfer/id', formData.value)
    else await axios.post('stock_to_stocks_transfer', formData.value)

    isSubmited.value = false
    expand.value = false
    resetForm()
    props.fetchRecord()
  } catch (error) {
    console.error('error', error)
    toast.error(' مشکل در سرور وجود دارد !')
  }
  apiLoading.value = false
}

function toggleDialog(item = null) {
  getStocks()

  if (item) {
    formData.value = JSON.parse(JSON.stringify(item))
    formData.value.amount = item.quantity
    console.log('fdbdfbdf',item.product_stock.product.product_name)
    // axios.get('product-list').then(function (response) {
    //   products.value = response.data
    // })
    formData.value.product = item.product_stock.product.product_name
  }
  expand.value = true
}

const resetForm = () => {
  formData.value = {
    product: null,
    sender: null,
    receiver: null,
    amount: null,

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
