import { addgmvCollection } from "@/services/orders/typesense/grossMarchandiseValueCollections/addgmvPrevMonthsColl";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => addgmvCollection(request);
