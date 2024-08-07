import { getGmvByQuarter } from "@/services/analytics/typesense/gmv/getGmvByQuarter";

export const gmvByQuarterAnalytics = async (year: number) => {
  const quarterMonths: { [key: string]: [number, number] } = {
    Q1: [0, 2],
    Q2: [3, 5],
    Q3: [6, 8],
    Q4: [9, 11],
  };

  const list: any[] = [];

  for (const quarter in quarterMonths) {
    const grossMarketValueThatQuarter = await getGmvByQuarter(year, quarter);
    if (grossMarketValueThatQuarter != undefined) {
      list.push({
        grossMarketValue: grossMarketValueThatQuarter.toString(),
        date: `${year}-${quarter}`,
      });
    }
  }
  return list;
};
