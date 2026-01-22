import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "./AppError";
import { generateToken, verifyToken } from "./jwt";
import { AuthTokens } from "../interfaces/auhtTokens";
import { IJwtPayload } from "../interfaces/jwtPayload";
import { User } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

// export const createUserTokens = (user: Partial<User>): AuthTokens => {
export const createUserTokens = (user: User): AuthTokens => {
  const jwtPayload: IJwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    isSubscribed: user.isSubscribed,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenByRefreshToken = async (
  refreshToken: string,
): Promise<Partial<AuthTokens>> => {
  try {
    const verifiedRefreshToken = verifyToken(
      refreshToken,
      envVars.JWT_REFRESH_SECRET,
    ) as JwtPayload;

    const isUserExist = await prisma.user.findUnique({
      where: { email: verifiedRefreshToken.email },
    });

    if (!isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    }
    if (!isUserExist.password) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Password not set for this account",
      );
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

    const jwtPayload: IJwtPayload = {
      userId: isUserExist.id,
      email: isUserExist.email,
      role: isUserExist.role,
      isVerified: isUserExist.isVerified,
      isSubscribed: isUserExist.isSubscribed,
    };
    const accessToken = generateToken(
      jwtPayload,
      envVars.JWT_ACCESS_SECRET,
      envVars.JWT_ACCESS_EXPIRES,
    );

    return { accessToken };
  } catch (err) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Something went wrong in generating new Access Token",
    );
  }
};
