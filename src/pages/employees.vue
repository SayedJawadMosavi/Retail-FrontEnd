<template>
  <div>
    <VDialog
      v-model="show"
      transition="dialog-top-transition"
      persistent
      width="auto"
    >
      <VCard
        width="auto"
        title="راپور ترتیبول"
      >
        <VCardText style="min-height: 300px">
          <VForm ref="formRef">
            <VRow>
              <VCol cols="12">
                <p class="mb-0">
                  پیل نیټه
                </p>

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
                  v-if="validationRules(v$.start_date, 'نیټه').length > 0"
                  class="text-error"
                >
                  {{ validationRules(v$.start_date, 'پیل نیټه')[0] }}
                </p>
              </VCol>

              <VCol cols="12">
                <p class="mb-0">
                  ختم ڼیته
                </p>
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
                  v-if="validationRules(v$.end_date, 'نیټه').length > 0"
                  class="text-error"
                >
                  {{ validationRules(v$.end_date, 'ختم نیټه')[0] }}
                </p>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn
            color="secondary"
            @click="closeReset"
          >
            کینسل
          </VBtn>
          <VBtn
            ripple
            color="primary"
            variant="tonal"
            @click="print"
          >
            پرنت
            <VIcon
              icon="mdi-printer"
              end
            />
          </VBtn>
          <VBtn
            ripple
            color="primary"
            variant="tonal"
            @click="getReport"
          >
            راپور
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
        v-model:start-date="payload.start_date"
        v-model:end-date="payload.end_date"
        :title="title"
        :headers="headerss"
      />
    </VDialog>

    <!-- <PageFilter /> -->
    <ReportDialog ref="reportRefs" />
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="د کارکوونکی لست"
      icon="mdi-people"
      create-text="د کارکوونکی اضافه کول"
      :show-create="scope(['employee_create'])"
      :show-delete="scope(['employee_delete'])"
      :show-restore="scope(['employee_restore'])"
      :show-force-delete="scope(['employee_force_delete'])"
      @on-force-delete="deleteRecord('force-delete')"
      @on-create="createEmployee"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    >
      <template #default>
        <VBtn
          v-if="options.tab != 'trash'"
          style="margin-left: 10px;"
          class="font-weight-bold bg-warning"
          @click="TakeReport"
        >
          راپور ترتیبول
          <VIcon
            end
            icon="mdi-printer"
          />
        </VBtn>
        <VBtn
         
          class="font-weight-bold bg-success"
          @click="ExportExcel"
        >
          په اکسل
          <VIcon
            end
            icon="mdi-export"
          />
        </VBtn>
      </template>
    </BreadCrumbs>
    <InsertEmployee
      ref="employeeRef"
      :fetch-record="fetchRecord"
    />
  
    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:loading="apiLoading"
      v-model:extra-total="extraTotal"
      :tabs="tabs"
      :headers="headers"
      :items="employees"
      @table-change="onTableChange($event)"
    >
      <template #salary="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="success"
          class="font-weight-medium"
        >
          {{ item?.salary ?? 0 }} $
        </VChip>
      </template>
      <template #profile="{ item }">
        <VBtn
          variant="plain"
          class="font-weight-bold px-1"
          :loading="profileLoading && selectedId==item.id"
  
          @click="viewProfile(item)"
        >
          <VIcon
            size="30"
            start
            icon="mdi-eye-arrow-right"
          />
        </VBtn>
      </template>
    </DataTable>
  </div>
</template>
  
<script setup>
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
import DataTable from '@/components/commons/DataTable.vue'
import InsertEmployee from '@/views/pages/employee/InsertEmployee.vue'
import usePageConfig from '@/config/pages/employee'
import PrintReportDialog from '@/components/commons/PrintReportDialog.vue'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import { useVuelidate } from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import router from '@/router'
import { scope } from '@/@core/utils/index'
  
