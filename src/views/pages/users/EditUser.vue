<template>
  <VExpandTransition>
    <div v-show="expand">
      <VCard
        title="Edit User"
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
                  label="User Name"
                  prepend-inner-icon="mdi-account"
                  :rules="validationRules($v.name, 'User Name')"
                  :autocomplete="false"
                />
              </VCol>
            </VRow>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.trim="payload.email"
                  :autocomplete="false"
                  label="Email"
                  append-inner-icon="mdi-email"
                  :rules="validationRules($v.email, 'Email')"
                  dir="ltr"
                />
              </VCol>
            </VRow>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="payload.role"
                  :items="roles"
                  label="Role"
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
              permissions
                </p>
                <p class="font-weight-medium">
                  Modify which user should have permissions
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
             Edit
            </VBtn>

            <VBtn
              color="secondary"
              variant="tonal"
              @click="closeDialog"
            >
              Close Form
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

const emit = defineEmits(['closeForm'])

// ==================================== START DATA =======================================

const apiLoading = ref(false)
const roles = [
  { id: 'admin', name: 'Admin' },
  { id: 'finance_manager', name: 'Financial Manager' },
  { id: 'bank_manager', name: 'Editor' },
]

const payload = ref({
  id: null,
  name: null,
  email: null,
  role: null,
  permissions: [],
})
const expand = ref(false)
const formRef = ref()
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
 
 
]

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate
const samePassword = computed(() => {
  return payload.value.password
})

const rules = {
  id: { required },
  name: { required, minLength: minLength(3) },
  email: { required, email },
  role: { required },
  permissions: { required },
}

const $v = useVuelidate(rules, payload)

// ==================================== START METHODS =======================================

const downloadForm = () => {
 
}
const resetForm = () => {
  payload.value = {
    id: null,
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

function openDialog(item) {
  payload.value.id = structuredClone(item.id)
  payload.value.name = structuredClone(item.name)
  payload.value.email = structuredClone(item.email)
  payload.value.role = structuredClone(item.role)
  payload.value.permissions = JSON.parse(JSON.stringify(item.permissions))
  expand.value = true
}

function closeDialog() {
  expand.value = false
  resetForm()
}

async function submit() {
  try {
    apiLoading.value = true
    const res = await axios.put('edit-users', payload.value)
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

watch(payload.value.role, async () => {
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
