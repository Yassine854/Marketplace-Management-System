import { axios } from "@/libs/axios";

export const getDeliveryAgents = async () => {
  try {
    const response = await axios.magentoClient.get(
      "/customers/search/?searchCriteria[filterGroups][0][filters][0][field]=group_id&searchCriteria[filterGroups][0][filters][0][value]=4",
    );
    return {
      deliveryAgents: response.data.items,
    };
  } catch (error) {
    process.env.NODE_ENV === "development" &&
      console.error("Error fetching data:", error);
    throw error;
  }
};
