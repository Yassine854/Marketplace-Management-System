import { typesenseClient } from "@/clients/typesense/typesenseClient";
import dayjs from "dayjs";
import { getGmvByDay } from "@/clients/typesense/orders/gmv/getGmvByDay";

export async function populateGMVPreviousDays() {
  try {
    const startYear = 2020;
    const currentDate = dayjs();
    const currentYear = currentDate.year();
    const currentMonth = currentDate.month() + 1;
    const currentDay = currentDate.date();

    for (let year = startYear; year <= currentYear; year++) {
      const finalMonth = year === currentYear ? currentMonth : 12;

      for (let month = 1; month <= finalMonth; month++) {
        const endDay =
          year === currentYear && month === currentMonth
            ? currentDay - 1
            : dayjs(`${year}-${month}`).daysInMonth();

        for (let day = 1; day <= endDay; day++) {
          try {
            const result = await getGmvByDay(year, month, day);
            const document = {
              id: `${day}-${month}-${year}`,
              year: year.toString(),
              month: month.toString(),
              day: day.toString(),
              gmv: result,
            };
            await typesenseClient
              .collections("gmvPreviousDays")
              .documents()
              .upsert(document);
          } catch (error) {
            console.error(
              `Error processing date ${day}-${month}-${year}:`,
              error,
            );
          }
        }
      }
    }

    console.log("Finished populating gmvPreviousDays collection");
    return {
      success: true,
      message: "GMV previous days data updated successfully",
    };
  } catch (error) {
    console.error("Error populating gmvPreviousDays:", error);
    throw error;
  }
}
