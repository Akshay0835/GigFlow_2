import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, UserRole } from './src/models/User';

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MONGO_URI not defined.");
  process.exit(1);
}

const seedAdmin = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to DB.");

    const existingAdmin = await User.findOne({ email: 'admin@gigflow.com' });
    if (existingAdmin) {
      console.log("Admin user already exists. Updating role to Admin to be safe.");
      existingAdmin.role = UserRole.Admin;
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log("Admin updated successfully.");
    } else {
      const adminUser = new User({
        name: 'GigFlow Admin',
        email: 'admin@gigflow.com',
        password: 'password123',
        role: UserRole.Admin,
        isVerified: true
      });
      await adminUser.save();
      console.log("Admin user created successfully: admin@gigflow.com / password123");
    }

  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();
