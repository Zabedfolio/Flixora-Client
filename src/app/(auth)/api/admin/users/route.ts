import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId, Filter } from "mongodb";

interface UserDocument {
  _id: ObjectId;
  name?: string;
  email?: string;
  image?: string;
  avatar?: string;
  role?: string;
  plan?: string;
  planId?: string;
  status?: string;
  subscriptionExpiresAt?: string;
  promoAccess?: boolean;
  createdAt?: Date | string;
}

interface UpdateData {
  status?: string;
  role?: string;
  plan?: string;
  planId?: string;
  subscriptionExpiresAt?: string;
  promoAccess?: boolean;
  image?: string;
  avatar?: string;
}

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not configured");
}

const client = new MongoClient(mongoUri);
const db = client.db("Flixora");

const usersCollection =
  db.collection<UserDocument>("user");

const safeUser = (user: UserDocument) => ({
  id: user._id.toString(),
  name: user.name || "Unknown User",
  email: user.email || "",
  image: user.image || user.avatar || "",
  avatar: user.avatar || user.image || "",
  role: user.role || "user",
  plan: user.plan || "No Plan",
  planId: user.planId || "",
  status: user.status || "active",
  subscriptionExpiresAt:
    user.subscriptionExpiresAt || "",
  promoAccess: Boolean(user.promoAccess),
  createdAt: user.createdAt,
});

/* =====================================================
   GET USERS
===================================================== */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const plan =
      searchParams.get("plan") || "All";

    const status =
      searchParams.get("status") || "All";

    const page = Math.max(
      Number(searchParams.get("page") || "1"),
      1
    );

    const limit = 8;
    const skip = (page - 1) * limit;

    const query: Filter<UserDocument> = {};

    /* Search by name or email */
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /* Plan filter */
    if (plan === "No Plan") {
      const planConditions: Filter<UserDocument>[] = [
        { plan: "No Plan" },
        { plan: { $exists: false } },
        { plan: "" },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: planConditions }];
        delete query.$or;
      } else {
        query.$or = planConditions;
      }
    } else if (plan !== "All") {
      query.plan = plan;
    }

    /* Status filter */
    if (status === "Active") {
      const activeConditions: Filter<UserDocument>[] = [
        { status: "active" },
        { status: { $exists: false } },
        { status: "" },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: activeConditions }];
        delete query.$or;
      } else {
        query.$or = activeConditions;
      }
    } else if (status !== "All") {
      query.status = status.toLowerCase();
    }

    /* Global stats across database for KPI cards */
    const [users, total, activeCount, suspendedCount, bannedCount] = await Promise.all([
      usersCollection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),

      usersCollection.countDocuments(query),
      usersCollection.countDocuments({
        status: { $nin: ["suspended", "banned"] },
      }),
      usersCollection.countDocuments({
        status: "suspended",
      }),
      usersCollection.countDocuments({
        status: "banned",
      }),
    ]);

    return NextResponse.json({
      success: true,
      users: users.map(safeUser),
      total,
      activeCount,
      suspendedCount,
      bannedCount,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(
      "GET /api/admin/users error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load users",
      },
      { status: 500 }
    );
  }
}

/* =====================================================
   PATCH USER
===================================================== */

export async function PATCH(request: NextRequest) {
  try {
    const body: {
      userId?: string;
      action?: string;
      status?: string;
      role?: string;
      plan?: string;
      subscriptionExpiresAt?: string;
      promoAccess?: boolean;
    } = await request.json();

    const {
      userId,
      action,
      status,
      role,
      plan,
      subscriptionExpiresAt,
      promoAccess,
    } = body;

    /* Validate User ID */
    if (
      !userId ||
      !ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const updateData: UpdateData = {};

    /* =================================================
       STATUS
    ================================================= */

    switch (action) {
      case "status": {
        if (
          ![
            "active",
            "suspended",
            "banned",
          ].includes(status || "")
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid account status",
            },
            { status: 400 }
          );
        }

        updateData.status = status;

        break;
      }

      /* ===============================================
         ROLE
      =============================================== */

      case "role": {
        if (!role || typeof role !== "string" || !role.trim()) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid role",
            },
            { status: 400 }
          );
        }

        updateData.role = role.trim();

        break;
      }

      /* ===============================================
         PLAN
      =============================================== */

      case "plan": {
        if (
          ![
            "No Plan",
            "Basic",
            "Standard",
            "Premium",
          ].includes(plan || "")
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid plan",
            },
            { status: 400 }
          );
        }

        updateData.plan = plan;

        /* Remove subscription information */
        if (plan === "No Plan") {
          updateData.planId = "";
          updateData.subscriptionExpiresAt = "";
        }

        break;
      }

      /* ===============================================
         SUBSCRIPTION EXPIRY
      =============================================== */

      case "subscription": {
        if (!subscriptionExpiresAt) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Subscription expiry date is required",
            },
            { status: 400 }
          );
        }

        updateData.subscriptionExpiresAt =
          subscriptionExpiresAt;

        break;
      }

      /* ===============================================
         PROMO ACCESS
      =============================================== */

      case "promo": {
        updateData.promoAccess =
          Boolean(promoAccess);

        break;
      }

      /* ===============================================
         AVATAR / IMAGE
      =============================================== */

      case "image":
      case "avatar": {
        const imageUrl = (body as { image?: string; avatar?: string }).image || (body as { image?: string; avatar?: string }).avatar || "";
        updateData.image = imageUrl.trim();
        updateData.avatar = imageUrl.trim();

        break;
      }

      /* ===============================================
         INVALID ACTION
      =============================================== */

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid action",
          },
          { status: 400 }
        );
    }

    /* =================================================
       UPDATE USER
    ================================================= */

    const result =
      await usersCollection.updateOne(
        {
          _id: new ObjectId(userId),
        },
        {
          $set: updateData,
        }
      );

    /* User not found */
    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/users error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user",
      },
      { status: 500 }
    );
  }
}