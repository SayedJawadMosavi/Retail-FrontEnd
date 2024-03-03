<template>
  <VRow>
    <ConfirmDialog
      ref="confirmRef"
      @confirm="onConfirm"
    />
    <VDialog
      v-model="showProduct"
      transition="dialog-top-transition"
      persistent
      class="v-dialog-sm"
    >
      <VCard title=" نوی محصول">
        <VCardText>
          <VForm ref="ProductformRef">
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="ProductForm.product_name"
                  label="د محصول نوم "
                  prepend-inner-icon="mdi-shopping-outline"
                  :rules="validationRules($v1.product_name, 'د محصول نوم')"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="ProductForm.carton_quantity"
                  dir="ltr"
                  label="اندازه په کارتن"
                  :rules="validationRules($v1.carton_quantity, 'اندازه په کارتن')"
                  prepend-inner-icon="mdi-code-equal"
                  @input="convertToEnglishNumbers('code')"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol cols="12">
                <VAutocomplete
                  v-model="ProductForm.category_id"
                  label="کتگوری"
                  prepend-inner-icon="mdi-account"
                  :items="Categories"
                  :item-title="(ca) => `${ca.name}`"
                  return-object
                  :loading="loadingCategory"
                  :rules="validationRules($v1.category_id, 'کتگوری')"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardText class="d-flex flex-wrap gap-4">
          <VBtn @click="validateProductForm">
            ثبتول
          </VBtn>

          <VBtn
            color="secondary"
            variant="tonal"
            @click="closeReset"
          >
            لغو
          </VBtn>
        </VCardText>
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
    <VDialog
      v-model="show"
      transition="dialog-top-transition"
      persistent
      width="auto"
    >
      <VCard
        width="auto"
        title=" د محصول ترلاسه کول"
      >
        <VCardText style="min-height: 300px">
          <VForm ref="ReceiveformRef">
            <VRow>
              <VCol cols="6">
                <span style="direction: ltr">
                  <VueDatePicker
                    v-model="formData.created_at"
                    clearable
                    auto-apply
                    dark
                    close-on-auto-apply
                    formate="MM/dd/yyyy"
                    :offset="-130"
                  />
                </span>
              </VCol>

              <VCol cols="6">
                <VTextField
                  v-model="formData.exist"
                  prepend-inner-icon="mdi-counter"
                  :class="formData.exist > 0 ? 'text-success' : 'text-error'"
                  readonly
                  label="موجود"
                  dir="ltr"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol cols="6">
                <VTextField
                  v-model="formData.carton"
                  prepend-inner-icon="mdi-counter"
                  readonly
                  :class="formData.carton > 0 ? 'text-success' : 'text-error'"
                  label="د کارتن موجود"
                  dir="ltr"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol cols="6">
                <VTextField
                  v-model="formData.carton_amount"
                  prepend-inner-icon="mdi-counter"
                  :class="formData.carton_amount > 0 ? 'text-success' : 'text-error'"
                  label="اندازه په کارتن"
                  dir="ltr"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol cols="6">
                <VTextField
                  v-model="formData.carton_quantity"
                  prepend-inner-icon="mdi-counter"
                  label="د کارتن تعداد"
                  dir="ltr"
                  @update:modelValue="CalculatQuantity"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol cols="6">
                <VTextField
                  v-model="formData.quantity_receive"
                  prepend-inner-icon="mdi-counter"
                  label="اندازه"
                  dir="ltr"
                  readonly
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="12"
              >
                <VTextarea
                  v-model="formData.description"
                  label=" تفصیل"
                  prepend-inner-icon="mdi-info"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn
            color="secondary"
            @click="show = false"
          >
            کینسل
          </VBtn>

          <VBtn
            :loading="Loading"
            ripple
            color="primary"
            variant="tonal"
            @click="validateFormRecive"
          >
            ذخیره
            <VIcon
              icon="mdi-export"
              end
            />
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <EditDialog
      ref="editRef"
      :order-info="purchaseInfo"
      :update-changes="updateChanges"
    />
    <EditExpenseDialog
      ref="editexpenseRef"
      :order-info="purchaseInfo"
      :update-changes="updateChanges"
    />

    <VCol cols="12">
      <VCard title="د محصول زیاتول">
        <VCardText class="">
          <div class="d-flex align-center" />
          <div class="d-flex align-center">
            <p
              class="text-base font-weight-medium mt-2"
              style="min-width: 150px"
            >
              د کانټینر نمبر
            </p>
            #{{ purchaseInfo.container_id }}
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
                    teleport-center
                  />
                </span>
                <p
                  v-if="validationRules($v.created_at, 'نیټه').length > 0"
                  class="text-error mb-0"
                >
                  {{ validationRules($v.created_at, "نیټه")[0] }}
                </p>
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VAutocomplete
                  v-model="payload.product_id"
                  label="د محصول نوم"
                  prepend-inner-icon="mdi-account"
                  :items="products"
                  :item-title="(pr) => `${pr.product_name}`"
                  return-object
                  :loading="loadingProduct"
                  :rules="validationRules($v.product_id, 'د محصول نوم')"
                  @update:modelValue="getProductStock"
                />
                <VBtn
                  density="compact"
                  class="mt-1"
                  color="success"
                  size="small"
                  icon="mdi-plus"
                  @click="addProduct"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="payload.rate"
                  prepend-inner-icon="mdi-counter"
                  :rules="validationRules($v.rate, 'د تبادلی نرخ')"
                  label="د تبادلی نرخ"
                  dir="ltr"
                  @update:modelValue="Calculate"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="payload.cost"
                  label="قیمت په ین"
                  dir="ltr"
                  prepend-inner-icon="mdi-counter"
                  :rules="validationRules($v.cost, 'قیمت په ین')"
                  @update:modelValue="Calculate2"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="payload.carton"
                  prepend-inner-icon="mdi-counter"
                  :rules="validationRules($v.carton, 'جمله په کارتن')"
                  label="جمله په کارتن"
                  dir="ltr"
                  @update:modelValue="Calculate3"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="payload.carton_amount"
                  prepend-inner-icon="mdi-counter"
                  :rules="validationRules($v.carton_amount, 'تعداد په کارتن')"
                  label="تعداد په کارتن"
                  dir="ltr"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="payload.quantity"
                  prepend-inner-icon="mdi-counter"
                  :rules="validationRules($v.quantity, 'جمله دانه')"
                  label="جمله دانه"
                  dir="ltr"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="payload.expense"
                  prepend-inner-icon="mdi-counter"
                  :rules="validationRules($v.expense, 'مصرف')"
                  label="مصرف"
                  dir="ltr"
                  @update:modelValue="Calculate4"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="payload.per_carton_cost"
                  prepend-inner-icon="mdi-counter"
                  :rules="validationRules($v.per_carton_cost, 'دیوکارتن قیمت')"
                  label="دیوکارتن قیمت"
                  dir="ltr"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="payload.sell_price"
                  prepend-inner-icon="mdi-counter"
                  :rules="validationRules($v.sell_price, 'د خرڅ قیمت')"
                  label="د خرڅ قیمت"
                  dir="ltr"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="payload.total"
                  prepend-inner-icon="mdi-counter"
                  :rules="validationRules($v.total, 'مجموعه په دالر')"
                  label="مجموعه په دالر"
                  dir="ltr"
                  @keypress="useRules.preventNonNumeric"
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
            کینسل
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Table -->
      <VCard
        title="د محصولاتو لست"
        style="min-height: 300px"
      >
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">
                #آی دی
              </th>
              <th scope="col">
                د محصول نوم
              </th>
              <th scope="col">
                د تبادلی نرخ
              </th>
              <th scope="col">
                قیمت په ین
              </th>
              <th scope="col">
                اندازه
              </th>
              <th scope="col">
                ترلاسه شوی
              </th>

              <th scope="col">
                پاتې
              </th>
              <th scope="col">
                اندازه په کارتن
              </th>
              <th scope="col">
                د کارتن تعداد
              </th>
              <th scope="col">
                دکارتن ترلاسه شوی
              </th>
              <th scope="col">
                پاتې
              </th>
              <th scope="col">
                مصرف فی کارتن
              </th>
              <th scope="col">
                مجموعه په دالر
              </th>
              <th scope="col">
                نیټه
              </th>
              <th scope="col">
                ترلاسه شوی
              </th>
              <th
                scope="col"
                class="text-center"
              >
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in purchaseInfo.items"
              :key="index"
              :class="`${item.deleted_at ? 'text-error' : ''}`"
            >
              <td>
                {{ item.id }}
              </td>
              <td>{{ item.product.product_name }}</td>
              <td>{{ item.rate }}</td>
              <td>{{ item.yen_cost }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.received }}</td>
              <td>{{ item.quantity - item.received }}</td>
              <td>{{ item.carton_amount }}</td>
              <td>{{ item.carton }}</td>
              <td>{{ item.receive_carton }}</td>
              <td>{{ item.carton - item.receive_carton }}</td>
              <td>{{ item.expense }}</td>
              <td>{{ item?.total ?? 0 }}</td>
              <td>{{ moment(item.created_at, "YYYY-MM-DD").format("ll") }}</td>
              <td>
                <VBtn
                  v-if="item.receive_carton < item.carton"
                  variant="text"
                  icon
                  @click="openDialogs(item)"
                >
                  <VTooltip
                    activator="parent"
                    location="top"
                  >
                    ترلاسه شوی
                  </VTooltip>
                  <VIcon
                    size="30"
                    :class="item.receive_carton <= item.carton ? 'primary' : 'info'"
                    icon="mdi-send-check-outline"
                  />
                </VBtn>
                <VBtn
                  v-else
                  variant="text"
                  icon
                >
                  <VTooltip
                    activator="parent"
                    location="top"
                  >
                    رسید
                  </VTooltip>
                  <VIcon
                    size="30"
                    color="success"
                    icon="mdi-check"
                  />
                </VBtn>
              </td>
              <td class="text-center">
                <VBtn
                  v-show="item.receive_carton == null"
                  variant="text"
                  icon
                  size="small"
                  @click="editForm(item, 'item')"
                >
                  <VTooltip
                    activator="parent"
                    location="top"
                  >
                    محصولاتو ایدیت
                  </VTooltip>
                  <VIcon
                    icon="mdi-pencil"
                    color="info"
                  />
                </VBtn>
                <VBtn
                  v-show="item.receive_carton != null"
                  variant="text"
                  icon
                  size="small"
                  @click="editExpenseForm(item, 'item')"
                >
                  <VTooltip
                    activator="parent"
                    location="top"
                  >
                    دمصرف ایدیت
                  </VTooltip>
                  <VIcon
                    icon="mdi-pencil"
                    color="primary"
                  />
                </VBtn>
                <VBtn
                  variant="text"
                  icon
                  :loading="profileLoading && selectedId == item.id"
                  @click="viewProfile(item)"
                >
                  <VIcon
                    size="30"
                    icon="mdi-eye-arrow-right"
                  />
                </VBtn>
                <div v-if="item.deleted_at">
                  <!--
                    <VBtn
                    variant="text"
                    icon
                    size="small"
                    color="info"
                    :loading="restoreLoading && selectedItem.id == item.id"
                    @click="restoreRecord(item, 'items')"
                    > 
                  -->
                  <!--
                    <VIcon
                    start
                    icon="mdi-restore"
                    color="info"
                    />
                    بازیابی
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
                  -->
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
                  -->

                  <!--
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
              </td>
            </tr>
          </tbody>
          <thead>
            <tr class="text-success">
              <th scope="col" />
              <th scope="col" />
              <th scope="col" />
              <th scope="col" />
              <th scope="col" />
              <th scope="col" />
              <th scope="col" />
              <th scope="col" />
              <th scope="col" />
              <th scope="col" />
              <th scope="col" />
              <th>
                {{ total_expense }}
              </th>
              <th scope="col">
                {{ total_cost }}
              </th>
            </tr>
          </thead>
        </VTable>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- SECTION: create extra expense -->
      <VCard title="د اضافی مصرف زیاتول">
        <VRow>
          <!-- 👉 Choose API Key -->
          <VCol
            cols="12"
            md="6"
            order-md="0"
            order="1"
          >
            <VCardText>
              <VForm ref="expenseForm">
                <VRow>
                  <VCol cols="12">
                    <span style="direction: ltr">
                      <VueDatePicker
                        v-model.trim="expense.created_at"
                        clearable
                        auto-apply
                        dark
                        close-on-auto-apply
                        formate="MM/dd/yyyy"
                        :offset="-120"
                        menu-class-name="dp-custom-menu"
                      />
                    </span>
                    <p
                      v-if="validationRules($v2.created_at, 'Date').length > 0"
                      class="text-error mb-0"
                    >
                      {{ validationRules($v2.created_at, "نیټه")[0] }}
                    </p>
                  </VCol>
                  <VCol cols="12">
                    <VTextField
                      v-model="expense.name"
                      label="نوم "
                      prepend-inner-icon="mdi-shape"
                      :rules="validationRules($v2.name, 'نوم ')"
                    />
                  </VCol>

                  <VCol cols="12">
                    <VTextField
                      v-model="expense.price"
                      :rules="validationRules($v2.price, 'بیه')"
                      prepend-inner-icon="mdi-cash"
                      label="بیه"
                      dir="ltr"
                      @input="convertToEnglishNumbers('expense.price')"
                      @keypress="useRules.preventNonNumeric"
                    />
                  </VCol>

                  <!-- 👉 Create Key Button -->
                  <VCol cols="12">
                    <VBtn
                      block
                      :loading="apiLoading2 && selectedItem == {}"
                      @click="validateExpenseForm"
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
    </VCol>

    <VCol cols="12">
      <!-- 👉 Table -->
      <VCard
        title="د اضافی مصروفونو لست"
        style="min-height: 300px"
      >
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">
                #آی دی
              </th>
              <th scope="col">
                د محصول نوم
              </th>
              <th scope="col">
                قیمت
              </th>
              <th scope="col">
                نیټه
              </th>

              <th
                scope="col"
                class="text-center"
              >
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in purchaseInfo.extra_expense"
              :key="index"
              :class="`${item.deleted_at ? 'text-error' : ''}`"
            >
              <td>
                {{ item.id }}
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.price }}</td>
              <td>{{ formateDate(item.created_at) }}</td>

              <td class="text-center">
                <div v-if="item.deleted_at">
                  <VBtn
                    v-if="scope(['user_restore'])"
                    variant="text"
                    icon
                    size="small"
                    color="info"
                    :loading="restoreLoading && selectedItem.id == item.id"
                    @click="restoreRecord(item, 'expenses')"
                  >
                    <VIcon
                      start
                      icon="mdi-restore"
                      color="info"
                    />
                    بیا رغونه
                  </VBtn>

                  <VBtn
                    v-if="scope(['user_delete'])"
                    class="ms-2"
                    variant="text"
                    icon
                    size="small"
                    :loading="apiLoading2 && selectedItem.id == item.id"
                    @click="forceDelete(item, 'expenses')"
                  >
                    <VIcon
                      icon="mdi-trash"
                      color="error"
                    />
                  </VBtn>
                </div>

                <div v-else>
                  <VBtn
                    v-if="scope(['user_create'])"
                    variant="text"
                    icon
                    size="small"
                    @click="editForm(item, 'expense')"
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
                    :loading="apiLoading2 && selectedItem.id == item.id"
                    @click="deleteRecord(item, 'expenses')"
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
import { required, numeric, minLength, minValue } from "@vuelidate/validators"
import useRules from "@/plugins/vuelidate/vuelidateRules"
import useVuelidate from "@vuelidate/core"
import { watch, ref, toRef } from "vue"
import { axios } from "@/plugins/axios-plugin"
import { toast } from "vue3-toastify"
import { useRoute } from "vue-router"
import { formateDate, scope } from "@/@core/utils/index"
import ConfirmDialog from "@/components/commons/ConfirmDialog.vue"
import EditDialog from "./EditDialog.vue"
import EditExpenseDialog from "./EditExpenseDialog.vue"
import moment from "moment"
import router from "@/router"

