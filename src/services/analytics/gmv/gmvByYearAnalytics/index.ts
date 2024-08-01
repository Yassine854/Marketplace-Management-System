import { NextResponse, type NextRequest } from "next/server";
import { logError } from "@/utils/logError";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
type DataType = {
  Months: string[];
  gmv: number[];
};

type GmvDocument = {
  gmv: number;
  id: string;
  month: string;
  year: string;
};

type SearchResult = {
  hits: Array<{ document: GmvDocument }>;
};

export const gmvByYearAnalytics = async (year: any) => {
  try {
    let Months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    if (Number(year) === currentYear) {
      Months = Months.slice(0, currentMonth + 1);
    }
    const gmv: number[] = [];
    let allOrders: number[] = [];
    try {
      const searchParams = {
        filter_by: `year:=${year}`,
        q: "*",
        query_by: "year,month",
        page: 1,
        per_page: 250,
      };
      const searchResults = await typesenseClient
        .collections("gmvPreviousMonths")
        .documents()
        .search(searchParams);
      const hits = searchResults.hits || [];
      //@ts-ignore
      allOrders = hits.map((hit) => hit.document.gmv);
    } catch (error: any) {
      logError(error);
    }
    if (Number(year) === currentYear) {
      Months = Months.slice(0, currentMonth + 1);
    }
    const data: DataType = {
      Months,
      gmv: allOrders,
    };

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logError(`Error fetching gmv per year data: ${error.message}`);
    } else {
      logError("Unknown error fetching gmv per year data");
    }
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
};
