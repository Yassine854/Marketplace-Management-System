import { getGmvByQuarter } from "@/clients/typesense/orders/gmv/getGmvByQuarter";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";

type QuarterDataType = {
  quarter: string;
  totalGmv: number;
};

export const gmvByQuarterAnalytics = async (year: number) => {
  const quarterMonths: { [key: string]: [number, number] } = {
    Q1: [0, 2],
    Q2: [3, 5],
    Q3: [6, 8],
    Q4: [9, 11],
  };

  const list: QuarterDataType[] = [];

  for (const quarter in quarterMonths) {
    const [startMonth, endMonth] = quarterMonths[quarter];
    let totalGmvForQuarter = 0;

    for (let monthIndex = startMonth; monthIndex <= endMonth; monthIndex++) {
      try {
        const searchParams = {
          filter_by: `month:=[${monthIndex + 1}] && year:=[${year}]`,
          q: "*",
          query_by: "year,month",
          page: 1,
          per_page: 250,
        };

        const searchResults = await typesenseClient
          .collections("gmvPreviousMonths")
          .documents()
          .search(searchParams);

        const hits = searchResults.hits || [];
        const gmvForMonth = hits.reduce(
          (sum: number, hit: any) => sum + hit.document.gmv,
          0,
        );
        totalGmvForQuarter += gmvForMonth;
      } catch (error: any) {
        logError(error);
      }
    }

    list.push({ quarter, totalGmv: totalGmvForQuarter });
  }

  return list;
};
