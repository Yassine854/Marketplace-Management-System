import { getGrossMarketValueByMonth } from "@/services/orders/typesense/grossMarketValue/getGrossMarketValueByMonth";
export const grossMarketValueByYearAnalytics = async (year: number) => {
  const list: any[] = [];

  for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
    const grossMarketValueThatMonth = await getGrossMarketValueByMonth(
      year,
      monthIndex,
    );
    if (grossMarketValueThatMonth != undefined) {
      list.push({
        grossMarketValue: grossMarketValueThatMonth.toString(),
        date: `${year}-M${monthIndex}`,
      });
    }
  }
  return list;
};
