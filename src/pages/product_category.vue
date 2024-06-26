<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="د کټګورۍ لست"
      icon="mdi-people"
      create-text="نوی کټګوری"
      edit-text="کټګوری ایدیت "
      @on-create="createCategory"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    />
    <ProductCategory
      ref="categoryRef"
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

//   import VendoPrint from '@/views/pages/products/productPrint.vue'

import ProductCategory from '@/views/pages/products/productCategory.vue'

import usePageConfig from '@/config/pages/product-category'
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
const options = ref({ itemsPerPage: 20, page: 1, tab: 'products' })
const products = ref([])
const datatableRefs = ref()
const extraTotal = ref({})
const categoryRef = ref()
const productEditRefs = ref()
const selectedItemStatus = ref({})
const statusLoading = ref(false)
const selectedId = ref(null)
const createCategory = () => {
  if (datatableRefs.value?.selectedItems?.length == 1) {
    categoryRef.value.toggleDialog(datatableRefs.value?.selectedItems[0])
  } else {
    categoryRef.value.toggleDialog()
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
    const { data } = await axios.post('product-category-status/' + item.status + '/' + item.id)

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
    const res = await axios.get('product-category', { params: options.value })
    products.value = res.data.data

    total.value = res.data.data.length
    extraTotal.value = res.data.extraTotal
  } catch (error) {}
  apiLoading.value = false
}

const deleteRecord = async (type = 'delete') => {
  try {
    const ids = datatableRefs.value.selectedItems.map(row => row.id) ?? []
    if (type == 'delete') await axios.delete('product-category/' + ids)
    if (type == 'force-delete') await axios.delete('force-delete-product/' + ids)
    datatableRefs.value.selectedItems = []
    fetchRecord()
  } catch (error) {}
}
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map(row => row.id) ?? []
    await axios.post('restore-product-category/' + ids)
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
