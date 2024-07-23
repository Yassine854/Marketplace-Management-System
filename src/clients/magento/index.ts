import { cancelOrder } from "./mutations/cancelOrder";
import { getAllOrdersPagesCount } from "./queries/getAllOrdersPagesCount";
import { getOrdersByBatch } from "./queries/getOrdersByBatch";
import { editOrderDetails } from "./mutations/editOrderDetails";
import { editOrderMilkRun } from "./mutations/editOrderMilkRun";
import { getDeliveryAgents } from "./queries/getDeliveryAgents";
import { generatePickLists } from "./mutations/generatePickLists";
import { changeOrderStatus } from "./mutations/changeOrderStatus";
import { generateOrderSummary } from "./mutations/generateOrderSummary";
import { generateDeliveryNotes } from "./mutations/generateDeliveryNotes";
import { getMilkRunOrdersByDate } from "./queries/getMilkRunOrdersByDate";
import { getOrderItems } from "./queries/getOrderItems";

export const magento = {
  queries: {
    getOrderItems,
    getOrdersByBatch,
    getDeliveryAgents,
    getMilkRunOrdersByDate,
    getAllOrdersPagesCount,
  },

  mutations: {
    generatePickLists,
    cancelOrder,
    editOrderDetails,
    editOrderMilkRun,
    changeOrderStatus,
    generateOrderSummary,
    generateDeliveryNotes,
  },
};
