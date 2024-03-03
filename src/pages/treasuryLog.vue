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
      page="د روزنامچه لست"
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
      v-if="totalInfo"
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
            <span class="d-inline-block pe-1"> موجودی : </span>
            {{ balance ?? 0 }}
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
      <template #type="{ item }">
        <VChip
          small
          :color="item.type == 'deposit' ? 'info' : 'error'"
          class="font-weight-medium"
        >
          {{ item.type == "deposit" ? "عاید" : "مصرف" }}
        </VChip>
      </template>
      <template #amount="{ item }">
        <VChip
          small
          style="direction: ltr"
          :color="item.type == 'deposit' ? 'success' : 'error'"
          class="font-weight-medium"
        >
          {{ item.amount ? item.amount : 0 }}
          {{ item.currency == "AFN" ? "AFN" : "" || item.currency == "USD" ? "$" : "" }}
        </VChip>
      </template>

      <template #name="{ item }">
        <p class="font-weight-medium" style="white-space: nowrap">
          {{ item.name }}
        </p>
      </template>
      <template #created_at="{ item }">
        {{ moment(item.created_at, "YYYY-MM-DD").format("ll") }}
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

import usePageConfig from "@/config/pages/treasuryLog";
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
    const { data } = await axios.get("treasury-log", { params: options.value });
    tableRecords.value = data.data;
    total.value = data.total;
    extraTotal.value = data.extraTotal;
    totalInfo.value = data.extra;
    const total_income = parseFloat(data.extra.total_amount_income_usd);
    const total_expense = parseFloat(data.extra.total_expense_usd);

    total_amount_income_usd.value = total_income.toFixed(2);
    total_expense_usd.value = total_expense.toFixed(2);
    balance.value = (total_income - total_expense).toFixed(2);
  } catch (error) {}
  apiLoading.value = false;
};

const options = ref({ page: 1, itemPerPage: 20, tab: "treasuryLog" });
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
