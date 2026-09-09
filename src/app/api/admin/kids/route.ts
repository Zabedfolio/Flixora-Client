import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

function formatDate(dateInput: any): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

// GET: Fetch all Kids Profiles for Admin Management
export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const profilesRaw = await db
      .collection('kids_profiles')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Fetch all unique parent IDs
    const parentIds: string[] = Array.from(new Set(profilesRaw.map((p: any) => p.parentId).filter((id: any): id is string => Boolean(id))));

    // Fetch parent user docs for display
    let parentUsersMap: Record<string, any> = {};
    if (parentIds.length > 0) {
      const objectIds = parentIds.filter((id: string) => ObjectId.isValid(id)).map((id: string) => new ObjectId(id));
      const usersRaw = await db
        .collection('user')
        .find({
          $or: [
            { _id: { $in: objectIds } },
            { id: { $in: parentIds } },
          ],
        })
        .toArray();

      usersRaw.forEach((u: any) => {
        const uIdStr = u._id.toString();
        const customId = u.id;
        if (uIdStr) parentUsersMap[uIdStr] = u;
        if (customId) parentUsersMap[customId] = u;
      });
    }

    let totalContentRestrictions = 0;

    const profiles = profilesRaw.map((p: any) => {
      const parentUser = parentUsersMap[p.parentId] || {};
      const blockedGenres = Array.isArray(p.blockedGenres) ? p.blockedGenres : [];
      const blockedMovieIds = Array.isArray(p.blockedMovieIds) ? p.blockedMovieIds : [];
      const blockedMovieTitles = Array.isArray(p.blockedMovieTitles) ? p.blockedMovieTitles : [];

      totalContentRestrictions += blockedGenres.length + blockedMovieTitles.length;

      return {
        id: p._id.toString(),
        _id: p._id.toString(),
        parentId: p.parentId,
        parentName: parentUser.name || 'Parent Account',
        parentEmail: p.parentEmail || parentUser.email || 'N/A',
        parentPlan: parentUser.plan || 'Standard',
        name: p.name || 'Kids Profile',
        username: p.username || `@kids_${p._id.toString().slice(-4)}`,
        pin: p.pin || '1234',
        avatar: p.avatar || 'https://i.ibb.co/ZRCZZjZY/77a32760a782.png',
        blockedGenres,
        blockedMovieIds,
        blockedMovieTitles,
        createdAt: formatDate(p.createdAt),
      };
    });

    const totalKidsProfiles = profiles.length;
    const uniqueParentsCount = new Set(profiles.map((p: any) => p.parentId)).size;

    return NextResponse.json({
      success: true,
      profiles,
      stats: {
        totalKidsProfiles,
        totalParentAccounts: uniqueParentsCount,
        totalContentRestrictions,
      },
    });
  } catch (error: any) {
    console.error('GET /api/admin/kids error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch kids profiles for admin' },
      { status: 500 }
    );
  }
}

// DELETE: Admin override deletion of any Kids Profile
export async function DELETE(req: Request) {
  try {
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
        { success: false, message: 'Kids Profile ID is required for deletion' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { _id: id };
    }

    const result = await db.collection('kids_profiles').deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Kids Profile not found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kids Profile deleted successfully by admin!',
    });
  } catch (error: any) {
    console.error('DELETE /api/admin/kids error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete kids profile' },
      { status: 500 }
    );
  }
}

// PATCH: Admin update any Kids Profile (name, pin, username, avatar, restrictions)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, name, pin, username, avatar, blockedGenres, blockedMovieIds, blockedMovieTitles } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Kids Profile ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    let query: any = {};
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { _id: id };
    }

    const updateFields: any = { updatedAt: new Date() };
    if (name !== undefined && name.trim()) updateFields.name = name.trim();
    if (pin !== undefined && pin.trim()) updateFields.pin = String(pin).trim();
    if (username !== undefined && username.trim()) {
      const cleanUser = username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`;
      updateFields.username = cleanUser;
    }
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (Array.isArray(blockedGenres)) updateFields.blockedGenres = blockedGenres;
    if (Array.isArray(blockedMovieIds)) updateFields.blockedMovieIds = blockedMovieIds;
    if (Array.isArray(blockedMovieTitles)) updateFields.blockedMovieTitles = blockedMovieTitles;

    const result = await db.collection('kids_profiles').updateOne(query, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Kids Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kids Profile updated successfully by Admin!',
    });
  } catch (error: any) {
    console.error('PATCH /api/admin/kids error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update kids profile' },
      { status: 500 }
    );
  }
}
