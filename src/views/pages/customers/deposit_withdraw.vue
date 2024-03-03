<template>
  <VRow>
    <ConfirmDialog
      ref="confirmRef"
      @confirm="onConfirm"
    />

    <VCol cols="12">
      <VCard title="راکړی ورکړی">
        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="formRef"
            class="mt-6"
          >
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="3"
              >
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
                  v-if="validationRules($v.created_at, 'Date').length > 0"
                  class="text-error mb-0"
                >
                  {{ validationRules($v.created_at, "نیټه")[0] }}
                </p>
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VSelect
                  v-model="payload.type"
                  :rules="validationRules($v.type, 'ډول')"
                  label="ډول"
                  prepend-inner-icon="mdi-palette-swatch"
                  :items="Types"
                  item-title="name"
                  item-value="id"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="payload.amount"
                  label="اندازه"
                  dir="ltr"
                  prepend-inner-icon="mdi-amounter"
                  :rules="validationRules($v.amount, 'اندازه')"
                  @input="convertToEnglishNumbers('amount')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="12"
              >
                <VTextarea
                  v-model="payload.description"
                  label="نور تفصیل"
                  prepend-inner-icon="mdi-info"
                />
              </VCol>
            </VRow>
            <VRow />
          </VForm>
        </VCardText>

        <VCardText class="d-flex flex-wrap gap-4">
          <VBtn @click="validateForm">
            <VIcon
              start
              icon="mdi-checkbox-marked-circle"
            />
            ذخیره
          </VBtn>

          <VBtn
            color="red"
            variant="tonal"
            @click="resetForm"
          >
            <VIcon
              start
              icon="mdi-cancel"
            />
            لغو
          </VBtn>
        </VCardText>
      </VCard>
      <!--
        <VBtn
        class="font-weight-bold bg-info mt-4"
        style="float: right"
        @click="openDialogs"
        >
        راپور
        <VIcon
        end
        icon="mdi-export"
        />
        </VBtn> 
      -->

      <template #loan="{ item }">
        {{ item.loan }}
      </template>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Table -->
      <VCard
        title=" د راکړی ورکړی لیسټ"
        style="min-height: 300px"
      >
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">
                #شماره
              </th>
              <th scope="col">
                ډول
              </th>
              <th scope="col">
                اندازه
              </th>

              <th scope="col">
                نیټه
              </th>

              <th
                scope="col"
                class="text-center"
              >
                د تفصیل
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in sellInfo.deposit_withdraw"
              :key="index"
              :class="`${item.deleted_at ? 'text-error' : ''}`"
            >
              <td>
                {{ item.id }}
              </td>
              <td>
                <VChip
                  style="direction: ltr"
                  small
                  :color="`${item.type == 'withdraw' ? 'error' : 'success'}`"
                  class="font-weight-medium"
                >
                  {{ item.type == "withdraw" ? "ورکړی" : "راکړی" }}
                  <VIcon
                    size="30"
                    :icon="`${
                      item.type == 'withdraw' ? 'mdi-arrow-up' : 'mdi-arrow-down'
                    }`"
                  />
                </VChip>
              </td>
              <td>{{ item.amount }}</td>

              <td>{{ formateDate(item.created_at) }}</td>

              <td>{{ item.description }}</td>

              <div v-if="item.deleted_at">
                <VBtn
                  variant="text"
                  icon
                  size="small"
                  color="info"
                  :loading="restoreLoading && selectedItem.id == item.id"
                  @click="restoreRecord(item, 'items')"
                >
                  <VIcon
                    start
                    icon="mdi-restore"
                    color="info"
                  />
                  بازگشت
                </VBtn>

                <VBtn
                  class="ms-2"
                  variant="text"
                  icon
                  size="small"
                  :loading="apiLoading2 && selectedItem == item"
                  @click="forceDelete(item, 'items')"
                >
                  <VIcon
                    icon="mdi-trash"
                    color="error"
                  />
                </VBtn>
              </div>

              <div v-else>
                <!--
                  <VBtn
                  variant="text"
                  icon
                  size="small"
                  @click="editForm(item, 'item')"
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
                  @click="deleteRecord(item, 'items')"
                  >
                  <VIcon
                  icon="mdi-trash"
                  color="error"
                  />
                  </VBtn> 
                -->
              </div>
              <!-- </td> -->
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { required, numeric, minLength, minValue } from "@vuelidate/validators"
import useRules from "@/plugins/vuelidate/vuelidateRules"
import useVuelidate from "@vuelidate/core"
import { ref, toRef } from "vue"
import { axios } from "@/plugins/axios-plugin"
import { toast } from "vue3-toastify"
import { useRoute } from "vue-router"
import { formateDate, scope } from "@/@core/utils/index"
import ConfirmDialog from "@/components/commons/ConfirmDialog.vue"

import PrintReportDialog from "@/components/commons/PrintReportDialog.vue"
import moment from "moment"

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

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const route = useRoute()

const customer_id = ref(route.params.customer_id)

const formRef = ref()
const loadingPackage = ref(false)

const apiLoading = ref(false)
const apiLoading2 = ref(false)
const restoreLoading = ref(false)
const confirmRef = ref()
const editRef = ref()
const packages = ref([])
const selectedItem = ref({})
const selectedType = ref(null)
const showDialog = ref(false)
const reportRefs = ref()
const printData = ref([])
const printRefs = ref()
const headers = ref([])
const printType = ref()
const printLoading = ref(false)
const Types = ref([
  { name: "راکړی", id: "deposit" },
  { name: "ورکړی", id: "withdraw" },
])
const Currency = ref([
  { name: "افغانی", id: "afn" },
  { name: "دالر", id: "usd" },
])
const show = ref(false)
const title = ref("")
const flag = ref("")
const total = ref(0)
const formdata = ref({
  start_date: new Date(),
  end_date: new Date(),
  customer_id: customer_id.value,
})
const payload = ref({
  created_at: new Date(),
  type: null,
  currency: null,
  description: null,
  amount: 0,
  customer_id: customer_id.value,
  customer_name: props.sellInfo.first_name,
})

let itemTypes = ["deposit", "withdraw"]
const loan_payment_header = [
  {
    title: "ID",
    key: "ids",
    width: "80px",
  },
  {
    title: " د پیردونکی نوم",
    key: "customer_name",
  },
  {
    title: "ډول",
    key: "type",
  },

  {
    title: " اندازه",
    key: "amount",
  },

  {
    title: "نیټه",
    key: "register_date",
  },
]

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate

const rules = {
  created_at: { required },
  type: { required },
  currency: { required },
  amount: { required, minValue: minValue(1) },
}

const $v = new useVuelidate(rules, payload)
const resetForm = (type = "items") => {
  if (type == "items") {
    payload.value = {
      created_at: new Date(),
      type: null,
      description: null,
      amount: 0,
      customer_id: customer_id.value,
      customer_name: props.sellInfo.first_name,
    }

    $v.value.$reset()
    formRef.value.resetValidation()
  }
}
async function getPackage() {
  try {
    loadingPackage.value = true
    const { data } = await axios.get("package-list")
    packages.value = data
  } catch (error) {
    console.error("error", error)
  }
  loadingPackage.value = false
}
const validateForm = async () => {
  formRef.value.validate()
  $v.value.$touch()

  submit()
}

async function submit() {
  try {
    apiLoading.value = true
    const { data } = await axios.post(`customer_deposit_withdraw`, payload.value)
    await props.updateChanges()
    resetForm("items")
  } catch (error) {
    console.error("error", error)
  }
  apiLoading.value = false
}

function convertToEnglishNumbers(model, item = null, index = null) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    if (model == "expense.price") {
      expense.value.price = expense.value.price
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i)

      return
    }
    if (item == null) {
      payload.value[model] = payload.value[model]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i)
    } else {
      payload.value[model][index][item] = payload.value[model][index][item]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i)
    }
  }
}

const restoreRecord = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type
  confirmRef.value.showDialog("restore")
}

const editForm = async (item, type = "epense") => {
  editRef.value.openDialog(item, type)
}

const deleteRecord = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type

  confirmRef.value.showDialog("delete")
}

const forceDelete = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type

  confirmRef.value.showDialog("forceDelete")
}
const openDialogs = type => {
  printType.value = "loan_payment"
  payload.value = {
    start_date: new Date(),
    end_date: new Date(),
  }
  show.value = true
}
const getReport = async () => {
  if (formdata.value.start_date == null || formdata.value.end_date == null) {
    toast.error("مهربانی وکړې فورم صحیح ډک کړئ!")

    return false
  }
  try {
    console.log("pppp", printType.value)
    if (printType.value == "loan_payment") {
      headers.value = loan_payment_header
      title.value = "راپور قرضه  " + props.sellInfo.first_name
      total.value = props.sellInfo.loan
      flag.value = "loan"
    }

    printLoading.value = true
    let { data } = await axios.get("reports", {
      params: { type: printType.value, ...formdata.value },
    })
    printData.value = data
    await sleep(1)
    const printable = window.open("", "_blank")

    printable.document.write(
      '<html style="direction:ltr"><head><style>@page { size: A4 landscape }</style>',
    )
    printable.document.write("</head><body>")
    printable.document.write(printRefs.value.$el.innerHTML)
    printable.document.write("</body></html>")
    printable.document.close()
    printable.print()
    await sleep(1)

    printable.close()
  } catch (error) {
    console.error("error", error)
  }
  printLoading.value = false
}
const onConfirm = async event => {
  if (event == "delete") {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(
        `employee_delete/${selectedType.value}/${selectedItem.value.id}`,
      )
      await props.updateChanges()
    } catch (error) {
      console.error("error", error)
    }
  }

  if (event == "forceDelete") {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(
        `employee_force_delete/${selectedType.value}/${selectedItem.value.id}`,
      )
      await props.updateChanges()
    } catch (error) {
      console.error("error", error)
    }
  }
  if (event == "restore") {
    try {
      restoreLoading.value = true
      const { data } = await axios.post(
        `employee_restore/${selectedType.value}/${selectedItem.value.id}`,
      )
      await props.updateChanges()
    } catch (error) {
      console.error("error", error)
    }
  }
  restoreLoading.value = false
  apiLoading2.value = false
  selectedItem.value = {}
}
onMounted(() => {
  getPackage()
})
</script>

<style>
  .dp__input{
  padding: 12px 4px 12px 40px !important;
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
