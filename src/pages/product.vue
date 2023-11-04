<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لیست محصولات"
      icon="mdi-people"
      create-text="محصول  جدید"
      edit-text="ویرایش محصولات "
      :show-create="scope(['product_create'])"
      :show-delete="scope(['product_delete'])"
      :show-restore="scope(['product_restore'])"
      :show-force-delete="scope(['product_force_delete'])"
      @on-force-delete="deleteRecord('force-delete')"
      @on-create="createProduct"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    >
      <template #default>
        <VBtn
         
          class="font-weight-bold bg-info"
          to="product_category"
        >
          کتگوری
          <VIcon
            end
            icon="mdi-export"
          />
        </VBtn>
      </template>
    </BreadCrumbs>
    <InsertProduct
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
      <template #category="{ item }">
        <div style="white-space: nowrap">
          {{ item.category.name }}
        </div>
      </template>
      <template #quantity="{ item }">
        <VChip
          style="direction: ltr"
          small
          :color="item.quantity>0 ?'success' :'error'"
          class="font-weight-medium"
        >
          {{ item.quantity }} 
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
          :loading="detailLoading && selectedId == item.id"
          @click="viewDetails(item)"
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

//   import VendoPrint from '@/views/pages/products/productPrint.vue'
  
import InsertProduct from '@/views/pages/products/insertProduct.vue'

import usePageConfig from '@/config/pages/product'
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
const detailLoading = ref(false)
const printData = ref([])
const printRefs = ref()
const total = ref(0)
const options = ref({ itemsPerPage: 50, page: 1, tab: 'products' })
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
  detailLoading.value = true
  selectedId.value = item.id
  await router.replace('view-product-detail/' + item.id)
  detailLoading.value = false
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
    statusLoading.value = true
    const { data } = await axios.post('product-status/' + item.status + '/' + item.id)
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
    const res = await axios.get('product', { params: options.value })
    products.value = res.data.data

    // let total_Afg = 0
    // let total_usd = 0
    // res.data.data.forEach(row => {
    //   row.items.forEach(element => {
    //     total_Afg=0;
          
    //     if (row.id == element.product_id) {
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
    if (type == 'delete') await axios.delete('product/' + ids)
    if (type == 'force-delete') await axios.delete('force-delete-product/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {}
}
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore-product/' + ids)
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
  