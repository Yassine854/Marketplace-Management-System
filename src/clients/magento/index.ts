import { cancelOrder } from "./cancelOrder";
import { getPagesCount } from "./getPagesCount";
import { editOrderDetails } from "./editOrderDetails";
import { editOrderMilkRun } from "./editOrderMilkRun";
import { getOrdersByBatch } from "./getOrdersByBatch";
import { generatePickLists } from "./generatePickLists";
import { getDeliveryAgents } from "./getDeliveryAgents";
import { changeOrderStatus } from "./changeOrderStatus";
import { generateOrderSummary } from "./generateOrderSummary";
import { generateDeliveryNotes } from "./generateDeliveryNotes";
import { getMilkRunOrdersPerDate } from "./getMilkRunOrdersPerDate";

export const magento = {
  cancelOrder,
  getPagesCount,
  editOrderDetails,
  editOrderMilkRun,
  getOrdersByBatch,
  generatePickLists,
  getDeliveryAgents,
  changeOrderStatus,
  generateOrderSummary,
  generateDeliveryNotes,
  getMilkRunOrdersPerDate,
};
