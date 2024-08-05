import { getgmvByMonthAnalytics } from "@/clients/typesense/analytics/gmvByMonth";

export const gmvByMonthsAnalytics = async (year: string, month: string) => {
  const grossMarketValueThatDay = await getgmvByMonthAnalytics(year, month);

  return grossMarketValueThatDay;
};
