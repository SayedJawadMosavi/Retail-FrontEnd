<template>
  <VRow>
    <VCol cols="12">
      <VCard title="جزئیات محصول">
        <VCardText class="">
          <div class="d-flex align-center">
            <p
              class="text-base font-weight-medium mt-2"
              style="min-width: 150px"
            >
              تاریخ ثبت
            </p>
            {{ formateDate(payload.purchase_date) }}
          </div>
        </VCardText>
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
                md="4"
              >
                <v-autocomplete
                  v-model="payload.container_id"
                  label="کانتینر"
                  prepend-inner-icon="mdi-truck-fast"
                  :items="containers"
                  :item-title="ca => `${ca.name}`"
                  return-object
                  :loading="loadingContainer"
                  :rules="validationRules(v$.container_id, 'کانتینر')"
                ></v-autocomplete>
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <v-autocomplete
                  v-model="payload.vendor_id"
                  label="اسم معامله دار"
                  prepend-inner-icon="mdi-account"
                  :items="vendors"
                  :item-title="ca => `${ca.name}`"
                  return-object
                  :loading="loadingVendor"
                  :rules="validationRules(v$.vendor_id, 'اسم معامله دار')"
                ></v-autocomplete>
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <span style="direction: ltr">
                  <VueDatePicker
                    v-model.trim="payload.purchase_date"
                    clearable
                    auto-apply
                    dark
                    close-on-auto-apply
                    formate="MM/dd/yyyy"
                  />
                </span>
                <p
                  v-if="validationRules(v$.purchase_date, 'Date').length > 0"
                  class="text-error"
                >
                  {{ validationRules(v$.purchase_date, 'تاریخ')[0] }}
                </p>
              </VCol>
            </VRow>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="12"
              >
                <VTextarea
                  v-model="payload.description"
                  label="توضیحات بیشتر"
                  prepend-inner-icon="mdi-info"
                />
              </VCol>
            </VRow>
            <VRow />
          </VForm>
        </VCardText>

        <VCardText class="d-flex flex-wrap gap-4">
          <VBtn
            :loading="apiLoading"
            @click="validateForm"
          >
            ذخیره
          </VBtn>

          <VBtn
            color="secondary"
            variant="tonal"
            @click="resetForm"
          >
            بازنشانی
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { required, numeric, minLength } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import useVuelidate from '@vuelidate/core'
import { ref, toRef } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import { toast } from 'vue3-toastify'
import { formateDate } from '@/@core/utils/index'

const props = defineProps({
  purchaseInfo: {
    type: Object,
    default: () => {},
  },
  resetData: {
    type: Object,
    default: () => {},
  },
  updateChanges: {
    type: Function,
    default: () => {},
  },
})
const formRef = ref()
const apiLoading = ref(false)
const loadingContainer = ref(false)
const containers = ref([])
const payload = toRef(props, 'purchaseInfo')
const loadingVendor = ref(false)
const vendors = ref([])
const resetForm = () => {
  const {
    vendor_id,
    container_id,

    rate,
  } = props.resetData
  payload.value.container_id = container_id
  payload.value.vendor_id = vendor_id
  payload.value.purchase_date = purchase_date

  payload.value.rate = rate

  v$.value.$reset()
}

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate

const rules = {
  purchase_date: { required },
  rate: { required, numeric, minLength: minLength(1) },

  container_id: { required },
  vendor_id: { required },
}

const v$ = useVuelidate(rules, payload)

const validateForm = async () => {
  formRef.value.validate()
  v$.value.$touch()
  if (v$.value.$invalid) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  submit()
}

async function submit() {
  try {
    apiLoading.value = true

    const data = JSON.parse(JSON.stringify(payload.value))
    delete data.items
    delete data.created_by
    delete data.updated_at
    delete data.deleted_at
    delete data.payments
    delete data.extra_expense
    await axios.put(`purchase/${payload.value.id}`, data)
    await props.updateChanges()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}
async function getContainer() {
  try {
    loadingContainer.value = true
    const { data } = await axios.get('container-list')

    containers.value = data
    data.forEach(index => {
      if (index.id == props.purchaseInfo.container_id) {
        console.log('dfbdfbdf',index.name)
        payload.value.container_id = index.name
      }
    })
  } catch (error) {
    console.error('error', error)
  }
  loadingContainer.value = false
}
async function getVendor() {
  try {
    loadingVendor.value = true
    const { data } = await axios.get('vendor-list')
    vendors.value = data
    data.forEach(index => {
      if (index.id == props.purchaseInfo.vendor_id) {
        console.log('dfbdfbdf',index.name)
        payload.value.vendor_id = index.name
      }
    })
  } catch (error) {
    console.error('error', error)
  }
  loadingVendor.value = false
}
function convertToEnglishNumbers(model, item = null, index = null) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    if (item == null) {
      payload.value[model] = payload.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
    } else {
      payload.value[model][index][item] = payload.value[model][index][item]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i)
    }
  }
}

onMounted(() => {
  getVendor()
  getContainer()
})
</script>

<style>
.dp__input{
padding: 12px 4px 12px 40px !important;
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
