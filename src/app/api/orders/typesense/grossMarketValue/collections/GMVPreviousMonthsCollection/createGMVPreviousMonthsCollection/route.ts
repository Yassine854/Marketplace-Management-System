import { createGMVCollection } from "@/services/orders/typesense/grossMarchandiseValueCollections/createGMVCollection";
import { gmvPreviousMonthsCollectionSchema } from "@/clients/typesense/schema/GMVPreviousMonthsCollection";

import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) =>
  createGMVCollection(request, gmvPreviousMonthsCollectionSchema);
