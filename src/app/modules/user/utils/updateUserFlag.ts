import { prisma } from "../../../lib/prisma";
import AppError from "../../../utils/AppError";
import httpStatus from "http-status-codes";

// ✅ Define enum for flag fields
export enum UpdateFlag {
  IS_BLOCKED = "isBlocked",
  IS_DELETED = "isDeleted",
  IS_SUBSCRIBED = "isSubscribed",
  IS_VERIFIED = "isVerified",
}

// ✅ Generic reusable helper
const updateUserFlag = async (
  id: number,
  field: UpdateFlag,
  value: boolean
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
      `Failed to update user '${field}' status as: ${value}`
    );
  }

  return updatedUser;
};

export default updateUserFlag;