const props = defineProps({
  purchaseInfo: {
    type: Object,
    default: () => {},
  },

  updateChanges: {
    type: Function,
    default: () => {},
  },
})

const route = useRoute()

const purchase_id = ref(route.params.purchase_id)

const formRef = ref()
const ReceiveformRef = ref()
const expenseForm = ref()
const profileLoading = ref(false)
const selectedId = ref(null)
const loadingCategory = ref(false)

const apiLoading = ref(false)
const Loading = ref(false)
const apiLoading2 = ref(false)
const restoreLoading = ref(false)
const confirmRef = ref()
const editRef = ref()
const editexpenseRef = ref()
const show = ref(false)
const showProduct = ref(false)
const ProductformRef = ref()
const Categories = ref([])
const total_cost = ref(0)
const total_expense = ref(0)
const selectedItem = ref({})
const selectedType = ref(null)
const showDialog = ref(false)
const loadingProduct = ref(false)
const products = ref([])
const payload = ref({
  created_at: new Date(),
  product_id: null,
  rate: null,
  cost: 1,
  quantity: null,
  expense: null,
  carton_amount: null,
  per_carton_cost: null,
  sell_price: null,
  carton: null,
  total: null,
  purchase_id: purchase_id.value,
})

const expense = ref({
  created_at: new Date(),
  product_id: null,
  price: null,
  purchase_id: purchase_id.value,
  vendor_name: props.purchaseInfo.vendor.name,
  container_name: props.purchaseInfo.container.name,
})

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate

