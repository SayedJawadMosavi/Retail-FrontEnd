<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="د اخیستل لست"
      create-text="زیاتول "
      print-text="پرنت"
      page-icon="mdi-shopping-outline"
      :show-create="scope(['purchase_create'])"
      :show-delete="scope(['purchase_delete'])"
      :show-restore="scope(['purchase_restore'])"
      :show-force-delete="scope(['purchase_force_delete'])"
      @on-create="createPurchase"
      @on-force-delete="deleteRecord('force-delete')"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
      @on-print="printRecord"
    >
      <template #default>
        <VBtn class="font-weight-bold bg-info" to="container">
          کانټینر
          <VIcon end icon="mdi-export" />
        </VBtn>
      </template>
    </BreadCrumbs>
    <div
      style="border: 1px solid rebeccapurple; padding: 5px; border-radius: 10px"
      class="d-flex align-center"
    >
      <VRow>
        <VCol cols="12" md="4">
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> د قیمت مجموعه :</span>
            {{ total_amount_purchase ?? 0 }}
          </div>
        </VCol>
        <VCol cols="12" md="4">
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> د وصول مجموعه:</span>
            {{ total_paid_purchase ?? 0 }}
          </div>
        </VCol>
        <VCol cols="12" md="4">
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> پاتي مجموعه :</span>
            {{ total_reminder_purchase ?? 0 }}
          </div>
        </VCol>
      </VRow>
    </div>
    <AddPurchase ref="pruchaseRef" :fetch-record="fetchRecord" />

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
      <template #paid_amount="{ item }">
        <VChip style="direction: ltr" small color="success" class="font-weight-medium">
          {{ item?.payments_sum_amount ?? 0 }} $
        </VChip>
      </template>
      <template #total_price="{ item }">
        <VChip style="direction: ltr" small color="primary" class="font-weight-medium">
          {{ item.total_price?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>
      <template #remainder="{ item }">
        <VChip style="direction: ltr" small color="error" class="font-weight-medium">
          {{ item.remainder?.toFixed(2) ?? 0 }} $
        </VChip>
      </template>

      <template #extra_expense_sum_price="{ item }">
        <VChip style="direction: ltr" small color="warning" class="font-weight-medium">
          {{ item.extra_expense_sum_price ?? 0 }} $
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
      <template #status="{ item }">
        <VBtn
          v-if="item.status == 'pending'"
          variant="text"
          icon
          :loading="selectedItemStatus.id == item.id && statusLoading"
          @click="openDialogs(item)"
        >
          <VTooltip activator="parent" location="top"> رسید شوی نده </VTooltip>
          <VIcon
            size="30"
            :class="item.status == 'recieved' ? 'primary' : 'info'"
            icon="mdi-send-check-outline"
          />
        </VBtn>
        <VBtn v-else variant="text" icon>
          <VTooltip activator="parent" location="top"> رسید </VTooltip>
          <VIcon size="30" color="success" icon="mdi-check" />
        </VBtn>
      </template>
      <template #description="{ item }">
        <div style="white-space: nowrap">
          {{ item.description }}
        </div>
      </template>
      <template #vendor_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.vendor.name }}
        </div>
      </template>
      <template #container_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.container.name }}
        </div>
      </template>
    </DataTable>
    <PurchasePrint ref="printableContent" :print-item="printItem" />
    <!-- <PurchasePrint2 /> -->
  </div>
</template>

<script setup>
import AddPurchase from "@/views/pages/purchase/AddPurchase.vue";
import { onMounted, ref } from "vue";
import { axios } from "@/plugins/axios-plugin";
import BreadCrumbs from "@/components/commons/BreadCrumbs.vue";
import DataTable from "@/components/commons/DataTable.vue";
import usePageConfig from "@/config/pages/purchase";
import router from "@/router";
import PurchasePrint from "@/views/pages/purchase/PurchasePrint.vue";
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
const { tabs, headers, breadCrumbs, search } = usePageConfig();
const total = ref(0);
const total_amount_purchase = ref(0);
const total_paid_purchase = ref(0);
const total_reminder_purchase = ref(0);
const extraTotal = ref({});
const pruchaseRef = ref();
const apiLoading = ref(false);
const datatableRefs = ref();
const printItem = ref({});
const printableContent = ref();
const selectedItemStatus = ref({});
const statusLoading = ref(false);
const options = ref({ page: 1, itemPerPage: 20, tab: "purchases" });
const searchOption = ref({});
const tableRecords = ref([]);
const profileLoading = ref(false);
const selectedId = ref(null);
const printType = ref();
const printLoading = ref(false);
const show = ref(false);
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

    const { data } = await axios.get("purchase/" + id);

    // apiLoading.value = false

    return data;
  } catch (error) {
    return null;
  }
};

const createPurchase = () => {
  pruchaseRef.value.openDialog();
};

const viewProfile = async (item) => {
  profileLoading.value = true;
  selectedId.value = item.id;

  await router.replace("view-purchase/" + item.id);
  profileLoading.value = false;
};

const validationRules = useRules.validate;

const openDialogs = (item) => {
  console.log("items", item);
  printType.value = options.value.tab;
  payload.value = {
    amount: new Date(),
    product_id: null,
  };
  show.value = true;
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

const deleteRecord = async (type = "purchase_delete") => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map((row) => row.id) ?? [];
    await axios.delete(`${type}/purchase/${ids}`);
    datatableRefs.value.selectedItems = [];
    fetchRecord();
  } catch (error) {
    console.error(error);
  }
};
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map((row) => row.id) ?? [];
    await axios.post("restore_purchase/purchase/" + ids);
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
    const { data } = await axios.get("purchase", { params: options.value });
    tableRecords.value = data.data;
    total.value = data.total;
    extraTotal.value = data.extraTotal;
    let total_purchase = 0;
    let total_paid = 0;
    let total_remain = 0;
    data.data.forEach((element) => {
      console.log("ee", element.payments_sum_amount);
      total_purchase += parseFloat(element.items_sum_total);
      if (element.payments_sum_amount != null) {
        total_paid += parseFloat(element.payments_sum_amount);
      }
    });
    total_amount_purchase.value = parseFloat(total_purchase).toFixed(2);
    total_paid_purchase.value = parseFloat(total_paid).toFixed(2);
    total_reminder_purchase.value = parseFloat(total_purchase - total_paid).toFixed(2);
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
  import AddPurchase from '@/views/pages/order/AddPurchase.vue'
  
  export default {
  components: {
  AddPurchase,
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
