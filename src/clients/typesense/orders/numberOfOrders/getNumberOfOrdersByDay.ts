import { logError } from "@/utils/logError";
import { typesenseClient } from "../../typesenseClient";

export const getNumberOfOrdersByDay = async (
  isoDate: string,
  storeId: string | null,
): Promise<number | undefined> => {
  try {
    const [year, month, day] = isoDate.split("-").map(Number);

    const startOfDay = new Date(year, month - 1, day).getTime();

    const endOfDay = new Date(year, month - 1, day, 23, 55, 999).getTime();

    const startTimestamp = Math.floor(startOfDay);
    const endTimestamp = Math.floor(endOfDay);
    let searchParams;

    if (storeId) {
      searchParams = {
        q: "",
        query_by: "*",
        page: 1,
        per_page: 1,
        filter_by: `createdAt:=[${startTimestamp}..${endTimestamp}]  && state:!=canceled && storeId :=${storeId}`,
      };
    } else {
      searchParams = {
        q: "",
        query_by: "*",
        page: 1,
        per_page: 1,
        filter_by: `createdAt:=[${startTimestamp}..${endTimestamp}]  && state:!=canceled `,
      };
    }

    const { found } = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParams);

    return found;
  } catch (error) {
    logError(error);
  }
};
