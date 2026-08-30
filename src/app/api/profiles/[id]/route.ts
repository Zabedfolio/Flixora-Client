import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = params.id;
    const { name, avatar, avatarId } = await request.json();
    if (!name || !avatar) {
      return NextResponse.json({ error: 'name and avatar are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('user').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          name, 
          image: avatar, 
          avatarId: avatarId || 'custom',
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedProfile = {
      _id: result._id.toString(),
      userId: result._id.toString(),
      name: result.name || name,
      avatar: result.image || avatar,
      avatarId: result.avatarId || avatarId || 'custom'
    };

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    console.error('PUT profiles error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = params.id;
    const { db } = await connectToDatabase();
    
    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(id) },
      { 
        $unset: { 
          image: "", 
          avatarId: "" 
        } 
      }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile reset successfully' });
  } catch (error: any) {
    console.error('DELETE profiles error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
