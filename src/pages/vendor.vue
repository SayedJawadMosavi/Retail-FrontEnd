<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="د سوداګرو لست"
      icon="mdi-people"
      create-text="نوی سوداګر"
      edit-text="د سوداګر ایدیت"
      :show-create="scope(['vendor_create'])"
      :show-delete="scope(['not_vendor_delete'])"
      :show-restore="scope(['not_vendor_restore'])"
      :show-force-delete="scope(['not_vendor_force_delete'])"
      @on-force-delete="deleteRecord('force-delete')"
      @on-create="createVendor"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
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
            <span class="d-inline-block pe-1"> مجموعه:</span>
            {{ total_amount_purchase ?? 0 }}
          </div>
        </VCol>
        <VCol cols="12" md="4">
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> وصول شوی :</span>

            {{ typeof total_paid_purchase ? total_paid_purchase : 0 }}
          </div>
        </VCol>
        <VCol cols="12" md="4">
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1"> پاتی :</span>

            {{ total_reminder_purchase ?? 0 }}
          </div>
        </VCol>
      </VRow>
    </div>
    <InsertVendor ref="vendorRef" :fetch-record="fetchRecord" />

    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:loading="apiLoading"
      v-model:extra-total="extraTotal"
      :tabs="tabs"
      :headers="headers"
      :items="vendors"
      @table-change="onTableChange($event)"
    >
      <template #status="{ item }">
        <VBtn
          v-if="item.status == 0"
          variant="text"
          icon
          :loading="selectedItemStatus.id == item.id && statusLoading"
          @click="changeStatus(item)"
        >
          <VTooltip activator="parent" location="top"> فعال کول </VTooltip>
          <VIcon
            size="30"
            :color="item.status == 0 ? 'error' : 'success'"
            icon="mdi-close-thick"
          />
        </VBtn>
        <VBtn v-else variant="text" icon @click="changeStatus(item)">
          <VTooltip activator="parent" location="top"> غیرفعال </VTooltip>
          <VIcon size="30" color="success" icon="mdi-check" />
        </VBtn>
      </template>
      <template #print="{ item }">
        <VBtn
          variant="text"
          icon
          class="font-weight-bold"
          :loading="printLoading && selectedItemStatus.id == item.id"
          @click="print(item)"
        >
          <VIcon size="30" icon="mdi-printer" />
        </VBtn>
      </template>
      <template #paid_amount="{ item }">
        <VChip style="direction: ltr" small color="success" class="font-weight-medium">
          {{ (Number(item?.total_paid) ?? 0).toFixed(2) }} $
        </VChip>
      </template>
      <template #total_prices="{ item }">
        <VChip style="direction: ltr" small color="primary" class="font-weight-medium">
          {{ (Number(item?.total_amount) ?? 0).toFixed(2) }} $
        </VChip>
      </template>
      <template #reminder="{ item }">
        <VChip style="direction: ltr" small color="error" class="font-weight-medium">
          {{ (item.total_amount - (item.total_paid ?? 0)).toFixed(2) }} $
        </VChip>
      </template>

      <template #extra_expense_sum_price="{ item }">
        <VChip style="direction: ltr" small color="warning" class="font-weight-medium">
          {{ item.extra_expense_sum_price }} $
        </VChip>
      </template>

      <template #view_expense="{ item }">
        <VBtn
          variant="text"
          icon
          color="success"
          :loading="expenseLoading && selectedId == item.id"
          @click="viewExpense(item)"
        >
          <VIcon size="30" icon="mdi-eye-arrow-right" />
        </VBtn>
      </template>
    </DataTable>
    <VendoPrint ref="printRefs" v-model:print-item="printData" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { axios } from "@/plugins/axios-plugin";
import BreadCrumbs from "@/components/commons/BreadCrumbs.vue";
import DataTable from "@/components/commons/DataTable.vue";
import VendoPrint from "@/views/pages/vendors/vendorPrint.vue";

