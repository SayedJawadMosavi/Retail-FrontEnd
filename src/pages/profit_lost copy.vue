<template>
  <div>
    <div
      v-if="info"
      style="border: 1px solid rebeccapurple; padding: 5px; border-radius: 10px"
      class="d-flex align-center"
    >
      <VRow class="success">
        <VCol
          cols="6"
          md="6"
        >
          <div class="pe-3 text-success me-5">
            <span class="d-inline-block pe-1">   د عمومی گدام محصولاتو ارزشت:</span>
            {{ info.total_main_product ?? 0 }}
          </div>
        </VCol>
        <VCol
          cols="6"
          md="12"
        >
          <div class="pe-3 text-success me-5">
            <span class="d-inline-block pe-1">  نور گدامونو محصولاتو ارزشت:</span>
            {{ info.total_stock ?? 0 }}
          </div>
        </VCol>
        <VCol
          cols="6"
          md="12"
        >
          <div class="pe-3 text-success me-5">
            <span class="d-inline-block pe-1">  دمشتریانو پور :</span>
            {{ info.customer_balance ?? 0 }}
          </div>
        </VCol>
        <!--
          <VCol
          cols="6"
          md="12"
          >
          <div class="pe-3 text-success me-5">
          <span class="d-inline-block pe-1">   عواید :</span>
          {{ info.total_incoming ?? 0 }}
          </div>
          </VCol> 
        -->
        <VCol
          cols="6"
          md="6"
        >
          <div class="pe-3 text-success me-5">
            <span class="d-inline-block pe-1">   نقده:</span>
            {{ info.cash ?? 0 }}
          </div>
        </VCol>
        <VCol
          cols="6"
          md="12"
        >
          <div class="pe-3 text-success me-5">
            <span class="d-inline-block pe-1"> دکارمندانو پور   :</span>
            {{ info.employee_loan_withdraw ?? 0 }}
          </div>
        </VCol>
        <VCol
          cols="6"
          md="12"
        >
          <div
            class="pe-3 text-success me-5 mb-2"
            style="color:yellow;border-bottom:1px solid yellow"
          />
          <span
            class="d-inline-block pe-1 pt-4"
          >    مجموعه راغله :</span>
          {{ info.total_balance_income }}
        </VCol>
      </VRow>
     
      <VRow>
        <VCol
          cols="6"
          md="12"
        >
          <div class="pe-3 text-error me-5">
            <span class="d-inline-block pe-1">    دعرضه کونکی پور:</span>
            {{ info.vendor_balance ?? 0 }}
          </div>
        </VCol>
        <VCol
          cols="6"
          md="12"
        >
          <div class="pe-3 text-error me-5">
            <span class="d-inline-block pe-1"> کانټینر مصرفونه:    </span>
            {{ info.total_container_expense ?? 0 }}
          </div>
        </VCol>
        <VCol
          cols="6"
          md="12"
        >
          <div class="pe-3 text-error me-5">
            <span class="d-inline-block pe-1">  دکارمندانو پس اندازه:</span>
            {{ info.employee_loan_deposit ?? 0 }}
          </div>
        </VCol>
        <VCol
          cols="6"
          md="12"
        >
          <div class="pe-3 text-error me-5">
            <!--
              <span class="d-inline-block pe-1">   اضافی مصرفونه :</span>
              {{ info.extra_expense ?? 0 }} 
            -->
          </div>
        </VCol>
        
        <VCol
          cols="6"
          md="4"
          class="mt-5"
          style=""
        >
          <div
            class="pe-3 text-success mt-5"
            style="color:yellow;border-bottom:1px solid yellow;margin-top:63px !important"
          />
          <span
            class="d-inline-block pe-1 pt-4"
          >    ټول مصرفونه:</span>
          {{ info.total_balance_expense ?? 0 }}
        </VCol>
        <VCol
          cols="6"
          md="6"
          class="mt-5"
        >
          <div
            class="pe-3 text-success mt-5"
            style="color:yellow;border-bottom:1px solid yellow;margin-top:63px !important"
          />
          <span
            class="d-inline-block pe-1 pt-4"
          >    موجودی:</span>
          {{ info.total_balance ?? 0 }}
        </VCol>
      </VRow>
    </div>
    <VRow>
      <VCol
        cols="12"
        md="4"
      >
        <div class="pe-3 text-success me-5">
          <span class="d-inline-block pe-1"> مجموعه سرمایه :</span>
          {{ info?.capital ?? 0 }}
        </div>
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <div class="pe-3 text-warning me-5">
          <span class="d-inline-block pe-1">  موجودی : </span> {{ info?.total_balance ?? 0 }}
        </div>
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <div :class="info?.profit_lost > 0 ? 'text-success' : 'text-error'">
          <span class="d-inline-block pe-1"> {{ info?.profit_lost >0 ? 'مفاد' :"ضرر" }} : </span> {{ info?.profit_lost ?? 0 }}
        </div>
      </VCol>
    </VRow>
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
