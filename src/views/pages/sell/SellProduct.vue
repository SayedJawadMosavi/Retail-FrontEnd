<template>
  <VDialog
    v-model="stockshow"
    transition="dialog-top-transition"
    persistent
    class="v-dialog-sm"
  >
    <VCard title="نوی گدام">
      <VCardText>
        <VForm ref="stockformRef">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="stockForm.name"
                label="د ګدام نوم  "
                prepend-inner-icon="mdi-shopping-outline"
                :rules="validationRules(v$1.name, 'د ګدام نوم')"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="stockForm.address"
                label="پټه "
                prepend-inner-icon="mdi-account"
                :rules="validationRules(v$1.address, 'پټه')"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardText class="d-flex flex-wrap gap-4">
        <VBtn @click="validateStockForm">
          ذخیره
        </VBtn>

        <VBtn
          color="secondary"
          variant="tonal"
          @click="closeReset"
        >
          لغو
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
  <VDialog
    v-model="show"
    transition="dialog-top-transition"
    persistent
    class="v-dialog-sm"
  >
    <VCard title="نوی پیریدونکی">
      <VCardText>
        <VForm ref="customerformRef">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="formData.first_name"
                label="نوم "
                prepend-inner-icon="mdi-account"
                :rules="validationRules(v$2.first_name, 'نوم')"
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="formData.phone_number"
                dir="ltr"
                label="تیلفون شمیره"
                prepend-inner-icon="mdi-phone"
                @input="convertToEnglishNumbers('phone_number')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardText class="d-flex flex-wrap gap-4">
        <VBtn
          :loading="apiLoading2"
          @click="validateCustomerForm"
        >
          ثبتول
        </VBtn>

        <VBtn
          color="secondary"
          variant="tonal"
          @click="closeReset"
        >
          لغو
        </VBtn>
      </VCardText>
    </VCard>
    <PrintReportDialog
      ref="printRefs"
      v-model:print-item="printData"
      v-model:start-date="payload.start_date"
      v-model:end-date="payload.end_date"
      :title="title"
      :headers="headerss"
    />
  </VDialog>
  <VExpandTransition>
    <div v-show="expand">
      <VCard
        title="د خرڅ ثبت کول"
        class="my-5"
      >
        <VForm ref="formRef">
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              د خرڅ معلومات:
            </p>

            <VRow class="mb-3">
              <VCol
                cols="12"
                md="4"
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
                  {{ validationRules($v.sell_date, "Date")[0] }}
                </p>
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <VAutocomplete
                  v-model="payload.customer_id"
                  label="پیریدونکي نوم"
                  prepend-inner-icon="mdi-account"
                  :items="Customers"
                  :item-title="(ca) => `${ca.first_name}`"
                  return-object
                  :loading="loadingCustomer"
                  :rules="validationRules($v.customer_id, 'پیریدونکي نوم')"
                  @update:modelValue="showData"
                />
                <VBtn
                  density="compact"
                  class="mt-1"
                  color="success"
                  size="small"
                  icon="mdi-plus"
                  @click="addCustomer"
                />
              </VCol>
              <VCol
                v-if="flag == true"
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="payload.walkin_name"
                  label="نوم "
                  prepend-inner-icon="mdi-account"
                />
              </VCol>

              <VCol
                cols="12"
                md="12"
              >
                <VTextarea
                  v-model="payload.description"
                  label="نور تفصیل"
                  prepend-inner-icon="mdi-info"
                />
              </VCol>
            </VRow>

            <VRow />
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              د محصول معلومات:
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
                    شمیره #{{ index + 1 }}
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
                md="2"
              >
                <VAutocomplete
                  v-model="item.stock_id"
                  label="د ګدام نوم"
                  prepend-inner-icon="mdi-account"
                  :items="stocks"
                  :item-title="(pr) => `${pr.name}`"
                  return-object
                  :loading="loadingStock"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].stock_id,
                      'د ګدام نوم'
                    )
                  "
                />
                <VBtn
                  density="compact"
                  class="mt-1"
                  color="success"
                  size="small"
                  icon="mdi-plus"
                  @click="addStock"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
              >
                <VAutocomplete
                  v-model="item.product_id"
                  label="د محصول نوم"
                  prepend-inner-icon="mdi-account"
                  :items="item.products"
                  :item-title="
                    (pr) => `${pr.product.product_name} ${pr.carton_quantity} `
                  "
                  return-object
                  :loading="loadingProduct"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].product_id,
                      'د محصول نوم'
                    )
                  "
                  @update:modelValue="Calculate2(index, item)"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model="item.income_price"
                  label="د هر کارتن تمام شد قیمت"
                  prepend-inner-icon="mdi-cash"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].income_price,
                      'د هر کارتن تمام شد قیمت'
                    )
                  "
                  dir="ltr"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model="item.cost"
                  label="د خرڅ قیمت"
                  prepend-inner-icon="mdi-cash"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].cost,
                      'د خرڅ قیمت'
                    )
                  "
                  dir="ltr"
                  @update:modelValue="getAmount(index, item)"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model="item.quantity"
                  label="اندازه په کارتن"
                  prepend-inner-icon="mdi-counter"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].quantity,
                      'اندازه په کارتن'
                    )
                  "
                  dir="ltr"
                  @update:modelValue="getAmount(index, item)"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model="item.total"
                  label="مجموعه"
                  prepend-inner-icon="mdi-cash"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].total,
                      'مجموعه'
                    )
                  "
                  dir="ltr"
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
                نوی<VIcon>mdi-plus</VIcon>
              </VBtn>
            </div>
          </VCardText>

          <!-- extra expense -->

          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              مالی معلومات:
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
                  label="مجموعه د ټول"
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
                  :rules="validationRules($v.paid_amount, ' ورکړل شوې پيسې اندازه')"
                  s
                  prepend-inner-icon="mdi-cash-check"
                  label=" ورکړل شوې پيسې اندازه"
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
                  label="پاتي پیسي"
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
              فورم بندول
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </div>
  </VExpandTransition>
