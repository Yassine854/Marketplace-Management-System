import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";

type QuarterDataType = {
  quarter: string;
  nuc: number;
};

const nucByQuarterAnalytics = async (year: number) => {
  const quarterMonths: { [key: string]: [number, number] } = {
    Q1: [0, 2],
    Q2: [3, 5],
    Q3: [6, 8],
    Q4: [9, 11],
  };

  const list: QuarterDataType[] = [];

  for (const quarter in quarterMonths) {
    const [startMonth, endMonth] = quarterMonths[quarter];
    let totalNucForQuarter = 0;

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
          .collections("NucPreviousMonths")
          .documents()
          .search(searchParams);

        const hits = searchResults.hits || [];
        const nucForMonth = hits.reduce(
          (sum: number, hit: any) => sum + hit.document.nuc,
          0,
        );
        totalNucForQuarter += nucForMonth;
      } catch (error: any) {
        logError(error);
      }
    }

    list.push({ quarter: quarter + "-" + year, nuc: totalNucForQuarter });
  }

  return list;
};

export const nucLifetime = async () => {
  const startYear = 2020;
  const endYear = new Date().getFullYear();

  const lifetimeList: any[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearlyAnalytics = await nucByQuarterAnalytics(year);

    lifetimeList.push(...yearlyAnalytics);
  }

  return lifetimeList;
};
