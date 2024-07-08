import { getLocalTimeZone } from "@internationalized/date";

export const convertToUnixTimestamp = (value: any, formatter: any) => {
  const dateString = formatter.format(value?.toDate(getLocalTimeZone()));
  const [month, day, year] = dateString.split("/").map(Number);

  const date = new Date(year, month - 1, day);

  return Math.floor(date.getTime() / 1000);
};
