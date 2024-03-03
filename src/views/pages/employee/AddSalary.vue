<template>
  <VExpandTransition>
    <div v-show="expand">
      <VCard
        :title="payload.id ? 'ویرایش معاش' : 'پرداخت معاش'"
        class="my-5"
      >
        <VForm ref="formRef">
          <VCardText>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="payload.employee"
                  label="کارمند"
                  :readonly="payload.id"
                  prepend-inner-icon="mdi-account"
                  :items="employees"
                  :item-title="emp => `${emp.first_name} ${emp.last_name}`"
                  return-object
                  :loading="loadingEmployee"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  :model-value="payload?.employee?.salary"
                  readonly
                  label="مقدار معاش"
                  append-inner-icon="mdi-cash-multiple"
                />
              </VCol>
            </VRow>

            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <p class="mb-1">
                  تاریخ معاش
                </p>
                <span style="direction: ltr">
                  <VueDatePicker
                    v-model="payload.created_at"
                    clearable
                    auto-apply
                    dark
                    close-on-auto-apply
                    formate="MM/dd/yyyy"
                    :offset="-200"
                  >
                    <template #input-icon>
                      <VIcon icon="mdi-date" />
                    </template>
                  </VueDatePicker>
                </span>
                <p
                  v-if="validationRules($v.created_at, 'Date').length > 0"
                  class="text-error"
                >
                  {{ validationRules($v.created_at, 'Date')[0] }}
                </p>
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <p class="mb-1">
                  سال وماه
                </p>
                <span style="direction: ltr">
                  <VueDatePicker
                    v-model="payload.year_month"
                    clearable
                    month-picker
                    :offset="-200"
                    auto-apply
                  />
                </span>
                <p
                  v-if="validationRules($v.year_month, 'سال وماه').length > 0"
                  class="text-error"
                >
                  {{ validationRules($v.year_month, 'سال وماه')[0] }}
                </p>
              </VCol>
            </VRow>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.present"
                  :rules="validationRules($v.present, 'تعداد حاضر')"
                  prepend-inner-icon="mdi-check-underline-circle"
                  label=" تعداد حاضر"
                  dir="ltr"
                  @input="convertToEnglishNumbers('present')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.absent"
                  :rules="validationRules($v.absent, 'تعداد غیرحاضر')"
                  prepend-inner-icon="mdi-minus-circle-outline"
                  label="تعداد غیرحاضر"
                  dir="ltr"
                  @input="convertToEnglishNumbers('absent')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
            </VRow>
            
            <VRow
              v-show="payload?.employee?.loan > 0"
              class="mb-3"
            >
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  :model-value="payload?.employee?.loan"
                  readonly
                  label="مقدار قرضه"
                  append-inner-icon="mdi-cash-multiple"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.deduction"
                  :rules="validationRules($v.deduction, 'کسری')"
                  prepend-inner-icon="mdi-minus"
                  label=" کسری"
                  dir="ltr"
                  @input="convertToEnglishNumbers('deduction')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
            </VRow>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="payload.paid"
                  :rules="validationRules($v.paid, 'مقدار پرداخت')"
                  prepend-inner-icon="mdi-cash-multiple"
                  label="مقدار پرداخت"
                  dir="ltr"
                  @input="convertToEnglishNumbers('paid')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model:model-value="remainder"
                  prepend-inner-icon="mdi-cash-minus"
                  label="باقیمانده معاش"
                  dir="ltr"
                  readonly
                />
              </VCol>
            </VRow>
            <VCol
              cols="12"
              md="12"
            >
              <VTextarea
                v-model="payload.description"
                label=" توضیحات"
                prepend-inner-icon="mdi-info"
              />
            </VCol>
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
import { maxValue, minValue, required } from '@vuelidate/validators'
import { computed, ref } from 'vue'
import { toast } from 'vue3-toastify'

// ==================================== START PROPS =======================================

const props = defineProps({
  toggleExpand: { type: Function, default: () => {} },
  fetchRecord: { type: Function, default: () => {} },
})

// ==================================== START DATA =======================================

const apiLoading = ref(false)
const loadingEmployee = ref(false)
const employeeSalary = ref(0)
const employees = ref([])

const payload = ref({
  employee_id: null,
  employee: null,
  created_at: new Date(),
  year_month: '',
  paid: null,
  present: null,
  absent: null,
  description: null,
  remainder: null,
  deduction: null,
})
const expand = ref(false)
const formRef = ref()

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate
const remainder = computed(() => {
  return (
    payload.value?.employee?.salary -
    payload.value.paid -
    (payload.value?.employee?.salary / 30) * payload.value.absent -
    payload.value.deduction
  )
})

const totalSalary = computed(() => {
  return payload.value?.employee?.salary - (payload.value?.employee?.salary / 30) * payload.value.absent
})
const totalLoan = computed(() => {
  return payload.value?.employee?.loan
})
const totalabsent = computed(() => {
  return payload.value?.employee?.salary - (payload.value?.employee?.salary / 30) * payload.value.absent
})


const rules = {
  present: { required },
  absent: { required, minValue: minValue(0), maxValue: maxValue(totalabsent) },
  employee: { required },
  created_at: { required },
  year_month: { required },
  paid: { required, minValue: minValue(0), maxValue: maxValue(totalSalary) },
  deduction: { minValue: minValue(0), maxValue: maxValue(totalLoan) },
}


const $v = useVuelidate(rules, payload)

// ==================================== START METHODS =======================================
function convertToEnglishNumbers(model) {
  var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  var englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    payload.value[model] = payload.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
  }
}

const resetForm = () => {
  payload.value = {
    employee: null,
    employee_id: null,
    created_at: new Date(),
    present: null,
    year_month: null,
    deduction: null,
    loan: null,
    description: null,
    remainder: null,
    absent: null,
  }
  $v.value.$reset()
  formRef.value.resetValidation()
}

async function getEmployees() {
  try {
    loadingEmployee.value = true
    const { data } = await axios.get('employee-list')

    employees.value = data
  } catch (error) {
    console.error('error', error)
  }
  loadingEmployee.value = false
}

function openDialog(item = null) {
  expand.value = true
  if (item) {
    payload.value = JSON.parse(JSON.stringify(item))
  } else {
    getEmployees()
  }
}

function closeDialog() {
  expand.value = false
  resetForm()
}

async function submit() {
  try {
    apiLoading.value = true
    payload.value.employee_id = structuredClone(payload.value.employee.id)
    if (payload.value.id) {
      await axios.put('salary-payments/id', payload.value)
    } else {
      await axios.post('salary-payments', payload.value)
    }
    closeDialog()
    props.fetchRecord()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

const validateForm = async () => {
  formRef.value.validate()
  if ($v.value.$invalid) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  submit()
}

watch(payload.value.role, async () => {
  payload.value.permissions = []
})

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
