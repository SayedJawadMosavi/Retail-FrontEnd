<template>
  <ConfirmDialog
    ref="confirmRef"
    @confirm="onConfirm"
  />
  <VDialog
    v-model="show"
    transition="dialog-top-transition"
    persistent
    width="auto"
  >
    <VCard
      width="auto"
      title="راپورگیری"
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
                  v-model="formdata.start_date"
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
                  v-model="formdata.end_date"
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
          @click="show = false"
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
    <PrintReportDialog
      ref="printRefs"
      v-model:print-item="printData"
      v-model:start-date="formdata.start_date"
      v-model:end-date="formdata.end_date"
      :flag="flag"
      :title="title"
      :total="total"
      :headers="headers"
    />
  </VDialog>
  <VBtn
    class="font-weight-bold bg-info"
    style="float: right"
    @click="openDialogs"
  >
    تهیه راپور
    <VIcon
      end
      icon="mdi-export"
    />
  </VBtn>

  <VCol
    cols="12"
    style="margin-top: 40px"
  >
    <!-- 👉 Table -->
    <ConfirmDialog
      ref="confirmRef"
      @confirm="onConfirm"
    />
    <VCard
      title="لیست جزئیات محصول"
      style="min-height: 300px"
    >
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th scope="col">
              شماره
            </th>
            <th scope="col">
              قیمت به ین
            </th>
            <th scope="col">
              مقدار
            </th>
            <th scope="col">
              نرخ تبادله
            </th>
            <th scope="col">
              مصرف
            </th>
            <th scope="col">
              مجموع
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
            v-for="(item, index) in props.productDetail.detail"
            :key="index"
            :class="`${item.deleted_at ? 'text-error' : ''}`"
          >
            <td>
              {{ index + 1 }}
            </td>

            <td>
              {{ item.yen_cost }}
            </td>

            <td>{{ item.quantity }}</td>
            <td>{{ item.rate }}</td>
            <td>{{ item.expense }}</td>
            <td>{{ item.total }}</td>

            <td>{{ moment(item.created_at, 'YYYY-MM-DD').format('ll') }}</td>
            <td>{{ item.description }}</td>
          </tr>
        </tbody>
      </VTable>
    </VCard>
  </VCol>
</template>

<script setup>
import { axios } from '@/plugins/axios-plugin'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import moment from 'moment'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ConfirmDialog from '@/components/commons/ConfirmDialog.vue'

import PrintReportDialog from '@/components/commons/PrintReportDialog.vue'

const props = defineProps({
  productDetail: {
    type: Object,
    default: () => {},
  },
  updateChanges: {
    type: Function,
    default: () => {},
  },
})
const confirmRef = ref()
const formRef = ref()
const selectedType = ref(null)
const showDialog = ref(false)
const reportRefs = ref()
const printData = ref([])
const printRefs = ref()
const headers = ref([])
const printType = ref()
const printLoading = ref(false)
const title = ref('')
const flag = ref('')
const total = ref(0)
const show = ref(false)
const editRef = ref()

const apiLoading = ref(false)
const restoreLoading = ref(false)

const loadingshareholder = ref(false)
const selectedItem = ref({})

const route = useRoute()
const detail_id = ref(route.params.detail_id)
const detail_header = [
  {
    title: 'شماره',
    key: 'ids',
    width: '80px',
  },

  {
    title: 'قیمت به ین',
    key: 'yen_cost',
  },
  {
    title: 'مقدار',
    key: 'quantity',
  },
  {
    title: 'نرخ',
    key: 'rate',
  },

  {
    title: 'مصرف',
    key: 'expense',
  },
  {
    title: 'مجموع',
    key: 'total',
  },

  {
    title: 'تاریخ',
    key: 'created_at',
  },
]
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// const detail_id = props.productDetail.id
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
    let { data } = await axios.get('reports', { params: { type: printType.value,detail_id :detail_id.value, ...formdata.value } })
    printData.value = data
    await sleep(1)
    const printable = window.open('', '_blank')

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
const forceDelete = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type

  confirmRef.value.showDialog('forceDelete')
}

onMounted(() => {
  console.log('fdf',detail_id.value)
})
</script>

<style>
.dp__input{
padding: 12px 4px 12px 40px !important;
}
.dp__menu dp__menu_index  {
background: red !important;

}
.vpd-days{
color:  black;
}
.vpd-input-group input.light  {

  border: 1px solid #6d6985;

}
.vpd-input-group input {
    flex-grow: 1;
    border: 1px solid #6d6985;
    /* border-right: none; */
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    line-height: 30px;
    padding: 7px 12px;
    border-radius: 4px;
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
