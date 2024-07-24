import { numberOfOrdersByMonthAnalyticsRoute } from "./analytics/numberOfOrdersByMonthAnalyticsRoute";
import { numberOfOrdersByWeekAnalyticsRoute } from "./analytics/numberOfOrdersByWeekAnalyticsRoute";
import { getOrdersByDeliveryDateRoute } from "./orders/magento/getOrdersByDeliveryDateRoute";
import { getNumberOfOrdersByDayRoute } from "./orders/typesense/getNumberOfOrdersByDayRoute";

export const nextRoute = {
  analytics: {
    numberOfOrders: {
      byMonth: numberOfOrdersByMonthAnalyticsRoute,
      byWeek:numberOfOrdersByWeekAnalyticsRoute
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
