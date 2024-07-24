import { NextRequest } from "next/server";
import { nextRoute } from "@/clients/nextRoutes";

export const GET = async (request: NextRequest) =>
  nextRoute.orders.typesense.numberOfOrders.byQuarter(request);
