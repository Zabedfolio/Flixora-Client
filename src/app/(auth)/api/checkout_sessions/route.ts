import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../lib/stripe';
import { auth } from '../../lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  return handleCheckout(request);
}

export async function POST(request: NextRequest) {
  return handleCheckout(request);
}

async function handleCheckout(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    let planId = searchParams.get('planId') || 'premium';
    let fromPlanId = searchParams.get('fromPlanId') || '';
    let emailParam = searchParams.get('email') || undefined;
    let nameParam = searchParams.get('name') || undefined;
    let isJson = searchParams.get('format') === 'json' || request.headers.get('accept')?.includes('application/json');

    // Parse JSON body if POST
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        if (body.planId) planId = body.planId;
        if (body.fromPlanId) fromPlanId = body.fromPlanId;
        if (body.email) emailParam = body.email;
        if (body.name) nameParam = body.name;
        isJson = true;
      } catch (e) {
        // Ignore empty body
      }
    }

    const PLANS_MAP: Record<
      string,
      { name: string; price: number; description: string }
    > = {
      basic: {
        name: 'Flixora Basic Plan',
        price: 799,
        description:
          '720p (HD), 1 screen, No downloads, Ad-supported, 1 kids profile',
      },
      standard: {
        name: 'Flixora Standard Plan',
        price: 1199,
        description:
          '1080p (FHD), 2 screens, Standard downloads, Ad-free, 3 kids profiles',
      },
      premium: {
        name: 'Flixora Premium Plan',
        price: 1499,
        description:
          '4K + HDR, 4 screens, Unlimited downloads, Ad-free, Unlimited kids profiles',
      },
    };

    const PLAN_KEYS = ['basic', 'standard', 'premium'] as const;
    const planIdNorm = planId.toLowerCase();

    let resolvedKey: 'basic' | 'standard' | 'premium' = 'premium';
    if (PLAN_KEYS.includes(planIdNorm as any)) {
      resolvedKey = planIdNorm as 'basic' | 'standard' | 'premium';
    } else {
      const found = PLAN_KEYS.find(key => planIdNorm.includes(key));
      if (found) resolvedKey = found;
    }

    const plan = PLANS_MAP[resolvedKey];
    const origin = request.nextUrl.origin;

    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    const email = authSession?.user?.email || emailParam;
    const name = authSession?.user?.name || nameParam;

    let customerId: string | undefined = undefined;
    if (email) {
      const customers = await stripe.customers.list({
        email: email,
        limit: 1,
      });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        if (name && customers.data[0].name !== name) {
          await stripe.customers.update(customerId, { name });
        }
      } else {
        const newCustomer = await stripe.customers.create({
          email,
          name: name || undefined,
        });
        customerId = newCustomer.id;
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      ...(customerId ? { customer: customerId } : { customer_email: email }),
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&from=${encodeURIComponent(fromPlanId)}&to=${encodeURIComponent(resolvedKey)}`,
      cancel_url: `${origin}/cancel?error=Payment%20cancelled%20by%20user`,
    });

    if (!session.url) {
      if (isJson) {
        return NextResponse.json({ success: false, message: 'Failed to create Stripe session.' }, { status: 500 });
      }
      return NextResponse.redirect(`${origin}/cancel?error=Failed%20to%20create%20checkout%20session`);
    }

    if (isJson) {
      return NextResponse.json({ success: true, url: session.url });
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    const origin = request.nextUrl.origin;
    const errorMessage = err instanceof Error ? err.message : 'An error occurred during checkout';

    if (request.headers.get('accept')?.includes('application/json')) {
      return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
    return NextResponse.redirect(`${origin}/cancel?error=${encodeURIComponent(errorMessage)}`);
  }
}
