import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/app/(auth)/lib/auth';
import { headers } from 'next/headers';

const INITIAL_REVIEWS_SEED = [
  {
    movieId: "27205",
    movieTitle: "Inception",
    userName: "Anika Rahman",
    userEmail: "anika@gmail.com",
    rating: 5,
    review: "Absolutely amazing movie! The story, visuals and acting were outstanding.",
    status: "Pending",
    createdAt: new Date("2026-09-01T10:00:00Z"),
    updatedAt: new Date("2026-09-01T10:00:00Z")
  },
  {
    movieId: "157336",
    movieTitle: "Interstellar",
    userName: "Siam Ahmed",
    userEmail: "siam@gmail.com",
    rating: 5,
    review: "One of the best science fiction movies I have ever watched.",
    status: "Approved",
    createdAt: new Date("2026-08-31T14:30:00Z"),
    updatedAt: new Date("2026-08-31T14:30:00Z")
  },
  {
    movieId: "155",
    movieTitle: "The Dark Knight",
    userName: "Nusrat Jahan",
    userEmail: "nusrat@gmail.com",
    rating: 4,
    review: "Great movie with excellent performances and a very strong storyline.",
    status: "Pending",
    createdAt: new Date("2026-08-30T11:20:00Z"),
    updatedAt: new Date("2026-08-30T11:20:00Z")
  },
  {
    movieId: "19995",
    movieTitle: "Avatar",
    userName: "Rakib Hasan",
    userEmail: "rakib@gmail.com",
    rating: 3,
    review: "The visuals are impressive, but the story could have been better.",
    status: "Rejected",
    createdAt: new Date("2026-08-29T16:45:00Z"),
    updatedAt: new Date("2026-08-29T16:45:00Z")
  },
  {
    movieId: "872585",
    movieTitle: "Oppenheimer",
    userName: "Mim Akter",
    userEmail: "mim@gmail.com",
    rating: 5,
    review: "Brilliant direction and acting. A very powerful cinematic experience.",
    status: "Approved",
    createdAt: new Date("2026-08-28T09:15:00Z"),
    updatedAt: new Date("2026-08-28T09:15:00Z")
  },
  {
    movieId: "693134",
    movieTitle: "Dune: Part Two",
    userName: "Tanvir Islam",
    userEmail: "tanvir@gmail.com",
    rating: 4,
    review: "Beautiful cinematography and world building. Loved the movie.",
    status: "Pending",
    createdAt: new Date("2026-08-27T18:00:00Z"),
    updatedAt: new Date("2026-08-27T18:00:00Z")
  },
  {
    movieId: "299534",
    movieTitle: "Avengers: Endgame",
    userName: "Fariha Noor",
    userEmail: "fariha@gmail.com",
    rating: 5,
    review: "Such an emotional and entertaining movie. The ending was perfect.",
    status: "Approved",
    createdAt: new Date("2026-08-26T12:10:00Z"),
    updatedAt: new Date("2026-08-26T12:10:00Z")
  },
  {
    movieId: "475557",
    movieTitle: "Joker",
    userName: "Hasan Mahmud",
    userEmail: "hasan@gmail.com",
    rating: 2,
    review: "The movie was interesting but some scenes were unnecessarily disturbing.",
    status: "Rejected",
    createdAt: new Date("2026-08-25T15:40:00Z"),
    updatedAt: new Date("2026-08-25T15:40:00Z")
  }
];

function formatDate(dateInput: any): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "Recent";
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  } catch {
    return "Recent";
  }
}

// GET: Fetch all reviews from MongoDB database for Admin Moderation
export async function GET(req: Request) {
  try {
    const { db } = await connectToDatabase();
    
    // Check count in 'review' collection
    let reviewCount = await db.collection('review').countDocuments();
    
    // Auto-seed if database review collection is empty
    if (reviewCount === 0) {
      console.log('Seeding initial MongoDB review collection for admin moderation...');
      await db.collection('review').insertMany(INITIAL_REVIEWS_SEED);
      reviewCount = INITIAL_REVIEWS_SEED.length;
    }

    const reviewsRaw = await db
      .collection('review')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const reviews = reviewsRaw.map((r: any) => {
      const status: "Pending" | "Approved" | "Rejected" = 
        (r.status === "Approved" || r.status === "Rejected") ? r.status : "Pending";

      return {
        id: r._id.toString(),
        _id: r._id.toString(),
        user: r.userName || r.user || 'Anonymous Viewer',
        email: r.userEmail || r.email || 'N/A',
        movie: r.movieTitle || r.movie || 'Featured Movie',
        movieId: r.movieId || '',
        rating: Number(r.rating) || 5,
        review: r.review || '',
        status: status,
        date: formatDate(r.createdAt || r.updatedAt),
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString()
      };
    });

    const totalCount = reviews.length;
    const pendingCount = reviews.filter((r: any) => r.status === 'Pending').length;
    const approvedCount = reviews.filter((r: any) => r.status === 'Approved').length;
    const rejectedCount = reviews.filter((r: any) => r.status === 'Rejected').length;

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        totalCount,
        pendingCount,
        approvedCount,
        rejectedCount
      }
    });

  } catch (error: any) {
    console.error('GET /api/admin/reviews error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// PATCH: Update review moderation status in MongoDB
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Review ID is required' },
        { status: 400 }
      );
    }

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const now = new Date();

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { _id: id };
    }

    const result = await db.collection('review').updateOne(
      query,
      { $set: { status, updatedAt: now } }
    );

    if (result.matchedCount === 0) {
      // Try string ID search fallback
      await db.collection('review').updateOne(
        { id: id },
        { $set: { status, updatedAt: now } }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Review status updated to ${status} in MongoDB database!`
    });

  } catch (error: any) {
    console.error('PATCH /api/admin/reviews error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update review status' },
      { status: 500 }
    );
  }
}

// DELETE: Delete review from MongoDB database
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch (e) {
        // No body
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Review ID is required for deletion' },
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

    const result = await db.collection('review').deleteOne(query);

    if (result.deletedCount === 0) {
      await db.collection('review').deleteOne({ id: id });
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully from MongoDB database!'
    });

  } catch (error: any) {
    console.error('DELETE /api/admin/reviews error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}
