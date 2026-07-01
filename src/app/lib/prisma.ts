import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../../generated/prisma/client";
import { envVars } from "../config/env";

const connectionString: string = `${envVars.DATABASE_URL}`;

// 1. Setup the native database driver
// const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const pool = new pg.Pool({ connectionString: connectionString });

// 2. Wrap it in a Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the Client (The required argument)
export const prisma = new PrismaClient({ adapter });
