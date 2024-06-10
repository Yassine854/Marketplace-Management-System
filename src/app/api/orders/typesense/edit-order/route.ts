import { editOrder } from "@/services/orders/typesense/editOrder";
import { NextRequest } from "next/server";

export const PUT = async (request: NextRequest) => editOrder(request);
