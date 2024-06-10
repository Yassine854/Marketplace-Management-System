import { NextResponse } from "next/server";
import { addOrder } from "@/services/orders/typesense/addOrder";

export async function POST(request: Request) {
  console.log("🚀 ~ POST ~ Request:", request);
  return NextResponse.json(
    {
      message: "Order successfully added.",
      order_id: "12345",
    },
    {
      status: 201,
    },
  );
  try {
    // addOrder()
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    return NextResponse.json("Error", {
      status: 500,
    });
  }
}
