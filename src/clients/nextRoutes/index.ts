import { getOrderItemsRoute } from "./orders/magento/getOrderItemsRoute";
import { getNumberOfOrdersByDayRoute } from "./orders/typesense/getNumberOfOrdersByDayRoute";
import { getOrdersByDeliveryDateRoute } from "./orders/magento/getOrdersByDeliveryDateRoute";
import { numberOfOrdersByMonthAnalyticsRoute } from "./analytics/numberOfOrdersByMonthAnalyticsRoute";
import { numberOfOrdersByWeekAnalyticsRoute } from "./analytics/numberOfOrdersByWeekAnalyticsRoute";
import { getNumberOfOrdersByMonthRoute } from "./orders/typesense/getNumberOfOrdersByMonthRoute";
// import { getOrdersByDeliveryDateRoute } from "./orders/magento/getOrdersByDeliveryDateRoute";
// import { getNumberOfOrdersByDayRoute } from "./orders/typesense/getNumberOfOrdersByDayRoute";
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
      getOne: {
        items: getOrderItemsRoute,
      },
    },

    typesense: {
      numberOfOrders: {
        byDay: getNumberOfOrdersByDayRoute,
        byMonth: getNumberOfOrdersByMonthRoute,
      },
    },
  },
};
