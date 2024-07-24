import { getOrderItemsRoute } from "./orders/magento/getOrderItemsRoute";
import { getNumberOfOrdersByDayRoute } from "./orders/typesense/getNumberOfOrdersByDayRoute";
import { getOrdersByDeliveryDateRoute } from "./orders/magento/getOrdersByDeliveryDateRoute";
import { numberOfOrdersByMonthAnalyticsRoute } from "./analytics/numberOfOrdersByMonthAnalyticsRoute";
import { getOrdersByDeliveryDateRoute } from "./orders/magento/getOrdersByDeliveryDateRoute";
import { getNumberOfOrdersByDayRoute } from "./orders/typesense/getNumberOfOrdersByDayRoute";
import { getNumberOfOrdersByMonthRoute } from "./orders/typesense/getNumberOfOrdersByMonthRoute";
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
        byMonth: getNumberOfOrdersByMonthRoute,
      },
    },
  },
};
