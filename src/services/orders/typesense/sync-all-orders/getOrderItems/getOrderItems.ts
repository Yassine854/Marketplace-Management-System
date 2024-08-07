type Item = {
  id: string;
  sku: string;
  orderId: string;
  productId: string;
  productName: string;
  productPrice: string;

  weight: number;
  quantity: number;
  totalPrice: number;
};

export const getOrderItems = (orderItems: any): Item[] =>
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
