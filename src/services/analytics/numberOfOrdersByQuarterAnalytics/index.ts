import { getNumberOfOrdersByMonth } from "@/services/orders/typesense/numberOfOrders/getNumberOfOrdersByMonth";

export const numberOfOrderByQuarterAnalytics = async (year: string) => {
  const quarterMonths: { [key: string]: [number, number] } = {
    Q1: [0, 2],
    Q2: [3, 5],
    Q3: [6, 8],
    Q4: [9, 11],
  };

  const list: any[] = [];

  for (const quarter in quarterMonths) {
    const months = quarterMonths[quarter];
    let totalOrders = 0;

    for (const month of months) {
      const numberOfOrders = await getNumberOfOrdersByMonth(year);
      if (numberOfOrders) {
        totalOrders += numberOfOrders;
      }
    }

    list.push({
      numberOfOrders: totalOrders.toString(),
      date: `${year}-${quarter}`,
    });
  }

  return list;
};
