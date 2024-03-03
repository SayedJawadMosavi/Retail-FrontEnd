<template>
  <div>
    <!-- <PageFilter /> -->
    <BreadCrumbs
      v-model:active-tab="options.tab"
      :selected-items="datatableRefs?.selectedItems"
      :items="breadCrumbs"
      :search-options="search"
      page="د پشتیبان گیری لیسټ"
      icon="mdi-people"
      create-text="نوی محصول"
      edit-text="د محصول ایدیت "
      :show-create="scope(['test_create'])"
      :show-delete="scope(['product_delete'])"
      :show-restore="scope(['product_restore'])"
      :show-force-delete="scope(['product_force_delete'])"
      @on-force-delete="deleteRecord('force-delete')"
      @on-create="createProduct"
      @on-delete="deleteRecord"
      @on-restore="restoreRecord"
      @on-search="searchRecord"
    >
      <template #default>
        <VBtn
          class="font-weight-bold bg-info"
          :loading="apiLoading2"
          @click="submitBackup"
        >
          دنوی پشتیبان
          <VIcon end icon="mdi-export" />
        </VBtn>
      </template>
    </BreadCrumbs>
    <ConfirmDialog ref="confirmRef" @confirm="onConfirm" />
    <DataTable
      ref="datatableRefs"
      v-model:total="total"
      v-model:loading="apiLoading"
      v-model:extra-total="extraTotal"
      :tabs="tabs"
      :headers="headers"
      :items="backups"
      @table-change="onTableChange($event)"
    >
      <template v-for="i in 1" #id="{ item }" :key="i">
        {{ i++ }}
      </template>
      <template #size="{ item }">
        <div style="white-space: nowrap">{{ item.size }} MB</div>
      </template>
      <template #created_at="{ item }">
        <div style="white-space: nowrap">
          {{ moment(item.created_at, "YYYY-MM-DD").format("ll") }}
        </div>
      </template>
      <template #action="{ item }">
        <div>
          <VBtn
            variant="text"
            icon
            size="small"
            :loading="apiLoading && selectedItem == item"
            @click="deleteRecord(item, 'items')"
          >
            <VIcon icon="mdi-trash" color="error" />
          </VBtn>
          <VIcon
            size="30"
            title="دانلود کردن"
            color="#1867c0"
            icon="mdi-download"
            @click="DownloadgetBackup(item.name)"
          />
        </div>
      </template>
      <!--
        <template #quantity="{ item }">
        <VChip
        style="direction: ltr"
        small
        :color="item.quantity > 0 ? 'success' : 'error'"
        class="font-weight-medium"
        >
        {{ item.quantity }}
        </VChip>
        </template> 
      -->
    </DataTable>
    <!--
      <VendoPrint
      ref="printRefs"
      v-model:print-item="printData"
      /> 
    -->
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { axios } from "@/plugins/axios-plugin";
import BreadCrumbs from "@/components/commons/BreadCrumbs.vue";
import DataTable from "@/components/commons/DataTable.vue";
import moment from "moment";
import ConfirmDialog from "@/components/commons/ConfirmDialog.vue";

import usePageConfig from "@/config/pages/backup";
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
const apiLoading2 = ref(false);
const selectedType = ref(null);
const expand = ref(false);
const searchOption = ref({});
const printLoading = ref(false);
const detailLoading = ref(false);
const printData = ref([]);
const printRefs = ref();
const total = ref(0);
const confirmRef = ref();
const showDialog = ref(false);
const selectedItem = ref({});

const options = ref({ itemsPerPage: 20, page: 1, tab: "backups" });
const backups = ref([]);
const datatableRefs = ref();
const extraTotal = ref({});
const productRef = ref();
const productEditRefs = ref();
const selectedItemStatus = ref({});
const statusLoading = ref(false);
const selectedId = ref(null);
const createProduct = () => {
  if (datatableRefs.value?.selectedItems?.length == 1) {
    productRef.value.toggleDialog(datatableRefs.value?.selectedItems[0]);
  } else {
    productRef.value.toggleDialog();
  }
};

const searchRecord = (data) => {
  searchOption.value = data;
  options.value = { ...options.value, ...data };
  fetchRecord();
};

const onTableChange = (value) => {
  options.value = value;
  fetchRecord();
};

const fetchRecord = async () => {
  try {
    apiLoading.value = true;
    datatableRefs.value.selectedItems = [];
    const res = await axios.get("backups", { params: options.value });
    console.log("res", res.data.databases);
    backups.value = res.data.databases;

    total.value = res.data.data.length;
    extraTotal.value = res.data.extraTotal;
  } catch (error) {}
  apiLoading.value = false;
};
const DownloadgetBackup = async (filename) => {
  try {
    const response = await axios.get("backups/" + filename, { responseType: "blob" });
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading backup:", error);
  }
};
const deleteRecord = async (item, type) => {
  selectedItem.value = item;
  console.log(selectedItem.value.name);
  selectedType.value = type;

  confirmRef.value.showDialog("delete");
};
const onConfirm = async (event) => {
  if (event == "delete") {
    try {
      console.log(selectedItem.value.name);

      const { data } = await axios.delete(`backups/${selectedItem.value.name}`);
      fetchRecord();
    } catch (error) {
      console.error("error", error);
    }
  }
};
async function submitBackup() {
  try {
    apiLoading2.value = true;

    await axios.post("backups");
    fetchRecord();
  } catch (error) {
    console.error("error", error);
    toast.error(" مشکل په سرور کښی موجودی دي !");
  }
  apiLoading2.value = false;
}
onMounted(() => {
  fetchRecord();
});
</script>

<route lang="yaml">
meta:
  auth: true
</route>
