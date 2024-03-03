<template>
  <VRow>
    <ConfirmDialog
      ref="confirmRef"
      @confirm="onConfirm"
    />
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
                <p class="mb-0">
                  شروع تاریخ
                </p>
  
                <span style="direction: ltr">
                  <VueDatePicker
                    v-model="formdata.start_date"
                    clearable
                    auto-apply
                    dark
                    close-on-auto-apply
                    formate="MM/dd/yyyy"
                    :offset="-130"
                  />
                </span>
              </VCol>
  
              <VCol cols="12">
                <p class="mb-0">
                  ختم تاریخ
                </p>
                <span style="direction: ltr">
                  <VueDatePicker
                    v-model="formdata.end_date"
                    clearable
                    auto-apply
                    dark
                    close-on-auto-apply
                    formate="MM/dd/yyyy"
                    :offset="-190"
                  />
                </span>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn
            color="secondary"
            @click="show=false"
          >
            کنسل
          </VBtn>
            
          <VBtn
            ripple
            color="primary"
            variant="tonal"
            @click="getReport"
          >
            تهیه راپور
            <VIcon
              icon="mdi-export"
              end
            />
          </VBtn>
        </VCardActions>
      </VCard>
      <PrintReportDialog
        ref="printRefs"
        v-model:print-item="printData"
        v-model:start-date="formdata.start_date"
        v-model:end-date="formdata.end_date"
        v-model:contract-id="formdata.contract_id"
  
        :flag="flag"
        :title="title"
        :total="total"
        :headers="headers"
      />
    </VDialog>
    <EditDialog
      ref="editRef"
      :order-info="employeeInfo"
      :update-changes="updateChanges"
    />
    <VCol cols="12">
      <VCard title="قرضه جدید">
        <VDivider />
  
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="formRef"
            class="mt-6"
          >
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="4"
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
                  v-if="validationRules($v.created_at, 'تاریخ').length > 0"
                  class="text-error mb-0"
                >
                  {{ validationRules($v.created_at, 'تاریخ')[0] }}
                </p>
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <VCombobox
                  v-model="payload.type"
                  :rules="validationRules($v.type, 'نوعیت')"
                  label="نوعیت"
                  prepend-inner-icon="mdi-palette-swatch"
                  :items="itemTypes"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="payload.amount"
                  label="مقدار"
                  dir="ltr"
                  prepend-inner-icon="mdi-amounter"
                  :rules="validationRules($v.amount, 'مقدار')"
                  @input="convertToEnglishNumbers('amount')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
            </VRow>
            <VRow />
          </VForm>
        </VCardText>
  
        <VCardText class="d-flex flex-wrap gap-4">
          <VBtn @click="validateForm">
            <VIcon
              start
              icon="mdi-checkbox-marked-circle"
            />
            ذخیره
          </VBtn>
  
          <VBtn
            color="red"
            variant="tonal"
            @click="resetForm"
          >
            <VIcon
              start
              icon="mdi-cancel"
            />
            کنسل
          </VBtn>
        </VCardText>
      </VCard>
      <VBtn
        class="font-weight-bold bg-info mt-4"
        style="float: right;"
        @click="openDialogs"
      >
        راپور
        <VIcon
          end
          icon="mdi-export"
        />
      </VBtn>
  
      <template #loan="{ item }">
        {{ item.loan }}
      </template>
    </VCol>
  
    <VCol cols="12">
      <!-- 👉 Table -->
      <VCard
        title="لیست جزییات"
        style="min-height: 300px"
      >
        <thead>
          <tr>
            <th
              scope="col"
              class="pr-4"
            >
              جمله قرض کارمند   :
            </th>
            <td>
              <VChip
                style="direction: ltr"
                small
                :color="`${props.employeeInfo.loan >0 ? 'error' : 'success'}`"
                class="font-weight-medium"
              >
                {{ Math.abs(props.employeeInfo.loan) }}
                <VIcon
                  size="30"
                  :icon="`${props.employeeInfo.loan >0 ? 'mdi-arrow-down' : 'mdi-arrow-up'}`"
                />
              </VChip>
            </td>
          </tr>
        </thead>
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">
                #شماره
              </th>
              <th scope="col">
                نوعیت
              </th>
              <th scope="col">
                مقدار
              </th>
  
              <th scope="col">
                تاریخ ثبت
              </th>
              <th
                scope="col"
                class="text-center"
              >
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in employeeInfo.loans"
              :key="index"
              :class="`${item.deleted_at ? 'text-error' : ''}`"
            >
              <td>
                {{ item.id }}
              </td>
              <td>
                <VChip
                  style="direction: ltr"
                  small
                  :color="`${item.type=='withdraw' ? 'error' : 'success'}`"
                  class="font-weight-medium"
                >
                  {{ item.type }}
                  <VIcon
                    size="30"
                    :icon="`${item.type=='withdraw' ? 'mdi-arrow-down' : 'mdi-arrow-up'}`"
                  />
                </VChip>
              </td>
              <td>{{ item.amount }}</td>
  
              <td>{{ formateDate(item.created_at) }}</td>
  
              <td class="text-center">
                <div v-if="item.deleted_at">
                  <VBtn
                    variant="text"
                    icon
                    size="small"
                    color="info"
                    :loading="restoreLoading && selectedItem.id == item.id"
                    @click="restoreRecord(item, 'items')"
                  >
                    <VIcon
                      start
                      icon="mdi-restore"
                      color="info"
                    />
                    بازگشت
                  </VBtn>
  
                  <VBtn
                    class="ms-2"
                    variant="text"
                    icon
                    size="small"
                    :loading="apiLoading2 && selectedItem == item"
                    @click="forceDelete(item, 'items')"
                  >
                    <VIcon
                      icon="mdi-trash"
                      color="error"
                    />
                  </VBtn>
                </div>
  
                <div v-else>
                  <VBtn
                    variant="text"
                    icon
                    size="small"
                    @click="editForm(item, 'item')"
                  >
                    <VIcon
                      icon="mdi-pencil"
                      color="primary"
                    />
                  </VBtn>
  
                  <VBtn
                    variant="text"
                    icon
                    size="small"
                    :loading="apiLoading2 && selectedItem == item"
                    @click="deleteRecord(item, 'items')"
                  >
                    <VIcon
                      icon="mdi-trash"
                      color="error"
                    />
                  </VBtn>
                </div>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
