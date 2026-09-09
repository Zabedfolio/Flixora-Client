const { MongoClient, ObjectId } = require('mongodb');
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
    console.log("Connecting to MongoDB Atlas Cluster0...");
    await client.connect();
    const db = client.db('Flixora');

    // 1. Check existing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log("Existing Collections in Flixora:", collectionNames);

    // 2. Explicitly create collection 'playlist' if not present
    if (!collectionNames.includes('playlist')) {
      console.log("Creating 'playlist' collection explicitly...");
      await db.createCollection('playlist');
      console.log("Collection 'playlist' created successfully!");
    } else {
      console.log("Collection 'playlist' already exists.");
    }

    // 3. Create index on userId
    console.log("Creating index on { userId: 1 }...");
    await db.collection('playlist').createIndex({ userId: 1 });
    console.log("Index created successfully.");

    // 4. Find the registered user to link the playlist
    const user = await db.collection('user').findOne({ email: 'mahin@gmail.com' });
    if (!user) {
      console.error("User mahin@gmail.com not found!");
      return;
    }

    console.log(`Found user: ${user.name} (${user._id})`);

    // 5. Check if user already has playlists
    const existingPlaylists = await db.collection('playlist').find({ userId: user._id.toString() }).toArray();
    console.log(`User currently has ${existingPlaylists.length} playlists.`);

    if (existingPlaylists.length === 0) {
      console.log("Inserting starter playlist connected to user...");
      const starterPlaylist = {
        userId: user._id.toString(),
        userName: user.name || 'Zabed Mahmud',
        userEmail: user.email,
        name: 'Cosmic Marathon',
        tag: 'Binge Night',
        description: 'Curated high-octane sci-fi, cyberpunk & blockbuster action movies.',
        isPublic: true,
        movies: [
          {
            movieId: '680',
            title: 'Pulp Fiction',
            unsplash_url: 'https://image.tmdb.org/t/p/w500/d5iIlFnGhFAppAh09Xn6GX9z9b.jpg',
            category: 'Thriller',
            year: '1994',
            duration: '2h 34m',
            addedAt: new Date()
          },
          {
            movieId: '550',
            title: 'Fight Club',
            unsplash_url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
            category: 'Drama',
            year: '1999',
            duration: '2h 19m',
            addedAt: new Date()
          },
          {
            movieId: '155',
            title: 'The Dark Knight',
            unsplash_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            category: 'Action',
            year: '2008',
            duration: '2h 32m',
            addedAt: new Date()
          },
          {
            movieId: '27205',
            title: 'Inception',
            unsplash_url: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
            category: 'Sci-Fi',
            year: '2010',
            duration: '2h 28m',
            addedAt: new Date()
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('playlist').insertOne(starterPlaylist);
      console.log(`Starter playlist inserted with _id: ${result.insertedId}`);
    }

    // 6. Verify collection list again
    const finalCollections = await db.listCollections().toArray();
    console.log("Updated Collections in Flixora:", finalCollections.map(c => c.name));

    // 7. Verify documents in 'playlist'
    const totalPlaylists = await db.collection('playlist').countDocuments();
    console.log(`Total documents in 'playlist' collection: ${totalPlaylists}`);
    const sample = await db.collection('playlist').findOne({});
    console.log("Sample Playlist Document:", JSON.stringify(sample, null, 2));

  } catch (error) {
    console.error("Initialization error:", error);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

run();
