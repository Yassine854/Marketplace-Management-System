import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const getDeliveryAgents = async () => {
  try {
    const response = await axios.magentoClient.get(
      "/customers/search/?searchCriteria[filterGroups][0][filters][0][field]=group_id&searchCriteria[filterGroups][0][filters][0][value]=4",
    );
    return response?.data?.items;
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
