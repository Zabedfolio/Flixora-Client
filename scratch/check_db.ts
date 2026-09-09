import { connectToDatabase } from '../src/lib/mongodb';

async function check() {
  const { db } = await connectToDatabase();
  const collections = await db.listCollections().toArray();
  console.log("Collections:", collections.map((c: any) => c.name));
  
  for (const c of collections) {
    const count = await db.collection(c.name).countDocuments();
    console.log(`- ${c.name}: ${count}`);
  }
  process.exit(0);
}
check().catch(console.error);
