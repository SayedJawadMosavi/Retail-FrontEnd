<template>
  <VRow>
    <ConfirmDialog
      ref="confirmRef"
      @confirm="onConfirm"
    />
  
    <EditDialog
      ref="editRef"
      :order-info="sellInfo"
      :update-changes="updateChanges"
    />
  

  
    <VCol cols="12">
      <!-- 👉 Table -->
      <VCard
        title="د اجناسو لست"
        style="min-height: 300px"
      >
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">
                #آی دی
              </th>
              <th scope="col">
                د محصول نوم
              </th>
                
              <th scope="col">
                د ګدام نوم
              </th>
              <th scope="col">
                د  کارتن تعداد
              </th>
                
              <th scope="col">
                اندازه
              </th>
              <th scope="col">
                قیمت  
              </th>
               
              <th scope="col">
                مجمموع په دالر
              </th>
              <th scope="col">
                نیټه
              </th>
              <!--
                <th
                scope="col"
                class="text-center"
                >
                عملیات
                </th> 
              -->
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in sellInfo.items"
              :key="index"
              :class="`${item.deleted_at ? 'text-error' : ''}`"
            >
              <td>
                {{ item.id }}
              </td>
              <td>{{ item.product_stock.product.product_name }}</td>
              <td>{{ item.product_stock.stock.name }}</td>
              
              <td>{{ item.carton_quantity }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.cost }}</td>
             
              <td>{{ item.total }}</td>
              <td>{{ moment(item.created_at, "YYYY-MM-DD").format("ll") }}</td>
  
              <!--
                <td class="text-center">
                <div v-if="item.deleted_at">
                <VBtn
                variant="text"
                icon
                size="small"
                color="info"
                :loading="restoreLoading && selectedItem.id == item.id"
                @click="restoreRecord(item, 'items')"
                >
                <VIcon
                start
                icon="mdi-restore"
                color="info"
                />
                بیا رغونه
                </VBtn>
  
                <VBtn
                class="ms-2"
                variant="text"
                icon
                size="small"
                :loading="apiLoading2 && selectedItem == item"
                @click="forceDelete(item, 'items')"
                >
                <VIcon
                icon="mdi-trash"
                color="error"
                />
                </VBtn>
                </div>
  
                <div v-else>
                <VBtn
                variant="text"
                icon
                size="small"
                @click="editForm(item, 'item')"
                >
                <VIcon
                icon="mdi-pencil"
                color="primary"
                />
                </VBtn>
  
                <VBtn
                variant="text"
                icon
                size="small"
                :loading="apiLoading2 && selectedItem == item"
                @click="deleteRecord(item, 'items')"
                >
                <VIcon
                icon="mdi-trash"
                color="error"
                />
                </VBtn>
                </div>
                </td> 
              -->
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
</template>
  
<script setup>
import { required, numeric, minLength, minValue } from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import useVuelidate from '@vuelidate/core'
import { ref, toRef } from 'vue'
import { axios } from '@/plugins/axios-plugin'
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router'
import { formateDate , scope } from '@/@core/utils/index'
import ConfirmDialog from '@/components/commons/ConfirmDialog.vue'
import moment from "moment"
  
const props = defineProps({
  sellInfo: {
    type: Object,
    default: () => {},
  },
  
  updateChanges: {
    type: Function,
    default: () => {},
  },
})
  
const route = useRoute()
  
const customer_id = ref(route.params.customer_id)
  
const formRef = ref()

  
const apiLoading = ref(false)
const apiLoading2 = ref(false)
const restoreLoading = ref(false)
const confirmRef = ref()
const editRef = ref()
  
const selectedItem = ref({})
const selectedType = ref(null)
const showDialog = ref(false)
const loadingProduct = ref(false)
const loadingStock = ref(false)
const products = ref([])
const stocks = ref([])



  
function convertToEnglishNumbers(model, item = null, index = null) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  const englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g]
  for (let i = 0; i < 10; i++) {
    if (model == 'expense.price') {
      expense.value.price = expense.value.price.replace(persianNumbers[i], i).replace(englishNumbers[i], i)
  
      return
    }
    if (item == null) {
      payload.value[model] = payload.value[model].replace(persianNumbers[i], i).replace(englishNumbers[i], i)
    } else {
      payload.value[model][index][item] = payload.value[model][index][item]
        .replace(persianNumbers[i], i)
        .replace(englishNumbers[i], i)
    }
  }
}
  
const restoreRecord = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type
  confirmRef.value.showDialog('restore')
}
  
const editForm = async (item, type = 'epense') => {
    
  editRef.value.openDialog(item, type)
}
  
const deleteRecord = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type
  
  confirmRef.value.showDialog('delete')
}
  
const forceDelete = async (item, type) => {
  selectedItem.value = item
  selectedType.value = type
  
  confirmRef.value.showDialog('forceDelete')
}
  
const onConfirm = async event => {
  if (event == 'delete') {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(`delete/${selectedType.value}/${selectedItem.value.id}`)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
  }
  
  if (event == 'forceDelete') {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(`force-delete/${selectedType.value}/${selectedItem.value.id}`)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
  }
  if (event == 'restore') {
    try {
      restoreLoading.value = true
      const { data } = await axios.post(`restore/${selectedType.value}/${selectedItem.value.id}`)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
  }
  restoreLoading.value = false
  apiLoading2.value = false
  selectedItem.value = {}
}
  
onMounted(() => {
 

})
</script>
  
  
  
  <style>
  .dp__input{
  padding: 12px 4px 12px 40px !important;
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
  