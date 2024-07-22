import { numberOfOrdersByMonthAnalyticsRoute } from "./analytics/numberOfOrdersByMonthAnalyticsRoute";
import { getOrdersByDeliveryDateRoute } from "./orders/magento/getOrdersByDeliveryDateRoute";
import { getNumberOfOrdersByDayRoute } from "./orders/typesense/getNumberOfOrdersByDayRoute";

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
    },

    typesense: {
      numberOfOrders: {
        byDay: getNumberOfOrdersByDayRoute,
      },
    },
  },
};
