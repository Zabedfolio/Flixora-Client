import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || '';
    const title = searchParams.get('title') || '';
    const kidsId = searchParams.get('kidsId') || '';

    const { db } = await connectToDatabase();

    let userId = '';
    try {
      const authSession = await auth.api.getSession({
        headers: await headers(),
      });
      if (authSession?.user?.id) {
        userId = authSession.user.id;
      }
    } catch {
      // silent
    }

    // If userId not found from session but kidsId is provided, find parentId from kids_profiles
    if (!userId && kidsId) {
      let query: any = {};
      if (ObjectId.isValid(kidsId)) {
        query._id = new ObjectId(kidsId);
      } else {
        query._id = kidsId;
      }
      const profile = await db.collection('kids_profiles').findOne(query);
      if (profile?.parentId) {
        userId = profile.parentId;
      }
    }

    const formatTitle = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
    const searchId = id.trim().toLowerCase();
    const searchTitle = title.trim().toLowerCase();
    const formattedSearchTitle = formatTitle(title);

    let isBlocked = false;

    // 1. Direct query against "blocked_movies" collection in MongoDB
    if (userId || kidsId) {
      const blockedMovieQuery: any = {
        $or: [
          ...(userId ? [{ userId }] : []),
          ...(kidsId ? [{ kidsId }] : []),
        ],
      };

      const blockedDocs = await db
        .collection('blocked_movies')
        .find(blockedMovieQuery)
        .toArray();

      for (const doc of blockedDocs) {
        const docMovieId = String(doc.movieId || '').trim().toLowerCase();
        const docMovieSlug = String(doc.movieSlug || '').trim().toLowerCase();
        const docTitle = String(doc.movieTitle || '').trim().toLowerCase();
        const formattedDocTitle = formatTitle(docTitle);

        // Check ID match
        if (
          searchId &&
          (docMovieId === searchId ||
            docMovieSlug === searchId ||
            docMovieId.replace(/[^a-z0-9]/g, '') === searchId.replace(/[^a-z0-9]/g, ''))
        ) {
          isBlocked = true;
          break;
        }

        // Check Title match
        if (searchTitle) {
          if (
            docTitle === searchTitle ||
            formattedDocTitle === formattedSearchTitle ||
            (formattedSearchTitle.length > 3 &&
              (formattedSearchTitle.includes(formattedDocTitle) ||
                formattedDocTitle.includes(formattedSearchTitle)))
          ) {
            isBlocked = true;
            break;
          }
        }
      }
    }

    // 2. Fallback check against "kids_profiles" collection in MongoDB
    if (!isBlocked && (userId || kidsId)) {
      let profilesQuery: any = {};
      if (userId) {
        profilesQuery.parentId = userId;
      } else if (kidsId) {
        if (ObjectId.isValid(kidsId)) {
          profilesQuery._id = new ObjectId(kidsId);
        } else {
          profilesQuery._id = kidsId;
        }
      }

      const profiles = await db.collection('kids_profiles').find(profilesQuery).toArray();

      for (const p of profiles) {
        const blockedIds = Array.isArray(p.blockedMovieIds)
          ? p.blockedMovieIds.map((x: any) => String(x).trim().toLowerCase())
          : [];
        const blockedTitles = Array.isArray(p.blockedMovieTitles)
          ? p.blockedMovieTitles.map((x: any) => String(x).trim().toLowerCase())
          : [];

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
    }

    return NextResponse.json({ success: true, isBlocked });
  } catch (error: any) {
    console.error('GET /api/kids/check-block error:', error);
    return NextResponse.json({ success: false, isBlocked: false });
  }
}
