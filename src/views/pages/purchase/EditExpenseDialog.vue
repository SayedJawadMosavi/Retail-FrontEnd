<template>
  <VDialog
    v-model="showDialog"
    :class="`${editType == 'expense' ? 'v-dialog-sm' : 'v-dialog-lg'}`"
    persistent
  >
    <VCard v-if="editType == 'item'" title="د محصول مصرف ایدیت">
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="formRef" class="mt-6">
          <VRow class="mb-3">
            <VCol cols="12" md="6">
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
                v-if="validationRules($v.created_at, 'Date').length > 0"
                class="text-error mb-0"
              >
                {{ validationRules($v.created_at, "نیټه")[0] }}
              </p>
            </VCol>
          </VRow>

          <VRow class="mb-3">
            <VCol cols="12" md="6">
              <VTextField
                v-model="payload.rate"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.rate, 'د تبادلی نرخ')"
                label="د تبادلی نرخ"
                dir="ltr"
                @update:modelValue="Calculate"
                @input="convertToEnglishNumbers('rate')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="payload.cost"
                label="قیمت په ین"
                dir="ltr"
                prepend-inner-icon="mdi-counter"
                disabled
                :rules="validationRules($v.cost, 'قیمت په ین')"
                @update:modelValue="Calculate2"
                @input="convertToEnglishNumbers('cost')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField
                v-model="payload.carton"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.carton, 'جمله په کارتن')"
                label="جمله په کارتن"
                disabled
                dir="ltr"
                @update:modelValue="Calculate3"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="payload.quantity"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.quantity, 'اندازه')"
                label="اندازه"
                disabled
                dir="ltr"
                @input="convertToEnglishNumbers('quantity')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="payload.expense"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.expense, 'مصرف')"
                label="مصرف"
                dir="ltr"
                @update:modelValue="Calculate4"
                @input="convertToEnglishNumbers('expense')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="payload.per_carton_cost"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.per_carton_cost, 'دیوکارتن قیمت')"
                label="دیوکارتن قیمت"
                disabled
                dir="ltr"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="payload.sell_price"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.sell_price, 'د خرڅ قیمت')"
                label="د خرڅ قیمت"
                disabled
                dir="ltr"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="payload.total"
                prepend-inner-icon="mdi-counter"
                :rules="validationRules($v.total, 'مجموعه په دالر')"
                label="مجموعه په دالر"
                dir="ltr"
                readonly
                @input="convertToEnglishNumbers('total')"
                @keypress="useRules.preventNonNumeric"
              />
            </VCol>
          </VRow>
          <VRow />
        </VForm>
      </VCardText>

      <VCardText class="d-flex flex-wrap gap-4">
        <VBtn :loading="apiLoading" @click="validateForm"> ذخیره </VBtn>

        <VBtn class="ms-2" color="secondary" variant="tonal" @click="closeDialog">
          لغوکول
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup>
import { required, numeric, minLength, minValue } from "@vuelidate/validators";
import useRules from "@/plugins/vuelidate/vuelidateRules";
import useVuelidate from "@vuelidate/core";
import { ref, toRef } from "vue";
import { toast } from "vue3-toastify";

import { axios } from "@/plugins/axios-plugin";
const props = defineProps({
  updateChanges: {
    type: Function,
    default: () => {},
  },
});

const validationRules = useRules.validate;
const loadingProduct = ref(false);
const products = ref([]);
const expense = ref({});
const payload = ref({});

const editType = ref(null);
const apiLoading2 = ref(false);
const apiLoading = ref(false);

const formRef = ref();
const expenseForm = ref();

const showDialog = ref(false);
const expenseRule = {
  created_at: { required },
  name: { required, minLength: minLength(3) },
  price: { required, minValue: minValue(1) },
};

