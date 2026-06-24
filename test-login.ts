import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function checkLogin() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "admin@gmail.com" },
    });
    if (!user) {
      console.log("❌ User not found");
      return;
    }
    console.log("✅ User found:", user.email);
    
    const isValid = await bcrypt.compare("Admin@123456", user.password);
    if (isValid) {
      console.log("✅ Password matches!");
    } else {
      console.log("❌ Password does not match!");
    }
  } catch (error) {
    console.error("❌ Connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLogin();
