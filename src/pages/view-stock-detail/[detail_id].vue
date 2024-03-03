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
          بندول
        </VBtn>
      </template>
    </VSnackbar>
    <VBtn
      class="mb-2"
      to="/stock"
    >
      <VIcon
        start
        icon="mdi-undo-variant"
      />
      بیرته
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
      :style="`pointer-events: ${stockData?.deleted_at ? 'none' : 'auto'}`"
    >
      <!-- Account -->
      <VWindowItem value="details">
        <StockDetail
          v-model:stockDetail="stockData"
          v-model:resetData="resetData"
          :update-changes="updateChanges"
        />
      </VWindowItem>
  
      <!-- Security -->
  
      <!-- Notification -->
    </VWindow>
  </div>
</template>
  
<script setup>
import { axios } from '@/plugins/axios-plugin'
import StockDetail from '@/views/pages/stock/StockDetail.vue'

  
import { ref } from 'vue'
import { useRoute } from 'vue-router'
  
const route = useRoute()
const activeTab = ref('details')
const detail_id = ref(route.params.detail_id)
  
const apiLoading = ref(false)
const stockData = ref({})
const resetData = ref({})
const snackbar = ref(false)
  
const updateChanges = async () => {
  await getProductInfo()
  
  return true
}
  
// tabs
const tabs = [
  {
    title: 'د محصول جزییات',
    icon: 'mdi-information-outline',
    tab: 'details',
  },
   
    
]
  
const getProductInfo = async () => {
  try {
    apiLoading.value = true
    const { data } = await axios.get('stock/' + detail_id.value)
    stockData.value = data
    resetData.value = JSON.parse(JSON.stringify(data))
    if (data.deleted_at) {
      snackbar.value = true
    }
  } catch (error) {
    console.error('datatable', stockData.value)
  }
  apiLoading.value = false
}
  
getProductInfo()
</script>
  
  <route lang="yaml">
  meta:
    navActiveLink: pages-account-settings-tab
    auth: true
  </route>
  