import { getNumberOfOrdersByQuarter } from "@/services/analytics/typesense/numberOfOrders/getNumberOfOrdersByQuarter";

export const numberOfOrderByQuarterAnalytics = async (year: number) => {
  const quarterMonths: { [key: string]: [number, number] } = {
    Q1: [0, 2],
    Q2: [3, 5],
    Q3: [6, 8],
    Q4: [9, 11],
  };

  const list: any[] = [];

  for (const quarter in quarterMonths) {
    const numberOfOrders = await getNumberOfOrdersByQuarter(year, quarter);
    if (numberOfOrders !== undefined) {
      list.push({
        numberOfOrders: numberOfOrders.toString(),
        date: `${year}-${quarter}`,
      });
    }
  }

  return list;
};
