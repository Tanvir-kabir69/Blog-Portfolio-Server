import { TGenericErrorResponse } from "../../interfaces/error.types";
import { Prisma } from "../../../generated/prisma/client";

export const handlePrismaClientValidationError = (
  error: Prisma.PrismaClientValidationError,
): TGenericErrorResponse => {
  return {
    statusCode: 500,
    message: error.message,
  };
};