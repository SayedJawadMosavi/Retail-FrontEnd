<template>
  <VExpandTransition>
    <div v-show="expand">
      <VCard title="کاروونکی زیاتول" class="my-5">
        <VForm ref="formRef">
          <VCardText>
            <VRow class="mb-3">
              <VCol cols="12" md="6">
                <VTextField
                  v-model.trim="payload.name"
                  label="د کاروونکی نوم"
                  prepend-inner-icon="mdi-account"
                  :rules="validationRules($v.name, 'د کاروونکی نوم')"
                  :autocomplete="false"
                />
              </VCol>

              <VCol cols="12" md="6">
                <VTextField
                  v-model.trim="payload.email"
                  :autocomplete="false"
                  label="ایمیل"
                  append-inner-icon="mdi-email"
                  :rules="validationRules($v.email, 'ایمیل')"
                  dir="ltr"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model.trim="payload.password"
                  autocomplete="new-password"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="validationRules($v.password, 'پاسورد')"
                  :append-inner-icon="
                    showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                  "
                  label="پاسورد"
                  dir="ltr"
                  @click:append-inner="showPassword = !showPassword"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model.trim="payload.confirm_password"
                  autocomplete="new-password"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="validationRules($v.confirm_password, 'د پاسورد تصدیق کول')"
                  :append-inner-icon="
                    showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                  "
                  label="د پاسورد تصدیق کول"
                  dir="ltr"
                  @click:append-inner="showPassword = !showPassword"
                />
              </VCol>

              <VCol cols="12" md="6">
                <VSelect
                  v-model="payload.role"
                  :items="roles"
                  label="نقش"
                  append-inner-icon="mdi-shield-sun-outline"
                  class="search-by"
                  item-title="name"
                  item-value="id"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <p class="text-base font-weight-medium mt-2">صلاحیتونه:</p>
                <p class="font-weight-medium">د کاروونکی د صلاحیتونو تعین کول</p>
                <VCheckbox
                  v-model="flag"
                  label="ټول انتخابول"
                  @click="selectAll(payload.permissions.length)"
                />
                <VTable class="text-no-wrap">
                  <thead>
                    <tr>
                      <th scope="col">سیسټم ته لاسرسی</th>

                      <th scope="col">
                        <VCheckbox
                          v-model="viewflag"
                          label=" د معلوماتو کتل"
                          @click="selectView('view')"
                        />
                      </th>
                      <th scope="col">
                        <VCheckbox
                          v-model="createEditflag"
                          label="  معلومات جوړول او سمول"
                          @click="selectView('create_edit')"
                        />
                      </th>
                      <th scope="col">
                        <VCheckbox
                          v-model="Deleteflag"
                          label="   د معلوماتو پاکول"
                          @click="selectView('delete_info')"
                        />
                      </th>
                      <th scope="col">
                        <VCheckbox
                          v-model="Restoreflag"
                          label="    د معلوماتو بیا رغونه "
                          @click="selectView('restore_info')"
                        />
                      </th>
                      <th scope="col">
                        <VCheckbox
                          v-model="forceDeleteflag"
                          label="   دايمي ړنګول"
                          @click="selectView('force_delete_info')"
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(per, index) in systems" :key="index">
                      <tr v-if="per.allowed_roles.includes(payload.role)">
                        <td>
                          {{ per.system_name }}
                        </td>
                        <td>
                          <VCheckbox
                            v-model="payload.permissions"
                            :value="per.actions[0]"
                          />
                        </td>
                        <td>
                          <VCheckbox
                            v-model="payload.permissions"
                            :value="per.actions[1]"
                          />
                        </td>
                        <td>
                          <VCheckbox
                            v-model="payload.permissions"
                            :value="per.actions[2]"
                          />
                        </td>
                        <td>
                          <VCheckbox
                            v-model="payload.permissions"
                            :value="per.actions[3]"
                          />
                        </td>
                        <td>
                          <VCheckbox
                            v-model="payload.permissions"
                            :value="per.actions[4]"
                          />
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </VTable>
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn :loading="apiLoading" @click="validateForm"> ذخیره </VBtn>

            <VBtn color="secondary" variant="tonal" @click="closeDialog">
              د فورم بندول
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </div>
  </VExpandTransition>
</template>

<script setup>
import { axios } from "@/plugins/axios-plugin";
import { computed, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  numeric,
  minLength,
  maxLength,
  minValue,
  maxValue,
  email,
  helpers,
  sameAs,
} from "@vuelidate/validators";
import useRules from "@/plugins/vuelidate/vuelidateRules";
import { toast } from "vue3-toastify";

