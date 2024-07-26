import { grossMarketValueByQuarterAnalytics } from "../grossMarketValueByQuarterAnalytics";

export const grossMarketValueLifetimeAnalytics = async (
  startYear: number,
  endYear: number,
) => {
  const lifetimeList: any[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearlyAnalytics = await grossMarketValueByQuarterAnalytics(year);

    lifetimeList.push(...yearlyAnalytics);
  }

  return lifetimeList;
};
