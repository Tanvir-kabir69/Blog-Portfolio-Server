import bcrypt from "bcrypt";
import { envVars } from "../../config/env";
import AppError from "../../utils/AppError";
import httpStatus from "http-status-codes";
import { TMeta } from "../../interfaces/meta";
import updateUserFlag, { UpdateFlag } from "./utils/updateUserFlag";
import { prisma } from "../../lib/prisma";
import { Prisma, User } from "../../../generated/prisma/client";

const createUserIntoDB = async (
  payload: Prisma.UserCreateInput,
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(
    payload.password as string,
    Number(envVars.BCRYPT_SALT_ROUND),
  );
  const hashedUserData: Prisma.UserCreateInput = {
    ...payload,
    password: hashedPassword,
    provider: "CREDENTIAL",
  };
  const result = await prisma.user.create({ data: hashedUserData });
  return result;
};

const getAllUsersFromDB = async (
  search: string,
  page: number,
  limit: number,
  orderOn: string,
  orderBy: string,
): Promise<{ data: Partial<User>[]; meta?: TMeta }> => {
  const skip = (page - 1) * limit;
  console.log(search, ",", page, ",", limit);

  // Start with empty object
  let where: any = {};

  // Add conditionally if search is valid
  if (search && search.trim() !== "") {
    where = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const result = await prisma.user.findMany({
    skip,
    take: limit,
    // where: {
    //   OR: [
    //     { name: { contains: search, mode: "insensitive" } },
    //     { address: { contains: search, mode: "insensitive" } },
    //   ],
    // },
    where,
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      address: true,
      gender: true,
      dob: true,
      image: true,
      isSubscribed: true,
      _count: {
        select: {
          blogs: true,
        },
      },
    },
    // orderBy: { id: "desc" },
    orderBy: { [orderOn]: orderBy },
  });

  //   if (!result || result.length === 0) {
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Something Went wrong, try again",
    );
  }

  const total = await prisma.user.count({ where });

  return {
    data: result,
    meta: { page, limit, total: total, totalPage: Math.ceil(total / limit) },
  };
};

const getASingleUserFromDB = async (id: number) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      address: true,
      gender: true,
      dob: true,
      image: true,
      isSubscribed: true,
      _count: {
        select: {
          blogs: true,
        },
      },
    },
  });
  return result;
};

const updateASingleUserIntoDB = async (
  id: number,
  payload: Prisma.UserUpdateInput,
) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      name: true,
      address: true,
      gender: true,
      dob: true,
    },
  });

  if (!updatedUser) {
    throw new Error("User not updated!");
  }

  return updatedUser;
};

// ✅ Service functions using the enum

// const deleteASingleUserIntoDB = (id: number) =>
//   updateUserFlag(id, UpdateFlag.IS_DELETED, true);

// const reAddASingleUserIntoDB = (id: number) =>
//   updateUserFlag(id, UpdateFlag.IS_DELETED, false);
// const blockASingleUserIntoDB = (id: number) =>
//   updateUserFlag(id, UpdateFlag.IS_BLOCKED, true);

// const unblockASingleUserIntoDB = (id: number) =>
//   updateUserFlag(id, UpdateFlag.IS_BLOCKED, false);

// const makeSubscribedASingleUserIntoDB = (id: number) =>
//   updateUserFlag(id, UpdateFlag.IS_SUBSCRIBED, true);

// const makeUnsubscribedASingleUserIntoDB = (id: number) =>
//   updateUserFlag(id, UpdateFlag.IS_SUBSCRIBED, false);

// ✅ Generic reusable helper
const updateUserFlagService = async (
  id: number,
  field: UpdateFlag,
  value: boolean,
) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { [field]: value },
    select: {
      id: true,
      email: true,
      [field]: true,
    },
  });

  if (!updatedUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to update user '${field}' status as: ${value}`,
    );
  }

  return updatedUser;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getASingleUserFromDB,
  updateASingleUserIntoDB,
  // deleteASingleUserIntoDB,
  // reAddASingleUserIntoDB,
  // blockASingleUserIntoDB,
  // unblockASingleUserIntoDB,
  // makeSubscribedASingleUserIntoDB,
  // makeUnsubscribedASingleUserIntoDB,
  updateUserFlagService,
};
