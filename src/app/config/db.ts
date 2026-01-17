import { PrismaClient } from "@prisma/client";
import { envVars } from "./env";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envVars.DATABASE_URL,
    },
  },
});
