import { getNooByMonth } from "@/services/orders/getNumberOfOrders/getNooByMonth";

export const nooLifetime = async () => {
  const startYear = 2020;
  const currentYear = new Date().getFullYear();

  const lifetimeList: any[] = [];

  for (let year = startYear; year <= currentYear; year++) {
    const quarterMonths: { [key: string]: [number, number] } = {
      Q1: [0, 2],
      Q2: [3, 5],
      Q3: [6, 8],
      Q4: [9, 11],
    };

    const yearlyAnalytics: any[] = [];

    for (const quarter in quarterMonths) {
      const months = quarterMonths[quarter];
      let totalOrders = 0;

      for (const month of months) {
        const date = year + "-" + month;
        const numberOfOrders = await getNooByMonth(date);
        if (numberOfOrders) {
          totalOrders += numberOfOrders;
        }
      }

      yearlyAnalytics.push({
        numberOfOrders: totalOrders.toString(),
        date: `${year}-${quarter}`,
      });
    }

    lifetimeList.push(...yearlyAnalytics);
  }

  return lifetimeList;
};
