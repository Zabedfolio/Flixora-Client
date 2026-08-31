import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

const PRESET_AVATARS = [
  { id: 'spiderman', name: 'Spider-Man', url: "https://i.ibb.co/Cs0Z14TD/857476df6e87.jpg" },
  { id: 'batman', name: 'Batman', url: "https://i.ibb.co/fzQdvy33/c5005c8f408c.jpg" },
  { id: 'hulk', name: 'Hulk', url: "https://i.ibb.co/KjG62St5/28a071b23c43.jpg" },
  { id: 'ironman', name: 'Iron Man', url: "https://i.ibb.co/N6pnL1Vd/c0b33285fed7.jpg" },
  { id: 'captain_america', name: 'Captain America', url: "https://i.ibb.co/9kBq2HrN/99052d2013b0.jpg" },
  { id: 'robot', name: 'Robot', url: "https://i.ibb.co/99BwLZ1f/df4b1e66aac1.png" },
  { id: 'tom', name: 'Tom', url: "https://i.ibb.co/ZRCZZjZY/77a32760a782.png" },
  { id: 'jerry', name: 'Jerry', url: "https://i.ibb.co/chCxgVC0/e7ba688df62e.png" },
  { id: 'preset_1', name: 'Vector 1', url: "https://i.ibb.co/T94VNG1/feca82718a3f.png" },
  { id: 'preset_2', name: 'Vector 2', url: "https://i.ibb.co/hRfpJsBz/77c8ff018f5a.png" },
  { id: 'preset_3', name: 'Vector 3', url: "https://i.ibb.co/XxyLdGR6/3dc0753b83ec.png" },
  { id: 'preset_4', name: 'Vector 4', url: "https://i.ibb.co/mrkSXMgF/7dedb3686be5.png" },
  { id: 'preset_5', name: 'Vector 5', url: "https://i.ibb.co/LXQNQV9m/652fb8497ee2.png" },
  { id: 'preset_6', name: 'Vector 6', url: "https://i.ibb.co/1Y2xx1kP/51b2fb15a0ee.png" },
  { id: 'preset_7', name: 'Vector 7', url: "https://i.ibb.co/CKKwvPt3/ff71a75a86b2.png" },
  { id: 'preset_8', name: 'Vector 8', url: "https://i.ibb.co/gbHs65wB/23a94dbf6add.png" },
  { id: 'preset_9', name: 'Vector 9', url: "https://i.ibb.co/wr8KLWVX/b36812a8e507.png" },
  { id: 'preset_10', name: 'Vector 10', url: "https://i.ibb.co/Kj6rV2Lf/6d56e0aff7cb.png" },
  { id: 'preset_11', name: 'Vector 11', url: "https://i.ibb.co/xS2Bbnnf/c2ad01014374.png" },
  { id: 'preset_12', name: 'Vector 12', url: "https://i.ibb.co/1tg3pmf5/66bf149bee43.png" },
  { id: 'preset_13', name: 'Vector 13', url: "https://i.ibb.co/6JYZcLwx/78848dc519d3.png" },
  { id: 'preset_14', name: 'Vector 14', url: "https://i.ibb.co/t6rg5Wg/0a79a010554f.png" },
  { id: 'preset_15', name: 'Vector 15', url: "https://i.ibb.co/JjbgKv0Y/5a26e062d00a.png" },
  { id: 'preset_16', name: 'Vector 16', url: "https://i.ibb.co/nNTXmzFc/94d78e061075.png" },
  { id: 'preset_17', name: 'Vector 17', url: "https://i.ibb.co/6Rjr6hnF/b4b11563b172.png" },
  { id: 'preset_18', name: 'Vector 18', url: "https://i.ibb.co/B1kNw0P/d35c729b0b32.png" },
  { id: 'preset_19', name: 'Vector 19', url: "https://i.ibb.co/0VhJB6Jq/81a3061e3614.png" },
  { id: 'preset_20', name: 'Vector 20', url: "https://i.ibb.co/K3tMSb9/3c4645c88c8b.png" }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // 1. Seed avatars collection if it is empty or incomplete
    const avatarsCount = await db.collection('avatars').countDocuments();
    if (avatarsCount < PRESET_AVATARS.length) {
      await db.collection('avatars').deleteMany({}); // Clear partial entries
      await db.collection('avatars').insertMany(
        PRESET_AVATARS.map(av => ({
          _id: av.id,
          name: av.name,
          url: av.url
        })) as any
      );
    }

    // 2. Fetch the user directly from the native user collection
    const user = await db.collection('user').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json([]);
    }

    // Return profile in array structure to align with settings component state
    return NextResponse.json([{
      _id: user._id.toString(),
      userId: user._id.toString(),
      name: user.name || 'Primary Account',
      avatar: user.image || PRESET_AVATARS[0].url,
      avatarId: user.avatarId || PRESET_AVATARS[0].id
    }]);
  } catch (error: any) {
    console.error('GET profiles error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, name, avatar, avatarId } = await request.json();
    if (!userId || !name || !avatar) {
      return NextResponse.json({ error: 'userId, name, and avatar are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Update the native user document to map name, image (avatar url), and avatarId
    await db.collection('user').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          name, 
          image: avatar, 
          avatarId: avatarId || 'custom',
          updatedAt: new Date() 
        } 
      }
    );

    const createdProfile = {
      _id: userId,
      userId,
      name,
      avatar,
      avatarId: avatarId || 'custom'
    };

    return NextResponse.json(createdProfile, { status: 201 });
  } catch (error: any) {
    console.error('POST profiles error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
