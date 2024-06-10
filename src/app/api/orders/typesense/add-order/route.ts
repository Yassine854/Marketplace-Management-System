import { addOrder } from "@/services/orders/typesense/addOrder";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => addOrder(request);
