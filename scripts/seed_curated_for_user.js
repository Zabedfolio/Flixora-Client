const { MongoClient, ObjectId } = require('mongodb');

const CURATED_PLAYLIST_BLUEPRINTS = [
  {
    name: 'Feel-Good Favorites',
    tag: 'Feel-Good',
    description: 'Uplifting stories, heartwarming laughs, and feel-good cinema.',
    movies: [
      {
        movieId: '120467',
        title: 'The Grand Budapest Hotel',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
        year: '2014',
        duration: '1h 40m',
        category: 'Comedy',
      },
      {
        movieId: '313369',
        title: 'La La Land',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
        year: '2016',
        duration: '2h 9m',
        category: 'Romance',
      },
      {
        movieId: '13',
        title: 'Forrest Gump',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/Cw4hIUIAmSYfK9QfaUW5igp9La.jpg',
        year: '1994',
        duration: '2h 22m',
        category: 'Drama',
      },
    ],
  },
  {
    name: 'Intense Thrillers',
    tag: 'Intense',
    description: 'High-stakes suspense, shocking twists, and psychological mysteries.',
    movies: [
      {
        movieId: '11324',
        title: 'Shutter Island',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg',
        year: '2010',
        duration: '2h 18m',
        category: 'Mystery',
      },
      {
        movieId: '807',
        title: 'Se7en',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg',
        year: '1995',
        duration: '2h 7m',
        category: 'Crime',
      },
      {
        movieId: '210577',
        title: 'Gone Girl',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/ts996lKsxvjkO2yiYG0ht4qAicO.jpg',
        year: '2014',
        duration: '2h 29m',
        category: 'Thriller',
      },
    ],
  },
  {
    name: 'Nostalgic Rewind',
    tag: 'Nostalgic',
    description: 'Timeless retro cinema, iconic dialogues, and 90s gold.',
    movies: [
      {
        movieId: '680',
        title: 'Pulp Fiction',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg',
        year: '1994',
        duration: '2h 34m',
        category: 'Thriller',
      },
      {
        movieId: '550',
        title: 'Fight Club',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg',
        year: '1999',
        duration: '2h 19m',
        category: 'Drama',
      },
      {
        movieId: '603',
        title: 'The Matrix',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg',
        year: '1999',
        duration: '2h 16m',
        category: 'Sci-Fi',
      },
      {
        movieId: '329',
        title: 'Jurassic Park',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/63viWuPfYQjRYLSZSZNq7dglJP5.jpg',
        year: '1993',
        duration: '2h 7m',
        category: 'Adventure',
      },
    ],
  },
  {
    name: 'Emotional Journeys',
    tag: 'Emotional',
    description: 'Deep romances, tearful journeys, and touching dramas.',
    movies: [
      {
        movieId: '597',
        title: 'Titanic',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
        year: '1997',
        duration: '3h 14m',
        category: 'Romance',
      },
      {
        movieId: '157336',
        title: 'Interstellar',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg',
        year: '2014',
        duration: '2h 49m',
        category: 'Sci-Fi',
      },
      {
        movieId: '11036',
        title: 'The Notebook',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg',
        year: '2004',
        duration: '2h 4m',
        category: 'Romance',
      },
      {
        movieId: '497',
        title: 'The Green Mile',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg',
        year: '1999',
        duration: '3h 9m',
        category: 'Drama',
      },
    ],
  },
  {
    name: 'Adrenaline Rush',
    tag: 'Adrenaline',
    description: 'Action-packed cinematic spectacles, supercars, and high-speed chases.',
    movies: [
      {
        movieId: '155',
        title: 'The Dark Knight',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        year: '2008',
        duration: '2h 32m',
        category: 'Action',
      },
      {
        movieId: '76341',
        title: 'Mad Max: Fury Road',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/ulcAi4dKpAjHwYGS08vNyx9H6I9.jpg',
        year: '2015',
        duration: '2h 0m',
        category: 'Action',
      },
      {
        movieId: '245891',
        title: 'John Wick',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/wXqWR7dHncNRbxoEGybEy7QTe9h.jpg',
        year: '2014',
        duration: '1h 41m',
        category: 'Action',
      },
      {
        movieId: '361743',
        title: 'Top Gun: Maverick',
        unsplash_url: 'https://image.tmdb.org/t/p/w500/n0YuM4f5lvGAP6MAW2kBIzugXnc.jpg',
        year: '2022',
        duration: '2h 10m',
        category: 'Action',
      },
    ],
  },
];

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

    const user = await db.collection('user').findOne({ email: 'mahin@gmail.com' });
    if (!user) {
      console.error("User mahin@gmail.com not found");
      return;
    }

    const userId = user._id.toString();
    console.log(`Seeding curated playlists for user: ${user.name} (${userId})`);

    const now = new Date();
    for (const bp of CURATED_PLAYLIST_BLUEPRINTS) {
      const existing = await db.collection('playlist').findOne({
        tag: bp.tag,
        isPreCreated: true
      });

      if (!existing) {
        const doc = {
          name: bp.name,
          tag: bp.tag,
          description: bp.description,
          isPublic: true,
          isPreCreated: true,
          userIds: [userId],
          movies: bp.movies.map(m => ({ ...m, addedAt: now })),
          createdAt: now,
          updatedAt: now
        };
        const res = await db.collection('playlist').insertOne(doc);
        console.log(`Inserted curated playlist "${bp.name}" with id ${res.insertedId}`);
      } else {
        await db.collection('playlist').updateOne(
          { _id: existing._id },
          { $addToSet: { userIds: userId }, $unset: { userId: "" } }
        );
        console.log(`Updated curated playlist "${bp.name}" with user.`);
      }
    }

    // Set user.playlistsInitialized = true
    await db.collection('user').updateOne(
      { _id: user._id },
      { $set: { playlistsInitialized: true } }
    );

    const userPlaylists = await db.collection('playlist').find({ userId }).toArray();
    console.log(`User now has ${userPlaylists.length} playlists in total.`);

  } finally {
    await client.close();
  }
}

run();
