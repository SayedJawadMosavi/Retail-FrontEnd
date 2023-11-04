<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="6"
    >
      <AnalyticsCurrentBalance
      
        v-model:account-money="accountMoney"
      />
    </VCol>
    <!--
      <VCol
      cols="12"
      md="6"
      >
      <AnalyticsCurrentBalanceUSD
      v-if="scope(['income_view'])"
      v-model:account-money-u="accountMoneyU"
      />
      </VCol> 
    -->

    <VCol
      v-if="scope(['dashboard_view'])"
      cols="12"
      md="12"
    >
      <AnalyticsTransactions
        v-if="scope(['dashboard_view'])"
        :transactions="transactions"
      />
    </VCol>
    <VCol
      cols="12"
      md="12"
    >
      <AnalyticsIncomeExpense
        v-if="scope(['dashboard_view'])"
        :all-income-expense="allIncomeExpense"
      />
    </VCol>
  </VRow>
</template>

<script setup>
import AnalyticsCurrentBalance from '@/views/dashboards/analytics/AnalyticsCurrentBalance.vue'

import AnalyticsTransactions from '@/views/dashboards/analytics/AnalyticsTransactions.vue'
import AnalyticsIncomeExpense from '@/views/dashboards/analytics/AnalyticsIncomeExpense.vue'

import CardStatisticsVertical from '@core/components/CardStatisticsVertical.vue'
import { scope } from '@/@core/utils/index'

import { onMounted } from 'vue'
import { axios } from '@/plugins/axios-plugin'

const totalProfit = {
  title: 'Total Profit',
  color: 'secondary',
  icon: 'mdi-poll',
  stats: '$25.6k',
  change: 42,
  subtitle: 'Weekly Project',
}
const newProject = {
  title: 'New Project',
  color: 'primary',
  icon: 'mdi-briefcase-variant-outline',
  stats: '862',
  change: -18,
  subtitle: 'Yearly Project',
}
const accountMoney = ref(0)
const accountMoneyU = ref(0)
const transactions = ref({})
const incomes = ref({})
const allIncomeExpense = ref({})
const salaries = ref([])
const orders = ref([])
const expiredData = ref([])
const getAnalytics = async () => {
  try {
    const { data } = await axios.get('analytics')

    accountMoney.value = data.account_money_usd
    transactions.value = data.transactions
    orders.value = data.expired_contract_alarm
    expiredData.value = data.expired_contract

    incomes.value = data.incomes
    salaries.value = data.salaries
    allIncomeExpense.value = data.allIncomeExpense

  } catch (error) {}
}
onMounted(async () => {
  await getAnalytics()
})
</script>

<route lang="yaml">
meta:
  auth: true
</route>
