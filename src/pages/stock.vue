<template>
    <div>
      <!-- <PageFilter /> -->
      <BreadCrumbs
        v-model:active-tab="options.tab"
        :selected-items="datatableRefs?.selectedItems"
        :items="breadCrumbs"
        :search-options="search"
        page="لیست گدام"
        icon="mdi-people"
        create-text="گدام جدید"
        edit-text="ویرایش گدام "
        :show-create="scope(['user_create'])"
        :show-delete="scope(['user_delete'])"
        :show-restore="scope(['user_restore'])"
        :show-force-delete="scope(['user_force_delete'])"
        @on-force-delete="deleteRecord('force-delete')"
        @on-create="createProduct"
        @on-delete="deleteRecord"
        @on-restore="restoreRecord"
        @on-search="searchRecord"
      >
      
      </BreadCrumbs>
      <insertStock
        ref="productRef"
        :fetch-record="fetchRecord"
      />
  
      <DataTable
        ref="datatableRefs"
        v-model:total="total"
        v-model:loading="apiLoading"
        v-model:extra-total="extraTotal"
        :tabs="tabs"
        :headers="headers"
        :items="products"
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
  
        <template #view_detail="{ item }">
          <VBtn
            variant="text"
            icon
            color="success"
            :loading="detailLoadingLoading && selectedId == item.id"
            @click="viewDetails(item)"
          >
            <VIcon
              size="30"
              icon="mdi-eye-arrow-right"
            />
          </VBtn>
        </template>
      </DataTable>
      <!-- <VendoPrint
        ref="printRefs"
        v-model:print-item="printData"
      /> -->
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { axios } from '@/plugins/axios-plugin'
  import BreadCrumbs from '@/components/commons/BreadCrumbs.vue'
  import DataTable from '@/components/commons/DataTable.vue'
//   import VendoPrint from '@/views/pages/products/productPrint.vue'
  
  import insertStock from '@/views/pages/stock/insertStock.vue'

  import usePageConfig from '@/config/pages/stock'
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
  const detailLoadingLoading = ref(false)
  const printData = ref([])
  const printRefs = ref()
  const total = ref(0)
  const options = ref({ itemsPerPage: 50, page: 1, tab: 'stocks' })
  const products = ref([])
  const datatableRefs = ref()
  const extraTotal = ref({})
  const productRef = ref()
  const productEditRefs = ref()
  const selectedItemStatus = ref({})
  const statusLoading = ref(false)
  const selectedId = ref(null)
  const createProduct = () => {
    if (datatableRefs.value?.selectedItems?.length == 1) {
        productRef.value.toggleDialog(datatableRefs.value?.selectedItems[0])
    } else {
      productRef.value.toggleDialog()
    }
  }
  
  const viewDetails = async item => {
    detailLoadingLoading.value = true
    selectedId.value = item.id
    await router.replace('view-stock-detail/' + item.id)
    detailLoadingLoading.value = false
  }
  const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  const print = async item => {
    try {
      selectedItemStatus.value = item
      printLoading.value = true
      let { data } = await axios.get('product-purchase?id=' + item.id)
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
      selectedItemStatus.value = item
      statusLoading.value = true
      const { data } = await axios.post('stock-status', item)
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
      const res = await axios.get('stock', { params: options.value })
      products.value = res.data.data
      
      total.value = res.data.data.length
      extraTotal.value = res.data.extraTotal
    } catch (error) {}
    apiLoading.value = false
  }
  const deleteRecord = async (type = 'delete') => {
    try {
      const ids = datatableRefs.value.selectedItems.map(row => row.id) ?? []
      if (type == 'delete') await axios.delete('stock/' + ids)
      if (type == 'force-delete') await axios.delete('force-delete-stock/' + ids)
      datatableRefs.value.selectedItems = []
      fetchRecord()
    } catch (error) {}
  }
  const restoreRecord = async () => {
    try {
      const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
      await axios.post('restore-stock/' + ids)
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
  