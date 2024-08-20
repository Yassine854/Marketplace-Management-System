import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";

export const getOrderProducts = async (orderId: string): Promise<any> => {
  try {
    const magnetoOrderProducts: any[] = await magento.queries.getOrderProducts(
      orderId,
    );

    const orderProducts = magnetoOrderProducts.map((item) => {
      const { id, sku, name, price, custom_attributes } = item;

      const description = custom_attributes.find(
        (attr: any) => attr.attribute_code === "description",
      )?.value;

      const pcb = Number(
        custom_attributes.find((attr: any) => attr.attribute_code === "qty_pcb")
          ?.value,
      );

      const brand = custom_attributes.find(
        (attr: any) => attr.attribute_code === "brand",
      )?.value;

      return {
        id,
        sku,
        pcb,
        name,
        brand,
        price,
        description,
      };
    });

    return orderProducts;
  } catch (error: any) {
    logError(error);
    throw error;
  }
};
