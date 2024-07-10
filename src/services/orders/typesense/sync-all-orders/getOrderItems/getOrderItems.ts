import { OrderLine } from "@/types/orderLine";

export const getOrderItems = (orderItems: any): OrderLine[] =>
  orderItems?.map((item: any) => {
    return {
      id: item.item_id,
      orderId: item.order_id,
      kamiounOrderId: "",
      productId: item.product_id,
      productName: item.name,
      productPrice: item.base_price,
      quantity: item.qty_ordered,
      shipped: item.qty_shipped,
      totalPrice: item.price,
      sku: item.sku,
      pcb: item.weight,
    };
  }) || [];
