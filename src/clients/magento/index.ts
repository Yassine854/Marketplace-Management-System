import { cancelOrder } from "./mutations/cancelOrder";
import { getPagesCount } from "./queries/getPagesCount";
import { getOrdersByBatch } from "./queries/getOrdersByBatch";
import { editOrderDetails } from "./mutations/editOrderDetails";
import { editOrderMilkRun } from "./mutations/editOrderMilkRun";
import { getDeliveryAgents } from "./queries/getDeliveryAgents";
import { generatePickLists } from "./mutations/generatePickLists";
import { changeOrderStatus } from "./mutations/changeOrderStatus";
import { generateOrderSummary } from "./mutations/generateOrderSummary";
import { generateDeliveryNotes } from "./mutations/generateDeliveryNotes";
import { getMilkRunOrdersByDate } from "./queries/getMilkRunOrdersByDate";

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
  getMilkRunOrdersByDate,
};
