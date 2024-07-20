import { getOrder } from "./orders/getOrder";
import { addOrder } from "./orders/addOrder";
import { updateOrder } from "./orders/updateOrder";
import { getManyOrders } from "./orders/getManyOrders";
import { addOrdersBatch } from "./orders/addOrdersBatch";
import { isCollectionExist } from "./isCollectionExist";
import { createOrdersCollection } from "./orders/createOrdersCollection";
import { deleteOrdersCollection } from "./orders/deleteOrdersCollection";

export const typesense = {
  isCollectionExist,
  orders: {
    getOne: getOrder,
    addOne: addOrder,
    getMany: getManyOrders,
    updateOne: updateOrder,
    addMany: addOrdersBatch,
    createCollection: createOrdersCollection,
    deleteCollection: deleteOrdersCollection,
  },
};
