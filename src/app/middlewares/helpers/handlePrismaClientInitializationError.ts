import { TGenericErrorResponse } from "../../interfaces/error.types";
import { Prisma } from "../../../generated/prisma/client";

export const handlePrismaClientInitializationError = (
  error: Prisma.PrismaClientInitializationError,
): TGenericErrorResponse => {
  return {
    statusCode: 500,
    message: error.message,
  };
};