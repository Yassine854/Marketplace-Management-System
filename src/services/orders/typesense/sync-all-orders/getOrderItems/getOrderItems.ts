import { OrderLine } from "@/types/orderLine";

export const getOrderItems = (orderItems: any): OrderLine[] =>
  orderItems?.map((item: any) => {
    // const qtyPcbAttribute =
    //   item?.product_option?.extension_attributes?.custom_options.find(
    //     (attr: any) => attr.option_id === "qty_pcb",
    //   );
    // const quantityPCB = qtyPcbAttribute ? qtyPcbAttribute.option_value : 0;
    // return {
    //   id: item.item_id,
    //   orderId: item.order_id,
    //   productId: item.product_id,
    //   productName: item.name,
    //   productPrice: item.base_price,
    //   quantity: quantityPCB * item.qty_ordered,
    //   shipped: item.weight,
    //   totalPrice: item.price,
    //   sku: item.sku,
    //   pcb: item.qty_ordered,
    // };
  }) || [];
