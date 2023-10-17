<template>
    <div class="vendor-print-only" style="direction: rtl;">
      <div style="display: flex; justify-content: space-between; margin: 10px 0px">
        <div style="display: flex; align-items: center; flex-direction: column">
          <div>سیستم فروشات احمدی</div>
        </div>
      </div>
      <div style="text-align: left">
        <div style="display: flex; justify-content: space-between">
          <div> اسم معامله دار : {{ printItem[0]?.vendor_id }}</div>
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
            شماره
          </th>
        
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          اسم معامله دار
          </th>
        
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          مصارف اضافی
          </th>
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
           مجموع پول
          </th>
         
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
           پرداخت شده
          </th>
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
        باقیمانده
          </th>
          <th style="text-align: left; font-size: 12px; border: 1px solid grey; padding: 0px 6px">
          تاریخ
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
  