<template>
  <VDialog v-model="show" transition="dialog-top-transition" persistent width="auto">
    <VCard width="400" title="راپور ترتیبول">
      <VCardActions class="justify-end">
        <VBtn color="secondary" @click="show = false"> لغوه کول </VBtn>
        <VBtn ripple color="primary" variant="tonal" @click="print">
          د راپور پرنت
          <VIcon icon="mdi-printer" end />
        </VBtn>
      </VCardActions>
    </VCard>

    <PrintReportDialog
      ref="printRefs"
      v-model:print-item="printData"
      v-model:start-date="payload.start_date"
      v-model:end-date="payload.end_date"
      :title="title"
      :headers="headers"
    />
  </VDialog>
</template>

<script setup>
import { ref } from "vue";
import { axios } from "@/plugins/axios-plugin";

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
import PrintReportDialog from "@/components/commons/CustomerPrintReportDialog.vue";
import { toast } from "vue3-toastify";

const props = defineProps({});
const emit = defineEmits(["confirm"]);

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const customer_header = [
  {
    title: "شماره",
    key: "id",
  },

  // {
  //   title: 'View More',
  //   key: 'profile',
  // },

  {
    title: "اسم",
    key: "first_name",
  },

  {
    title: "تخلص",
    key: "last_name",
  },
  {
    title: "شماره تماس",
    key: "phone_number",
  },
  {
    title: "ایمیل",
    key: "email",
  },
  {
    title: "آدرس",
    key: "address",
  },
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
    title: "توضیحات",
    key: "description",
  },
];
const formRef = ref();
const printRefs = ref();
const headers = ref([]);
const show = ref(false);
const printLoading = ref(false);
const printData = ref([]);
const printType = ref("");
const title = ref("");

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

const confirm = (res) => {
  if (res) {
    emit("confirm", type.value);
  }
  show.value = false;
};
const showPrintConfirm = (type) => {
  printType.value = type;
  payload.value = {
    start_date: new Date(),
    end_date: new Date(),
  };
  show.value = true;
};

const print = async () => {
  try {
    printLoading.value = true;

    if (printType.value == "customers") {
      headers.value = customer_header;
      title.value = "راپور مشتری";
    }

    let { data } = await axios.get("reports", {
      params: { type: printType.value, ...payload.value },
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

defineExpose({
  showPrintConfirm,
});
</script>

<style>
.dp__input {
  padding: 12px 4px 12px 40px !important;
}

.dp__theme_dark,
.dp__theme_light {
  --dp-background-color: rgb(var(--v-theme-surface));
  --dp-text-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  --dp-hover-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
  --dp-hover-text-color: gba(var(--v-theme-on-surface), 1);
  --dp-hover-icon-color: var(--v-theme-on-surface);
  --dp-primary-color: #40A579;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #8A8D93;
  --dp-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  --dp-menu-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  --dp-border-color-hover: rgba(var(--v-border-color), var(--v-medium-emphasis-opacity)) --dp-border-radius:10px !important;
  --dp-disabled-color: var(--v-disabled-opacity);
  --dp-scroll-bar-background: var(--v-theme-on-surface);
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  --dp-danger-color: #e53935;
  --dp-highlight-color: rgba(0, 92, 178, 0.2);
}
</style>
