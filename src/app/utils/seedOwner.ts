import { envVars } from "../config/env";
import { AuthProvider, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const seedOwner = async () => {
  try {
    console.log("🚀 Checking for Owner...");

    // Check if Owner already exists
    const isOwnerExist = await prisma.user.findUnique({
      where: { email: envVars.OWNER_EMAIL },
    });

    if (isOwnerExist) {
      console.log("⚠️ Owner already exists, skipping creation.");
      return;
    }

    console.log("🚀 Creating Owner...");

    // Hash password
    const hashedPassword = await bcrypt.hash(
      envVars.OWNER_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    await prisma.$transaction(async (tx) => {
      // 👤 Create Owner
      const owner = await tx.user.create({
        data: {
          name: "Owner",
          email: envVars.OWNER_EMAIL,
          password: hashedPassword,
          role: Role.OWNER,
          provider: AuthProvider.CREDENTIAL,
        },
      });

      console.log("✅ Owner created successfully:");
      if (envVars.NODE_ENV === "development") {
        console.log(owner);
      }
    });
  } catch (error) {
    console.error("❌ Error creating Owner:", error);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedOwner;
