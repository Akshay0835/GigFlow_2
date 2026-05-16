import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from './app';
import { User, UserRole } from './models/User';
import { Lead, LeadStatus, LeadSource } from './models/Lead';

dotenv.config();

const PORT = process.env.PORT || 8000;
let mongoServer: MongoMemoryServer;

// Uncaught Exception Handler
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const seedDatabase = async () => {
  const usersCount = await User.countDocuments();
  if (usersCount === 0) {
    await User.create({
      name: 'Admin User',
      email: 'admin@smartleads.com',
      password: 'password123',
      role: UserRole.Admin,
    });
    console.log('✅ Seeded Admin User: admin@smartleads.com / password123');
  }

  const leadsCount = await Lead.countDocuments();
  if (leadsCount === 0) {
    await Lead.insertMany([
      { name: 'Rajesh Kumar', email: 'rajesh.kumar@example.in', status: LeadStatus.New, source: LeadSource.Website },
      { name: 'Priya Sharma', email: 'priya.sharma@example.in', status: LeadStatus.Contacted, source: LeadSource.Instagram },
      { name: 'Amit Patel', email: 'amit.patel@example.in', status: LeadStatus.Qualified, source: LeadSource.Referral },
      { name: 'Neha Gupta', email: 'neha.g@example.in', status: LeadStatus.Lost, source: LeadSource.Website },
      { name: 'Vikram Singh', email: 'vikram.singh@example.in', status: LeadStatus.New, source: LeadSource.Instagram },
      { name: 'Anjali Desai', email: 'anjali.d@example.in', status: LeadStatus.Contacted, source: LeadSource.Referral },
      { name: 'Suresh Reddy', email: 'suresh.reddy@example.in', status: LeadStatus.Qualified, source: LeadSource.Website },
      { name: 'Kavita Verma', email: 'kavita.v@example.in', status: LeadStatus.New, source: LeadSource.Instagram },
      { name: 'Rahul Joshi', email: 'rahul.joshi@example.in', status: LeadStatus.Contacted, source: LeadSource.Website },
      { name: 'Sneha Iyer', email: 'sneha.iyer@example.in', status: LeadStatus.Qualified, source: LeadSource.Referral },
    ]);
    console.log('✅ Seeded initial leads data.');
  }
};

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    // Use In-Memory MongoDB if no URI is provided (zero-config setup!)
    if (!mongoUri) {
      console.log('No MONGO_URI provided. Starting In-Memory MongoDB for seamless development...');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connection successful');

    await seedDatabase();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    const shutdown = async () => {
      console.log('🛑 Gracefully shutting down...');
      server.close();
      if (mongoServer) {
        await mongoose.disconnect();
        await mongoServer.stop();
      }
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.once('SIGUSR2', shutdown);

    // Unhandled Rejection Handler
    process.on('unhandledRejection', (err: Error) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();
