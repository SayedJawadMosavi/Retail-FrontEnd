<template>
  <VExpandTransition>
    <div v-show="expand">
      <VCard
        title="افزودن کاربر"
        class="my-5"
      >
        <VForm ref="formRef">
          <VCardText>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.name"
                  label="نام کاربر"
                  prepend-inner-icon="mdi-account"
                  :rules="validationRules($v.name, 'نام کاربر')"
                  :autocomplete="false"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.email"
                  :autocomplete="false"
                  label="ایمل"
                  append-inner-icon="mdi-email"
                  :rules="validationRules($v.email, 'ایمل')"
                  dir="ltr"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.password"
                  autocomplete="new-password"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="validationRules($v.password, 'پسورد')"
                  :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="پسورد"
                  dir="ltr"
                  @click:append-inner="showPassword = !showPassword"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.confirm_password"
                  autocomplete="new-password"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="validationRules($v.confirm_password, 'تایید پسورد')"
                  :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="تایید پسورد"
                  dir="ltr"
                  @click:append-inner="showPassword = !showPassword"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="payload.role"
                  :items="roles"
                  label="نقش"
                  append-inner-icon="mdi-shield-sun-outline"
                  class="search-by"
                  item-title="name"
                  item-value="id"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <p class="text-base font-weight-medium mt-2">
                  صلاحیت ها:
                </p>
                <p class="font-weight-medium">
                  تعیین کنید که کاربر کدام صلاحیت ها را داشته باشد.
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
                        حذف دايمی
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <template
                      v-for="(per, index) in systems"
                      :key="index"
                    >
                      <tr v-if="per.allowed_roles.includes(payload.role)">
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

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn
              :loading="apiLoading"
              @click="validateForm"
            >
              ذخیره
            </VBtn>

            <VBtn
              color="secondary"
              variant="tonal"
              @click="closeDialog"
            >
              بستن فورم
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </div>
  </VExpandTransition>
</template>

<script setup>
import { axios } from '@/plugins/axios-plugin'
import { computed, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  numeric,
  minLength,
  maxLength,
  minValue,
  maxValue,
  email,
  helpers,
  sameAs,
} from '@vuelidate/validators'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import { toast } from 'vue3-toastify'

// ==================================== START PROPS =======================================

const props = defineProps({
  toggleExpand: { type: Function, default: () => {} },
  fetchRecord: { type: Function, default: () => {} },
})

// ==================================== START DATA =======================================

const apiLoading = ref(false)
const isSubmited = ref(false)
const showPassword = ref(false)
const roles = [
  { id: 'admin', name: 'ادمین' },
  { id: 'finance_manager', name: 'مدیر مالی' },
  { id: 'bank_manager', name: 'مدیر صرافی' },
]

const payload = ref({
  name: null,
  password: null,
  email: null,
  confirm_password: null,
  role: null,
  permissions: [],
})
const expand = ref(false)
const formRef = ref()
const systems = [
  {
    system_id: 'users',
    system_name: 'کاربران',
    actions: ['user_view', 'user_create', 'user_delete', 'user_restore', 'user_force_delete'],
    allowed_roles: ['admin'],
  },
  {
    system_id: 'employees',
    system_name: 'کارمندان',
    actions: ['employee_view', 'employee_create', 'employee_delete', 'employee_restore', 'employee_force_delete'],
    allowed_roles: ['admin'],
  },
  {
    system_id: 'salaries',
    system_name: 'معاشات',
    actions: ['salary_view', 'salary_create', 'salary_delete', 'salary_restore', 'salary_force_delete'],
    allowed_roles: ['admin', 'finance_manager'],
  },
 
]

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate
const samePassword = computed(() => {
  return payload.value.password
})

const rules = {
  name: { required, minLength: minLength(3) },
  email: { required, email },
  role: { required },
  permissions: { required },
  password: { required, minLength: minLength(6) },
  confirm_password: {
    required,
    sameAsPassword: sameAs(samePassword),
  },
}

const $v = useVuelidate(rules, payload)

// ==================================== START METHODS =======================================

const resetForm = () => {
  payload.value = {
    name: null,
    password: null,
    email: null,
    confirm_password: null,
    role: null,
    permissions: [],
  }
  $v.value.$reset()
  formRef.value.resetValidation()
}

function openDialog() {
  expand.value = true
}

function closeDialog() {
  isSubmited.value = false
  expand.value = false
  resetForm()
}

async function submit() {
  try {
    apiLoading.value = true
    const res = await axios.post('users', payload.value)
    isSubmited.value = true
    closeDialog()
    props.fetchRecord()
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

const validateForm = async () => {
  formRef.value.validate()
  if ($v.value.$invalid) {
    toast.error('لطفا فورم را دقیق خانه پری کنید!')

    return false
  }
  submit()
}

watch(payload.value.role,  () => {
  payload.value.permissions = []
})

// ==================================== START Expose =======================================

defineExpose({
  openDialog,
})
</script>

<style>
.dp__input {
  padding: 12px 4px 12px 40px !important;
}

.dp__theme_dark,
.dp__theme_light {
  --dp-background-color: rgb(var(--v-theme-surface));
  --dp-text-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  --dp-hover-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
  --dp-hover-text-color: gba(var(--v-theme-on-surface), 1);
  --dp-hover-icon-color: var(--v-theme-on-surface);
  --dp-primary-color: #40A579;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #8A8D93;
  --dp-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  --dp-menu-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  --dp-border-color-hover: rgba(var(--v-border-color), var(--v-medium-emphasis-opacity)) --dp-border-radius:10px !important;
  --dp-disabled-color: var(--v-disabled-opacity);
  --dp-scroll-bar-background: var(--v-theme-on-surface);
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  --dp-danger-color: #e53935;
  --dp-highlight-color: rgba(0, 92, 178, 0.2);
}
</style>
