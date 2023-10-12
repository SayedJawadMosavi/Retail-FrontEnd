<template>
  <ConfirmDialog
    ref="confirmRef"
    @confirm="onConfirm"
  />
  <div class="d-flex align-end justify-spacdeleteRecorde-between mb-2 flex-wrap">
    <div>
      <h2 class="d-flex align-start pb-1">
        <VIcon
          start
          size="small"
          :icon="pageIcon"
        />
        <span>
          {{ page }}
        </span>
      </h2>
      <VBreadcrumbs
        :items="items"
        class="pb-1"
      >
        <template #prepend>
          <VIcon
            size="small"
            icon="mdi-home-outline"
          />
        </template>
      </VBreadcrumbs>
    </div>
    <div
      class="d-flex align-center pb-1"
      style="min-width: 400px"
    >
      <VSelect
        v-model="searchBy"
        :items="searchOptions"
        label="نوع جستجو"
        density="compact"
        class="me-1 search-by"
        item-title="name"
        item-value="id"
      />
      <VTextField
        v-model.trim="search"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        class="search"
        placeholder="جستجو..."
        clearable
        @click:clear="clearSearch"
        @input="onSearch"
      />
    </div>

    <VSpacer />
    <div class="pb-0">
      <slot />

      
      <VBtn
        v-if="selectedItems?.length > 0 && showDelete && activeTab != 'trash'"
        ripple
        color="error"
        prepend-icon="mdi-trash"
        class="ms-2"
        @click="confirmRef.showDialog('delete')"
      >
        حذف
      </VBtn>
      <VBtn
        v-if="selectedItems?.length > 0 && showForceDelete && activeTab == 'trash'"
        ripple
        color="error"
        prepend-icon="mdi-trash"
        class="ms-2"
        @click="confirmRef.showDialog('forceDelete')"
      >
        حذف
      </VBtn>
      <VBtn
        v-if="selectedItems?.length > 0 && showRestore && activeTab == 'trash'"
        ripple
        color="info"
        prepend-icon="mdi-refresh"
        class="ms-2"
        @click="confirmRef.showDialog('restore')"
      >
        بازیابی
      </VBtn>

      <VBtn
        v-if="selectedItems?.length == 1 && editText?.length > 0 && activeTab != 'trash' && showCreate"
        class="ms-2"
        ripple
        prepend-icon="mdi-edit"
        @click="$emit('onCreate')"
      >
        {{ editText }}
      </VBtn>

      <VBtn
        v-if="showCreate && selectedItems?.length != 1 && activeTab != 'trash'"
        class="ms-2"
        ripple
        prepend-icon="mdi-plus"
        @click="$emit('onCreate')"
      >
        {{ createText }}
      </VBtn>
    </div>
  </div>
</template>

<script setup>
import ConfirmDialog from '@/components/commons/ConfirmDialog.vue'
import { ref } from 'vue'

const props = defineProps({
  items: Array,
  page: String,
  pageIcon: {
    type: String,
    default: 'mdi-shopping-outline',
  },
  createText: {
    type: String,
    default: '',
  },
  printText: {
    type: String,
    default: '',
  },
  editText: {
    type: String,
    default: '',
  },

  selectedItems: {
    type: Array,
    default: () => [],
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
  showPrint: {
    type: Boolean,
    default: false,
  },
  showCreate: {
    type: Boolean,
    default: true,
  },
  activeTab: {
    type: String,
    default: '',
  },
  showRestore: {
    type: Boolean,
    default: true,
  },
  showForceDelete: {
    type: Boolean,
    default: true,
  },
  searchOptions: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['onCreate', 'onDelete', 'onRestore', 'onSearch', 'onPrint', 'onForceDelete'])
const confirmRef = ref()
const search = ref('')
const timeoutId = ref()
const searchBy = ref('all')

watch(searchBy, async () => {
  if (search.value != '') {
    search.value = ''
    emit('onSearch', { search: search.value, searchBy: searchBy.value })
  }
})
const onConfirm = event => {
  if (event == 'delete') {
    emit('onDelete')
  } else if (event == 'restore') {
    emit('onRestore')
  } else if (event == 'forceDelete') {
    emit('onForceDelete')
  }
}
const clearSearch = () => {
  emit('onSearch', { search: search.value, searchBy: searchBy.value })
}
const onSearch = () => {
  clearTimeout(timeoutId.value)
  timeoutId.value = setTimeout(() => {
    emit('onSearch', { search: search.value, searchBy: searchBy.value })
  }, 800)
}
</script>

<style lang="scss">
.search {
  .v-input__control {
    width: 250px !important;
  }
}
.search-by {
  .v-input__control {
    min-width: 150 !important;
  }
}
</style>
