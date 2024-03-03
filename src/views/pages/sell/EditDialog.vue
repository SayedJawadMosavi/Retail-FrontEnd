<template>
  <VDialog
    v-model="showDialog"
    :class="`${editType == 'expense' ? 'v-dialog-sm' : 'v-dialog-lg'}`"
    persistent
  >
    <VCard
      v-if="editType == 'item'"
      title="د محصول ایدیت"
    >
      <VCardText>
        <!-- 👉 Form -->
        <VForm
          ref="formRef"
          class="mt-6"
        >
          <VRow class="mb-3">
            <VCol
              cols="12"
              md="6"
            >
              <span style="direction: ltr">
                <VueDatePicker
                  v-model.trim="payload.created_at"
                  clearable
                  auto-apply
                  dark
                  close-on-auto-apply
                  formate="MM/dd/yyyy"
                  teleport-center
                />
              </span>
              <p
                v-if="validationRules($v.created_at, 'Date').length > 0"
                class="text-error mb-0"
              >
                {{ validationRules($v.created_at, 'نیټه')[0] }}
              </p>
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VAutocomplete
                v-model="payload.stock_id"
                label="د ګدام نوم"
                prepend-inner-icon="mdi-account"
                :items="stocks"
                :item-title="st => `${st.name}`"
                return-object
                :loading="loadingStock"
                :rules="validationRules($v.stock_id, 'د ګدام نوم')"
                @update:modelValue="getProductStock"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VAutocomplete
                v-model="payload.product_id"
                label="د محصول نوم"
                prepend-inner-icon="mdi-account"
                :items="products"
                :item-title="pr => `${pr.product.product_name} ${pr.quantity}`"
                return-object
                :loading="loadingProduct"
                :rules="validationRules($v.product_id, 'د محصول نوم')"
              />
            </VCol>
           
            

            <VCol cols="6">
              <VTextField
                v-model="payload.carton_quantity"
                prepend-inner-icon="mdi-counter"
                label="د کارتن تعداد"
                dir="ltr"
                @update:modelValue="Calculate1"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="payload.cost"
                label="قیمت "
                dir="ltr"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.cost, 'قیمت ')"
                @update:modelValue="Calculate2"
                @input="convertToEnglishNumbers('cost')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="payload.total"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.total, 'مجموعه ')"
                label="مجموعه "
                dir="ltr"
                @input="convertToEnglishNumbers('total')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
          </VRow>
          <VRow />
        </VForm>
      </VCardText>

      <VCardText class="d-flex flex-wrap gap-4">
        <VBtn
          :loading="apiLoading"
          @click="validateForm"
        >
          ذخیره
        </VBtn>

        <VBtn
          class="ms-2"
          color="secondary"
          variant="tonal"
          @click="closeDialog"
        >
          لغوه کول
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup>
import { required, numeric, minLength, minValue } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import useVuelidate from '@vuelidate/core'
import { ref, toRef } from 'vue'
import { axios } from '@/plugins/axios-plugin'
const props = defineProps({
  updateChanges: {
    type: Function,
    default: () => {},
  },
})

const validationRules = useRules.validate
const loadingProduct = ref(false)
const loadingStock = ref(false)
const products = ref([])
const stocks = ref([])
const expense = ref({})
const payload = ref({})

const editType = ref(null)
const apiLoading2 = ref(false)
const apiLoading = ref(false)

const formRef = ref()
const expenseForm = ref()

const showDialog = ref(false)

const rules = {
  created_at: { required },
  stock_id: { required },
  product_id: { required },
  total: { required },
  cost: { required, minValue: minValue(1) },
  quantity: { required },
  carton_amount: { required },
}

const Calculate2 = value => {
  const total_price = parseFloat(value  * payload.value.carton_quantity)
  payload.value.total = total_price.toFixed(2)
}
const Calculate1 = value => {
  const total_price = parseFloat(value  * payload.value.cost)
  payload.value.total = total_price.toFixed(2)
}

const $v = useVuelidate(rules, payload)

function convertToEnglishNumbers(model, item = null, index = null) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    if (model == 'expense.price') {
      expense.value.price = expense.value.price.replace(persianNumbers[i], i).replace(englishNumbers[i], i)

      return
    }
    payload.value[model] = payload.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
  }
}

const validateForm = async () => {
  formRef.value.validate()
  $v.value.$touch()
  if ($v.value.$invalid) {
    toast.error('مهربانی وکړې فورم صحیح ډک کړئ!')

    return false
  }
  try {
    apiLoading.value = true
    await axios.put(`sell-item`, payload.value)
    await props.updateChanges()
    closeDialog()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

function openDialog(data, type) {
  showDialog.value = true
  editType.value = type

  payload.value = JSON.parse(JSON.stringify(data))
  payload.value.carton_amount=data.carton_amount

  // loadingStock.value = true

  // axios.get('stock-list').then(function (response) {
  //   stocks.value = response.data
  //   loadingStock.value = false
  // })
  payload.value.product_id = data.product_stock.product.product_name

  payload.value.stock_id = data.product_stock.stock.name
  
}
const getProductStock = value => {
  loadingProduct.value = true
  axios.get('product-list/' + value.id).then(response => {
    products.value = response.data
    loadingProduct.value = false
  })
}
function closeDialog() {
  showDialog.value = false
}
defineExpose({
  openDialog,
})
</script>
