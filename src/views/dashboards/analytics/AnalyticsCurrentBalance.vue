

<template>
  <VCard style="direction: ltr;"
  title="موجودی حساب"
    subtitle=""
    class="position-relative"
  >
    <VCardText >
      <h5 class="text-2xl font-weight-medium text-primary">
        <div
          style="direction: ltr"
          class="text-start"
        >
          {{ accountMoney }} $
        </div>
        <br>
        
      </h5>
    </VCardText>

    <!-- Triangle Background -->
    <VImg
      :src="triangleBg"
      class="triangle-bg flip-in-ltr"
    />

    <!-- Trophy -->
    <VImg
      :src="trophy"
      class="trophy"
    />
  </VCard>
</template>

<script setup>
import { useTheme } from 'vuetify'
import triangleDark from '@/assets/images/misc/triangle-dark.png'
import triangleLight from '@/assets/images/misc/triangle-light.png'
import trophy from '@/assets/images/misc/trophy.png'
const props = defineProps({
  accountMoney: {
    type: Number,
    default: 0,
  },
  accountMoneyUSDaccount: {
    type: Number,
    default: 0,
  },
})

const vuetifyTheme = useTheme()
const triangleBg = computed(() => {
  console.log("DFvgdf",props.accountMoneyUSDaccount)
  return vuetifyTheme.global.name.value === 'light' ? triangleLight : triangleDark
})
</script>


<style lang="scss">
.triangle-bg {
  position: absolute;
  inline-size: 10.375rem;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.trophy {
  position: absolute;
  inline-size: 4.9375rem;
  inset-block-end: 2rem;
  inset-inline-end: 2rem;
}
</style>
