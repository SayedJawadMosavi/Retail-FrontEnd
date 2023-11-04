<template>
  <VExpandTransition>
    <div v-show="expand">
      <VCard
        title="ثبت خرید"
        class="my-5"
      >
        <VForm ref="formRef">
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              معلومات خرید:
            </p>

            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <span style="direction: ltr">
                  <VueDatePicker
                    v-model="payload.sell_date"
                    clearable
                    auto-apply
                    dark
                    close-on-auto-apply
                    formate="MM/dd/yyyy"
                  />
                </span>
                <p
                  v-if="validationRules($v.sell_date, 'Date').length > 0"
                  class="text-error"
                >
                  {{ validationRules($v.sell_date, 'Date')[0] }}
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VAutocomplete
                  v-model="payload.customer_id"
                  label="اسم مشتری"
                  prepend-inner-icon="mdi-account"
                  :items="Customers"
                  :item-title="ca => `${ca.first_name}`"
                  return-object
                  :loading="loadingCustomer"
                  :rules="validationRules($v.customer_id, 'اسم مشتری')"
                />
              </VCol>

              <VCol
                cols="12"
                md="12"
              >
                <VTextarea
                  v-model="payload.description"
                  label="توضیحات بیشتر"
                  prepend-inner-icon="mdi-info"
                />
              </VCol>
            </VRow>

            <VRow />
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              معلومات محصول:
            </p>

            <VRow
              v-for="(item, index) in payload.items"
              :key="index"
            >
              <VCol
                class="pb-0 pt-5"
                cols="12"
              >
                <div class="d-flex align-center">
                  <p class="mb-0 font-weight-medium pe-2">
                    شماره #{{ index + 1 }}
                  </p>
                  <VBtn
                    density="compact"
                    color="error"
                    size="small"
                    icon="mdi-minus"
                    :disabled="payload.items.length == 1"
                    @click="removeItem(index, 'items')"
                  />
                </div>
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VAutocomplete
                  v-model="item.stock_id"
                  label="اسم گدام"
                  prepend-inner-icon="mdi-account"
                  :items="stocks"
                  :item-title="pr => `${pr.name}`"
                  return-object
                  :loading="loadingStock"
                  :rules="validateCollection($v.items.$each.$response.$errors[index].stock_id, 'اسم گدام')"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VAutocomplete
                
                  v-model="item.product_id"
                  label="اسم محصول"
                  prepend-inner-icon="mdi-account"
                  :items="item.products"
                  :item-title="pr => `${pr.product.product_name} ${pr.quantity}`"
                  return-object
                  :loading="loadingProduct"
                  :rules="validateCollection($v.items.$each.$response.$errors[index].product_id, 'اسم محصول')"
                />
              </VCol>

              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model="item.quantity"
                  label="مقدار"
                  prepend-inner-icon="mdi-counter"
                  :rules="validateCollection($v.items.$each.$response.$errors[index].quantity, 'مقدار')"
                  dir="ltr"
                  @input="convertToEnglishNumbers('items', 'quantity', index)"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model="item.cost"
                  label="قیمت"
                  prepend-inner-icon="mdi-cash"
                  :rules="validateCollection($v.items.$each.$response.$errors[index].cost, 'قیمت')"
                  dir="ltr"
                  @input="convertToEnglishNumbers('items', 'cost', index)"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
            </VRow>

            <!-- {{ validationRules($v.items.$each.$response.$errors[0].name, 'قیمت فی کیلو') }} -->

            <div class="py-3">
              <VBtn
                size="small"
                @click="addMore('items')"
              >
                جدید<VIcon>mdi-plus</VIcon>
              </VBtn>
            </div>
          </VCardText>

          <!-- extra expense -->


          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              معلومات مالی:
            </p>

            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  prepend-inner-icon="mdi-cash-multiple"
                  readonly
                  :model-value="finalTotal"
                  label="ًمجموع کل"
                  dir="ltr"
                />
              </VCol>
            </VRow>

            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.paid_amount"
                  dir="ltr"
                  :rules="validationRules($v.paid_amount, 'مقدار پرداختی')"
                  s
                  prepend-inner-icon="mdi-cash-check"
                  label="مقدار پرداختی"
                  @input="convertToEnglishNumbers('paid_amount')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  dir="ltr"
                  prepend-inner-icon="mdi-cash-minus"
                  :model-value="remainder"
                  readonly
                  label="باقیمانده پول"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn
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
              بستن فورم
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
import { helpers, maxValue, minLength, minValue, numeric, required } from '@vuelidate/validators'
import { computed, ref } from 'vue'
import { toast } from 'vue3-toastify'

