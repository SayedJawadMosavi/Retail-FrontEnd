<template>
  <div>
    <VSnackbar
      v-model="snackbar"
      timeout="20000"
    >
      سفارش حذف شده است نمیتوانید تغیرات بیاورید!

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
      to="/sell"
    >
      <VIcon
        start
        icon="mdi-undo-variant"
      />
      بازگشت
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
      <VWindowItem value="details">
        <SellInfo
          v-model:sellInfo="sellData"
          v-model:resetData="resetData"
          :update-changes="updateChanges"
        />
      </VWindowItem>

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
    </VWindow>
  </div>
</template>

<script setup>
import { axios } from '@/plugins/axios-plugin'
import SellInfo from '@/views/pages/sell/sellInfo.vue'
import SellItems from '@/views/pages/sell/sellItems.vue'
import SellPayments from '@/views/pages/sell/sellPayment.vue'

import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref('details')
const sell_id = ref(route.params.sell_id)

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
    title: 'جزئیات',
    icon: 'mdi-information-outline',
    tab: 'details',
  },
  {
    title: 'محصولات',
    icon: 'mdi-shape',
    tab: 'items',
  },
  {
    title: 'پرداختی ها',
    icon: 'mdi-cash-multiple',
    tab: 'payments',
  },
]

const getSellInfo = async () => {
  try {
    apiLoading.value = true
    const { data } = await axios.get('sell/' + sell_id.value)
    sellData.value = data
    resetData.value = JSON.parse(JSON.stringify(data))
    if (data.deleted_at) {
      snackbar.value = true
    }
  } catch (error) {
    console.error('datatable', sellData.value)
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
