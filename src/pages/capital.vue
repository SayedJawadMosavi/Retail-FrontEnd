<template>
  <div>
    <div
      v-if="info"
      style="border: 1px solid rebeccapurple; padding: 30px; border-radius: 10px"
      class="d-flex align-center"
    >
      <VRow>
        <VCol
          cols="12"
          md="4"
        >
          <div class="pe-3 text-success me-5">
            <span class="d-inline-block pe-1">   د عمومی گدام محصولاتو ارزشت:</span>
            {{ info.total_main_product ?? 0 }} $
          </div>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <div class="pe-3 text-success me-5">
            <span class="d-inline-block pe-1">  نور گدامونو محصولاتو ارزشت:</span>
            {{ info.total_stock ?? 0 }} $
          </div>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <div :class="info?.total_main_product+info?.total_stock > 0 ? 'text-success' : 'text-error'">
            <span class="d-inline-block pe-1"> مجموعه سرمایه: </span> {{ (info?.total_main_product+info?.total_stock).toFixed(2) }} $
          </div>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { axios } from '@/plugins/axios-plugin'

import router from '@/router'
import { scope } from '@/@core/utils/index'
import { toast } from 'vue3-toastify'

const CaloriesTemplate = defineComponent({
  props: ['data'],
  template: `
      <div>
        {{ data }}
      </div>
    `,
})

const info = ref({})



const payload = ref({

  type: 'profit_lost',
})
const getReport = async () => {
  
  try {
    
    let { data } = await axios.get('get_report', { params: {...payload.value } })
    
    info.value = data.info

  } catch (error) {
    console.error('error', error)
  }
  
}



const onTableChange = value => {
  console.log('test', value)

  options.value = value
  getReport()
}

onMounted(() => {
  getReport()
})
</script>

<route lang="yaml">
meta:
  auth: true
</route>