const CaloriesTemplate = defineComponent({
  props: ['data'],
  template: `
      <div>
        {{ data }}
      </div>
    `,
})
const Employee_header = [
  {
    title: 'شمیره',
    key: 'id',
  },
  {
    title: 'نوم',
    key: 'first_name',
               
  },
  {
    title: 'تخلص',
    key: 'last_name',
   
               
  },
  {
    title: 'ایمیل',
    key: 'email',
  },
  {
    title: 'و وظیفی عنوان',
    key: 'job_title',
    width: '100px',
  },
  
  {
    title: 'تیلفون شمیره',
    key: 'phone_number',
  },
  {
    title: 'اوسنۍ پته',
    key: 'current_address',
    width: '180px',
  },
  {
    title: 'دایمی پته',
    key: 'permenent_address',
    width: '180px',
  },
  {
    title: 'پیل نیټه ',
    key: 'created_at',
    width: "130px",
  },

  {
    title: 'معاش',
    key: 'salary',
  },
]

const { tabs, headers, breadCrumbs, search } = usePageConfig()
const apiLoading = ref(false)
const expand = ref(false)
const searchOption = ref({})
const show = ref(false)
const printLoading = ref(false)
const headerss = ref([])
const printData = ref([])
const printRefs = ref()
const title = ref('')
const total = ref(0)
const options = ref({ itemsPerPage: 20, page: 1, tab: 'employees' })
const employees = ref([])
const datatableRefs = ref()
const extraTotal = ref({})
const employeeRef = ref()
const profileLoading = ref(false)
const selectedId = ref(null)
const payload = ref({
  start_date: new Date(),
  end_date: new Date(),
  type: 'employee',
})
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const validationRules = useRules.validate

const rules = {
  start_date: { required },
  end_date: { required },
}

const v$ = useVuelidate(rules, payload)
const confirm = res => {
  if (res) {
    emit('confirm', type.value)
  }
  show.value = false
}
const createEmployee = () => {
  employeeRef.value.toggleDialog()
}
const viewProfile = async item => {
  profileLoading.value = true
  selectedId.value=item.id  
  await router.replace('view-employee/' + item.id)
}
const TakeReport = type => {
  show.value = true
}
const closeReset = type => {
  show.value = false
  fetchRecord()
}
const ExportExcel = async () => {
  let { data } = await axios.get('employees', { params: options.value })
  const XLSX = xlsx
  const rows = data.data.map(row => ({
    number: row.id,
    name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    Position_title: row.job_title,
    phone_number: row.phone_number,
    current_address: row.current_address,
    permanent_address: row.permenent_address,
    salary: row.salary,
  }))
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.book_append_sheet(workbook, worksheet, rows)
  XLSX.writeFile(workbook, 'employee.xlsx')
}
const getReport = async () => {
  if (payload.value.start_date == null || payload.value.end_date == null) {
    toast.error('مهربانی وکړۍ فورم صحیح ډک کړئ')

    return false
  }
  try {
    printLoading.value = true
    let { data } = await axios.get('employee_reports', { params: { ...payload.value } })
    employees.value = data.data
    total.value = data.data.length
    extraTotal.value = data.extraTotal
    show.value = false
  } catch (error) {
    console.error('error', error)
  }
  printLoading.value = false
}
const print = async () => {
  if (payload.value.start_date == null || payload.value.end_date == null) {
    toast.error('مهربانی وکړۍ فورم صحیح ډک کړئ')

    return false
  }
  try {
    headerss.value = Employee_header
    title.value = 'راپورکارمندان'
    let { data } = await axios.get('reports', { params: { ...payload.value } })
    console.log('my data', data)
    printData.value = data
    await sleep(1)
    const printable = window.open('', '_blank')
    printable.document.write('<html style="direction:rtl"><head><style>@page { size: A4 landscape }</style>')
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
const searchRecord = data => {
  searchOption.value = data
  options.value = { ...options.value, ...data }
  fetchRecord()
}
  
const onTableChange = value => {
  options.value = value
  fetchRecord()
}
  
const fetchRecord = async () => {
  try {
    apiLoading.value = true
    datatableRefs.value.selectedItems = []
    const res = await axios.get('employees', { params: options.value })
    employees.value = res.data.data
    total.value = res.data.data.length
    extraTotal.value = res.data.extraTotal
  } catch (error) {
     
  }
  apiLoading.value = false
}
  
const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value.selectedItems.map(row => row.id) ?? []
    if (type == 'delete') await axios.delete('employees/' + ids)
    if (type == 'force-delete') await axios.delete('force-delete-employees/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
      
  }
}
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore-employees/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
}
  
onMounted(() => {
  fetchRecord()
})
</script>
  
  <route lang="yaml">
  meta:
    auth: true
  </route>
  
  
  