const rules = {
  created_at: { required },
  product_id: { required, minLength: minLength(2) },
  total: { required },
  cost: { required, minValue: minValue(0) },
  quantity: { required },
  per_carton_cost: { required },
  sell_price: { required },
  expense: { required },
  carton_amount: { required },
  carton: { required },
  rate: { required },
}

// const rules = {
//   created_at: {},
//   name: {},
//   type: {},
//   cost: {},
//   quantity: {},
// }
const formData = ref({
  created_at: new Date(),
  quantity_receive: null,
  product_id: null,
  product_item_id: null,
  carton: null,
  carton_quantity: null,
  description: null,
})
const expenseRule = {
  created_at: { required },
  name: { required, minLength: minLength(3) },
  price: { required, minValue: minValue(0) },
}
const rules2 = {
  quantity_receive: { required },
}

const openDialogs = item => {
  console.log("items", item)
  formData.value = {
    created_at: new Date(),
    quantity: null,
    exist: item.quantity - item.received,
    carton_amount: item.carton_amount,
    carton: item.carton - item.receive_carton,
    product_id: item.product_id,
    product_item_id: item.id,
  }
  show.value = true
}
const getProductStock = value => {
  loadingProduct.value = true
  axios.get("get-product-list/" + value.id).then(response => {
    payload.value.carton_amount = response.data.carton_quantity
    loadingProduct.value = false
  })
}
const Calculate = value => {
  const total_price = parseFloat(
    ((payload.value.cost / value) * payload.value.carton_amount * 1 +
      1 * payload.value.expense) *
      payload.value.carton,
  )
  payload.value.total = total_price.toFixed(2)
  const expenses = parseFloat(payload.value.expense)
  const totals =
    expenses + parseFloat((payload.value.cost / value) * payload.value.carton_amount)
  payload.value.per_carton_cost = totals.toFixed(2)
}
const Calculate2 = value => {
  const total_price = parseFloat(
    ((value / payload.value.rate) * payload.value.carton_amount * 1 +
      1 * payload.value.expense) *
      payload.value.carton,
  )
  payload.value.total = total_price.toFixed(2)
  const expenses = parseFloat(payload.value.expense)
  const totals =
    expenses + parseFloat((value / payload.value.rate) * payload.value.carton_amount)
  payload.value.per_carton_cost = totals.toFixed(2)
}
const Calculate3 = value => {
  const total_price = parseFloat(
    ((payload.value.cost / payload.value.rate) * payload.value.carton_amount * 1 +
      1 * payload.value.expense) *
      payload.value.carton,
  )
  payload.value.total = total_price.toFixed(2)
  const total = parseFloat(payload.value.carton * payload.value.carton_amount)
  payload.value.quantity = total.toFixed(2)
  const expenses = parseFloat(payload.value.expense)
  const totals =
    expenses +
    parseFloat((payload.value.cost / payload.value.rate) * payload.value.carton_amount)
  payload.value.per_carton_cost = totals.toFixed(2)
}

