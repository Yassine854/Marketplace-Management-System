import { nucPreviousMonthsCollectionSchema } from "@/clients/typesense/schema/nucPreviousMonthsCollection";
import { createCollection } from "@/services/orders/typesense/createCollection";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) =>
  createCollection(request, nucPreviousMonthsCollectionSchema);
