import { getGmvByDay } from "@/clients/typesense/orders/gmv/getGmvByDay";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";
import { dateYMDToUnixTimestamp } from "@/utils/unixTimestamp";

function generateMonthDaysObject({ year, month }: any) {
  const lastDay = new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: lastDay }, (_, i) => i + 1);
  return daysArray;
}
type DataType = {
  day: number;
  gmv: number;
};

export const gmvByMonthAnalytics = async (year: number, month: number) => {
  const monthDays: number[] = generateMonthDaysObject({ year, month });
  let allOrders: number[] = [];
  try {
    const searchParams = {
      filter_by: `month:=[${month}] && year:=[${year}]`,
      q: "*",
      query_by: "year,month",
      page: 1,
      per_page: 250,
    };
    const searchResults = await typesenseClient
      .collections("gmvPreviousDays")
      .documents()
      .search(searchParams);
    const hits = searchResults.hits || [];
    //@ts-ignore
    allOrders = hits.map((hit) => hit.document.gmv);
  } catch (error: any) {
    logError(error);
  }

  const data: DataType[] = monthDays.map((day, index) => ({
    day,
    gmv: allOrders[index] || 0,
  }));

  return data;
};
