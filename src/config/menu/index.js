
import employee_menu from "./employee_menu"
import product_menu from "./product_menu"
import purchase_menu from "./purchase_menu"
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
  ...employee_menu,

]
export default menus
