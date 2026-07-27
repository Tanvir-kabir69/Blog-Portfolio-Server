import { TGenericErrorResponse } from "../../interfaces/error.types";
import { Prisma } from "../../../generated/prisma/client";

export const handlePrismaClientKnownRequestError = (
  error: Prisma.PrismaClientKnownRequestError,
): TGenericErrorResponse => {
    let statusCode = 500;
    let message = error?.message ? error.message : "An unknown Prisma Client Known Request Error occurred.";

    if (error.code === "P2000") {
        statusCode = 400;
        message = error?.message ? error.message : "The provided value for the field is too long.";
    } else if (error.code === "P2001") {
        statusCode = 404;
        message = error?.message ? error.message : "The record searched for in the where condition does not exist.";
    } else if (error.code === "P2002") {
        statusCode = 400;
        message = error?.message ? error.message : "Unique constraint failed on one or more fields.";
    } else if (error.code === "P2003") {
        statusCode = 400;
        message = error?.message ? error.message : "Foreign key constraint failed on the field.";
    } else if (error.code === "P2004") {
        statusCode = 400;
        message = error?.message ? error.message : "A constraint failed on the database.";
    } else if (error.code === "P2006") {
        statusCode = 404;
        message = error?.message ? error.message : "The record to update or delete does not exist.";
    } else if (error.code === "P2007") {
        statusCode = 400;
        message = error?.message ? error.message : "Data validation error while querying the database.";
    } else if (error.code === "P2011") {
        statusCode = 400;
        message = error?.message ? error.message : "Null constraint violation on the field.";
    } else if (error.code === "P2012") {
        statusCode = 400;
        message = error?.message ? error.message : "Missing a required value for a field.";
    } else if (error.code === "P2013") {
        statusCode = 400;
        message = error?.message ? error.message : "Missing required argument for a field.";
    } else if (error.code === "P2014") {
        statusCode = 400;
        message = error?.message ? error.message : "The change would violate a required relation.";
    } else if (error.code === "P2015") {
        statusCode = 404;
        message = error?.message ? error.message : "A related record could not be found.";
    } else if (error.code === "P2017") {
        statusCode = 404;
        message = error?.message ? error.message : "The record searched for in the where condition does not exist.";
    } else if (error.code === "P2018") {
        statusCode = 404;
        message = error?.message ? error.message : "Required connected records were not found.";
    } else if (error.code === "P2019") {
        statusCode = 400;
        message = error?.message ? error.message : "Input error while processing the query.";
    } else if (error.code === "P2020") {
        statusCode = 400;
        message = error?.message ? error.message : "Provided value for parameter is not supported.";
    } else if (error.code === "P2025") {
        statusCode = 404;
        message = error?.message ? error.message : "An operation failed because a required record was not found.";
    } else if (error.code === "P2033") {
        statusCode = 400;
        message = error?.message ? error.message : "The provided value for the column is too long for the database.";
    } else {
        statusCode = 500;
        message = error?.message ? error.message : "An unknown Prisma Client Known Request Error occurred.";
    }

    return {
        statusCode,
        message,
    };
};