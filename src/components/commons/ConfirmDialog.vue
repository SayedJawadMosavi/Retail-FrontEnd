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
          نه
        </VBtn>
        <VBtn
          ripple
          :color="`${type == 'restore' ? 'info' : 'error'}`"
          variant="tonal"
          @click="confirm(true)"
        >
          هو
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['confirm'])
const title = ref('ایا تاسو غواړئ حذف کړئ؟؟')
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
    title.value = 'ایا تاسو غواړئ بیرته راګرځئ؟؟'
  }
  if (val == 'logout') {
    icon.value = 'mdi-logout-variant'
    title.value = 'ایا ته غواړې چې وتلې شې؟؟'
  }
  if (val == 'forceDelete') {
    icon.value = 'mdi-trash'
    title.value = ' دا عملیات نشي بدلیدلی او ټول اړوند معلومات به حذف شي! '
  }
  if (val == 'delete') {
    icon.value = 'mdi-trash'
    title.value = 'ایا تاسو غواړئ حذف کړئ؟'
  }
  type.value = val
  show.value = true
}
defineExpose({
  showDialog,
})
</script>
