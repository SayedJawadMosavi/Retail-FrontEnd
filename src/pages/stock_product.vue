<template>
  <div>
    <ReportDialog ref="reportRefs" />

    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="د ګدام د محصولاتو لست "
      icon="mdi-shopping-outline"
      :show-create="scope(['not_create'])"
      :show-delete="scope(['not_delete'])"
      @on-search="searchRecord"
    >
      <template #default />
    </BreadCrumbs>

    <div
      style="border: 1px solid rebeccapurple; padding: 5px; border-radius: 10px"
      class="d-flex align-center mt-3"
    >
      <VRow>
        <VCol cols="12" md="4">
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> دکارتن تعداد:</span>
            {{ carton_total ?? 0 }}
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
      :extra-data="extra_data"
      @table-change="onTableChange($event)"
    >
      <template #products_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.product.product_name }}
        </div>
      </template>
      <template #per_carton_cost="{ item }">
        <div style="white-space: nowrap">
          {{ item.product.per_carton_cost }}
        </div>
      </template>
      <template #stocks_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.stock.name }}
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

import usePageConfig from "@/config/pages/stock_product";
import { scope } from "@/@core/utils/index";

const { tabs, headers, breadCrumbs, search } = usePageConfig();
const total = ref(0);
const carton_total = ref(0);
const extraTotal = ref({});
const searchOption = ref({});
const apiLoading = ref(false);

const formRef = ref();
const extra_data = ref({});
const datatableRefs = ref();
const reportRefs = ref();

const TakeReport = () => {
  reportRefs.value.showPrintConfirm(options.value.tab);
};
const searchRecord = (data) => {
  searchOption.value = data;
  options.value = { ...options.value, ...data };
  fetchRecord();
};

const fetchRecord = async () => {
  try {
    apiLoading.value = true;
    datatableRefs.value.selectedItems = [];
    const { data } = await axios.get("product_stocks", { params: options.value });
    tableRecords.value = data.data;
    data.data.forEach((element) => {
      carton_total.value += parseFloat(element.carton_quantity);
    });
    total.value = data.total;
    extraTotal.value = data.extraTotal;
  } catch (error) {}
  apiLoading.value = false;
};

const options = ref({ page: 1, itemPerPage: 20, tab: "product_stocks" });
const tableRecords = ref([]);

const onTableChange = (value) => {
  options.value = value;
  fetchRecord();
};

onMounted(() => {
  fetchRecord();
});
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
