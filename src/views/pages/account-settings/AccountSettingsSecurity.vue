<template>
  <VCard style="pointer-events: none">
    <VCardText>
      <p class="text-base font-weight-medium mt-2">
        نقش:
        <VChip small :color="getRole().color" class="font-weight-medium ms-2">
          {{ getRole().name }}
        </VChip>
      </p>

      <VRow>
        <VCol cols="12">
          <p class="text-base font-weight-medium mt-2">صلاحیت ها:</p>
          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th scope="col">سیسټم ته لاسرسی</th>
                <th scope="col">معلومات کتل</th>
                <th scope="col">د معلومات ثبت او ایدیت</th>
                <th scope="col">د معلومات ړنګ کول</th>
                <th scope="col">د معلوماتو بیا رغونه</th>
                <th scope="col">دايمي ړنګول</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(per, index) in systems" :key="index">
                <tr>
                  <td>
                    {{ per.system_name }}
                  </td>
                  <td>
                    <VCheckbox v-model="payload.permissions" :value="per.actions[0]" />
                  </td>
                  <td>
                    <VCheckbox v-model="payload.permissions" :value="per.actions[1]" />
                  </td>
                  <td>
                    <VCheckbox v-model="payload.permissions" :value="per.actions[2]" />
                  </td>
                  <td>
                    <VCheckbox v-model="payload.permissions" :value="per.actions[3]" />
                  </td>
                  <td>
                    <VCheckbox v-model="payload.permissions" :value="per.actions[4]" />
                  </td>
                </tr>
              </template>
            </tbody>
          </VTable>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup>
import { axios } from "@/plugins/axios-plugin";
import { useStoreAuth } from "@/store/authStore";
const store = useStoreAuth();

const payload = ref({
  role: store.user.role,
  permissions: store.user.permissions,
});

const apiLoading = ref(false);

const roles = [
  { id: "admin", name: "ادمین" },
  { id: "finance_manager", name: "مالی مدیر" },
  { id: "bank_manager", name: "د صرافی مدیر" },
];
const validateForm = async () => {
  formRef.value.validate();
  if ($v.value.$invalid) {
    toast.error("مهربانی وکړې فورم صحیح ډک کړئ!");

    return false;
  }
  submit();
};

async function submit() {
  try {
    apiLoading.value = true;
    const res = await axios.post("users", payload.value);
  } catch (error) {
    console.error("error", error);
  }
  apiLoading.value = false;
}

watch(payload.value.role, async () => {
  payload.value.permissions = [];
});
const resetForm = ref();
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

const getRole = () => {
  let color = "";
  let name = "";
  if (store.user.role == "admin") {
    name = "ادمین";
    color = "primary";
  } else if (store.user.role == "finance_manager") {
    name = "مالی مدیر";
    color = "info";
  } else {
    name = "د صرافی مدیر";
    color = "warning";
  }

  return { name, color };
};
</script>
