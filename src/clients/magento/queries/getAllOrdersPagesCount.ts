import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

const batchSize = 250;

export const getAllOrdersPagesCount = async () => {
  try {
    const response = await axios.magentoClient.get(
      `/orders?searchCriteria[pageSize]=1&searchCriteria[currentPage]=1&searchCriteria[sortOrders][0][field]=entity_id&searchCriteria[sortOrders][0][direction]=DESC`,
    );
    return {
      pagesCount: Math.ceil(response.data.total_count / batchSize),
    };
  } catch (error) {
    logError(error);
    throw error;
  }
};
