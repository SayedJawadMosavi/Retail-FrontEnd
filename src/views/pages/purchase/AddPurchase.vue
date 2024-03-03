<template>
  <VDialog
    v-model="showProduct"
    transition="dialog-top-transition"
    persistent
    class="v-dialog-sm"
  >
    <VCard title=" نوی محصول">
      <VCardText>
        <VForm ref="ProductformRef">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="ProductForm.product_name"
                label="د محصول نوم "
                prepend-inner-icon="mdi-shopping-outline"
                :rules="validationRules(v$1.product_name, 'د محصول نوم')"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="ProductForm.carton_quantity"
                dir="ltr"
                label="اندازه په کارتن"
                :rules="validationRules(v$1.carton_quantity, 'اندازه په کارتن')"
                prepend-inner-icon="mdi-code-equal"
                @input="convertToEnglishNumbers('code')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
            <VCol cols="12">
              <VAutocomplete
                v-model="ProductForm.category_id"
                label="کتگوری"
                prepend-inner-icon="mdi-account"
                :items="Categories"
                :item-title="(ca) => `${ca.name}`"
                return-object
                :loading="loadingCategory"
                :rules="validationRules(v$1.category_id, 'کتگوری')"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardText class="d-flex flex-wrap gap-4">
        <VBtn @click="validateProductForm">
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
  <VDialog
    v-model="show"
    transition="dialog-top-transition"
    persistent
    class="v-dialog-sm"
  >
    <VCard title="نوی عرضه کونکی">
      <VCardText>
        <VForm ref="VendorformRef">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="formData.organization_name"
                label="کمپنی نوم "
                prepend-inner-icon="mdi-account"
                :rules="validationRules(v$2.organization_name, 'کمپنی نوم')"
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="formData.name"
                label="ارتباطی شخص "
                prepend-inner-icon="mdi-account"
                :rules="validationRules(v$2.name, 'ارتباطی شخص')"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardText class="d-flex flex-wrap gap-4">
        <VBtn
          :loading="apiLoading2"
          @click="validateVendorForm"
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
        title="د اخیستل ثبتول"
        class="my-5"
      >
        <VForm ref="formRef">
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              د اخیستل معلومات:
            </p>

            <VRow class="mb-3">
              <VCol
                cols="12"
                md="3"
              >
                <span style="direction: ltr">
                  <VueDatePicker
                    v-model="payload.purchase_date"
                    clearable
                    auto-apply
                    dark
                    close-on-auto-apply
                    formate="MM/dd/yyyy"
                  />
                </span>
                <p
                  v-if="validationRules($v.purchase_date, 'Date').length > 0"
                  class="text-error"
                >
                  {{ validationRules($v.purchase_date, "Date")[0] }}
                </p>
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <VAutocomplete
                  v-model="payload.container_id"
                  label="کانټینر"
                  prepend-inner-icon="mdi-truck-fast"
                  :items="containers"
                  :item-title="(ca) => `${ca.name}`"
                  return-object
                  :loading="loadingContainer"
                  :rules="validationRules($v.container_id, 'کانټینر')"
                />
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <VAutocomplete
                  v-model="payload.vendor_id"
                  label="د سوداګر نوم"
                  prepend-inner-icon="mdi-account"
                  :items="vendors"
                  :item-title="(ca) => `${ca.name}`"
                  return-object
                  :loading="loadingVendor"
                  :rules="validationRules($v.vendor_id, 'د سوداګر نوم')"
                />
                <VBtn
                  density="compact"
                  class="mt-1"
                  color="success"
                  size="small"
                  icon="mdi-plus"
                  @click="addVendor"
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
                  v-model="item.product_id"
                  label="د محصول نوم"
                  prepend-inner-icon="mdi-account"
                  :items="products"
                  :item-title="(pr) => `${pr.product_name}`"
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
                <VBtn
                  density="compact"
                  class="mt-1"
                  color="success"
                  size="small"
                  icon="mdi-plus"
                  @click="addProduct"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model="item.rate"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].rate,
                      'د تبادلی نرخ'
                    )
                  "
                  prepend-inner-icon="mdi-cash"
                  label="د تبادلی نرخ"
                  dir="ltr"
                  @update:modelValue="getprice(index, item)"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model="item.carton"
                  label="جمله په کارتن"
                  prepend-inner-icon="mdi-counter"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].carton,
                      'جمله په کارتن'
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
                  v-model="item.carton_amount"
                  label="تعداد په کارتن"
                  prepend-inner-icon="mdi-counter"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].carton_amount,
                      'تعداد په کارتن'
                    )
                  "
                  dir="ltr"
                  readonly
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
                  label="جمله دانه"
                  prepend-inner-icon="mdi-counter"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].quantity,
                      'جمله دانه'
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
                  label="قیمت په ین"
                  prepend-inner-icon="mdi-cash"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].cost,
                      'قیمت په ین'
                    )
                  "
                  dir="ltr"
                  @update:modelValue="getprice(index, item)"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model="item.expense"
                  label="مصرف"
                  prepend-inner-icon="mdi-counter"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].expense,
                      'مصرف'
                    )
                  "
                  dir="ltr"
                  @update:modelValue="getprice(index, item)"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model="item.per_carton_cost"
                  label="دیوکارتن قیمت"
                  prepend-inner-icon="mdi-cash"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].per_carton_cost,
                      'دیوکارتن قیمت'
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
                  v-model="item.sell_price"
                  label="د خرڅ قیمت"
                  prepend-inner-icon="mdi-cash"
                  :rules="
                    validateCollection(
                      $v.items.$each.$response.$errors[index].sell_price,
                      'د خرڅ قیمت'
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
              اضافی مصرف:
            </p>

            <VRow
              v-for="(expense, index2) in $v.extra_expense.$model"
              :key="index2"
            >
              <VCol
                cols="12"
                class="pb-0 pt-5"
              >
                <div class="d-flex align-center">
                  <p class="mb-0 font-weight-medium pe-2">
                    مصارف #{{ index2 + 1 }}
                  </p>
                  <VBtn
                    size="small"
                    density="compact"
                    color="error"
                    icon="mdi-minus"
                    @click="removeItem(index2, 'extra_expense')"
                  />
                </div>
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="expense.name"
                  :rules="
                    validateCollection(
                      $v.extra_expense.$each.$response.$errors[index2]?.name,
                      'د محصول نوم'
                    )
                  "
                  label="د محصول نوم"
                  prepend-inner-icon="mdi-shape"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="expense.price"
                  dir="ltr"
                  prepend-inner-icon="mdi-cash"
                  :rules="
                    validateCollection(
                      $v.extra_expense.$each.$response.$errors[index2]?.price,
                      'قیمت'
                    )
                  "
                  label="قیمت"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
            </VRow>
            <div class="py-3">
              <VBtn
                size="small"
                @click="addMore('extra_expense')"
              >
                جدید<VIcon>mdi-plus</VIcon>
              </VBtn>
            </div>
          </VCardText>

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
                  label="ًمجموعه"
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
                  :rules="validationRules($v.paid_amount, 'پيسې ورکړل شوې')"
                  s
                  prepend-inner-icon="mdi-cash-check"
                  label="پيسې ورکړل شوې"
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

const expenseTotalValue = computed(() => {
  const items = payload.value.extra_expense
  let total = 0
  items.forEach(row => {
    total += parseFloat(row.price ?? 0)
  })

  return total
})
const itemTotalValue = computed(() => {
  const items = payload.value.items
  let totals = 0
  let amount = 0
  let total = 0

  items.forEach(row => {
    amount = parseFloat(row.cost / row.rate)
    total = parseFloat(amount * row.carton_amount)

    totals += parseFloat((total * 1 + 1 * row.expense) * row.carton)
  })

  return totals
})
const finalTotal = computed(() => {
  try {
    const val = parseFloat(expenseTotalValue.value) + parseFloat(itemTotalValue.value)

    return val?.toFixed(2)
  } catch (error) {
    console.error(error)

    return 0
  }
})

const remainder = computed(() => {
  const total = finalTotal.value - payload.value.paid_amount

  return total.toFixed(2)
})

// ==================================== START DATA =======================================
const show = ref(false)
const showProduct = ref(false)
const ProductformRef = ref()
const VendorformRef = ref()

const loadingContainer = ref(false)
const containers = ref([])
const loadingVendor = ref(false)
const vendors = ref([])
const loadingProduct = ref(false)
const products = ref([])
const apiLoading = ref(false)
const isSubmited = ref(false)
const loadingCategory = ref(false)
const Categories = ref([])
const formData = ref({
  name: "",
  organization_name: "",
})
const payload = ref({
  purchase_date: new Date(),
  container_id: null,
  vendor_id: null,
  total_amount: null,

  paid_amount: 0,
  items: [
    {
      product_id: null,
      quantity: 0,
      expense: 0,
      rate: 0,
      carton_amount: 0,
      carton: 0,
      sell_price: 0,
      per_carton_cost: 0,
      total: 0,
      cost: 0,
    },
  ],
  extra_expense: [],
})
const expand = ref(false)
const formRef = ref()
const vendorRule = {
  name: { required, minLength: minLength(3) },
  organization_name: { required, minLength: minLength(3) },
}

const v$2 = useVuelidate(vendorRule, formData)

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate
const validateCollection = useRules.validateCollection
const rules = {
  purchase_date: { required },
  container_id: { required },

  vendor_id: { required, minLength: minLength(2) },
  paid_amount: { required, minValue: minValue(0), maxValue: maxValue(finalTotal) },
  items: {
    $each: helpers.forEach({
      product_id: { required },
      quantity: { required, numeric, minValue: minValue(1) },
      cost: { required, numeric },
      per_carton_cost: { required, numeric },
      sell_price: { required, numeric },
      carton_amount: { required, numeric, minValue: minValue(1) },
      carton: { required, numeric, minValue: minValue(1) },
      rate: { required, numeric, minValue: minValue(1) },

      expense: { required, minValue: minValue(0) },
    }),
  },
  extra_expense: {
    $each: helpers.forEach({
      name: { required, minLength: minLength(3) },
      price: { required, numeric, minLength: minLength(1) },
    }),
  },
}

const $v = useVuelidate(rules, payload)
const ProductForm = ref({
  product_name: "",
  category_id: "",
  carton_quantity: "",
})
const productRule = {
  product_name: { required },
  category_id: { required },
  carton_quantity: { required },
}

const v$1 = useVuelidate(productRule, ProductForm)

// ==================================== START METHODS =======================================
const resetVendorForm = () => {
  formData.value = {
    name: null,
    organization_name: null,
  }
  v$2.value.$reset()
  VendorformRef.value.resetValidation()
}
const downloadForm = () => {}
const resetForm = () => {
  payload.value = {
    purchase_date: new Date(),
    container_id: null,
    description: null,
    rate: null,
    paid_amount: 0,
    total_amount: 0,

    description: null,
    items: [
      {
        expense: null,
        quantity: 0,
        cost: null,
        rate: null,
        total: null,
        carton_amount: null,
        sell_price: null,
        carton: null,
        per_carton_cost: null,
        product_id: null,
      },
    ],
    extra_expense: [],
  }
  $v.value.$reset()
  formRef.value.resetValidation()
}
const Calculate2 = (index, item) => {
  try {
    const items = payload.value.items

    axios.get("get-product-list/" + item.product_id.id).then(function (response) {
      console.log(response.data.carton_amount)
      items[index].carton_amount = response.data.carton_quantity
    })
  } catch (error) {
    console.error("error", error)
  }
}
const getAmount = (index, item) => {
  const items = payload.value.items
  const total = item.carton * item.carton_amount
  items[index].quantity = total.toFixed(2)
  const expenses = parseFloat(item.expense)
  const totals = expenses + parseFloat((item.cost / item.rate) * item.carton_amount)
  items[index].per_carton_cost = totals.toFixed(2)
}
const getprice = (index, item) => {
  const items = payload.value.items
  const expenses = parseFloat(item.expense)
  const total = expenses + parseFloat((item.cost / item.rate) * item.carton_amount)
  console.log("eee", expenses)
  items[index].per_carton_cost = total.toFixed(2)
}
const addVendor = type => {
  show.value = true
}
const closeReset = type => {
  show.value = false
  getVendor()
  showProduct.value = false
  getProduct()
}
async function getContainer() {
  try {
    loadingContainer.value = true
    const { data } = await axios.get("container-list")

    containers.value = data
  } catch (error) {
    console.error("error", error)
  }
  loadingContainer.value = false
}
async function getVendor() {
  try {
    loadingVendor.value = true
    const { data } = await axios.get("vendor-list")
    vendors.value = data
  } catch (error) {
    console.error("error", error)
  }
  loadingVendor.value = false
}
async function getProduct() {
  try {
    loadingProduct.value = true
    const { data } = await axios.get("product-list")
    products.value = data
  } catch (error) {
    console.error("error", error)
  }
  loadingProduct.value = false
}
function openDialog() {
  expand.value = true
  getContainer()
  getVendor()
  getProduct()
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

async function submit() {
  try {
    apiLoading.value = true
    const res = await axios.post("purchase", payload.value)
    isSubmited.value = true
    resetForm()
    props.fetchRecord()
    closeDialog()
  } catch (error) {
    console.error("error", error)
  }
  apiLoading.value = false
}

const addProduct = type => {
  getCategory()
  showProduct.value = true
}
async function getCategory() {
  try {
    loadingCategory.value = true
    const { data } = await axios.get("category-list")

    Categories.value = data
  } catch (error) {
    console.error("error", error)
  }
  loadingCategory.value = false
}
const addMore = type => {
  const items = payload.value[type]

  if (type == "items") {
    items.push({
      product_id: null,
      cost: 0,
      quantity: null,
      rate: null,
      total: null,
      carton_amount: null,
      carton: null,
      sell_price: null,
      per_carton_cost: null,
      expense: 0,
    })
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
async function submitVendor() {
  try {
    apiLoading.value = true
    if (formData.value.id) await axios.put("vendor/id", formData.value)
    else await axios.post("vendor", formData.value)

    getVendor()
    resetVendorForm()
    isSubmited.value = false
    show.value = false
  } catch (error) {
    console.error("error", error)
    toast.error(" مشکل په سرور کښی موجودی دي !")
  }
  apiLoading.value = false
}
const validateVendorForm = async () => {
  VendorformRef.value.validate()
  v$2.value.$touch()
  if (v$2.value.$invalid) {
    toast.error("مهربانی وکړې فورم صحیح ډک کړئ!")

    return false
  }
  submitVendor()
  v$2.value.$reset()
}
const resetProductForm = () => {
  ProductForm.value = {
    product_name: null,
    category_id: null,
    carton_quantity: null,
  }
  v$1.value.$reset()
  ProductformRef.value.resetValidation()
}
async function submitProduct() {
  try {
    if (ProductForm.value.id) await axios.put("product/id", ProductForm.value)
    else await axios.post("product", ProductForm.value)

    getProduct()
    resetProductForm()

    showProduct.value = false
  } catch (error) {
    console.error("error", error)
    toast.error(" مشکل در سرور وجود دارد !")
  }
}
const validateProductForm = async () => {
  ProductformRef.value.validate()
  v$1.value.$touch()

  if (v$1.value.$invalid) {
    toast.error("مهربانی وکړې فورم صحیح ډک کړئ!")

    return false
  }
  submitProduct()
  v$1.value.$reset()
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
