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
        title="تهیه راپور"
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
                <p class="mb-0">
                  ختم تاریخ
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
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn
            color="secondary"
            @click="show=false;fetchRecord()"
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
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لست مشتری"
      icon="mdi-people"
      create-text="مشتری جدید"
      edit-text="ویرایش مشتری"
      :show-create="scope(['customer_create'])"
      :show-delete="scope(['customer_delete'])"
      :show-restore="scope(['customer_restore'])"
      :show-force-delete="scope(['customer_force_delete'])"
      @on-force-delete="deleteRecord('force-delete')"
      @on-create="createCustomer"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    >
      <template #default>
        <VBtn
          v-if="options.tab != 'trash'"
          class="font-weight-bold ml-2"
          @click="TakeReport"
        >
          پرنت
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
          راپور
          <VIcon
            end
            icon="mdi-export"
          />
        </VBtn>
      </template>
    </BreadCrumbs>
    <InsertCustomers
      ref="customerRef"
      :fetch-record="fetchRecord"
    />
    <ReportDialog ref="reportRefs" />

    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:loading="apiLoading"
      v-model:extra-total="extraTotal"
      :tabs="tabs"
      :headers="headers"
      :items="customers"
      @table-change="onTableChange($event)"
    >
      <template
        v-for="i in 1"
        #id="{ item }"
        :key="i"
      >
        {{ i++ }}
      </template>
      <template #paid_amount="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="success"
          class="font-weight-medium"
        >
          {{ item?.payments_sum_amount?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>
      <template #total_price="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="primary"
          class="font-weight-medium"
        >
          {{ item.total_price?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>
      <template #reminder="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="error"
          class="font-weight-medium"
        >
          {{ item.remainder?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>

      <template #status="{ item }">
        <VBtn
          v-if="item.status == 0"
          variant="text"
          icon
          :loading="selectedItemStatus.id == item.id && statusLoading"
          @click="changeStatus(item)"
        >
          <VTooltip
            activator="parent"
            location="top"
          >
            فعال کردن
          </VTooltip>
          <VIcon
            size="30"
            :color="item.status == 0 ? 'error' : 'success'"
            icon="mdi-close-thick"
          />
        </VBtn>
        <VBtn
          v-else
          variant="text"
          icon
          @click="changeStatus(item)"
        >
          <VTooltip
            activator="parent"
            location="top"
          >
            غیر فعال
          </VTooltip>
          <VIcon
            size="30"
            color="success"
            icon="mdi-check"
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
import InsertCustomers from '@/views/pages/customers/InsertCustomer.vue'
import usePageConfig from '@/config/pages/customer'
import router from '@/router'
import ReportDialog from '@/components/commons/ReportDialog.vue'

import { scope } from '@/@core/utils/index'
import { required, numeric, minLength, maxLength, minValue, maxValue, email, helpers } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import { useVuelidate } from '@vuelidate/core'
const CaloriesTemplate = defineComponent({
  props: ['data'],
  template: `
      <div>
        {{ data }}
      </div>
    `,
})

const { tabs, headers, breadCrumbs, search } = usePageConfig()
const apiLoading = ref(false)
const expand = ref(false)
const searchOption = ref({})

const total = ref(0)
const options = ref({ page: 1, itemPerPage: 50, tab: 'customers' })
const customers = ref([])
const datatableRefs = ref()
const extraTotal = ref({})
const customerRef = ref()
const customerEditRefs = ref()
const selectedItemStatus = ref({})
const statusLoading = ref(false)

const profileLoading = ref(false)
const selectedId = ref(null)
const reportRefs = ref()
const printType = ref()
const printLoading = ref(false)
const show = ref(false)

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
const getReport = async () => {
  if (payload.value.start_date == null || payload.value.end_date == null) {
    toast.error('please fill the form correctly')
    
    return false
  }
  try {
    printLoading.value = true
    let { data } = await axios.get('customer_reports', {  params: { type:printType.value, ...payload.value }  })
    customers.value = data.data
    total.value =data.total
    extraTotal.value = data.extraTotal
    show.value = false

  } catch (error) {
    console.error('error', error)
  }
  printLoading.value = false
}
const createCustomer = () => {
  // customerRef.value.toggleDialog()
  if (datatableRefs.value?.selectedItems?.length == 1) {
    customerRef.value.toggleDialog(datatableRefs.value?.selectedItems[0])
  } else {
    customerRef.value.toggleDialog()
  }
}
const viewProfile = async item => {
  profileLoading.value = true
  selectedId.value = item.id
  await router.replace('view-customer/' + item.id)
}
const searchRecord = data => {
  searchOption.value = data
  options.value = { ...options.value, ...data }
  fetchRecord()
}
const changeStatus = async item => {
  try {
    statusLoading.value = true
    const { data } = await axios.post('customer-status/' + item.status + '/' + item.id)
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
  statusLoading.value = false
}
const onTableChange = value => {

  options.value = value
  fetchRecord()
}

const fetchRecord = async () => {
  try {
    datatableRefs.value.selectedItems = []
    apiLoading.value = true
    const { data } = await axios.get('customer', { params: options.value })
    customers.value = data.data
    total.value = data.total
    extraTotal.value = data.extraTotal
  } catch (error) {
    console.error('datatable', error)
  }
  apiLoading.value = false
}


const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value.selectedItems.map(row => row.id) ?? []
    if (type == 'delete') await axios.delete('customer/' + ids)
    if (type == 'force-delete') await axios.delete('force-delete-customer/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {}
}
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore-customer/' + ids)
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
