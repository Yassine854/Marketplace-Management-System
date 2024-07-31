import { addgmvCollection } from "@/services/orders/typesense/gmvCollection/addgmvPrevMonthsColl";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => addgmvCollection(request);
