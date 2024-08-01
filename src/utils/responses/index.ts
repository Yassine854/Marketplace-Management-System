import { unauthorizedErrorResponse } from "./unauthorizedErrorResponse";
import { internalServerErrorResponse } from "./internalServerErrorResponse";
import { invalidRequestErrorResponse } from "./invalidRequestErrorResponse";
import { orderNotFoundResponse } from "./typesenseResponses/orderNotFoundResponse";
import { addOrderSuccessResponse } from "./typesenseResponses/addOrderSuccessResponse";
import { addOrderConflictResponse } from "./typesenseResponses/addOrderConflictResponse";

export const responses = {
  unauthorized: unauthorizedErrorResponse,
  invalidRequest: invalidRequestErrorResponse,
  internalServerError: internalServerErrorResponse,

  typesense: {
    orderNotFound: orderNotFoundResponse,
    addOrderSuccess: addOrderSuccessResponse,
    addOrderConflict: addOrderConflictResponse,
  },
};
