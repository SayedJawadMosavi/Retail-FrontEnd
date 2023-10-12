

<template>
  <div class="pt-5">
    <VTabs
      v-model="activeTab"
      show-arrows
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        class="pe-3"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
        <span class="d-inline-block ps-5">{{ getTotal(item.key) }}</span>
      </VTab>
    </VTabs>

    <VDivider />

    <VCard>
      <VTable
        :headers="headers"
        :items="items"
        :item-key="itemKey"
        class="table-rounded custom-data-table"
        hide-default-footer
        disable-sort
        height="580px"
        fixed-header
        fixed-footer
      >
        <thead class="pb-2">
          <tr>
            <th class="">
              <VCheckbox
                class="me-1"
                :model-value="selectedItems.length == items.length && items.length > 0"
                @click="selectAll(selectedItems.length == items.length)"
              />
            </th>
            <th
              v-for="header in headers"
              :key="header"
              class="text-uppercase"
              style="white-space: nowrap"
            >
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody v-show="!loading">
          <tr
            v-for="(row, index) in items"
            :key="index"
          >
            <td>
              <VCheckbox
                v-model="selectedItems"
                :value="row"
              />
            </td>

            <td
              v-for="(header, j) in headers"
              :key="j"
              :style="`min-width: ${header.width};${header.key == 'created_at' ? 'white-space: nowrap' : ''}   `"
            >
              <template v-if="$slots[header.key]">
                <slot
                  :name="header.key"
                  :item="row"
                />
              </template>

              <template v-else     style="white-space: nowrap">
                {{ header.key == 'created_at' ? formateDate(row[header.key]) : row[header.key] }}
              </template>
            </td>

            <!-- status -->
          </tr>
        </tbody>
        <div
          v-show="loading"
          class="custom-progress text-center"
        >
          <VProgressCircular
            :size="50"
            color="primary"
            indeterminate
          />
          <p>بارگیری دیتا...</p>
        </div>
      </VTable>
      <VCardActions>
        <div
          v-if="extraInfo"
          class="d-flex align-center"
        >
          <div class="pe-3 text-primary me-5">
            <span class="d-inline-block pe-1">مجموع آمد: </span> {{ extraInfo.total_income }}$
          </div>
          <div class="pe-3 text-error me-5">
            <span class="d-inline-block pe-1">مجموع رفت: </span> {{ extraInfo.total_outgoing }}$
          </div>
          <div class="pe-3 me-5">
            <span class="d-inline-block pe-1"> موجودی حساب: </span>
            {{ extraInfo.total_income - extraInfo.total_outgoing }}$
          </div>
        </div>
        <VSpacer />
        <div class="align-center d-flex">
          <VSelect
            v-model="itemPerPage"
            class="item-per-page"
            density="compact"
            :items="[10, 20, 50, 100, 150]"
          />
          <VPagination
            v-model="page"
            total-visible="5"
            :length="pageLength"
          />
        </div>
      </VCardActions>
    </VCard>
  </div>
</template>



<script setup>
import { computed, ref } from 'vue'
import { formateDate } from '@/@core/utils/index'

const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
  extraTotal: {
    type: Object,
    default: () => {},
  },
  headers: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
  extraInfo: {
    type: Object,
    default: () => {},
  },
  total: {
    type: Number,
    default: 0,
  },
  itemKey: {
    type: String,
    default: 'id',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  itemPerPage: {
    type: Number,
    default: 20,
  },
})

const emit = defineEmits(['tableChange', 'tabChange'])

const activeTab = ref(0)
const selectedItems = ref([])
const page = ref(1)
const itemPerPage = ref(props.itemPerPage)
let resetPage = false
let resetTab = false

const pageLength = computed(() => {
  return Math.ceil(props.total / itemPerPage.value)
})
const currentTab = computed(() => {
  return props?.tabs[activeTab.value]?.key
})

const selectAll = all => {
  if (all) {
    selectedItems.value = []
  } else {
   
    selectedItems.value = JSON.parse(JSON.stringify(props.items))
  }
}

const getTotal = item => {
  try {
    return props.extraTotal[item]
  } catch (error) {
    return 0
  }
}
watch(itemPerPage, async () => {
  selectedItems.value = []

  if (!resetTab && !resetPage) {
    page.value = 1
    await emit('tableChange', { page: page.value, itemPerPage: itemPerPage.value, tab: currentTab })
  }
})
watch(activeTab, async () => {
  selectedItems.value = []
  resetPage = true
  resetTab = true
  page.value = 1
  itemPerPage.value = props.itemPerPage
  await emit('tableChange', { page: page.value, itemPerPage: itemPerPage.value, tab: currentTab })
  resetPage = false
  resetTab = false
})

watch(page, async () => {
  selectedItems.value = []
  if (!resetPage && !resetTab)
    await emit('tableChange', { page: page.value, itemPerPage: itemPerPage.value, tab: currentTab })
})

defineExpose({
  selectedItems,
})
</script>

<style lang="scss">
.item-per-page {
  .v-input__control {
    width: 100px !important;
  }
}

.custom-data-table {
  position: relative !important;
  .custom-progress {
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>


