import { MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Flixora';
  const client = new MongoClient(mongoUri);
  await client.connect();
  
  const db = client.db('Flixora');
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}