// ==================================== START PROPS =======================================

const props = defineProps({
  toggleExpand: { type: Function, default: () => {} },
  fetchRecord: { type: Function, default: () => {} },
});

// ==================================== START DATA =======================================

const apiLoading = ref(false);
const isSubmited = ref(false);
const showPassword = ref(false);
const roles = [
  { id: "admin", name: "ادمین" },
  { id: "finance_manager", name: "مالی مدیر" },
  { id: "secretary", name: "منشی" },
];
const flag = ref(false);
const viewflag = ref(false);
const createEditflag = ref(false);
const Deleteflag = ref(false);
const Restoreflag = ref(false);
const forceDeleteflag = ref(false);
const payload = ref({
  name: null,
  password: null,
  email: null,
  confirm_password: null,
  role: null,
  permissions: [],
});
const expand = ref(false);
const formRef = ref();
const systems = [
  {
    system_id: "users",
    system_name: "کاروونکی",
    actions: [
      "user_view",
      "user_create",
      "user_delete",
      "user_restore",
      "user_force_delete",
    ],
    allowed_roles: ["admin"],
  },
  {
    system_id: "Dashboard",
    system_name: "فهرست",
    actions: ["dashboard_view"],
    allowed_roles: ["admin"],
  },
  {
    system_id: "employees",
    system_name: "کارکوونکی",
    actions: [
      "employee_view",
      "employee_create",
      "employee_delete",
      "employee_restore",
      "employee_force_delete",
    ],
    allowed_roles: ["admin", "finance_manager", "secretary"],
  },
  {
    system_id: "salaries",
    system_name: "معاشات",
    actions: [
      "salary_view",
      "salary_create",
      "salary_delete",
      "salary_restore",
      "salary_force_delete",
    ],
    allowed_roles: ["admin", "finance_manager", "secretary"],
  },
  {
    system_id: "customer",
    system_name: "پیرودونکي",
    actions: [
      "customer_view",
      "customer_create",
      "customer_delete",
      "customer_restore",
      "customer_force_delete",
    ],
    allowed_roles: ["admin", "finance_manager", "secretary"],
  },
  {
    system_id: "income_expense",
    system_name: "عاید او مصرف",
    actions: [
      "income_expense_view",
      "income_expense_create",
      "income_expense_delete",
      "income_expense_restore",
      "income_expense_force_delete",
    ],
    allowed_roles: ["admin", "finance_manager", "secretary"],
  },
  {
    system_id: "product",
    system_name: " محصولات",
    actions: [
      "product_view",
      "product_create",
      "product_delete",
      "product_restore",
      "product_force_delete",
    ],
    allowed_roles: ["admin", "finance_manager", "secretary"],
  },
  {
    system_id: "purchase",
    system_name: "اخیستل",
    actions: [
      "purchase_view",
      "purchase_create",
      "purchase_delete",
      "purchase_restore",
      "purchase_force_delete",
    ],
    allowed_roles: ["admin", "finance_manager", "secretary"],
  },
  {
    system_id: "sell",
    system_name: "خرڅ",
    actions: [
      "sell_view",
      "sell_create",
      "sell_delete",
      "sell_restore",
      "sell_force_delete",
    ],
    allowed_roles: ["admin", "finance_manager", "secretary"],
  },
  {
    system_id: "stock_product_transfer",
    system_name: " د محصول انتقال ګدام ته",
    actions: [
      "stock_product_transfer_view",
      "stock_product_transfer_create",
      "stock_product_transfer_delete",
      "stock_product_transfer_restore",
      "stock_product_transfer_force_delete",
    ],
    allowed_roles: ["admin", "finance_manager", "secretary"],
  },
  {
    system_id: "stock_to_stock_transfer",
    system_name: " ګدام نه ګدام ته انتقال",
    actions: [
      "stock_to_stock_transfer_view",
      "stock_to_stock_transfer_create",
      "stock_to_stock_transfer_delete",
      "stock_to_stock_transfer_restore",
      "stock_product_transfer_force_delete",
    ],
    allowed_roles: ["admin", "finance_manager", "secretary"],
  },
  {
    system_id: "stock",
    system_name: "گدام ",
    actions: [
      "stock_view",
      "stock_create",
      "stock_delete",
      "stock_restore",
      "stock_force_delete",
    ],
    allowed_roles: ["admin", "finance_manager", "secretary"],
  },
  {
    system_id: "vendor",
    system_name: "سوداګر ",
    actions: [
      "vendor_view",
      "vendor_create",
      "vendor_delete",
      "vendor_restore",
      "vendor_force_delete",
    ],
    allowed_roles: ["admin", "finance_manager", "secretary"],
  },
];

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate;
const samePassword = computed(() => {
  return payload.value.password;
});

