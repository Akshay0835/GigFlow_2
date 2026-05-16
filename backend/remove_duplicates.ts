import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("Error: MONGO_URI is not defined in the .env file.");
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB.");
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection is undefined.");
    }

    const leadsCollection = db.collection('leads');
    
    // Fetch all leads
    const leads = await leadsCollection.find({}).toArray();
    console.log(`Found a total of ${leads.length} leads in the database.`);
    
    const seenEmails = new Set<string>();
    const idsToDelete: mongoose.Types.ObjectId[] = [];
    
    for (const lead of leads) {
      if (lead.email && typeof lead.email === 'string') {
        // If we've already seen this email, flag the document's ID for deletion
        if (seenEmails.has(lead.email.toLowerCase())) {
          idsToDelete.push(lead._id);
        } else {
          seenEmails.add(lead.email.toLowerCase());
        }
      }
    }
    
    console.log(`Identified ${idsToDelete.length} duplicate leads to remove.`);
    
    if (idsToDelete.length > 0) {
      // Perform a bulk deletion of all duplicate IDs
      const result = await leadsCollection.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`Successfully deleted ${result.deletedCount} duplicate leads.`);
    } else {
      console.log("No duplicate leads found. The database is clean.");
    }

    // Attempt to drop the old email index to allow Mongoose to recreate it cleanly
    try {
      await leadsCollection.dropIndex("email_1");
      console.log("Dropped the old non-unique 'email_1' index.");
    } catch(e: any) {
      // This error usually just means the index doesn't exist, which is fine
      console.log("Old 'email_1' index not found or already dropped. Skipping.");
    }

  } catch (err) {
    console.error("An error occurred during cleanup:", err);
  } finally {
    // Ensure we safely disconnect regardless of success or failure
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
};

run();