// ==================================== START PROPS =======================================

const props = defineProps({
  toggleExpand: { type: Function, default: () => {} },
  fetchRecord: { type: Function, default: () => {} },
})

// ==================================== START Computed =======================================


const itemTotalValue = computed(() => {
  const items = payload.value.items
  let totals = 0
  items.forEach(row => {
    totals += parseFloat(row.cost * row.quantity)
  })

  return totals
})
const finalTotal = computed(() => {
  try {
    const val =  parseFloat(itemTotalValue.value)

    return val?.toFixed(2)
  } catch (error) {
    console.error(error)

    return 0
  }
})

const remainder = computed(() => {
  return finalTotal.value - payload.value.paid_amount
})

// ==================================== START DATA =======================================

const loadingContainer = ref(false)
const containers = ref([])
const loadingCustomer = ref(false)
const products = ref([])
const Customers = ref([])
const loadingProduct = ref(false)
const loadingStock = ref(false)

const stocks = ref([])
const apiLoading = ref(false)
const isSubmited = ref(false)
const payload = ref({
  sell_date: new Date(),
  customer_id: null,

  paid_amount: 0,
  items: [
    {
      stock_id: null,
      product_id: null,
      quantity: 0,
      products: [],

      total: 0,
      cost: 0,
    },
  ],
 
})
const expand = ref(false)
const formRef = ref()

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate
const validateCollection = useRules.validateCollection
const rules = {
  sell_date: { required },


  customer_id: { required, minLength: minLength(2) },
  paid_amount: { required, minValue: minValue(0), maxValue: maxValue(finalTotal) },
  items: {
    $each: helpers.forEach({
      stock_id: { required },
      product_id: { required },
      quantity: { required, numeric, minValue: minValue(1) },
      cost: { required, numeric, minValue: minValue(1) },
    }),
  },
 
}

const $v = useVuelidate(rules, payload)



watch(
  () => payload.value.items.map(item => item.stock_id ? item.stock_id.id : null),
  
  (newStockIds, oldStockIds) => {
    newStockIds.forEach((stockId, index) => {
      if (stockId && stockId !== oldStockIds[index]) {
        getProduct(index)
      }
    })
  },
)

const downloadForm = () => {}
const resetForm = () => {
  payload.value = {
    sell_date: new Date(),
    container_id: null,
    description: null,
    rate: null,
    paid_amount: 0,

    description: null,
    items: [
      {
        product_id: null,
        quantity: 0,
        cost: null,

        total: null,
        products: [],
        stock_id: null,
      },
    ],
    extra_expense: [],
  }
  $v.value.$reset()
  formRef.value.resetValidation()
}

async function getCustomer() {
  try {
    loadingCustomer.value = true
    const { data } = await axios.get('customer-list')
    Customers.value = data
  } catch (error) {
    console.error('error', error)
  }
  loadingCustomer.value = false
}
async function getStock() {
  try {
    loadingProduct.value = true
    const { data } = await axios.get('stock-list')
    stocks.value = data
  } catch (error) {
    console.error('error', error)
  }
  loadingProduct.value = false
}

const getProduct = index => {
  const items = payload.value.items
  const stockId = items[index].stock_id
  axios.get('product-list/' + stockId.id).then(response => {
    items[index].products = response.data
  })
}
function openDialog() {
  expand.value = true

  getCustomer()
  getStock()
}

function closeDialog() {
  isSubmited.value = false
  expand.value = false
  resetForm()
}

function convertToEnglishNumbers(model, item = null, index = null) {
  var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  var englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    if (item == null) {
      payload.value[model] = payload.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
    } else {
      payload.value[model][index][item] = payload.value[model][index][item]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i)
    }
  }
}

async function submit() {
  try {
    apiLoading.value = true
    const res = await axios.post('sell', payload.value)
    isSubmited.value = true
    resetForm()
    props.fetchRecord()
    closeDialog()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

const addMore = type => {
  const items = payload.value[type]

  if (type == 'items') {
    items.push({
      stock_id: null,
      cost: 0,
      quantity: null,
      products: [],
      product_id: null,
      total: null,
    })
    const newIndex = items.length - 1
    getProduct(newIndex)
  } else if (type == 'extra_expense') {
    items.push({
      name: null,
      price: 0,
    })
  }
}
const removeItem = (index, type) => {
  const items = payload.value[type]
  items.splice(index, 1)
}

const validateForm = async () => {
  formRef.value.validate()

  if ($v.value.$invalid) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  submit()
}

// ==================================== START Expose =======================================

defineExpose({
  openDialog,
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
