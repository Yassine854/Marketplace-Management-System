import { createGMVCollection } from "@/services/orders/typesense/grossMarchandiseValueCollections/createGMVCollection";
import { gmvPreviousDaysCollectionSchema } from "@/clients/typesense/schema/GMVPreviousDaysCollection";

import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) =>
  createGMVCollection(request, gmvPreviousDaysCollectionSchema);
