<template>
  <VCol
    cols="12"
    style="margin-top: 30px"
  >
    <VBtn
      class="mb-2"
      to="/purchase"
    >
      <VIcon
        start
        icon="mdi-undo-variant"
      />
      بازگشت
    </VBtn>
    <!-- 👉 Table -->
    <ConfirmDialog
      ref="confirmRef"
      @confirm="onConfirm"
    />

    <VCard
    
      title=" Detail List"
      style="min-height: 300px"
    >
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th scope="col">
              ID
            </th>
            <th scope="col">
              اسم محصول
            </th>
            <th scope="col">
              مقدار
            </th>

            <th scope="col">
              تاریخ
            </th>
            <th scope="col">
              توضیحات
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in purchaseData"
            :key="index"
            :class="`${item.deleted_at ? 'text-error' : ''}`"
          >
            <td>
              {{ item.id }}
            </td>
            <td>{{ item.product.product_name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formateDate(item.created_at) }}</td>
            <td>{{ item.description }}</td>
          </tr>
        </tbody>
      </VTable>
    </VCard>
  </VCol>
</template>

<script setup>
import { axios } from '@/plugins/axios-plugin'
import { formateDate, scope } from '@/@core/utils/index'
import ConfirmDialog from '@/components/commons/ConfirmDialog.vue'
import moment from 'moment'
import PrintReportDialog from '@/components/commons/PrintReportDialog.vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  clientGoldDetail: {
    type: Object,
    default: () => {},
  },
  updateChanges: {
    type: Function,
    default: () => {},
  },
})
const route = useRoute()
const selectedType = ref(null)
const showDialog = ref(false)
const reportRefs = ref()
const printData = ref([])
const printRefs = ref()
const headers = ref([])
const printType = ref()
const printLoading = ref(false)
const apiLoading = ref(false)
const purchaseData = ref({})

const confirmRef = ref()
const apiLoading2 = ref(false)
const restoreLoading = ref(false)
const item_id = ref(route.params.item_id)

const selectedItem = ref({})

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const formdata = ref({
  start_date: new Date(),
  end_date: new Date(),
})
const openDialogs = type => {
  printType.value = 'detail'
  formdata.value = {
    start_date: new Date(),
    end_date: new Date(),
  }
  show.value = true
}
const getReport = async () => {
  if (formdata.value.start_date == null || formdata.value.end_date == null) {
    toast.error('please fill the form correctly')

    return false
  }
  try {
    console.log('pppp', printType.value)
    if (printType.value == 'detail') {
      headers.value = detail_header

      flag.value = 'detail'
    }

    printLoading.value = true
    let { data } = await axios.get('reports', { params: { type: printType.value, ...formdata.value } })
    printData.value = data
    await sleep(1)
    const printable = window.open('', '_blank')

    printable.document.write('<html style="direction:ltr"><head><style>@page { size: A4 landscape }</style>')
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
const getOrderInfo = async () => {
  try {
    apiLoading.value = true
    const { data } = await axios.get('receive_product/' + item_id.value)
    purchaseData.value = data
    resetData.value = JSON.parse(JSON.stringify(data))
    if (data.deleted_at) {
      snackbar.value = true
    }
  } catch (error) {
 
  }
  apiLoading.value = false
}

onMounted(() => {
  getOrderInfo()

  console.log('item id', item_id.value)
})
</script>

<style>
.dp__input{
padding: 12px 4px 12px 40px !important;
}
.dp__menu dp__menu_index  {
background: red !important;

}

.dp__theme_dark ,.dp__theme_light  {
--dp-background-color:  rgb(var(--v-theme-surface));
--dp-text-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
--dp-hover-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
--dp-hover-text-color: gba(var(--v-theme-on-surface),1);
--dp-hover-icon-color: var(--v-theme-on-surface);
--dp-primary-color: #40A579;
--dp-primary-text-color:#fff;
--dp-secondary-color: #8A8D93;
--dp-border-color:rgba(var(--v-border-color), var(--v-border-opacity));
--dp-menu-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
--dp-border-color-hover:rgba(var(--v-border-color),var(--v-medium-emphasis-opacity) )
--dp-border-radius:10px  !important;
--dp-disabled-color:var(--v-disabled-opacity);
--dp-scroll-bar-background: var(--v-theme-on-surface);
--dp-scroll-bar-color: #484848;
--dp-success-color: #00701a;
--dp-success-color-disabled: #428f59;
--dp-icon-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
--dp-danger-color: #e53935;
--dp-highlight-color: rgba(0, 92, 178, 0.2);
}
</style>
