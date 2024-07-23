import { getOrderItemsRoute } from "./orders/magento/getOrderItemsRoute";
import { getNumberOfOrdersByDayRoute } from "./orders/typesense/getNumberOfOrdersByDayRoute";
import { getOrdersByDeliveryDateRoute } from "./orders/magento/getOrdersByDeliveryDateRoute";
import { numberOfOrdersByMonthAnalyticsRoute } from "./analytics/numberOfOrdersByMonthAnalyticsRoute";

export const nextRoute = {
  analytics: {
    numberOfOrders: {
      byMonth: numberOfOrdersByMonthAnalyticsRoute,
    },
  },

  orders: {
    magento: {
      getMany: {
        byDeliveryDate: getOrdersByDeliveryDateRoute,
      },
      getOne: {
        items: getOrderItemsRoute,
      },
    },

    typesense: {
      numberOfOrders: {
        byDay: getNumberOfOrdersByDayRoute,
      },
    },
  },
};
