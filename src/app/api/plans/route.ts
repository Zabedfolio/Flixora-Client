import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

const DEFAULT_PLANS = [
  {
    slug: "basic",
    name: "Basic",
    price: "$7.99/mo",
    resolution: "720p (HD)",
    screens: "1 screen",
    downloads: "No downloads",
    ads: "Ad-supported",
    kids: "1 kids profile"
  },
  {
    slug: "standard",
    name: "Standard",
    price: "$11.99/mo",
    resolution: "1080p (FHD)",
    screens: "2 screens",
    downloads: "Standard downloads",
    ads: "Ad-free",
    kids: "3 kids profiles"
  },
  {
    slug: "premium",
    name: "Premium",
    price: "$14.99/mo",
    resolution: "4K + HDR",
    screens: "4 screens",
    downloads: "Unlimited downloads",
    ads: "Ad-free",
    kids: "Unlimited kids profiles"
  }
];

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // 1. Seed plans collection if empty
    const count = await db.collection('plans').countDocuments();
    if (count === 0) {
      await db.collection('plans').insertMany(DEFAULT_PLANS);
    }

    // 1b. Backfill slug for any existing plan docs that are missing it
    for (const defaultPlan of DEFAULT_PLANS) {
      await db.collection('plans').updateMany(
        { name: defaultPlan.name, slug: { $exists: false } },
        { $set: { slug: defaultPlan.slug } }
      );
    }

    // Retrieve plans from the database
    const plans = await db.collection('plans').find({}).toArray();

    // 2. Perform Migration for existing users (who signed up before role integration)
    // Seed default 'user' role for accounts missing the role field (does NOT touch plan details)
    await db.collection('user').updateMany(
      { 
        $or: [
          { role: { $exists: false } },
          { role: "" },
          { role: null }
        ]
      },
      { 
        $set: { 
          role: 'user',
          updatedAt: new Date()
        } 
      }
    );

    // Convert ObjectId to string for all plans
    const formattedPlans = plans.map((p: any) => ({
      ...p,
      _id: p._id.toString()
    }));

    return NextResponse.json({
      success: true,
      message: 'Plans fetched successfully',
      data: formattedPlans
    });
  } catch (error: any) {
    console.error('GET /api/plans error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch plans'
    }, { status: 500 });
  }
}
