<template>
  <ConfirmDialog ref="confirmRef" @confirm="onConfirm" />
  <VDialog v-model="show" transition="dialog-top-transition" persistent width="auto">
    <VCard width="auto" title="راپور اخیستل">
      <VCardText style="min-height: 300px">
        <VForm ref="formRef">
          <VRow>
            <VCol cols="12">
              <p class="mb-0">د پیل نیټه</p>

              <span style="direction: ltr">
                <VueDatePicker
                  v-model="formdata.start_date"
                  clearable
                  auto-apply
                  dark
                  close-on-auto-apply
                  formate="MM/dd/yyyy"
                  :offset="-130"
                />
              </span>
            </VCol>

            <VCol cols="12">
              <p class="mb-0">د ختم نیټه</p>
              <span style="direction: ltr">
                <VueDatePicker
                  v-model="formdata.end_date"
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
          راپور ترتیبول
          <VIcon icon="mdi-export" end />
        </VBtn>
      </VCardActions>
    </VCard>
    <PrintReportDialog
      ref="printRefs"
      v-model:print-item="printData"
      v-model:start-date="formdata.start_date"
      v-model:end-date="formdata.end_date"
      :flag="flag"
      :title="title"
      :total="total"
      :headers="headers"
    />
  </VDialog>
  <VBtn class="font-weight-bold bg-info" style="float: right" @click="openDialogs">
    راپور ترتیبول
    <VIcon end icon="mdi-export" />
  </VBtn>

  <VCol cols="12" style="margin-top: 40px">
    <!-- 👉 Table -->
    <ConfirmDialog ref="confirmRef" @confirm="onConfirm" />
    <BreadCrumbs
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="د ګدام د محصولاتو لست "
      icon="mdi-shopping-outline"
      :show-create="scope(['test_create'])"
      :show-delete="scope(['test_delete'])"
      @on-search="searchRecord"
    >
      <template #default />
    </BreadCrumbs>

    <VTable class="text-no-wrap">
      <tfoot>
        <tr class="text-success">
          <th scope="col" />
          <th scope="col" />
          <th scope="col" />
          <th scope="col" />
          <th scope="col" />

          <th scope="col">د کارتن مجموعه :{{ total_carton }}</th>
        </tr>
      </tfoot>
    </VTable>

    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:loading="apiLoading"
      v-model:extra-total="extraTotal"
      v-model:items="tableRecords"
      :tabs="tabs"
      :headers="detail_header"
      @table-change="onTableChange($event)"
    >
      <template #products_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.product.product_name }}
        </div>
      </template>
      <template #stocks_name="{ item }">
        <div style="white-space: nowrap">
          {{ item.stock.name }}
        </div>
      </template>
      <template #footer>
        <DataTableRow>
          <DataTableCol>
            {{ total_carton }}
          </DataTableCol>
        </DataTableRow>
      </template>
    </DataTable>
  </VCol>
</template>

<script setup>
import { axios } from "@/plugins/axios-plugin";
import useRules from "@/plugins/vuelidate/vuelidateRules";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import moment from "moment";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import BreadCrumbs from "@/components/commons/BreadCrumbs.vue";
import DataTable from "@/components/commons/DataTable.vue";
import ConfirmDialog from "@/components/commons/ConfirmDialog.vue";
import { scope } from "@/@core/utils/index";

import PrintReportDialog from "@/components/commons/PrintReportDialog.vue";

const props = defineProps({
  stockDetail: {
    type: Object,
    default: () => {},
  },
  updateChanges: {
    type: Function,
    default: () => {},
  },
});

const total = ref(0);
const carton_total = ref(0);
const extraTotal = ref({});
const searchOption = ref({});
const tableRecords = ref([]);

const extraData = ref({});
const datatableRefs = ref();
const confirmRef = ref();
const formRef = ref();
const selectedType = ref(null);
const showDialog = ref(false);
const reportRefs = ref();
const printData = ref([]);
const printRefs = ref();
const headers = ref([]);
const printType = ref();
const printLoading = ref(false);
const title = ref("");
const flag = ref("");
const show = ref(false);
const editRef = ref();

const apiLoading = ref(false);
const restoreLoading = ref(false);

const loadingshareholder = ref(false);
const selectedItem = ref({});
const total_carton = ref(0);

