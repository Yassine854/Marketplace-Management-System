import { OrderLine } from "@/types/orderLine";

export const getOrderItems = (orderItems: any): OrderLine[] =>
  orderItems?.map((item: any) => {
    return {
      id: String(item.item_id),
      orderId: String(item.order_id),
      productId: String(item.product_id),
      productName: String(item.name),
      productPrice: item.base_price,
      totalPrice: Number(item.price),
      sku: String(item.sku),
      quantity: Number(item.qty_ordered),
      weight: Number(item.weight),
    };
  }) || [];
