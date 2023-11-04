<template>
  <div>
    <ReportDialog ref="reportRefs" />
  
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لست انتقالات گدام به گدام "
      create-text=" انتقال   "
      edit-text="ویرایش  "
      icon="mdi-shopping-outline"
      :show-create="scope(['stock_to_stock_transfer_create'])"
      :show-delete="scope(['stock_to_stock_transfer_delete'])"
      :show-restore="scope(['stock_to_stock_transfer_restore'])"
      :show-force-delete="scope(['stock_to_stock_transfer_force_delete'])"
      @on-create="createIncome"
      @on-delete="deleteRecord"
      @on-force-delete="deleteRecord('force-delete')"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    />
  
    <StockToStockTransfer
      ref="formRef"
      :selected-items="datatableRefs?.selectedItems"
      :fetch-record="fetchRecord"
    />
  
    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:loading="apiLoading"
      v-model:extra-total="extraTotal"
      v-model:items="tableRecords"
      :tabs="tabs"
      :headers="headers"
      :extra-info="extraInfo"
      @table-change="onTableChange($event)"
    >
      <template #products_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.product_stock.product.product_name }}
        </div>
      </template>
      <template #sender_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.sender.name }}
        </div>
      </template>
      <template #receiver_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.receiver.name }}
        </div>
      </template>
    </DataTable>
  </div>
</template>
  
<script setup>
import StockToStockTransfer from '@/views/pages/stock_to_stock/StockToStockTransfer.vue'
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
import DataTable from '@/components/commons/DataTable.vue'
import ReportDialog from '@/components/commons/ReportDialog.vue'
  
import usePageConfig from '@/config/pages/stock_to_stock_transfer'
import { scope } from '@/@core/utils/index'
  
const { tabs, headers, breadCrumbs, search } = usePageConfig()
const total = ref(0)
const extraTotal = ref({})
const searchOption = ref({})
const apiLoading = ref(false)
  
const formRef = ref()
const extraInfo = ref({})
const datatableRefs = ref()
const reportRefs = ref()
  
const TakeReport = () => {
  reportRefs.value.showPrintConfirm(options.value.tab)
}
const searchRecord = data => {
  searchOption.value = data
  options.value = { ...options.value, ...data }
  fetchRecord()
}
  
const fetchRecord = async () => {
  try {
    apiLoading.value = true
    datatableRefs.value.selectedItems = []
    const { data } = await axios.get('stock_to_stocks_transfer', { params: options.value })
    tableRecords.value = data.data
    total.value = data.total
    extraTotal.value = data.extraTotal
    extraInfo.value = data.extra
  } catch (error) {}
  apiLoading.value = false
}
  
const options = ref({ page: 1, itemPerPage: 20, tab: 'stock_to_stocks_transfer' })
const tableRecords = ref([])
  
const createIncome = () => {
  if (datatableRefs.value?.selectedItems?.length == 1) {
    formRef.value.toggleDialog(datatableRefs.value?.selectedItems[0])
  
    return
  }
  formRef.value.toggleDialog()
}
  
const onTableChange = value => {
  options.value = value
  fetchRecord()
}
  
const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
  
    if (type == 'delete') await axios.delete('stock_to_stocks_transfer/' + ids)
    if (type == 'force-delete') await axios.delete('force-delete-stock_to_stocks_transfer/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
}
  
onMounted(() => {
  fetchRecord()
})
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore-stock_to_stocks_transfer/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {
    console.error(error)
  }
}
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
  