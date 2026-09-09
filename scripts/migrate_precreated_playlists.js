const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Error: MONGODB_URI is not defined in environment variables.");
    process.exit(1);
  }
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('Flixora');

    console.log("Updating pre-created playlists to use userIds array and isPreCreated flag...");
    const curatedTags = ['Feel-Good', 'Intense', 'Nostalgic', 'Emotional', 'Adrenaline', 'Binge Night'];

    const user = await db.collection('user').findOne({ email: 'mahin@gmail.com' });
    const userId = user._id.toString();

    const res = await db.collection('playlist').updateMany(
      { tag: { $in: ['Feel-Good', 'Intense', 'Nostalgic', 'Emotional', 'Adrenaline'] } },
      { 
        $set: { isPreCreated: true },
        $addToSet: { userIds: userId }
      }
    );

    console.log(`Updated ${res.modifiedCount} pre-created playlists.`);

    // Create index on userIds
    await db.collection('playlist').createIndex({ userIds: 1 });
    console.log("Created index on userIds: 1");

    const all = await db.collection('playlist').find({}).toArray();
    console.log("\nAll Playlists in Atlas:");
    all.forEach(p => {
      console.log({
        id: p._id.toString(),
        name: p.name,
        tag: p.tag,
        isPreCreated: p.isPreCreated || false,
        userId: p.userId,
        userIds: p.userIds
      });
    });

  } finally {
    await client.close();
  }
}

run();
