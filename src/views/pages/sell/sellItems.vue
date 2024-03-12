<template>
  <VRow>
    <ConfirmDialog ref="confirmRef" @confirm="onConfirm" />

    <EditDialog ref="editRef" :order-info="sellInfo" :update-changes="updateChanges" />

    <VCol cols="12">
      <VCard title="د محصول خرڅول">
        <VCardText class="">
          <div class="d-flex align-center" />
        </VCardText>
        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="formRef" class="mt-6">
            <VRow class="mb-3">
              <VCol cols="12" md="3">
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
              <VCol cols="12" md="3">
                <VAutocomplete
                  v-model="payload.stock_id"
                  label="د ګدام نوم"
                  prepend-inner-icon="mdi-account"
                  :items="stocks"
                  :item-title="(st) => `${st.name}`"
                  return-object
                  :loading="loadingStock"
                  :rules="validationRules($v.stock_id, 'د ګدام نوم')"
                  @update:modelValue="getProductStock"
                />
              </VCol>

              <VCol cols="12" md="3">
                <VAutocomplete
                  v-model="payload.product_id"
                  label="د محصول نوم"
                  prepend-inner-icon="mdi-account"
                  :items="products"
                  :item-title="
                    (pr) =>
                      `${pr.product.product_name} د کارتن تعداد ${pr.carton_quantity}`
                  "
                  return-object
                  :loading="loadingProduct"
                  :rules="validationRules($v.product_id, 'د محصول نوم')"
                  @update:modelValue="getProduct"
                />
              </VCol>

              <VCol cols="3">
                <VTextField
                  v-model="payload.carton_quantity"
                  prepend-inner-icon="mdi-counter"
                  label="د کارتن تعداد"
                  dir="ltr"
                  @update:modelValue="Calculate3"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol cols="12" md="3">
                <VTextField
                  v-model="payload.income_price"
                  label="د هر کارتن تمام شد قیمت"
                  prepend-inner-icon="mdi-cash"
                  :rules="validationRules($v.income_price, 'د هر کارتن تمام شد قیمت  ')"
                  dir="ltr"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
              <VCol cols="12" md="3">
                <VTextField
                  v-model="payload.cost"
                  label=" د خرڅ قیمت"
                  prepend-inner-icon="mdi-cash"
                  :rules="validationRules($v.cost, 'د هر کارتن قیمت  ')"
                  dir="ltr"
                  @update:modelValue="Calculate2"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>

              <VCol cols="12" md="3">
                <VTextField
                  v-model="payload.total"
                  prepend-inner-icon="mdi-counter"
                  :rules="validationRules($v.total, 'مجموعه')"
                  label="مجموعه"
                  dir="ltr"
                  @keypress="useRules.preventNonNumeric"
                />
              </VCol>
            </VRow>
            <VRow />
          </VForm>
        </VCardText>

        <VCardText class="d-flex flex-wrap gap-4">
          <VBtn @click="validateForm"> ذخیره </VBtn>

          <VBtn color="secondary" variant="tonal" @click="resetForm"> کینسل </VBtn>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Table -->
      <VCard title="د اجناسو لست" style="min-height: 300px">
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">#آی دی</th>
              <th scope="col">د محصول نوم</th>

              <th scope="col">د ګدام نوم</th>
              <th scope="col">د کارتن تعداد</th>

              <th scope="col">اندازه</th>
              <th scope="col">قیمت</th>

              <th scope="col">مجموع په دالر</th>
              <th scope="col">نیټه</th>
              <th scope="col" class="text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in sellInfo.items"
              :key="index"
              :class="`${item.deleted_at ? 'text-error' : ''}`"
            >
              <td>
                {{ item.id }}
              </td>
              <td>{{ item.product_stock.product.product_name }}</td>
              <td>{{ item.product_stock.stock.name }}</td>

              <td>{{ item.carton_quantity }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.cost }}</td>

              <td>{{ item.total }}</td>
              <td>{{ moment(item.created_at, "YYYY-MM-DD").format("ll") }}</td>

              <td class="text-center">
                <div v-if="item.deleted_at">
                  <VBtn
                    variant="text"
                    icon
                    size="small"
                    color="info"
                    :loading="restoreLoading && selectedItem.id == item.id"
                    @click="restoreRecord(item, 'items')"
                  >
                    <VIcon start icon="mdi-restore" color="info" />
                    بیا رغونه
                  </VBtn>

                  <VBtn
                    class="ms-2"
                    variant="text"
                    icon
                    size="small"
                    :loading="apiLoading2 && selectedItem == item"
                    @click="forceDelete(item, 'items')"
                  >
                    <VIcon icon="mdi-trash" color="error" />
                  </VBtn>
                </div>

                <div v-else>
                  <VBtn variant="text" icon size="small" @click="editForm(item, 'item')">
                    <VIcon icon="mdi-pencil" color="primary" />
                  </VBtn>

                  <VBtn
                    variant="text"
                    icon
                    size="small"
                    :loading="apiLoading2 && selectedItem == item"
                    @click="deleteRecord(item, 'items')"
                  >
                    <VIcon icon="mdi-trash" color="error" />
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
import { required, numeric, minLength, minValue } from "@vuelidate/validators";
import useRules from "@/plugins/vuelidate/vuelidateRules";
import useVuelidate from "@vuelidate/core";
import { ref, toRef } from "vue";
import { axios } from "@/plugins/axios-plugin";
import { toast } from "vue3-toastify";
import { useRoute } from "vue-router";
import { formateDate, scope } from "@/@core/utils/index";
import ConfirmDialog from "@/components/commons/ConfirmDialog.vue";
import EditDialog from "./EditDialog.vue";
import moment from "moment";

