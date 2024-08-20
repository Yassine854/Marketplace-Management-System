import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";

export const getAllSuppliers = async () => {
  try {
    const suppliers = await magento.queries.getAllSuppliers();
    return suppliers;
  } catch (error) {
    logError(error);
  }
};
