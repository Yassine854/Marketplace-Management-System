import { createCollection } from "@/services/orders/typesense/createCollection";
import { gmvPreviousMonthsCollectionSchema } from "@/clients/typesense/schema/GMVPreviousMonthsCollection";

import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) =>
  createCollection(request, gmvPreviousMonthsCollectionSchema);
