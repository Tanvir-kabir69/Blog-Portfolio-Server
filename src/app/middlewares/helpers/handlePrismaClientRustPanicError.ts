import { TGenericErrorResponse } from "../../interfaces/error.types";
import { Prisma } from "../../../generated/prisma/client";

export const handlePrismaClientRustPanicError = (
  error: Prisma.PrismaClientRustPanicError,
): TGenericErrorResponse => {
  return {
    statusCode: 500,
    message: error.message,
  };
};