// const getCartonAmount = (value) => {
//   const total = parseFloat(payload.value.quantity / payload.value.carton_amount);
//   payload.value.carton = total.toFixed(2);
//   const expenses = parseFloat(payload.value.expense);
//   const totals = expenses + parseFloat((payload.value.cost / payload.value.rate) * value);
//   payload.value.per_carton_cost = totals.toFixed(2);
// };
const Calculate4 = value => {
  const total_price = parseFloat(
    ((payload.value.cost / payload.value.rate) * payload.value.carton_amount * 1 +
      1 * value) *
      payload.value.carton,
  )
  payload.value.total = total_price.toFixed(2)
  const expenses = parseFloat(value)
  const totals =
    expenses +
    parseFloat((payload.value.cost / payload.value.rate) * payload.value.carton_amount)
  payload.value.per_carton_cost = totals.toFixed(2)
}
const CalculatQuantity = value => {
  const total_price = parseFloat(value * formData.value.carton_amount)
  formData.value.quantity_receive = total_price.toFixed(2)
}
const getprice = value => {
  const total_price = parseFloat(
    formData.value.quantity_receive / formData.value.carton_amount,
  )
  formData.value.carton_quantity = total_price.toFixed(2)
}
const $v = new useVuelidate(rules, payload)
const $v2 = new useVuelidate(expenseRule, expense)
const $v3 = new useVuelidate(rules2, formData)
const ProductForm = ref({
  product_name: "",
  category_id: "",
  carton_quantity: "",
})
const productRule = {
  product_name: { required },
  category_id: { required },
  carton_quantity: { required },
}

