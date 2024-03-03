<template>
  <VCol cols="12">
    <!-- 👉 Table -->
    <ConfirmDialog
      ref="confirmRef"
      @confirm="onConfirm"
    />
    <VCard
      title="د معاشونو لست"
      style="min-height: 300px"
    >
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th scope="col">
              #آی دی
            </th>
            <th scope="col">
              د معاش اندازه
            </th>
            <th scope="col">
              د حاضرو تعداد
            </th>
            <th scope="col">
              د غیرحاضرو تعداد
            </th>
            <th scope="col">
              د ورکړې وړ
            </th>
            <th scope="col">
              د وصولو اندازه
            </th>
            <th scope="col">
              پاتي
            </th>
            <th scope="col">
              د معاش نیټه
            </th>
            <th
              scope="col"
              class="text-center"
            >
              عملیات
            </th>
          </tr>
        </thead>
  
        <tbody>
          <tr
            v-for="(item, index) in props.employeeInfo.payments"
            :key="index"
          >
            <td>
              {{ item.id }}
            </td>
  
            <td>{{ employeeInfo.salary }}</td>
            <td>{{ item.present }}</td>
            <td>{{ item.absent }}</td>
            <td>{{ item.salary }}</td>
            <td>{{ item.paid }}</td>
            <td>{{ item.salary - item.paid }}</td>
            <td>{{ item.year_month }}</td>
            <td>{{ formateDate(item.created_at) }}</td>
            <td>{{ item.description }}</td>
            <td class="text-center">
              <VBtn
                v-if="item.deleted_at && scope(['employee_restore'])"
                variant="text"
                icon
                size="small"
                color="info"
                :loading="restoreLoading && selectedItem.id == item.id"
                @click="restorePayment(item)"
              >
                <VIcon
                  start
                  icon="mdi-restore"
                  color="info"
                />
                بیا رغونه
              </VBtn>
              <div v-else>
                <VBtn
                  v-if="scope(['employee_force_delete'])"
                  variant="text"
                  icon
                  size="small"
                  :loading="apiLoading2 && selectedItem.id == item.id"
                  @click="deletePayment(item)"
                >
                  <VIcon
                    icon="mdi-trash"
                    color="error"
                  />
                </VBtn>
              </div>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCard>
  </VCol>
</template>
  
<script setup>
import { formateDate, scope } from '@/@core/utils/index'
import ConfirmDialog from '@/components/commons/ConfirmDialog.vue'
import { axios } from '@/plugins/axios-plugin'
  
const props = defineProps({
  employeeInfo: {
    type: Object,
    default: () => {},
  },
  updateChanges: {
    type: Function,
    default: () => {},
  },
})
const confirmRef = ref()
const apiLoading2 = ref(false)
const restoreLoading = ref(false)
  
const selectedItem = ref({})
const deletePayment = async item => {
  selectedItem.value = item
  confirmRef.value.showDialog('delete')
}
  
const restorePayment = async item => {
  selectedItem.value = item
  confirmRef.value.showDialog('restore')
}
  
const onConfirm = async event => {
  if (event == 'delete') {
    try {
      apiLoading2.value = true
      const { data } = await axios.delete(`salary-payments/` + selectedItem.value.id)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
    apiLoading2.value = false
  }
  if (event == 'restore') {
    try {
      restoreLoading.value = true
      await axios.post(`restore/salary-payments/` + selectedItem.value.id)
      await props.updateChanges()
    } catch (error) {
      console.error('error', error)
    }
    restoreLoading.value = false
  }
}
</script>
  
  
  <style>
  .dp__input{
  padding: 12px 4px 12px 40px !important;
  }
  .dp__menu dp__menu_index  {
  background: red !important;
  
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
  