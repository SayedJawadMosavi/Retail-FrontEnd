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
                <p
                  v-if="validationRules(v$.start_date, 'تاریخ').length > 0"
                  class="text-error"
                >
                  {{ validationRules(v$.start_date, 'تاریخ شروع')[0] }}
                </p>
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
                <p
                  v-if="validationRules(v$.end_date, 'تاریخ').length > 0"
                  class="text-error"
                >
                  {{ validationRules(v$.end_date, 'ختم تاریخ')[0] }}
                </p>
              </VCol>
              <VCol
                cols="12"
                md="12"
              >
                <VSelect
                  v-model="payload.type"
                  :items="items"
                  label="Type"
                  append-inner-icon="mdi-shield-sun-outline"
                  class="search-by"
                  item-title="name"
                  item-value="id"
                  :rules="validationRules(v$.type, 'Type')"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn
            color="secondary"
            @click="closeReset"
          >
            کنسل
          </VBtn>
          <VBtn
            ripple
            color="primary"
            variant="tonal"
            @click="print"
          >
            پرنت
            <VIcon
              icon="mdi-printer"
              end
            />
          </VBtn>
          <VBtn
            ripple
            color="primary"
            variant="tonal"
            @click="getReport"
          >
            راپور
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
        v-model:start-date="payload.start_date"
        v-model:end-date="payload.end_date"
        :title="title"
        :headers="headerss"
      />
    </VDialog>

    <!-- <PageFilter /> -->
    <ReportDialog ref="reportRefs" />
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="لیست گزارشات"
      icon="mdi-gesture-tap"
      :show-create="scope(['not_create'])"
      :show-delete="scope(['not_delete'])"
      :show-restore="scope(['not_restore'])"
      :show-force-delete="scope(['not_force_delete'])"
      @on-force-delete="deleteRecord('force-delete')"
      @on-search="searchRecord"
    >
      <template #default>
        <VBtn
          v-if="options.tab != 'trash'"
          style="margin-left: 10px"
          class="font-weight-bold bg-warning"
          @click="TakeReport"
        >
          تهیه راپور
          <VIcon
            end
            icon="mdi-printer"
          />
        </VBtn>
      </template>
    </BreadCrumbs>
    <div
      v-if="extra"
      style="border: 1px solid rebeccapurple; padding: 5px; border-radius: 10px"
      class="d-flex align-center"
    >
      <VRow>
        <VCol
          cols="12"
          md="4"
        >
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> مجموع آمد :</span>
            {{ total_amount_income_usd ?? 0 }}
          </div>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <div class="pe-3 text-error me-5">
            <span class="d-inline-block pe-1"> مجموع رفت : </span> {{ total_expense_usd ?? 0 }}
          </div>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <div class="pe-3 me-5 text-warning">
            <span class="d-inline-block pe-1"> موجودی : </span>
            {{ balance ?? 0 }}
          </div>
        </VCol>
      </VRow>
    </div>
    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:loading="apiLoading"
      v-model:extra-total="extraTotal"
      :tabs="tabs"
      :title="title"
      :headers="headerss"
    
      :items="reports"
      @table-change="onTableChange($event)"
    >
      <template #position="{ item }">
        {{ item?.employee?.job_title }}
      </template>
      <template #salary="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="success"
          class="font-weight-medium"
        >
          {{ item?.salary ?? 0 }} $
        </VChip>
      </template>
      <template #payable_amount="{ item }">
        <VChip
          small
          color="info"
          class="font-weight-medium"
        >
          {{ item?.salary }}
        </VChip>
      </template>
      <template #remainder="{ item }">
        <VChip
          small
          color="error"
          class="font-weight-medium"
        >
          {{ item.salary - item?.paid }}
        </VChip>
      </template>
      <template #employee_name="{ item }">
        {{ item.employee?.first_name + ' ' + item.employee?.last_name }}
      </template>
      <template #reminders="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="error"
          class="font-weight-medium"
        >
          {{ item.remainders?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>
      <template #category_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.category.name }}
        </div>
      </template>
      <template #print="{ item }">
        <VBtn
          variant="text"
          icon
          class="font-weight-bold"
          @click="print(item)"
        >
          <VIcon
            size="30"
            icon="mdi-printer"
          />
        </VBtn>
      </template>
      <template #view_profile="{ item }">
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
      <template #paid_amount="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="success"
          class="font-weight-medium"
        >
          {{ item?.payments_sum_amount ?? 0 }} $
        </VChip>
      </template>
      <template #total_price="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="primary"
          class="font-weight-medium"
        >
          {{ item.total_price ?? 0 }} $
        </VChip>
      </template>
      <template #purchase_remainder="{ item }">
        <VChip
          style="direction: ltr"
          small
          color="error"
          class="font-weight-medium"
        >
          {{ item.remainder?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>
      <template #sell_remainder="{ item }">
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

      <template #vendor_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.vendor.name }}
        </div>
      </template>
      <template #customer_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.customer.first_name }}
        </div>
      </template>
      <template #container_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.container.name }}
        </div>
      </template>
      <template #created_b="{ item }">
        {{ item.user?.name }}
      </template>
      <template
        v-for="i in 1"
        #ids="{ item }"
        :key="i"
      >
        {{ i++ }}
      </template>
      <template #profile="{ item }">
        <VBtn
          variant="plain"
          class="font-weight-bold px-1"
          :loading="profileLoading && selectedId == item.id"
          @click="viewProfile(item)"
        >
          <VIcon
            size="30"
            start
            icon="mdi-eye-arrow-right"
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
import InsertEmployee from '@/views/pages/employee/InsertEmployee.vue'

import usePageConfig from '@/config/pages/report'
import PrintReportDialog from '@/components/commons/PrintReportDialog.vue'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import { useVuelidate } from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import router from '@/router'
import { scope } from '@/@core/utils/index'
import { toast } from 'vue3-toastify'

const CaloriesTemplate = defineComponent({
  props: ['data'],
  template: `
      <div>
        {{ data }}
      </div>
    `,
})
const printType = ref()

// const tabs = [
//   { title: 'گزارش', icon: 'mdi-account-group-outline', count: 0, key: 'reports' },
//   { title: 'حذف شده ها', icon: 'mdi-trash', count: 0, key: 'trash' },
// ]
const extra = ref({})
const st_balance = ref(0)
const re_balance = ref(0)
const items = [
  { id: 'journal', name: 'راپور روزنامچه' },
  { id: 'product', name: 'راپور محصولات' },
  { id: 'purchase', name: 'راپور خرید' },
  { id: 'sell', name: 'راپور فروش' },
  { id: 'employee', name: 'راپورکارمندان' },
  { id: 'salaries', name: 'راپور معاش' },
  { id: 'income', name: 'راپور آمد' },
  { id: 'expense', name: 'راپور رفت' },
  { id: 'customers', name: 'راپور مشتری' },
]
const product_headers= [ 
  {
    title: 'شماره',
    key: 'ids',
  },

  // {
  //   title: 'دیدن جزییات',
  //   key: 'view_expense',
  // },

  // {
  //   title: 'پرنت',
  //   key: 'print',
  // },
  {
    title: 'اسم محصول',
    key: 'product_name',
   
               
  },
  
  {
    title: 'اسم کتگوری',
    key: 'category_name',
               
  },
  {
    title: 'کمپنی',
    key: 'company_name',
   
               
  },
  {
    title: 'کود',
    key: 'code',
   
               
  },
  {
    title: 'مقدار',
    key: 'quantity',
   
               
  },
  {
    title: 'رنگ',
    key: 'color',
   
               
  },
  {
    title: 'سایز',
    key: 'size',
  },
    

 
    
  // {
  //   title: ' Start Date',
  //   key: 'start_date',
  // },
  // {
  //   title: ' End Date',
  //   key: 'end_date',
  // },
  {
    title: 'توضیحات',
    key: 'description',
  },
  {
    title: 'حالت',
    key: 'status',
  },
  
]
  
const purchase_headers = [
  {
    title: '#آی دی',
    key: 'ids',
  },

  // {
  //   title: 'دیدن بیشتر',
  //   key: 'view_profile',
  // },
  {
    title: 'حالت',
    key: 'status',
  },
  {
    title: 'پرینت',
    key: 'print',
  },
  
  {
    title: 'اسم کانتینر',
    key: 'container_name',
  },
   
  {
    title: 'اسم معامله دار',
    key: 'vendor_name',
  },

 
  
  {
    title: 'مجموع مصارف دیگر',
    key: 'extra_expense_sum_price',
    width: '140px',
  },
  {
    title: 'مجموع قیمت',
    key: 'total_price',
    width: '100px',
  },
  {
    title: 'مقدار پرداخت شده',
    key: 'paid_amount',
    width: '130px',
  },
  {
    title: 'باقیمانده',
    key: 'purchase_remainder',
    width: '180px',
  },
   
  {
    title: 'توضیحات',
    key: 'description',
  },
  {
    title: 'تاریخ ثبت',
    key: 'created_at',
  },
]
const sell_headers = [
  {
    title: '#آی دی',
    key: 'ids',
  },
   
  // {
  //   title: 'دیدن بیشتر',
  //   key: 'view_profile',
  // },
  // {
  //   title: 'پرینت',
  //   key: 'print',
  // },
  
  {
    title: 'اسم مشتری',
    key: 'customer_name',
  },
   
  
  {
    title: 'مجموع قیمت',
    key: 'total_price',
    width: '100px',
  },
  {
    title: 'مقدار پرداخت شده',
    key: 'paid_amount',
    width: '130px',
  },
  {
    title: 'باقیمانده',
    key: 'sell_remainder',
    width: '180px',
  },
   
  {
    title: 'توضیحات',
    key: 'description',
  },
  {
    title: 'تاریخ ثبت',
    key: 'sell_date',
  },
]
const journal_headers= [
  {
    title: 'آی دی#',
    key: 'ids',
  },
  {
    title: 'اسم',
    key: 'name',
  },
    
  {
    title: 'نوعیت',
    key: 'type',
    width:'160px',
  
               
  },

  {
    title: 'مقدار',
    key: 'amount',
    width: '140px',
      
  
  },
  
  {
    title: 'ثبت شده توسط',
    key: "created_b",
    width:'120px',
  },
  
  {
    title: 'تاریخ',
    key: 'created_at',
  
  },
      
]
const Employee_header = [
  {
    title: 'شماره',
    key: 'ids',
  },
  {
    title: 'اسم',
    key: 'first_name',
  },
  {
    title: 'تخلص',
    key: 'last_name',
  },
  {
    title: 'ایمیل',
    key: 'email',
  },
  {
    title: 'عنوان وظیفه',
    key: 'job_title',
    width: '100px',
  },

  {
    title: 'شماره تلفن',
    key: 'phone_number',
  },
  {
    title: 'آدرس فعلی',
    key: 'current_address',
    width: '180px',
  },
  {
    title: 'آدرس دائمی',
    key: 'permenent_address',
    width: '180px',
  },
  {
    title: 'تاریخ شروع ',
    key: 'created_at',
    width: '130px',
  },

  {
    title: 'معاش',
    key: 'salary',
  },
]
const salary_header = [
  {
    title: 'شماره',
    key: 'ids',
    width: '80px',
  },
  {
    title: 'نام کارمند',
    key: 'employee_name',
  },
  {
    title: 'موقف',
    key: 'position',
  },
  {
    title: 'مقدار معاش',
    key: 'salary',
  },
  {
    title: 'قابل پرداختی',
    key: 'payable_amount',
  },
  {
    title: 'مقدار پرداختی',
    key: 'paid',
  },
  {
    title: 'تعداد حاضر',
    key: 'present',
  },
  {
    title: 'تعداد غیرحاضر',
    key: 'absent',
  },
  {
    title: 'باقیمانده معاش',
    key: 'remainder',
  },
  {
    title: 'تاریخ پرداخت',
    key: 'created_at',
  },
]
const incoming_header = [
  {
    title: '#آی دی',
    key: 'ids',
  },
  {
    title: 'توضیحات',
    key: 'name',
  },
  {
    title: 'مقدار',
    key: 'amount',
    width: '140px',
  },
  {
    title: 'تاریخ',
    key: 'created_at',
  },
]
const customer_header = [
  {
    title: 'شماره',
    key: 'ids',
  },

  // {
  //   title: 'View More',
  //   key: 'profile',
  // },

  {
    title: 'اسم',
    key: 'first_name',
  },

  {
    title: 'تخلص',
    key: 'last_name',
  },
  {
    title: 'شماره تماس',
    key: 'phone_number',
  },
  {
    title: 'ایمیل',
    key: 'email',
  },
  {
    title: 'آدرس',
    key: 'address',
  },
  {
    title: 'مجموع پول',
    key: 'total_price',
  },

  {
    title: 'مجموع پرداخت شده',
    key: 'payments_sum_amount',
  },

  {
    title: 'باقی مانده',
    key: 'remainders',
  },
  {
    title: 'توضیحات',
    key: 'description',
  },
]
const { tabs, headers, breadCrumbs, search } = usePageConfig()

const apiLoading = ref(false)
const expand = ref(false)
const searchOption = ref({})
const show = ref(false)
const printLoading = ref(false)
const headerss = ref([])
const printData = ref([])
const printRefs = ref()
const title = ref('')
const total = ref(0)
const total_amount_income_usd = ref(0)
const total_expense_usd = ref(0)
const balance = ref(0)
const options = ref({ itemsPerPage: 20, page: 1, tab: 'reports' })
const reports = ref([])
const datatableRefs = ref()
const extraTotal = ref({})
const employeeRef = ref()
const profileLoading = ref(false)
const selectedId = ref(null)
const payload = ref({
  start_date: new Date(),
  end_date: new Date(),
  type: null,
  printType:  options.value.tab,
})
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const validationRules = useRules.validate

const rules = {
  start_date: { required },
  end_date: { required },
  type: { required },
}

const v$ = useVuelidate(rules, payload)
const confirm = res => {
  if (res) {
    emit('confirm', type.value)
  }
  show.value = false
}

const TakeReport = type => {
  show.value = true
}
const closeReset = type => {
  show.value = false
  getReport()
}

const getReport = async () => {
  if (payload.value.start_date == null || payload.value.end_date == null || payload.value.type == null) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
 
 
  if (payload.value.type == 'product') {
    headerss.value = product_headers
 
  }
  if (payload.value.type == 'purchase') {
    headerss.value = purchase_headers

  }
  if (payload.value.type == 'sell') {
    headerss.value = sell_headers

  }
  if (payload.value.type == 'salaries') {
    headerss.value = salary_header
    title.value = 'راپور معاشات'
  }
  if (payload.value.type == 'employee') {
    headerss.value = Employee_header
    title.value = 'راپور کارمندان'
  }
  if (payload.value.type == 'income' || payload.value.type == 'expense') {
    headerss.value = incoming_header
  }
  if (payload.value.type == 'customers') {
    headerss.value = customer_header
  }
  if (payload.value.type == 'journal') {
    headerss.value = journal_headers
  }
  try {
    apiLoading.value = true
    printLoading.value = true
    let { data } = await axios.get('get_report',{  params: { ...options.value ,...payload.value }  })
    show.value = false
    reports.value = data.data

    total.value = data.total
    extraTotal.value = data.extraTotal

    extra.value = data.extra
    const total_income=parseFloat(data.extra.total_amount_income_usd)
    const total_expense=parseFloat(data.extra.total_expense_usd)

    total_amount_income_usd.value = total_income.toFixed(2)
    total_expense_usd.value =total_expense.toFixed(2)
    balance.value =total_income.toFixed(2)-total_expense.toFixed(2)
 


  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
  printLoading.value = false
}
const print = async () => {
  if (payload.value.start_date == null || payload.value.end_date == null || payload.value.type == null) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  try {
    if (payload.value.type == 'income') {
      headerss.value = incoming_header
      title.value = 'گزارش آمد'
    }

    if (payload.value.type == 'expense') {
      headerss.value = incoming_header
      title.value = 'گزارش رفت'
    }
    if (payload.value.type == 'employee ') {
      headerss.value = Employee_header
      title.value = 'Employee Report'
    }
    if (payload.value.type == 'salaries') {
      headerss.value = salary_header
      title.value = 'راپور معاشات'
    }
    if (payload.value.type == 'customers') {
      headerss.value = customer_header
      title.value = 'راپور مشتری'
    }
    if (payload.value.type == 'income') {
      headerss.value = incoming_header
      title.value = 'Income Report'
    }

    if (payload.value.type == 'expense') {
      headerss.value = incoming_header
      title.value = 'Expense Report'
    }
    if (payload.value.type == 'customers') {
      headerss.value = customer_header
      title.value = 'راپور مشتری'

    }
    if (payload.value.type == 'product') {
      headerss.value = product_headers
      title.value = 'راپور محصولات'

    }
    if (payload.value.type == 'purchase') {
      headerss.value = purchase_headers
      title.value = 'راپور خرید'

    }
    if (payload.value.type == 'sell') {
      headerss.value = sell_headers
      title.value = 'راپور فروش'

    }
    if (payload.value.type == 'journal') {
      headerss.value = journal_headers
      title.value = 'راپور روزنامچه'

    }
    let { data } = await axios.get('reports', {  params: {...payload.value }  })
    console.log('my data', data)
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
const searchRecord = data => {
  searchOption.value = data
  options.value = { ...options.value, ...data }
  getReport()
}

const onTableChange = value => {
  console.log('test',value)
  
  options.value = value
  getReport()
}



onMounted(() => {
  // getReport()
})
</script>

<route lang="yaml">
meta:
  auth: true
</route>
