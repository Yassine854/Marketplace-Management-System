import { responses } from "@/clients/nextRoutes/responses";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";
import dayjs from "dayjs";
import { unixTimestampToDateDMY } from "@/utils/unixTimestamp";

export const numberOfUniqueCustometerByYearAnalytics = async (date: string) => {
  try {
    const paramYear = Number(date);

    const FirstOrder = await typesenseClient
      .collections("orders")
      .documents()
      .search({ q: "*", sort_by: "createdAt:asc" });

    const hit = FirstOrder.hits || [];

    const { createdAt }: any = hit[0]?.document;

    const [currentMonth, currentYear] = dayjs()
      .format("MM YYYY")
      .split(" ")
      .map(Number);
    const [startDay, startMonth, startYear] = unixTimestampToDateDMY(createdAt)
      .split("/")
      .map(Number);

    const fetchPromises = [];

    for (let month = 1; month <= 12; month++) {
      if (
        (paramYear === currentYear && month >= currentMonth) ||
        (paramYear === startYear && month < startMonth)
      ) {
        continue;
      }
      fetchPromises.push(
        fetch(
          `http://localhost:3000/api/analytics/numberOfUniqueCustomer/byMonth?date=${paramYear}-${month}`,
        )
          .then((response) => response.json())
          .then((json) => json.data),
      );
    }

    const result = await Promise.all(fetchPromises);
    return result;
  } catch (error) {
    logError(error);
    return responses.internalServerError();
  }
};
