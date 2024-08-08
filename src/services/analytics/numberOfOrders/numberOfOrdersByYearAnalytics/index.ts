import { getNumberOfOrdersByMonth } from "@/services/analytics/numberOfOrders/getNumberOfOrdersByMonth";

function generateMonthsArray() {
  return Array.from({ length: 12 }, (_, i) => i + 1);
}

export const numberOfOrdersByYearAnalytics = async (year: string) => {
  const list: any[] = [];
  const months: number[] = generateMonthsArray();

  for (const month of months) {
    let twoDigitMonth = month.toString().padStart(2, "0");
    const monthDate: string = `${year}-${twoDigitMonth}`;
    const numberOfOrders = await getNumberOfOrdersByMonth(monthDate);

    if (!numberOfOrders) {
      break;
    }

    list.push({
      numberOfOrders: numberOfOrders.toString(),
      date: monthDate,
    });
  }

  return list;
};
