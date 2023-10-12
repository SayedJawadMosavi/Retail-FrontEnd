<template>
  <VDialog
    v-model="show"
    transition="dialog-top-transition"
    persistent
    width="auto"
  >
    <VCard width="300">
      <VCardText class="text-center">
        <VIcon
          :class="` mb-2 ${type == 'restore' ? 'text-info' : 'text-warning'}`"
          size="60"
          :icon="icon"
        />
        <p class="font-weight-medium">
          {{ title }}
        </p>
      </VCardText>
      <VCardActions class="justify-end">
        <VBtn
          color="secondary"
          @click="confirm(false)"
        >
          نخیر
        </VBtn>
        <VBtn
          ripple
          :color="`${type == 'restore' ? 'info' : 'error'}`"
          variant="tonal"
          @click="confirm(true)"
        >
          بلی
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['confirm'])
const title = ref('آیا میخواهید حذف کنید؟')
const show = ref(false)
const type = ref('delete')
const icon = ref('mdi-alert')

const confirm = res => {
  if (res) {
    emit('confirm', type.value)
  }
  show.value = false
}
const showDialog = (val = 'delete') => {
  if (val == 'restore') {
    icon.value = 'mdi-restore'
    title.value = 'آیا میخواهید بازیابی کنید؟'
  }
  if (val == 'logout') {
    icon.value = 'mdi-logout-variant'
    title.value = 'آیا میخواهید خارج شوید؟'
  }
  if (val == 'forceDelete') {
    icon.value = 'mdi-trash'
    title.value = ' این عملیه قابل بازگشت نیست و تمام معلومات مربوط آن حذف میشود! '
  }
  if (val == 'delete') {
    icon.value = 'mdi-trash'
    title.value = 'آیا میخواهید حذف کنید؟'
  }
  type.value = val
  show.value = true
}
defineExpose({
  showDialog,
})
</script>
