import { cancelOrder } from "./mutations/cancelOrder";
import { getAllSuppliers } from "./queries/getAllSuppliers";
import { getOrderProducts } from "./queries/getOrderProducts";
import { getOrdersByBatch } from "./queries/getOrdersByBatch";
import { editOrderDetails } from "./mutations/editOrderDetails";
import { editOrderMilkRun } from "./mutations/editOrderMilkRun";
import { generatePickLists } from "./mutations/generatePickLists";
import { changeOrderStatus } from "./mutations/changeOrderStatus";
import { getDeliveryAgents } from "./queries/getAllDeliveryAgents";
import { generateAgentReport } from "./mutations/generateAgentReport";
import { generateOrderSummary } from "./mutations/generateOrderSummary";
import { getAllOrdersPagesCount } from "./queries/getAllOrdersPagesCount";
import { generateMultipleOrdersSummary } from "./mutations/generateMultipleOrdersSummary";
import { getMilkRunOrdersByDate } from "./queries/getMilkRunOrdersByDate";
import { generateSupplierReport } from "./mutations/generateSupplierReport";

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
    generateAgentReport,
    generateOrderSummary,
    generateMultipleOrdersSumma,
    generateSupplierReport,
  },
};
