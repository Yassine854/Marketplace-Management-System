import { OrderLine } from "@/types/orderLine";

export const getOrderItems = (orderItems: any): OrderLine[] =>
  orderItems?.map((item: any) => {
    return {
      id: item.item_id,
      orderId: item.order_id,
      productId: item.product_id,
      productName: item.name,
      productPrice: item.base_price,
      totalPrice: item.price,
      sku: item.sku,
      orderedQuantity: item.qty_ordered,
      weight: item.weight,
    };
  }) || [];
