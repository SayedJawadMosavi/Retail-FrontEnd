<template>
    <div>
      <VSnackbar
        v-model="snackbar"
        timeout="20000"
      >
       The employee has been deleted you cant not bring changes
  
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
        to="/employees"
      >
        <VIcon
          start
          icon="mdi-undo-variant"
        />
        بیرته راتلل
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
        :style="`pointer-events: ${employeeData?.deleted_at ? 'none' : 'auto'}`"
      >
        <!-- Account -->
        <VWindowItem value="details">
          <EmployeeInfo
            v-model:employeeInfo="employeeData"
            v-model:resetData="resetData"
            :update-changes="updateChanges"
          />
          
        </VWindowItem>
  
        <VWindowItem value="payments">
          <SalaryPayment
            v-model:employeeInfo="employeeData"
            :update-changes="updateChanges"
          />
        </VWindowItem>
        <VWindowItem value="loan">
          <EmployeeLoan
            v-model:employeeInfo="employeeData"
            v-model:resetData="resetData"
            :update-changes="updateChanges"
          />
        </VWindowItem>
      </VWindow>
    </div>
  </template>
  
  
  <script setup>
  import { axios } from '@/plugins/axios-plugin'
import EmployeeInfo from '@/views/pages/employee/EmployeeInfo.vue'
import SalaryPayment from '@/views/pages/employee/SalaryPayment.vue'
import EmployeeLoan from '@/views/pages/employee/EmployeeLoan.vue'
  
  import { ref } from 'vue'
import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const activeTab = ref('details')
  
  // const toggleRef = ref()
  const employee_id = ref(route.params.employee_id)
  
  // tabs
  const tabs = [
    {
      title: 'جزئیات',
      icon: 'mdi-information-outline',
      tab: 'details',
    },
   
    {
      title: 'د معاشونو وصول',
      icon: 'mdi-cash-multiple',
      tab: 'payments',
    },
    {
      title: 'قرض',
      icon: 'mdi-information-outline',
      tab: 'loan',
    },
  ]
  
  const apiLoading = ref(false)
  const employeeData = ref({})
  const resetData = ref({})
  
  const snackbar = ref(false)
  
  const updateChanges = async () => {
    await getEmployeeInfo()
  
    return true
  }
  
  const getEmployeeInfo = async () => {
    try {
      apiLoading.value = true
      const { data } = await axios.get('employees/' + employee_id.value)
      employeeData.value = data
      resetData.value = JSON.parse(JSON.stringify(data))
      if (data.deleted_at) {
        snackbar.value = true
      }
    } catch (error) {
      console.error('datatable', error)
    }
    apiLoading.value = false
  }
  
  getEmployeeInfo()
  </script>
  
  <route lang="yaml">
  meta:
    navActiveLink: pages-account-settings-tab
    auth: true
  </route>
  