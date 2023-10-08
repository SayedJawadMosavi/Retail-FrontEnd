<template>
  <VDialog
    v-model="show"
    transition="dialog-top-transition"
    persistent
    width="auto"
  >
    <VCard
      width="auto"
      title="Getting Report"
    >
      <VCardText style="min-height: 300px">
        <VForm ref="formRef">
          <VRow>
            <VCol cols="12">
              <p class="mb-0">Start Date</p>
              <span style="direction: ltr">
                <VueDatePicker
                  v-model="payload.start_date"
                  clearable
                  auto-apply
                  dark
                  close-on-auto-apply
                  formate="MM/dd/yyyy"
                  :offset="-130"
                />
              </span>
              <p
                v-if="validationRules($v.start_date, 'Date').length > 0"
                class="text-error mb-0"
              >
                {{ validationRules($v.start_date, 'Date')[0] }}
              </p>
            </VCol>

            <VCol cols="12">
              <p class="mb-0">End Date</p>
              <span style="direction: ltr">
                <VueDatePicker
                  v-model="payload.end_date"
                  clearable
                  auto-apply
                  dark
                  close-on-auto-apply
                  formate="MM/dd/yyyy"
                  :offset="-190"
                />
              </span>
              <p
                v-if="validationRules($v.end_date, 'Date').length > 0"
                class="text-error"
              >
                {{ validationRules($v.end_date, 'Date')[0] }}
              </p>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions class="justify-end">
        <VBtn
          color="secondary"
          @click="
            show = false;
            props.fetchRecord()
          "
        >
          Cancel
        </VBtn>
        <VBtn
          ripple
          color="primary"
          variant="tonal"
          @click="print"
        >
          Get Report
          <VIcon
            icon="mdi-printer"
            end
          />
        </VBtn>
      </VCardActions>
    </VCard>

    <PrintReportDialog
      ref="printRefs"
      v-model:print-item="printData"
      v-model:start-date="payload.start_date"
      v-model:end-date="payload.end_date"
      :title="title"
      :headers="headers"
    />
  </VDialog>
</template>

<script setup>
import { ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'

import { required, numeric, minLength, maxLength, minValue, maxValue, email, helpers } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import { useVuelidate } from '@vuelidate/core'
import PrintReportDialog from '@/components/commons/PrintReportDialog.vue'
import { toast } from 'vue3-toastify'

const props = defineProps({
  fetchRecord: { type: Function, default: () => {} },
})
const emit = defineEmits(['confirm'])

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const employee_header = [
  {
    title: 'ID',
    key: 'ids',
  },
  {
    title: 'Name',
    key: 'name',
  },

  {
    title: 'Last Name',
    key: 'last_name',
  },

  {
    title: 'Email',
    key: 'email',
  },
  {
    title: 'Position Title ',
    key: 'Position_title',
  },
  {
    title: 'Phone Number',
    key: 'phone_number',
  },

  {
    title: 'Current Address',
    key: 'current_address',
  },
  {
    title: 'Permanent Address',
    key: 'permanent_address',
  },
  {
    title: 'Start Date',
    key: 'start_date',
  },
]

const incoming_header = [
  {
    title: 'ID #',
    key: 'ids',
  },
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Amount',
    key: 'amount',
    width: '140px',
  },
  {
    title: 'Date',
    key: 'created_at',
  },
]
const salary_header = [
  {
    title: 'ID',
    key: 'ids',
    width: '80px',
  },
  {
    title: ' Employee Name',
    key: 'employee_name',
  },
  {
    title: 'Position',
    key: 'position',
  },
  {
    title: ' Salary Amount',
    key: 'salary',
  },
  {
    title: ' Paid Amount',
    key: 'paid',
  },
  {
    title: ' Present Day',
    key: 'present',
  },
  {
    title: 'Absent Day',
    key: 'absent',
  },
  {
    title: ' Remainder',
    key: 'remainder',
  },
  {
    title: ' Paid Date',
    key: 'created_at',
  },
  {
    title: ' Year Month',
    key: 'year_month',
  },
]
const purchase_header = [
  {
    title: 'ID #',
    key: 'ids',
  },

  {
    title: 'Vendor Name',
    key: 'vendor_name',
    width: '160px',
  },

  {
    title: 'Extra Expense',
    key: 'extra_expense_sum_prices',
    width: '140px',
  },
  {
    title: 'Total Cost',
    key: 'total_price',
    width: '100px',
  },
  {
    title: 'Paid Amount',
    key: 'payments_sum_amount',
    width: '130px',
  },
  {
    title: 'Remainder',
    key: 'total_remainder',
    width: '180px',
  },

  {
    title: 'Description',
    key: 'description',
  },
  {
    title: 'Register Date',
    key: 'created_at',
  },
]
const contract_header = [
  {
    title: 'ID',
    key: 'ids',
    width: '80px',
  },
  {
    title: ' Customer Name',
    key: 'customer_name',
  },
  {
    title: 'Contract Type',
    key: 'type',
  },
  {
    title: 'Branch',
    key: 'branch_name',
  },

  {
    title: ' Payment Term',
    key: 'payment_term',
  },
  {
    title: 'Extra Expense',
    key: 'con_extra_expense_sum_price',
    width: '140px',
  },
  {
    title: 'Total Cost',
    key: 'total_price',
    width: '100px',
  },
  {
    title: 'Benifit',
    key: 'benefits',
    width: '100px',
  },
  {
    title: 'Paid Amount',
    key: 'payments_sum_amount',
    width: '130px',
  },
  {
    title: 'Remainder',
    key: 'total_remainder',
    width: '180px',
  },
  {
    title: 'Currency',
    key: 'currency',
  },
  {
    title: ' Equipment',
    key: 'equipment',
  },
  {
    title: ' Contract Date',
    key: 'created_at',
  },
]
const customer_header = [
  {
    title: 'ID',
    key: 'ids',
  },

  {
    title: 'Name',
    key: 'first_name',
  },
  {
    title: 'Last Name',
    key: 'last_name',
  },
  {
    title: 'Email',
    key: 'email',
  },
  {
    title: 'Total Extra Expenses',
    key: 'extra_expense_sum_price',
  },
  {
    title: ' Total Money',
    key: 'total_price',
  },
  {
    title: 'Total Paid',
    key: 'payments_sum_amount',
  },
  {
    title: 'Total Remainder',
    key: 'total_remainder',
  },

  {
    title: 'Total Items',
    key: 'items_count',
  },
  {
    title: 'Description',
    key: 'description',
  },
  {
    title: 'Status',
    key: 'active_status',
  },
]

