import User from "@/app/api/models/user";
import bcrypt from "bcryptjs";
import { connectDB } from "./database";

export const seedAdminUser = async () => {
  try {
    await connectDB();
    
    const adminExists = await User.findOne({ email: "admin@hrpro.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@hrpro.com",
        password: hashedPassword,
        role: "admin",
        emailVerified: true,
      });
      console.log("✅ Admin user seeded successfully");
      console.log("📧 Email: admin@hrpro.com");
      console.log("🔑 Password: admin123");
    } else {
      console.log("ℹ️ Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedAdminUser().then(() => {
    console.log("Seeding completed");
    process.exit(0);
  }).catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
} 