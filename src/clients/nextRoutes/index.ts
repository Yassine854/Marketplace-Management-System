import { getOrderItemsRoute } from "./orders/magento/getOrderItemsRoute";
import { numberOfOrdersByMonthAnalyticsRoute } from "./analytics/numberOfOrders/numberOfOrdersByMonthAnalyticsRoute";
import { numberOfOrdersLifetimeAnalyticsRoute } from "./analytics/numberOfOrders/numberOfOrdersLifetimeAnalyticsRoute";
import { numberOfOrdersByQuarterAnalyticsRoute } from "./analytics/numberOfOrders/numberOfOrdersByQuarterAnalyticsRoute";
import { getOrdersByDeliveryDateRoute } from "./orders/magento/getOrdersByDeliveryDateRoute";
import { getNumberOfOrdersByDayRoute } from "./orders/typesense/numberOfOrders/getNumberOfOrdersByDayRoute";
import { getNumberOfOrdersByMonthRoute } from "./orders/typesense/numberOfOrders/getNumberOfOrdersByMonthRoute";
import { getNumberOfOrdersByQuarterRoute } from "./orders/typesense/numberOfOrders/getNumberOfOrdersByQuarterRoute";
import { numberOfOrdersByYearAnalyticsRoute } from "./analytics/numberOfOrders/numberOfOrdersByYearAnalyticsRoute";
import { numberOfOrdersByWeekAnalyticsRoute } from "./analytics/numberOfOrders/numberOfOrdersByWeekAnalyticsRoute";
import { getGrossMarketValueByQuarterRoute } from "./orders/typesense/grossMarketValue/getGrossMarketValueByQuarterRoute";
import { grossMarketValueByQuarterAnalyticsRoute } from "./analytics/grossMarketValue/grossMarketValueByQuarterAnalyticsRoute";
import { grossMarketValueLifetimeAnalyticsRoute } from "./analytics/grossMarketValue/grossMarketValueLifetimeAnalyticsRoute";
import { getGrossMarketValueByMonthRoute } from "./orders/typesense/grossMarketValue/getGrossMarketValueByMonthRoute";
import { grossMarketValueByYearAnalyticsRoute } from "./analytics/grossMarketValue/grossMarketValueByYearAnalyticsRoute";

export const nextRoute = {
  analytics: {
    numberOfOrders: {
      byYear: numberOfOrdersByYearAnalyticsRoute,
      byMonth: numberOfOrdersByMonthAnalyticsRoute,
      byQuarter: numberOfOrdersByQuarterAnalyticsRoute,
      lifetime: numberOfOrdersLifetimeAnalyticsRoute,
      byWeek: numberOfOrdersByWeekAnalyticsRoute,
    },
    grossMarketValue: {
      byYear: grossMarketValueByYearAnalyticsRoute,
      byQuarter: grossMarketValueByQuarterAnalyticsRoute,
      lifetime: grossMarketValueLifetimeAnalyticsRoute,
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
      grossMarketValue: {
        byQuarter: getGrossMarketValueByQuarterRoute,
        byMonth: getGrossMarketValueByMonthRoute,
      },
    },
  },
};
