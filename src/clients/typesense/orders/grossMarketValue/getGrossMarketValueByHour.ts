import { logError } from "@/utils/logError";
import { typesenseClient } from "../../typesenseClient";
import dayjs from "dayjs";

export const getGrossMarketValueByHour = async (
  isoDate: string,
): Promise<Array<[string, number]> | undefined> => {
  try {
    const [year, month, day] = isoDate.split("-").map(Number);
    const resultTable: Array<[number, number]> = [];

    const currentTimestamp = dayjs().unix() * 1000;
    const requestedDate = new Date(year, month - 1, day).getTime();

    for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
      const startHour = new Date(
        year,
        month - 1,
        day,
        hourIndex,
        0,
        0,
      ).getTime();
      let endHour = new Date(year, month - 1, day, hourIndex, 59, 59).getTime();
      const startTimestamp = Math.floor(startHour);
      if (endHour > currentTimestamp) {
        endHour = currentTimestamp;
        const endTimestamp = Math.floor(endHour);
        resultTable.push([startTimestamp, endTimestamp]);
        break;
      }
      const endTimestamp = Math.floor(endHour);
      resultTable.push([startTimestamp, endTimestamp]);
    }

    let totalGMV = 0;
    let nbreOrders = 0;
    const allOrdersTable: Array<[string, number]> = await Promise.all(
      resultTable.map(async (item, index) => {
        const startTimestamp = item[0];
        const endTimestamp = item[1];

        const searchParamsObj = {
          filter_by: `createdAt:=[${startTimestamp}..${endTimestamp}]`,
          q: "*",
          query_by: "",
        };

        const response = await typesenseClient
          .collections("orders")
          .documents()
          .search(searchParamsObj);

        const allOrders = response.hits || [];
        const hourGMV = allOrders.reduce((sum: number, order: any) => {
          const total = order.document.total;
          if (typeof total === "number") {
            return sum + total;
          }
          return sum;
        }, 0);
        totalGMV += hourGMV;
        nbreOrders += allOrders.length;
        console.log("All orders:", nbreOrders);
        console.log("Hour GMV:", hourGMV);
        console.log("Total GMV:", totalGMV);
        const hourString: string = `${String(index).padStart(2, "0")}:00`;
        return [hourString, hourGMV] as [string, number];
      }),
    );
    return allOrdersTable;
  } catch (error) {
    logError(error);
  }
};
