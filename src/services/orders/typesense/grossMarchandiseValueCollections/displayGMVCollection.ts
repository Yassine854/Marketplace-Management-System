import { NextResponse, type NextRequest } from "next/server";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";

export const displayColl = async (
  request: NextRequest,
  collectionName: string,
) => {
  try {
    const searchParams = {
      filter_by: "",
      q: "*",
      query_by: "year,month",
      page: 1,
      per_page: 250,
    };
    const collectionContent = await typesenseClient
      .collections(collectionName)
      .documents()
      .search(searchParams);

    return collectionContent;
  } catch (error: any) {
    logError(error);
  }
};
