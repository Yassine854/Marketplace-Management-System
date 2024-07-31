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
import { getGrossMarketValueByQuarterRoute } from "./orders/typesense/grossMarchandiseValue/getGrossMarchandiseValueByQuarterRoute";
import { grossMarketValueByQuarterAnalyticsRoute } from "./analytics/grossMarchandiseValue/grossMarchandiseValueByQuarterAnalyticsRoute";
import { grossMarketValueLifetimeAnalyticsRoute } from "./analytics/grossMarchandiseValue/grossMarchandiseValueLifetimeAnalyticsRoute";
import { getGrossMarketValueByMonthRoute } from "./orders/typesense/grossMarchandiseValue/getGrossMarchandiseValueByMonthRoute";
import { grossMarketValueByYearAnalyticsRoute } from "./analytics/grossMarchandiseValue/grossMarchandiseValueByYearAnalyticsRoute";
import { getGrossMarketValueByHourRoute } from "./orders/typesense/grossMarchandiseValue/getGrossMarchandiseValueByHourRoute";
import { grossMarketValueByDayAnalyticsRoute } from "./analytics/grossMarchandiseValue/grossMarchandiseValueByDayAnalyticsRoute";
import { grossMarketValueByMonthAnalyticsRoute } from "./analytics/grossMarchandiseValue/grossMarchandiseValueAnalyticsByMonthAnalyticsRoute";
import { getGrossMarketValueByDayRoute } from "./orders/typesense/grossMarchandiseValue/getGrossMarchandiseValueByDay";
import { grossMarketValueByWeekAnalyticsRoute } from "./analytics/grossMarchandiseValue/grossMarchandiseValueByWeekAnalyticsRoute";
import { numberOfUniqueCustomerByMonthAnalyticsRoute } from "./analytics/numberOfUniqueCustomer/numberOfUniqueCustomerByMonthAnalyticsRoute";

export const nextRoute = {
  analytics: {
    numberOfOrders: {
      byYear: numberOfOrdersByYearAnalyticsRoute,
      byMonth: numberOfOrdersByMonthAnalyticsRoute,
      byQuarter: numberOfOrdersByQuarterAnalyticsRoute,
      lifetime: numberOfOrdersLifetimeAnalyticsRoute,
      byWeek: numberOfOrdersByWeekAnalyticsRoute,
      //ToFix
      byCurrentDay: numberOfOrdersByWeekAnalyticsRoute,

      // numberOfOrdersByCurrentDayAnalyticsRoute
    },
    grossMarketValue: {
      byMonth: grossMarketValueByMonthAnalyticsRoute,
      byDay: grossMarketValueByDayAnalyticsRoute,
      byWeek: grossMarketValueByWeekAnalyticsRoute,
      byYear: grossMarketValueByYearAnalyticsRoute,
      byQuarter: grossMarketValueByQuarterAnalyticsRoute,
      lifetime: grossMarketValueLifetimeAnalyticsRoute,
    },
    numberOfUniqueCustomer: {
      byMonth: numberOfUniqueCustomerByMonthAnalyticsRoute,
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
