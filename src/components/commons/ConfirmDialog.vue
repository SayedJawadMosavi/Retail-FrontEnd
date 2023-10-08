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
          No
        </VBtn>
        <VBtn
          ripple
          :color="`${type == 'restore' ? 'info' : 'error'}`"
          variant="tonal"
          @click="confirm(true)"
        >
          Yes
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['confirm'])
const title = ref('Do you want to delete it')
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
    title.value = 'Do you want to restore it'
  }
  if (val == 'logout') {
    icon.value = 'mdi-logout-variant'
    title.value = 'Are you sure to logout ?'
  }
  if (val == 'forceDelete') {
    icon.value = 'mdi-trash'
    
    title.value='this action is not restoreble'
  }
  if (val == 'delete') {
    icon.value = 'mdi-trash'
    title.value = 'Do you want to delete it'
  }
  type.value = val
  show.value = true
}
defineExpose({
  showDialog,
})
</script>