const formRef = ref()
const printRefs = ref()
const headers = ref([])
const show = ref(false)
const printLoading = ref(false)
const printData = ref([])
const printType = ref('')
const title = ref('')

const payload = ref({
  start_date: new Date(),
  end_date: new Date(),
})

const rules = {
  start_date: { required },
  end_date: { required },
}
const $v = useVuelidate(rules, payload)

const validationRules = useRules.validate

const confirm = res => {
  if (res) {
    emit('confirm', type.value)
  }
  show.value = false
}
const showPrintConfirm = type => {
  printType.value = type
  payload.value = {
    start_date: new Date(),
    end_date: new Date(),
  }
  show.value = true
}

const print = async () => {
  formRef.value.validate()
  if ($v.value.$invalid) {
    toast.error('please Fill the form')

    return false
  }
  try {
    printLoading.value = true
    if (printType.value == 'employee ') {
      headers.value = employee_header
      title.value = 'Employee Report'
    }

    if (printType.value == 'income') {
      headers.value = incoming_header
      title.value = 'Income Report'
    }

    if (printType.value == 'expense') {
      headers.value = incoming_header
      title.value = 'Expense Report'
    }
    if (printType.value == 'salaries') {
      headers.value = salary_header
      title.value = 'Salary Report'
    }
    if (printType.value == 'purchases') {
      headers.value = purchase_header
      title.value = 'Purchase Report'
    }
    if (printType.value == 'contracts') {
      headers.value = contract_header
      title.value = 'Contract Report'
    }
    if (printType.value == 'customers') {
      headers.value = customer_header
      title.value = 'Customer Report'
    }

    let { data } = await axios.get('reports', { params: { type: printType.value, ...payload.value } })
    console.log('nmy data', data)
    printData.value = data
    await sleep(1)
    const printable = window.open('', '_blank')

    printable.document.write('<html style="direction:ltr"><head><style>@page { size: A4 landscape }</style>')
    printable.document.write('</head><body>')
    printable.document.write(printRefs.value.$el.innerHTML)
    printable.document.write('</body></html>')
    printable.document.close()
    printable.print()
    await sleep(1)

    printable.close()
  } catch (error) {
    console.error('error', error)
  }
  printLoading.value = false
}

defineExpose({
  showPrintConfirm,
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
