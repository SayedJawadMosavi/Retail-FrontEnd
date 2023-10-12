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
        title="Getting Report"
      >
        <VCardText style="min-height: 300px">
          <VForm ref="formRef">
            <VRow>
              <VCol cols="12">
                <p class="mb-0">شروع تاریخ</p>

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
                
              </VCol>

              <VCol cols="12">
                <p class="mb-0">ختم تاریخ</p>
                <span style="direction: ltr">
                  <VueDatePicker
                    v-model="payload.end_date"
                  
                    clearable
                    auto-apply
                    dark
                    close-on-auto-apply
                    formate="MM/dd/yyyy"
                    :offset="-130"
          
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
     
    </VDialog>
    <ReportDialog ref="reportRefs" />
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لیست معاشات"
      create-text="پرداخت معاش"
      edit-text="ویرایش پرداخت معاش"
      page-icon="mdi-cash"
      :show-create="scope(['user_create']) || true"
      :show-update="scope(['user_create'])"
      :show-delete="scope(['user_delete'])"
      :show-restore="scope(['user_restore'])"
      @on-force-delete="deleteRecord('force-delete')"
      @on-create="addSalary"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    >
    <template #default>
        <VBtn style="margin-left: 10px;"
          v-if="options.tab != 'trash'"
          class="font-weight-bold mr-2"
          @click="TakeReport"
        >
          Print
          <VIcon
            end
            icon="mdi-printer"
          />
        </VBtn>
        <VBtn
          v-if="options.tab != 'trash'"
          class="font-weight-bold bg-info"
          @click="openDialogs"
        >
          Report
          <VIcon
            end
            icon="mdi-export"
          />
        </VBtn>
      </template>
    </BreadCrumbs>

    <AddSalary
      ref="salaryRefs"
      :fetch-record="fetchRecord"
    />

    <EditUser
      ref="userEditRefs"
      :fetch-record="fetchRecord"
    />

    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:extra-total="extraTotal"
      v-model:loading="apiLoading"
      :tabs="tabs"
      :headers="headers"
      :items="tableRecords"
      @table-change="onTableChange($event)"
    >
      <template #position="{ item }">
        {{ item?.employee?.job_title }}
      </template>

      <template #salary="{ item }">
        <VChip
          small
          color="info"
          class="font-weight-medium"
        >
          {{ item?.employee?.salary }}
        </VChip>
      </template>
      <template #payable_amount="{ item }">
        <VChip
          small
          color="info"
          class="font-weight-medium"
        >
          {{ item?.salary }}
        </VChip>
      </template>
      <template #paid="{ item }">
        <VChip
          small
          color="primary"
          class="font-weight-medium"
        >
          {{ item?.paid }}
        </VChip>
      </template>

      <template #remainder="{ item }">
        <VChip
          small
          color="primary"
          class="font-weight-medium"
        >
          {{ item.salary - item?.paid }}
        </VChip>
      </template>
      <template #employee="{ item }">
        {{ item.employee?.first_name + ' ' + item.employee?.last_name }}
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import AddSalary from '@/views/pages/employee/AddSalary.vue'
import EditUser from '@/views/pages/users/EditUser.vue'
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
import DataTable from '@/components/commons/DataTable.vue'
import usePageConfig from '@/config/pages/salary'
import router from '@/router'
import { scope } from '@/@core/utils/index'
import PrintReportDialog from '@/components/commons/PrintReportDialog.vue'
import ReportDialog from '@/components/commons/ReportDialog.vue'

import useRules from '@/plugins/vuelidate/vuelidateRules'
import { useVuelidate } from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
const { tabs, headers, breadCrumbs, search } = usePageConfig()
const total = ref(0)
const extraTotal = ref({})
const salaryRefs = ref()
const userEditRefs = ref()
const printType = ref()
const reportRefs = ref()

const apiLoading = ref(false)
const datatableRefs = ref()
const show = ref(false)
const printLoading = ref(false)
const headerss = ref([])
const printData = ref([])
const printRefs = ref()
const options = ref({ page: 1, itemPerPage: 20, tab: 'salaries' })
const searchOption = ref({})
const tableRecords = ref([])
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
const TakeReport = () => {
  reportRefs.value.showPrintConfirm(options.value.tab)
}
const openDialogs = type => {
  printType.value = options.value.tab
  payload.value = {
    start_date: new Date(),
    end_date: new Date(),
  }
  show.value = true
}
const closeReset = type => {
  show.value = false
  fetchRecord()
}

const getReport = async () => {
  if (payload.value.start_date == null || payload.value.end_date == null) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  try {
    printLoading.value = true
    let { data } = await axios.get('employee_reports', {  params: { type:printType.value, ...payload.value }  })
    tableRecords.value = data.data
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
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

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
    printable.document.write('<html><head><style>@page { size: A4 landscape }</style>')
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
const addSalary = () => {
  if (datatableRefs.value?.selectedItems?.length == 1) {
    salaryRefs.value.openDialog(datatableRefs.value?.selectedItems[0])
  } else {
    salaryRefs.value.openDialog()
  }
}

const viewProfile = item => {
  router.replace('view-user/' + item.id)
}
const onTableChange = value => {
  options.value = value
  fetchRecord()
}

const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    if (type == 'delete') await axios.delete('salary-payments/' + ids)
    if (type == 'force-delete') await axios.delete('force-delete-salary-payments/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
}
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore/salary-payments/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
}
const searchRecord = data => {
  searchOption.value = data
  options.value = { ...options.value, ...data }
  fetchRecord()
}
const fetchRecord = async () => {
  try {
    datatableRefs.value.selectedItems = []
    apiLoading.value = true
    const { data } = await axios.get('salary-payments', { params: options.value })
    tableRecords.value = data.data
    total.value = data.total
    extraTotal.value = data.extraTotal
  } catch (error) {
    console.error('datatable', error)
  }
  apiLoading.value = false
}

const getRole = item => {
  let color = ''
  let name = ''
  if (item.role == 'admin') {
    name = 'ادمین'
    color = 'primary'
  } else if (item.role == 'finance_manager') {
    name = 'مدیر مالی'
    color = 'info'
  } else {
    name = 'مدیر صرافی'
    color = 'warning'
  }

  return { name, color }
}
onMounted(() => {
  fetchRecord()
})
</script>

<style lang="scss">
.expand-card {
  height: 300px !important;
}
</style>

<style>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.5s ease-out;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}
</style>

<route lang="yaml">
meta:
  auth: true
</route>