const route = useRoute();
const detail_id = ref(route.params.detail_id);
const detail_header = [
  {
    title: "شمیره",
    key: "ids",
    width: "80px",
  },

  {
    title: "محصول",
    key: "products_name",
  },

  {
    title: "دکارتن تعداد",
    key: "carton_quantity",
  },

  {
    title: "نیټه",
    key: "created_at",
  },
];
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const options = ref({ page: 1, itemPerPage: 20, tab: "product_stocks" });

// const detail_id = props.stockDetail.id
const formdata = ref({
  start_date: new Date(),
  end_date: new Date(),
});

const openDialogs = (type) => {
  printType.value = "stock_detail";

  formdata.value = {
    start_date: new Date(),
    end_date: new Date(),
  };
  show.value = true;
};
watch(
  () => props.stockDetail.items,
  (newDetail, oldDetail) => {
    if (newDetail && Array.isArray(newDetail)) {
      // Reset totals before recalculating

      total_carton.value = 0;

      newDetail.forEach((element) => {
        total_carton.value += parseFloat(element.carton_quantity);
      });

      total_carton.value = total_carton.value.toFixed(2);
    }
    tableRecords.value = props.stockDetail.items;
  }
);
const getReport = async () => {
  if (formdata.value.start_date == null || formdata.value.end_date == null) {
    toast.error("please fill the form correctly");

    return false;
  }
  try {
    console.log("pppp", printType.value);
    if (printType.value == "stock_detail") {
      headers.value = detail_header;

      flag.value = "detail";
    }

    printLoading.value = true;
    let { data } = await axios.get("reports", {
      params: { type: printType.value, detail_id: detail_id.value, ...formdata.value },
    });
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
const forceDelete = async (item, type) => {
  selectedItem.value = item;
  selectedType.value = type;

  confirmRef.value.showDialog("forceDelete");
};
const fetchRecord = async () => {
  try {
    apiLoading.value = true;
    datatableRefs.value.selectedItems = [];
    const { data } = await axios.get("get_stock_data/" + detail_id.value, {
      params: options.value,
    });
    tableRecords.value = data.data;
    data.data.forEach((element) => {
      carton_total.value += parseFloat(element.carton_quantity);
    });
    total.value = data.total;
    extraTotal.value = data.extraTotal;
    extraData.value = data.extra_data;
  } catch (error) {}
  apiLoading.value = false;
};
const searchRecord = (data) => {
  searchOption.value = data;
  options.value = { ...options.value, ...data };
  fetchRecord();
};
onMounted(() => {
  console.log("fdf", detail_id.value);
});
const onTableChange = (value) => {
  options.value = value;
  fetchRecord();
};
</script>

<style>
.dp__input{
padding: 12px 4px 12px 40px !important;
}
.dp__menu dp__menu_index  {
background: red !important;

}
.vpd-days{
color:  black;
}
.vpd-input-group input.light  {

  border: 1px solid #6d6985;

}
.vpd-input-group input {
    flex-grow: 1;
    border: 1px solid #6d6985;
    /* border-right: none; */
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    line-height: 30px;
    padding: 7px 12px;
    border-radius: 4px;
}
.dp__theme_dark ,.dp__theme_light  {
--dp-background-color:  rgb(var(--v-theme-surface));
--dp-text-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
--dp-hover-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
--dp-hover-text-color: gba(var(--v-theme-on-surface),1);
--dp-hover-icon-color: var(--v-theme-on-surface);
--dp-primary-color: #40A579;
--dp-primary-text-color:#fff;
--dp-secondary-color: #8A8D93;
--dp-border-color:rgba(var(--v-border-color), var(--v-border-opacity));
--dp-menu-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
--dp-border-color-hover:rgba(var(--v-border-color),var(--v-medium-emphasis-opacity) )
--dp-border-radius:10px  !important;
--dp-disabled-color:var(--v-disabled-opacity);
--dp-scroll-bar-background: var(--v-theme-on-surface);
--dp-scroll-bar-color: #484848;
--dp-success-color: #00701a;
--dp-success-color-disabled: #428f59;
--dp-icon-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
--dp-danger-color: #e53935;
--dp-highlight-color: rgba(0, 92, 178, 0.2);
}
</style>
