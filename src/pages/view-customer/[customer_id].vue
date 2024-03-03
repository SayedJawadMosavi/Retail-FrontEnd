<template>
  <div>
    <VSnackbar
      v-model="snackbar"
      timeout="20000"
    >
      سفارش یا امر دیلیت شوی بدلون نشی راتلی!

      <template #actions>
        <VBtn
          color="error"
          variant="text"
          @click="snackbar = false"
        >
          بستن
        </VBtn>
      </template>
    </VSnackbar>
    <VBtn
      class="mb-2"
      to="/customers"
    >
      <VIcon
        start
        icon="mdi-undo-variant"
      />
      بیرته تګ
    </VBtn>
    <VTabs
      v-model="activeTab"
      show-arrows
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
      :touch="false"
      :style="`pointer-events: ${sellData?.deleted_at ? 'none' : 'auto'}`"
    >
      <!-- Account -->

      <!-- Security -->
      <VWindowItem value="items">
        <SellItems
          v-model:sellInfo="sellData"
          :update-changes="updateChanges"
        />
      </VWindowItem>

      <!-- Notification -->
      <VWindowItem value="payments">
        <SellPayments
          v-model:sellInfo="sellData"
          :update-changes="updateChanges"
        />
      </VWindowItem>
      <VWindowItem value="deposit_withdraw">
        <DepositWithdraw
          v-model:sellInfo="sellData"
          :update-changes="updateChanges"
        />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<script setup>
import { axios } from "@/plugins/axios-plugin"
import DepositWithdraw from "@/views/pages/customers/deposit_withdraw.vue"

import SellItems from "@/views/pages/customers/sellItems.vue"
import SellPayments from "@/views/pages/customers/sellPayment.vue"

import { ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const activeTab = ref("details")
const customer_id = ref(route.params.customer_id)

const apiLoading = ref(false)
const sellData = ref({})
const resetData = ref({})
const snackbar = ref(false)

const updateChanges = async () => {
  await getSellInfo()

  return true
}

// tabs
const tabs = [
  {
    title: "محصولات",
    icon: "mdi-shape",
    tab: "items",
  },
  {
    title: " کاته",
    icon: "mdi-cash-multiple",
    tab: "payments",
  },
  {
    title: "د راکړی ورکړی",
    icon: "mdi-shopping-outline",
    tab: "deposit_withdraw",
  },
]

const getSellInfo = async () => {
  try {
    apiLoading.value = true
    const { data } = await axios.get("customer/" + customer_id.value)
    sellData.value = data
    resetData.value = JSON.parse(JSON.stringify(data))
    if (data.deleted_at) {
      snackbar.value = true
    }
  } catch (error) {
    console.error("datatable", sellData.value)
  }
  apiLoading.value = false
}

getSellInfo()
</script>

<route lang="yaml">
meta:
  navActiveLink: pages-account-settings-tab
  auth: true
</route>
