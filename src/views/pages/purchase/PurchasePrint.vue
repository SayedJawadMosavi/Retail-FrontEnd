<template>
  <div
    class="order-print-only"
    style="direction: rtl"
  >
    <div style="border: 1px solid black; border-radius: 10px; padding: 15px">
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex; align-items: center; flex-direction: column">
          <div style="color: black; font-size: 16px">
            <div style="color: black; font-size: 13px" />
            Zaher Taher Mandozai Trading .Co
          </div>
        </div>

        <div style="display: flex; align-items: start; flex-wrap: nowrap">
          <div
            class="d-flex"
            style="padding-right: 12px"
          >
            <div style="color: black; font-size: 16px">
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
      <div style="border: 1px solid #40a579; border-radius: 14px; padding: 15px">
      <div style="display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center; flex-direction: column">
      <div style="color: #40a579; font-size: 12px">Retail MIS Management System</div>
      <div style="color: #40a579; font-size: 12px">د پرچون مدیریت سیسټم</div>
      </div>

      <div style="font-size: 10px; color: #40a579">تیلفون شمیره : 07775645645</div>
      <div style="display: flex; align-items: start; flex-wrap: nowrap">
      <div
      class="d-flex"
      style="padding-right: 12px"
      >
      <div style="color: #40a579; font-size: 12px">Retail Mis</div>
      <div style="color: #40a579; font-size: 12px">احمدی فروشگاه</div>
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
      <div>تاریخ: {{ formateDateBill(new Date()) }}</div>
      <div style="display: flex; justify-content: space-between">
        <div style="min-width: 160px">
          بل نمبر: {{ printItem?.id }}
        </div>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div style="min-width: 160px">
          کانټینر نمبر: {{ printItem?.container_id }}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between">
        <div>د سوداګر نوم: {{ printItem?.vendor?.name }}</div>
        <div style="min-width: 160px">
          کانټینر نوم: {{ printItem?.container?.name }}
        </div>
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
          مجموعه په دالر
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
          قیمت په ین
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
          د تبادلی نرخ
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
          دکارتن ترلاسه شوی
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
          پاتې
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
          ترلاسه شوی
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
      <tr
        v-for="(item, i) in props.printItem.items"
        :key="i"
      >
        <td
          style="
            width: 16.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ item?.total ?? 0 }}
        </td>
        <td
          style="
            width: 16.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ item.yen_cost ?? 0 }}
        </td>
        <td
          style="
            width: 16.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ item?.rate }}
        </td>
        <td
          style="
            width: 16.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ item?.receive_carton }}
        </td>
        <td
          style="
            width: 16.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ item?.carton }}
        </td>
        <td
          style="
            width: 16.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ item?.quantity - item?.received }}
        </td>
        <td
          style="
            width: 16.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ item?.received }}
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
            width: 30.66%;
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ item?.product.product_name }}
        </td>
      </tr>
    </table>
    <!-- <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px"> -->

    <div
      v-show="props.printItem?.extra_expense?.length > 0"
      style="font-size: 12px !important"
    >
      <p style="direction: rtl; margin-bottom: 5px">
        مصارف اضافی
      </p>
      <table
        style="width: 100%; border-collapse: collapse"
        class="order-table"
      >
        <tr>
          <th
            style="
              width: 16.66%;
              text-align: right;
              font-size: 12px;
              border: 1px solid grey;
              padding: 0px 6px;
            "
          >
            بیه
          </th>
          <th
            style="
              width: 30.66%;
              text-align: right;
              font-size: 12px;
              border: 1px solid grey;
              padding: 0px 6px;
            "
          >
            د جنس نوم
          </th>
        </tr>
        <tr
          v-for="(item, i) in props.printItem.extra_expense"
          :key="i"
        >
          <td
            style="
              width: 16.66%;
              text-align: right;
              border: 1px solid grey;
              padding: 0px 6px;
            "
          >
            {{ item.price }}
          </td>
          <td
            style="
              width: 30.66%;
              text-align: right;
              border: 1px solid grey;
              padding: 0px 6px;
            "
          >
            {{ item.name }}
          </td>
        </tr>
      </table>
      <hr
        style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px"
      >
    </div>

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
          <span style="min-width: 80px; display: inline-block"> نرخ تبادله:</span>
          {{ printItem?.rate }}
        </div>
        <div style="margin-bottom: 4px">
          <span style="min-width: 80px; display: inline-block">مجموع قیمت به ین:</span>
          {{ printItem?.items_sum_yen_cost }}
        </div>
        <div style="margin-bottom: 4px">
          <span style="min-width: 80px; display: inline-block">مجموع قیمت:</span>{{ printItem?.total_price?.toFixed(2) }}
        </div>
        <div style="margin-bottom: 4px">
          <span style="min-width: 80px; display: inline-block">پرداخت شده:</span>
          {{ printItem?.payments_sum_amount ?? 0 }}
        </div>
        <div>
          <span style="min-width: 80px; display: inline-block">باقیمانده:</span>
          {{ printItem?.remainder?.toFixed(2) }}
        </div>
      </div>

      <div style="">
        د ګوتو ځای
      </div>

      <div style="">
        د مهر او لاسلیک ځای
      </div>
    </div>
  </div>
</template>

<script setup>
import { formateDateBill } from "@/@core/utils/index"
import logo from "@/assets/logo.svg?raw"

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
