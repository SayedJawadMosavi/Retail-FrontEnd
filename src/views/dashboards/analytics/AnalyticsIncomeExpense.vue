<script setup>
const props = defineProps({
  allIncomeExpense: {
    type: Array,
    default: () => [0, 0, 0, 0],
  },
})
const total_data = [

  {
    title: 'مجموع عواید ',
    stats: '12.5k',
    icon: 'mdi-currency-usd',
    color: 'success',
  },

  {
    title: 'مجموع مصارف ',
    stats: '1.54k',
    icon: 'mdi-currency-usd',
    color: 'error',
  },

]

// icon: 'mdi-trending-up',
</script>

<template>
  <VCard>
    <VCardText>
      <h6 class="text-sm mb-12">
        <span class="font-weight-regular"> تمام معلومات امروز</span>
      </h6>
      <VRow>
        <VCol
          v-for="(item, index) in total_data"
          :key="index"
          cols="6"
          sm="2"
        >
          <div class="d-flex align-center">
            <div class="me-3">
              <VAvatar
                :color="item.color"
                rounded
                size="42"
                class="elevation-1"
              >
                <VIcon
                  size="24"
                  :icon="item.icon"
                />
              </VAvatar>
            </div>

            <div class="d-flex flex-column">
              <span class="text-caption">
                {{ item.title }}
              </span>
              <span class="text-h6 font-weight-medium">{{ allIncomeExpense[index] }}</span>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
