import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

type Params = {
  toDate: string;
  fromDate: string;
  supplierId: string;
};

export const generateSupplierReport = async ({
  toDate,
  fromDate,
  supplierId,
}: Params): Promise<string> => {
  try {
    const res = await axios.magentoClient.get(
      `orders/saleslist_without_sum?deliveryDateStart=${fromDate}&deliveryDateEnd=${toDate}&manufacturer=${supplierId}`,
    );
    return res?.data;
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
