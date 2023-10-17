
import employee_menu from "./employee_menu"
import product_menu from "./product_menu"
import purchase_menu from "./purchase_menu"
import treasury_menu from "./treasuryLog_menu"
import user_menu from "./user_menu"
import vendor_menu from "./vendor_menu"


const menus = [

  ...user_menu,
  ...treasury_menu,
  ...vendor_menu,
  ...product_menu,
  ...purchase_menu,
  ...employee_menu,

]
export default menus
