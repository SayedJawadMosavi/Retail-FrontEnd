<template>
  <div>
    <VDialog v-model="show" transition="dialog-top-transition" persistent width="auto">
      <VCard width="auto" title="راپور ترتیبول">
        <VCardText style="min-height: 300px">
          <VForm ref="formRef">
            <VRow>
              <VCol cols="12">
                <p class="mb-0">پیل نیټه</p>

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
                  v-if="validationRules(v$.start_date, 'نیټه').length > 0"
                  class="text-error"
                >
                  {{ validationRules(v$.start_date, "پیل نیټه")[0] }}
                </p>
              </VCol>

              <VCol cols="12">
                <p class="mb-0">ختم نیټه</p>
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
                  v-if="validationRules(v$.end_date, 'نیټه').length > 0"
                  class="text-error"
                >
                  {{ validationRules(v$.end_date, "ختم نیټه")[0] }}
                </p>
              </VCol>
              <VCol cols="12" md="12">
                <VSelect
                  v-model="payload.type"
                  :items="items"
                  label="Type"
                  append-inner-icon="mdi-shield-sun-outline"
                  class="search-by"
                  item-title="name"
                  item-value="id"
                  :rules="validationRules(v$.type, 'Type')"
                  @update:modelValue="showData"
                />
              </VCol>
              <VCol v-if="TypeFlag == true" cols="12" md="12">
                <VAutocomplete
                  v-model="payload.category_id"
                  label="کتگوری"
                  prepend-inner-icon="mdi-account"
                  :items="Categories"
                  :item-title="(ca) => `${ca.name}`"
                  return-object
                  :loading="loadingCategory"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn color="secondary" @click="closeReset"> کینسل </VBtn>
          <VBtn ripple color="primary" variant="tonal" @click="print">
            پرنت
            <VIcon icon="mdi-printer" end />
          </VBtn>
          <VBtn ripple color="primary" variant="tonal" @click="getReport">
            راپور
            <VIcon icon="mdi-export" end />
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
      page="د راپورونو لست"
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
          راپور ترتیبول
          <VIcon end icon="mdi-printer" />
        </VBtn>
      </template>
    </BreadCrumbs>
    <div
      v-if="extra_value"
      style="border: 1px solid rebeccapurple; padding: 5px; border-radius: 10px"
      class="d-flex align-center"
    >
      <VRow>
        <VCol cols="12" md="4">
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> مجموعه راغله :</span>
            {{ total_amount_income_usd ?? 0 }}
          </div>
        </VCol>
        <VCol cols="12" md="4">
          <div class="pe-3 text-error me-5">
            <span class="d-inline-block pe-1"> ټول مصرف : </span>
            {{ total_expense_usd ?? 0 }}
          </div>
        </VCol>
        <VCol cols="12" md="4">
          <div class="pe-3 me-5 text-warning">
            <span class="d-inline-block pe-1"> موجودی : </span> {{ balance ?? 0 }}
          </div>
        </VCol>
      </VRow>
    </div>
    <div
      v-if="customer_info"
      style="border: 1px solid rebeccapurple; padding: 5px; border-radius: 10px"
      class="d-flex align-center mt-3"
    >
      <VRow>
        <VCol cols="12" md="4">
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> مجموعه :</span>
            {{ total_amount_sell ?? 0 }}
          </div>
        </VCol>
        <VCol cols="12" md="4">
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> وصول شوی :</span>
            {{ total_paid_sell ?? 0 }}
          </div>
        </VCol>
        <VCol cols="12" md="4">
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> پاتي :</span>
            {{ total_reminder_purchase ?? 0 }}
          </div>
        </VCol>
      </VRow>
    </div>
    <div
      v-if="extra_profit"
      style="border: 1px solid rebeccapurple; padding: 5px; border-radius: 10px"
      class="d-flex align-center mt-3"
    >
      <VRow>
        <VCol cols="12" md="4">
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> مجموعه مفاد:</span>
            {{ TotalProfit ?? 0 }}
          </div>
        </VCol>
      </VRow>
    </div>
    <div
      v-if="expense_income_info"
      style="border: 1px solid rebeccapurple; padding: 5px; border-radius: 10px"
      class="d-flex align-center mt-3"
    >
      <VRow>
        <VCol cols="12" md="4">
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> مجموعه :</span>
            {{ Total ?? 0 }}
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
        <VChip style="direction: ltr" small color="success" class="font-weight-medium">
          {{ item?.salary ?? 0 }} $
        </VChip>
      </template>
      <template #payable_amount="{ item }">
        <VChip small color="info" class="font-weight-medium">
          {{ item?.salary }}
        </VChip>
      </template>
      <template #remainder="{ item }">
        <VChip small color="error" class="font-weight-medium">
          {{ item.salary - item?.paid }}
        </VChip>
      </template>
      <template #type="{ item }">
        <VChip
          small
          :color="item.type == 'deposit' ? 'info' : 'error'"
          class="font-weight-medium"
        >
          {{ item.type == "deposit" ? "عاید" : "مصرف" }}
        </VChip>
      </template>
      <template #employee_name="{ item }">
        {{ item.employee?.first_name + " " + item.employee?.last_name }}
      </template>
      <template #reminders="{ item }">
        <VChip style="direction: ltr" small color="error" class="font-weight-medium">
          {{ item.remainders?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>
      <template #category_name="{ item }">
        <div style="white-space: nowrap">
          {{ item?.category?.name }}
        </div>
      </template>
      <template #print="{ item }">
        <VBtn variant="text" icon class="font-weight-bold" @click="print(item)">
          <VIcon size="30" icon="mdi-printer" />
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
          <VIcon size="30" icon="mdi-eye-arrow-right" />
        </VBtn>
      </template>
      <template #paid_amount="{ item }">
        <VChip style="direction: ltr" small color="success" class="font-weight-medium">
          {{ item?.payments_sum_amount ?? 0 }} $
        </VChip>
      </template>
      <template #total_price="{ item }">
        <VChip style="direction: ltr" small color="primary" class="font-weight-medium">
          {{ (Number(item?.total_price) ?? 0).toFixed(2) }} $
        </VChip>
      </template>
      <template #total_amount="{ item }">
        <VChip style="direction: ltr" small color="primary" class="font-weight-medium">
          {{ (Number(item?.total_price) ?? 0).toFixed(2) }} $
        </VChip>
      </template>
      <template #purchase_remainder="{ item }">
        <VChip style="direction: ltr" small color="error" class="font-weight-medium">
          {{ item.remainder ?? 0 }} $
        </VChip>
      </template>
      <template #sell_remainder="{ item }">
        <VChip style="direction: ltr" small color="error" class="font-weight-medium">
          {{ item.remainder ?? 0 }} $
        </VChip>
      </template>
      <template #customer_remainders="{ item }">
        <VChip style="direction: ltr" small color="error" class="font-weight-medium">
          {{ (item.total_amount - (item.total_paid ?? 0)).toFixed(2) }} $
        </VChip>
      </template>

      <template #extra_expense_sum_price="{ item }">
        <VChip style="direction: ltr" small color="warning" class="font-weight-medium">
          {{ item.extra_expense_sum_price ?? 0 }} $
        </VChip>
      </template>

      <template #vendor_name="{ item }">
        <div style="white-space: nowrap">
          {{ item?.vendor?.name }}
        </div>
      </template>
      <template #customer_name="{ item }">
        <div style="white-space: nowrap">
          {{ item?.customer?.first_name }}
        </div>
      </template>
      <template #product_name="{ item }">
        <div style="white-space: nowrap">
          {{ item?.product_stock?.product?.product_name }}
        </div>
      </template>
      <!--
        <template #benifit="{ item }">
        <div
        style="white-space: nowrap"
        :class="((item.cost - item.income_price)) > 0 ? 'text-success' : 'text-error'"
        >
        {{ (item.cost - item.income_price).toFixed(2) }} 
        </div>
        </template> 
      -->
      <template #Total_benifit="{ item }">
        <div
          style="white-space: nowrap"
          :class="item.total - item.income_price > 0 ? 'text-success' : 'text-error'"
        >
          {{ (item.total - item.income_price).toFixed(2) }}
        </div>
      </template>
      <template #container_name="{ item }">
        <div style="white-space: nowrap">
          {{ item?.container?.name }}
        </div>
      </template>
      <template #created_b="{ item }">
        {{ item.user?.name }}
      </template>
      <template v-for="i in 1" #ids="{ item }" :key="i">
        {{ i++ }}
      </template>
      <template #products_name="{ item }">
        <div style="white-space: nowrap">
          {{ item?.product?.product_name }}
        </div>
      </template>
      <template #stocks="{ item }">
        <div style="white-space: nowrap">
          {{ item?.stock?.name }}
        </div>
      </template>
      <template #profile="{ item }">
        <VBtn
          variant="plain"
          class="font-weight-bold px-1"
          :loading="profileLoading && selectedId == item.id"
          @click="viewProfile(item)"
        >
          <VIcon size="30" start icon="mdi-eye-arrow-right" />
        </VBtn>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { axios } from "@/plugins/axios-plugin";
import BreadCrumbs from "@/components/commons/BreadCrumbs.vue";
import DataTable from "@/components/commons/DataTable.vue";
import InsertEmployee from "@/views/pages/employee/InsertEmployee.vue";

import usePageConfig from "@/config/pages/report";
import PrintReportDialog from "@/components/commons/PrintReportDialog.vue";
import useRules from "@/plugins/vuelidate/vuelidateRules";
import { useVuelidate } from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import router from "@/router";
import { scope } from "@/@core/utils/index";
import { toast } from "vue3-toastify";

const CaloriesTemplate = defineComponent({
  props: ["data"],
  template: `
      <div>
        {{ data }}
      </div>
    `,
});
const printType = ref();

// const tabs = [
//   { title: 'گزارش', icon: 'mdi-account-group-outline', count: 0, key: 'reports' },
//   { title: 'حذف شده ها', icon: 'mdi-trash', count: 0, key: 'trash' },
// ]
const extra = ref({});
const info = ref({});

const customer_info = ref(false);
const extra_value = ref(false);
const expense_income_info = ref(false);
const extra_profit = ref(false);

const st_balance = ref(0);
const re_balance = ref(0);
const items = [
  { id: "journal", name: "د روزنامچه راپور" },
  { id: "product", name: "د محصولاتو راپور" },
  { id: "purchase", name: "د اخیستل راپور" },
  { id: "sell", name: "د خرڅ راپور" },
  { id: "employee", name: "د کارمندانو راپور" },
  { id: "salaries", name: "د معاشاتو راپور" },
  { id: "income", name: "د عایداتو راپور" },
  { id: "expense", name: "د مصارفاتو راپور" },
  { id: "customers", name: "د پیرودونکي راپور" },
  { id: "product_back", name: "د واپسی راپور" },
  { id: "income_price", name: " د خرڅه مفاد راپور" },

  // { id: 'profit_lost', name: ' د مفاد او ضرر راپور' },
];
const product_headers = [
  {
    title: "شمیره",
    key: "ids",
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
    title: "د محصول نوم",
    key: "product_name",
  },

  {
    title: "د کټګوری نوم",
    key: "category_name",
  },
  {
    title: "کمپنی",
    key: "company_name",
  },
  {
    title: "کود",
    key: "code",
  },
  {
    title: "اندازه",
    key: "quantity",
  },
  {
    title: "رنگ",
    key: "color",
  },
  {
    title: "سایز",
    key: "size",
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
    title: "تفصیل",
    key: "description",
  },
  {
    title: "حالت",
    key: "status",
  },
];

const purchase_headers = [
  {
    title: "#آی دی",
    key: "ids",
  },

  // {
  //   title: 'دیدن بیشتر',
  //   key: 'view_profile',
  // },
  // {
  //   title: 'حالت',
  //   key: 'status',
  // },
  // {
  //   title: 'پرینت',
  //   key: 'print',
  // },

  {
    title: "د کانټینر نوم",
    key: "container_name",
  },

  {
    title: " دعرضه کونکی نوم",
    key: "vendor_name",
  },

  {
    title: "ټول نور لګښتونه",
    key: "extra_expense_sum_price",
    width: "140px",
  },
  {
    title: "د قیمت مجموعه",
    key: "total_price",
    width: "100px",
  },
  {
    title: "وصول شوی مقدار",
    key: "paid_amount",
    width: "130px",
  },
  {
    title: "پاتي",
    key: "purchase_remainder",
    width: "180px",
  },

  {
    title: "تفصیل",
    key: "description",
  },
  {
    title: "د ثبت نیټه",
    key: "created_at",
  },
];
const sell_headers = [
  {
    title: "#آی دی",
    key: "ids",
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
    title: "پیریدونکي نوم",
    key: "customer_name",
  },

  {
    title: "د قیمت مجموعه",
    key: "total_price",
    width: "100px",
  },
  {
    title: "وصول شوی مقدار",
    key: "paid_amount",
    width: "130px",
  },
  {
    title: "پاتې",
    key: "sell_remainder",
    width: "180px",
  },

  {
    title: "تفصیل",
    key: "description",
  },
  {
    title: "د ثبت نیټه",
    key: "sell_date",
  },
];
const journal_headers = [
  {
    title: "آی دی#",
    key: "ids",
  },
  {
    title: "نوم",
    key: "name",
  },

  {
    title: "نوعیت",
    key: "type",
    width: "160px",
  },

  {
    title: "اندازه",
    key: "amount",
    width: "140px",
  },

  {
    title: "ثبت شوی په واسطه د",
    key: "created_b",
    width: "120px",
  },

  {
    title: "نیټه",
    key: "created_at",
  },
];
const Employee_header = [
  {
    title: "شمیره",
    key: "ids",
  },
  {
    title: "نوم",
    key: "first_name",
  },
  {
    title: "تخلص",
    key: "last_name",
  },
  {
    title: "ایمیل",
    key: "email",
  },
  {
    title: "د وظیفی عنوان",
    key: "job_title",
    width: "100px",
  },

  {
    title: "تیلفون شمیره",
    key: "phone_number",
  },
  {
    title: "اوسنۍ پته",
    key: "current_address",
    width: "180px",
  },
  {
    title: "دایمی پته",
    key: "permenent_address",
    width: "180px",
  },
  {
    title: "پیل نیټه",
    key: "created_at",
    width: "130px",
  },

  {
    title: "معاش",
    key: "salary",
  },
];
const salary_header = [
  {
    title: "شمیره",
    key: "ids",
    width: "80px",
  },
  {
    title: "د کارکوونکی نوم",
    key: "employee_name",
  },
  {
    title: "وظیفه",
    key: "position",
  },
  {
    title: "د معاش اندازه",
    key: "salary",
  },
  {
    title: "د ورکړې وړ",
    key: "payable_amount",
  },
  {
    title: "د ورکړې اندازه",
    key: "paid",
  },
  {
    title: "د حاضرو تعداد",
    key: "present",
  },
  {
    title: "د غیرحاضرو تعداد",
    key: "absent",
  },
  {
    title: "پاتې معاش",
    key: "remainder",
  },
  {
    title: "د تادیې نیټه",
    key: "created_at",
  },
];
const incoming_header = [
  {
    title: "#آی دی",
    key: "ids",
  },
  {
    title: "تفصیل",
    key: "name",
  },
  {
    title: "اندازه",
    key: "amount",
    width: "140px",
  },
  {
    title: "نیټه",
    key: "created_at",
  },
];
const customer_header = [
  {
    title: "شمیره",
    key: "ids",
  },

  // {
  //   title: 'View More',
  //   key: 'profile',
  // },

  {
    title: "نوم",
    key: "first_name",
  },

  // {
  //   title: "تخلص",
  //   key: "last_name",
  // },

  {
    title: "د پیسو مجموعه",
    key: "total_amount",
  },

  {
    title: "ټول وصول شوي",
    key: "total_paid",
  },

  {
    title: "پاتې",
    key: "customer_remainders",
  },
  {
    title: "تیلفون شمیره",
    key: "phone_number",
  },
  {
    title: "ایمیل",
    key: "email",
  },
  {
    title: "پټه",
    key: "address",
  },
  {
    title: "تفصیل",
    key: "description",
  },
];
const product_back_headers = [
  {
    title: "#آی دی",
    key: "id",
  },
  {
    title: "# دبل نمبر",
    key: "bill_id",
  },
  {
    title: "د محصول نوم",
    key: "products_name",
  },
  {
    title: "د پیرودونکي نوم",
    key: "customer_name",
  },
  {
    title: "ګدام ",
    key: "stocks",
  },

  {
    title: " دکارتن اندازه",
    key: "quantity",
    width: "140px",
  },

  {
    title: " دپیسو مجموعه",
    key: "price",
  },
  {
    title: " د تفصیلات",
    key: "description",
  },
  {
    title: "نیټه",
    key: "created_at",
  },
];
const Income_price_headers = [
  {
    title: "آی دی#",
    key: "ids",
  },
  {
    title: "د محصول نوم",
    key: "product_name",
  },
  {
    title: "د پیردونکی نوم",
    key: "customer_name",
  },
  {
    title: "دکارتن تعداد",
    key: "carton_quantity",
    width: "160px",
  },

  {
    title: "قیمت",
    key: "cost",
    width: "160px",
  },

  {
    title: " د تمام شد قیمت",
    key: "income_price",
    width: "160px",
  },

  {
    title: "مجموعه",
    key: "total",
    width: "160px",
  },
  {
    title: " مجموعه مفاد  ",
    key: "Total_benifit",
    width: "160px",
  },
  {
    title: "نیټه",
    key: "created_at",
    width: "160px",
  },
];
const { tabs, headers, breadCrumbs, search } = usePageConfig();

const apiLoading = ref(false);
const expand = ref(false);
const searchOption = ref({});
const show = ref(false);
const printLoading = ref(false);
const headerss = ref([]);
const printData = ref([]);
const printRefs = ref();
const title = ref("");
const total = ref(0);
const Total = ref(0);
const TotalProfit = ref(0);
const Categories = ref([]);
const loadingCategory = ref(false);
const TypeFlag = ref(false);

const total_amount_sell = ref(0);
const total_paid_sell = ref(0);
const total_reminder_purchase = ref(0);
const total_amount_income_usd = ref(0);
const total_expense_usd = ref(0);
const balance = ref(0);
const options = ref({ itemsPerPage: 20, page: 1, tab: "reports" });
const reports = ref([]);
const datatableRefs = ref();
const extraTotal = ref({});
const employeeRef = ref();
const profileLoading = ref(false);
const selectedId = ref(null);
const payload = ref({
  start_date: new Date(),
  end_date: new Date(),
  type: null,
  category_id: null,
  printType: options.value.tab,
});
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const validationRules = useRules.validate;

const rules = {
  start_date: { required },
  end_date: { required },
  type: { required },
};

const v$ = useVuelidate(rules, payload);
const confirm = (res) => {
  if (res) {
    emit("confirm", type.value);
  }
  show.value = false;
};

// async function getCategory() {
//   try {
//     loadingCategory.value = true;
//     const { data } = await axios.get("expense-income-category-list");

//     Categories.value = data;
//   } catch (error) {
//     console.error("error", error);
//   }
//   loadingCategory.value = false;
// }
const TakeReport = (type) => {
  show.value = true;

  // getCategory();
};
const closeReset = (type) => {
  show.value = false;
  getReport();
};
const showData = (value) => {
  if (value == "expense" || value == "income") {
    TypeFlag.value = true;
  } else {
    TypeFlag.value = false;
  }
  loadingCategory.value = true;
  axios.get("expense-income-category/" + value).then(function (response) {
    console.log("re", response);
    Categories.value = response.data;
  });
  loadingCategory.value = false;
};
const getReport = async () => {
  if (
    payload.value.start_date == null ||
    payload.value.end_date == null ||
    payload.value.type == null
  ) {
    toast.error("مهربانۍ وګړی فورم صحیح ډک کړئ");

    return false;
  }

  if (payload.value.type == "product") {
    headerss.value = product_headers;
  }
  if (payload.value.type == "purchase") {
    headerss.value = purchase_headers;
  }
  if (payload.value.type == "sell") {
    headerss.value = sell_headers;
  }
  if (payload.value.type == "salaries") {
    headerss.value = salary_header;
    title.value = "د معاشاتو راپور";
  }
  if (payload.value.type == "employee") {
    headerss.value = Employee_header;
    title.value = "د کارکوونکو راپور";
  }
  if (payload.value.type == "income" || payload.value.type == "expense") {
    headerss.value = incoming_header;
  }
  if (payload.value.type == "customers") {
    headerss.value = customer_header;
  }
  if (payload.value.type == "journal") {
    headerss.value = journal_headers;
  }
  if (payload.value.type == "product_back") {
    headerss.value = product_back_headers;
  }
  if (payload.value.type == "income_price") {
    headerss.value = Income_price_headers;
  }
  if (payload.value.type == "profit_lost") {
  }
  try {
    apiLoading.value = true;
    printLoading.value = true;
    let { data } = await axios.get("get_report", {
      params: { ...options.value, ...payload.value },
    });
    show.value = false;
    reports.value = data.data;

    total.value = data.total;
    extraTotal.value = data.extraTotal;
    extra_profit.value = data.extra_profit;
    customer_info.value = false;
    if (data.customer_info) {
      total_amount_sell.value = data.customer_info.total_amount;
      total_paid_sell.value = data.customer_info.total_paid;
      total_reminder_purchase.value = data.customer_info.total_reminder;

      customer_info.value = true;
      extra_value.value = false;
    }
    if (data.expense_income_info) {
      Total.value = data.expense_income_info.total_amount;

      expense_income_info.value = true;
      customer_info.value = false;
      customer_info.value = false;
      extra_value.value = false;
    }
    extra.value = data.extra;
    info.value = data.info;
    extra_profit.value = data.extra_profit;

    if (data.extra_profit) {
      TotalProfit.value = data.extra_profit.total_profit;
      customer_info.value = false;
      expense_income_info.value = false;
      customer_info.value = false;
      extra_value.value = false;
      extra_profit.value = true;
    }

    // let total_profit = 0;
    // data.data.forEach((element) => {
    //   total_profit += element.total - element.income_price;
    // });
    // console.log(total_profit);
    if (data.extra) {
      const total_income = parseFloat(data.extra.total_amount_income_usd);
      const total_expense = parseFloat(data.extra.total_expense_usd);

      total_amount_income_usd.value = total_income.toFixed(2);
      total_expense_usd.value = total_expense.toFixed(2);
      balance.value = (total_income - total_expense).toFixed(2);
      customer_info.value = false;
      extra_value.value = true;
    }
  } catch (error) {
    console.error("error", error);
  }
  apiLoading.value = false;
  printLoading.value = false;
};
const print = async () => {
  if (
    payload.value.start_date == null ||
    payload.value.end_date == null ||
    payload.value.type == null
  ) {
    toast.error("مهربانۍ وګړی فورم صحیح ډک کړئ");

    return false;
  }
  try {
    if (payload.value.type == "income") {
      headerss.value = incoming_header;
      title.value = "د عایداتو راپور";
    }

    if (payload.value.type == "expense") {
      headerss.value = incoming_header;
      title.value = "د مصرفونو راپور";
    }
    if (payload.value.type == "employee ") {
      headerss.value = Employee_header;
      title.value = "Employee Report";
    }
    if (payload.value.type == "salaries") {
      headerss.value = salary_header;
      title.value = "د معاشاتو راپور";
    }
    if (payload.value.type == "customers") {
      headerss.value = customer_header;
      title.value = "د پیرودونکي راپور";
    }
    if (payload.value.type == "income") {
      headerss.value = incoming_header;
      title.value = "Income Report";
    }

    if (payload.value.type == "expense") {
      headerss.value = incoming_header;
      title.value = "Expense Report";
    }
    if (payload.value.type == "customers") {
      headerss.value = customer_header;
      title.value = "د پیرودونکي راپور";
    }
    if (payload.value.type == "product") {
      headerss.value = product_headers;
      title.value = "د محصولاتو راپور";
    }
    if (payload.value.type == "purchase") {
      headerss.value = purchase_headers;
      title.value = "د پیرود راپور";
    }
    if (payload.value.type == "sell") {
      headerss.value = sell_headers;
      title.value = "د خرڅ راپور";
    }
    if (payload.value.type == "journal") {
      headerss.value = journal_headers;
      title.value = " د روزنامچه راپور";
    }
    if (payload.value.type == "income_price") {
      headerss.value = Income_price_headers;
    }
    if (payload.value.type == "product_back") {
      headerss.value = product_back_headers;
      title.value = " د واپسی راپور";
    }
    let { data } = await axios.get("reports", { params: { ...payload.value } });
    console.log("my data", data);
    printData.value = data;
    await sleep(1);
    const printable = window.open("", "_blank");
    printable.document.write(
      '<html style="direction:rtl"><head><style>@page { size: A4 landscape }</style>'
    );
    printable.document.write("</head><body>");
    printable.document.write(printRefs.value.$el.innerHTML);
    printable.document.write("</body></html>");
    printable.document.close();
    printable.print();
    await sleep(1);

    printable.close();
  } catch (error) {
    console.error("error", error);
  }
  printLoading.value = false;
};
const searchRecord = (data) => {
  searchOption.value = data;
  options.value = { ...options.value, ...data };
  getReport();
};

const onTableChange = (value) => {
  console.log("test", value);

  options.value = value;
  getReport();
};

onMounted(() => {
  // getReport()
});
</script>

<route lang="yaml">
meta:
  auth: true
</route>
