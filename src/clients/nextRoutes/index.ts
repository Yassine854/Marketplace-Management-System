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
import { getGrossMarketValueByHourRoute } from "./orders/typesense/grossMarketValue/getGrossMarketValueByHourRoute";
import { grossMarketValueByDayAnalyticsRoute } from "./analytics/grossMarketValue/grossMarketValueByDayAnalyticsRoute";
import { grossMarketValueByMonthAnalyticsRoute } from "./analytics/grossMarketValue/grossMarketValueAnalyticsByMonthAnalyticsRoute";
import { getGrossMarketValueByDayRoute } from "./orders/typesense/grossMarketValue/getGrossMarketValueByDay";
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
      byMonth: grossMarketValueByMonthAnalyticsRoute,
      byDay: grossMarketValueByDayAnalyticsRoute,
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
        byDay: getGrossMarketValueByDayRoute,
        byQuarter: getGrossMarketValueByQuarterRoute,
        byMonth: getGrossMarketValueByMonthRoute,
        byHour: getGrossMarketValueByHourRoute,
      },
    },
  },
};
