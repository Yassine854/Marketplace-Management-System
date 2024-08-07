import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import { logError } from "@/utils/logError";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { NextResponse } from "next/server";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

type DataType = {
  day: string;
  gmv: number;
};

type GmvDocument = {
  gmv: number;
  id: string;
  month: string;
  year: string;
  day: string;
};

type SearchResult = {
  hits?: Array<{ document: GmvDocument }>;
};

export const gmvByWeekAnalytics = async (yearArg: number, weekArg: number) => {
  try {
    const gmvData: DataType[] = [];

    try {
      const searchParams = {
        filter_by: `year:=[${yearArg}] && week:=[${weekArg}]`,
        q: "*",
        page: 1,
        per_page: 250,
      };

      const searchResults: any = await typesenseClient
        .collections("gmvPreviousDays")
        .documents()
        .search(searchParams);

      const hits = searchResults.hits ?? [];

      const allOrders = hits
        .map((hit: any) => hit.document)
        .sort((a: any, b: any) => {
          return (
            new Date(`${a.year}-${a.month}-${a.day}`).getTime() -
            new Date(`${b.year}-${b.month}-${b.day}`).getTime()
          );
        });

      allOrders.forEach((order: any) => {
        const formattedDate = dayjs(
          `${order.year}-${order.month}-${order.day}`,
        ).format("ddd, DD-MM-YYYY"); // Format as "Mon", "Tue", etc.
        gmvData.push({
          day: formattedDate,
          gmv: order.gmv,
        });
      });
    } catch (error: any) {
      logError(error);
    }

    return gmvData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logError(`Error fetching GMV per week data: ${error.message}`);
    } else {
      logError("Unknown error fetching GMV per week data");
    }
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
};
