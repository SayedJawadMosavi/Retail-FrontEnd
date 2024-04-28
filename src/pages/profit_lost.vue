<template>
  <div>
    <VDialog v-model="show" transition="dialog-top-transition" persistent width="auto">
      <VCard width="auto" title="د راپور ترتیبول">
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
                    :offset="-190"
                  />
                </span>
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
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn color="secondary" @click="show = false"> کینسل </VBtn>

          <VBtn ripple color="primary" variant="tonal" @click="getReport">
            د راپور ترتیبول
            <VIcon icon="mdi-export" end />
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <ReportDialog ref="reportRefs" />

    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="د مفاد اوضرر لست"
      icon="mdi-shopping-outline"
      :show-create="scope(['test_create'])"
      :show-delete="scope(['test_delete'])"
      :show-restore="scope(['test_restore'])"
      :show-force-delete="scope(['test_force_delete'])"
      @on-create="createInecome"
      @on-delete="deleteRcord"
      @on-force-delete="deleteRecord('force-delete')"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    >
      <template #default>
        <!--
          <VBtn
          v-if="options.tab != 'trash'"
          class="font-weight-bold ml-2"
          @click="TakeReport"
          >
          پرینت
          <VIcon
          end
          icon="mdi-printer"
          />
          </VBtn>
          <VBtn
          v-if="options.tab != 'trash'"
          class="font-weight-bold bg-info"
          @click="openDialogs"
          >
          راپور
          <VIcon
          end
          icon="mdi-export"
          />
          </VBtn> 
        -->
      </template>
    </BreadCrumbs>

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
    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:loading="apiLoading"
      v-model:extra-total="extraTotal"
      v-model:items="tableRecords"
      :tabs="tabs"
      :headers="headers"
      :total-info="totalInfo"
      @table-change="onTableChange($event)"
    >
      <template #created_by="{ item }">
        {{ item.user?.name }}
      </template>
      <template #customer_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.customer.first_name }}
        </div>
      </template>
      <template #product_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.product_stock.product.product_name }}
        </div>
      </template>
      <!--
        <template #income_price="{ item }">
        <div style="white-space: nowrap">
        {{ (item?.carton_quantity*item?.income_price).toFixed(2) }}
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
    </DataTable>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { axios } from "@/plugins/axios-plugin";
import BreadCrumbs from "@/components/commons/BreadCrumbs.vue";
import DataTable from "@/components/commons/DataTable.vue";
import ReportDialog from "@/components/commons/ReportDialog.vue";

import usePageConfig from "@/config/pages/profit_lost";
import { scope } from "@/@core/utils/index";
import {
  required,
  numeric,
  minLength,
  maxLength,
  minValue,
  maxValue,
  email,
  helpers,
} from "@vuelidate/validators";
import useRules from "@/plugins/vuelidate/vuelidateRules";
import { useVuelidate } from "@vuelidate/core";
import moment from "moment";
const { tabs, headers, breadCrumbs, search } = usePageConfig();
const total = ref(0);
const total_amount_income_usd = ref(0);
const total_expense_usd = ref(0);
const balance = ref(0);
const extraTotal = ref({});
const searchOption = ref({});
const apiLoading = ref(false);
const show = ref(false);
const extra_profit = ref({});
const TotalProfit = ref(0);

const incomeRefs = ref();
const totalInfo = ref({});
const datatableRefs = ref();
const reportRefs = ref();
const printType = ref();
const printLoading = ref(false);

const payload = ref({
  start_date: new Date(),
  end_date: new Date(),
});

const rules = {
  start_date: { required },
  end_date: { required },
};
const $v = useVuelidate(rules, payload);

const validationRules = useRules.validate;
const TakeReport = () => {
  reportRefs.value.showPrintConfirm(options.value.tab);
};
const searchRecord = (data) => {
  searchOption.value = data;
  options.value = { ...options.value, ...data };
  fetchRecord();
};

const openDialogs = (type) => {
  printType.value = options.value.tab;
  payload.value = {
    start_date: new Date(),
    end_date: new Date(),
  };
  show.value = true;
};
const fetchRecord = async () => {
  try {
    apiLoading.value = true;
    datatableRefs.value.selectedItems = [];
    const { data } = await axios.get("get_profit_lost", { params: options.value });

    tableRecords.value = data.data;
    total.value = data.total;
    extraTotal.value = data.extraTotal;
    extra_profit.value = data.extra_profit;

    // let total_profit = 0;
    // data.data.forEach((element) => {
    //   total_profit += element.total - element.income_price;
    // });
    // console.log(total_profit);
    TotalProfit.value = data.extra_profit.total_profit;
  } catch (error) {}
  apiLoading.value = false;
};

const options = ref({ page: 1, itemPerPage: 20, tab: "profit_lost" });
const tableRecords = ref([]);

const createInecome = () => {
  if (datatableRefs.value?.selectedItems?.length == 1) {
    incomeRefs.value.openDialog(datatableRefs.value?.selectedItems[0]);

    return;
  }
  incomeRefs.value.openDialog();
};

const onTableChange = (value) => {
  options.value = value;
  fetchRecord();
};

const getReport = async () => {
  if (payload.value.start_date == null || payload.value.end_date == null) {
    toast.error("مهربانی وکړې فورم صحیح ډک کړئ!");

    return false;
  }
  try {
    printLoading.value = true;
    let { data } = await axios.get("treasury_log_reports", {
      params: { options: options.value, type: printType.value, ...payload.value },
    });
    tableRecords.value = data.data;
    total.value = data.total;
    extraTotal.value = data.extraTotal;
    totalInfo.value = data.extra;
    show.value = false;
  } catch (error) {
    console.error("error", error);
  }
  printLoading.value = false;
};
onMounted(() => {
  fetchRecord();
});
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map((row) => row.id) ?? [];
    await axios.post("restore-incoming-outgoing/" + ids);
    datatableRefs.value.selectedItems = [];
    fetchRecord();
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss">
.expand-card {
  height: 300px !important;
}
</style>

<style>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.5s ease-out;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}
</style>

<route lang="yaml">
meta:
  auth: true
</route>
