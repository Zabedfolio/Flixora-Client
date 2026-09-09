import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || '';
    const title = searchParams.get('title') || '';

    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json({ success: true, isBlocked: false });
    }

    const { db } = await connectToDatabase();
    const userId = authSession.user.id;

    // Fetch all Kids Profiles for this parent
    const profiles = await db
      .collection('kids_profiles')
      .find({ parentId: userId })
      .toArray();

    if (profiles.length === 0) {
      return NextResponse.json({ success: true, isBlocked: false });
    }

    const formatTitle = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
    const searchId = id.trim().toLowerCase();
    const searchTitle = title.trim().toLowerCase();
    const formattedSearchTitle = formatTitle(title);

    let isBlocked = false;

    for (const p of profiles) {
      const blockedIds = Array.isArray(p.blockedMovieIds)
        ? p.blockedMovieIds.map((x: any) => String(x).trim().toLowerCase())
        : [];
      const blockedTitles = Array.isArray(p.blockedMovieTitles)
        ? p.blockedMovieTitles.map((x: any) => String(x).trim().toLowerCase())
        : [];

      // 1. Check ID match
      if (
        searchId &&
        blockedIds.some(
          (bId: string) =>
            bId === searchId ||
            bId.replace(/[^a-z0-9]/g, '') === searchId.replace(/[^a-z0-9]/g, '')
        )
      ) {
        isBlocked = true;
        break;
      }

      // 2. Check Title match
      if (searchTitle) {
        if (
          blockedTitles.some((bTitle: string) => {
            const formattedB = formatTitle(bTitle);
            return (
              bTitle === searchTitle ||
              formattedB === formattedSearchTitle ||
              (formattedSearchTitle.length > 3 &&
                (formattedSearchTitle.includes(formattedB) ||
                  formattedB.includes(formattedSearchTitle)))
            );
          })
        ) {
          isBlocked = true;
          break;
        }
      }
    }

    return NextResponse.json({ success: true, isBlocked });
  } catch (error: any) {
    console.error('GET /api/kids/check-block error:', error);
    return NextResponse.json({ success: false, isBlocked: false });
  }
}
