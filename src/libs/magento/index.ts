import { generatePickLists } from "./generatePickLists";
import { generateDeliveryNotes } from "./generateDeliveryNotes";
import { cancelOrder } from "./cancelOrder";
import { getOrdersByBatch } from "./getOrdersByBatch";
import { changeOrderStatus } from "./changeOrderStatus";
import { generateOrderSummary } from "./generateOrderSummary";
import { getPagesCount } from "./getPagesCount";
import { editOrderDetails } from "./editOrderDetails";

export const magento = {
  generateDeliveryNotes,
  generatePickLists,
  cancelOrder,
  getOrdersByBatch,
  changeOrderStatus,
  generateOrderSummary,
  getPagesCount,
  editOrderDetails,
};
