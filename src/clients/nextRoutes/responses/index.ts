import { unauthorizedErrorResponse } from "./unauthorizedErrorResponse";
import { internalServerErrorResponse } from "./internalServerErrorResponse";
import { addOrderSuccessResponse } from "./typesenseResponses/addOrderSuccessResponse";
import { addOrderConflictResponse } from "./typesenseResponses/addOrderConflictResponse";
import { orderNotFoundResponse } from "./typesenseResponses/orderNotFoundResponse";
import { invalidRequestErrorResponse } from "./typesenseResponses/invalidRequestErrorResponse";

export const responses = {
  unauthorized: unauthorizedErrorResponse,
  internalServerError: internalServerErrorResponse,

  typesense: {
    addOrderSuccess: addOrderSuccessResponse,
    addOrderConflict: addOrderConflictResponse,
    orderNotFound: orderNotFoundResponse,
    invalidRequest: invalidRequestErrorResponse,
  },
};
