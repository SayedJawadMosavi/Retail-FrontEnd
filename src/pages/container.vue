<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لیست کانتینر"
      icon="mdi-people"
      create-text="کانتینر جدید"
      edit-text="ویرایش کانتینر "
      
      @on-create="createContainer"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    />
    <AddContainer
      ref="containerRef"
      :fetch-record="fetchRecord"
    />
  
    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:loading="apiLoading"
      v-model:extra-total="extraTotal"
      :tabs="tabs"
      :headers="headers"
      :items="containers"
      @table-change="onTableChange($event)"
    >
      <template #status="{ item }">
        <VSwitch
          :model-value="item.status"
          inset
          :true-value="1"
          :loading="selectedItemStatus.id == item.id && statusLoading"
          @click="changeStatus(item)"
        />
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
    <!--
      <VendoPrint
      ref="printRefs"
      v-model:print-item="printData"
      /> 
    -->
  </div>
</template>
  
<script setup>
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
import DataTable from '@/components/commons/DataTable.vue'

import AddContainer from '@/views/pages/container/AddContainer.vue'

import usePageConfig from '@/config/pages/container'
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
const options = ref({ itemsPerPage: 50, page: 1, tab: 'containers' })
const containers = ref([])
const datatableRefs = ref()
const extraTotal = ref({})
const containerRef = ref()
const productEditRefs = ref()
const selectedItemStatus = ref({})
const statusLoading = ref(false)
const selectedId = ref(null)
const createContainer = () => {
  if (datatableRefs.value?.selectedItems?.length == 1) {
    containerRef.value.toggleDialog(datatableRefs.value?.selectedItems[0])
  } else {
    containerRef.value.toggleDialog()
  }
}
  

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const searchRecord = data => {
  searchOption.value = data
  options.value = { ...options.value, ...data }
  fetchRecord()
}
const changeStatus = async item => {
  try {
    selectedItemStatus.value = item
    statusLoading.value = true
    const { data } = await axios.post('container-status', item)
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
    const res = await axios.get('container', { params: options.value })
    containers.value = res.data.data
      
    total.value = res.data.data.length
    extraTotal.value = res.data.extraTotal
  } catch (error) {}
  apiLoading.value = false
}
  
const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value.selectedItems.map(row => row.id) ?? []
    if (type == 'delete') await axios.delete('container/' + ids)
    if (type == 'force-delete') await axios.delete('force-delete-product/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {}
}
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore-container/' + ids)
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
  