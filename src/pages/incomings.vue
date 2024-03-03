<template>
  <div>
    <ReportDialog ref="reportRefs" />
  
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لیست رفت و آمد"
      create-text="افزودن رفت و آمد"
      edit-text="ویرایش رفت و آمد"
      icon="mdi-shopping-outline"
      :show-create="scope(['income_expense_create'])"
      :show-delete="scope(['income_expense_delete'])"
      :show-restore="scope(['income_expense_restore'])"
      :show-force-delete="scope(['income_expense_force_delete'])"
      @on-create="createIncome"
      @on-delete="deleteRecord"
      @on-force-delete="deleteRecord('force-delete')"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    >
      <template #default>
        <VBtn
          v-if="options.tab!='trash'"
          class="font-weight-bold ml-2"
          @click="TakeReport"
        >
          تهیه راپور
          <VIcon
            end
            icon="mdi-printer"
          />
        </VBtn>

        <VBtn
         
          class="font-weight-bold bg-info"
          to="expense_income_category"
        >
          کتگوری
          <VIcon
            end
            icon="mdi-export"
          />
        </VBtn>
      </template>
    </BreadCrumbs>
  
    <AddIncome
      ref="incomeRefs"
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
      <template #category="{ item }">
        <div style="white-space: nowrap">
          {{ item.category.name }}
        </div>
      </template>
      <template #paid_amount="{ item }">
        <VChip
          small
          color="success"
          class="font-weight-medium"
        >
          {{ item?.payments_sum_amount ?? 0 }}
        </VChip>
      </template>
      <template #total_amount="{ item }">
        <VChip
          small
          color="primary"
          class="font-weight-medium"
        >
          {{ item?.extra_expense_sum_price ?? 0 + item?.items?.total_price ?? 0 }}
        </VChip>
      </template>
      <template #remainder="{ item }">
        <VChip
          small
          color="error"
          class="font-weight-medium"
        >
          {{ (item?.extra_expense_sum_price ?? 0 + item?.items?.total_price ?? 0) - item?.payments_sum_amount ?? 0 }}
        </VChip>
      </template>
  
      <template #created_by="{ item }">
        {{ item.user?.name }}
      </template>
  
      <template #type="{ item }">
        <VChip
          small
          :color="item.type == 'incoming' ? 'info' : 'error'"
          class="font-weight-medium"
        >
          {{ item.type == 'incoming' ? 'آمد' : 'رفت' }}
        </VChip>
      </template>
  
      <template #amount="{ item }">
        <VChip
          small
          style="direction: ltr"
          :color="item.type == 'incoming' ? 'primary' : 'error'"
          class="font-weight-medium"
        >
          {{ item.amount }} $
        </VChip>
      </template>
      <template #name="{ item }">
        <p
          class="font-weight-medium"
          style="white-space: nowrap"
        >
          {{ item.name }}
        </p>
      </template>
    </DataTable>
  </div>
</template>
  
<script setup>
import AddIncome from '@/views/pages/incoming/AddIncome.vue'
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
import DataTable from '@/components/commons/DataTable.vue'
import ReportDialog from '@/components/commons/ReportDialog.vue'
  
import usePageConfig from '@/config/pages/incomings'
import { scope } from '@/@core/utils/index'
  
const { tabs, headers, breadCrumbs, search } = usePageConfig()
const total = ref(0)
const extraTotal = ref({})
const searchOption = ref({})
const apiLoading = ref(false)
  
const incomeRefs = ref()
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
    const { data } = await axios.get('income-outgoing', { params: options.value })
    tableRecords.value = data.data
    total.value = data.total
    extraTotal.value = data.extraTotal
    extraInfo.value = data.extra
  } catch (error) {
      
  }
  apiLoading.value = false
}
  
const options = ref({ page: 1, itemPerPage: 20, tab: 'incoming' })
const tableRecords = ref([])
  
const createIncome = () => {
  if (datatableRefs.value?.selectedItems?.length == 1) {
    incomeRefs.value.openDialog(datatableRefs.value?.selectedItems[0])
  
    return
  }
  incomeRefs.value.openDialog()
}
  
const onTableChange = value => {
  options.value = value
  fetchRecord()
}
  
const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
      
    if (type == 'delete') await axios.delete('income-outgoing/' + ids)
    if (type == 'force-delete') await axios.delete('force-delete-income-outgoing/' + ids)
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
    await axios.post('restore-incoming-outgoing/' + ids)
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
  