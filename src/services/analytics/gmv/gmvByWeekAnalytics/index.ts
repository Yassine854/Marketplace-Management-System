import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import { getGmvByDay } from "@/clients/typesense/orders/gmv/getGmvByDay";
import { logError } from "@/utils/logError";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { NextResponse } from "next/server";
import { dateYMDToUnixTimestamp } from "@/utils/unixTimestamp";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

type DataType = {
  WeekDays: string[];
  gmv: number[];
};

type GmvDocument = {
  gmv: number;
  id: string;
  month: string;
  year: string;
  day: string;
};

type SearchResult = {
  hits: Array<{ document: GmvDocument }>;
};

export const gmvByWeekAnalytics = async (yearArg: number, weekArg: number) => {
  try {
    let WeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const startCurrentWeek = dayjs()
      .year(yearArg)
      .isoWeek(weekArg)
      .startOf("isoWeek");
    const startCurrentWeekFormatted = dateYMDToUnixTimestamp(
      startCurrentWeek.format("YYYY-M-D"),
    );
    console.log("startCurrentWeek: ", startCurrentWeekFormatted);

    const endCurrentWeek = startCurrentWeek.endOf("isoWeek");
    const endCurrentWeekFormatted = dateYMDToUnixTimestamp(
      endCurrentWeek.format("YYYY-M-D"),
    );
    console.log(
      "🚀 ~ gmvByWeekAnalytics ~ endCurrentWeek:",
      endCurrentWeekFormatted,
    );

    const gmv: number[] = [];
    let allOrders: number[] = [];
    try {
      const searchParams = {
        filter_by: `id:=[${startCurrentWeekFormatted}..${endCurrentWeekFormatted}]`,
        q: "*",
        query_by: "year,month,day",
        page: 1,
        per_page: 250,
      };

      const searchResults = await typesenseClient
        .collections("gmvPreviousDays")
        .documents()
        .search(searchParams);

      console.log("🚀 ~ gmvByWeekAnalytics ~ searchResults:", searchResults);
      const hits = searchResults.hits || [];
      //@ts-ignore
      allOrders = hits.map((hit) => hit.document.gmv);
      console.log("🚀 ~ gmvByWeekAnalytics ~ allOrders:", allOrders);
    } catch (error: any) {
      logError(error);
    }

    const data: DataType = {
      WeekDays,
      gmv: allOrders,
    };

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logError(`Error fetching gmv per week data: ${error.message}`);
    } else {
      logError("Unknown error fetching gmv per week data");
    }
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
};
