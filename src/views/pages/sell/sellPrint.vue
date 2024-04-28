<template>
  <div class="order-print-only" style="direction: rtl">
    <div style="border: 1px solid black; border-radius: 10px; padding: 15px">
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex; align-items: center; flex-direction: column">
          <div style="color: black; font-size: 16px">
            <div style="color: black; font-size: 13px" />
            Zaher Taher Mandozai Trading .Co
          </div>
        </div>

        <div style="display: flex; align-items: start; flex-wrap: nowrap">
          <div class="d-flex" style="padding-right: 12px">
            <div style="color: black; font-size: 16px">دظاهر طاهر مندوزی تجارتی شرکت</div>
          </div>

          <!--
            <div
            style="scale: 1.1"
            v-html="logo"
            /> 
          -->
        </div>
      </div>
      <div style="font-size: 14px; color: black; direction: rtl; margin-top: 20px">
        پته: ګل خان مومند پلازه، میوند سړک، کابل
      </div>
      <div style="font-size: 14px; color: black disply:flex">
        0771468882 - شماره تماس : 0774747068
      </div>

      <div style="font-size: 14px; color: black">
        <span style="direction: rtl"> 02502100001171 : اکونت دالری</span>

        <span style="direction: rtl"> 02502200000837 : اکونت افغانی</span>
      </div>
    </div>
    <!--
      <div style="border: 1px solid #40a579; border-radius: 10px; padding: 15px">
      <div style="display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center; flex-direction: column">
      <div style="color: #40a579; font-size: 12px">
      Retail MIS Management System
      </div>
      <div style="color: #40a579; font-size: 12px">
      د پرچون مدیریت سیسټم
      </div>
      </div>

      <div style="font-size: 10px; color: #40a579">
      شماره تماس : 07775645645
      </div>
      <div style="display: flex; align-items: start; flex-wrap: nowrap">
      <div
      class="d-flex"
      style="padding-right: 12px"
      >
      <div style="color: #40a579; font-size: 12px">
      Retail Mis
      </div>
      <div style="color: #40a579; font-size: 12px">
      احمدی فروشگاه
      </div>
      </div>
      <div
      style="scale: 1.1"
      v-html="logo"
      />
      </div>
      </div>
      <div style="font-size: 14px; color: #40a579; direction: rtl; margin-top: 10px">
      پته: کابل، شهرنو سړک، د ټانک ټېل پارک ټاور ته مخامخ
      </div>
      </div> 
    -->

    <div
      style="
        text-align: right;
        direction: rtl;
        margin-top: 20px;
        font-size: 12px !important;
      "
    >
      <div>نیټه: {{ formateDateBill(new Date()) }}</div>
      <div style="display: flex; justify-content: space-between">
        <div style="min-width: 160px">بل نمبر: {{ printItem?.id }}</div>
      </div>

      <div style="display: flex; justify-content: space-between">
        <div v-if="printItem.customer?.type != 'walkin'">
          پیریدونکي نوم :
          {{
            printItem?.customer?.first_name
              ? printItem?.customer?.first_name
              : printItem?.first_name
          }}
        </div>
        <div v-if="printItem.customer?.type == 'walkin'">
          پیریدونکي نوم :
          {{ printItem?.walkin_name }}
        </div>
      </div>
    </div>
    <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px" />
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
          مجموعه
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
          اندازه
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
          دکارتن تعداد
        </th>
        <!-- 
          <th
          style="
          font-weight: 500 !important;

          text-align: right;
          font-size: 12px;
          border: 1px solid grey;
          padding: 0px 6px;
          "
          >
          د ګدام نوم
          </th> 
        -->
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
          د محصول نوم
        </th>
      </tr>
      <tr v-for="(item, i) in props.printItem.items" :key="i">
        <td
          style="
            width: 16.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ item?.total }}
        </td>

        <td
          style="
            width: 16.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ item.cost ?? 0 }}
        </td>

        <td
          style="
            width: 16.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ item?.quantity }}
        </td>

        <td
          style="
            width: 16.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ item?.carton_quantity }}
        </td>

        <!--
          <td
          style="
          width: 16.66%;
          text-align: right;
          border: 1px solid grey;
          padding: 0px 6px;
          "
          >
          {{ item?.product_stock.stock.name }}
          </td> 
        -->
        <td
          style="
            width: 30.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
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
          <span style="min-width: 80px; display: inline-block">د کارتن مجموعه:</span
          >{{ printItem?.total_carton }}
        </div>
        <div style="margin-bottom: 4px">
          <span style="min-width: 80px; display: inline-block">د قیمت مجموعه:</span
          >{{ printItem?.total_amount }}
        </div>
        <div style="margin-bottom: 4px">
          <span style="min-width: 80px; display: inline-block">ورکړ شوی:</span>
          {{ printItem?.total_paid ?? 0 }}
        </div>
        <div>
          <span style="min-width: 80px; display: inline-block">باقیمانده:</span>
          {{ printItem?.total_amount - printItem?.total_paid }}
        </div>
      </div>

      <div style="">د ګوتو ځای</div>

      <div style="">د مهر او لاسلیک ځای</div>
    </div>
  </div>
</template>

<script setup>
import { formateDateBill } from "@/@core/utils/index";
import logo from "@/assets/logo.svg?raw";

const props = defineProps({
  printItem: {
    type: Object,
    default: () => {},
  },
});
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
