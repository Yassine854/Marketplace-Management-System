import { getGrossMarketValueByDay } from "@/clients/typesense/orders/grossMarketValue/getGrossMarketValueByDay";
function generateMonthDaysObject({ year, month }: any) {
  const lastDay = new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: lastDay }, (_, i) => i + 1);
  return daysArray;
}
export const numberOfOrderByMonthAnalytics = async (
  year: number,
  month: number,
) => {
  const list: any[] = [];
  const monthDays: any[] = generateMonthDaysObject({ year, month });
  for (const day of monthDays) {
    let towDigitDay = day;
    if (day.toString().length != 2) towDigitDay = "0" + day.toString();
    const dayDate: string = year + "-" + month + "-" + towDigitDay;
    const numberOfOrders = await getGrossMarketValueByDay(year, month, day);
    if (!numberOfOrders) {
      break;
    }
    list.push({
      numberOfOrders: numberOfOrders.toString(),
      date: dayDate,
      day,
    });
  }
  return list;
};
