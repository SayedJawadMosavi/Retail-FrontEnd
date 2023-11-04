<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لیست معامله داران"
      icon="mdi-people"
      create-text="معامله دار جدید"
      edit-text="ویرایش معامله دار"
      :show-create="scope(['vendor_create'])"
      :show-delete="scope(['vendor_delete'])"
      :show-restore="scope(['vendor_restore'])"
      :show-force-delete="scope(['vendor_force_delete'])"
      @on-force-delete="deleteRecord('force-delete')"
      @on-create="createVendor"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    >
      <template #default />
    </BreadCrumbs>
    <InsertVendor
      ref="vendorRef"
      :fetch-record="fetchRecord"
    />

    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:loading="apiLoading"
      v-model:extra-total="extraTotal"
      :tabs="tabs"
      :headers="headers"
      :items="vendors"
      @table-change="onTableChange($event)"
    >
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
      <template #print="{ item }">
        <VBtn
          variant="text"
          icon
          class="font-weight-bold"
          :loading="printLoading && selectedItemStatus.id == item.id"
          @click="print(item)"
        >
          <VIcon
            size="30"
            icon="mdi-printer"
          />
        </VBtn>
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

      <template #extra_expense_sum_price="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="warning"
          class="font-weight-medium"
        >
          {{ item.extra_expense_sum_price?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>

      <template #view_expense="{ item }">
        <VBtn
          variant="text"
          icon
          color="success"
          :loading="expenseLoading && selectedId == item.id"
          @click="viewExpense(item)"
        >
          <VIcon
            size="30"
            icon="mdi-eye-arrow-right"
          />
        </VBtn>
      </template>
    </DataTable>
    <VendoPrint
      ref="printRefs"
      v-model:print-item="printData"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
import DataTable from '@/components/commons/DataTable.vue'
import VendoPrint from '@/views/pages/vendors/vendorPrint.vue'

import InsertVendor from '@/views/pages/vendors/InsertVendor.vue'

import usePageConfig from '@/config/pages/vendor'
import router from '@/router'
import { formateDate, scope } from '@/@core/utils/index'
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
const printLoading = ref(false)
const expenseLoading = ref(false)
const printData = ref([])
const printRefs = ref()
const total = ref(0)
const options = ref({ itemsPerPage: 50, page: 1, tab: 'vendors' })
const vendors = ref([])
const datatableRefs = ref()
const extraTotal = ref({})
const vendorRef = ref()
const vendorEditRefs = ref()
const selectedItemStatus = ref({})
const statusLoading = ref(false)
const selectedId = ref(null)
const createVendor = () => {
  if (datatableRefs.value?.selectedItems?.length == 1) {
    vendorRef.value.toggleDialog(datatableRefs.value?.selectedItems[0])
  } else {
    vendorRef.value.toggleDialog()
  }
}

const viewExpense = async item => {
  expenseLoading.value = true
  selectedId.value = item.id
  await router.replace('view-purchase-expense/' + item.id)
  expenseLoading.value = false
}
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const print = async item => {
  try {
    selectedItemStatus.value = item
    printLoading.value = true
    let { data } = await axios.get('vendor-purchase?id=' + item.id)
    printData.value = await data
    await sleep(1)
    const printable = window.open('dcvdv', '_blank')

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

const changeStatus = async item => {
  try {
    statusLoading.value = true
    const { data } = await axios.post('vendor-status/' + item.status + '/' + item.id)
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
    apiLoading.value = true
    datatableRefs.value.selectedItems = []
    const res = await axios.get('vendor', { params: options.value })
    vendors.value = res.data.data

    // let total_Afg = 0
    // let total_usd = 0
    // res.data.data.forEach(row => {
    //   row.items.forEach(element => {
    //     total_Afg=0;

    //     if (row.id == element.vendor_id) {
    //       console.log('eklkkk', element)
    //       if (element.currency == 'Afg') {
    //         console.log('my id', element.cost)

    //         total_Afg += parseFloat(element.cost ?? 0)
    //       } else {
    //         total_usd += parseFloat(element.cost ?? 0)
    //       }
    //     }
    //   })
    // })
    // console.log('usd', total_usd)
    // console.log('Afg', total_Afg)
    total.value = res.data.data.length
    extraTotal.value = res.data.extraTotal
  } catch (error) {}
  apiLoading.value = false
}

const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value.selectedItems.map(row => row.id) ?? []
    if (type == 'delete') await axios.delete('vendor/' + ids)
    if (type == 'force-delete') await axios.delete('force-delete-vendor/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {}
}
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore-vendor/' + ids)
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
