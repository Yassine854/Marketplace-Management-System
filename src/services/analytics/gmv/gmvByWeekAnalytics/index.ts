import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import { getGmvByDay } from "@/clients/typesense/orders/gmv/getGmvByDay";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export const gmvByWeekAnalytics = async (yearArg: number, weekArg: number) => {
  const list: any[] = [];

  const startCurrentWeek = dayjs()
    .year(yearArg)
    .isoWeek(weekArg)
    .startOf("isoWeek");
  const endCurrentWeek = startCurrentWeek.endOf("isoWeek");

  const fetchPromises = [];
  const Week: string[] = [];

  let dayIndex: number = 0;

  while (dayIndex < 7) {
    const currentDay = startCurrentWeek.add(dayIndex, "day");
    const formattedDateDayMonth = currentDay.format("ddd, DD-MMM");
    const [year, month, day] = currentDay
      .format("YYYY-MM-DD")
      .split("-")
      .map(Number);

    const fetchPromise = await getGmvByDay(year, month, day);
    if (fetchPromise === null) {
      break;
    }

    Week.push(formattedDateDayMonth);
    fetchPromises.push(fetchPromise);
    dayIndex++;
  }

  const results = await Promise.all(fetchPromises);

  results.forEach((grossMarketValue, index) => {
    if (grossMarketValue !== null) {
      list.push({
        grossMarketValue: grossMarketValue?.toString(),
        date: Week[index],
      });
    }
  });

  return list;
};
