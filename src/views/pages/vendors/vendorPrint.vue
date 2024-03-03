<template>
  <div
    class="vendor-print-only"
    style="direction: rtl;"
  >
    <div style="display: flex; justify-content: space-between; margin: 10px 0px">
      <div style="display: flex; align-items: center; flex-direction: column">
        <div>د خرڅ مدیریت سیسټم</div>
      </div>
    </div>
    <div style="text-align: left">
      <div style="display: flex; justify-content: space-between">
        <div> د سوداګر نوم : {{ printItem[0]?.vendor.name }}</div>
        <div>تاریخ: {{ moment(new Date()).format("ll") }}</div>
      </div>
    </div>
    <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px">
    <table
      style="width: 100%; border-collapse: collapse;direction: rtl;"
      class="print-table"
    >
      <tr class="">
        <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          شمیره
        </th>
        
        <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          د سوداګر نوم
        </th>
        
        <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          اضافی لګښت
        </th>
        <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          د پیسو مجموعه
        </th>
         
        <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          ورکړې شوی
        </th>
        <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          پاتي
        </th>
        <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          نیټه
        </th>
      </tr>
  
      <tr
        v-for="(item, i) in printItem"
        :key="i"
        style="direction: rtl;"
      >
        <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap;direction: ltr;">
          {{ i + 1 }}
        </td>
      
        <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.vendor.name ?? 'name' }}
        </td>
     
        <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.extra_expense_sum_price ?? 0 }}
        </td>
        <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.total_price?.toFixed(2) ?? 30 }}
        </td>
        
        <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.payments_sum_amount ?? 90 }}
        </td>
  
        <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ item?.remainder?.toFixed(2) ?? 43 }}
        </td>
        <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
          {{ moment(item.created_at, "YYYY-MM-DD").format("ll") }}
        </td>
      </tr>
    </table>
  </div>
</template>
  
<script setup>
import moment from "moment"
  
const props = defineProps({
  printItem: {
    type: Array,
    default: () => [],
  },
})
</script>
  
  <style>
  .vendor-print-only {
    display: none;
    font-family: sans-serif;
  }
  .print-table table,
  .print-table th,
  .print-table td {
    border: 1px solid grey;
  }
  @media print {
    .vendor-print-only {
      display: block;

    }
    .always-displayed {
      display: none;
    }
  }
  </style>
  