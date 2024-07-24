import { numberOfOrdersByMonthAnalyticsRoute } from "./analytics/numberOfOrdersByMonthAnalyticsRoute";
import { numberOfOrdersByQuarterAnalyticsRoute } from "./analytics/numberOfOrdersByQuarterAnalyticsRoute";
import { numberOfOrdersLifetimeAnalyticsRoute } from "./analytics/numberOfOrdersLifetimeAnalyticsRoute";
import { getOrdersByDeliveryDateRoute } from "./orders/magento/getOrdersByDeliveryDateRoute";
import { getNumberOfOrdersByDayRoute } from "./orders/typesense/numberOfOrders/getNumberOfOrdersByDayRoute";
import { getNumberOfOrdersByMonthRoute } from "./orders/typesense/numberOfOrders/getNumberOfOrdersByMonthRoute";
import { getNumberOfOrdersByQuarterRoute } from "./orders/typesense/numberOfOrders/getNumberOfOrdersByQuarterRoute";

export const nextRoute = {
  analytics: {
    numberOfOrders: {
      byMonth: numberOfOrdersByMonthAnalyticsRoute,
      byQuarter: numberOfOrdersByQuarterAnalyticsRoute,
      lifetime: numberOfOrdersLifetimeAnalyticsRoute,
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
        byMonth: getNumberOfOrdersByMonthRoute,
        byQuarter: getNumberOfOrdersByQuarterRoute,
      },
    },
  },
};
