const { MongoClient } = require('mongodb');
const path = require('path');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
  require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
} catch (e) {
  // Fallback
}

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Error: MONGODB_URI is not defined.");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    const db = client.db('Flixora');

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes('Lists')) {
      console.log("Creating 'Lists' collection...");
      await db.createCollection('Lists');
      console.log("Collection 'Lists' created successfully.");
    } else {
      console.log("Collection 'Lists' already exists.");
    }

    await db.collection('Lists').createIndex({ userId: 1 });
    await db.collection('Lists').createIndex({ userId: 1, movieId: 1 }, { unique: true });
    console.log("Indexes created for 'Lists' collection.");

    const total = await db.collection('Lists').countDocuments();
    console.log(`Total documents in 'Lists' collection: ${total}`);

  } finally {
    await client.close();
  }
}

run();
