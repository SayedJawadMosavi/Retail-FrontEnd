<template>
  <VDialog
    v-model="showDialog"
    :class="`${editType == 'expense' ? 'v-dialog-sm' : 'v-dialog-lg'}`"
    persistent
  >
    <VCard
      v-if="editType == 'expense'"
      title="ویرایش مصرف اضافی"
    >
      <VCardText>
        <VForm ref="expenseForm">
          <VRow>
            <VCol cols="12">
              <span style="direction: ltr">
                <VueDatePicker
                  v-model.trim="expense.created_at"
                  clearable
                  auto-apply
                  dark
                  close-on-auto-apply
                  formate="MM/dd/yyyy"
                  :offset="-120"
                  menu-class-name="dp-custom-menu"
                />
              </span>
              <p
                v-if="validationRules($v2.created_at, 'Date').length > 0"
                class="text-error mb-0"
              >
                {{ validationRules($v2.created_at, 'تاریخ')[0] }}
              </p>
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="expense.name"
                label="اسم جنس"
                prepend-inner-icon="mdi-shape"
                :rules="validationRules($v2.name, 'اسم جنس')"
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="expense.price"
                :rules="validationRules($v2.price, 'قیمت')"
                prepend-inner-icon="mdi-cash"
                label="قیمت"
                dir="ltr"
                @input="convertToEnglishNumbers('expense.price')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>

            <!-- 👉 Create Key Button -->
            <VCol cols="12">
              <VBtn
                :loading="apiLoading2"
                @click="validateExpenseForm"
              >
                ذخیره
              </VBtn>
              <VBtn
                class="ms-2"
                color="secondary"
                variant="tonal"
                @click="closeDialog"
              >
                لغو
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VCard
      v-if="editType == 'item'"
      title="ویرایش جنس"
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
                {{ validationRules($v.created_at, 'تاریخ')[0] }}
              </p>
            </VCol>
          </VRow>

          <VRow class="mb-3">
            <VCol
              cols="12"
              md="6"
            >
              <v-autocomplete
                v-model="payload.product_id"
                label="اسم محصول"
                prepend-inner-icon="mdi-account"
                :items="products"
                :item-title="pr => `${pr.product_name}`"
                return-object
                :loading="loadingProduct"
                :rules="validationRules($v.product_id, 'اسم محصول')"
              ></v-autocomplete>
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                @update:modelValue="Calculate"
                v-model="payload.rate"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.rate, 'نرخ تبادله')"
                label="نرخ تبادله"
                dir="ltr"
                @input="convertToEnglishNumbers('rate')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                @update:modelValue="Calculate2"
                v-model="payload.cost"
                label="قیمت به ین"
                dir="ltr"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.cost, 'قیمت به ین')"
                @input="convertToEnglishNumbers('cost')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                @update:modelValue="Calculate3"
                v-model="payload.quantity"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.quantity, 'مقدار')"
                label="مقدار"
                dir="ltr"
                @input="convertToEnglishNumbers('quantity')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                @update:modelValue="Calculate4"
                v-model="payload.expense"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.expense, 'مصرف')"
                label="مصرف"
                dir="ltr"
                @input="convertToEnglishNumbers('expense')"
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
                :rules="validationRules($v.total, 'مجموع به دالر')"
                label="مجموع به دالر"
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
          لغو
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
const products = ref([])
const expense = ref({})
const payload = ref({})

const editType = ref(null)
const apiLoading2 = ref(false)
const apiLoading = ref(false)

const formRef = ref()
const expenseForm = ref()

const showDialog = ref(false)
const expenseRule = {
  created_at: { required },
  name: { required, minLength: minLength(3) },
  price: { required, minValue: minValue(1) },
}

const rules = {
  created_at: { required },
    product_id: { required, minLength: minLength(2) },
    total: { required },
    cost: { required, minValue: minValue(1) },
    quantity: { required },
    expense: { required },
    rate: { required },
}
const Calculate = value => {
    
    const total_price = parseFloat(((payload.value.cost / value) *1+1*payload.value.expense) * payload.value.quantity)
    payload.value.total = total_price.toFixed(2)
  }
    const Calculate2 = value => {
      
    const total_price = parseFloat(((value / payload.value.rate) *1+1*payload.value.expense) * payload.value.quantity)
    payload.value.total = total_price.toFixed(2)
  }
    const Calculate3 = value => {
      
    const total_price = parseFloat(((payload.value.cost /  payload.value.rate) *1+1*payload.value.expense) * value)
    payload.value.total = total_price.toFixed(2)
  }
    const Calculate4 = value => {
      
    const total_price = parseFloat(((payload.value.cost /  payload.value.rate) *1+1*value) * payload.value.quantity)
    payload.value.total = total_price.toFixed(2)
  }
const $v = useVuelidate(rules, payload)
const $v2 = useVuelidate(expenseRule, expense)

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
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  try {
    apiLoading.value = true
    await axios.put(`purchase-item`, payload.value)
    await props.updateChanges()
    closeDialog()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

const validateExpenseForm = async () => {
  expenseForm.value.validate()
  $v2.value.$touch()
  if ($v2.value.$invalid) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  try {
    apiLoading2.value = true

    await axios.put(`purchase-expense`, expense.value)
    await props.updateChanges()
    closeDialog()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading2.value = false
}

function openDialog(data, type) {
  showDialog.value = true
  editType.value = type
  if (type == 'expense') {
    expense.value = JSON.parse(JSON.stringify(data))
  } else {
    payload.value = JSON.parse(JSON.stringify(data))
    console.log(data.product)
    payload.value.cost=data.yen_cost
     axios.get('product-list').then(function (response) {

       products.value=response.data
    })
    payload.value.product_id = data.product.product_name
   
 
  }
}

function closeDialog() {
  showDialog.value = false
}
defineExpose({
  openDialog,
})
</script>
