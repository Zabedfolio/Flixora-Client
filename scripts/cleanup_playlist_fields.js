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

    console.log("Cleaning up denormalized fields from playlist collection...");
    const result = await db.collection('playlist').updateMany(
      {},
      { $unset: { userName: "", userEmail: "" } }
    );

    console.log(`Updated ${result.modifiedCount} playlist documents.`);

    const allPlaylists = await db.collection('playlist').find({}).toArray();
    console.log("Current Playlists in MongoDB:");
    allPlaylists.forEach(p => {
      console.log({
        _id: p._id.toString(),
        userId: p.userId,
        name: p.name,
        tag: p.tag,
        moviesCount: (p.movies || []).length,
        hasUserName: Boolean(p.userName),
        hasUserEmail: Boolean(p.userEmail)
      });
    });

  } finally {
    await client.close();
  }
}

run();
