import { getOrdersByDeliveryDateRoute } from "./magento/getOrdersByDeliveryDateRoute";

export const nextRoute = {
  orders: {
    byDeliveryDate: getOrdersByDeliveryDateRoute,
  },
};