import InsertVendor from "@/views/pages/vendors/InsertVendor.vue";

import usePageConfig from "@/config/pages/vendor";
import router from "@/router";
import { formateDate, scope } from "@/@core/utils/index";
const CaloriesTemplate = defineComponent({
  props: ["data"],
  template: `
          <div>
            {{ data }}
          </div>
        `,
});

const { tabs, headers, breadCrumbs, search } = usePageConfig();
const apiLoading = ref(false);
const expand = ref(false);
const searchOption = ref({});
const printLoading = ref(false);
const expenseLoading = ref(false);
const printData = ref([]);
const printRefs = ref();
const total = ref(0);
const options = ref({ itemsPerPage: 20, page: 1, tab: "vendors" });
const vendors = ref([]);
const datatableRefs = ref();
const total_amount_purchase = ref(0);
const total_paid_purchase = ref(0);
const total_reminder_purchase = ref(0);
const extraTotal = ref({});
const vendorRef = ref();
const vendorEditRefs = ref();
const selectedItemStatus = ref({});
const statusLoading = ref(false);
const selectedId = ref(null);
const createVendor = () => {
  if (datatableRefs.value?.selectedItems?.length == 1) {
    vendorRef.value.toggleDialog(datatableRefs.value?.selectedItems[0]);
  } else {
    vendorRef.value.toggleDialog();
  }
};

const viewExpense = async (item) => {
  expenseLoading.value = true;
  selectedId.value = item.id;
  await router.replace("view-vendor/" + item.id);
  expenseLoading.value = false;
};
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const print = async (item) => {
  try {
    selectedItemStatus.value = item;
    printLoading.value = true;
    let { data } = await axios.get("vendor-purchase?id=" + item.id);
    printData.value = await data;
    await sleep(1);
    const printable = window.open("dcvdv", "_blank");

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
  fetchRecord();
};

const changeStatus = async (item) => {
  try {
    statusLoading.value = true;
    const { data } = await axios.post("vendor-status/" + item.status + "/" + item.id);
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

const fetchRecord = async () => {
  try {
    apiLoading.value = true;
    datatableRefs.value.selectedItems = [];

    const { data } = await axios.get("vendor", { params: options.value });
    total_amount_purchase.value = data.vendor_info.total_amount;
    total_paid_purchase.value = data.vendor_info.total_paid;
    total_reminder_purchase.value = data.vendor_info.total_reminder;
    vendors.value = data.data;
    total.value = data.total;
    extraTotal.value = data.extraTotal;

    // let total_Afg = 0
    // let total_usd = 0
    // res.data.data.forEach(row => {
    //   row.items.forEach(element => {
    //     total_Afg=0;

    //     if (row.id == element.vendor_id) {
    //       console.log('eklkkk', element)
    //       if (element.currency == 'Afg') {
    //         console.log('my id', element.cost)

    //         total_Afg += parseFloat(element.cost ?? 0)
    //       } else {
    //         total_usd += parseFloat(element.cost ?? 0)
    //       }
    //     }
    //   })
    // })
    // console.log('usd', total_usd)
    // console.log('Afg', total_Afg)
  } catch (error) {}
  apiLoading.value = false;
};

const deleteRecord = async (type = "delete") => {
  try {
    const ids = datatableRefs.value.selectedItems.map((row) => row.id) ?? [];
    if (type == "delete") await axios.delete("vendor/" + ids);
    if (type == "force-delete") await axios.delete("force-delete-vendor/" + ids);
    datatableRefs.value.selectedItems = [];
    fetchRecord();
  } catch (error) {}
};
const restoreRecord = async () => {
  try {
    const ids = datatableRefs.value?.selectedItems?.map((row) => row.id) ?? [];
    await axios.post("restore-vendor/" + ids);
    datatableRefs.value.selectedItems = [];
    fetchRecord();
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchRecord();
});
</script>

<route lang="yaml">
meta:
  auth: true
</route>
