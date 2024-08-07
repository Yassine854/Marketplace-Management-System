import { nucPreviousMonthsCollectionSchema } from "@/clients/typesense/schema/nucPreviousMonthsCollection";
import { createCollection } from "@/services/orders/typesense/createCollection";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  return NextResponse.json("Error", {
    status: 500,
  });
};
//createCollection(request);
