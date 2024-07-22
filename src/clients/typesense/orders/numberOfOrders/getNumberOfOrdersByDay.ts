import { logError } from "@/utils/logError";
import { typesenseClient } from "../../typesenseClient";

export const getNumberOfOrdersByDay = async (
  isoDate: string,
): Promise<number | undefined> => {
  try {
    const [year, month, day] = isoDate.split("-").map(Number);

    const startOfDay = new Date(year, month - 1, day).getTime();

    const endOfDay = new Date(year, month - 1, day, 23, 55, 999).getTime();

    const startTimestamp = Math.floor(startOfDay);
    const endTimestamp = Math.floor(endOfDay);

    const searchParams = {
      q: "",
      query_by: "*",
      page: 1,
      per_page: 1,
      filter_by: `createdAt:=[${startTimestamp}..${endTimestamp}]`,
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
