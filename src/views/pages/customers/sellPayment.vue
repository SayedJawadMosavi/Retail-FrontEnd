<template>
  <VRow>
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
        title="راپور ترتیبول"
      >
        <VCardText style="min-height: 300px">
          <VForm ref="formRef">
            <VRow>
              <VCol cols="12">
                <p class="mb-0">
                  پیل نېټه
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
                  له کاره وتنې نېټه
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
            لغوه کول
          </VBtn>

          <VBtn
            ripple
            color="primary"
            variant="tonal"
            @click="getReport"
          >
            د راپور پرنت
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
        v-model:customer-id="formdata.customer_id"
        :title="title"
        :headers="headers"
      />
    </VDialog>
    
    <VCol cols="12">
      <!-- 👉 Table -->
      <VCard
        title="د اجناسو لست"
        style="min-height: 300px"
      >
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">
                # بل نمبر
              </th>
            
               
              <th scope="col">
                د قیمت مجموعه
              </th>
              <th scope="col">
                وصول شوې مقدار
              </th>
              <th scope="col">
                پاتي
              </th>
              <th scope="col">
                نیټه
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in sellInfo.sell"
              :key="index"
              :class="`${item.deleted_at ? 'text-error' : ''}`"
            >
              <td>
                {{ item.id }}
              </td>
              <td>{{ item.total_amount }}</td>
              <td>{{ item.total_paid }}</td>
              
              <td>{{ item.total_amount- item.total_paid }}</td>
             
              <td>{{ moment(item.sell_date, "YYYY-MM-DD").format("ll") }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
    <VCol cols="12">
      <!-- SECTION: create extra expense -->

      <VCard title="وصول ذخیره">
        <VRow>
          <VCol cols="12">
            <VCardText>
              <div class="d-flex align-center" />

              <div class="d-flex align-center">
                <p
                  class="text-base font-weight-medium mt-2"
                  style="min-width: 150px"
                >
                  د قیمت مجموعه
                </p>
                <VChip
                  style="direction: ltr"
                  small
                  color="primary"
                  class="font-weight-medium"
                >
                  {{ sellInfo.total_amount ?? 0 }} $
                </VChip>
              </div>

              <div class="d-flex align-center">
                <p
                  class="text-base font-weight-medium mt-2"
                  style="min-width: 150px"
                >
                  د وصول مجموعه
                </p>
                <VChip
                  style="direction: ltr"
                  small
                  color="success"
                  class="font-weight-medium"
                >
                  {{ sellInfo.total_paid ?? 0 }} $
                </VChip>
              </div>

              <div class="d-flex align-center">
                <p
                  class="text-base font-weight-medium mt-2"
                  style="min-width: 150px"
                >
                  د پاتي مجموعه
                </p>
                <VChip
                  style="direction: ltr"
                  small
                  color="error"
                  class="font-weight-medium"
                >
                  {{ sellInfo.remainder ?? 0 }} $
                </VChip>
              </div>
            </VCardText>
            <VDivider />
          </VCol>
          <VCol
            v-show="sellInfo.remainder > 0"
            cols="12"
            md="5"
            order-md="0"
            order="1"
          >
            <VCardText class="">
              <VForm ref="formRefs">
                <VRow>
                  <VCol cols="12">
                    <span style="direction: ltr">
                      <VueDatePicker
                        v-model.trim="payload.created_at"
                        clearable
                        auto-apply
                        dark
                        close-on-auto-apply
                        formate="MM/dd/yyyy"
                        :offset="-170"
                      />
                    </span>
                    <p
                      v-if="validationRules(v$.created_at, 'Date').length > 0"
                      class="text-error mb-0"
                    >
                      {{ validationRules(v$.created_at, 'نیټه')[0] }}
                    </p>
                  </VCol>

                  <VCol cols="12">
                    <VTextField
                      v-model="payload.amount"
                      dir="ltr"
                      :rules="validationRules(v$.amount, 'د وصول اندازه')"
                      prepend-inner-icon="mdi-cash"
                      label="مقدار وصول"
                      @input="convertToEnglishNumbers('amount')"
                      @keypress="useRules.preventNonNumeric"
                    />
                  </VCol>

                  <!-- 👉 Create Key Button -->
                  <VCol cols="12">
                    <VBtn
                      block
                      :loading="apiLoading"
                      @click="validateForm"
                    >
                      ذخیره
                    </VBtn>
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
      <!-- !SECTION -->
      <VBtn
        class="font-weight-bold bg-info mt-4"
        style="float: right"
        @click="openDialogs"
      >
        د راپور 
        <VIcon
          end
          icon="mdi-export"
        />
      </VBtn>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Table -->
      <VCard
        title="د وصول لست"
        style="min-height: 300px"
      >
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">
                #آی دی
              </th>
              <th scope="col">
                د وصول اندازه
              </th>
              <th scope="col">
                نیټه
              </th>
              <th scope="col">
                تفصیل
              </th>
              <th scope="col">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in sellInfo.payments"
              :key="index"
              :class="`${item.deleted_at ? 'text-error' : ''}`"
            >
              <td>
                {{ index + 1 }}
              </td>
              <td>
                <VTextField
                  v-show="editData?.id == item.id"
                  v-model="editData.amount"
                  autofocus
                  dir="ltr"
                  density="compact"
                  prepend-inner-icon="mdi-cash"
                  placeholder="Pay amount"
                  @input="convertToEnglishNumbers('amount', 'editData')"
                  @keypress="useRules.preventNonNumeric"
                />
                <VChip
                  v-show="editData?.id != item.id"
                  style="direction: ltr"
                  small
                  :color="`${item.deleted_at ? 'error' : 'success'}`"
                  class="font-weight-medium"
                >
                  {{ item.amount ?? 0 }}
                </VChip>
              </td>

              <td>{{ formateDate(item.created_at) }}</td>
              <td>
                <VTextField
                  v-show="editData?.id == item.id"
                  v-model="editData.description"
                  autofocus
                  dir="ltr"
                  prepend-inner-icon="mdi-info"
                  placeholder="description"
                />
                <p v-show="editData?.id != item.id">
                  {{ item.description }}
                </p>
              </td>
              <td
                v-if="editData?.id == item.id"
                class="text-center"
              >
                <VBtn
                  variant="text"
                  icon
                  size="small"
                  :loading="apiLoading2"
                  @click="editPayment(item, 'save')"
                >
                  <VIcon
                    icon="mdi-check"
                    color="primary"
                  />
                </VBtn>

                <VBtn
                  variant="text"
                  icon
                  size="small"
                  @click="editPayment(item, 'cancel')"
                >
                  <VIcon
                    icon="mdi-close"
                    color="error"
                  />
                </VBtn>
              </td>
              <td
                v-else
                class="text-center"
              >
                <div v-if="item.deleted_at">
                  <VBtn
                    variant="text"
                    icon
                    size="small"
                    color="info"
                    :loading="restoreLoading"
                    @click="restorePayment(item, 'payments')"
                  >
                    <VIcon
                      start
                      icon="mdi-restore"
                      color="info"
                    />
                    Restore
                  </VBtn>

                  <VBtn
                    class="ms-2"
                    variant="text"
                    icon
                    size="small"
                    :loading="apiLoading2 && selectedItem == item"
                    @click="forceDelete(item, 'payments')"
                  >
                    <VIcon
                      icon="mdi-trash"
                      color="error"
                    />
                  </VBtn>
                </div>

                <div v-else>
                  <VBtn
                    variant="text"
                    icon
                    size="small"
                    @click="editPayment(item, 'open')"
                  >
                    <VIcon
                      icon="mdi-pencil"
                      color="primary"
                    />
                  </VBtn>

                  <VBtn
                    variant="text"
                    icon
                    size="small"
                    :loading="apiLoading2 && selectedItem == item"
                    @click="deletePayment(item, 'payments')"
                  >
                    <VIcon
                      icon="mdi-trash"
                      color="error"
                    />
                  </VBtn>
                </div>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { required, numeric, minLength, minValue, maxValue } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import useVuelidate from '@vuelidate/core'
import { computed, ref, toRef } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router'
import ConfirmDialog from '@/components/commons/ConfirmDialog.vue'
import PrintReportDialog from '@/components/commons/PrintReportDialog.vue'
import moment from "moment"

import { formateDate, scope } from '@/@core/utils/index'

const props = defineProps({
  sellInfo: {
    type: Object,
    default: () => {},
  },
  updateChanges: {
    type: Function,
    default: () => {},
  },
})
const customer_payment_header = [
  {
    title: '  #آی دی',
    key: 'ids',
    width: '80px',
  },


  {
    title: '    د وصول اندازه',
    key: 'amount',
  },
  {
    title: '    د  تفصیل',
    key: 'description',
  },

  {
    title: '   نیټه',
    key: 'created_at',
  },
]
const route = useRoute()
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const printRefs = ref()

const customer_id = ref(route.params.customer_id)
const headers = ref([])
const title = ref('')
const printData = ref([])

const formRefs = ref()
const editData = ref({
  id: null,
  amount: 0,
  customer_id: customer_id.value,
})
const remainder = ref(0)
const printLoading = ref(false)

const apiLoading = ref(false)
const apiLoading2 = ref(false)
const restoreLoading = ref(false)
const show = ref(false)
const printType = ref()

const confirmRef = ref()
const selectedItem = ref({})

const payload = ref({
  created_at: new Date(),
  amount: null,
  customer_id: customer_id,
})

const remaining = computed(() => {
  return props.sellInfo?.total_amount - props.sellInfo.total_paid
})
onMounted(() => {
  remainder.value = props.sellInfo?.total_amount - props.sellInfo.total_paid
})

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate

const expenseRule = {
  created_at: { required },
  customer_id: { required },

  amount: { required, minValue: minValue(0), maxValue: maxValue(remaining) },
}
const formdata = ref({
  start_date: new Date(),
  end_date: new Date(),
  customer_id: customer_id.value,
})
const v$ = useVuelidate(expenseRule, payload)
const resetForm = (type = 'items') => {
  payload.value = {
    created_at: new Date(),
    amount: null,
    customer_id: customer_id,
  }
  v$.value.$reset()
  formRefs.value.resetValidation()
}
const openDialogs = type => {
  printType.value = 'customer_payment'
  payload.value = {
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
    if (printType.value == 'customer_payment') {
      headers.value = customer_payment_header
      title.value = 'دپیرودونکی تادی راپورته  ' + props.sellInfo.first_name
    }

    printLoading.value = true
    let { data } = await axios.get('reports', { params: { type: printType.value, ...formdata.value } })

    console.log('nmy data', data)
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
const editPayment = async (item, type = 'open') => {
  if (type == 'open') {
    editData.value.id = structuredClone(item.id)
    editData.value.amount = structuredClone(item.amount)
    editData.value.description = structuredClone(item.description)
  } else if (type == 'cancel') {
    editData.value.id = null
    editData.value.amount = null
  } else {
    try {
      apiLoading2.value = true
      const { data } = await axios.put(`sell-payment`, editData.value)
      await props.updateChanges()
      editData.value.id = null
      editData.value.amount = null
      editData.value.description = null
    } catch (error) {}
    apiLoading2.value = false
  }
}
const deletePayment = async item => {
  selectedItem.value = item
  confirmRef.value.showDialog('delete')
}

const restorePayment = async item => {
  selectedItem.value = item
  confirmRef.value.showDialog('restore')
}

const forceDelete = async item => {
  selectedItem.value = item
  confirmRef.value.showDialog('forceDelete')
}
const onConfirm = async event => {
  if (event == 'delete') {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(`delete/payments/` + selectedItem.value.id)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
    apiLoading2.value = false
  }

  if (event == 'forceDelete') {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(`force-delete/payments/` + selectedItem.value.id)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
    apiLoading2.value = false
  }
  if (event == 'restore') {
    try {
      restoreLoading.value = true
      const { data } = await axios.post(`restore/payments/` + selectedItem.value.id)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
    restoreLoading.value = false
  }

  selectedItem.value = {}
}

const validateForm = async () => {
  formRefs.value.validate()
  v$.value.$touch()
  if (v$.value.$invalid) {
    toast.error('مهربانی وکړې فورم صحیح ډک کړئ!')

    return false
  }
  submit()
}

async function submit() {
  try {
    apiLoading2.value = true

    const { data } = await axios.post(`sell-payment`, payload.value)
    await props.updateChanges()
    remainder.value = props.sellInfo?.total_amount - props.sellInfo.total_paid

    resetForm()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading2.value = false
}

function convertToEnglishNumbers(model, var_name = 'payload') {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    if (var_name == 'payload')
      payload.value[model] = payload.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
    if (var_name == 'editData')
      editData.value[model] = editData.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
  }
}
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
