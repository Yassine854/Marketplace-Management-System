import { getGrossMarketValueByHour } from "@/clients/typesense/orders/grossMarchandiseValue/getGrossMarchandiseValueByHour";

export const grossMarketValueByDayAnalytics = async (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number);

  const list: any[] = [];

  const grossMarketValueThatDay = await getGrossMarketValueByHour(
    year,
    month,
    day,
  );
  if (grossMarketValueThatDay != undefined) {
    list.push({
      grossMarketValue: grossMarketValueThatDay,
      date: `${isoDate}`,
    });
  }
  return list;
};
