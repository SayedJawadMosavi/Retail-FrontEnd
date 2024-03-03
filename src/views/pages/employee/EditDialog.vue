<template>
  <VDialog
    v-model="showDialog"
    :class="`${editType == 'item' ? 'v-dialog-lg' : 'v-dialog-sm'}`"
    persistent
  >
    <VCard
      v-if="editType == 'item'"
      title="Edit Loans"
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
              md="12"
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
                v-if="validationRules($v.created_at, 'نیټه').length > 0"
                class="text-error mb-0"
              >
                {{ validationRules($v.created_at, 'نیټه')[0] }}
              </p>
            </VCol>
            <VCol
              cols="12"
              md="12"
            >
              <VCombobox
                v-model="payload.type"
                :rules="validationRules($v.type, 'ډول')"
                label="ډول"
                prepend-inner-icon="mdi-palette-swatch"
                :items="itemTypes"
              />
            </VCol>
            <VCol
              cols="12"
              md="12"
            >
              <VTextField
                v-model="payload.amount"
                label=" اندازه"
                append-inner-icon="mdi-cash-multiple"
                :rules="validationRules($v.amount, 'اندازه')"
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
          کینسل
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
import { toast } from 'vue3-toastify'
  
const props = defineProps({
  updateChanges: {
    type: Function,
    default: () => {},
  },
})
  
const validationRules = useRules.validate
const expense = ref({})
  
const payload = ref({})
const editType = ref(null)
const apiLoading = ref(false)
const packages = ref([])
const loadingPackage = ref(false)
const apiLoading2 = ref(false)
  
const formRef = ref()
let itemTypes = ['deposit', 'withdraw']
  
const showDialog = ref(false)
  
const rules = {
  amount: { required },
  created_at: { required },
  type: { required, minLength: minLength(3) },
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
    await axios.put(`employee_loan`, payload.value)
    await props.updateChanges()
    closeDialog()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}
  
  
function openDialog(data, type) {
  console.log(data)
  showDialog.value = true
  editType.value = type
  payload.value = JSON.parse(JSON.stringify(data))

}
  
function closeDialog() {
  showDialog.value = false
}
defineExpose({
  openDialog,
})
</script>
  