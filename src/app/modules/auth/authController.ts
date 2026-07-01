import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../utils/AppError";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { User } from "../../../generated/prisma/client";
import {
  createNewAccessTokenByRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { setAuthCookie } from "../../utils/setCookie";
import removeToken from "../../utils/removeToken";
import { AuthTokens } from "../../interfaces/auhtTokens";

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Wrap passport.authenticate in a Promise so async/await + catchAsync can handle errors
    await new Promise<void>((resolve, reject) => {
      passport.authenticate(
        "local",
        { session: false },
        (err: any, user: User | false, info: any) => {
          if (err) {
            // system/db error from strategy
            return reject(
              new AppError(httpStatus.INTERNAL_SERVER_ERROR, String(err)),
            );
          }

          if (!user) {
            // auth failed (blocked, deleted, wrong password, etc.)
            return reject(
              new AppError(
                httpStatus.UNAUTHORIZED,
                info?.message || "Invalid credentials",
              ),
            );
          }

          // Success: create JWT (or do whatever post-login logic needed)
          const userTokens = createUserTokens(user);
          setAuthCookie(res, userTokens);

          sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Login successful",
            data: {
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              },
              // token,
            },
          });

          return resolve();
        },
      )(req, res, next);
    });
  },
);

const newAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken as string;
    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Refresh Token Found");
    }
    const newAccessToken: Partial<AuthTokens> =
      await createNewAccessTokenByRefreshToken(refreshToken);
    setAuthCookie(res, newAccessToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New Access Token Set successfully",
      data: null,
    });
  },
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    removeToken(res);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Logout successful",
      data: null,
    });
  },
);

export const authController = {
  loginUser,
  newAccessToken,
  logOut,
};