const $v1 = useVuelidate(productRule, ProductForm)
const resetProductForm = () => {
  ProductForm.value = {
    product_name: null,
    category_id: null,
    carton_quantity: null,
  }
  $v1.value.$reset()
  ProductformRef.value.resetValidation()
}
const addProduct = type => {
  getCategory()
  showProduct.value = true
}
const closeReset = type => {
  showProduct.value = false
  getProduct()
}
const resetForm = (type = "items") => {
  if (type == "items") {
    payload.value = {
      created_at: new Date(),
      product_id: null,
      total: null,
      cost: 1,
      quantity: null,
      carton_amount: null,
      carton: null,
      purchase_id: purchase_id.value,
      vendor_id: props.purchaseInfo.vendor_id,
    }

    $v.value.$reset()
    formRef.value.resetValidation()
  } else {
    expense.value = {
      created_at: new Date(),
      name: null,
      price: null,
      purchase_id: purchase_id.value,
      vendor_id: props.purchaseInfo.vendor_id,
      vendor_name: props.purchaseInfo.vendor.name,
      container_name: props.purchaseInfo.container.name,
    }
    $v2.value.$reset()
    expenseForm.value.resetValidation()
  }
}
async function getProduct() {
  try {
    loadingProduct.value = true
    const { data } = await axios.get("product-list")
    products.value = data
  } catch (error) {
    console.error("error", error)
  }
  loadingProduct.value = false
}
const validateForm = async () => {
  formRef.value.validate()
  $v.value.$touch()

  // if ($v.value.$invalid) {
  //   toast.error('مهربانی وکړې فورم صحیح ډک کړئ!')

  //   return false
  // }
  submit()
}
async function getCategory() {
  try {
    loadingCategory.value = true
    const { data } = await axios.get("category-list")

    Categories.value = data
  } catch (error) {
    console.error("error", error)
  }
  loadingCategory.value = false
}
const viewProfile = async item => {
  profileLoading.value = true
  selectedId.value = item.id

  await router.replace("../view-received/" + item.id)
  profileLoading.value = false
}
const validateExpenseForm = async () => {
  expenseForm.value.validate()
  $v2.value.$touch()

  // if ($v2.value.$invalid) {
  //   toast.error('مهربانی وکړې فورم صحیح ډک کړئ!')

  //   return false
  // }
  submitExpense()
}
const validateFormRecive = async () => {
  ReceiveformRef.value.validate()
  $v3.value.$touch()

  if (formData.value.quantity_receive == null) {
    toast.error("مهربانی وکړې فورم صحیح ډک کړئ!")

    return false
  }
  submitReceive()
}
const submitReceive = async () => {
  try {
    Loading.value = true

    let { data } = await axios.post("receive_product", formData.value)
    await props.updateChanges()
    show.value = false
  } catch (error) {
    console.error("error", error)
  }
  Loading.value = false
}

