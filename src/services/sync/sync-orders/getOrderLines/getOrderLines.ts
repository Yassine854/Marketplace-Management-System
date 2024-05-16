import { OrderLine } from "@/types/OrderLine";

export const getOrderLines = (orderItems: any): OrderLine[] =>
  orderItems?.map((item: any) => {
    return {
      id: item.item_id,
      orderId: item.order_id,
      kamiounOrderId: "",
      productId: item.product_id,
      productName: item.product_name,
      productPrice: item.base_price,
      quantity: item.quantity_ordered,
      totalPrice: item.price,
      sku: item.sku,
    };
  }) || [];