const rules = {
  name: { required, minLength: minLength(3) },
  email: { required, email },
  role: { required },
  permissions: { required },
  password: { required, minLength: minLength(6) },
  confirm_password: {
    required,
    sameAsPassword: sameAs(samePassword),
  },
};

const $v = useVuelidate(rules, payload);

// ==================================== START METHODS =======================================

const resetForm = () => {
  payload.value = {
    name: null,
    password: null,
    email: null,
    confirm_password: null,
    role: null,
    permissions: [],
  };
  $v.value.$reset();
  formRef.value.resetValidation();
};
const selectAll = (all) => {
  systems.forEach((element) => {
    if (flag.value == false) {
      element.actions.forEach((index) => {
        payload.value.permissions.push(index);
      });
    } else {
      flag.value == false;
      viewflag.value == "";
      payload.value.permissions = [];
    }
  });
};
const selectView = (all) => {
  systems.forEach((element) => {
    if (all == "view") {
      if (viewflag.value == false) {
        payload.value.permissions.push(element.actions[0]);
      } else {
        payload.value.permissions.splice(
          payload.value.permissions.indexOf(element.actions[0]),
          1
        );
      }
    } else if (all == "create_edit") {
      if (createEditflag.value == false) {
        payload.value.permissions.push(element.actions[1]);
      } else {
        payload.value.permissions.splice(
          payload.value.permissions.indexOf(element.actions[1]),
          1
        );
      }
    } else if (all == "delete_info") {
      if (Deleteflag.value == false) {
        payload.value.permissions.push(element.actions[2]);
      } else {
        payload.value.permissions.splice(
          payload.value.permissions.indexOf(element.actions[2]),
          1
        );
      }
    } else if (all == "restore_info") {
      if (Restoreflag.value == false) {
        payload.value.permissions.push(element.actions[3]);
      } else {
        payload.value.permissions.splice(
          payload.value.permissions.indexOf(element.actions[3]),
          1
        );
      }
    } else if (all == "force_delete_info") {
      if (forceDeleteflag.value == false) {
        payload.value.permissions.push(element.actions[4]);
      } else {
        payload.value.permissions.splice(
          payload.value.permissions.indexOf(element.actions[4]),
          1
        );
      }
    }

    //  payload.value.permissions =[];
  });
};
function openDialog() {
  expand.value = true;
}

function closeDialog() {
  isSubmited.value = false;
  expand.value = false;
  resetForm();
}

async function submit() {
  try {
    apiLoading.value = true;
    const res = await axios.post("users", payload.value);
    isSubmited.value = true;
    closeDialog();
    props.fetchRecord();
  } catch (error) {
    console.error("error", error);
  }
  apiLoading.value = false;
}

const validateForm = async () => {
  formRef.value.validate();
  if ($v.value.$invalid) {
    toast.error("مهربانی وکړې فورم صحیح ډک کړئ!");

    return false;
  }
  submit();
};

watch(payload.value.role, () => {
  payload.value.permissions = [];
});

// ==================================== START Expose =======================================

defineExpose({
  openDialog,
});
</script>

<style>
.dp__input {
  padding: 12px 4px 12px 40px !important;
}

.dp__theme_dark,
.dp__theme_light {
  --dp-background-color: rgb(var(--v-theme-surface));
  --dp-text-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  --dp-hover-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
  --dp-hover-text-color: gba(var(--v-theme-on-surface), 1);
  --dp-hover-icon-color: var(--v-theme-on-surface);
  --dp-primary-color: #40A579;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #8A8D93;
  --dp-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  --dp-menu-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  --dp-border-color-hover: rgba(var(--v-border-color), var(--v-medium-emphasis-opacity)) --dp-border-radius:10px !important;
  --dp-disabled-color: var(--v-disabled-opacity);
  --dp-scroll-bar-background: var(--v-theme-on-surface);
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  --dp-danger-color: #e53935;
  --dp-highlight-color: rgba(0, 92, 178, 0.2);
}
</style>
