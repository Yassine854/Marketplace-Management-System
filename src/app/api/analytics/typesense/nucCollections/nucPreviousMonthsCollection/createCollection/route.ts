import { nucPreviousMonthsCollectionSchema } from "@/clients/typesense/schemas/nucPreviousMonthsCollection";
import { createCollection } from "@/clients/typesense/createCollection";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  return NextResponse.json("Error", {
    status: 500,
  });
};
//createCollection(request);
