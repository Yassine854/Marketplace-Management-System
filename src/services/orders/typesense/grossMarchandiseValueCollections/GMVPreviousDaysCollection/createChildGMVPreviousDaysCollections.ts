import { NextRequest, NextResponse } from "next/server";
import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { logError } from "@/utils/logError";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import {
  successResponse,
  conflictResponse,
  invalidRequestResponse,
  internalServerErrorResponse,
} from "../response";
import { gmvPreviousDaysCollectionSchema } from "@/clients/typesense/schema/GMVPreviousDaysCollection";
import { CollectionUpdateSchema } from "typesense/lib/Typesense/Collection";

export const createChildGMVCollections = async (
  mainCollectionName: string,
  startYear: number,
  endYear: number,
) => {
  const createdCollections: string[] = [];

  try {
    const existingCollections = await typesenseClient.collections().retrieve();
    const collectionNames = existingCollections.map((col: any) => col.name);
    console.log("collectionNames ", collectionNames);

    for (let year = startYear; year <= endYear; year++) {
      const childCollectionName = `${mainCollectionName}_${year}`;
      if (collectionNames.includes(childCollectionName)) {
        continue;
      }
      const childCollection: CollectionCreateSchema = {
        name: childCollectionName,
        enable_nested_fields: true,
        fields: gmvPreviousDaysCollectionSchema.fields,
      };
      await typesenseClient.collections().create(childCollection);
      createdCollections.push(childCollectionName);
    }

    
    

    const updatedMasterCollection = await typesenseClient
      .collections(mainCollectionName)
      .retrieve();
    console.log("Updated master collection:", updatedMasterCollection);

    return successResponse(
      "Child collections created successfully",
      createdCollections,
    );
  } catch (error: any) {
    logError(error);

    const message: string = error?.message ?? "";

    if (message.includes("Request failed with HTTP code 409")) {
      return conflictResponse();
    }

    if (message.includes("Request failed with HTTP code 400"))
      return invalidRequestResponse(message);
  }

  return internalServerErrorResponse();
};
