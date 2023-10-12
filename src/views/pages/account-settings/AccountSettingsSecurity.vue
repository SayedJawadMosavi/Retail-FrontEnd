<template>
  <VCard style="pointer-events: none">
    <VCardText>
      <p class="text-base font-weight-medium mt-2">
        نقش:
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
            صلاحیت ها:
          </p>
          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th scope="col">
                  دسترسی به سیستم
                </th>
                <th scope="col">
                  دیدن معلومات
                </th>
                <th scope="col">
                  ایجاد و ویرایش معلومات
                </th>
                <th scope="col">
                  حذف معلومات
                </th>
                <th scope="col">
                  بازیابی معلومات
                </th>
                <th scope="col">
                  حذف دایمی
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
  { id: 'admin', name: 'ادمین' },
  { id: 'finance_manager', name: 'مدیر مالی' },
  { id: 'bank_manager', name: 'مدیر صرافی' },
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
    system_name: 'کاربران',
    actions: ['user_view', 'user_create', 'user_delete', 'user_restore','user_force_delete'],
    allowed_roles: ['admin'],
  },
  {
    system_id: 'employees',
    system_name: 'کارمندان',
    actions: ['employee_view', 'employee_create', 'employee_delete', 'employee_restore','car_force_delete'],
    allowed_roles: ['admin'],
  },
  {
    system_id: 'salaries',
    system_name: 'معاشات',
    actions: ['salary_view', 'salary_create', 'salary_delete', 'salary_restore','car_force_delete'],
    allowed_roles: ['admin', 'finance_manager'],
  },
 
]

const getRole = () => {
  let color = ''
  let name = ''
  if (store.user.role == 'admin') {
    name = 'ادمین'
    color = 'primary'
  } else if (store.user.role == 'finance_manager') {
    name = 'مدیر مالی'
    color = 'info'
  } else {
    name = 'مدیر صرافی'
    color = 'warning'
  }

  return { name, color }
}
</script>

