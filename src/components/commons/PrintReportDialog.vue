<template>
  <div class="dialog-print-only">
    <div style=" margin: 10px 0px">
      <div style="display: flex; justify-content: space-between;">
        <div>{{ title }}</div>
        
        <div>Safawave ICT</div>
        <div
            style="scale: 1.1"
            v-html="logo"
          />
      </div>
    </div>
    <div style="text-align: right">
      <div style="display: flex;">
        <div style=" min-width: 90px;">
      Start Date :
        </div> <div style="direction: rtl;">
          {{ startDate.toLocaleDateString() }}
        </div>
      </div>
      <div style="display: flex;">
        <div style=" min-width: 90px;">
        End Date
        </div> <span style="direction: rtl;">
          {{ endDate.toLocaleDateString() }}

        </span>
      </div>
    </div>
    <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px">
    <table
      style="width: 100%; border-collapse: collapse"
      class="print-table"
    >
      <tr class="">
        <th
          v-for="header,index in headers"
          :key="index"
          style="text-align: right; font-size: 12px; border: 1px solid grey; padding: 0px 6px"
        >
          {{ header.title }}
        </th>
      </tr>
      <tr
        v-for="(item, i) in printItem"
        :key="i"
      >
     
        <td
          v-for=" header,index in headers"
          :key="index"
          style="text-align: right; border: 1px solid grey; padding: 0px 6px; white-space: nowrap"
        >
      
          {{ header.key=='ids'? i+1: '' }}
       
          {{ header.key=='remainder'? item.salary-item.paid: '' }}
          {{ header.key=='total_remainder'? item.remainder: '' }}
          {{ header.key=='extra_expense_sum_prices'? item.extra_expense_sum_price==null ? 0 :item.extra_expense_sum_price: '' }}
          {{ header.key=='con_extra_expense_sum_price'? item.extra_expense_sum_price==null ? 0 :item.extra_expense_sum_price: '' }}
          {{ header.key=='created_at'? format(item?.created_at): item[header.key] }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { format } from '@/@core/utils/index'
import logo from '@/assets/logo.svg?raw'

const props = defineProps({
  printItem: {
    type: Array,
    default: () => [],
  },
  headers: {
    type: Array,
    default:()=>[],
  },
  startDate: {
    type: String,
    default:'',
  },
  endDate: {
    type: String,
    default:'',
  },
  title: {
    type: String,
    default:'title',
  },
})
</script>

<style>
.dialog-print-only {
  display: none;
  font-family: sans-serif;
}
.print-table table,
.print-table th,
.print-table td {
  border: 1px solid grey;
}
@media print {
  .dialog-print-only {
    display: block;
  }
  .always-displayed {
    display: none;
  }
}
</style>
