import { logError } from "@/utils/logError";
import { typesenseClient } from "../../typesenseClient";

export const getNumberOfOrdersByMonth = async (
  year: number,
  month: number,
): Promise<number | undefined> => {
  try {
    const startTime = new Date(year, month - 1, 1).getTime();
    const endTime = new Date(year, month, 0, 23, 59, 59).getTime();

    const startTimestamp = Math.floor(startTime);
    const endTimestamp = Math.floor(endTime);

    /* const currentDate = dayjs().unix() * 1000
    if (startDate > currentDate) {
      return NextResponse.json({ noo: null });
    } */

    const searchParams = {
      q: "",
      query_by: "*",
      filter_by: `createdAt:=[${startTimestamp}..${endTimestamp}]`,
    };

    const allorders = await typesenseClient
      .collections("orders")
      .documents()
      .search(searchParams);
    return allorders.found;
  } catch (error) {
    logError(error);
  }
};