</template>
  
<script setup>
import { required, numeric, minLength, minValue } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import useVuelidate from '@vuelidate/core'
import { ref, toRef } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router'
import { formateDate, scope } from '@/@core/utils/index'
import ConfirmDialog from '@/components/commons/ConfirmDialog.vue'
import EditDialog from './EditDialog.vue'
import PrintReportDialog from '@/components/commons/PrintReportDialog.vue'
const props = defineProps({
  employeeInfo: {
    type: Object,
    default: () => {},
  },
  
  updateChanges: {
    type: Function,
    default: () => {},
  },
})
  
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
  
const route = useRoute()
  
const employee_id = ref(route.params.employee_id)
  
const formRef = ref()
const loadingPackage = ref(false)
  
const apiLoading = ref(false)
const apiLoading2 = ref(false)
const restoreLoading = ref(false)
const confirmRef = ref()
const editRef = ref()
const packages = ref([])
const selectedItem = ref({})
const selectedType = ref(null)
const showDialog = ref(false)
const reportRefs = ref()
const printData = ref([])
const printRefs = ref()
const headers = ref([])
const printType = ref()
const printLoading = ref(false)
  
const show = ref(false)
const title = ref('')
const flag = ref('')
const total = ref(0)
const formdata = ref({
  start_date: new Date(),
  end_date: new Date(),
  employee_id: employee_id.value,
   
})
const payload = ref({
  created_at: new Date(),
  type: null,
  amount: 0,
  employee_id: employee_id.value,
  employee_name: props.employeeInfo.first_name,
})
  
let itemTypes = ['deposit', 'withdraw']
const loan_payment_header = [
  {
    title: 'ID',
    key: 'ids',
    width: '80px',
  },
  {
    title: ' اسم کارمند',
    key: 'employee_name',
  },
  {
    title: 'نوعیت',
    key: 'type',
  },
  
  {
    title: '  مقدار',
    key: 'amount',
  },
  
  {
    title: 'تاریخ',
    key: 'created_at',
  },
]

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate
  
