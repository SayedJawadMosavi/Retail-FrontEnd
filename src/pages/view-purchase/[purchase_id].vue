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
        to="/purchase"
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
        :style="`pointer-events: ${purchaseData?.deleted_at ? 'none' : 'auto'}`"
      >
        <!-- Account -->
        <VWindowItem value="details">
          <PurchaseInfo
            v-model:purchaseInfo="purchaseData"
            v-model:resetData="resetData"
            :update-changes="updateChanges"
          />
        </VWindowItem>
  
        <!-- Security -->
        <VWindowItem value="items">
          <PurchaseItems
            v-model:purchaseInfo="purchaseData"
            :update-changes="updateChanges"
          />
        </VWindowItem>
  
        <!-- Notification -->
        <VWindowItem value="payments">
          <PurchasePayments
            v-model:purchaseInfo="purchaseData"
            :update-changes="updateChanges"
          />
        </VWindowItem>
      </VWindow>
    </div>
  </template>
  
  
  <script setup>
  import { axios } from '@/plugins/axios-plugin'
import PurchaseInfo from '@/views/pages/purchase/PurchaseInfo.vue'
import PurchaseItems from '@/views/pages/purchase/PurchaseItems.vue'
import PurchasePayments from '@/views/pages/purchase/PurchasePayments.vue'
  
  import { ref } from 'vue'
import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const activeTab = ref('details')
  const purchase_id = ref(route.params.purchase_id)
  
  const apiLoading = ref(false)
  const purchaseData = ref({})
  const resetData = ref({})
  const snackbar = ref(false)
  
  const updateChanges = async () => {
    await getOrderInfo()
  
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
  
  const getOrderInfo = async () => {
    try {
      apiLoading.value = true
      const { data } = await axios.get('purchase/' + purchase_id.value)
      purchaseData.value = data
      resetData.value = JSON.parse(JSON.stringify(data))
      if (data.deleted_at) {
        snackbar.value = true
      }
    } catch (error) {
      console.error('datatable', purchaseData.value)
    }
    apiLoading.value = false
  }
  
  getOrderInfo()
  </script>
  
  <route lang="yaml">
  meta:
    navActiveLink: pages-account-settings-tab
    auth: true
  </route>
  