<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="د خرڅ لست"
      create-text="خرڅ "
      print-text="پرینت"
      page-icon="mdi-shopping-outline"
      :show-create="scope(['sell_create'])"
      :show-delete="scope(['sell_delete'])"
      :show-restore="scope(['sell_restore'])"
      :show-force-delete="scope(['sell_force_delete'])"
      @on-create="sellProduct"
      @on-force-delete="deleteRecord('force-delete')"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
      @on-print="printRecord"
    />

    <SellProduct ref="pruchaseRef" :fetch-record="fetchRecord" />

    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:extra-total="extraTotal"
      v-model:loading="apiLoading"
      :tabs="tabs"
      :headers="headers"
      :items="tableRecords"
      @table-change="onTableChange($event)"
    >
      <template #total_paid="{ item }">
        <VChip style="direction: ltr" small color="success" class="font-weight-medium">
          {{ item?.total_paid ?? 0 }} $
        </VChip>
      </template>
      <template #total_amount="{ item }">
        <VChip style="direction: ltr" small color="primary" class="font-weight-medium">
          {{ item?.total_amount ?? 0 }} $
        </VChip>
      </template>
      <template #remainder="{ item }">
        <VChip style="direction: ltr" small color="error" class="font-weight-medium">
          {{ item?.total_amount - item?.total_paid ?? 0 }} $
        </VChip>
      </template>

      <template #view_profile="{ item }">
        <VBtn
          variant="text"
          icon
          :loading="profileLoading && selectedId == item.id"
          @click="viewProfile(item)"
        >
          <VIcon size="30" icon="mdi-eye-arrow-right" />
        </VBtn>
      </template>
      <template #print="{ item }">
        <VBtn variant="text" icon class="font-weight-bold" @click="print(item)">
          <VIcon size="30" icon="mdi-printer" />
        </VBtn>
      </template>

      <template #customer_name="{ item }">
        <div style="white-space: nowrap">
          {{
            item?.customer?.type == null ? item?.customer?.first_name : item.walkin_name
          }}
        </div>
      </template>
    </DataTable>
    <SellPrint ref="printableContent" :print-item="printItem" />
    <!-- <PurchasePrint2 /> -->
  </div>
</template>

<script setup>
import SellProduct from "@/views/pages/sell/SellProduct.vue";
import { onMounted, ref } from "vue";
import { axios } from "@/plugins/axios-plugin";
import BreadCrumbs from "@/components/commons/BreadCrumbs.vue";
import DataTable from "@/components/commons/DataTable.vue";
import usePageConfig from "@/config/pages/sell";
import router from "@/router";
import SellPrint from "@/views/pages/sell/sellPrint.vue";
import { scope } from "@/@core/utils/index";

const { tabs, headers, breadCrumbs, search } = usePageConfig();
const total = ref(0);
const remainder = ref(0);
const extraTotal = ref({});
const pruchaseRef = ref();
const apiLoading = ref(false);
const datatableRefs = ref();
const printItem = ref({});
const printableContent = ref();
const selectedItemStatus = ref({});
const statusLoading = ref(false);
const options = ref({ page: 1, itemPerPage: 20, tab: "sells" });
const searchOption = ref({});
const tableRecords = ref([]);
const profileLoading = ref(false);
const selectedId = ref(null);

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const print = async (item) => {
  try {
    let res = await getOrderInfo(item.id);
    printItem.value = res;
    await sleep(1);
    const printable = window.open("", "_blank");
    printable.document.write("<html><head><style>@page {size: A5}</style>");
    printable.document.write("</head><body>");
    printable.document.write(printableContent.value.$el.innerHTML);
    printable.document.write("</body></html>");
    printable.document.close();
    printable.print();
    await sleep(1);
    printable.close();
  } catch (error) {
    console.error("error", error);
  }
};

const getOrderInfo = async (id) => {
  try {
    // apiLoading.value = true

    const { data } = await axios.get("sell/" + id);

    // apiLoading.value = false

    return data;
  } catch (error) {
    return null;
  }
};

const sellProduct = () => {
  pruchaseRef.value.openDialog();
};

const viewProfile = async (item) => {
  profileLoading.value = true;
  selectedId.value = item.id;

  await router.replace("view-sell/" + item.id);
  profileLoading.value = false;
};
const checkStatus = async (item) => {
  try {
    selectedItemStatus.value = item;
    statusLoading.value = true;
    const { data } = await axios.get(`checkStatus/${item.id}`);
    fetchRecord();
  } catch (error) {
    console.error(error);
  }
  statusLoading.value = false;
};

const onTableChange = (value) => {
  options.value = value;

  fetchRecord();
};

const deleteRecord = async (type = "delete") => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map((row) => row.id) ?? [];
    await axios.delete(`${type}/sell/${ids}`);
    datatableRefs.value.selectedItems = [];
    fetchRecord();
  } catch (error) {
    console.error(error);
  }
};
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map((row) => row.id) ?? [];
    await axios.post("restore/sell/" + ids);
    datatableRefs.value.selectedItems = [];
    fetchRecord();
  } catch (error) {
    console.error(error);
  }
};
const searchRecord = (data) => {
  searchOption.value = data;
  options.value = { ...options.value, ...data };
  fetchRecord();
};
const printRecord = () => {};
const fetchRecord = async () => {
  try {
    apiLoading.value = true;
    const { data } = await axios.get("sell", { params: options.value });
    tableRecords.value = data.data;
    total.value = data.total;
    extraTotal.value = data.extraTotal;
  } catch (error) {
    console.error("datatable", error);
  }
  apiLoading.value = false;
};

onMounted(() => {
  fetchRecord();
});
</script>

<!--
  <script>
  import SellProduct from '@/views/pages/order/SellProduct.vue'
  
  export default {
  components: {
  SellProduct,
  },
  }
  </script> 
-->

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
