import { axiosClient } from "./axiosClient";

const batchSize = 250;

export const getPagesCount = async () => {
  try {
    const response = await axiosClient.get(
      `/orders?searchCriteria[pageSize]=1&searchCriteria[currentPage]=1&searchCriteria[sortOrders][0][field]=entity_id&searchCriteria[sortOrders][0][direction]=DESC`,
    );
    return {
      pagesCount: Math.ceil(response.data.total_count / batchSize),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
