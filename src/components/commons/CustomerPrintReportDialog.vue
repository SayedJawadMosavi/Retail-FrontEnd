<template>
  <div class="dialog-print-only">
    <div style="margin: 10px 0px">
      <div style="display: flex; justify-content: space-between">
        <div>{{ title }}</div>
        <div>د پرچون مدیریت سیسټم</div>
      </div>
    </div>

    <hr style="padding: 0 10px; height: 1px; background-color: black; margin: 10px 0px">
    <table
      style="width: 100%; border-collapse: collapse"
      class="print-table"
    >
      <tr class="">
        <th
          v-for="(header, index) in headers"
          :key="index"
          style="
            text-align: right;
            font-size: 12px;
            border: 1px solid grey;
            padding: 0px 6px;
          "
        >
          {{ header.title }}
        </th>
      </tr>
      <tr
        v-for="(item, i) in printItem"
        :key="i"
      >
        <td
          v-for="(header, index) in headers"
          :key="index"
          style="
            text-align: right;
            border: 1px solid grey;
            padding: 0px 6px;
            white-space: nowrap;
          "
        >
          {{ header.key == "ids" ? i + 1 : "" }}

          {{ header.key == "category_name" ? item?.category?.name : "" }}
          {{ header.key == "created_b" ? item?.user?.name : "" }}
          {{ header.key == "paid_amount" ? item?.payments_sum_amount : "" }}
          {{
            header.key == "total_prices"
              ? (Number(item?.total_price) ?? 0).toFixed(2)
              : ""
          }}
          {{ header.key == "products_name" ? item?.product?.product_name : "" }}
          {{
            header.key == "product_name" ? item?.product_stock?.product?.product_name : ""
          }}
          {{ header.key == "stocks" ? item?.stock?.name : "" }}
          {{ header.key == "vendor_name" ? item?.vendor?.name : "" }}
          {{ header.key == "container_name" ? item?.container?.name : "" }}
          <!-- {{ header.key=='extra_expense_sum_price'? item?.extra_expense_sum_price: '' }} -->
          {{ header.key == "purchase_remainder" ? item?.remainder : "" }}
          {{ header.key == "sell_remainder" ? item?.remainder : "" }}
          {{
            header.key == "customer_remainders"
              ? (item.total_amount - (item.total_paid ?? 0)).toFixed(2)
              : ""
          }}
          {{ header.key == "employee_name" ? item?.employee?.first_name : "" }}
          {{ header.key == "customer_name" ? item?.customer?.first_name : "" }}
          {{ header.key == "position" ? item?.employee?.job_title : "" }}
          {{
            header.key == "created_at"
              ? moment(item.created_at, "YYYY-MM-DD").format("ll")
              : item[header.key]
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { format } from "@/@core/utils/index"
import logo from "@/assets/logo.svg?raw"
import moment from "moment"

const props = defineProps({
  printItem: {
    type: Array,
    default: () => [],
  },
  headers: {
    type: Array,
    default: () => [],
  },
  startDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "title",
  },
  flag: {
    type: String,
    default: "",
  },
  total: {
    type: Number,
    default: 0,
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