</template>

<script setup>
import { axios } from "@/plugins/axios-plugin"
import useRules from "@/plugins/vuelidate/vuelidateRules"
import { useVuelidate } from "@vuelidate/core"
import {
  helpers,
  maxValue,
  minLength,
  minValue,
  numeric,
  required,
} from "@vuelidate/validators"
import { computed, ref } from "vue"
import { toast } from "vue3-toastify"

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
    totals += parseFloat(row.total)
  })

  return totals
})
const finalTotal = computed(() => {
  try {
    const val = parseFloat(itemTotalValue.value)

    return val?.toFixed(2)
  } catch (error) {
    console.error(error)

    return 0
  }
})

const remainder = computed(() => {
  const FinalTotal = finalTotal.value - payload.value.paid_amount

  return FinalTotal.toFixed(2)
})

// ==================================== START DATA =======================================

const loadingContainer = ref(false)
const containers = ref([])
const loadingCustomer = ref(false)
const flag = ref(false)
const products = ref([])
const Customers = ref([])
const loadingProduct = ref(false)
const loadingStock = ref(false)
const show = ref(false)
const stockshow = ref(false)
const customerformRef = ref()
const stockformRef = ref()
const stocks = ref([])
const apiLoading = ref(false)
const isSubmited = ref(false)
const formData = ref({
  first_name: "",
  phone_number: "",
})
const stockForm = ref({
  name: "",
  address: "",
})
const payload = ref({
  sell_date: new Date(),
  customer_id: null,
  walkin_name: null,

  paid_amount: 0,

  items: [
    {
      stock_id: null,
      product_id: null,
      carton_amount: null,
      quantity: 0,
      income_price: 0,
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
const customerRule = {
  first_name: { required },
}

const v$2 = useVuelidate(customerRule, formData)
const rules = {
  sell_date: { required },

  customer_id: { required, minLength: minLength(2) },
  paid_amount: { required, minValue: minValue(0), maxValue: maxValue(finalTotal) },
  items: {
    $each: helpers.forEach({
      stock_id: { required },
      product_id: { required },
      income_price: { required },
      total: { required },

      quantity: { required, numeric, minValue: minValue(1) },
      cost: { required, numeric, minValue: minValue(1) },
    }),
  },
}

const $v = useVuelidate(rules, payload)
const stockRule = {
  name: { required },
  address: { required },
}
const addStock = type => {
  stockshow.value = true
}
const v$1 = useVuelidate(stockRule, stockForm)

watch(
  () => payload.value.items.map(item => (item.stock_id ? item.stock_id.id : null)),

  (newStockIds, oldStockIds) => {
    newStockIds.forEach((stockId, index) => {
      if (stockId && stockId !== oldStockIds[index]) {
        getProduct(index)
      }
    })
  },
)
const resetstockForm = () => {
  stockForm.value = {
    name: null,
    address: null,
  }
  v$1.value.$reset()
  stockformRef.value.resetValidation()
}
const resetCustomerForm = () => {
  formData.value = {
    first_name: null,
    phone_number: null,
  }
  v$2.value.$reset()
  customerformRef.value.resetValidation()
}
const downloadForm = () => {}
const resetForm = () => {
  payload.value = {
    sell_date: new Date(),
    container_id: null,
    description: null,
    rate: null,
    walkin_name: null,
    paid_amount: 0,

    description: null,
    items: [
      {
        product_id: null,
        quantity: 0,
        cost: null,
        income_price: null,
        carton_amount: null,

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
const addCustomer = type => {
  show.value = true
}
const closeReset = type => {
  show.value = false
  stockshow.value = false
  getCustomer()
  getStock()
}
const getAmount = (index, item) => {
  const items = payload.value.items
  const total = item.quantity * item.cost
  items[index].total = total.toFixed(2)
}
const showData = value => {
  console.log("ss", value.type)
  if (value.type == "walkin") {
    flag.value = true
  } else {
    flag.value = false
  }
}
async function getCustomer() {
  try {
    loadingCustomer.value = true
    const { data } = await axios.get("customer-list")
    Customers.value = data
  } catch (error) {
    console.error("error", error)
  }
  loadingCustomer.value = false
}
async function getStock() {
  try {
    loadingProduct.value = true
    const { data } = await axios.get("stock-list")
    stocks.value = data
  } catch (error) {
    console.error("error", error)
  }
  loadingProduct.value = false
}
const Calculate2 = (index, item) => {
  try {
    const items = payload.value.items
    console.log("dfgfdgdf", item)
    axios
      .get("get-product-alarm/" + item.product_id.product.id)
      .then(function (response) {
        items[index].income_price = response.data.product.per_carton_cost
        items[index].cost = response.data.product.sell_price
      })
    axios.get("get-product-stock-list/" + item.product_id.id).then(function (response) {
      console.log(response.data.carton_amount)
      items[index].carton_amount = response.data.carton_quantity
    })
  } catch (error) {
    console.error("error", error)
  }
}
const getProduct = index => {
  const items = payload.value.items
  const stockId = items[index].stock_id
  axios.get("product-list/" + stockId.id).then(response => {
    const filteredProducts = response.data.filter(pr => pr.carton_quantity > 0)

    items[index].products = filteredProducts
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
      payload.value[model] = payload.value[model]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i)
    } else {
      payload.value[model][index][item] = payload.value[model][index][item]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i)
    }
  }
}
async function submitStock() {
  try {
    if (stockForm.value.id) await axios.put("stock/id", stockForm.value)
    else await axios.post("stock", stockForm.value)

    getStock()
    resetstockForm()

    stockshow.value = false
  } catch (error) {
    console.error("error", error)
    toast.error(" مشکل په سرور کښی موجود دی!")
  }
}
const validateStockForm = async () => {
  stockformRef.value.validate()
  v$1.value.$touch()
  if (v$1.value.$invalid) {
    toast.error("مهربانی وکړې فورم صحیح ډک کړئ!")

    return false
  }
  submitStock()
  v$1.value.$reset()
}
async function submitCustomer() {
  try {
    apiLoading.value = true
    if (formData.value.id) await axios.put("customer/id", formData.value)
    else await axios.post("customer", formData.value)

    getCustomer()
    resetCustomerForm()
    isSubmited.value = false
    show.value = false
  } catch (error) {
    console.error("error", error)
    toast.error(" مشکل په سرور کښی موجودی دي !")
  }
  apiLoading.value = false
}
const validateCustomerForm = async () => {
  customerformRef.value.validate()
  v$2.value.$touch()
  if (v$2.value.$invalid) {
    toast.error("مهربانی وکړې فورم صحیح ډک کړئ!")

    return false
  }
  submitCustomer()
  v$2.value.$reset()
}
async function submit() {
  try {
    apiLoading.value = true
    const res = await axios.post("sell", payload.value)
    isSubmited.value = true
    resetForm()
    props.fetchRecord()
    closeDialog()
  } catch (error) {
    console.error("error", error)
  }
  apiLoading.value = false
}

const addMore = type => {
  const items = payload.value[type]

  if (type == "items") {
    items.push({
      stock_id: null,
      cost: 0,
      quantity: null,
      products: [],
      product_id: null,
      income_price: null,
      total: null,
      amount: null,
    })
    const newIndex = items.length - 1
    getProduct(newIndex)
  } else if (type == "extra_expense") {
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
    toast.error("مهربانی وکړې فورم صحیح ډک کړئ!")

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