const props = defineProps({
  sellInfo: {
    type: Object,
    default: () => {},
  },

  updateChanges: {
    type: Function,
    default: () => {},
  },
});

const route = useRoute();

const sell_id = ref(route.params.sell_id);

const formRef = ref();

const apiLoading = ref(false);
const apiLoading2 = ref(false);
const restoreLoading = ref(false);
const confirmRef = ref();
const editRef = ref();

const selectedItem = ref({});
const selectedType = ref(null);
const showDialog = ref(false);
const loadingProduct = ref(false);
const loadingStock = ref(false);
const products = ref([]);
const stocks = ref([]);
const payload = ref({
  created_at: new Date(),
  product_id: null,

  cost: 1,
  quantity: null,
  carton_amount: null,
  carton_quantity: null,

  income_price: null,
  total: null,
  sell_id: sell_id.value,
  customer_id: props.sellInfo.customer_id,
});

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate;

const rules = {
  created_at: { required },
  product_id: { required },
  stock_id: { required },
  total: { required },
  cost: { required, minValue: minValue(1) },
  quantity: { required },
  income_price: { required },
  carton_amount: { required },
};

// const rules = {
//   created_at: {},
//   name: {},
//   type: {},
//   cost: {},
//   quantity: {},
// }

const Calculate2 = (value) => {
  const total_price = parseFloat(value * payload.value.carton_quantity);
  payload.value.total = total_price.toFixed(2);
};
const Calculate3 = (value) => {
  const total_price = parseFloat(payload.value.cost * value);
  payload.value.total = total_price.toFixed(2);
};
const CalculatQuantity = (value) => {
  const total_price = parseFloat(payload.value.quantity / payload.value.amount);
  payload.value.carton_quantity = total_price.toFixed(2);
};

const $v = new useVuelidate(rules, payload);

const resetForm = (type = "items") => {
  if (type == "items") {
    payload.value = {
      created_at: new Date(),
      product_id: null,
      stock_id: null,
      total: null,
      cost: 1,
      quantity: null,
      carton_amount: null,
      carton_quantity: null,
      sell_id: sell_id.value,
      customer_id: props.sellInfo.customer_id,
    };

    $v.value.$reset();
    formRef.value.resetValidation();
  }
};

const getProductStock = (value) => {
  loadingProduct.value = true;
  axios.get("product-list/" + value.id).then((response) => {
    products.value = response.data;
    loadingProduct.value = false;
  });
};
const getProduct = (value) => {
  axios.get("get-product-stock-list/" + value.id).then(function (response) {
    payload.value.carton_amount = response.data.carton_quantity;
    conso;
    le.log("ddd", payload.value.carton_amount);
  });
  axios.get("get-product-price/" + value.id).then(function (response) {
    payload.value.income_price = response.data.product.per_carton_cost;
    payload.value.cost = response.data.product.sell_price;
  });
};
async function getStock() {
  try {
    loadingStock.value = true;
    const { data } = await axios.get("stock-list");
    stocks.value = data;
  } catch (error) {
    console.error("error", error);
  }
  loadingStock.value = false;
}
const validateForm = async () => {
  formRef.value.validate();
  $v.value.$touch();

  // if ($v.value.$invalid) {
  //   toast.error('مهربانی وکړې فورم صحیح ډک کړئ!')

  //   return false
  // }
  submit();
};
const validateExpenseForm = async () => {
  expenseForm.value.validate();
  $v2.value.$touch();

  // if ($v2.value.$invalid) {
  //   toast.error('مهربانی وکړې فورم صحیح ډک کړئ!')

  //   return false
  // }
  submitExpense();
};

async function submit() {
  try {
    apiLoading.value = true;

    const { data } = await axios.post(`sell-item`, payload.value);
    await props.updateChanges();

    resetForm("items");
  } catch (error) {
    console.error("error", error);
  }
  apiLoading.value = false;
}

function convertToEnglishNumbers(model, item = null, index = null) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g];
  for (let i = 0; i < 10; i++) {
    if (model == "expense.price") {
      expense.value.price = expense.value.price
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i);

      return;
    }
    if (item == null) {
      payload.value[model] = payload.value[model]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i);
    } else {
      payload.value[model][index][item] = payload.value[model][index][item]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i);
    }
  }
}

const restoreRecord = async (item, type) => {
  selectedItem.value = item;
  selectedType.value = type;
  confirmRef.value.showDialog("restore");
};

const editForm = async (item, type = "epense") => {
  editRef.value.openDialog(item, type);
};

const deleteRecord = async (item, type) => {
  selectedItem.value = item;
  selectedType.value = type;

  confirmRef.value.showDialog("delete");
};

const forceDelete = async (item, type) => {
  selectedItem.value = item;
  selectedType.value = type;

  confirmRef.value.showDialog("forceDelete");
};

const onConfirm = async (event) => {
  if (event == "delete") {
    try {
      apiLoading2.value = true;
      const { data } = await axios.delete(
        `delete/${selectedType.value}/${selectedItem.value.id}`
      );
      await props.updateChanges();
    } catch (error) {
      console.error("error", error);
    }
  }

  if (event == "forceDelete") {
    try {
      apiLoading2.value = true;
      const { data } = await axios.delete(
        `force-delete/${selectedType.value}/${selectedItem.value.id}`
      );
      await props.updateChanges();
    } catch (error) {
      console.error("error", error);
    }
  }
  if (event == "restore") {
    try {
      restoreLoading.value = true;
      const { data } = await axios.post(
        `restore/${selectedType.value}/${selectedItem.value.id}`
      );
      await props.updateChanges();
    } catch (error) {
      console.error("error", error);
    }
  }
  restoreLoading.value = false;
  apiLoading2.value = false;
  selectedItem.value = {};
};

onMounted(() => {
  getStock();
});
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
