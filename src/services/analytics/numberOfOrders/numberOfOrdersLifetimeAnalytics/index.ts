import { numberOfOrderByQuarterAnalytics } from "../numberOfOrdersByQuarterAnalytics";

export const numberOfOrdersLifetimeAnalytics = async (
  startYear: number,
  endYear: number,
) => {
  const lifetimeList: any[] = [];

  /*for (let year = startYear; year <= endYear; year++) {
    const yearlyAnalytics = await numberOfOrderByQuarterAnalytics(year);

    lifetimeList.push(...yearlyAnalytics);
  }*/

  return lifetimeList;
};