const rules = {
  created_at: { required },
  product_id: { required, minLength: minLength(2) },
  total: { required },
  cost: { required, minValue: minValue(0) },
  quantity: { required },
  carton: { required },
  per_carton_cost: { required },
  sell_price: { required },

  expense: { required },
  rate: { required },
};
const Calculate = (value) => {
  const total_price = parseFloat(
    ((payload.value.cost / value) * payload.value.carton_amount * 1 +
      1 * payload.value.expense) *
      payload.value.carton
  );
  payload.value.total = total_price.toFixed(2);
  const expenses = parseFloat(payload.value.expense);
  const totals =
    expenses + parseFloat((payload.value.cost / value) * payload.value.carton_amount);
  payload.value.per_carton_cost = totals.toFixed(2);
};
const Calculate2 = (value) => {
  const total_price = parseFloat(
    ((value / payload.value.rate) * payload.value.carton_amount * 1 +
      1 * payload.value.expense) *
      payload.value.carton
  );
  payload.value.total = total_price.toFixed(2);
  const expenses = parseFloat(payload.value.expense);
  const totals =
    expenses + parseFloat((value / payload.value.rate) * payload.value.carton_amount);
  payload.value.per_carton_cost = totals.toFixed(2);
};
const Calculate3 = (value) => {
  const total_price = parseFloat(
    ((payload.value.cost / payload.value.rate) * payload.value.carton_amount * 1 +
      1 * payload.value.expense) *
      payload.value.carton
  );
  payload.value.total = total_price.toFixed(2);
  const total = parseFloat(payload.value.carton * payload.value.carton_amount);
  payload.value.quantity = total.toFixed(2);
  const expenses = parseFloat(payload.value.expense);
  const totals =
    expenses +
    parseFloat((payload.value.cost / payload.value.rate) * payload.value.carton_amount);
  payload.value.per_carton_cost = totals.toFixed(2);
};
const Calculate4 = (value) => {
  const total_price = parseFloat(
    ((payload.value.cost / payload.value.rate) * payload.value.carton_amount * 1 +
      1 * value) *
      payload.value.carton
  );
  payload.value.total = total_price.toFixed(2);
  const expenses = parseFloat(value);
  const totals =
    expenses +
    parseFloat((payload.value.cost / payload.value.rate) * payload.value.carton_amount);
  payload.value.per_carton_cost = totals.toFixed(2);
};
const $v = useVuelidate(rules, payload);
const $v2 = useVuelidate(expenseRule, expense);

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
    payload.value[model] = payload.value[model]
      .replace(persianNumbers[i], i)
      .replace(englishNumbers[i], i);
  }
}

const validateForm = async () => {
  formRef.value.validate();
  $v.value.$touch();
  if ($v.value.$invalid) {
    toast.error("مهربانی وکړې فورم صحیح ډک کړئ!");

    return false;
  }
  try {
    apiLoading.value = true;
    await axios.put(`purchase-item`, payload.value);
    await props.updateChanges();
    closeDialog();
  } catch (error) {
    console.error("error", error);
  }
  apiLoading.value = false;
};

const validateExpenseForm = async () => {
  expenseForm.value.validate();
  $v2.value.$touch();
  if ($v2.value.$invalid) {
    toast.error("مهربانی وکړې فورم صحیح ډک کړئ!");

    return false;
  }
  try {
    apiLoading2.value = true;

    await axios.put(`purchase-expense`, expense.value);
    await props.updateChanges();
    closeDialog();
  } catch (error) {
    console.error("error", error);
  }
  apiLoading2.value = false;
};

function openDialog(data, type) {
  showDialog.value = true;
  editType.value = type;
  if (type == "expense") {
    expense.value = JSON.parse(JSON.stringify(data));
  } else {
    payload.value = JSON.parse(JSON.stringify(data));
    console.log(data.product);
    payload.value.cost = data.yen_cost;
    axios.get("product-list").then(function (response) {
      products.value = response.data;
    });
    payload.value.product_id = data.product.product_name;
    payload.value.carton_amount = data.carton_amount;
  }
}

function closeDialog() {
  showDialog.value = false;
}
defineExpose({
  openDialog,
});
</script>
