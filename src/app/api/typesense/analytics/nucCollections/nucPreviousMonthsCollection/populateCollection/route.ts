import { populateCollection } from "@/services/typesense/populateNucPrevMonthsCollection/populateCollection";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  return await populateCollection(request);
};
