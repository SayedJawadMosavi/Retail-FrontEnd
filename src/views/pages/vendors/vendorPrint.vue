<template>
    <div class="vendor-print-only" style="direction: ltr;">
      <div style="display: flex; justify-content: space-between; margin: 10px 0px">
        <div style="display: flex; align-items: center; flex-direction: column">
          <div>Safawave ICT</div>
        </div>
      </div>
      <div style="text-align: left">
        <div style="display: flex; justify-content: space-between">
          <div> Vendor ID: {{ printItem[0]?.vendor_id }}</div>
          <div>Date: {{ moment(new Date()).format("ll") }}</div>
        </div>
      </div>
      <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px">
      <table
        style="width: 100%; border-collapse: collapse;direction: ltr;"
        class="print-table"
      >
        <tr class="">
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
            Number
          </th>
        
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
           Vendor Name
          </th>
        
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
           Extra Expense
          </th>
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
           Total Cost
          </th>
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
           Currency
          </th>
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
           Total Paid
          </th>
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          Balance
          </th>
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
           Register Date
          </th>
        </tr>
  
        <tr style="direction: rtl;"
          v-for="(item, i) in printItem"
          :key="i"
        >
          <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap;direction: ltr;" >
            {{ i + 1 }}
          </td>
      
          <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
            {{ item?.vendor.name ?? 'name' }}
          </td>
     
          <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
            {{ item?.extra_expense_sum_price ?? 0 }}
          </td>
          <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
            {{ item?.total_price ?? 30 }}
          </td>
          <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
            {{ item?.currency ?? '' }}
          </td>
          <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
            {{ item?.payments_sum_amount ?? 90 }}
          </td>
  
          <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
            {{ item?.remainder ?? 43 }}
          </td>
          <td style="text-align: left; border: 1px solid grey; padding: 0px 6px; white-space: nowrap">
            {{  moment(item.created_at, "YYYY-MM-DD").format("ll") }}
          </td>
        </tr>
      </table>
    </div>
  </template>
  
  <script setup>
  import moment from "moment";
  
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
  