const rules = {
  created_at: { required },
  type: { required },
  amount: { required, minValue: minValue(1) },
}
  
const $v = new useVuelidate(rules, payload)
const resetForm = (type = 'items') => {
  if (type == 'items') {
    payload.value = {
      created_at: new Date(),
      type: null,
      amount: 0,
      employee_id: employee_id.value,
      employee_name: props.employeeInfo.first_name,

    }
  
    $v.value.$reset()
    formRef.value.resetValidation()
  }
}
async function getPackage() {
  try {
    loadingPackage.value = true
    const { data } = await axios.get('package-list')
    packages.value = data
  } catch (error) {
    console.error('error', error)
  }
  loadingPackage.value = false
}
const validateForm = async () => {
  formRef.value.validate()
  $v.value.$touch()
  
  submit()
}
  
async function submit() {
  try {
    apiLoading.value = true
    const { data } = await axios.post(`employee_loan`, payload.value)
    await props.updateChanges()
    resetForm('items')
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}
  
function convertToEnglishNumbers(model, item = null, index = null) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    if (model == 'expense.price') {
      expense.value.price = expense.value.price.replace(persianNumbers[i], i).replace(englishNumbers[i], i)
  
      return
    }
    if (item == null) {
      payload.value[model] = payload.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
    } else {
      payload.value[model][index][item] = payload.value[model][index][item]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i)
    }
  }
}
  
const restoreRecord = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type
  confirmRef.value.showDialog('restore')
}
  
const editForm = async (item, type = 'epense') => {
  editRef.value.openDialog(item, type)
}
  
const deleteRecord = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type
  
  confirmRef.value.showDialog('delete')
}
  
const forceDelete = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type
  
  confirmRef.value.showDialog('forceDelete')
}
const openDialogs = type => {
  printType.value = 'loan_payment'
  payload.value = {
    start_date: new Date(),
    end_date: new Date(),
    
  }
  show.value = true
}
const getReport = async () => {
  if (formdata.value.start_date == null || formdata.value.end_date == null) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  try {
    console.log("pppp",printType.value)
    if (printType.value == 'loan_payment') {
      headers.value = loan_payment_header
      title.value = 'راپور قرضه  '+ props.employeeInfo.first_name
      total.value = props.employeeInfo.loan
      flag.value = "loan"
    }
  
    printLoading.value = true
    let { data } = await axios.get('reports', {  params: { type:printType.value, ...formdata.value }  })
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
const onConfirm = async event => {
  if (event == 'delete') {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(`employee_delete/${selectedType.value}/${selectedItem.value.id}`)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
  }
  
  if (event == 'forceDelete') {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(`employee_force_delete/${selectedType.value}/${selectedItem.value.id}`)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
  }
  if (event == 'restore') {
    try {
      restoreLoading.value = true
      const { data } = await axios.post(`employee_restore/${selectedType.value}/${selectedItem.value.id}`)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
  }
  restoreLoading.value = false
  apiLoading2.value = false
  selectedItem.value = {}
}
onMounted(() => {
  getPackage()
})
</script>
  
  <style>
  .dp__input{
  padding: 12px 4px 12px 40px !important;
  }
  
  .dp__theme_dark ,.dp__theme_light  {
  --dp-background-color:  rgb(var(--v-theme-surface));
  --dp-text-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  --dp-hover-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
  --dp-hover-text-color: gba(var(--v-theme-on-surface),1);
  --dp-hover-icon-color: var(--v-theme-on-surface);
  --dp-primary-color: #40A579;
  --dp-primary-text-color:#fff;
  --dp-secondary-color: #8A8D93;
  --dp-border-color:rgba(var(--v-border-color), var(--v-border-opacity));
  --dp-menu-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  --dp-border-color-hover:rgba(var(--v-border-color),var(--v-medium-emphasis-opacity) )
  --dp-border-radius:10px  !important;
  --dp-disabled-color:var(--v-disabled-opacity);
  --dp-scroll-bar-background: var(--v-theme-on-surface);
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  --dp-danger-color: #e53935;
  --dp-highlight-color: rgba(0, 92, 178, 0.2);
  }
  </style>
  