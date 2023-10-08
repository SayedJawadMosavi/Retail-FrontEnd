

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      :error-code="errorData.error"
      :error-title="errorData.title + '⚠️'"
      :error-description="errorData.description"
    />

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="misc404"
        alt="Coming Soon"
        :max-width="800"
        class="mx-auto"
      />
      <VBtn
        to="/"
        class="mt-10"
      >
          Back to Home Page
      </VBtn>
    </div>

    <!-- 👉 Footer -->
    <VImg
      :src="tree"
      class="misc-footer-tree d-none d-md-block"
    />

    <VImg
      :src="authThemeMask"
      class="misc-footer-img d-none d-md-block"
    />
  </div>
</template>


<script setup>
import { useTheme } from 'vuetify'
import misc404 from '@/assets/images/pages/404.png'
import miscMaskDark from '@/assets/images/pages/misc-mask-dark.png'
import miscMaskLight from '@/assets/images/pages/misc-mask-light.png'
import tree from '@/assets/images/pages/tree.png'
import { useRoute } from 'vue-router'

const vuetifyTheme = useTheme()
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? miscMaskLight : miscMaskDark
})

const route = useRoute()
const error = ref(route.params.all)
const errorData = ref({
  error: '404',
  title: ' page not found',
  description: '',
})
if (error.value == 'network-error') {
  errorData.value.error = 500
  errorData.value.title = 'خطا در شبکه'
  errorData.value.description = 'خطا در بارگیری دیتا رخ داد برای حل مشکل مطمعین شوید سرور فعال است '
}
</script>



<style lang="scss">
@use '@core/scss/pages/misc.scss';

.misc-footer-tree {
  inline-size: 15.625rem;
  inset-block-end: 3.5rem;
  inset-inline-start: 0.375rem;
}
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
</route>
