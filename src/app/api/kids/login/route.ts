import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { createHMAC } from '@better-auth/utils/hmac';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, pin } = body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json(
        { success: false, message: 'Kids Username or Handle is required' },
        { status: 400 }
      );
    }

    if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin.trim())) {
      return NextResponse.json(
        { success: false, message: 'A 4-digit numeric Security PIN is required' },
        { status: 400 }
      );
    }

    const cleanPin = pin.trim();
    const cleanRaw = username.trim().toLowerCase();
    const cleanWithAt = cleanRaw.startsWith('@') ? cleanRaw : `@${cleanRaw}`;
    const cleanWithoutAt = cleanRaw.replace(/^@/, '');

    const { db } = await connectToDatabase();

    // Find profile matching username OR handle OR name and matching PIN
    const profile = await db.collection('kids_profiles').findOne({
      $and: [
        { pin: cleanPin },
        {
          $or: [
            { username: cleanWithAt },
            { username: cleanWithoutAt },
            { username: { $regex: new RegExp(`^@?${cleanWithoutAt}$`, 'i') } },
            { name: { $regex: new RegExp(`^${cleanWithoutAt}$`, 'i') } },
          ],
        },
      ],
    });

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid Kids Username/Handle or 4-digit PIN. Please check your credentials.',
        },
        { status: 401 }
      );
    }

    // Find parent user to authorize session
    const parentId = profile.parentId;
    let parentUser: any = null;

    if (ObjectId.isValid(parentId)) {
      parentUser = await db.collection('user').findOne({ _id: new ObjectId(parentId) });
    }
    if (!parentUser) {
      parentUser = await db.collection('user').findOne({ id: parentId });
    }

    if (!parentUser) {
      return NextResponse.json(
        { success: false, message: 'Parent account associated with this Kids Profile could not be found' },
        { status: 404 }
      );
    }

    // Create session via Better Auth internal adapter for full server-side session validity
    const ctx = await auth.$context;
    const userIdStr = parentUser._id ? parentUser._id.toString() : parentUser.id;
    const session = await ctx.internalAdapter.createSession(userIdStr);

    // Sign the session token using Better Auth secret and HMAC SHA-256 base64 format
    const signature = await createHMAC('SHA-256', 'base64').sign(ctx.secret, session.token);
    const signedCookieValue = `${session.token}.${signature}`;

    const formattedProfile = {
      _id: profile._id.toString(),
      id: profile._id.toString(),
      parentId: profile.parentId,
      name: profile.name,
      username: profile.username,
      pin: profile.pin,
      avatar: profile.avatar || 'https://i.ibb.co/ZRCZZjZY/77a32760a782.png',
      blockedGenres: Array.isArray(profile.blockedGenres) ? profile.blockedGenres : [],
      blockedMovieIds: Array.isArray(profile.blockedMovieIds) ? profile.blockedMovieIds : [],
      blockedMovieTitles: Array.isArray(profile.blockedMovieTitles) ? profile.blockedMovieTitles : [],
    };

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${profile.name}! Successfully authenticated in Kids Mode.`,
      profile: formattedProfile,
      parentUser: {
        id: userIdStr,
        name: parentUser.name,
        email: parentUser.email,
      },
    });

    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      expires: new Date(session.expiresAt),
    };

    // Set signed cookies matching Better Auth session cookie names
    response.cookies.set('better-auth.session_token', signedCookieValue, cookieOptions);
    if (process.env.NODE_ENV === 'production') {
      response.cookies.set('__Secure-better-auth.session_token', signedCookieValue, cookieOptions);
    }

    return response;
  } catch (error: any) {
    console.error('POST /api/kids/login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to authenticate Kids profile' },
      { status: 500 }
    );
  }
}
