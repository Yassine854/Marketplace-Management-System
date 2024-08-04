import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { NextResponse, type NextRequest } from "next/server";
import { getAllSuppliers } from "@/services/supplier/getAllSuppliers";

export const GET = async (request: NextRequest) => {
  try {
    const suppliers = await getAllSuppliers();

    return NextResponse.json(
      {
        message: "success",
        suppliers,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    logError(error);

    return responses.internalServerError();
  }
};
