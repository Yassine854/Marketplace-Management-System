import { axios } from "@/libs/axios";

const batchSize = 250;

export const getOrdersByBatch = async (page: any) => {
  try {
    const response = await axios.magentoClient.get(
      `/orders?searchCriteria[pageSize]=${batchSize}&searchCriteria[currentPage]=${page}&searchCriteria[sortOrders][0][field]=entity_id&searchCriteria[sortOrders][0][direction]=DESC`,
    );
    return {
      items: response.data.items,
    };
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error fetching data:", error);
    throw error;
  }
};
