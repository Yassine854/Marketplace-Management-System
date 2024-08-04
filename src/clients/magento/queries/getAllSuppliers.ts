import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const getAllSuppliers = async () => {
  try {
    const response = await axios.magentoClient.get(
      "kamioun-manufacturers/manufacturer/search?searchCriteria=",
    );
    return {
      suppliers: response.data.items,
    };
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
