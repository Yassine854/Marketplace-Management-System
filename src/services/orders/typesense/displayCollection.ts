import { NextResponse, type NextRequest } from "next/server";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";

export const displayCollection = async (
  request: NextRequest,
  collectionName: string,
  filterBy?: string,
  queryBy?: string,
) => {
  try {
    const searchParams = {
      filter_by: filterBy,
      q: "*",
      query_by: queryBy,
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
