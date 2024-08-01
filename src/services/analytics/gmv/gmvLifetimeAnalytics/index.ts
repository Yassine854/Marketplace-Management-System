import { gmvByQuarterAnalytics } from "../gmvByQuarterAnalytics";

export const gmvLifetimeAnalytics = async (
  startYear: number,
  endYear: number,
) => {
  const lifetimeList: any[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearlyAnalytics = await gmvByQuarterAnalytics(year);

    lifetimeList.push(...yearlyAnalytics);
  }

  return lifetimeList;
};
