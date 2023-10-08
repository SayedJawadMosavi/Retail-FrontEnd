<template>
  <VCard style="pointer-events: none">
    <VCardText>
      <p class="text-base font-weight-medium mt-2">
    Role :
        <VChip
          small
          :color="getRole().color"
          class="font-weight-medium ms-2"
        >
          {{ getRole().name }}
        </VChip>
      </p>

      <VRow>
        <VCol cols="12">
          <p class="text-base font-weight-medium mt-2">
          permissions
          </p>
          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th scope="col">
                    Access To System
                </th>
                <th scope="col">
                    View Information
                </th>
                <th scope="col">
                Create and Edit Information
                </th>
                <th scope="col">
                Delete Information
                </th>
                <th scope="col">
                  Restore Information
                </th>
                <th scope="col">
                Delete For Ever
                </th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="(per, index) in systems"
                :key="index"
              >
                <tr>
                  <td>
                    {{ per.system_name }}
                  </td>
                  <td>
                    <VCheckbox
                      v-model="payload.permissions"
                      :value="per.actions[0]"
                    />
                  </td>
                  <td>
                    <VCheckbox
                      v-model="payload.permissions"
                      :value="per.actions[1]"
                    />
                  </td>
                  <td>
                    <VCheckbox
                      v-model="payload.permissions"
                      :value="per.actions[2]"
                    />
                  </td>
                  <td>
                    <VCheckbox
                      v-model="payload.permissions"
                      :value="per.actions[3]"
                    />
                  </td>
                  <td>
                    <VCheckbox
                      v-model="payload.permissions"
                      :value="per.actions[4]"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </VTable>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>


<script setup>
import { axios } from '@/plugins/axios-plugin'
import { useStoreAuth } from '@/store/authStore'
const store = useStoreAuth()

const payload = ref({
  role: store.user.role,
  permissions: store.user.permissions,
})

const apiLoading = ref(false)

const roles = [
  { id: 'admin', name: 'Admin' },
  { id: 'finance_manager', name: 'Financial Manager' },
  { id: 'bank_manager', name: 'Editor' },
]
const validateForm = async () => {
  formRef.value.validate()
  if ($v.value.$invalid) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  submit()
}

async function submit() {
  try {
    apiLoading.value = true
    const res = await axios.post('users', payload.value)
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

watch(payload.value.role, async () => {
  payload.value.permissions = []
})
const resetForm = ref()
const systems = [
  {
    system_id: 'users',
    system_name: 'Users',
    actions: ['user_view', 'user_create', 'user_delete', 'user_restore','user_force_delete'],
    allowed_roles: ['admin'],
  },
  {
    system_id: 'customers',
    system_name: 'customers',
    actions: ['customer_view', 'customer_create', 'customer_delete', 'customer_restore','customer_force_delete'],
    allowed_roles: ['admin'],
  },
  {
    system_id: 'employees',
    system_name: 'employees',
    actions: ['employee_view', 'employee_create', 'employee_delete', 'employee_restore','employee_force_delete'],
    allowed_roles: ['admin'],
  },
  {
    system_id: 'salaries',
    system_name: 'salaries',
    actions: ['salary_view', 'salary_create', 'salary_delete', 'salary_restore','salary_force_delete'],
    allowed_roles: ['admin', 'finance_manager'],
  },
  {
    system_id: 'vendor',
    system_name: 'vendor',
    actions: ['vendor_view', 'vendor_create', 'vendor_delete', 'vendor_restore','vendor_force_delete'],
    allowed_roles: ['admin', 'finance_manager','editor'],
  },
  {
    system_id: 'packages',
    system_name: 'Pakages',
    actions: ['package_view', 'package_create', 'package_delete', 'package_restore','package_force_delete'],
    allowed_roles: ['admin', 'finance_manager','editor'],
  },
  {
    system_id: 'purchases',
    system_name: 'Purchases',
    actions: ['purchase_view', 'purchase_create', 'purchase_delete', 'purchase_restore','purchase_force_delete'],
    allowed_roles: ['admin', 'finance_manager','editor'],
  },
  {
    system_id: 'contracts',
    system_name: 'Contracts',
    actions: ['contract_view', 'contract_create', 'contract_delete', 'contract_restore','contract_force_delete'],
    allowed_roles: ['admin', 'finance_manager','editor'],
  },
  {
    system_id: 'incomes',
    system_name: 'Expense Income',
    actions: ['income_view', 'income_create', 'income_delete', 'income_restore','income_force_delete'],
    allowed_roles: ['admin', 'finance_manager'],
  },
 
]

const getRole = () => {
  let color = ''
  let name = ''
  if (store.user.role == 'admin') {
    name = 'Admin'
    color = 'primary'
  } else if (store.user.role == 'finance_manager') {
    name = 'Financial Manager'
    color = 'info'
  } else {
    name = 'Editor'
    color = 'warning'
  }

  return { name, color }
}
</script>

