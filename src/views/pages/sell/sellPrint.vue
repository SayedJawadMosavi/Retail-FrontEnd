<template>
  <div
    class="order-print-only"
    style="direction: rtl"
  >
    <div style="border: 1px solid black; border-radius: 10px; padding: 15px">
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex; align-items: center; flex-direction: column">
          <div style="color: black; font-size: 12px">
            <div style="color: black; font-size: 12px">
              Zaher
            </div>
            Zaher Mandozai Trading .Co
          </div>
        </div>
  
        
        <div style="display: flex; align-items: start; flex-wrap: nowrap">
          <div
            class="d-flex"
            style="padding-right: 12px"
          >
            <div style="color: black; font-size: 12px">
              دظاهر طاهر مندوزی تجارتی شرکت
            </div>
          </div>
          
          <!--
            <div
            style="scale: 1.1"
            v-html="logo"
            /> 
          -->
        </div>
      </div>
      <div style="font-size: 14px; color: black; direction: rtl; margin-top: 12px">
        آدرس: گل خان مومند پلازه جاده میوند کابل
      </div>
      <div style="font-size: 10px; color: black disply:flex">
        0771468882 -  شماره تماس : 0764830802 
      </div>
    
      <div style="font-size: 10px; color: black ">
        <span style="direction: rtl">    02502100001171 :   اکونت دالری</span> 
       
        <span style="direction: rtl"> 02502200000837 :   اکونت افغانی</span>
      </div>
    </div>

    <div style="text-align: right; direction: rtl; margin-top: 20px; font-size: 12px !important">
      <div>تاریخ: {{ formateDateBill(new Date()) }}</div>
      <div style="display: flex; justify-content: space-between">
        <div style="min-width: 160px">
          نمبر بل: {{ printItem?.id }}
        </div>
      </div>
     

      <div style="display: flex; justify-content: space-between">
        <div>اسم مشتری : {{ printItem?.customer?.first_name }}</div>
      </div>
    </div>
    <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px">
    <table style="width: 100%; border-collapse: collapse; font-size: 12px !important">
      <tr style="font-weight: 500 !important">
        <th
          style="
            font-weight: 500 !important;
            width: 16.66%;
            text-align: right;
            font-size: 12px;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          مجموع  
        </th>
        <th
          style="
            font-weight: 500 !important;
            width: 16.66%;
            text-align: right;
            font-size: 12px;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          قیمت  
        </th>
        
        <th
          style="
            font-weight: 500 !important;
            width: 16.66%;
            text-align: right;
            font-size: 12px;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          تعداد
        </th>
       
        
        <th
          style="
            font-weight: 500 !important;
            width: 30.66%;
            text-align: right;
            font-size: 12px;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          اسم محصول
        </th>
      </tr>
      <tr
        v-for="(item, i) in props.printItem.items"
        :key="i"
      >
        <td style="width: 16.66%; text-align: right; border: 1px solid grey; padding: 0px 6px">
          {{ item?.total }}
        </td>
        <td style="width: 16.66%; text-align: right; border: 1px solid grey; padding: 0px 6px">
          {{ item.cost ?? 0 }}
        </td>
        
        <td style="width: 16.66%; text-align: right; border: 1px solid grey; padding: 0px 6px">
          {{ item?.quantity }}
        </td>
       
       
        <td style="width: 30.66%; text-align: right; border: 1px solid grey; padding: 0px 6px">
          {{ item?.product_stock.product.product_name }}
        </td>
      </tr>
    </table>
    <!-- <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px"> -->

   

    <div
      style="
        direction: rtl;
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        font-size: 12px !important;
      "
    >
      <div>
        <div style="margin-bottom: 4px">
          <span style="min-width: 80px; display: inline-block">مجموع قیمت:</span>{{ printItem?.total_price?.toFixed(2) }}
        </div>
        <div style="margin-bottom: 4px">
          <span style="min-width: 80px; display: inline-block">پرداخت شده:</span>
          {{ printItem?.payments_sum_amount ?? 0 }}
        </div>
        <div>
          <span style="min-width: 80px; display: inline-block">باقیمانده:</span> {{ printItem?.remainder?.toFixed(2) }}
        </div>
      </div>

      <div style="">
        محل شصت
      </div>

      <div style="">
        محل مهر و امضا
      </div>
    </div>
  </div>
</template>

<script setup>
import { formateDateBill } from '@/@core/utils/index'
import logo from '@/assets/logo.svg?raw'

const props = defineProps({
  printItem: {
    type: Object,
    default: () => {},
  },
})
</script>

<style>
.order-print-only {
  display: none;
  font-family: sans-serif;
}
.order-table table,
.order-table th,
.order-table td {
  border: 1px solid grey;
}
@media print {
  .order-print-only {
    display: block;
  }
  .always-displayed {
    display: none;
  }
}
</style>
