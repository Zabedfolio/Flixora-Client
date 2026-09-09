import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';

// Helper to determine max Kids Profiles allowed based on user plan
function getMaxKidsProfiles(planName: string = ''): number {
  const normalized = planName.trim().toLowerCase();
  if (normalized.includes('premium')) return 99; // Unlimited
  if (normalized.includes('standard')) return 3;
  if (normalized.includes('basic')) return 1;
  return 0; // Free / Unpaid users get 0 profiles
}

// GET: Fetch Kids Profiles for the current logged-in parent
export async function GET(req: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const userId = authSession.user.id;

    // Look up user document to verify active plan
    let userDoc: any = null;
    try {
      if (ObjectId.isValid(userId)) {
        userDoc = await db.collection('user').findOne({ _id: new ObjectId(userId) });
      } else {
        userDoc = await db.collection('user').findOne({ id: userId });
      }
    } catch {
      userDoc = await db.collection('user').findOne({ id: userId });
    }

    const planName = userDoc?.plan || 'Free';
    const maxAllowed = getMaxKidsProfiles(planName);

    const profilesRaw = await db
      .collection('kids_profiles')
      .find({ parentId: userId })
      .sort({ createdAt: -1 })
      .toArray();

    const profiles = profilesRaw.map((p: any) => ({
      _id: p._id.toString(),
      id: p._id.toString(),
      parentId: p.parentId,
      name: p.name || 'Kids Profile',
      username: p.username || `@kids_${p._id.toString().slice(-4)}`,
      pin: p.pin || '1234',
      avatar: p.avatar || 'https://i.ibb.co/ZRCZZjZY/77a32760a782.png',
      blockedGenres: Array.isArray(p.blockedGenres) ? p.blockedGenres : [],
      blockedMovieIds: Array.isArray(p.blockedMovieIds) ? p.blockedMovieIds : [],
      blockedMovieTitles: Array.isArray(p.blockedMovieTitles) ? p.blockedMovieTitles : [],
      createdAt: p.createdAt,
    }));

    const currentCount = profiles.length;
    const canCreateMore = currentCount < maxAllowed;
    const hasPaidPlan = maxAllowed > 0;

    return NextResponse.json({
      success: true,
      profiles,
      planInfo: {
        name: planName,
        currentCount,
        maxAllowed,
        canCreateMore,
        hasPaidPlan,
      },
    });
  } catch (error: any) {
    console.error('GET /api/kids error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch kids profiles' },
      { status: 500 }
    );
  }
}

// POST: Create a new Kids Profile
export async function POST(req: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'You must be signed in to create a Kids Profile' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const userId = authSession.user.id;

    // Check user plan limits
    let userDoc: any = null;
    try {
      if (ObjectId.isValid(userId)) {
        userDoc = await db.collection('user').findOne({ _id: new ObjectId(userId) });
      } else {
        userDoc = await db.collection('user').findOne({ id: userId });
      }
    } catch {
      userDoc = await db.collection('user').findOne({ id: userId });
    }

    const planName = userDoc?.plan || 'Free';
    const maxAllowed = getMaxKidsProfiles(planName);

    if (maxAllowed === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'You need an active subscription plan (Basic, Standard, or Premium) to create a Kids Profile.',
          code: 'PLAN_REQUIRED',
        },
        { status: 403 }
      );
    }

    const existingCount = await db
      .collection('kids_profiles')
      .countDocuments({ parentId: userId });

    if (existingCount >= maxAllowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Your ${planName} plan allows a maximum of ${maxAllowed} Kids Profile(s). Upgrade your plan to add more.`,
          code: 'PLAN_LIMIT_REACHED',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, username, pin, avatar, blockedGenres, blockedMovieIds, blockedMovieTitles } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Kids Name is required' },
        { status: 400 }
      );
    }

    const cleanPin = (pin && String(pin).trim()) || '1234';
    if (!/^\d{4}$/.test(cleanPin)) {
      return NextResponse.json(
        { success: false, message: 'Security PIN must be a 4-digit numeric code' },
        { status: 400 }
      );
    }

    const now = new Date();
    const cleanUsername = username
      ? `@${username.trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '')}`
      : `@${name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')}_kids`;

    const newProfile = {
      parentId: userId,
      parentEmail: authSession.user.email || '',
      name: name.trim(),
      username: cleanUsername,
      pin: cleanPin,
      avatar: avatar || 'https://i.ibb.co/ZRCZZjZY/77a32760a782.png',
      blockedGenres: Array.isArray(blockedGenres) ? blockedGenres : [],
      blockedMovieIds: Array.isArray(blockedMovieIds) ? blockedMovieIds : [],
      blockedMovieTitles: Array.isArray(blockedMovieTitles) ? blockedMovieTitles : [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('kids_profiles').insertOne(newProfile);

    return NextResponse.json({
      success: true,
      message: 'Kids Profile created successfully!',
      profile: {
        _id: result.insertedId.toString(),
        id: result.insertedId.toString(),
        ...newProfile,
      },
    });
  } catch (error: any) {
    console.error('POST /api/kids error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create kids profile' },
      { status: 500 }
    );
  }
}

// PATCH: Update an existing Kids Profile
export async function PATCH(req: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, name, username, pin, avatar, blockedGenres, blockedMovieIds, blockedMovieTitles } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Kids Profile ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const userId = authSession.user.id;

    let query: any = { parentId: userId };
    if (ObjectId.isValid(id)) {
      query._id = new ObjectId(id);
    } else {
      query._id = id;
    }

    const updateFields: any = { updatedAt: new Date() };

    if (name && typeof name === 'string') updateFields.name = name.trim();
    if (username && typeof username === 'string') {
      updateFields.username = `@${username.trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '')}`;
    }
    if (pin && /^\d{4}$/.test(String(pin).trim())) {
      updateFields.pin = String(pin).trim();
    }
    if (avatar && typeof avatar === 'string') updateFields.avatar = avatar;
    if (Array.isArray(blockedGenres)) updateFields.blockedGenres = blockedGenres;
    if (Array.isArray(blockedMovieIds)) updateFields.blockedMovieIds = blockedMovieIds;
    if (Array.isArray(blockedMovieTitles)) updateFields.blockedMovieTitles = blockedMovieTitles;

    const result = await db.collection('kids_profiles').updateOne(query, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Kids Profile not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kids Profile updated successfully!',
    });
  } catch (error: any) {
    console.error('PATCH /api/kids error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update kids profile' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a Kids Profile
export async function DELETE(req: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Kids Profile ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const userId = authSession.user.id;

    let query: any = { parentId: userId };
    if (ObjectId.isValid(id)) {
      query._id = new ObjectId(id);
    } else {
      query._id = id;
    }

    const result = await db.collection('kids_profiles').deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Kids Profile not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kids Profile deleted successfully!',
    });
  } catch (error: any) {
    console.error('DELETE /api/kids error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete kids profile' },
      { status: 500 }
    );
  }
}
