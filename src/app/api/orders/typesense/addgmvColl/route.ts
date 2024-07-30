import { addgmvCollection } from "@/clients/typesense/orders/grossMarketValue/gmvCollection/addgmvPrevMonthsColl";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => addgmvCollection(request);
