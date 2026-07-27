import { TGenericErrorResponse } from "../../interfaces/error.types";
import { Prisma } from "../../../generated/prisma/client";

export const handlePrismaClientUnknownRequestError = (
  error: Prisma.PrismaClientUnknownRequestError,
): TGenericErrorResponse => {
  return {
    statusCode: 500,
    message: error.message,
  };
};