async function submit() {
  try {
    apiLoading.value = true

    const { data } = await axios.post(`purchase-item`, payload.value)
    await props.updateChanges()

    resetForm("items")
  } catch (error) {
    console.error("error", error)
  }
  apiLoading.value = false
}

async function submitExpense() {
  try {
    apiLoading2.value = true

    await axios.post(`purchase-expense`, expense.value)
    await props.updateChanges()
    resetForm("extra_expense")
  } catch (error) {
    console.error("error", error)
  }
  apiLoading2.value = false
}
async function submitProduct() {
  try {
    if (ProductForm.value.id) await axios.put("product/id", ProductForm.value)
    else await axios.post("product", ProductForm.value)

    getProduct()
    resetProductForm()

    showProduct.value = false
  } catch (error) {
    console.error("error", error)
    toast.error(" مشکل در سرور وجود دارد !")
  }
}
const validateProductForm = async () => {
  ProductformRef.value.validate()
  $v1.value.$touch()

  // if ($v1.value.$invalid) {
  //   toast.error("مهربانی وکړې فورم صحیح ډک کړئ!");

  //   return false;
  // }
  submitProduct()
  $v1.value.$reset()
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
const editExpenseForm = async (item, type = "epense") => {
  editexpenseRef.value.openDialog(item, type)
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

const onConfirm = async event => {
  if (event == "delete") {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(
        `purchase_delete/${selectedType.value}/${selectedItem.value.id}`,
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
        `force-purchase_delete/${selectedType.value}/${selectedItem.value.id}`,
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
        `restore_purchase/${selectedType.value}/${selectedItem.value.id}`,
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
  total_cost.value = 0
  total_expense.value = 0

  props.purchaseInfo.items.forEach(element => {
    // Check if the values are valid numbers before adding them

    total_cost.value += parseFloat(element.total)

    total_expense.value += parseFloat(element.expense)
  })

  // Round the totals to 2 decimal places after the loop
  total_cost.value = total_cost.value.toFixed(2)
  total_expense.value = total_expense.value.toFixed(2)

  getProduct()
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
