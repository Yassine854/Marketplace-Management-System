import { logError } from "@/utils/logError";
import { typesenseClient } from "../../typesenseClient";

export const getNumberOfOrdersByMonth = async (
  isoDate: string,
): Promise<number | undefined> => {
  try {
    const [year, month] = isoDate.split("-").map(Number);
    const startDate = Math.floor(new Date(year, month - 1, 1).getTime());

    const endDate = Math.floor(new Date(year, month, 0, 23, 59, 59).getTime());

    const searchParams = {
      filter_by: `createdAt:=[${startDate}..${endDate}]`,
      q: "",
      query_by: "*",
      page: 1,
      per_page: 1,
    };

    const { found } = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParams);

    return found;
  } catch (error) {
    logError(error);
  }
};
