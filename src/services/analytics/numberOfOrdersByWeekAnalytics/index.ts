import { getNumberOfOrdersByDay } from "@/services/orders/typesense/numberOfOrders/getNumberOfOrdersByDay";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

export const numberOfOrderByWeekAnalytics = async (date: string) => {
  const [year, week] = date.split("-");
  let weekNumber: number = 0;
  if (week.length === 3) {
    weekNumber = Number(week.slice(1, 3));
  }
  if (week.length === 2) {
    weekNumber = Number(week.slice(1, 2));
  }

  const startOfYear = dayjs(new Date(Number(year), 0, 1));
  let startDate = startOfYear
    .add(Number(weekNumber) - 1, "week")
    .startOf("isoWeek");

  const list: any[] = [];
  for (let dayIndex = 1; dayIndex <= 7; dayIndex++) {
    let currentDate = startDate;
    let day = currentDate.toDate().getDate();
    let month = currentDate.toDate().getMonth() + 1;
    let year = currentDate.toDate().getFullYear();
    let towDigitDay = day.toString();
    if (day.toString().length != 2) {
      towDigitDay = "0" + day.toString();
    }
    const dayDate: string = year + "-" + month + "-" + towDigitDay;
    const numberOfOrders = await getNumberOfOrdersByDay(dayDate);
    startDate = startDate.add(1, "day");
    list.push({
      numberOfOrders: !!numberOfOrders ? numberOfOrders : 0,
      date: dayDate,
    });
  }
  return list;
};
