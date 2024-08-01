import { getGmvByHour } from "@/clients/typesense/orders/gmv/getGmvByHour";

export const gmvByDayAnalytics = async (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number);

  const list: any[] = [];

  const grossMarketValueThatDay = await getGmvByHour(year, month, day);
  if (grossMarketValueThatDay != undefined) {
    list.push({
      grossMarketValue: grossMarketValueThatDay,
      date: `${isoDate}`,
    });
  }
  return list;
};
