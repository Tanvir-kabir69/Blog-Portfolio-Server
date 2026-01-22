import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
// import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../utils/AppError";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import { IJwtPayload } from "../interfaces/jwtPayload";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new AppError(403, "No Access Token Recieved");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
        //   ) as JwtPayload;
      ) as IJwtPayload;

      const isUserExist = await prisma.user.findUnique({
        where: { email: verifiedToken.email },
      });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      if (isUserExist.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is blocked");
      }

      if (!isUserExist.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is inactive");
      }

      // if (!isUserExist.isVerified) {
      //   return done(null, false, { message: "User is not verified" });
      // }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!!!");
      }

      // req.user = verifiedToken;
      req.authinticatedUser = verifiedToken;
      next();
    } catch (error) {
      // console.log("jwt error", error);
      next(error);
    }
  };
