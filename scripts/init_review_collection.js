const { MongoClient } = require('mongodb');
const path = require('path');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
  require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
} catch (e) {
  // Fallback to process.env
}

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Error: MONGODB_URI is not defined in environment variables.");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    const db = client.db('Flixora');

    // 1. Check existing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log("Existing collections:", collectionNames);

    // 2. Create 'review' collection if it doesn't exist
    if (!collectionNames.includes('review')) {
      console.log("Creating 'review' collection...");
      await db.createCollection('review');
      console.log("Collection 'review' created.");
    } else {
      console.log("Collection 'review' already exists.");
    }

    // 3. Create indexes
    await db.collection('review').createIndex({ movieId: 1 });
    await db.collection('review').createIndex({ userId: 1 });
    await db.collection('review').createIndex({ movieId: 1, userId: 1 }, { unique: true });
    console.log("Indexes created for 'review' collection.");

    const total = await db.collection('review').countDocuments();
    console.log(`Total real reviews in collection: ${total}`);

  } finally {
    await client.close();
  }
}

run();
