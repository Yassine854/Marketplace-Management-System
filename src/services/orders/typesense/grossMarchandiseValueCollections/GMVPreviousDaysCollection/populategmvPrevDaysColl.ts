import { typesenseClient } from "@/clients/typesense/typesenseClient";
import dayjs from "dayjs";
import { getGrossMarketValueByDay } from "../../grossMarchandiseValue/getGrossMarchandiseValueByDay";
export async function populateGMVPreviousDays() {
  try {
    const currentDate = dayjs().format("DD-MM-YYYY");
    const [day, month, year] = currentDate.split("-").map(Number);
    let endDay = 31;
    let finalMonth = 12;
    for (let monthIndex = 1; monthIndex <= finalMonth; monthIndex++) {
      if (monthIndex === month) {
        endDay = day - 1;
        finalMonth = month;
      }
      for (let dayIndex = 1; dayIndex <= endDay; dayIndex++) {
        const result = await getGrossMarketValueByDay(
          year,
          monthIndex,
          dayIndex,
        );
        const monthDocument = {
          id: `${dayIndex}-${monthIndex}-${year}`,
          year: year.toString(),
          month: monthIndex.toString(),
          day: dayIndex.toString(),
          gmv: result,
        };
        await typesenseClient
          .collections("gmvPreviousDays")
          .documents()
          .upsert(monthDocument);
      }
    }

    console.log("Finished populating gmvPreviousDays collection");
    return {
      success: true,
      message: "GMV previous Days data updated successfully",
    };
  } catch (error) {
    console.error("Error populating gmvPreviousDays:", error);
    throw error;
  }
}
