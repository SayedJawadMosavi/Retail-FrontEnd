
<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Account Details">
        <VForm ref="formRef">
          <VDivider />
          <VCardText>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="payload.name"
                  label="User Name"
                  prepend-inner-icon="mdi-account"
                  :rules="validationRules($v.name, 'User Name')"
                />
              </VCol>
            </VRow>
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="payload.email"
                  label="Email"
                  append-inner-icon="mdi-email"
                  :rules="validationRules($v.email, 'Email')"
                  dir="ltr"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn
              :loading="apiLoading"
              @click="validateForm"
            >
              Save
            </VBtn>

            <VBtn
              color="secondary"
              variant="tonal"
              @click="closeDialog"
            >
              Restore
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Change Password">
        <VForm ref="passwordRef">
          <VCardText>
            <!-- 👉 Current Password -->
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="4"
              >
                <!-- 👉 current password -->
                <VTextField
                  v-model.trim="passwordPayload.current_password"
                  :rules="validationRules($v2.current_password, 'Current Password')"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="Current Password"
                  dir="ltr"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                />
              </VCol>
            </VRow>

            <VRow>
              <VCol
                cols="12"
                md="4"
              >
                <!-- 👉 new password -->
                <VTextField
                  v-model.trim="passwordPayload.newPassword"
                  :rules="validationRules($v2.newPassword, 'New Password')"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="New Password"
                  dir="ltr"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol
                cols="12"
                md="4"
              >
                <!-- 👉 confirm password -->
                <VTextField
                  v-model="passwordPayload.confirm_password"
                  dir="ltr"
                  :rules="validationRules($v2.confirm_password, 'Confirm New Password')"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="Confirm New Password"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn
              :loading="apiLoading2"
              @click="submitPassword"
            >
              Save
            </VBtn>

            <VBtn
              type="reset"
              color="secondary"
              variant="tonal"
              @click="resetForm('password')"
            >
              Restore
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
  </VRow>
</template>


<script setup>
import avatar1 from '@/assets/images/avatars/avatar-1.png'
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

import { useStoreAuth } from '@/store/authStore'
const store = useStoreAuth()

const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const accountData = {
  name: store?.user?.name,
  email: store?.user?.email,
  profile: store?.user?.profile,
}

const payload = ref(structuredClone(accountData))
const profileData = ref(null)
const apiLoading = ref(false)
const formRef = ref(false)
const passwordRef = ref(false)
const apiLoading2 = ref(false)
const refInputEl = ref()

// ==================================== START VALIDATION =======================================
const validationRules = useRules.validate
const newPassword = computed(() => {
  return payload.value.newPassword
})

const rules = {
  name: { required, minLength: minLength(3) },
  email: { required },
}

const rules2 = {
  current_password: { required, minLength: minLength(6) },
  newPassword: { required, minLength: minLength(6) },
  confirm_password: {
    required,

    // sameAsPassword: sameAs(newPassword),
  },
}
const passwordPayload = ref({
  current_password: null,
  newPassword: null,
  confirm_password: null,
})

const $v = useVuelidate(rules, payload)
const $v2 = useVuelidate(rules2, passwordPayload)

const resetForm = (type = 'form') => {
  if (type == 'password') {
    passwordPayload.value.newPassword = null
    passwordPayload.value.current_password = null
    passwordPayload.value.confirm_password = null
    $v2.value.$reset()
    passwordRef.value.resetValidation()

    return
  }
  payload.value = structuredClone(accountData)
}
const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    profileData.value = files[0]
    
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') payload.value.profile = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  payload.value.profile = accountData.profile
}

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
    const data = payload.value
    let formData = new FormData()
    formData.append('name', data.name)
    formData.append('profile', profileData.value)
    console.log('profile',profileData.value)
    formData.append('email', data.email)
    const res = await axios.post('users/id?_method=PUT', formData)
    store.$updateUser({ usr: res.data })
    payload.value.name = res.data.name
    payload.value.email = res.data.email
    payload.value.profile = res.data.profile
  } catch (error) {
    console.error('error', error)
  }
  apiLoading.value = false
}

async function submitPassword() {
  try {
    passwordRef.value.validate()
    if ($v2.value.$invalid) {
      toast.error(' please fill the form correctly')

      return false
    }
    apiLoading2.value = true

    const res = await axios.post('change-password?', passwordPayload.value)
  } catch (error) {
    console.error('error', error)
  }
  apiLoading2.value = false
}
</script>
