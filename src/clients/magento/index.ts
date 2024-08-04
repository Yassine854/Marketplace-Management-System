import { cancelOrder } from "./mutations/cancelOrder";
import { getAllSuppliers } from "./queries/getAllSuppliers";
import { getOrderProducts } from "./queries/getOrderProducts";
import { getOrdersByBatch } from "./queries/getOrdersByBatch";
import { editOrderDetails } from "./mutations/editOrderDetails";
import { editOrderMilkRun } from "./mutations/editOrderMilkRun";
import { getDeliveryAgents } from "./queries/getAllDeliveryAgents";
import { generatePickLists } from "./mutations/generatePickLists";
import { changeOrderStatus } from "./mutations/changeOrderStatus";
import { generateOrderSummary } from "./mutations/generateOrderSummary";
import { getAllOrdersPagesCount } from "./queries/getAllOrdersPagesCount";
import { generateDeliveryNotes } from "./mutations/generateDeliveryNotes";
import { getMilkRunOrdersByDate } from "./queries/getMilkRunOrdersByDate";

export const magento = {
  queries: {
    getAllSuppliers,
    getOrderProducts,
    getOrdersByBatch,
    getDeliveryAgents,
    getMilkRunOrdersByDate,
    getAllOrdersPagesCount,
  },

  mutations: {
    cancelOrder,
    editOrderDetails,
    editOrderMilkRun,
    changeOrderStatus,
    generatePickLists,
    generateOrderSummary,
    generateDeliveryNotes,
  },
};
