import { getNooForEachHourOfTheDay } from "@/services/orders/getNumberOfOrders/getNooForEachHourOfTheDay";

export const nooByDay = async (currentDay: string) => {
  const [day, month, year] = currentDay.split("-");

  let towDigitDay = day.toString();
  if (day.toString().length != 2) {
    towDigitDay = "0" + day.toString();
  }
  const dayDate: string = year + "-" + month + "-" + towDigitDay;

  let data: any[] = [];

  const numberOfOrders = await getNooForEachHourOfTheDay(dayDate);
  numberOfOrders.map((OrderByHour, index) => {
    data.push({
      numberOfOrders: !!OrderByHour ? OrderByHour : 0,
      day: dayDate,
      Hour: `${index + 1}:00`,
    });
  });
  return data;
};
