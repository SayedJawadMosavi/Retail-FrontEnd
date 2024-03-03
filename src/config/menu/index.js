
import backup_menu from "./backup"
import customer_menu from "./customer_menu"
import employee_menu from "./employee_menu"
import expense_income_menu from "./expense_income_menu"
import product_menu from "./product_menu"
import profit_lost from "./profit_lost_menu"
import purchase_menu from "./purchase_menu"
import report_menu from "./report_menu"
import sell_menu from "./sell_menu"
import stock__product_transfer_menu from "./stock__product__transfer_menu"
import stock_product_menu from "./stock_product_menu"
import stock_to_stock_transfer_menu from "./stock_to_stock_transfer_menu"
import treasury_menu from "./treasuryLog_menu"
import user_menu from "./user_menu"
import vendor_menu from "./vendor_menu"


const menus = [

  ...user_menu,
  ...treasury_menu,
  ...vendor_menu,
  ...product_menu,
  ...purchase_menu,
  ...stock__product_transfer_menu,
  ...stock_product_menu,
  ...stock_to_stock_transfer_menu,
  ...customer_menu,
  ...sell_menu,
  ...expense_income_menu,
  ...employee_menu,
  ...backup_menu,
  ...profit_lost,
  ...report_menu,

]
export default menus
