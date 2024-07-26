import { getOrderItemsRoute } from "./orders/magento/getOrderItemsRoute";
import { numberOfOrdersByMonthAnalyticsRoute } from "./analytics/numberOfOrders/numberOfOrdersByMonthAnalyticsRoute";
import { numberOfOrdersByQuarterAnalyticsRoute } from "./analytics/numberOfOrders/numberOfOrdersByQuarterAnalyticsRoute";
import { numberOfOrdersLifetimeAnalyticsRoute } from "./analytics/numberOfOrders/numberOfOrdersLifetimeAnalyticsRoute";
import { getOrdersByDeliveryDateRoute } from "./orders/magento/getOrdersByDeliveryDateRoute";
import { getNumberOfOrdersByDayRoute } from "./orders/typesense/numberOfOrders/getNumberOfOrdersByDayRoute";
import { getNumberOfOrdersByMonthRoute } from "./orders/typesense/numberOfOrders/getNumberOfOrdersByMonthRoute";
import { getNumberOfOrdersByQuarterRoute } from "./orders/typesense/numberOfOrders/getNumberOfOrdersByQuarterRoute";
import { numberOfOrdersByYearAnalyticsRoute } from "./analytics/numberOfOrders/numberOfOrdersByYearAnalyticsRoute";
import { numberOfOrdersByWeekAnalyticsRoute } from "./analytics/numberOfOrders/numberOfOrdersByWeekAnalyticsRoute";
export const nextRoute = {
  analytics: {
    numberOfOrders: {
      byYear: numberOfOrdersByYearAnalyticsRoute,
      byMonth: numberOfOrdersByMonthAnalyticsRoute,
      byQuarter: numberOfOrdersByQuarterAnalyticsRoute,
      lifetime: numberOfOrdersLifetimeAnalyticsRoute,
      byWeek: numberOfOrdersByWeekAnalyticsRoute,
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
        byQuarter: getNumberOfOrdersByQuarterRoute,
      },
    },
  },
};
