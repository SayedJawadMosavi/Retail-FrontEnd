

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
      min-height="500"
    >
      <VCardText class="pt-2 text-center">
        <VImg
          :src="pnglogo"
          style="width: 100%; height: 200px;"
          class=""
        />

        <h5
          class=" mb-1 px-4 mt-2"
          style="color: #9155FD;font-size: 18px;"
        >
          د پرچون مدیریت سیسټم ته ننوتل 
        </h5>
      </VCardText>

      <VCardText class="">
        <VForm ref="formRef">
          <VRow>
            <!-- name -->
            <VCol cols="12">
              <VTextField
                v-model="form.name"
                dir="ltr"
                label="Name"
                type="name"
                :rules="validationRules(v$.name, 'name')"
                @keydown.enter="submit"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                dir="ltr"
                label="Password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :rules="validationRules(v$.password, 'password')"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                @keydown.enter="submit"
              />

              <VBtn
                class="mt-8"
                block
                :loading="loading"
                @click="validateForm"
              >
                سیسټم ته ننوتل
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

 
    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    /> 
    

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>




<script setup>
import { useTheme } from 'vuetify'
import logo from '@/assets/profile.svg?raw'
import pnglogo from '@/assets/logo.png'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import authV1MaskDark from '@/assets/images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@/assets/images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@/assets/images/pages/auth-v1-tree-2.png'
import authV1Tree from '@/assets/images/pages/auth-v1-tree.png'
import useAuth from '@/plugins/authServices'
import useRules from '@/plugins/vuelidate/vuelidateRules'
import { useVuelidate } from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import { toast } from 'vue3-toastify'
const formRef = ref()
const form = ref({
  name: '',
  password: '',
  remember: false,
})
const { login, isAuthenticated } = useAuth()
const vuetifyTheme = useTheme()
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})
const validationRules = useRules.validate
  
const rules = {

  password: { required },
  name: { required ,name},
 

  
}
  
const v$ = useVuelidate(rules, form)
const isPasswordVisible = ref(false)
const loading = ref(false)
const submit = async () => {
  // login(name,password)
  loading.value = true
  await login(form.value.name, form.value.password)
  loading.value = false
}
const validateForm = async () => {
  formRef.value.validate()
  v$.value.$touch()
  if (v$.value.$invalid) {
    toast.error('مهربانی وکړې فورم صحیح ډک کړئ!')
      
    return false
  }
  submit()
  v$.value.$reset()
}
</script>

<style lang="scss">
@use '@core/scss/pages/page-auth.scss';
</style>






<route lang="yaml">
meta:
  layout: blank
  auth: false
</route>
