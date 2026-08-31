import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

const DEFAULT_PLANS = [
  {
    name: "Basic",
    price: "$7.99/mo",
    resolution: "720p (HD)",
    screens: "1 screen",
    downloads: "No downloads",
    ads: "Ad-supported",
    kids: "1 kids profile"
  },
  {
    name: "Standard",
    price: "$11.99/mo",
    resolution: "1080p (FHD)",
    screens: "2 screens",
    downloads: "Standard downloads",
    ads: "Ad-free",
    kids: "3 kids profiles"
  },
  {
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

    // Retrieve plans from the database
    const plans = await db.collection('plans').find({}).toArray();

    // Find the Basic plan ID
    const basicPlan = plans.find((p: any) => p.name.toLowerCase() === 'basic');
    if (basicPlan) {
      const basicPlanId = basicPlan._id.toString();

      // 2. Perform Migration for existing users (who signed up before plans integration)
      // Update any user in the collection where planId or plan name is missing or empty string
      await db.collection('user').updateMany(
        { 
          $or: [
            { planId: { $exists: false } },
            { planId: "" },
            { planId: null },
            { plan: { $exists: false } },
            { plan: "" },
            { plan: null }
          ]
        },
        { 
          $set: { 
            planId: basicPlanId,
            plan: 'Basic',
            updatedAt: new Date()
          } 
        }
      );
    }

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
